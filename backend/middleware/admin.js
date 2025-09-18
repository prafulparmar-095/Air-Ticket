const { ForbiddenError } = require('../utils/errorResponse');

// Admin authorization middleware
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return next(new ForbiddenError('Authentication required'));
  }

  if (req.user.role !== 'admin') {
    return next(new ForbiddenError('Admin access required'));
  }

  next();
};

// Admin or owner authorization middleware
const requireAdminOrOwner = (req, res, next) => {
  if (!req.user) {
    return next(new ForbiddenError('Authentication required'));
  }

  // Allow if user is admin or owns the resource
  if (req.user.role === 'admin' || req.user._id.toString() === req.params.userId) {
    return next();
  }

  return next(new ForbiddenError('Admin or owner access required'));
};

module.exports = {
  requireAdmin,
  requireAdminOrOwner
};