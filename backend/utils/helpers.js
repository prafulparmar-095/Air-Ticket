import jwt from 'jsonwebtoken'

// Generate JWT Token
export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  })
}

// Generate random string
export const generateRandomString = (length = 8) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}

// Format currency
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount)
}

// Calculate flight duration
export const calculateDuration = (departureTime, arrivalTime) => {
  const departure = new Date(departureTime)
  const arrival = new Date(arrivalTime)
  return Math.round((arrival - departure) / (1000 * 60)) // in minutes
}

// Validate email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate phone number
export const isValidPhone = (phone) => {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/
  return phoneRegex.test(phone)
}

// Pagination helper
export const paginate = (array, page = 1, limit = 10) => {
  const startIndex = (page - 1) * limit
  const endIndex = page * limit
  
  const results = {}
  results.total = array.length
  results.pages = Math.ceil(array.length / limit)
  
  if (endIndex < array.length) {
    results.next = page + 1
  }
  
  if (startIndex > 0) {
    results.previous = page - 1
  }
  
  results.data = array.slice(startIndex, endIndex)
  return results
}