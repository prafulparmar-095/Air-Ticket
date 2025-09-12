const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { body, validationResult } = require('express-validator')
const User = require('../models/User')
const router = express.Router()

// Register
router.post('/register', [
  body('name').trim().isLength({ min: 2 }),
  body('email').isEmail(),
  body('password').isLength({ min: 6 })
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { name, email, password } = req.body

    // Check if user exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' })
    }

    // Create user
    const user = new User({ name, email, password })
    await user.save()

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    )

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email }
    })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Login
router.post('/login', [
  body('email').isEmail(),
  body('password').exists()
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body

    // Find user
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    )

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email }
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router