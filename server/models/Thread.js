import mongoose from 'mongoose'

const threadSchema = new mongoose.Schema({
  reviewId: { type: mongoose.Schema.Types.ObjectId, ref: 'Review', required: true, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  line: { type: Number, required: true },
  messages: [{
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    senderName: String,
    senderAvatar: String,
    isAI: { type: Boolean, default: false },
    content: String,
    createdAt: { type: Date, default: Date.now },
  }],
}, { timestamps: true })

export default mongoose.model('Thread', threadSchema)
