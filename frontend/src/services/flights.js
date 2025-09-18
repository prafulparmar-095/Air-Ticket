// src/services/flights.js
import api from './api';

export const flightsService = {
  searchFlights: async (searchParams) => {
    const response = await api.get('/flights', { params: searchParams });
    return response.data;
  },

  getFlight: async (id) => {
    const response = await api.get(`/flights/${id}`);
    return response.data;
  },

  getAvailableSeats: async (id) => {
    const response = await api.get(`/flights/${id}/seats`);
    return response.data;
  },

  // Admin functions
  createFlight: async (flightData) => {
    const response = await api.post('/flights', flightData);
    return response.data;
  },

  updateFlight: async (id, flightData) => {
    const response = await api.put(`/flights/${id}`, flightData);
    return response.data;
  },

  deleteFlight: async (id) => {
    const response = await api.delete(`/flights/${id}`);
    return response.data;
  }
};
