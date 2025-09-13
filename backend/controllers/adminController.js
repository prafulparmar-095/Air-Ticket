// backend/controllers/adminController.js
const Booking = require('../models/Booking');
const Flight = require('../models/Flight');
const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getAdminStats = asyncHandler(async (req, res, next) => {
  try {
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
  } catch (error) {
    console.error('Error in getAdminStats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get analytics data
// @route   GET /api/admin/analytics
// @access  Private/Admin
exports.getAnalytics = asyncHandler(async (req, res, next) => {
  try {
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

    // Get top routes (simplified version)
    const topRoutes = await Booking.aggregate([
      { $match: { status: 'confirmed' } },
      { $group: { 
        _id: '$flight',
        bookings: { $sum: 1 }
      }},
      { $sort: { bookings: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'flights',
          localField: '_id',
          foreignField: '_id',
          as: 'flightData'
        }
      },
      { $unwind: '$flightData' }
    ]);

    // Get popular airlines (simplified version)
    const popularAirlines = await Booking.aggregate([
      { $match: { status: 'confirmed' } },
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
          change: 12
        },
        bookings: {
          total: totalBookings,
          change: 8
        },
        users: {
          total: totalUsers,
          change: 5
        },
        topRoutes: topRoutes.map(route => ({
          origin: route.flightData?.origin || 'Unknown',
          destination: route.flightData?.destination || 'Unknown',
          bookings: route.bookings
        })),
        popularAirlines: popularAirlines.map(airline => ({
          name: airline._id,
          bookings: airline.bookings
        }))
      }
    });
  } catch (error) {
    console.error('Error in getAnalytics:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get recent bookings
// @route   GET /api/admin/recent-bookings
// @access  Private/Admin
exports.getRecentBookings = asyncHandler(async (req, res, next) => {
  try {
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
  } catch (error) {
    console.error('Error in getRecentBookings:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get recent flights
// @route   GET /api/admin/recent-flights
// @access  Private/Admin
exports.getRecentFlights = asyncHandler(async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    
    const flights = await Flight.find()
      .sort('-createdAt')
      .limit(limit);

    res.status(200).json({
      success: true,
      count: flights.length,
      data: flights
    });
  } catch (error) {
    console.error('Error in getRecentFlights:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});