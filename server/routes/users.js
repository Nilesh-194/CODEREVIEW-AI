import crypto from 'crypto'
import express from 'express'
import { authenticate } from '../middleware/auth.js'
import Review from '../models/Review.js'
import User from '../models/User.js'

const router = express.Router()

router.use(authenticate)

router.get('/me', (req, res) => {
  res.json(req.user)
})

router.patch('/settings', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, { $set: { settings: { ...req.user.settings.toObject(), ...req.body } } }, { new: true })
    res.json(user)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/api-keys', async (req, res) => {
  try {
    const apiKey = { key: `cra_${crypto.randomBytes(24).toString('hex')}`, label: req.body.label || 'Default key', createdAt: new Date() }
    const user = await User.findByIdAndUpdate(req.user._id, { $push: { apiKeys: apiKey } }, { new: true })
    res.status(201).json(user.apiKeys)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.delete('/api-keys/:key', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, { $pull: { apiKeys: { key: req.params.key } } }, { new: true })
    res.json(user.apiKeys)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.delete('/reviews', async (req, res) => {
  try {
    await Review.deleteMany({ userId: req.user._id })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.delete('/account', async (req, res) => {
  try {
    await Review.deleteMany({ userId: req.user._id })
    await User.deleteOne({ _id: req.user._id })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
