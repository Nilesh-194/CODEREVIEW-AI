import express from 'express'
import passport from 'passport'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const router = express.Router()
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
}

const oauthConfigured = () => Boolean(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET && process.env.GITHUB_CALLBACK_URL)

const issueCookies = (res, userId) => {
  const accessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '15m' })
  const refreshToken = jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' })
  res.cookie('access_token', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 })
  res.cookie('refresh_token', refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 })
}

router.get('/github', (req, res, next) => {
  if (!oauthConfigured()) return res.status(503).json({ error: 'GitHub OAuth is not configured' })
  return passport.authenticate('github')(req, res, next)
})

router.get('/github/callback',
  (req, res, next) => {
    if (!oauthConfigured()) return res.redirect(`${process.env.FRONTEND_URL}/landing`)
    return passport.authenticate('github', { session: false, failureRedirect: '/landing' })(req, res, next)
  },
  (req, res) => {
    issueCookies(res, req.user._id)
    res.redirect(`${process.env.FRONTEND_URL}/`)
  },
)

router.post('/dev-login', async (req, res) => {
  try {
    if (process.env.NODE_ENV === 'production' || process.env.ENABLE_DEV_AUTH !== 'true') {
      return res.status(404).json({ error: 'Not found' })
    }
    const user = await User.findOneAndUpdate(
      { githubId: 'dev-user' },
      {
        githubId: 'dev-user',
        username: 'Nilesh-194',
        email: 'dev@example.com',
        avatarUrl: '',
      },
      { upsert: true, new: true },
    )
    issueCookies(res, user._id)
    res.json(user)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/refresh', (req, res) => {
  try {
    const token = req.cookies.refresh_token
    if (!token) return res.status(401).json({ error: 'No refresh token' })
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
    const accessToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, { expiresIn: '15m' })
    res.cookie('access_token', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 })
    res.json({ success: true })
  } catch (err) {
    res.status(401).json({ error: err.message })
  }
})

router.post('/logout', (req, res) => {
  res.clearCookie('access_token', cookieOptions)
  res.clearCookie('refresh_token', cookieOptions)
  res.json({ success: true })
})

export default router
