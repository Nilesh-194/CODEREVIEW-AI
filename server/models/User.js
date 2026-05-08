import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  githubId: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  email: String,
  avatarUrl: String,
  githubAccessToken: { type: String, select: false },
  refreshToken: { type: String, select: false },
  apiKeys: [{ key: String, createdAt: Date, label: String }],
  settings: {
    aiModel: { type: String, default: 'llama-3.3-70b-versatile' },
    autoReview: { type: Boolean, default: true },
    inlineFixes: { type: Boolean, default: true },
    securityScan: { type: Boolean, default: true },
    streaming: { type: Boolean, default: false },
    defaultDepth: { type: String, default: 'standard' },
  },
}, { timestamps: true })

export default mongoose.model('User', userSchema)
