export const demoCode = `import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const SECRET = 'my_secret_key_123'

export const authenticate = async (req, res, next) => {
  const token = req.cookies.access_token
  if (!token) res.status(401).json({ error: 'No token' })
  const decoded = jwt.verify(token, SECRET)
  const user = await User.findById(decoded.id)
  req.user = user
  next()
}

export const optionalAuth = (req, res, next) => {
  next()
}`

export const demoReview = {
  _id: 'demo',
  filename: 'auth.js',
  language: 'javascript',
  code: demoCode,
  status: 'complete',
  score: 74,
  grade: 'B',
  summary: 'The middleware is compact and readable, but it contains a critical hardcoded secret and missing control-flow guards. Fixing auth failure paths should be the first priority.',
  stats: { errors: 1, warnings: 2, info: 1, good: 1 },
  comments: [
    { _id: 'c1', line: 4, severity: 'error', title: 'Hardcoded JWT secret', explanation: 'Hardcoded JWT secrets are critical vulnerabilities because anyone with source access can forge valid tokens.', fix: 'const SECRET = process.env.JWT_SECRET' },
    { _id: 'c2', line: 8, severity: 'warning', title: 'Missing return', explanation: 'The response is sent, but execution continues and may still verify an absent token.', fix: "if (!token) return res.status(401).json({ error: 'No token' })" },
    { _id: 'c3', line: 10, severity: 'warning', title: 'No user guard', explanation: 'A deleted user would set req.user to null and cause downstream authorization bugs.', fix: "if (!user) return res.status(401).json({ error: 'Invalid user' })" },
    { _id: 'c4', line: 7, severity: 'info', title: 'Cookie dependency', explanation: 'This middleware assumes cookie auth. Document that API clients must send credentials.', fix: null },
    { _id: 'c5', line: 14, severity: 'good', title: 'Clean exports', explanation: 'Named exports keep middleware composition simple and testable.', fix: null },
  ],
}

export const demoReviews = [
  demoReview,
  { ...demoReview, _id: 'demo2', filename: 'payment.ts', language: 'typescript', status: 'processing', score: 0, stats: { errors: 0, warnings: 1, info: 0, good: 0 } },
  { ...demoReview, _id: 'demo3', filename: 'worker.py', language: 'python', status: 'pending', score: 0, stats: { errors: 0, warnings: 0, info: 0, good: 0 } },
]
