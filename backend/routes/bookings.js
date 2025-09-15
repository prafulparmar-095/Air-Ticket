import express from 'express'
import {
  createBooking,
  getUserBookings,
  getBooking,
  cancelBooking,
  getAllBookings
} from '../controllers/bookingController.js'
import { authenticate, authorize } from '../middleware/auth.js'
import { validateBooking, handleValidationErrors } from '../middleware/validation.js'

const router = express.Router()

router.use(authenticate)

router.post('/', validateBooking, handleValidationErrors, createBooking)
router.get('/my-bookings', getUserBookings)
router.get('/:id', getBooking)
router.put('/:id/cancel', cancelBooking)

// Admin routes
router.get('/', authorize('admin'), getAllBookings)

export default router