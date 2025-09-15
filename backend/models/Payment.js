import mongoose from 'mongoose'

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
    required: [true, 'Amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  currency: {
    type: String,
    default: 'USD',
    uppercase: true
  },
  paymentIntentId: {
    type: String,
    required: true,
    unique: true
  },
  paymentMethod: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'succeeded', 'failed', 'refunded'],
    default: 'pending'
  },
  refundAmount: {
    type: Number,
    default: 0,
    min: [0, 'Refund amount cannot be negative']
  },
  refundReason: {
    type: String,
    trim: true
  },
  metadata: {
    type: Map,
    of: String
  }
}, {
  timestamps: true
})

// Index for user payments and booking payments
paymentSchema.index({ user: 1, createdAt: -1 })
paymentSchema.index({ booking: 1 })
paymentSchema.index({ paymentIntentId: 1 })

// Virtual for formatted amount
paymentSchema.virtual('formattedAmount').get(function() {
  return (this.amount / 100).toFixed(2) // Assuming amount is in cents
})

// Method to check if payment can be refunded
paymentSchema.methods.canBeRefunded = function() {
  return this.status === 'succeeded' && this.refundAmount < this.amount
}

export default mongoose.model('Payment', paymentSchema)