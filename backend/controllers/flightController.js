// backend/controllers/flightController.js
const Flight = require('../models/Flight');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all flights with filtering, sorting, and pagination
// @route   GET /api/flights
// @access  Public
exports.getFlights = asyncHandler(async (req, res, next) => {
  // Copy req.query
  const reqQuery = { ...req.query };
  
  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit'];
  removeFields.forEach(param => delete reqQuery[param]);
  
  // Create query string
  let queryStr = JSON.stringify(reqQuery);
  
  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
  
  // Finding resource
  let query = Flight.find(JSON.parse(queryStr));
  
  // Select fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }
  
  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('departureTime');
  }
  
  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Flight.countDocuments(JSON.parse(queryStr));
  
  query = query.skip(startIndex).limit(limit);
  
  // Executing query
  const flights = await query;
  
  // Pagination result
  const pagination = {};
  
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }
  
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }
  
  res.status(200).json({
    success: true,
    count: flights.length,
    pagination,
    data: flights
  });
});

// @desc    Get single flight
// @route   GET /api/flights/:id
// @access  Public
exports.getFlight = asyncHandler(async (req, res, next) => {
  const flight = await Flight.findById(req.params.id);
  
  if (!flight) {
    return next(new ErrorResponse(`Flight not found with id of ${req.params.id}`, 404));
  }
  
  res.status(200).json({
    success: true,
    data: flight
  });
});

// @desc    Create new flight
// @route   POST /api/flights
// @access  Private/Admin
exports.createFlight = asyncHandler(async (req, res, next) => {
  const flight = await Flight.create(req.body);
  
  res.status(201).json({
    success: true,
    data: flight
  });
});

// @desc    Update flight
// @route   PUT /api/flights/:id
// @access  Private/Admin
exports.updateFlight = asyncHandler(async (req, res, next) => {
  const flight = await Flight.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  if (!flight) {
    return next(new ErrorResponse(`Flight not found with id of ${req.params.id}`, 404));
  }
  
  res.status(200).json({
    success: true,
    data: flight
  });
});

// @desc    Delete flight
// @route   DELETE /api/flights/:id
// @access  Private/Admin
exports.deleteFlight = asyncHandler(async (req, res, next) => {
  const flight = await Flight.findByIdAndDelete(req.params.id);
  
  if (!flight) {
    return next(new ErrorResponse(`Flight not found with id of ${req.params.id}`, 404));
  }
  
  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get flights by search criteria
// @route   POST /api/flights/search
// @access  Public
exports.searchFlights = asyncHandler(async (req, res, next) => {
  const { origin, destination, departureDate, returnDate, travelers, class: cabinClass } = req.body;
  
  // Validate required fields
  if (!origin || !destination || !departureDate) {
    return next(new ErrorResponse('Please provide origin, destination, and departure date', 400));
  }
  
  // Parse departure date
  const startOfDay = new Date(departureDate);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(departureDate);
  endOfDay.setHours(23, 59, 59, 999);
  
  // Build query
  let query = {
    origin: new RegExp(origin, 'i'),
    destination: new RegExp(destination, 'i'),
    departureTime: {
      $gte: startOfDay,
      $lte: endOfDay
    }
  };
  
  // Add capacity check based on travelers
  if (travelers) {
    const capacityField = `${cabinClass || 'economy'}SeatsAvailable`;
    query[capacityField] = { $gte: parseInt(travelers) };
  }
  
  // Execute query
  const flights = await Flight.find(query).sort('departureTime');
  
  // If round trip, search for return flights
  let returnFlights = [];
  if (returnDate) {
    const returnStartOfDay = new Date(returnDate);
    returnStartOfDay.setHours(0, 0, 0, 0);
    
    const returnEndOfDay = new Date(returnDate);
    returnEndOfDay.setHours(23, 59, 59, 999);
    
    const returnQuery = {
      origin: new RegExp(destination, 'i'),
      destination: new RegExp(origin, 'i'),
      departureTime: {
        $gte: returnStartOfDay,
        $lte: returnEndOfDay
      }
    };
    
    if (travelers) {
      const capacityField = `${cabinClass || 'economy'}SeatsAvailable`;
      returnQuery[capacityField] = { $gte: parseInt(travelers) };
    }
    
    returnFlights = await Flight.find(returnQuery).sort('departureTime');
  }
  
  res.status(200).json({
    success: true,
    count: flights.length,
    data: {
      departureFlights: flights,
      returnFlights: returnFlights
    }
  });
});

// @desc    Get available seats for a flight
// @route   GET /api/flights/:id/seats
// @access  Public
exports.getAvailableSeats = asyncHandler(async (req, res, next) => {
  const flight = await Flight.findById(req.params.id);
  
  if (!flight) {
    return next(new ErrorResponse(`Flight not found with id of ${req.params.id}`, 404));
  }
  
  // Get booked seats from bookings
  const bookings = await Booking.find({ 
    flight: req.params.id,
    status: { $in: ['confirmed', 'pending'] }
  });
  
  const bookedSeats = bookings.flatMap(booking => booking.seats);
  
  res.status(200).json({
    success: true,
    data: {
      flight: flight._id,
      bookedSeats,
      seatMap: flight.seatMap
    }
  });
});