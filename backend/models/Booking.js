import mongoose from 'mongoose'

const passengerSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['adult', 'child', 'infant'],
    required: true
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  passportNumber: {
    type: String,
    trim: true
  },
  passportExpiry: {
    type: Date
  }
})

const bookingSchema = new mongoose.Schema({
  bookingReference: {
    type: String,
    unique: true,
    required: true
  },
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
  contactInfo: {
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required']
    }
  },
  cabinClass: {
    type: String,
    enum: ['economy', 'premium_economy', 'business', 'first'],
    required: true
  },
  totalAmount: {
    type: Number,
    required: [true, 'Total amount is required'],
    min: [0, 'Total amount cannot be negative']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'refunded'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentIntentId: {
    type: String
  },
  cancellationReason: {
    type: String,
    trim: true
  },
  cancelledAt: {
    type: Date
  },
  seatNumbers: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
})

// Generate booking reference before saving
bookingSchema.pre('save', async function(next) {
  if (this.isNew && !this.bookingReference) {
    const count = await mongoose.model('Booking').countDocuments()
    this.bookingReference = `BK${(count + 1).toString().padStart(6, '0')}`
  }
  next()
})

// Index for user bookings
bookingSchema.index({ user: 1, createdAt: -1 })
bookingSchema.index({ bookingReference: 1 })

// Virtual for passenger count
bookingSchema.virtual('passengerCount').get(function() {
  return this.passengers.length
})

// Method to check if booking can be cancelled
bookingSchema.methods.canBeCancelled = function() {
  const departureTime = new Date(this.flight.departureTime)
  const now = new Date()
  const hoursUntilDeparture = (departureTime - now) / (1000 * 60 * 60)
  return hoursUntilDeparture > 24 // Can cancel if more than 24 hours before departure
}

export default mongoose.model('Booking', bookingSchema)