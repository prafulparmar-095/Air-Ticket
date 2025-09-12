const FLIGHT_CLASS = {
  ECONOMY: 'economy',
  BUSINESS: 'business',
  FIRST: 'first'
}

const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled'
}

const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded'
}

const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin'
}

module.exports = {
  FLIGHT_CLASS,
  BOOKING_STATUS,
  PAYMENT_STATUS,
  USER_ROLES
}