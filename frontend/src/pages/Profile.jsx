import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';

const Profile = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('/api/bookings');
        setBookings(response.data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchBookings();
    }
  }, [user]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          Please log in to view your profile.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Profile</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center mb-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4">
              <i className="fas fa-user text-blue-600 text-2xl"></i>
            </div>
            <div>
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded uppercase mt-1">
                {user.role}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Bookings</h2>
          
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <LoadingSpinner />
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-8">
              <i className="fas fa-ticket-alt text-4xl text-gray-400 mb-4"></i>
              <p className="text-gray-600">You don't have any bookings yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map(booking => (
                <div key={booking._id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold">{booking.flight.airline} - {booking.flight.flightNumber}</h3>
                      <p className="text-sm text-gray-600">
                        {formatDate(booking.flight.departure.time)} • {booking.passengers.length} {booking.passengers.length === 1 ? 'Passenger' : 'Passengers'}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${
                      booking.status === 'confirmed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center mt-4">
                    <div>
                      <p className="text-sm">
                        <span className="font-medium">{booking.flight.departure.city}</span> to{' '}
                        <span className="font-medium">{booking.flight.arrival.city}</span>
                      </p>
                      <p className="text-xs text-gray-600">
                        {formatTime(booking.flight.departure.time)} - {formatTime(booking.flight.arrival.time)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{booking.totalPrice}</p>
                      {booking.paymentId && (
                        <p className="text-xs text-gray-600">Payment ID: {booking.paymentId.slice(-8)}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;