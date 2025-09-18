const express = require('express');
const stripe = require('../config/stripe');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// Stripe webhook handler
router.post('/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object);
        break;
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object);
        break;
      case 'charge.refunded':
        await handleChargeRefunded(event.data.object);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
});

async function handlePaymentIntentSucceeded(paymentIntent) {
  const { metadata } = paymentIntent;
  const bookingId = metadata.bookingId;
  
  const payment = await Payment.findOne({
    'paymentGatewayResponse.paymentIntentId': paymentIntent.id
  });
  
  if (payment) {
    payment.paymentStatus = 'completed';
    payment.paymentGatewayResponse.paymentIntent = paymentIntent;
    await payment.save();
    
    await Booking.findByIdAndUpdate(bookingId, {
      paymentStatus: 'paid',
      bookingStatus: 'confirmed'
    });
  }
}

async function handlePaymentIntentFailed(paymentIntent) {
  const payment = await Payment.findOne({
    'paymentGatewayResponse.paymentIntentId': paymentIntent.id
  });
  
  if (payment) {
    payment.paymentStatus = 'failed';
    payment.paymentGatewayResponse.paymentIntent = paymentIntent;
    await payment.save();
  }
}

async function handleChargeRefunded(charge) {
  const paymentIntentId = charge.payment_intent;
  const payment = await Payment.findOne({
    'paymentGatewayResponse.paymentIntentId': paymentIntentId
  });
  
  if (payment) {
    payment.paymentStatus = 'refunded';
    payment.refundAmount = charge.amount_refunded / 100;
    payment.refundedAt = new Date();
    await payment.save();
    
    await Booking.findByIdAndUpdate(payment.booking, {
      bookingStatus: 'cancelled',
      cancelledAt: new Date()
    });
  }
}

// Manual webhook endpoints for testing
router.post('/stripe-test', protect, admin, async (req, res) => {
  try {
    const { type, data } = req.body;
    
    switch (type) {
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(data.object);
        break;
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(data.object);
        break;
      case 'charge.refunded':
        await handleChargeRefunded(data.object);
        break;
      default:
        return res.status(400).json({ error: 'Unsupported event type' });
    }
    
    res.json({ success: true, message: 'Webhook processed successfully' });
  } catch (error) {
    console.error('Test webhook error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;