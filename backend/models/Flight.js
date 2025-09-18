const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
  number: {
    type: String,
    required: true
  },
  class: {
    type: String,
    enum: ['economy', 'business', 'first'],
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  price: {
    type: Number,
    required: true
  },
  features: [String]
});

const flightSchema = new mongoose.Schema({
  flightNumber: {
    type: String,
    required: true,
    unique: true
  },
  airline: {
    type: String,
    required: true
  },
  departure: {
    airport: {
      type: String,
      required: true
    },
    terminal: String,
    datetime: {
      type: Date,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    country: String
  },
  arrival: {
    airport: {
      type: String,
      required: true
    },
    terminal: String,
    datetime: {
      type: Date,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    country: String
  },
  duration: {
    type: Number,
    required: true
  },
  aircraft: {
    type: String,
    required: true
  },
  seats: [seatSchema],
  prices: {
    economy: {
      type: Number,
      required: true
    },
    business: {
      type: Number,
      required: true
    },
    first: {
      type: Number,
      required: true
    }
  },
  stops: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['scheduled', 'boarding', 'in-air', 'landed', 'delayed', 'cancelled'],
    default: 'scheduled'
  },
  baggageAllowance: {
    carryOn: {
      weight: Number,
      dimensions: String
    },
    checked: {
      weight: Number,
      dimensions: String
    }
  },
  images: [{
    url: String,
    publicId: String,
    caption: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Flight', flightSchema);