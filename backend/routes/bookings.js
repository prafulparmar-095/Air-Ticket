const express = require('express');
const { body, validationResult } = require('express-validator');
const Booking = require('../models/Booking');
const Flight = require('../models/Flight');

const router = express.Router();

// Get user bookings
router.get('/', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }
    
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const bookings = await Booking.find({ user: decoded.user.id })
      .populate('flight')
      .sort({ bookingDate: -1 });
    
    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Create booking
router.post('/', [
  body('flightId').not().isEmpty().withMessage('Flight ID is required'),
  body('passengers').isArray({ min: 1 }).withMessage('At least one passenger is required'),
  body('passengers.*.name').not().isEmpty().withMessage('Passenger name is required'),
  body('passengers.*.age').isInt({ min: 1, max: 120 }).withMessage('Valid age is required'),
  body('passengers.*.gender').isIn(['male', 'female', 'other']).withMessage('Valid gender is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }
    
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const { flightId, passengers } = req.body;
    
    // Check if flight exists
    const flight = await Flight.findById(flightId);
    if (!flight) {
      return res.status(404).json({ message: 'Flight not found' });
    }
    
    // Check if there are enough seats
    if (flight.seats < passengers.length) {
      return res.status(400).json({ message: 'Not enough seats available' });
    }
    
    // Create booking
    const booking = new Booking({
      user: decoded.user.id,
      flight: flightId,
      passengers,
      totalPrice: flight.price * passengers.length
    });
    
    await booking.save();
    
    // Update available seats
    flight.seats -= passengers.length;
    await flight.save();
    
    await booking.populate('flight');
    res.json(booking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;