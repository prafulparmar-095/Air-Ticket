const mongoose = require('mongoose')

const passengerSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  dateOfBirth: Date,
  gender: String
})

const bookingSchema = new mongoose.Schema({
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
  passengers: [passengerSchema],
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    default: 'confirmed'
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Booking', bookingSchema)