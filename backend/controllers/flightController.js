import Flight from '../models/Flight.js'

// @desc    Search flights
// @route   GET /api/flights/search
// @access  Public
export const searchFlights = async (req, res) => {
  try {
    const {
      origin,
      destination,
      departureDate,
      returnDate,
      adult = 1,
      child = 0,
      infant = 0,
      cabinClass = 'economy',
      tripType = 'one-way'
    } = req.query

    // Build search query
    const searchQuery = {
      origin: new RegExp(origin, 'i'),
      destination: new RegExp(destination, 'i'),
      departureTime: {
        $gte: new Date(departureDate),
        $lt: new Date(new Date(departureDate).setDate(new Date(departureDate).getDate() + 1))
      },
      status: 'scheduled'
    }

    // Search for flights
    const flights = await Flight.find(searchQuery)
      .sort({ departureTime: 1, price: 1 })
      .lean()

    // Filter flights with available seats
    const totalPassengers = parseInt(adult) + parseInt(child) + parseInt(infant)
    const availableFlights = flights.filter(flight => 
      flight.availableSeats[cabinClass] >= totalPassengers
    )

    // Calculate prices based on cabin class and passenger type
    const processedFlights = availableFlights.map(flight => {
      const basePrice = flight.price
      let totalPrice = 0
      
      // Add adult prices
      totalPrice += basePrice * parseInt(adult)
      
      // Add child prices (50% of adult price)
      totalPrice += (basePrice * 0.5) * parseInt(child)
      
      // Add infant prices (10% of adult price)
      totalPrice += (basePrice * 0.1) * parseInt(infant)
      
      // Apply cabin class multiplier
      const cabinMultipliers = {
        economy: 1,
        premium_economy: 1.5,
        business: 2.5,
        first: 4
      }
      totalPrice *= cabinMultipliers[cabinClass]

      return {
        ...flight,
        price: Math.round(totalPrice)
      }
    })

    res.json({
      success: true,
      count: processedFlights.length,
      flights: processedFlights
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error searching flights',
      error: error.message
    })
  }
}

// @desc    Get all flights
// @route   GET /api/flights
// @access  Public
export const getFlights = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = 'departureTime',
      order = 'asc'
    } = req.query

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { [sort]: order === 'asc' ? 1 : -1 }
    }

    const flights = await Flight.find()
      .sort(options.sort)
      .limit(options.limit)
      .skip((options.page - 1) * options.limit)

    const total = await Flight.countDocuments()

    res.json({
      success: true,
      count: flights.length,
      total,
      page: options.page,
      pages: Math.ceil(total / options.limit),
      flights
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching flights',
      error: error.message
    })
  }
}

// @desc    Get single flight
// @route   GET /api/flights/:id
// @access  Public
export const getFlight = async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id)

    if (!flight) {
      return res.status(404).json({
        success: false,
        message: 'Flight not found'
      })
    }

    res.json({
      success: true,
      flight
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching flight',
      error: error.message
    })
  }
}

// @desc    Create flight
// @route   POST /api/flights
// @access  Private/Admin
export const createFlight = async (req, res) => {
  try {
    const flight = await Flight.create(req.body)

    res.status(201).json({
      success: true,
      message: 'Flight created successfully',
      flight
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error creating flight',
      error: error.message
    })
  }
}

// @desc    Update flight
// @route   PUT /api/flights/:id
// @access  Private/Admin
export const updateFlight = async (req, res) => {
  try {
    const flight = await Flight.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    if (!flight) {
      return res.status(404).json({
        success: false,
        message: 'Flight not found'
      })
    }

    res.json({
      success: true,
      message: 'Flight updated successfully',
      flight
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error updating flight',
      error: error.message
    })
  }
}

// @desc    Delete flight
// @route   DELETE /api/flights/:id
// @access  Private/Admin
export const deleteFlight = async (req, res) => {
  try {
    const flight = await Flight.findByIdAndDelete(req.params.id)

    if (!flight) {
      return res.status(404).json({
        success: false,
        message: 'Flight not found'
      })
    }

    res.json({
      success: true,
      message: 'Flight deleted successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error deleting flight',
      error: error.message
    })
  }
}