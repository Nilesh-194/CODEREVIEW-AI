import express from 'express'
import multer from 'multer'
import { authenticate } from '../middleware/auth.js'
import { reviewLimiter } from '../middleware/rateLimit.js'
import { createReview, deleteReview, exportReview, getReview, listReviews, streamReviewRoute } from '../controllers/reviewController.js'

const router = express.Router()
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 1024 * 1024 } })

router.use(authenticate)
router.post('/', reviewLimiter, upload.single('file'), createReview)
router.get('/', listReviews)
router.get('/:id', getReview)
router.delete('/:id', deleteReview)
router.get('/:id/stream', streamReviewRoute)
router.get('/:id/export', exportReview)

export default router
