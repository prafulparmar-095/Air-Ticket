// backend/routes/index.js
const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth');
const flightRoutes = require('./flights');
const bookingRoutes = require('./bookings');
const userRoutes = require('./users');
const adminRoutes = require('./admin');

// Use routes
router.use('/auth', authRoutes);
router.use('/flights', flightRoutes);
router.use('/bookings', bookingRoutes);
router.use('/users', userRoutes);
router.use('/admin', adminRoutes);

module.exports = router;