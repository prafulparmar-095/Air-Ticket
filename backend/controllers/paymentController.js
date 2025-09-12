// backend/controllers/paymentController.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Payment = require('../models/Payment');

// Create payment intent
exports.createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency } = req.body;
    
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        userId: req.user.id.toString()
      }
    });
    
    res.json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret
      }
    });
  } catch (error) {
    console.error('Payment intent error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating payment intent',
      error: error.message
    });
  }
};

// Handle successful payment
exports.handlePaymentSuccess = async (req, res) => {
  try {
    const { paymentIntentId, bookingId, amount } = req.body;
    
    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    // Create payment record
    const payment = new Payment({
      user: req.user.id,
      booking: bookingId,
      paymentIntentId,
      amount,
      currency: paymentIntent.currency,
      status: paymentIntent.status
    });
    
    await payment.save();
    
    res.json({
      success: true,
      data: payment
    });
  } catch (error) {
    console.error('Payment success handling error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing payment',
      error: error.message
    });
  }
};

// Get payment history for user
exports.getPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user.id })
      .populate('booking')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Refund payment (admin only)
exports.refundPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }
    
    // Create refund with Stripe
    const refund = await stripe.refunds.create({
      payment_intent: payment.paymentIntentId
    });
    
    // Update payment status
    payment.status = 'refunded';
    payment.refundId = refund.id;
    await payment.save();
    
    res.json({
      success: true,
      message: 'Payment refunded successfully',
      data: payment
    });
  } catch (error) {
    console.error('Refund error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing refund',
      error: error.message
    });
  }
};