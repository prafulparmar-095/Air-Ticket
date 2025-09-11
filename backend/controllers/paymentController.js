const Booking = require('../models/Booking');

// Create payment intent
const createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency, metadata } = req.body;

    // Simulate payment processing
    const clientSecret = 'simulated_client_secret_' + Date.now();
    
    res.json({ clientSecret, amount, currency });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ message: 'Failed to create payment intent' });
  }
};

// Handle webhook
const handleWebhook = async (req, res) => {
  try {
    // Simulate webhook handling
    const event = {
      type: 'payment_intent.succeeded',
      data: { object: { id: 'simulated_payment_' + Date.now(), metadata: req.body.metadata || {} } }
    };

    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log('Payment successful:', paymentIntent.id);
        
        try {
          await Booking.findOneAndUpdate(
            { _id: paymentIntent.metadata.bookingId },
            { status: 'confirmed', paymentId: paymentIntent.id, paidAt: new Date() }
          );
          console.log('Booking confirmed:', paymentIntent.metadata.bookingId);
        } catch (error) {
          console.error('Error updating booking:', error);
        }
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
};

// Get payment details
const getPayment = async (req, res) => {
  try {
    const paymentDetails = {
      id: req.params.paymentId,
      status: 'succeeded',
      amount: 1000,
      currency: 'inr',
      created: new Date().toISOString()
    };
    
    res.json(paymentDetails);
  } catch (error) {
    console.error('Error retrieving payment:', error);
    res.status(500).json({ message: 'Failed to retrieve payment details' });
  }
};

module.exports = { createPaymentIntent, handleWebhook, getPayment };