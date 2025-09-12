const express = require('express')
const Flight = require('../models/Flight')
const router = express.Router()

// Get all flights
router.get('/', async (req, res) => {
  try {
    const flights = await Flight.find({ available: true })
    res.json(flights)
  } catch (error) {
    console.error('Get flights error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Search flights
router.get('/search', async (req, res) => {
  try {
    const { origin, destination, departureDate } = req.query

    if (!origin || !destination) {
      return res.status(400).json({ message: 'Origin and destination are required' })
    }

    let query = {
      origin: new RegExp(origin, 'i'),
      destination: new RegExp(destination, 'i'),
      available: true
    }

    if (departureDate) {
      const startDate = new Date(departureDate)
      const endDate = new Date(startDate)
      endDate.setDate(endDate.getDate() + 1)
      query.departureTime = { $gte: startDate, $lt: endDate }
    }

    const flights = await Flight.find(query).sort({ departureTime: 1 })
    res.json(flights)
  } catch (error) {
    console.error('Search flights error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router