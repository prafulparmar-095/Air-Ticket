import express from 'express'
import {
  createPaymentIntent,
  confirmPayment,
  getPaymentHistory,
  processRefund
} from '../controllers/paymentController.js'
import { authenticate, authorize } from '../middleware/auth.js'

const router = express.Router()

router.use(authenticate)

router.post('/create-intent', createPaymentIntent)
router.post('/confirm', confirmPayment)
router.get('/history', getPaymentHistory)
router.post('/refund', authorize('admin'), processRefund)

export default router