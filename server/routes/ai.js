import express from 'express'
import Review from '../models/Review.js'
import { authenticate } from '../middleware/auth.js'
import { aiAskLimiter } from '../middleware/rateLimit.js'
import { streamAsk } from '../services/aiService.js'

const router = express.Router()

router.post('/ask', authenticate, aiAskLimiter, async (req, res) => {
  try {
    const review = await Review.findOne({ _id: req.body.reviewId, userId: req.user._id })
    if (!review) return res.status(404).json({ error: 'Review not found' })
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.on('close', () => {})
    await streamAsk({ question: req.body.question, review }, res)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
