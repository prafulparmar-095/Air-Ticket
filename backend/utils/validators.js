const mongoose = require('mongoose');

// Validate MongoDB ObjectId
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// Validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone number (basic international format)
const isValidPhone = (phone) => {
  const phoneRegex = /^\+[1-9]\d{1,14}$/;
  return phoneRegex.test(phone);
};

// Validate password strength
const isStrongPassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// Validate date is in the future
const isFutureDate = (date) => {
  return new Date(date) > new Date();
};

// Validate date is in the past
const isPastDate = (date) => {
  return new Date(date) < new Date();
};

// Validate flight number format (e.g., AI101, UA456)
const isValidFlightNumber = (flightNumber) => {
  const flightRegex = /^[A-Z]{2,3}\d{1,4}$/;
  return flightRegex.test(flightNumber);
};

// Validate airport code (3-letter IATA code)
const isValidAirportCode = (code) => {
  const airportRegex = /^[A-Z]{3}$/;
  return airportRegex.test(code);
};

// Validate currency amount (positive number with 2 decimal places)
const isValidCurrency = (amount) => {
  const currencyRegex = /^\d+(\.\d{1,2})?$/;
  return currencyRegex.test(amount) && parseFloat(amount) > 0;
};

// Validate seat number format (e.g., 12A, 1B, 25C)
const isValidSeatNumber = (seatNumber) => {
  const seatRegex = /^[1-9]\d*[A-Z]$/;
  return seatRegex.test(seatNumber);
};

// Validate passport number (basic format validation)
const isValidPassport = (passportNumber) => {
  const passportRegex = /^[A-Z0-9]{6,9}$/;
  return passportRegex.test(passportNumber);
};

// Validate credit card number (Luhn algorithm)
const isValidCreditCard = (cardNumber) => {
  // Remove spaces and dashes
  const cleaned = cardNumber.replace(/[\s-]/g, '');
  
  // Check if it's all digits and proper length
  if (!/^\d{13,19}$/.test(cleaned)) {
    return false;
  }

  // Luhn algorithm
  let sum = 0;
  let shouldDouble = false;
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned.charAt(i));
    
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  
  return sum % 10 === 0;
};

// Validate CVV (3 or 4 digits)
const isValidCVV = (cvv) => {
  return /^\d{3,4}$/.test(cvv);
};

// Validate expiration date (MM/YY or MM/YYYY format)
const isValidExpiryDate = (expiryDate) => {
  const expiryRegex = /^(0[1-9]|1[0-2])\/(\d{2}|\d{4})$/;
  if (!expiryRegex.test(expiryDate)) {
    return false;
  }

  const [month, year] = expiryDate.split('/');
  const expiryYear = year.length === 2 ? `20${year}` : year;
  const expiry = new Date(expiryYear, month - 1);
  const now = new Date();
  
  return expiry > now;
};

module.exports = {
  isValidObjectId,
  isValidEmail,
  isValidPhone,
  isStrongPassword,
  isFutureDate,
  isPastDate,
  isValidFlightNumber,
  isValidAirportCode,
  isValidCurrency,
  isValidSeatNumber,
  isValidPassport,
  isValidCreditCard,
  isValidCVV,
  isValidExpiryDate
};