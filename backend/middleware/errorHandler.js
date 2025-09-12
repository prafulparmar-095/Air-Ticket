const errorHandler = (err, req, res, next) => {
  console.error('Error:', err)

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(error => error.message)
    return res.status(400).json({ message: 'Validation error', errors })
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0]
    return res.status(400).json({ message: `${field} already exists` })
  }

  // JWT error
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: 'Invalid token' })
  }

  // JWT expired error
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ message: 'Token expired' })
  }

  // Default error
  res.status(500).json({ message: 'Server error' })
}

module.exports = errorHandler