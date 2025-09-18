import api from './api';

export const adminService = {
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard/stats');
    return response.data;
  },

  getUsers: async (params) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  updateUserRole: async (userId, role) => {
    const response = await api.put(`/admin/users/${userId}/role`, { role });
    return response.data;
  },

  getBookings: async (params) => {
    const response = await api.get('/admin/bookings', { params });
    return response.data;
  },

  updateBookingStatus: async (bookingId, status) => {
    const response = await api.put(`/admin/bookings/${bookingId}/status`, { status });
    return response.data;
  }
};