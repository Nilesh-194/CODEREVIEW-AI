import 'dotenv/config'
import http from 'http'
import express from 'express'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import helmet from 'helmet'
import passport from 'passport'
import { Server } from 'socket.io'
import { configurePassport } from './config/passport.js'
import authRoutes from './routes/auth.js'
import reviewRoutes from './routes/reviews.js'
import threadRoutes from './routes/threads.js'
import githubRoutes from './routes/github.js'
import aiRoutes from './routes/ai.js'
import userRoutes from './routes/users.js'
import { errorHandler } from './middleware/errorHandler.js'

const app = express()
const server = http.createServer(app)
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
const allowedOrigins = new Set([
  frontendUrl,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
])
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.has(origin)) return callback(null, true)
    return callback(new Error(`CORS blocked origin: ${origin}`))
  },
  credentials: true,
}
const io = new Server(server, {
  cors: {
    origin: [...allowedOrigins],
    credentials: true,
  },
})

app.set('io', io)
configurePassport()

app.use(helmet())
app.use(cors(corsOptions))
app.use(express.json({
  limit: '1mb',
  verify: (req, res, buf) => {
    req.rawBody = buf
  },
}))
app.use(cookieParser())
app.use(passport.initialize())

app.get('/health', (req, res) => res.json({ ok: true }))
app.use('/auth', authRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api', threadRoutes)
app.use('/api/github', githubRoutes)
app.use('/api/ai', aiRoutes)
app.use('/api/users', userRoutes)
app.use(errorHandler)

io.on('connection', (socket) => {
  const userId = socket.handshake.auth.userId
  if (userId) socket.join(`user:${userId}`)
  socket.on('disconnect', () => {
    if (userId) socket.leave(`user:${userId}`)
  })
})

const start = async () => {
  await mongoose.connect(process.env.MONGODB_URI)
  server.listen(process.env.PORT || 5000)
}

start().catch((err) => {
  process.stderr.write(`${err.message}\n`)
  process.exit(1)
})
