const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  next();
};

const registerValidation = [
  body('firstName')
    .trim()
    .isLength({ min: 2 })
    .withMessage('First name must be at least 2 characters long'),
  body('lastName')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Last name must be at least 2 characters long'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('phone')
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  body('dateOfBirth')
    .isDate()
    .withMessage('Please provide a valid date of birth'),
  handleValidationErrors
];

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

const flightValidation = [
  body('flightNumber')
    .notEmpty()
    .withMessage('Flight number is required'),
  body('airline')
    .notEmpty()
    .withMessage('Airline is required'),
  body('departure.airport')
    .notEmpty()
    .withMessage('Departure airport is required'),
  body('departure.datetime')
    .isISO8601()
    .withMessage('Valid departure datetime is required'),
  body('departure.city')
    .notEmpty()
    .withMessage('Departure city is required'),
  body('arrival.airport')
    .notEmpty()
    .withMessage('Arrival airport is required'),
  body('arrival.datetime')
    .isISO8601()
    .withMessage('Valid arrival datetime is required'),
  body('arrival.city')
    .notEmpty()
    .withMessage('Arrival city is required'),
  body('duration')
    .isInt({ min: 1 })
    .withMessage('Duration must be a positive number'),
  body('aircraft')
    .notEmpty()
    .withMessage('Aircraft is required'),
  body('prices.economy')
    .isFloat({ min: 0 })
    .withMessage('Economy price must be a positive number'),
  body('prices.business')
    .isFloat({ min: 0 })
    .withMessage('Business price must be a positive number'),
  body('prices.first')
    .isFloat({ min: 0 })
    .withMessage('First class price must be a positive number'),
  handleValidationErrors
];

const bookingValidation = [
  body('flightId')
    .isMongoId()
    .withMessage('Valid flight ID is required'),
  body('passengers')
    .isArray({ min: 1 })
    .withMessage('At least one passenger is required'),
  body('passengers.*.firstName')
    .notEmpty()
    .withMessage('Passenger first name is required'),
  body('passengers.*.lastName')
    .notEmpty()
    .withMessage('Passenger last name is required'),
  body('passengers.*.dateOfBirth')
    .isDate()
    .withMessage('Valid passenger date of birth is required'),
  body('passengers.*.seat.number')
    .notEmpty()
    .withMessage('Seat number is required'),
  body('passengers.*.seat.class')
    .isIn(['economy', 'business', 'first'])
    .withMessage('Valid seat class is required'),
  body('contactEmail')
    .isEmail()
    .withMessage('Valid contact email is required'),
  body('contactPhone')
    .isMobilePhone()
    .withMessage('Valid contact phone is required'),
  handleValidationErrors
];

const paymentValidation = [
  body('bookingId')
    .isMongoId()
    .withMessage('Valid booking ID is required'),
  body('paymentMethod')
    .isIn(['credit_card', 'debit_card', 'paypal', 'bank_transfer'])
    .withMessage('Valid payment method is required'),
  handleValidationErrors
];

module.exports = {
  registerValidation,
  loginValidation,
  flightValidation,
  bookingValidation,
  paymentValidation,
  handleValidationErrors
};