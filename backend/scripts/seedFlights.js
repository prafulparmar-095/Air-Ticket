// backend/scripts/seedFlights.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Flight = require('../models/Flight');
const User = require('../models/User');

// Load env vars
dotenv.config({ path: '../.env' });

// Sample airlines
const airlines = [
  'Air India',
  'IndiGo',
  'SpiceJet',
  'Vistara',
  'Go First',
  'AirAsia India',
  'Akasa Air'
];

// Sample aircraft types
const aircrafts = [
  'Boeing 737',
  'Boeing 787',
  'Airbus A320',
  'Airbus A321',
  'Airbus A330',
  'Boeing 777'
];

// Sample Indian airports with codes
const airports = [
  { code: 'DEL', name: 'Delhi' },
  { code: 'BOM', name: 'Mumbai' },
  { code: 'BLR', name: 'Bengaluru' },
  { code: 'HYD', name: 'Hyderabad' },
  { code: 'CCU', name: 'Kolkata' },
  { code: 'MAA', name: 'Chennai' },
  { code: 'GOI', name: 'Goa' },
  { code: 'PNQ', name: 'Pune' },
  { code: 'COK', name: 'Kochi' },
  { code: 'JAI', name: 'Jaipur' }
];

// Generate random flight number
const generateFlightNumber = (airlineIndex) => {
  const airlineCode = airlines[airlineIndex].substring(0, 2).toUpperCase();
  const number = Math.floor(Math.random() * 9000) + 1000;
  return `${airlineCode}${number}`;
};

// Generate random time within a range
const randomTime = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Generate random price based on class and distance
const generatePrice = (base, multiplier) => {
  return Math.round(base * multiplier * 100) / 100;
};

// Generate seat map configuration
const generateSeatMap = (rows, cols, letters) => {
  return {
    rows,
    cols,
    seatLetters: letters,
    blockedSeats: []
  };
};

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const seedFlights = async () => {
  try {
    // Clear existing flights
    await Flight.deleteMany();
    console.log('Data Destroyed...');

    // Get admin user for createdBy field
    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      console.error('No admin user found. Please create an admin user first.');
      process.exit(1);
    }

    const flights = [];
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30); // Flights for next 30 days

    // Generate 200 sample flights
    for (let i = 0; i < 200; i++) {
      const airlineIndex = Math.floor(Math.random() * airlines.length);
      const originIndex = Math.floor(Math.random() * airports.length);
      let destinationIndex;
      
      // Ensure destination is different from origin
      do {
        destinationIndex = Math.floor(Math.random() * airports.length);
      } while (destinationIndex === originIndex);
      
      const origin = airports[originIndex];
      const destination = airports[destinationIndex];
      
      const departureTime = randomTime(startDate, endDate);
      const durationHours = 1 + Math.floor(Math.random() * 4); // 1-5 hour flights
      const arrivalTime = new Date(departureTime.getTime() + durationHours * 60 * 60 * 1000);
      
      // Calculate base price based on distance (simplified)
      const basePrice = 50 + (durationHours * 25);
      
      const flight = {
        airline: airlines[airlineIndex],
        number: generateFlightNumber(airlineIndex),
        origin: `${origin.name} (${origin.code})`,
        destination: `${destination.name} (${destination.code})`,
        departureTime,
        arrivalTime,
        duration: `${durationHours}h 0m`,
        aircraft: aircrafts[Math.floor(Math.random() * aircrafts.length)],
        status: 'scheduled',
        gate: `G${Math.floor(Math.random() * 30) + 1}`,
        terminal: Math.random() > 0.5 ? 'T1' : 'T2',
        economySeats: {
          total: 150,
          available: Math.floor(Math.random() * 50) + 50, // 50-100 available
          price: generatePrice(basePrice, 1)
        },
        premiumEconomySeats: {
          total: 24,
          available: Math.floor(Math.random() * 15) + 5, // 5-20 available
          price: generatePrice(basePrice, 1.5)
        },
        businessSeats: {
          total: 16,
          available: Math.floor(Math.random() * 10) + 2, // 2-12 available
          price: generatePrice(basePrice, 2.5)
        },
        firstClassSeats: {
          total: 8,
          available: Math.floor(Math.random() * 5) + 1, // 1-6 available
          price: generatePrice(basePrice, 4)
        },
        seatMap: {
          economy: generateSeatMap(25, 6, ['A', 'B', 'C', 'D', 'E', 'F']),
          premiumEconomy: generateSeatMap(4, 6, ['A', 'B', 'C', 'D', 'E', 'F']),
          business: generateSeatMap(4, 4, ['A', 'B', 'C', 'D']),
          firstClass: generateSeatMap(2, 4, ['A', 'B', 'C', 'D'])
        },
        hasWiFi: Math.random() > 0.5,
        hasEntertainment: Math.random() > 0.7,
        hasPowerOutlets: Math.random() > 0.3,
        mealService: Math.random() > 0.2,
        onTimePerformance: Math.floor(Math.random() * 30) + 70, // 70-100%
        averageDelay: Math.floor(Math.random() * 30), // 0-30 minutes
        createdBy: adminUser._id
      };
      
      flights.push(flight);
    }

    await Flight.insertMany(flights);
    console.log('Data Imported...');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

// Run seeder if called directly
if (process.argv[2] === '-import') {
  seedFlights();
} else {
  // Export for use in other files
  module.exports = seedFlights;
}