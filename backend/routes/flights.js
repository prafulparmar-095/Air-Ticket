const express = require('express');
const {
  getFlights,
  getFlight,
  createFlight,
  updateFlight,
  deleteFlight,
  getAvailableSeats
} = require('../controllers/flightController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

router.get('/', getFlights);
router.get('/:id', getFlight);
router.get('/:id/seats', getAvailableSeats);

router.post('/', protect, admin, createFlight);
router.put('/:id', protect, admin, updateFlight);
router.delete('/:id', protect, admin, deleteFlight);

module.exports = router;