// backend/scripts/seedAdmin.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

// Load env vars
dotenv.config({ path: '../.env' });

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const seedAdmin = async () => {
  try {
    // Clear existing admin users
    await User.deleteMany({ role: 'admin' });
    console.log('Existing admin users removed...');

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@airticket.com',
      password: 'admin123',
      role: 'admin',
      phone: '+1234567890'
    });

    console.log('Admin user created:');
    console.log(`Email: ${adminUser.email}`);
    console.log(`Password: admin123`);
    console.log('Please change the password after first login!');

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

// Run seeder if called directly
if (process.argv[2] === '-import') {
  seedAdmin();
}