export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user'
};

export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled'
};

export const CURRENCY_SYMBOL = '₹';