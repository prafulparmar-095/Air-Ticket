const Flight = require('../models/Flight');

const getFlights = async (req, res) => {
  try {
    const { 
      departure, 
      arrival, 
      departureDate, 
      passengers, 
      class: flightClass, 
      page = 1, 
      limit = 10 
    } = req.query;

    let query = {};

    if (departure) {
      query['departure.city'] = new RegExp(departure, 'i');
    }

    if (arrival) {
      query['arrival.city'] = new RegExp(arrival, 'i');
    }

    if (departureDate) {
      const startDate = new Date(departureDate);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
      
      query['departure.datetime'] = {
        $gte: startDate,
        $lt: endDate
      };
    }

    const skip = (page - 1) * limit;

    const flights = await Flight.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ 'departure.datetime': 1 });

    const total = await Flight.countDocuments(query);

    res.json({
      flights,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getFlight = async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id);
    
    if (!flight) {
      return res.status(404).json({ message: 'Flight not found' });
    }

    res.json(flight);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createFlight = async (req, res) => {
  try {
    const flight = new Flight(req.body);
    const savedFlight = await flight.save();
    res.status(201).json(savedFlight);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateFlight = async (req, res) => {
  try {
    const flight = await Flight.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!flight) {
      return res.status(404).json({ message: 'Flight not found' });
    }

    res.json(flight);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteFlight = async (req, res) => {
  try {
    const flight = await Flight.findByIdAndDelete(req.params.id);

    if (!flight) {
      return res.status(404).json({ message: 'Flight not found' });
    }

    res.json({ message: 'Flight deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAvailableSeats = async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id);
    
    if (!flight) {
      return res.status(404).json({ message: 'Flight not found' });
    }

    const availableSeats = flight.seats.filter(seat => seat.isAvailable);
    res.json(availableSeats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getFlights,
  getFlight,
  createFlight,
  updateFlight,
  deleteFlight,
  getAvailableSeats
};