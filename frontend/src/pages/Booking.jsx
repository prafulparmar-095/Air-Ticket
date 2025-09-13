// frontend/src/pages/Booking.jsx
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../hooks/useAuth';
import SeatMap from '../components/SeatMap';

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { post, get } = useApi();
  const [step, setStep] = useState(1);
  const [flight, setFlight] = useState(null);
  const [passengers, setPassengers] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (location.state?.flight) {
      setFlight(location.state.flight);
      setPassengers(
        Array(location.state.searchParams.travelers).fill().map((_, index) => ({
          firstName: '',
          lastName: '',
          dateOfBirth: '',
          gender: '',
          passportNumber: '',
          nationality: '',
          seat: '',
          baggage: { checked: 0, cabin: 1 },
          specialAssistance: false,
          mealPreference: 'regular'
        }))
      );
      fetchBookedSeats(location.state.flight._id);
    } else {
      navigate('/');
    }
  }, [location.state]);

  const fetchBookedSeats = async (flightId) => {
    try {
      const response = await get(`/flights/${flightId}/seats`);
      setBookedSeats(response.data.bookedSeats || []);
    } catch (error) {
      console.error('Failed to fetch booked seats:', error);
    }
  };

  const handlePassengerChange = (index, field, value) => {
    const updatedPassengers = [...passengers];
    updatedPassengers[index][field] = value;
    setPassengers(updatedPassengers);
  };

  const handleSeatSelect = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter(seat => seat !== seatNumber));
    } else if (selectedSeats.length < passengers.length) {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  const calculateTotal = () => {
    if (!flight) return 0;
    const basePrice = flight[`${location.state.searchParams.class}Seats`]?.price || flight.economySeats.price;
    const baggageFee = passengers.reduce((total, passenger) => total + (passenger.baggage.checked * 25), 0);
    const seatSelectionFee = selectedSeats.length * 15;
    
    return (basePrice * passengers.length) + baggageFee + seatSelectionFee;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Assign seats to passengers
      const passengersWithSeats = passengers.map((passenger, index) => ({
        ...passenger,
        seat: selectedSeats[index] || ''
      }));

      const bookingData = {
        flight: flight._id,
        passengers: passengersWithSeats,
        fareDetails: {
          baseFare: flight[`${location.state.searchParams.class}Seats`]?.price || flight.economySeats.price,
          tax: 18, // 18% tax
          baggageFee: passengers.reduce((total, passenger) => total + (passenger.baggage.checked * 25), 0),
          seatSelectionFee: selectedSeats.length * 15,
          totalAmount: calculateTotal()
        },
        contactDetails: {
          email: user.email,
          phone: user.phone || '',
          address: user.address || {}
        }
      };

      const response = await post('/bookings', bookingData);
      navigate('/payment', { state: { booking: response.data, flight } });
    } catch (error) {
      console.error('Failed to create booking:', error);
      setError('Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!flight) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold mb-4">Complete Your Booking</h1>
        
        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              1
            </div>
            <div className="ml-2">Passenger Details</div>
          </div>
          
          <div className="w-16 h-1 bg-gray-300 mx-2"></div>
          
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              2
            </div>
            <div className="ml-2">Seat Selection</div>
          </div>
          
          <div className="w-16 h-1 bg-gray-300 mx-2"></div>
          
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              3
            </div>
            <div className="ml-2">Review & Pay</div>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Passenger Details</h2>
            <form onSubmit={() => setStep(2)}>
              {passengers.map((passenger, index) => (
                <div key={index} className="border-b border-gray-200 pb-6 mb-6">
                  <h3 className="text-lg font-medium mb-4">Passenger {index + 1}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                      <input
                        type="text"
                        value={passenger.firstName}
                        onChange={(e) => handlePassengerChange(index, 'firstName', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                      <input
                        type="text"
                        value={passenger.lastName}
                        onChange={(e) => handlePassengerChange(index, 'lastName', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                      <input
                        type="date"
                        value={passenger.dateOfBirth}
                        onChange={(e) => handlePassengerChange(index, 'dateOfBirth', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                      <select
                        value={passenger.gender}
                        onChange={(e) => handlePassengerChange(index, 'gender', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Passport Number</label>
                      <input
                        type="text"
                        value={passenger.passportNumber}
                        onChange={(e) => handlePassengerChange(index, 'passportNumber', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
                      <input
                        type="text"
                        value={passenger.nationality}
                        onChange={(e) => handlePassengerChange(index, 'nationality', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Checked Baggage (× $25)</label>
                      <select
                        value={passenger.baggage.checked}
                        onChange={(e) => handlePassengerChange(index, 'baggage', { 
                          ...passenger.baggage, 
                          checked: parseInt(e.target.value) 
                        })}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value={0}>0 bags</option>
                        <option value={1}>1 bag</option>
                        <option value={2}>2 bags</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Meal Preference</label>
                      <select
                        value={passenger.mealPreference}
                        onChange={(e) => handlePassengerChange(index, 'mealPreference', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="regular">Regular</option>
                        <option value="vegetarian">Vegetarian</option>
                        <option value="vegan">Vegan</option>
                        <option value="gluten-free">Gluten Free</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={passenger.specialAssistance}
                        onChange={(e) => handlePassengerChange(index, 'specialAssistance', e.target.checked)}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Require special assistance</span>
                    </label>
                  </div>
                </div>
              ))}
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                >
                  Continue to Seat Selection
                </button>
              </div>
            </form>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Seat Selection</h2>
            <p className="text-gray-600 mb-4">Select seats for {passengers.length} passenger(s)</p>
            
            <SeatMap
              flight={flight}
              selectedSeats={selectedSeats}
              onSeatSelect={handleSeatSelect}
              bookedSeats={bookedSeats}
            />
            
            <div className="flex justify-between mt-6">
              <button
                onClick={() => setStep(1)}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                disabled={selectedSeats.length !== passengers.length}
              >
                Continue to Payment
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Review & Payment</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <div className="bg-gray-50 p-4 rounded-md mb-6">
                  <h3 className="font-bold mb-2">Flight Details</h3>
                  <p><strong>{flight.airline}</strong> {flight.number}</p>
                  <p>{flight.origin} → {flight.destination}</p>
                  <p>Departure: {new Date(flight.departureTime).toLocaleString()}</p>
                  <p>Arrival: {new Date(flight.arrivalTime).toLocaleString()}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="font-bold mb-2">Passenger Details</h3>
                  {passengers.map((passenger, index) => (
                    <div key={index} className="mb-3">
                      <p><strong>Passenger {index + 1}:</strong> {passenger.firstName} {passenger.lastName}</p>
                      <p>Seat: {selectedSeats[index] || 'Not assigned'}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="font-bold mb-2">Price Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Base Fare ({passengers.length} × ${flight[`${location.state.searchParams.class}Seats`]?.price || flight.economySeats.price})</span>
                      <span>${(flight[`${location.state.searchParams.class}Seats`]?.price || flight.economySeats.price) * passengers.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (18%)</span>
                      <span>${((flight[`${location.state.searchParams.class}Seats`]?.price || flight.economySeats.price) * passengers.length * 0.18).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Baggage Fee</span>
                      <span>${passengers.reduce((total, passenger) => total + (passenger.baggage.checked * 25), 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Seat Selection Fee</span>
                      <span>${selectedSeats.length * 15}</span>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between font-bold">
                        <span>Total Amount</span>
                        <span>${calculateTotal().toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 mt-4 disabled:bg-gray-400"
                  >
                    {loading ? 'Processing...' : 'Proceed to Payment'}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex justify-start mt-6">
              <button
                onClick={() => setStep(2)}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400"
              >
                Back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Booking;