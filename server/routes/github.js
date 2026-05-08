import express from 'express'
import { approvePr, getPr, listPrs, listRepos, webhook } from '../controllers/githubController.js'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

router.post('/webhook', webhook)
router.use(authenticate)
router.get('/repos', listRepos)
router.get('/repos/:owner/:repo/prs', listPrs)
router.get('/prs/:prId', getPr)
router.post('/prs/:prId/approve', approvePr)

export default router
