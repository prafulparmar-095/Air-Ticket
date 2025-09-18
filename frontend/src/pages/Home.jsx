import React from 'react';
import { Link } from 'react-router-dom';
import FlightSearch from '../components/Booking/FlightSearch';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-blue-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Fly with Air India
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              Experience world-class service to destinations across the globe
            </p>
            {!user && (
              <div className="space-x-4">
                <Link
                  to="/register"
                  className="bg-white text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100"
                >
                  Create Account
                </Link>
                <Link
                  to="/login"
                  className="border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-900"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Flight Search Section */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <FlightSearch />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Air India?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✈️</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Wide Network</h3>
              <p className="text-gray-600">Fly to over 100 destinations worldwide with our extensive network</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⭐</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium Service</h3>
              <p className="text-gray-600">Experience our award-winning service and hospitality</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🛡️</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Safe Travel</h3>
              <p className="text-gray-600">Your safety is our top priority with enhanced health measures</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;