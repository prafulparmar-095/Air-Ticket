// backend/models/Booking.js
const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  bookingReference: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  flight: {
    type: mongoose.Schema.ObjectId,
    ref: 'Flight',
    required: true
  },
  passengers: [{
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    dateOfBirth: {
      type: Date,
      required: true
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: true
    },
    passportNumber: {
      type: String,
      trim: true
    },
    nationality: {
      type: String,
      trim: true
    },
    seat: {
      type: String,
      trim: true
    },
    baggage: {
      checked: { type: Number, default: 0 },
      cabin: { type: Number, default: 1 }
    },
    specialAssistance: {
      type: Boolean,
      default: false
    },
    mealPreference: {
      type: String,
      enum: ['regular', 'vegetarian', 'vegan', 'gluten-free'],
      default: 'regular'
    }
  }],
  contactDetails: {
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    }
  },
  fareDetails: {
    baseFare: { type: Number, required: true },
    tax: { type: Number, required: true },
    baggageFee: { type: Number, default: 0 },
    seatSelectionFee: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true }
  },
  payment: {
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending'
    }
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Generate booking reference before saving
BookingSchema.pre('save', async function(next) {
  if (!this.bookingReference) {
    let isUnique = false;
    let reference;
    
    while (!isUnique) {
      // Generate a 6-character alphanumeric reference
      reference = Math.random().toString(36).substring(2, 8).toUpperCase();
      
      // Check if it's unique
      const existingBooking = await mongoose.model('Booking').findOne({ bookingReference: reference });
      if (!existingBooking) {
        isUnique = true;
      }
    }
    
    this.bookingReference = reference;
  }
  next();
});

module.exports = mongoose.model('Booking', BookingSchema);