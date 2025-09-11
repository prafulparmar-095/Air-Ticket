const Flight = require('../models/Flight');

// Get all flights
const getFlights = async (req, res) => {
  try {
    const { from, to, departure, page = 1, limit = 10 } = req.query;
    
    let query = {};
    
    if (from) query['departure.city'] = new RegExp(from, 'i');
    if (to) query['arrival.city'] = new RegExp(to, 'i');
    if (departure) {
      const startDate = new Date(departure);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
      
      query['departure.time'] = { $gte: startDate, $lt: endDate };
    }
    
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { 'departure.time': 1 }
    };
    
    const flights = await Flight.find(query)
      .limit(options.limit * 1)
      .skip((options.page - 1) * options.limit)
      .sort(options.sort);
    
    const total = await Flight.countDocuments(query);
    
    res.json({ flights, totalPages: Math.ceil(total / options.limit), currentPage: options.page, total });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get single flight
const getFlight = async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id);
    if (!flight) {
      return res.status(404).json({ message: 'Flight not found' });
    }
    res.json(flight);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Create flight
const createFlight = async (req, res) => {
  try {
    const flight = new Flight(req.body);
    await flight.save();
    res.json(flight);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Update flight
const updateFlight = async (req, res) => {
  try {
    const flight = await Flight.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!flight) {
      return res.status(404).json({ message: 'Flight not found' });
    }
    res.json(flight);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Delete flight
const deleteFlight = async (req, res) => {
  try {
    const flight = await Flight.findByIdAndDelete(req.params.id);
    if (!flight) {
      return res.status(404).json({ message: 'Flight not found' });
    }
    res.json({ message: 'Flight removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

module.exports = { getFlights, getFlight, createFlight, updateFlight, deleteFlight };