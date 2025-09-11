const Booking = require('../models/Booking');
const Flight = require('../models/Flight');

// Get user bookings
const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate('flight').sort({ bookingDate: -1 });
    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get all bookings
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate('flight').populate('user', 'name email').sort({ bookingDate: -1 });
    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Create booking
const createBooking = async (req, res) => {
  try {
    const { flightId, passengers } = req.body;
    
    const flight = await Flight.findById(flightId);
    if (!flight) {
      return res.status(404).json({ message: 'Flight not found' });
    }
    
    if (flight.seats < passengers.length) {
      return res.status(400).json({ message: 'Not enough seats available' });
    }
    
    const booking = new Booking({
      user: req.user.id,
      flight: flightId,
      passengers,
      totalPrice: flight.price * passengers.length
    });
    
    await booking.save();
    
    flight.seats -= passengers.length;
    await flight.save();
    
    await booking.populate('flight');
    res.json(booking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Confirm booking
const confirmBooking = async (req, res) => {
  try {
    const { paymentId } = req.body;
    
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    booking.status = 'confirmed';
    booking.paymentId = paymentId;
    booking.paidAt = new Date();
    
    await booking.save();
    await booking.populate('flight');
    
    res.json(booking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Cancel booking
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const flight = await Flight.findById(booking.flight);
    if (flight) {
      flight.seats += booking.passengers.length;
      await flight.save();
    }
    
    booking.status = 'cancelled';
    await booking.save();
    
    res.json(booking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

module.exports = { getUserBookings, getAllBookings, createBooking, confirmBooking, cancelBooking };