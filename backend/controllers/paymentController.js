const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const stripe = require('../config/stripe');
const sendEmail = require('../utils/emailService');

const createPaymentIntent = async (req, res) => {
  try {
    const { bookingId, paymentMethod } = req.body;
    
    const booking = await Booking.findById(bookingId).populate('flight');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    if (booking.paymentStatus === 'paid') {
      return res.status(400).json({ message: 'Booking already paid' });
    }
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(booking.totalAmount * 100),
      currency: 'usd',
      payment_method_types: ['card'],
      metadata: {
        bookingId: booking._id.toString(),
        userId: req.user._id.toString()
      }
    });
    
    const payment = await Payment.create({
      booking: bookingId,
      user: req.user._id,
      amount: booking.totalAmount,
      paymentMethod,
      paymentGateway: 'stripe',
      paymentGatewayResponse: {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      }
    });
    
    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentId: payment._id
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const confirmPayment = async (req, res) => {
  try {
    const { paymentId, paymentIntentId } = req.body;
    
    const payment = await Payment.findById(paymentId);
    
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status === 'succeeded') {
      payment.paymentStatus = 'completed';
      payment.paymentGatewayResponse = {
        ...payment.paymentGatewayResponse,
        paymentIntent
      };
      await payment.save();
      
      await Booking.findByIdAndUpdate(payment.booking, {
        paymentStatus: 'paid',
        bookingStatus: 'confirmed'
      });
      
      const booking = await Booking.findById(payment.booking)
        .populate('flight')
        .populate('user');
      
      await sendEmail({
        email: booking.user.email,
        subject: 'Flight Booking Confirmation',
        template: 'bookingConfirmation',
        context: {
          name: booking.user.firstName,
          bookingReference: booking.bookingReference,
          flightNumber: booking.flight.flightNumber,
          departure: booking.flight.departure,
          arrival: booking.flight.arrival,
          totalAmount: booking.totalAmount
        }
      });
      
      res.json({ message: 'Payment successful', payment });
    } else {
      res.status(400).json({ message: 'Payment not completed' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('booking')
      .populate('user');
    
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    
    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const refundPayment = async (req, res) => {
  try {
    const { paymentId, reason } = req.body;
    
    const payment = await Payment.findById(paymentId);
    
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    
    if (payment.paymentStatus !== 'completed') {
      return res.status(400).json({ message: 'Only completed payments can be refunded' });
    }
    
    const refund = await stripe.refunds.create({
      payment_intent: payment.paymentGatewayResponse.paymentIntentId,
      amount: Math.round(payment.amount * 100)
    });
    
    payment.paymentStatus = 'refunded';
    payment.refundAmount = payment.amount;
    payment.refundReason = reason;
    payment.refundedAt = new Date();
    await payment.save();
    
    await Booking.findByIdAndUpdate(payment.booking, {
      bookingStatus: 'cancelled',
      cancellationReason: reason,
      cancelledAt: new Date()
    });
    
    res.json({ message: 'Refund processed successfully', refund });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPaymentIntent,
  confirmPayment,
  getPayment,
  refundPayment
};