import mongoose from 'mongoose'

const flightSchema = new mongoose.Schema({
  airline: {
    type: String,
    required: [true, 'Airline is required'],
    trim: true
  },
  flightNumber: {
    type: String,
    required: [true, 'Flight number is required'],
    trim: true
  },
  origin: {
    type: String,
    required: [true, 'Origin is required'],
    trim: true
  },
  destination: {
    type: String,
    required: [true, 'Destination is required'],
    trim: true
  },
  departureTime: {
    type: Date,
    required: [true, 'Departure time is required']
  },
  arrivalTime: {
    type: Date,
    required: [true, 'Arrival time is required']
  },
  duration: {
    type: Number, // in minutes
    required: [true, 'Duration is required']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  stops: {
    type: Number,
    default: 0,
    min: [0, 'Stops cannot be negative']
  },
  availableSeats: {
    economy: {
      type: Number,
      default: 0,
      min: [0, 'Available seats cannot be negative']
    },
    premium_economy: {
      type: Number,
      default: 0,
      min: [0, 'Available seats cannot be negative']
    },
    business: {
      type: Number,
      default: 0,
      min: [0, 'Available seats cannot be negative']
    },
    first: {
      type: Number,
      default: 0,
      min: [0, 'Available seats cannot be negative']
    }
  },
  aircraft: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'boarding', 'departed', 'arrived', 'delayed', 'cancelled'],
    default: 'scheduled'
  }
}, {
  timestamps: true
})

// Index for search optimization
flightSchema.index({ origin: 1, destination: 1, departureTime: 1 })
flightSchema.index({ airline: 1, flightNumber: 1 })

// Virtual for checking if flight is in the past
flightSchema.virtual('isPast').get(function() {
  return this.departureTime < new Date()
})

// Method to check seat availability
flightSchema.methods.hasAvailableSeats = function(cabinClass, passengers) {
  return this.availableSeats[cabinClass] >= passengers
}

// Method to update available seats
flightSchema.methods.updateAvailableSeats = function(cabinClass, count) {
  this.availableSeats[cabinClass] += count
  return this.save()
}

export default mongoose.model('Flight', flightSchema)