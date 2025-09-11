import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Payment from '../components/Payment';
import LoadingSpinner from '../components/LoadingSpinner';

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [flight, setFlight] = useState(null);
  const [passengers, setPassengers] = useState([{ name: '', age: '', gender: '' }]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [booking, setBooking] = useState(null);
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    const fetchFlight = async () => {
      try {
        const response = await axios.get(`/api/flights/${id}`);
        setFlight(response.data);
      } catch (error) {
        console.error('Error fetching flight:', error);
        setError('Flight not found');
      } finally {
        setLoading(false);
      }
    };

    fetchFlight();
  }, [id]);

  const handlePassengerChange = (index, field, value) => {
    const updatedPassengers = [...passengers];
    updatedPassengers[index][field] = value;
    setPassengers(updatedPassengers);
  };

  const addPassenger = () => {
    setPassengers([...passengers, { name: '', age: '', gender: '' }]);
  };

  const removePassenger = (index) => {
    if (passengers.length > 1) {
      const updatedPassengers = [...passengers];
      updatedPassengers.splice(index, 1);
      setPassengers(updatedPassengers);
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/login');
      return;
    }

    // Validate passengers
    for (let i = 0; i < passengers.length; i++) {
      const passenger = passengers[i];
      if (!passenger.name || !passenger.age || !passenger.gender) {
        setError(`Please fill all details for passenger ${i + 1}`);
        return;
      }
    }

    setSubmitting(true);
    setError('');

    try {
      const response = await axios.post('/api/bookings', {
        flightId: id,
        passengers: passengers.map(p => ({
          name: p.name,
          age: parseInt(p.age),
          gender: p.gender
        }))
      });

      setBooking(response.data);
      setShowPayment(true);
    } catch (error) {
      const message = error.response?.data?.message || 'Booking failed';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePaymentSuccess = (paymentIntent) => {
    navigate('/profile', { 
      state: { 
        message: 'Booking confirmed successfully!',
        paymentId: paymentIntent.id
      } 
    });
  };

  const handlePaymentCancel = () => {
    setShowPayment(false);
    setBooking(null);
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error || !flight) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error || 'Flight not found'}
        </div>
      </div>
    );
  }

  const totalPrice = flight.price * passengers.length;

  if (showPayment && booking) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Complete Payment</h1>
          <Payment 
            booking={booking} 
            onSuccess={handlePaymentSuccess}
            onCancel={handlePaymentCancel}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Complete Your Booking</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Flight Details</h2>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold">{flight.airline}</h3>
                    <p className="text-sm text-gray-600">{flight.flightNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">₹{flight.price}</p>
                    <p className="text-sm text-gray-600">per person</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{formatTime(flight.departure.time)}</p>
                    <p className="text-sm text-gray-600">{flight.departure.city} ({flight.departure.code})</p>
                    <p className="text-xs text-gray-500">{formatDate(flight.departure.time)}</p>
                  </div>
                  
                  <div className="flex-1 px-4">
                    <div className="flex items-center">
                      <div className="flex-1 border-t border-gray-300"></div>
                      <div className="px-2 text-sm text-gray-600">{flight.duration}</div>
                      <div className="flex-1 border-t border-gray-300"></div>
                    </div>
                    <div className="text-center text-xs text-gray-500">Non-stop</div>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-2xl font-bold">{formatTime(flight.arrival.time)}</p>
                    <p className="text-sm text-gray-600">{flight.arrival.city} ({flight.arrival.code})</p>
                    <p className="text-xs text-gray-500">{formatDate(flight.arrival.time)}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Passenger Details</h2>
              
              {!user ? (
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
                  Please <a href="/login" className="font-semibold underline">login</a> to continue with your booking.
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit}>
                  {passengers.map((passenger, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-medium">Passenger {index + 1}</h3>
                        {passengers.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removePassenger(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <i className="fas fa-times"></i> Remove
                          </button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                          <input
                            type="text"
                            value={passenger.name}
                            onChange={(e) => handlePassengerChange(index, 'name', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                          <input
                            type="number"
                            min="1"
                            max="120"
                            value={passenger.age}
                            onChange={(e) => handlePassengerChange(index, 'age', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                          <select
                            value={passenger.gender}
                            onChange={(e) => handlePassengerChange(index, 'gender', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                          >
                            <option value="">Select</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    onClick={addPassenger}
                    className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
                  >
                    <i className="fas fa-plus-circle mr-2"></i> Add Another Passenger
                  </button>
                  
                  {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                      {error}
                    </div>
                  )}
                  
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition disabled:opacity-50"
                  >
                    {submitting ? <LoadingSpinner size="small" /> : `Proceed to Payment - ₹${totalPrice}`}
                  </button>
                </form>
              )}
            </div>
          </div>
          
          <div>
            <div className="bg-white rounded-lg shadow p-6 sticky top-6">
              <h2 className="text-xl font-semibold mb-4">Price Summary</h2>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Base Fare ({passengers.length} x ₹{flight.price})</span>
                  <span>₹{totalPrice}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Taxes & Fees</span>
                  <span>₹0</span>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>₹{totalPrice}</span>
                </div>
              </div>
              
              <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">What's included:</h3>
                <ul className="text-sm space-y-1">
                  <li className="flex items-center">
                    <i className="fas fa-check text-green-600 mr-2"></i>
                    <span>Free cabin baggage</span>
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-check text-green-600 mr-2"></i>
                    <span>In-flight entertainment</span>
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-check text-green-600 mr-2"></i>
                    <span>Meal service</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 bg-green-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Secure Payment</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <i className="fas fa-shield-alt text-green-600"></i>
                  <span>Your payment information is encrypted and secure</span>
                </div>
                <div className="flex mt-2 space-x-2">
                  <div className="w-10 h-6 bg-gray-200 rounded flex items-center justify-center">
                    <i className="fab fa-cc-visa text-blue-600"></i>
                  </div>
                  <div className="w-10 h-6 bg-gray-200 rounded flex items-center justify-center">
                    <i className="fab fa-cc-mastercard text-red-600"></i>
                  </div>
                  <div className="w-10 h-6 bg-gray-200 rounded flex items-center justify-center">
                    <i className="fab fa-cc-amex text-blue-800"></i>
                  </div>
                  <div className="w-10 h-6 bg-gray-200 rounded flex items-center justify-center">
                    <i className="fab fa-cc-discover text-orange-600"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;