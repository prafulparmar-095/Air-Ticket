import api from './api';

export const paymentService = {
  createPaymentIntent: async (data) => {
    const response = await api.post('/payments/create-intent', data);
    return response.data;
  },

  confirmPayment: async (data) => {
    const response = await api.post('/payments/confirm', data);
    return response.data;
  },

  getPayment: async (id) => {
    const response = await api.get(`/payments/${id}`);
    return response.data;
  },

  refundPayment: async (data) => {
    const response = await api.post('/payments/refund', data);
    return response.data;
  }
};