const express = require('express')
const Booking = require('../models/Booking')
const Flight = require('../models/Flight')
const router = express.Router()

// Create booking
router.post('/', async (req, res) => {
  try {
    const { flightId, passengers } = req.body

    const flight = await Flight.findById(flightId)
    if (!flight) {
      return res.status(404).json({ message: 'Flight not found' })
    }

    const booking = new Booking({
      flight: flightId,
      passengers,
      totalAmount: flight.price * passengers.length
    })

    await booking.save()
    await booking.populate('flight')

    res.status(201).json(booking)
  } catch (error) {
    console.error('Create booking error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get user bookings
router.get('/user/:userId', async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.params.userId })
      .populate('flight')
    res.json(bookings)
  } catch (error) {
    console.error('Get bookings error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router