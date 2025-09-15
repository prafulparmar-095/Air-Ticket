export const CITIES = [
  'New York', 'London', 'Paris', 'Tokyo', 'Dubai', 'Singapore', 'Sydney',
  'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune'
]

export const AIRLINES = [
  'Air India',
  'Emirates',
  'British Airways',
  'Lufthansa',
  'Qatar Airways',
  'Singapore Airlines',
  'Delta Air Lines',
  'United Airlines',
  'American Airlines',
  'Air France'
]

export const AIRCRAFTS = [
  'Boeing 737',
  'Boeing 777',
  'Boeing 787',
  'Airbus A320',
  'Airbus A330',
  'Airbus A350',
  'Airbus A380'
]

export const CABIN_CLASSES = [
  { value: 'economy', label: 'Economy', multiplier: 1 },
  { value: 'premium_economy', label: 'Premium Economy', multiplier: 1.5 },
  { value: 'business', label: 'Business', multiplier: 2.5 },
  { value: 'first', label: 'First Class', multiplier: 4 }
]

export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded'
}

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded'
}

export const FLIGHT_STATUS = {
  SCHEDULED: 'scheduled',
  BOARDING: 'boarding',
  DEPARTED: 'departed',
  ARRIVED: 'arrived',
  DELAYED: 'delayed',
  CANCELLED: 'cancelled'
}