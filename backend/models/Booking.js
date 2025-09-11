const mongoose = require('mongoose');

const PassengerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    required: true,
    min: 1,
    max: 120
  },
  gender: {
    type: String,
    required: true,
    enum: ['male', 'female', 'other']
  }
});

const BookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  flight: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Flight',
    required: true
  },
  passengers: [PassengerSchema],
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'confirmed', 'cancelled']
  },
  paymentId: {
    type: String,
    trim: true
  },
  paidAt: {
    type: Date
  },
  bookingDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for user bookings
BookingSchema.index({ user: 1, bookingDate: -1 });

module.exports = mongoose.model('Booking', BookingSchema);