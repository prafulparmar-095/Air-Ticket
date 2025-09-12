const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD'
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'debit_card', 'paypal'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  transactionId: {
    type: String,
    unique: true
  },
  cardDetails: {
    last4: String,
    brand: String,
    expMonth: Number,
    expYear: Number
  },
  paymentGateway: {
    type: String,
    default: 'stripe'
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Payment', paymentSchema)