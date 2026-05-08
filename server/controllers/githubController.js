import crypto from 'crypto'
import User from '../models/User.js'
import { githubFetch, parsePrId } from '../services/githubService.js'

const getToken = async (userId) => {
  const user = await User.findById(userId).select('+githubAccessToken')
  if (!user?.githubAccessToken) throw new Error('GitHub is not connected')
  return user.githubAccessToken
}

export const listRepos = async (req, res) => {
  try {
    const token = await getToken(req.user._id)
    const repos = await githubFetch(token, '/user/repos?per_page=100&sort=updated')
    res.json(repos)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const listPrs = async (req, res) => {
  try {
    const token = await getToken(req.user._id)
    const prs = await githubFetch(token, `/repos/${req.params.owner}/${req.params.repo}/pulls?state=open`)
    res.json(prs)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const getPr = async (req, res) => {
  try {
    const token = await getToken(req.user._id)
    const { owner, repo, number } = parsePrId(req.params.prId)
    const pr = await githubFetch(token, `/repos/${owner}/${repo}/pulls/${number}`)
    const files = await githubFetch(token, `/repos/${owner}/${repo}/pulls/${number}/files`)
    res.json({ pr, files })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const approvePr = async (req, res) => {
  try {
    const token = await getToken(req.user._id)
    const { owner, repo, number } = parsePrId(req.params.prId)
    const approval = await githubFetch(token, `/repos/${owner}/${repo}/pulls/${number}/reviews`, {
      method: 'POST',
      body: JSON.stringify({ event: 'APPROVE', body: 'Approved by CodeReview AI.' }),
    })
    res.json(approval)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const webhook = async (req, res) => {
  try {
    const signature = req.get('x-hub-signature-256') || ''
    const secret = process.env.GITHUB_WEBHOOK_SECRET || ''
    const body = req.rawBody || Buffer.from(JSON.stringify(req.body))
    const expected = `sha256=${crypto.createHmac('sha256', secret).update(body).digest('hex')}`
    const safe = signature.length === expected.length && crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
    if (!safe) return res.status(401).json({ error: 'Invalid signature' })
    res.json({ received: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
