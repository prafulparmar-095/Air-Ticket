// backend/controllers/bookingController.js
const Booking = require('../models/Booking');
const Flight = require('../models/Flight');

// Create a new booking
exports.createBooking = async (req, res) => {
  try {
    const { flightId, passengers, contactInfo, totalPrice, paymentId } = req.body;
    
    // Check if flight exists and has enough seats
    const flight = await Flight.findById(flightId);
    if (!flight) {
      return res.status(404).json({
        success: false,
        message: 'Flight not found'
      });
    }
    
    if (flight.availableSeats < passengers.length) {
      return res.status(400).json({
        success: false,
        message: 'Not enough seats available'
      });
    }
    
    // Create booking
    const booking = new Booking({
      user: req.user.id,
      flight: flightId,
      passengers,
      contactInfo,
      totalPrice,
      paymentId
    });
    
    await booking.save();
    
    // Update available seats
    flight.availableSeats -= passengers.length;
    await flight.save();
    
    // Populate flight details for response
    await booking.populate('flight');
    
    res.status(201).json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating booking',
      error: error.message
    });
  }
};

// Get user's bookings
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('flight')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Get booking by ID
exports.getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('flight')
      .populate('user', 'name email');
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    // Check if user owns the booking or is admin
    if (booking.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this booking'
      });
    }
    
    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Cancel booking
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    // Check if user owns the booking or is admin
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking'
      });
    }
    
    // Check if booking can be cancelled (e.g., not too close to departure)
    const flight = await Flight.findById(booking.flight);
    const departureDate = new Date(flight.departureDate);
    const now = new Date();
    const hoursUntilDeparture = (departureDate - now) / (1000 * 60 * 60);
    
    if (hoursUntilDeparture < 24) {
      return res.status(400).json({
        success: false,
        message: 'Booking cannot be cancelled within 24 hours of departure'
      });
    }
    
    // Update booking status
    booking.status = 'cancelled';
    await booking.save();
    
    // Return seats to flight
    flight.availableSeats += booking.passengers.length;
    await flight.save();
    
    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Get all bookings (admin only)
exports.getAllBookings = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const bookings = await Booking.find()
      .populate('flight')
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Booking.countDocuments();
    
    res.json({
      success: true,
      count: bookings.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};