const mongoose = require('mongoose');
const User = require('../models/User');
const Flight = require('../models/Flight');
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Flight.deleteMany({});

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 12);
    const adminUser = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@airindia.com',
      password: adminPassword,
      phone: '+1234567890',
      dateOfBirth: new Date('1990-01-01'),
      role: 'admin',
      isVerified: true
    });

    // Create regular user
    const userPassword = await bcrypt.hash('user123', 12);
    const regularUser = await User.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: userPassword,
      phone: '+1987654321',
      dateOfBirth: new Date('1995-05-15'),
      isVerified: true
    });

    // Create sample flights
    const sampleFlights = [
      {
        flightNumber: 'AI101',
        airline: 'Air India',
        departure: {
          airport: 'DEL',
          city: 'Delhi',
          country: 'India',
          datetime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 2 days from now
        },
        arrival: {
          airport: 'BOM',
          city: 'Mumbai',
          country: 'India',
          datetime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000) // 2 hours later
        },
        duration: 120,
        aircraft: 'Boeing 737',
        prices: {
          economy: 150,
          business: 300,
          first: 500
        },
        seats: generateSeats(30, 6),
        status: 'scheduled'
      },
      {
        flightNumber: 'AI202',
        airline: 'Air India',
        departure: {
          airport: 'BOM',
          city: 'Mumbai',
          country: 'India',
          datetime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days from now
        },
        arrival: {
          airport: 'BLR',
          city: 'Bangalore',
          country: 'India',
          datetime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000) // 1.5 hours later
        },
        duration: 90,
        aircraft: 'Airbus A320',
        prices: {
          economy: 120,
          business: 250,
          first: 400
        },
        seats: generateSeats(25, 6),
        status: 'scheduled'
      },
      {
        flightNumber: 'AI303',
        airline: 'Air India',
        departure: {
          airport: 'DEL',
          city: 'Delhi',
          country: 'India',
          datetime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // 5 days from now
        },
        arrival: {
          airport: 'DXB',
          city: 'Dubai',
          country: 'UAE',
          datetime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000) // 4 hours later
        },
        duration: 240,
        aircraft: 'Boeing 777',
        prices: {
          economy: 400,
          business: 800,
          first: 1200
        },
        seats: generateSeats(40, 8),
        status: 'scheduled',
        stops: 0
      }
    ];

    await Flight.insertMany(sampleFlights);

    console.log('Database seeded successfully!');
    console.log('Admin credentials: admin@airindia.com / admin123');
    console.log('User credentials: john@example.com / user123');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

function generateSeats(rows, seatsPerRow) {
  const seats = [];
  const classes = ['economy', 'economy', 'economy', 'business', 'business', 'first'];
  
  for (let row = 1; row <= rows; row++) {
    for (let seatNum = 1; seatNum <= seatsPerRow; seatNum++) {
      const seatLetter = String.fromCharCode(64 + seatNum);
      const seatClass = classes[Math.min(row - 1, classes.length - 1)];
      
      seats.push({
        number: `${row}${seatLetter}`,
        class: seatClass,
        isAvailable: true,
        price: seatClass === 'economy' ? 150 : seatClass === 'business' ? 300 : 500,
        features: seatClass === 'first' ? ['extra legroom', 'premium meals'] : []
      });
    }
  }
  
  return seats;
}

module.exports = seedDatabase;