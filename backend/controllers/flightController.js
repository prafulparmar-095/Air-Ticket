// backend/controllers/flightController.js
const Flight = require('../models/Flight');
const axios = require('axios');

// Search flights
exports.searchFlights = async (req, res) => {
  try {
    const { origin, destination, departureDate, returnDate, passengers } = req.query;
    
    // Try to get flights from database first
    let flights = await Flight.find({
      origin: new RegExp(origin, 'i'),
      destination: new RegExp(destination, 'i'),
      departureDate: { $gte: new Date(departureDate) }
    }).populate('airline');
    
    // If no flights found in database, try to fetch from AviationStack API
    if (flights.length === 0) {
      flights = await fetchFromAviationStack(origin, destination, departureDate);
      
      // Save fetched flights to database for future requests
      if (flights.length > 0) {
        await Flight.insertMany(flights);
      }
    }
    
    // Check seat availability
    const availableFlights = flights.filter(flight => 
      flight.availableSeats >= parseInt(passengers || 1)
    );
    
    res.json({
      success: true,
      count: availableFlights.length,
      data: availableFlights
    });
  } catch (error) {
    console.error('Flight search error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Fetch flights from AviationStack API
const fetchFromAviationStack = async (origin, destination, date) => {
  try {
    const accessKey = process.env.AVIATIONSTACK_API_KEY;
    
    if (!accessKey) {
      console.warn('AviationStack API key not configured');
      return [];
    }
    
    const response = await axios.get('http://api.aviationstack.com/v1/flights', {
      params: {
        access_key: accessKey,
        dep_iata: origin,
        arr_iata: destination,
        flight_date: date,
        limit: 20
      }
    });
    
    if (response.data && response.data.data) {
      return response.data.data.map(flight => ({
        airline: flight.airline?.name || 'Unknown Airline',
        airlineCode: flight.airline?.iata || 'UA',
        flightNumber: flight.flight?.iata || 'UA000',
        origin: flight.departure?.airport || origin,
        destination: flight.arrival?.airport || destination,
        departureTime: flight.departure?.scheduled ? 
          new Date(flight.departure.scheduled).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '00:00',
        arrivalTime: flight.arrival?.scheduled ? 
          new Date(flight.arrival.scheduled).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '00:00',
        departureDate: date,
        duration: calculateFlightDuration(flight.departure?.scheduled, flight.arrival?.scheduled),
        price: calculateFlightPrice(origin, destination),
        availableSeats: Math.floor(Math.random() * 50) + 10, // Mock available seats
        stops: Math.floor(Math.random() * 2), // Mock stops
        aircraft: flight.aircraft?.iata || 'B737'
      }));
    }
    
    return [];
  } catch (error) {
    console.error('AviationStack API error:', error);
    return [];
  }
};

// Calculate flight duration
const calculateFlightDuration = (departureTime, arrivalTime) => {
  if (!departureTime || !arrivalTime) return '2h 30m';
  
  const dep = new Date(departureTime);
  const arr = new Date(arrivalTime);
  const durationMs = arr - dep;
  
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${hours}h ${minutes}m`;
};

// Calculate flight price based on route and random factors
const calculateFlightPrice = (origin, destination) => {
  // Base price based on route distance (simplified)
  const routeFactors = {
    'NYC-LAX': 300,
    'NYC-LON': 400,
    'NYC-PAR': 450,
    'NYC-DXB': 600,
    'LAX-LON': 500,
    'LAX-SYD': 700
  };
  
  const routeKey = `${origin}-${destination}`;
  const basePrice = routeFactors[routeKey] || 200;
  
  // Add random variation
  const variation = Math.random() * 100 - 50;
  
  return Math.max(100, Math.round(basePrice + variation));
};

// Get flight by ID
exports.getFlight = async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id).populate('airline');
    
    if (!flight) {
      return res.status(404).json({
        success: false,
        message: 'Flight not found'
      });
    }
    
    res.json({
      success: true,
      data: flight
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Create new flight (admin only)
exports.createFlight = async (req, res) => {
  try {
    const flight = new Flight(req.body);
    await flight.save();
    
    res.status(201).json({
      success: true,
      data: flight
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating flight',
      error: error.message
    });
  }
};

// Update flight (admin only)
exports.updateFlight = async (req, res) => {
  try {
    const flight = await Flight.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!flight) {
      return res.status(404).json({
        success: false,
        message: 'Flight not found'
      });
    }
    
    res.json({
      success: true,
      data: flight
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating flight',
      error: error.message
    });
  }
};

// Delete flight (admin only)
exports.deleteFlight = async (req, res) => {
  try {
    const flight = await Flight.findByIdAndDelete(req.params.id);
    
    if (!flight) {
      return res.status(404).json({
        success: false,
        message: 'Flight not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Flight deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};