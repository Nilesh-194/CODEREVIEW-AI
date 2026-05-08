import Review from '../models/Review.js'
import Thread from '../models/Thread.js'

const assertReview = async (reviewId, userId) => {
  const review = await Review.findOne({ _id: reviewId, userId })
  if (!review) throw new Error('Review not found')
  return review
}

export const createThread = async (req, res) => {
  try {
    await assertReview(req.params.id, req.user._id)
    const thread = await Thread.create({
      reviewId: req.params.id,
      userId: req.user._id,
      line: req.body.line,
      messages: [{
        senderId: req.user._id,
        senderName: req.user.username,
        senderAvatar: req.user.avatarUrl,
        content: req.body.message,
      }],
    })
    req.app.get('io')?.to(`user:${req.user._id}`).emit('thread:reply', { threadId: thread._id, message: thread.messages[0] })
    res.status(201).json(thread)
  } catch (err) {
    res.status(err.message === 'Review not found' ? 404 : 500).json({ error: err.message })
  }
}

export const listThreads = async (req, res) => {
  try {
    await assertReview(req.params.id, req.user._id)
    const threads = await Thread.find({ reviewId: req.params.id, userId: req.user._id }).sort({ line: 1 })
    res.json(threads)
  } catch (err) {
    res.status(err.message === 'Review not found' ? 404 : 500).json({ error: err.message })
  }
}

export const addReply = async (req, res) => {
  try {
    await assertReview(req.params.id, req.user._id)
    const message = {
      senderId: req.user._id,
      senderName: req.user.username,
      senderAvatar: req.user.avatarUrl,
      content: req.body.message,
      createdAt: new Date(),
    }
    const thread = await Thread.findOneAndUpdate(
      { _id: req.params.tid, reviewId: req.params.id, userId: req.user._id },
      { $push: { messages: message } },
      { new: true },
    )
    if (!thread) return res.status(404).json({ error: 'Thread not found' })
    req.app.get('io')?.to(`user:${req.user._id}`).emit('thread:reply', { threadId: thread._id, message })
    res.json(thread)
  } catch (err) {
    res.status(err.message === 'Review not found' ? 404 : 500).json({ error: err.message })
  }
}
