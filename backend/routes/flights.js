const express = require('express');
const { body, validationResult } = require('express-validator');
const Flight = require('../models/Flight');

const router = express.Router();

// Get all flights with optional filtering
router.get('/', async (req, res) => {
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
    
    res.json({
      flights,
      totalPages: Math.ceil(total / options.limit),
      currentPage: options.page,
      total
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get single flight
router.get('/:id', async (req, res) => {
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
});

module.exports = router;