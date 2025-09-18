import React, { useState, useEffect } from 'react';
import { flightService } from '../../services/flights';

const SeatSelection = ({ flight, passengers, onSeatSelect, selectedSeats }) => {
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAvailableSeats();
  }, [flight]);

  const loadAvailableSeats = async () => {
    try {
      setLoading(true);
      const availableSeats = await flightService.getAvailableSeats(flight._id);
      setSeats(availableSeats);
    } catch (error) {
      setError('Failed to load available seats');
    } finally {
      setLoading(false);
    }
  };

  const handleSeatSelect = (passengerIndex, seat) => {
    onSeatSelect(passengerIndex, seat);
  };

  const getSeatClass = (seatClass) => {
    switch (seatClass) {
      case 'first': return 'bg-purple-200 border-purple-400';
      case 'business': return 'bg-blue-200 border-blue-400';
      default: return 'bg-gray-100 border-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading available seats...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Select Seats</h3>
      
      <div className="mb-6">
        <h4 className="font-medium mb-2">Seat Legend:</h4>
        <div className="flex space-x-4 text-sm">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-100 border border-gray-300 mr-2"></div>
            <span>Economy</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-200 border border-blue-400 mr-2"></div>
            <span>Business</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-purple-200 border border-purple-400 mr-2"></div>
            <span>First Class</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-200 border border-red-400 mr-2"></div>
            <span>Occupied</span>
          </div>
        </div>
      </div>

      {passengers.map((passenger, passengerIndex) => (
        <div key={passengerIndex} className="mb-6 p-4 border rounded-lg">
          <h4 className="font-medium mb-3">
            {passenger.firstName} {passenger.lastName} - Select Seat
          </h4>
          
          <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
            {seats.map((seat) => (
              <button
                key={seat._id}
                onClick={() => handleSeatSelect(passengerIndex, seat)}
                disabled={!seat.isAvailable}
                className={`p-2 border rounded text-center text-sm font-medium transition-colors ${
                  selectedSeats[passengerIndex]?.number === seat.number
                    ? 'bg-green-200 border-green-500 ring-2 ring-green-300'
                    : seat.isAvailable
                    ? `hover:bg-blue-50 ${getSeatClass(seat.class)}`
                    : 'bg-red-200 border-red-300 cursor-not-allowed opacity-50'
                }`}
                title={seat.isAvailable ? `Seat ${seat.number} - ${seat.class}` : 'Occupied'}
              >
                {seat.number}
              </button>
            ))}
          </div>

          {selectedSeats[passengerIndex] && (
            <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded">
              <span className="text-green-700 font-medium">
                Selected: {selectedSeats[passengerIndex].number} ({selectedSeats[passengerIndex].class}) - 
                ${selectedSeats[passengerIndex].price}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SeatSelection;