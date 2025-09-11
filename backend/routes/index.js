const express = require('express');
const router = express.Router();

// Import route files
const authRoutes = require('./auth');
const flightRoutes = require('./flights');
const bookingRoutes = require('./bookings');
const paymentRoutes = require('./payments');
const userRoutes = require('./users');

// Use routes
router.use('/auth', authRoutes);
router.use('/flights', flightRoutes);
router.use('/bookings', bookingRoutes);
router.use('/payments', paymentRoutes);
router.use('/users', userRoutes);

module.exports = router;