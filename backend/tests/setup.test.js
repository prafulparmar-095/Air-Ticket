const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

// Setup in-memory MongoDB for testing
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// Clear all test data after each test
afterEach(async () => {
  const collections = mongoose.connection.collections;
  
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
});

// Disconnect and stop in-memory MongoDB after all tests
afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

// Global test utilities
global.testUtils = {
  // Generate test user data
  generateUserData: (overrides = {}) => ({
    firstName: 'Test',
    lastName: 'User',
    email: `test${Date.now()}@example.com`,
    password: 'Password123!',
    phone: '+1234567890',
    dateOfBirth: new Date('1990-01-01'),
    ...overrides
  }),

  // Generate test flight data
  generateFlightData: (overrides = {}) => ({
    flightNumber: `AI${Math.floor(100 + Math.random() * 900)}`,
    airline: 'Air India',
    departure: {
      airport: 'DEL',
      city: 'Delhi',
      country: 'India',
      datetime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
    },
    arrival: {
      airport: 'BOM',
      city: 'Mumbai',
      country: 'India',
      datetime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000)
    },
    duration: 120,
    aircraft: 'Boeing 737',
    prices: {
      economy: 150,
      business: 300,
      first: 500
    },
    ...overrides
  }),

  // Generate test booking data
  generateBookingData: (userId, flightId, overrides = {}) => ({
    user: userId,
    flight: flightId,
    passengers: [
      {
        firstName: 'Test',
        lastName: 'Passenger',
        dateOfBirth: new Date('1990-01-01'),
        gender: 'male',
        seat: {
          number: '12A',
          class: 'economy',
          price: 150
        }
      }
    ],
    totalAmount: 150,
    contactEmail: 'test@example.com',
    contactPhone: '+1234567890',
    ...overrides
  }),

  // Wait for promise to resolve (useful for testing async code)
  wait: (ms) => new Promise(resolve => setTimeout(resolve, ms))
};