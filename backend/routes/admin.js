const express = require('express');
const {
  getDashboardStats,
  getUsers,
  updateUserRole,
  getBookings,
  updateBookingStatus
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(admin);

router.get('/dashboard/stats', getDashboardStats);
router.get('/users', getUsers);
router.put('/users/:userId/role', updateUserRole);
router.get('/bookings', getBookings);
router.put('/bookings/:bookingId/status', updateBookingStatus);

module.exports = router;