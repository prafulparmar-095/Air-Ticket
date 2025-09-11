const mongoose = require('mongoose');

const FlightSchema = new mongoose.Schema({
  airline: {
    type: String,
    required: true,
    trim: true
  },
  flightNumber: {
    type: String,
    required: true,
    trim: true,
    uppercase: true
  },
  departure: {
    city: {
      type: String,
      required: true,
      trim: true
    },
    code: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      maxlength: 3,
      minlength: 3
    },
    time: {
      type: Date,
      required: true
    }
  },
  arrival: {
    city: {
      type: String,
      required: true,
      trim: true
    },
    code: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      maxlength: 3,
      minlength: 3
    },
    time: {
      type: Date,
      required: true
    }
  },
  duration: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  seats: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    default: 'scheduled',
    enum: ['scheduled', 'delayed', 'cancelled', 'completed']
  }
}, {
  timestamps: true
});

// Index for search optimization
FlightSchema.index({ 
  'departure.city': 'text', 
  'arrival.city': 'text',
  'departure.time': 1 
});

module.exports = mongoose.model('Flight', FlightSchema);