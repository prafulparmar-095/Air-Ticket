// backend/controllers/adminController.js
const Booking = require('../models/Booking');
const Flight = require('../models/Flight');
const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getAdminStats = asyncHandler(async (req, res, next) => {
  const totalBookings = await Booking.countDocuments();
  
  const totalRevenueResult = await Booking.aggregate([
    { $match: { status: 'confirmed' } },
    { $group: { _id: null, total: { $sum: '$fareDetails.totalAmount' } } }
  ]);
  
  const totalRevenue = totalRevenueResult[0]?.total || 0;
  
  const activeFlights = await Flight.countDocuments({ 
    departureTime: { $gte: new Date() } 
  });
  
  const registeredUsers = await User.countDocuments();

  res.status(200).json({
    success: true,
    data: {
      totalBookings,
      totalRevenue,
      activeFlights,
      registeredUsers
    }
  });
});

// @desc    Get analytics data
// @route   GET /api/admin/analytics
// @access  Private/Admin
exports.getAnalytics = asyncHandler(async (req, res, next) => {
  // Calculate revenue
  const revenueResult = await Booking.aggregate([
    { $match: { status: 'confirmed' } },
    { $group: { _id: null, total: { $sum: '$fareDetails.totalAmount' } } }
  ]);
  
  const totalRevenue = revenueResult[0]?.total || 0;

  // Get total bookings
  const totalBookings = await Booking.countDocuments({ status: 'confirmed' });

  // Get total users
  const totalUsers = await User.countDocuments();

  // Get top routes
  const topRoutes = await Booking.aggregate([
    { 
      $lookup: {
        from: 'flights',
        localField: 'flight',
        foreignField: '_id',
        as: 'flightData'
      }
    },
    { $unwind: '$flightData' },
    { $group: { 
      _id: {
        origin: '$flightData.origin',
        destination: '$flightData.destination'
      },
      bookings: { $sum: 1 }
    }},
    { $sort: { bookings: -1 } },
    { $limit: 5 }
  ]);

  // Get popular airlines
  const popularAirlines = await Booking.aggregate([
    { 
      $lookup: {
        from: 'flights',
        localField: 'flight',
        foreignField: '_id',
        as: 'flightData'
      }
    },
    { $unwind: '$flightData' },
    { $group: { 
      _id: '$flightData.airline',
      bookings: { $sum: 1 }
    }},
    { $sort: { bookings: -1 } },
    { $limit: 5 }
  ]);

  res.status(200).json({
    success: true,
    data: {
      revenue: {
        total: totalRevenue,
        change: 12 // Simplified percentage change
      },
      bookings: {
        total: totalBookings,
        change: 8 // Simplified percentage change
      },
      users: {
        total: totalUsers,
        change: 5 // Simplified percentage change
      },
      topRoutes: topRoutes.map(route => ({
        origin: route._id.origin,
        destination: route._id.destination,
        bookings: route.bookings
      })),
      popularAirlines: popularAirlines.map(airline => ({
        name: airline._id,
        bookings: airline.bookings
      }))
    }
  });
});

// @desc    Get recent bookings
// @route   GET /api/admin/recent-bookings
// @access  Private/Admin
exports.getRecentBookings = asyncHandler(async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 5;
  
  const bookings = await Booking.find()
    .populate('flight', 'number origin destination departureTime')
    .populate('user', 'name email')
    .sort('-createdAt')
    .limit(limit);

  res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings
  });
});

// @desc    Get recent flights
// @route   GET /api/admin/recent-flights
// @access  Private/Admin
exports.getRecentFlights = asyncHandler(async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 5;
  
  const flights = await Flight.find()
    .sort('-createdAt')
    .limit(limit);

  res.status(200).json({
    success: true,
    count: flights.length,
    data: flights
  });
});