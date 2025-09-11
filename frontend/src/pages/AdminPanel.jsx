import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const AdminPanel = () => {
  const { user } = useAuth();
  const [flights, setFlights] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('flights');
  const [showAddFlight, setShowAddFlight] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    airline: '',
    flightNumber: '',
    departureCity: '',
    departureCode: '',
    departureTime: '',
    arrivalCity: '',
    arrivalCode: '',
    arrivalTime: '',
    duration: '',
    price: '',
    seats: ''
  });

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchData();
    }
  }, [user, activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'flights') {
        const response = await axios.get('/api/flights');
        setFlights(response.data);
      } else if (activeTab === 'bookings') {
        const response = await axios.get('/api/bookings/all');
        setBookings(response.data);
      } else if (activeTab === 'users') {
        const response = await axios.get('/api/users');
        setUsers(response.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddFlight = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/flights', {
        airline: formData.airline,
        flightNumber: formData.flightNumber,
        departure: {
          city: formData.departureCity,
          code: formData.departureCode,
          time: formData.departureTime
        },
        arrival: {
          city: formData.arrivalCity,
          code: formData.arrivalCode,
          time: formData.arrivalTime
        },
        duration: formData.duration,
        price: parseInt(formData.price),
        seats: parseInt(formData.seats)
      });
      
      setShowAddFlight(false);
      setFormData({
        airline: '',
        flightNumber: '',
        departureCity: '',
        departureCode: '',
        departureTime: '',
        arrivalCity: '',
        arrivalCode: '',
        arrivalTime: '',
        duration: '',
        price: '',
        seats: ''
      });
      
      fetchData();
    } catch (error) {
      console.error('Error adding flight:', error);
    }
  };

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

  if (!user || user.role !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Access denied. Admin privileges required.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Panel</h1>
      
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('flights')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'flights'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Flights
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'bookings'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Bookings
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Users
            </button>
          </nav>
        </div>
        
        <div className="p-6">
          {activeTab === 'flights' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Flight Management</h2>
                <button
                  onClick={() => setShowAddFlight(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                >
                  Add Flight
                </button>
              </div>
              
              {showAddFlight && (
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h3 className="text-lg font-medium mb-4">Add New Flight</h3>
                  <form onSubmit={handleAddFlight} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Airline</label>
                      <input
                        type="text"
                        name="airline"
                        value={formData.airline}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Flight Number</label>
                      <input
                        type="text"
                        name="flightNumber"
                        value={formData.flightNumber}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Departure City</label>
                      <input
                        type="text"
                        name="departureCity"
                        value={formData.departureCity}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Departure Code</label>
                      <input
                        type="text"
                        name="departureCode"
                        value={formData.departureCode}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Departure Time</label>
                      <input
                        type="datetime-local"
                        name="departureTime"
                        value={formData.departureTime}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Arrival City</label>
                      <input
                        type="text"
                        name="arrivalCity"
                        value={formData.arrivalCity}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Arrival Code</label>
                      <input
                        type="text"
                        name="arrivalCode"
                        value={formData.arrivalCode}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Arrival Time</label>
                      <input
                        type="datetime-local"
                        name="arrivalTime"
                        value={formData.arrivalTime}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                      <input
                        type="text"
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Seats</label>
                      <input
                        type="number"
                        name="seats"
                        value={formData.seats}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                      />
                    </div>
                    <div className="md:col-span-2 flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => setShowAddFlight(false)}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                      >
                        Add Flight
                      </button>
                    </div>
                  </form>
                </div>
              )}
              
              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Flight</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departure</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Arrival</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seats</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {flights.map(flight => (
                        <tr key={flight._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium">{flight.airline}</div>
                            <div className="text-sm text-gray-500">{flight.flightNumber}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm">
                              {flight.departure.city} ({flight.departure.code}) → {flight.arrival.city} ({flight.arrival.code})
                            </div>
                            <div className="text-sm text-gray-500">{flight.duration}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm">{formatDate(flight.departure.time)}</div>
                            <div className="text-sm text-gray-500">{formatTime(flight.departure.time)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm">{formatDate(flight.arrival.time)}</div>
                            <div className="text-sm text-gray-500">{formatTime(flight.arrival.time)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">₹{flight.price}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{flight.seats}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'bookings' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Booking Management</h2>
              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Flight</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Passengers</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {bookings.map(booking => (
                        <tr key={booking._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">#{booking._id.slice(-6)}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium">{booking.flight.airline}</div>
                            <div className="text-sm text-gray-500">{booking.flight.flightNumber}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{booking.passengers.length}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{formatDate(booking.bookingDate)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">₹{booking.totalPrice}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded text-xs ${
                              booking.status === 'confirmed' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {booking.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'users' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">User Management</h2>
              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map(user => (
                        <tr key={user._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium">{user.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{user.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded text-xs ${
                              user.role === 'admin' 
                                ? 'bg-purple-100 text-purple-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{formatDate(user.date)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;