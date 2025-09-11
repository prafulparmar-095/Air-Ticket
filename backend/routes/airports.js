const express = require('express');
const router = express.Router();

const airports = [
  {"code": "DEL", "name": "Indira Gandhi International Airport", "city": "Delhi", "country": "India"},
  {"code": "BOM", "name": "Chhatrapati Shivaji Maharaj International Airport", "city": "Mumbai", "country": "India"},
  // ... add all airports from the JSON above
];

// Search airports
router.get('/search', (req, res) => {
  const { q } = req.query;
  
  if (!q) {
    return res.json([]);
  }

  const searchTerm = q.toLowerCase();
  const results = airports.filter(airport =>
    airport.city.toLowerCase().includes(searchTerm) ||
    airport.name.toLowerCase().includes(searchTerm) ||
    airport.code.toLowerCase().includes(searchTerm)
  ).slice(0, 10); // Limit to 10 results

  res.json(results);
});

// Get all airports
router.get('/', (req, res) => {
  res.json(airports);
});

module.exports = router;