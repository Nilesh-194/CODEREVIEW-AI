import express from 'express'
import { authenticate } from '../middleware/auth.js'
import { addReply, createThread, listThreads } from '../controllers/threadController.js'

const router = express.Router()

router.use(authenticate)
router.post('/reviews/:id/threads', createThread)
router.get('/reviews/:id/threads', listThreads)
router.post('/reviews/:id/threads/:tid/reply', addReply)

export default router
