import crypto from 'crypto'
import PDFDocument from 'pdfkit'
import { fileTypeFromBuffer } from 'file-type'
import Review from '../models/Review.js'
import Thread from '../models/Thread.js'
import { streamReview } from '../services/aiService.js'

const languageFromName = (filename = '') => {
  const ext = filename.split('.').pop()?.toLowerCase()
  return ({ js: 'javascript', jsx: 'javascript', ts: 'typescript', tsx: 'typescript', py: 'python', go: 'go', java: 'java', cpp: 'cpp', cc: 'cpp' })[ext] || 'javascript'
}

export const createReview = async (req, res) => {
  try {
    let { code, language, filename, depth, focusAreas, source, prUrl } = req.body
    if (req.file) {
      const type = await fileTypeFromBuffer(req.file.buffer).catch(() => null)
      code = req.file.buffer.toString('utf8')
      filename = req.file.originalname
      language = languageFromName(filename)
      source = 'upload'
      if (type?.mime && !type.mime.startsWith('text/')) return res.status(400).json({ error: 'Unsupported file type' })
    }
    if (source === 'github' && !code) code = `// GitHub PR review requested\n// ${prUrl || 'No PR URL provided'}`
    if (!code || !filename) return res.status(400).json({ error: 'Code and filename are required' })

    const review = await Review.create({
      userId: req.user._id,
      filename,
      language: language || languageFromName(filename),
      code: String(code).slice(0, 200000),
      status: 'pending',
      depth: depth || 'standard',
      focusAreas: Array.isArray(focusAreas) ? focusAreas : String(focusAreas || '').split(',').filter(Boolean),
      source: source || 'paste',
      publicSlug: crypto.randomBytes(10).toString('hex'),
    })
    res.status(201).json({ reviewId: review._id })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const listReviews = async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1)
    const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100)
    const [reviews, total] = await Promise.all([
      Review.find({ userId: req.user._id }).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      Review.countDocuments({ userId: req.user._id }),
    ])
    res.json({ reviews, total, page, limit })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const getReview = async (req, res) => {
  try {
    const review = await Review.findOne({ _id: req.params.id, userId: req.user._id })
    if (!review) return res.status(404).json({ error: 'Review not found' })
    const threads = await Thread.find({ reviewId: review._id, userId: req.user._id }).sort({ line: 1 })
    res.json({ ...review.toObject(), threads })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findOneAndDelete({ _id: req.params.id, userId: req.user._id })
    if (!review) return res.status(404).json({ error: 'Review not found' })
    await Thread.deleteMany({ reviewId: review._id, userId: req.user._id })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const streamReviewRoute = async (req, res) => {
  let closed = false
  try {
    const review = await Review.findOne({ _id: req.params.id, userId: req.user._id })
    if (!review) return res.status(404).json({ error: 'Review not found' })
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')
    res.on('close', () => { closed = true })
    review.status = 'processing'
    await review.save()
    const result = await streamReview(review.code, review.language, { depth: review.depth, focusAreas: review.focusAreas }, res)
    if (closed) return
    await Review.updateOne({ _id: review._id, userId: req.user._id }, { status: 'complete', ...result })
    req.app.get('io')?.to(`user:${req.user._id}`).emit('review:complete', { reviewId: review._id, score: result.score })
  } catch (err) {
    if (!closed) {
      res.write(`data: ${JSON.stringify({ type: 'error', error: err.message })}\n\n`)
      res.end()
    }
    await Review.updateOne({ _id: req.params.id, userId: req.user?._id }, { status: 'error' }).catch(() => {})
  }
}

export const exportReview = async (req, res) => {
  try {
    const review = await Review.findOne({ _id: req.params.id, userId: req.user._id })
    if (!review) return res.status(404).json({ error: 'Review not found' })
    const doc = new PDFDocument({ margin: 48 })
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="${review.filename}-review.pdf"`)
    doc.pipe(res)
    doc.fontSize(22).text('CodeReview AI Report')
    doc.moveDown().fontSize(14).text(`${review.filename} (${review.language})`)
    doc.text(`Score: ${review.score || 0} / Grade: ${review.grade || 'N/A'}`)
    doc.moveDown().fontSize(12).text(review.summary || 'No summary available.')
    ;(review.comments || []).forEach((comment) => {
      doc.moveDown().fontSize(12).text(`${comment.severity.toUpperCase()} line ${comment.line}: ${comment.title}`)
      doc.fontSize(10).text(comment.explanation)
      if (comment.fix) doc.font('Courier').text(comment.fix).font('Helvetica')
    })
    doc.end()
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
