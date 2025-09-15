import { body, validationResult } from 'express-validator'

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    })
  }
  next()
}

// User validation rules
export const validateUserRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('phone')
    .matches(/^\+?[1-9]\d{1,14}$/)
    .withMessage('Please provide a valid phone number'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
]

export const validateUserLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
]

// Flight search validation
export const validateFlightSearch = [
  body('origin')
    .trim()
    .notEmpty()
    .withMessage('Origin is required'),
  body('destination')
    .trim()
    .notEmpty()
    .withMessage('Destination is required'),
  body('departureDate')
    .isISO8601()
    .withMessage('Please provide a valid departure date'),
  body('returnDate')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid return date')
    .custom((value, { req }) => {
      if (new Date(value) < new Date(req.body.departureDate)) {
        throw new Error('Return date must be after departure date')
      }
      return true
    })
]

// Booking validation
export const validateBooking = [
  body('flightId')
    .isMongoId()
    .withMessage('Please provide a valid flight ID'),
  body('passengers')
    .isArray({ min: 1 })
    .withMessage('At least one passenger is required'),
  body('passengers.*.firstName')
    .trim()
    .notEmpty()
    .withMessage('Passenger first name is required'),
  body('passengers.*.lastName')
    .trim()
    .notEmpty()
    .withMessage('Passenger last name is required'),
  body('passengers.*.gender')
    .isIn(['male', 'female', 'other'])
    .withMessage('Please provide a valid gender'),
  body('passengers.*.dateOfBirth')
    .isISO8601()
    .withMessage('Please provide a valid date of birth'),
  body('contactInfo.email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('contactInfo.phone')
    .matches(/^\+?[1-9]\d{1,14}$/)
    .withMessage('Please provide a valid phone number')
]