const express = require('express')
const stripe = require('../config/stripe')
const Payment = require('../models/Payment')
const Booking = require('../models/Booking')
const auth = require('../middleware/auth')
const router = express.Router()

// Create payment intent
router.post('/create', auth, async (req, res) => {
  try {
    const { bookingId, amount, paymentMethod, cardDetails } = req.body

    const booking = await Booking.findById(bookingId).populate('flight')
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' })
    }

    if (booking.user.toString() !== req.userId) {
      return res.status(403).json({ message: 'Access denied' })
    }

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      payment_method_types: ['card'],
      metadata: {
        bookingId: bookingId.toString(),
        userId: req.userId.toString()
      }
    })

    // Create payment record
    const payment = new Payment({
      booking: bookingId,
      user: req.userId,
      amount,
      paymentMethod,
      transactionId: paymentIntent.id,
      cardDetails: cardDetails ? {
        last4: cardDetails.number.slice(-4),
        brand: 'visa', // You might want to detect this from the card number
        expMonth: parseInt(cardDetails.expiry.split('/')[0]),
        expYear: parseInt(cardDetails.expiry.split('/')[1])
      } : undefined
    })

    await payment.save()

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentId: payment._id
    })
  } catch (error) {
    console.error('Create payment error:', error)
    res.status(500).json({ message: 'Payment failed' })
  }
})

// Confirm payment
router.post('/confirm', auth, async (req, res) => {
  try {
    const { paymentId, paymentIntentId } = req.body

    const payment = await Payment.findById(paymentId)
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' })
    }

    // Verify payment with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    if (paymentIntent.status === 'succeeded') {
      // Update payment status
      payment.status = 'completed'
      await payment.save()

      // Update booking status
      const booking = await Booking.findById(payment.booking)
      booking.status = 'confirmed'
      booking.paymentStatus = 'completed'
      await booking.save()

      res.json({ success: true, payment })
    } else {
      payment.status = 'failed'
      await payment.save()
      res.status(400).json({ message: 'Payment failed' })
    }
  } catch (error) {
    console.error('Confirm payment error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get payment details
router.get('/:id', auth, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('booking')
      .populate('user', 'name email')

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' })
    }

    if (payment.user._id.toString() !== req.userId && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied' })
    }

    res.json(payment)
  } catch (error) {
    console.error('Get payment error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router