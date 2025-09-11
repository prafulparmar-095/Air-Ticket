const mongoose = require('mongoose');

const RefundSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  reason: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'processed', 'failed']
  },
  processedAt: {
    type: Date
  },
  transactionId: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

const PaymentSchema = new mongoose.Schema({
  // Reference to booking
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  
  // Reference to user who made the payment
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Payment amount details
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'INR',
    uppercase: true,
    enum: ['INR', 'USD', 'EUR', 'GBP']
  },
  taxAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  discountAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  
  // Payment method information
  paymentMethod: {
    type: String,
    required: true,
    enum: ['card', 'upi', 'netbanking', 'wallet', 'cash']
  },
  paymentMethodDetails: {
    // For card payments
    card: {
      last4: String,
      brand: String,
      expiryMonth: Number,
      expiryYear: Number,
      country: String
    },
    // For UPI payments
    upi: {
      vpa: String // Virtual Payment Address
    },
    // For netbanking
    netbanking: {
      bank: String,
      ifsc: String
    },
    // For wallet payments
    wallet: {
      provider: String,
      phone: String
    }
  },
  
  // Payment status
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded', 'partially_refunded']
  },
  
  // Gateway information
  paymentGateway: {
    type: String,
    default: 'stripe',
    enum: ['stripe', 'razorpay', 'paypal', 'paytm', 'cash']
  },
  gatewayTransactionId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  gatewayPaymentId: {
    type: String,
    trim: true
  },
  
  // Gateway response data
  gatewayResponse: {
    type: mongoose.Schema.Types.Mixed // Stores raw response from payment gateway
  },
  
  // Timestamps
  initiatedAt: {
    type: Date,
    default: Date.now
  },
  processedAt: {
    type: Date
  },
  failedAt: {
    type: Date
  },
  
  // Failure information
  failureReason: {
    code: String,
    message: String,
    description: String
  },
  
  // Refund information
  refunds: [RefundSchema],
  refundedAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Security and verification
  ipAddress: {
    type: String,
    trim: true
  },
  userAgent: {
    type: String,
    trim: true
  },
  
  // Metadata
  metadata: {
    type: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for checking if payment is refundable
PaymentSchema.virtual('isRefundable').get(function() {
  return this.status === 'completed' && this.refundedAmount < this.totalAmount;
});

// Virtual for available refund amount
PaymentSchema.virtual('availableRefundAmount').get(function() {
  return this.totalAmount - this.refundedAmount;
});

// Indexes for better query performance
PaymentSchema.index({ user: 1, createdAt: -1 });
PaymentSchema.index({ booking: 1 });
PaymentSchema.index({ gatewayTransactionId: 1 });
PaymentSchema.index({ status: 1 });
PaymentSchema.index({ createdAt: 1 });
PaymentSchema.index({ 'paymentMethodDetails.card.last4': 1 });
PaymentSchema.index({ 'paymentMethodDetails.upi.vpa': 1 });

// Pre-save middleware to calculate total amount
PaymentSchema.pre('save', function(next) {
  if (this.isModified('amount') || this.isModified('taxAmount') || this.isModified('discountAmount')) {
    this.totalAmount = this.amount + this.taxAmount - this.discountAmount;
  }
  next();
});

// Static method to find payments by status
PaymentSchema.statics.findByStatus = function(status) {
  return this.find({ status });
};

// Static method to get total revenue
PaymentSchema.statics.getTotalRevenue = function() {
  return this.aggregate([
    { $match: { status: 'completed' } },
    { $group: { _id: null, total: { $sum: '$totalAmount' } } }
  ]);
};

// Instance method to process refund
PaymentSchema.methods.processRefund = async function(amount, reason) {
  if (amount > this.availableRefundAmount) {
    throw new Error('Refund amount exceeds available amount');
  }
  
  if (this.status !== 'completed') {
    throw new Error('Only completed payments can be refunded');
  }
  
  const refund = {
    amount,
    reason,
    status: 'pending'
  };
  
  this.refunds.push(refund);
  this.refundedAmount += amount;
  
  // Update payment status based on refund amount
  if (this.refundedAmount >= this.totalAmount) {
    this.status = 'refunded';
  } else if (this.refundedAmount > 0) {
    this.status = 'partially_refunded';
  }
  
  return this.save();
};

// Instance method to mark refund as processed
PaymentSchema.methods.markRefundProcessed = function(refundIndex, transactionId) {
  if (refundIndex >= this.refunds.length) {
    throw new Error('Invalid refund index');
  }
  
  this.refunds[refundIndex].status = 'processed';
  this.refunds[refundIndex].processedAt = new Date();
  this.refunds[refundIndex].transactionId = transactionId;
  
  return this.save();
};

module.exports = mongoose.model('Payment', PaymentSchema);