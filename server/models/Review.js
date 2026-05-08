import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema({
  line: Number,
  severity: { type: String, enum: ['error', 'warning', 'info', 'good'] },
  title: String,
  explanation: String,
  fix: String,
}, { _id: true })

const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  filename: { type: String, required: true },
  language: { type: String, required: true },
  code: { type: String, required: true },
  status: { type: String, enum: ['pending', 'processing', 'complete', 'error'], default: 'pending' },
  score: Number,
  grade: String,
  summary: String,
  stats: { errors: Number, warnings: Number, info: Number, good: Number },
  comments: [commentSchema],
  depth: { type: String, default: 'standard' },
  focusAreas: [String],
  source: { type: String, enum: ['paste', 'upload', 'github'], default: 'paste' },
  prId: String,
  isPublic: { type: Boolean, default: false },
  publicSlug: String,
}, { timestamps: true })

reviewSchema.index({ userId: 1, createdAt: -1 })

export default mongoose.model('Review', reviewSchema)
