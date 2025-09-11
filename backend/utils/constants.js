// User roles
const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user'
};

// Booking statuses
const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled'
};

// Flight statuses
const FLIGHT_STATUS = {
  SCHEDULED: 'scheduled',
  DELAYED: 'delayed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed'
};

// Payment statuses
const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded'
};

// API response messages
const MESSAGES = {
  AUTH: {
    INVALID_CREDENTIALS: 'Invalid credentials',
    USER_EXISTS: 'User already exists',
    ACCESS_DENIED: 'Access denied',
    TOKEN_INVALID: 'Token is not valid'
  },
  FLIGHT: {
    NOT_FOUND: 'Flight not found',
    SEATS_UNAVAILABLE: 'Not enough seats available'
  },
  BOOKING: {
    NOT_FOUND: 'Booking not found'
  },
  USER: {
    NOT_FOUND: 'User not found'
  },
  VALIDATION: {
    FAILED: 'Validation failed'
  }
};

module.exports = { USER_ROLES, BOOKING_STATUS, FLIGHT_STATUS, PAYMENT_STATUS, MESSAGES };