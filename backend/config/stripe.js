// Simple mock stripe configuration for development
const mockStripe = {
  paymentIntents: {
    create: async (data) => {
      console.log('Mock Stripe - Creating payment intent:', data);
      return {
        id: `pi_mock_${Date.now()}`,
        client_secret: 'mock_client_secret_' + Math.random().toString(36).substr(2, 9),
        status: 'requires_payment_method',
        amount: data.amount,
        currency: data.currency || 'usd'
      };
    },
    retrieve: async (id) => {
      console.log('Mock Stripe - Retrieving payment intent:', id);
      return {
        id: id,
        status: 'succeeded',
        amount: 1000, // example amount
        currency: 'usd',
        payment_method_types: ['card']
      };
    }
  },
  refunds: {
    create: async (data) => {
      console.log('Mock Stripe - Creating refund:', data);
      return {
        id: `re_mock_${Date.now()}`,
        status: 'succeeded',
        amount: data.amount,
        currency: 'usd'
      };
    }
  }
};

// Export either real Stripe or mock based on environment
const stripe = process.env.NODE_ENV === 'production' && process.env.STRIPE_SECRET_KEY 
  ? require('stripe')(process.env.STRIPE_SECRET_KEY)
  : mockStripe;

export default stripe;