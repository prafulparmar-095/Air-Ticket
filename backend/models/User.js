// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  dateOfBirth: {
    type: Date
  },
  passportNumber: {
    type: String,
    trim: true
  },
  nationality: {
    type: String,
    trim: true
  },
  loyaltyPoints: {
    type: Number,
    default: 0
  },
  preferences: {
    seat: String,
    meal: {
      type: String,
      enum: ['regular', 'vegetarian', 'vegan', 'gluten-free', 'none'],
      default: 'regular'
    },
    newsletter: {
      type: Boolean,
      default: true
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Cascade delete bookings when a user is deleted
UserSchema.pre('remove', async function(next) {
  console.log(`Bookings being removed for user ${this._id}`);
  await this.model('Booking').deleteMany({ user: this._id });
  next();
});

// Reverse populate with virtuals
UserSchema.virtual('bookings', {
  ref: 'Booking',
  localField: '_id',
  foreignField: 'user',
  justOne: false
});

module.exports = mongoose.model('User', UserSchema);