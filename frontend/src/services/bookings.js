import api from './api'

export const bookingsService = {
  create: (bookingData) => api.post('/bookings', bookingData),
  getAll: () => api.get('/bookings'),
  getById: (id) => api.get(`/bookings/${id}`),
  getUserBookings: () => api.get('/bookings/user'),
  update: (id, bookingData) => api.put(`/bookings/${id}`, bookingData),
  cancel: (id) => api.delete(`/bookings/${id}`),
  getBookingByFlight: (flightId) => api.get(`/bookings/flight/${flightId}`),
}

export default bookingsService