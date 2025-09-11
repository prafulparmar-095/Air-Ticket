const express = require('express');
const { body, validationResult } = require('express-validator');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const User = require('../models/User');

const router = express.Router();

// Auth middleware for payments
const authPayment = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }
    
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Create payment intent
router.post('/create-payment-intent', authPayment, [
  body('amount').isNumeric().withMessage('Valid amount is required'),
  body('currency').isLength({ min: 3, max: 3 }).withMessage('Valid currency is required'),
  body('bookingId').isMongoId().withMessage('Valid booking ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { amount, currency, bookingId, metadata = {} } = req.body;

    // Verify booking exists and belongs to user
    const booking = await Booking.findOne({ 
      _id: bookingId, 
      user: req.user.id 
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if booking already has a payment
    if (booking.payment) {
      const existingPayment = await Payment.findById(booking.payment);
      if (existingPayment && existingPayment.status === 'completed') {
        return res.status(400).json({ message: 'Booking already paid' });
      }
    }

    // Create payment record first
    const payment = new Payment({
      booking: bookingId,
      user: req.user.id,
      amount: amount / 100, // Convert from cents to currency unit
      currency: currency.toUpperCase(),
      totalAmount: amount / 100,
      paymentMethod: 'card', // Default for Stripe
      paymentGateway: 'stripe',
      gatewayTransactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: 'pending',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      metadata: {
        ...metadata,
        bookingId,
        userId: req.user.id
      }
    });

    await payment.save();

    // Create Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: currency.toLowerCase(),
      metadata: {
        ...metadata,
        bookingId: bookingId,
        paymentId: payment._id.toString(),
        userId: req.user.id
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Update payment with Stripe data
    payment.gatewayPaymentId = paymentIntent.id;
    payment.gatewayResponse = paymentIntent;
    await payment.save();

    // Update booking with payment reference
    booking.payment = payment._id;
    await booking.save();

    res.send({
      clientSecret: paymentIntent.client_secret,
      paymentId: payment._id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ 
      message: 'Failed to create payment intent',
      error: error.message 
    });
  }
});

// Handle successful payment webhook
router.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log('PaymentIntent was successful:', paymentIntent.id);
        
        // Update payment status
        const payment = await Payment.findOneAndUpdate(
          { gatewayPaymentId: paymentIntent.id },
          { 
            status: 'completed',
            processedAt: new Date(),
            gatewayResponse: paymentIntent,
            $set: {
              'paymentMethodDetails.card': paymentIntent.payment_method_details?.card ? {
                last4: paymentIntent.payment_method_details.card.last4,
                brand: paymentIntent.payment_method_details.card.brand,
                expiryMonth: paymentIntent.payment_method_details.card.exp_month,
                expiryYear: paymentIntent.payment_method_details.card.exp_year,
                country: paymentIntent.payment_method_details.card.country
              } : undefined
            }
          },
          { new: true }
        );

        if (payment) {
          // Update booking status
          await Booking.findByIdAndUpdate(
            payment.booking,
            { 
              status: 'confirmed',
              paidAt: new Date()
            }
          );
          
          console.log('Payment and booking confirmed:', paymentIntent.id);
        }
        break;

      case 'payment_intent.payment_failed':
        const failedPaymentIntent = event.data.object;
        console.log('PaymentIntent failed:', failedPaymentIntent.id);
        
        await Payment.findOneAndUpdate(
          { gatewayPaymentId: failedPaymentIntent.id },
          { 
            status: 'failed',
            failedAt: new Date(),
            failureReason: {
              code: failedPaymentIntent.last_payment_error?.code,
              message: failedPaymentIntent.last_payment_error?.message,
              description: failedPaymentIntent.last_payment_error?.doc_url
            },
            gatewayResponse: failedPaymentIntent
          }
        );
        break;

      case 'charge.refunded':
        const charge = event.data.object;
        console.log('Charge refunded:', charge.id);
        
        // Handle refunds
        const refundedPayment = await Payment.findOne({ gatewayPaymentId: charge.payment_intent });
        if (refundedPayment) {
          const refundAmount = charge.amount_refunded / 100; // Convert from cents
          
          refundedPayment.refundedAmount = refundAmount;
          refundedPayment.status = refundAmount >= refundedPayment.totalAmount ? 'refunded' : 'partially_refunded';
          
          // Add refund details
          refundedPayment.refunds.push({
            amount: refundAmount,
            reason: 'Customer request',
            status: 'processed',
            processedAt: new Date(),
            transactionId: charge.id
          });
          
          await refundedPayment.save();
          
          // Update booking status if fully refunded
          if (refundAmount >= refundedPayment.totalAmount) {
            await Booking.findByIdAndUpdate(
              refundedPayment.booking,
              { status: 'cancelled' }
            );
          }
        }
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Get payment details
router.get('/:paymentId', authPayment, async (req, res) => {
  try {
    const payment = await Payment.findOne({
      _id: req.params.paymentId,
      user: req.user.id
    }).populate('booking');

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.json(payment);
  } catch (error) {
    console.error('Error retrieving payment:', error);
    res.status(500).json({ message: 'Failed to retrieve payment details' });
  }
});

// Get user payments
router.get('/', authPayment, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    let query = { user: req.user.id };
    if (status) query.status = status;
    
    const payments = await Payment.find(query)
      .populate('booking')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Payment.countDocuments(query);
    
    res.json({
      payments,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('Error retrieving payments:', error);
    res.status(500).json({ message: 'Failed to retrieve payments' });
  }
});

// Initiate refund
router.post('/:paymentId/refund', authPayment, [
  body('amount').isNumeric().withMessage('Valid amount is required'),
  body('reason').not().isEmpty().withMessage('Reason is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const payment = await Payment.findOne({
      _id: req.params.paymentId,
      user: req.user.id
    });

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    if (payment.status !== 'completed') {
      return res.status(400).json({ message: 'Only completed payments can be refunded' });
    }

    const { amount, reason } = req.body;
    const refundAmount = parseFloat(amount);

    if (refundAmount > payment.availableRefundAmount) {
      return res.status(400).json({ 
        message: 'Refund amount exceeds available amount',
        availableAmount: payment.availableRefundAmount
      });
    }

    // Process refund through Stripe
    const refund = await stripe.refunds.create({
      payment_intent: payment.gatewayPaymentId,
      amount: Math.round(refundAmount * 100), // Convert to cents
      reason: 'requested_by_customer'
    });

    // Update payment record
    await payment.processRefund(refundAmount, reason);
    await payment.markRefundProcessed(payment.refunds.length - 1, refund.id);

    // Update booking status if fully refunded
    if (payment.status === 'refunded') {
      await Booking.findByIdAndUpdate(
        payment.booking,
        { status: 'cancelled' }
      );
    }

    res.json({
      message: 'Refund processed successfully',
      refundId: refund.id,
      amount: refundAmount
    });
  } catch (error) {
    console.error('Error processing refund:', error);
    res.status(500).json({ 
      message: 'Failed to process refund',
      error: error.message 
    });
  }
});

// Get payment methods (for future use)
router.get('/methods/supported', (req, res) => {
  res.json({
    methods: [
      {
        id: 'card',
        name: 'Credit/Debit Card',
        supportedCurrencies: ['INR', 'USD', 'EUR', 'GBP'],
        icons: ['visa', 'mastercard', 'amex', 'rupay']
      },
      {
        id: 'upi',
        name: 'UPI',
        supportedCurrencies: ['INR'],
        icons: ['gpay', 'phonepe', 'paytm']
      },
      {
        id: 'netbanking',
        name: 'Net Banking',
        supportedCurrencies: ['INR'],
        icons: ['bank']
      }
    ]
  });
});

module.exports = router;