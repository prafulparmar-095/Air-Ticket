const Booking = require('../models/Booking');
const Flight = require('../models/Flight');

const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('flight')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('flight')
      .populate('user', 'firstName lastName email');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user owns the booking or is admin
    if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createBooking = async (req, res) => {
  try {
    const { flightId, passengers, contactEmail, contactPhone, specialRequests } = req.body;

    const flight = await Flight.findById(flightId);
    if (!flight) {
      return res.status(404).json({ message: 'Flight not found' });
    }

    // Calculate total amount
    let totalAmount = 0;
    passengers.forEach(passenger => {
      const seatPrice = flight.prices[passenger.seat.class] || flight.prices.economy;
      totalAmount += seatPrice;
    });

    const booking = new Booking({
      user: req.user._id,
      flight: flightId,
      passengers,
      totalAmount,
      contactEmail,
      contactPhone,
      specialRequests
    });

    // Update seat availability
    passengers.forEach(passenger => {
      const seat = flight.seats.find(s => s.number === passenger.seat.number);
      if (seat) {
        seat.isAvailable = false;
      }
    });

    await flight.save();
    const savedBooking = await booking.save();
    await savedBooking.populate('flight');

    res.status(201).json(savedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    booking.bookingStatus = 'cancelled';
    booking.cancellationReason = req.body.reason;
    booking.cancelledAt = new Date();

    // Free up seats
    const flight = await Flight.findById(booking.flight);
    booking.passengers.forEach(passenger => {
      const seat = flight.seats.find(s => s.number === passenger.seat.number);
      if (seat) {
        seat.isAvailable = true;
      }
    });

    await flight.save();
    await booking.save();

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getBookings,
  getBooking,
  createBooking,
  cancelBooking
};