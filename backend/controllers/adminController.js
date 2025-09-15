import User from '../models/User.js'
import Flight from '../models/Flight.js'
import Booking from '../models/Booking.js'
import Payment from '../models/Payment.js'

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
  try {
    // Total counts
    const totalUsers = await User.countDocuments()
    const totalFlights = await Flight.countDocuments()
    const totalBookings = await Booking.countDocuments()

    // Revenue calculation
    const revenueResult = await Booking.aggregate([
      { $match: { status: 'confirmed' } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
    ])
    const totalRevenue = revenueResult[0]?.totalRevenue || 0

    // Recent bookings
    const recentBookings = await Booking.find()
      .populate('flight', 'origin destination airline')
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5)

    // Popular routes
    const popularRoutes = await Booking.aggregate([
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
      {
        $group: {
          _id: {
            origin: '$flightData.origin',
            destination: '$flightData.destination'
          },
          count: { $sum: 1 },
          totalRevenue: { $sum: '$totalAmount' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ])

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalFlights,
        totalBookings,
        totalRevenue,
        recentBookings,
        popularRoutes
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching dashboard stats',
      error: error.message
    })
  }
}

// @desc    Get financial reports
// @route   GET /api/admin/reports/financial
// @access  Private/Admin
export const getFinancialReports = async (req, res) => {
  try {
    const { startDate, endDate, groupBy = 'month' } = req.query

    const matchStage = {}
    if (startDate && endDate) {
      matchStage.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }

    let groupFormat
    switch (groupBy) {
      case 'day':
        groupFormat = { year: { $year: '$createdAt' }, month: { $month: '$createdAt' }, day: { $dayOfMonth: '$createdAt' } }
        break
      case 'week':
        groupFormat = { year: { $year: '$createdAt' }, week: { $week: '$createdAt' } }
        break
      case 'month':
      default:
        groupFormat = { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }
    }

    const financialReport = await Booking.aggregate([
      { $match: { ...matchStage, status: 'confirmed' } },
      {
        $group: {
          _id: groupFormat,
          totalBookings: { $sum: 1 },
          totalRevenue: { $sum: '$totalAmount' },
          averageBookingValue: { $avg: '$totalAmount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1, '_id.week': 1 } }
    ])

    res.json({
      success: true,
      report: financialReport
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error generating financial report',
      error: error.message
    })
  }
}

// @desc    Get booking analytics
// @route   GET /api/admin/analytics/bookings
// @access  Private/Admin
export const getBookingAnalytics = async (req, res) => {
  try {
    const { days = 30 } = req.query

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - parseInt(days))

    // Booking trends
    const bookingTrends = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ])

    // Status distribution
    const statusDistribution = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ])

    // Cabin class distribution
    const cabinClassDistribution = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$cabinClass',
          count: { $sum: 1 }
        }
      }
    ])

    res.json({
      success: true,
      analytics: {
        bookingTrends,
        statusDistribution,
        cabinClassDistribution
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching booking analytics',
      error: error.message
    })
  }
}

// @desc    Get user analytics
// @route   GET /api/admin/analytics/users
// @access  Private/Admin
export const getUserAnalytics = async (req, res) => {
  try {
    const { days = 365 } = req.query

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - parseInt(days))

    // User growth
    const userGrowth = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ])

    // User activity
    const userActivity = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$user',
          bookingCount: { $sum: 1 },
          totalSpent: { $sum: '$totalAmount' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      { $sort: { totalSpent: -1 } },
      { $limit: 10 }
    ])

    res.json({
      success: true,
      analytics: {
        userGrowth,
        topUsers: userActivity
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching user analytics',
      error: error.message
    })
  }
}