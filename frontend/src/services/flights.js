import api from './api'

// Make sure the export name matches what you're importing
export const flightsService = {
  search: (searchParams) => api.get('/flights/search', { params: searchParams }),
  getAll: () => api.get('/flights'),
  getById: (id) => api.get(`/flights/${id}`),
  create: (flightData) => api.post('/flights', flightData),
  update: (id, flightData) => api.put(`/flights/${id}`, flightData),
  delete: (id) => api.delete(`/flights/${id}`),
  getSeats: (flightId) => api.get(`/flights/${flightId}/seats`),
}

// Also export as default for easier imports
export default flightsService