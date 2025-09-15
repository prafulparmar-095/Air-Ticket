import express from 'express'
import {
  searchFlights,
  getFlights,
  getFlight,
  createFlight,
  updateFlight,
  deleteFlight
} from '../controllers/flightController.js'
import { authenticate, authorize } from '../middleware/auth.js'
import { validateFlightSearch, handleValidationErrors } from '../middleware/validation.js'

const router = express.Router()

router.get('/search', validateFlightSearch, handleValidationErrors, searchFlights)
router.get('/', getFlights)
router.get('/:id', getFlight)

// Admin routes
router.post('/', authenticate, authorize('admin'), createFlight)
router.put('/:id', authenticate, authorize('admin'), updateFlight)
router.delete('/:id', authenticate, authorize('admin'), deleteFlight)

export default router