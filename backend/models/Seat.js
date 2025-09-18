const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
  number: {
    type: String,
    required: [true, 'Seat number is required'],
    trim: true,
    uppercase: true
  },
  class: {
    type: String,
    required: [true, 'Seat class is required'],
    enum: {
      values: ['economy', 'premium_economy', 'business', 'first'],
      message: 'Seat class must be economy, premium_economy, business, or first'
    }
  },
  row: {
    type: Number,
    required: [true, 'Seat row is required'],
    min: [1, 'Row must be at least 1']
  },
  column: {
    type: String,
    required: [true, 'Seat column is required'],
    validate: {
      validator: function(v) {
        return /^[A-Z]$/.test(v);
      },
      message: 'Column must be a single uppercase letter'
    }
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  price: {
    type: Number,
    required: [true, 'Seat price is required'],
    min: [0, 'Price cannot be negative']
  },
  features: [{
    type: String,
    enum: [
      'extra_legroom',
      'window_seat',
      'aisle_seat',
      'exit_row',
      'bulkhead',
      'power_outlet',
      'wifi',
      'entertainment'
    ]
  }],
  isEmergencyExit: {
    type: Boolean,
    default: false
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  blockedReason: {
    type: String,
    enum: ['maintenance', 'cleaning', 'damaged', 'other'],
    default: 'other'
  }
}, {
  timestamps: true
});

// Compound index for unique seat numbers within a flight
seatSchema.index({ number: 1 }, { unique: true });

// Virtual for seat location
seatSchema.virtual('location').get(function() {
  return `${this.row}${this.column}`;
});

// Method to check if seat is premium
seatSchema.methods.isPremium = function() {
  return ['business', 'first'].includes(this.class);
};

// Static method to find available seats by class
seatSchema.statics.findAvailableByClass = function(seatClass) {
  return this.find({ 
    class: seatClass, 
    isAvailable: true, 
    isBlocked: false 
  });
};

// Static method to count available seats
seatSchema.statics.countAvailable = function() {
  return this.countDocuments({ 
    isAvailable: true, 
    isBlocked: false 
  });
};

module.exports = mongoose.model('Seat', seatSchema);