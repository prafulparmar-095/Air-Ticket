import stripe from '../config/stripe.js'
import Booking from '../models/Booking.js'
import Payment from '../models/Payment.js'

// @desc    Create payment intent
// @route   POST /api/payments/create-intent
// @access  Private
export const createPaymentIntent = async (req, res) => {
  try {
    const { amount, bookingId } = req.body

    // Verify booking exists and belongs to user
    const booking = await Booking.findOne({
      _id: bookingId,
      user: req.user.id
    })

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      })
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Booking is not in a payable state'
      })
    }

    // Create payment intent (using mock in development)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        bookingId: booking._id.toString(),
        userId: req.user.id
      }
    })

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret
    })
  } catch (error) {
    console.error('Payment intent error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating payment intent',
      error: error.message
    })
  }
}

// @desc    Confirm payment
// @route   POST /api/payments/confirm
// @access  Private
export const confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId, bookingId } = req.body

    // For mock payments, we'll simulate success
    let paymentIntent;
    
    if (paymentIntentId && paymentIntentId.startsWith('pi_mock_')) {
      // Mock payment - always succeed
      paymentIntent = {
        status: 'succeeded',
        id: paymentIntentId,
        payment_method_types: ['card']
      };
    } else {
      // Real Stripe payment
      paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    }

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({
        success: false,
        message: 'Payment not successful'
      })
    }

    // Verify booking exists and belongs to user
    const booking = await Booking.findOne({
      _id: bookingId,
      user: req.user.id
    }).populate('flight')

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      })
    }

    // Update booking status
    booking.status = 'confirmed'
    booking.paymentStatus = 'paid'
    booking.paymentIntentId = paymentIntentId
    await booking.save()

    // Create payment record
    await Payment.create({
      booking: bookingId,
      user: req.user.id,
      amount: booking.totalAmount,
      currency: 'usd',
      paymentIntentId: paymentIntentId,
      paymentMethod: 'card',
      status: 'succeeded'
    })

    res.json({
      success: true,
      message: 'Payment confirmed successfully',
      booking
    })
  } catch (error) {
    console.error('Payment confirmation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error confirming payment',
      error: error.message
    })
  }
}

// @desc    Get payment history
// @route   GET /api/payments/history
// @access  Private
export const getPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user.id })
      .populate('booking')
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      count: payments.length,
      payments
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching payment history',
      error: error.message
    })
  }
}

// @desc    Process refund
// @route   POST /api/payments/refund
// @access  Private/Admin
export const processRefund = async (req, res) => {
  try {
    const { bookingId, amount, reason } = req.body

    const booking = await Booking.findById(bookingId)
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      })
    }

    if (!booking.paymentIntentId) {
      return res.status(400).json({
        success: false,
        message: 'No payment found for this booking'
      })
    }

    // Create refund
    const refund = await stripe.refunds.create({
      payment_intent: booking.paymentIntentId,
      amount: Math.round(amount * 100)
    })

    // Update booking status
    booking.paymentStatus = 'refunded'
    if (amount === booking.totalAmount) {
      booking.status = 'refunded'
    }
    await booking.save()

    // Update payment record
    await Payment.findOneAndUpdate(
      { paymentIntentId: booking.paymentIntentId },
      {
        status: 'refunded',
        refundAmount: amount,
        refundReason: reason
      }
    )

    res.json({
      success: true,
      message: 'Refund processed successfully',
      refund
    })
  } catch (error) {
    console.error('Refund error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error processing refund',
      error: error.message
    })
  }
}