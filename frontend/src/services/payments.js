import api from './api'

export const paymentsService = {
  createIntent: (bookingId) => api.post(`/payments/create-intent/${bookingId}`),
  confirm: (paymentData) => api.post('/payments/confirm', paymentData),
  getByBooking: (bookingId) => api.get(`/payments/booking/${bookingId}`),
  refund: (paymentId) => api.post(`/payments/${paymentId}/refund`),
}

export default paymentsService