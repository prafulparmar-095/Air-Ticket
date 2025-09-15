import User from '../models/User.js'
import Booking from '../models/Booking.js'

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      role
    } = req.query

    const query = {}
    if (role) query.role = role
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ]
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
      select: '-password'
    }

    const users = await User.find(query)
      .sort(options.sort)
      .limit(options.limit)
      .skip((options.page - 1) * options.limit)
      .select(options.select)

    // Get booking counts for each user
    const usersWithBookings = await Promise.all(
      users.map(async (user) => {
        const bookingsCount = await Booking.countDocuments({ user: user._id })
        return {
          ...user.toObject(),
          bookingsCount
        }
      })
    )

    const total = await User.countDocuments(query)

    res.json({
      success: true,
      count: users.length,
      total,
      page: options.page,
      pages: Math.ceil(total / options.limit),
      users: usersWithBookings
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching users',
      error: error.message
    })
  }
}

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password')
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Get user bookings
    const bookings = await Booking.find({ user: user._id })
      .populate('flight')
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      user: {
        ...user.toObject(),
        bookings
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching user',
      error: error.message
    })
  }
}

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
export const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password')

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    res.json({
      success: true,
      message: 'User updated successfully',
      user
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error updating user',
      error: error.message
    })
  }
}

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Delete user's bookings
    await Booking.deleteMany({ user: req.params.id })

    res.json({
      success: true,
      message: 'User deleted successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error deleting user',
      error: error.message
    })
  }
}

// @desc    Get user dashboard stats
// @route   GET /api/users/stats
// @access  Private
export const getUserStats = async (req, res) => {
  try {
    const userId = req.user.id

    const totalBookings = await Booking.countDocuments({ user: userId })
    const confirmedBookings = await Booking.countDocuments({ 
      user: userId, 
      status: 'confirmed' 
    })
    const cancelledBookings = await Booking.countDocuments({ 
      user: userId, 
      status: 'cancelled' 
    })

    // Calculate total spending
    const spendingResult = await Booking.aggregate([
      { $match: { user: mongoose.Types.ObjectId(userId), status: 'confirmed' } },
      { $group: { _id: null, totalSpent: { $sum: '$totalAmount' } } }
    ])

    const totalSpent = spendingResult[0]?.totalSpent || 0

    res.json({
      success: true,
      stats: {
        totalBookings,
        confirmedBookings,
        cancelledBookings,
        totalSpent
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching user stats',
      error: error.message
    })
  }
}