// backend/routes/flights.js
const express = require('express');
const {
  getFlights,
  getFlight,
  createFlight,
  updateFlight,
  deleteFlight,
  searchFlights,
  getAvailableSeats
} = require('../controllers/flightController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(getFlights)
  .post(protect, authorize('admin'), createFlight);

router.route('/:id')
  .get(getFlight)
  .put(protect, authorize('admin'), updateFlight)
  .delete(protect, authorize('admin'), deleteFlight);

router.route('/search')
  .post(searchFlights);

router.route('/:id/seats')
  .get(getAvailableSeats);

module.exports = router;