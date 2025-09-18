const express = require('express');
const {
  getBookings,
  getBooking,
  createBooking,
  updateBooking,
  cancelBooking,
  getBookingByReference
} = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');
const { bookingValidation } = require('../middleware/validation');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

// Protect all routes
router.use(protect);

// GET /api/bookings - Get user's bookings
router.get('/', asyncHandler(getBookings));

// GET /api/bookings/:id - Get single booking
router.get('/:id', asyncHandler(getBooking));

// GET /api/bookings/reference/:reference - Get booking by reference number
router.get('/reference/:reference', asyncHandler(getBookingByReference));

// POST /api/bookings - Create new booking
router.post('/', bookingValidation, asyncHandler(createBooking));

// PUT /api/bookings/:id - Update booking
router.put('/:id', asyncHandler(updateBooking));

// PUT /api/bookings/:id/cancel - Cancel booking
router.put('/:id/cancel', asyncHandler(cancelBooking));

module.exports = router;