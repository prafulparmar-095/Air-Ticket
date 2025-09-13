// backend/routes/admin.js
const express = require('express');
const {
  getAdminStats,
  getAnalytics,
  getRecentBookings,
  getRecentFlights
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getAdminStats);
router.get('/analytics', getAnalytics);
router.get('/recent-bookings', getRecentBookings);
router.get('/recent-flights', getRecentFlights);

module.exports = router;