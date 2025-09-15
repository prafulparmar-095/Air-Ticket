import express from 'express'
import {
  getDashboardStats,
  getFinancialReports,
  getBookingAnalytics,
  getUserAnalytics
} from '../controllers/adminController.js'
import { authenticate, authorize } from '../middleware/auth.js'

const router = express.Router()

router.use(authenticate)
router.use(authorize('admin'))

router.get('/stats', getDashboardStats)
router.get('/reports/financial', getFinancialReports)
router.get('/analytics/bookings', getBookingAnalytics)
router.get('/analytics/users', getUserAnalytics)

export default router