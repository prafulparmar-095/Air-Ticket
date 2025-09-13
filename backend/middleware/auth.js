// backend/middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('./asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// Protect routes - verify JWT token
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  console.log('Authorization header:', req.headers.authorization);

  // Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    console.log('Token found:', token ? 'Yes' : 'No');
  }

  // Also check for token in cookies (if using cookies)
  if (!token && req.cookies && req.cookies.token) {
    token = req.cookies.token;
    console.log('Token from cookies:', token ? 'Yes' : 'No');
  }

  // Make sure token exists
  if (!token) {
    console.log('No token provided');
    return next(new ErrorResponse('Not authorized to access this route. No token provided.', 401));
  }

  try {
    // Verify token
    console.log('Verifying token with secret:', process.env.JWT_SECRET ? 'Secret exists' : 'No secret found');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decoded:', decoded);
    
    // Get user from token
    req.user = await User.findById(decoded.id).select('-password');
    console.log('User found:', req.user ? `Yes (${req.user.email})` : 'No');
    
    if (!req.user) {
      console.log('No user found with id from token');
      return next(new ErrorResponse('No user found with this id', 404));
    }
    
    next();
  } catch (error) {
    console.log('Token verification error:', error.message);
    
    if (error.name === 'JsonWebTokenError') {
      return next(new ErrorResponse('Invalid token', 401));
    }
    
    if (error.name === 'TokenExpiredError') {
      return next(new ErrorResponse('Token expired', 401));
    }
    
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
});

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    console.log('Authorizing user role:', req.user?.role);
    console.log('Required roles:', roles);
    
    if (!req.user) {
      console.log('No user found in request');
      return next(new ErrorResponse('Not authorized - no user information', 401));
    }
    
    if (!roles.includes(req.user.role)) {
      console.log(`User role ${req.user.role} not in required roles: ${roles}`);
      return next(
        new ErrorResponse(`User role ${req.user.role} is not authorized to access this route`, 403)
      );
    }
    
    console.log('Authorization successful');
    next();
  };
};

// Optional: Add a debug middleware to check authentication status
exports.debugAuth = (req, res, next) => {
  console.log('=== AUTH DEBUG INFO ===');
  console.log('Headers:', req.headers);
  console.log('Cookies:', req.cookies);
  console.log('User:', req.user);
  console.log('========================');
  next();
};