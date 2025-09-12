const mongoose = require('mongoose')
const Flight = require('./models/Flight')
require('dotenv').config()

const sampleFlights = [
  {
    airline: 'American Airlines',
    flightNumber: 'AA123',
    origin: 'JFK',
    destination: 'LAX',
    departureTime: new Date('2024-01-15T08:00:00'),
    arrivalTime: new Date('2024-01-15T11:30:00'),
    duration: 210,
    price: 299,
    available: true
  },
  {
    airline: 'Delta Airlines',
    flightNumber: 'DL456',
    origin: 'LAX',
    destination: 'JFK',
    departureTime: new Date('2024-01-16T14:00:00'),
    arrivalTime: new Date('2024-01-16T22:30:00'),
    duration: 330,
    price: 349,
    available: true
  }
]

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/airticket')
    console.log('Connected to MongoDB')

    // Clear existing flights
    await Flight.deleteMany({})
    console.log('Cleared existing flights')

    // Add sample flights
    await Flight.insertMany(sampleFlights)
    console.log('Added sample flights')

    process.exit(0)
  } catch (error) {
    console.error('Seeding error:', error)
    process.exit(1)
  }
}

seedDatabase()