export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

export const FLIGHT_CLASS = {
  ECONOMY: 'economy',
  BUSINESS: 'business',
  FIRST: 'first'
}

export const PASSENGER_TYPES = {
  ADULT: 'adult',
  CHILD: 'child',
  INFANT: 'infant'
}

export const PAYMENT_METHODS = {
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD: 'debit_card',
  PAYPAL: 'paypal'
}

export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled'
}