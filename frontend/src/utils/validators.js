export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password) => {
  return password.length >= 6
}

export const validateName = (name) => {
  return name.length >= 2
}

export const validatePhone = (phone) => {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/
  return phoneRegex.test(phone)
}

export const validateDate = (date) => {
  return date instanceof Date && !isNaN(date)
}

export const validateFlightSearch = (data) => {
  const errors = {}
  
  if (!data.origin) errors.origin = 'Origin is required'
  if (!data.destination) errors.destination = 'Destination is required'
  if (data.origin === data.destination) errors.destination = 'Origin and destination cannot be the same'
  if (!data.departureDate) errors.departureDate = 'Departure date is required'
  if (data.returnDate && new Date(data.returnDate) < new Date(data.departureDate)) {
    errors.returnDate = 'Return date must be after departure date'
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}