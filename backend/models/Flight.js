// backend/models/Flight.js
const mongoose = require('mongoose');

const FlightSchema = new mongoose.Schema({
  airline: {
    type: String,
    required: [true, 'Please add an airline'],
    trim: true
  },
  number: {
    type: String,
    required: [true, 'Please add a flight number'],
    unique: true,
    trim: true
  },
  origin: {
    type: String,
    required: [true, 'Please add an origin'],
    trim: true
  },
  destination: {
    type: String,
    required: [true, 'Please add a destination'],
    trim: true
  },
  departureTime: {
    type: Date,
    required: [true, 'Please add a departure time']
  },
  arrivalTime: {
    type: Date,
    required: [true, 'Please add an arrival time']
  },
  duration: {
    type: String,
    required: [true, 'Please add a duration']
  },
  aircraft: {
    type: String,
    required: [true, 'Please add an aircraft type']
  },
  status: {
    type: String,
    enum: ['scheduled', 'boarding', 'departed', 'in-air', 'landed', 'delayed', 'cancelled'],
    default: 'scheduled'
  },
  gate: {
    type: String,
    trim: true
  },
  terminal: {
    type: String,
    trim: true
  },
  economySeats: {
    total: { type: Number, default: 0 },
    available: { type: Number, default: 0 },
    price: { type: Number, required: true }
  },
  premiumEconomySeats: {
    total: { type: Number, default: 0 },
    available: { type: Number, default: 0 },
    price: { type: Number, default: 0 }
  },
  businessSeats: {
    total: { type: Number, default: 0 },
    available: { type: Number, default: 0 },
    price: { type: Number, default: 0 }
  },
  firstClassSeats: {
    total: { type: Number, default: 0 },
    available: { type: Number, default: 0 },
    price: { type: Number, default: 0 }
  },
  seatMap: {
    economy: {
      rows: Number,
      cols: Number,
      seatLetters: [String],
      blockedSeats: [String]
    },
    premiumEconomy: {
      rows: Number,
      cols: Number,
      seatLetters: [String],
      blockedSeats: [String]
    },
    business: {
      rows: Number,
      cols: Number,
      seatLetters: [String],
      blockedSeats: [String]
    },
    firstClass: {
      rows: Number,
      cols: Number,
      seatLetters: [String],
      blockedSeats: [String]
    }
  },
  hasWiFi: { type: Boolean, default: false },
  hasEntertainment: { type: Boolean, default: false },
  hasPowerOutlets: { type: Boolean, default: false },
  mealService: { type: Boolean, default: false },
  onTimePerformance: { type: Number, default: 0 },
  averageDelay: { type: Number, default: 0 },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Pre-save middleware to calculate duration
FlightSchema.pre('save', function(next) {
  if (this.departureTime && this.arrivalTime) {
    const durationMs = this.arrivalTime - this.departureTime;
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    this.duration = `${hours}h ${minutes}m`;
  }
  next();
});

module.exports = mongoose.model('Flight', FlightSchema);