import Booking from '../models/Booking.js'
import Flight from '../models/Flight.js'
import User from '../models/User.js'

// @desc    Create booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (req, res) => {
  try {
    const { flightId, passengers, contactInfo, cabinClass } = req.body

    // Check if flight exists
    const flight = await Flight.findById(flightId)
    if (!flight) {
      return res.status(404).json({
        success: false,
        message: 'Flight not found'
      })
    }

    // Check seat availability
    const totalPassengers = passengers.length
    if (!flight.hasAvailableSeats(cabinClass, totalPassengers)) {
      return res.status(400).json({
        success: false,
        message: 'Not enough available seats'
      })
    }

    // Calculate total amount
    const basePrice = flight.price
    let totalAmount = 0

    passengers.forEach(passenger => {
      let passengerPrice = basePrice
      
      switch (passenger.type) {
        case 'child':
          passengerPrice *= 0.5 // 50% for children
          break
        case 'infant':
          passengerPrice *= 0.1 // 10% for infants
          break
        // adult pays full price
      }
      
      totalAmount += passengerPrice
    })

    // Apply cabin class multiplier
    const cabinMultipliers = {
      economy: 1,
      premium_economy: 1.5,
      business: 2.5,
      first: 4
    }
    totalAmount *= cabinMultipliers[cabinClass]

    // Add taxes and fees (15%)
    totalAmount *= 1.15

    // Create booking
    const booking = await Booking.create({
      user: req.user.id,
      flight: flightId,
      passengers,
      contactInfo,
      cabinClass,
      totalAmount: Math.round(totalAmount)
    })

    // Update available seats
    await flight.updateAvailableSeats(cabinClass, -totalPassengers)

    // Populate booking details
    await booking.populate('flight')
    await booking.populate('user', 'name email phone')

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error creating booking',
      error: error.message
    })
  }
}

// @desc    Get user bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('flight')
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      count: bookings.length,
      bookings
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching bookings',
      error: error.message
    })
  }
}

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
export const getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('flight')
      .populate('user', 'name email phone')

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      })
    }

    // Check if user owns the booking or is admin
    if (booking.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this booking'
      })
    }

    res.json({
      success: true,
      booking
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching booking',
      error: error.message
    })
  }
}

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('flight')

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      })
    }

    // Check if user owns the booking or is admin
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking'
      })
    }

    // Check if booking can be cancelled
    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already cancelled'
      })
    }

    if (!booking.canBeCancelled()) {
      return res.status(400).json({
        success: false,
        message: 'Booking cannot be cancelled within 24 hours of departure'
      })
    }

    // Update booking status
    booking.status = 'cancelled'
    booking.cancelledAt = new Date()
    await booking.save()

    // Return seats to available inventory
    const flight = await Flight.findById(booking.flight._id)
    await flight.updateAvailableSeats(booking.cabinClass, booking.passengers.length)

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      booking
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error cancelling booking',
      error: error.message
    })
  }
}

// @desc    Get all bookings (admin)
// @route   GET /api/bookings
// @access  Private/Admin
export const getAllBookings = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      userId
    } = req.query

    const query = {}
    if (status) query.status = status
    if (userId) query.user = userId

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
      populate: [
        { path: 'flight', select: 'airline flightNumber origin destination departureTime' },
        { path: 'user', select: 'name email phone' }
      ]
    }

    const bookings = await Booking.find(query)
      .sort(options.sort)
      .limit(options.limit)
      .skip((options.page - 1) * options.limit)
      .populate(options.populate)

    const total = await Booking.countDocuments(query)

    res.json({
      success: true,
      count: bookings.length,
      total,
      page: options.page,
      pages: Math.ceil(total / options.limit),
      bookings
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching bookings',
      error: error.message
    })
  }
}