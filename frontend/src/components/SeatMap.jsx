// frontend/src/components/SeatMap.jsx
import { useState } from 'react';

const SeatMap = ({ flight, selectedSeats, onSeatSelect, bookedSeats }) => {
  const [selectedClass, setSelectedClass] = useState('economy');
  
  // Sample seat layout data - in real app this would come from the flight data
  const seatLayout = {
    economy: {
      rows: 20,
      cols: 6,
      seatLetters: ['A', 'B', 'C', 'D', 'E', 'F'],
      price: flight.economyPrice
    },
    business: {
      rows: 8,
      cols: 4,
      seatLetters: ['A', 'B', 'C', 'D'],
      price: flight.businessPrice
    },
    first: {
      rows: 4,
      cols: 4,
      seatLetters: ['A', 'B', 'C', 'D'],
      price: flight.firstClassPrice
    }
  };
  
  const renderSeats = () => {
    const layout = seatLayout[selectedClass];
    const seats = [];
    
    for (let row = 1; row <= layout.rows; row++) {
      const rowSeats = [];
      
      for (let col = 0; col < layout.cols; col++) {
        const seatNumber = `${row}${layout.seatLetters[col]}`;
        const isBooked = bookedSeats.includes(seatNumber);
        const isSelected = selectedSeats.includes(seatNumber);
        
        // Add aisle gap
        if (col === Math.floor(layout.cols / 2)) {
          rowSeats.push(<div key={`gap-${row}`} className="w-8"></div>);
        }
        
        rowSeats.push(
          <button
            key={seatNumber}
            className={`w-8 h-8 m-1 rounded-md flex items-center justify-center text-xs
              ${isBooked ? 'bg-gray-300 cursor-not-allowed' : 
                isSelected ? 'bg-blue-600 text-white' : 
                'bg-gray-100 hover:bg-gray-200'}`}
            disabled={isBooked}
            onClick={() => !isBooked && onSeatSelect(seatNumber)}
            title={isBooked ? 'Already booked' : `Seat ${seatNumber}`}
          >
            {seatNumber}
          </button>
        );
      }
      
      seats.push(
        <div key={row} className="flex items-center justify-center mb-1">
          <div className="w-8 text-center text-sm mr-2">{row}</div>
          {rowSeats}
        </div>
      );
    }
    
    return seats;
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">Select Your Seats</h2>
      
      <div className="flex space-x-4 mb-6">
        <button
          className={`px-4 py-2 rounded-full ${selectedClass === 'economy' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setSelectedClass('economy')}
        >
          Economy (${seatLayout.economy.price})
        </button>
        <button
          className={`px-4 py-2 rounded-full ${selectedClass === 'business' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setSelectedClass('business')}
        >
          Business (${seatLayout.business.price})
        </button>
        <button
          className={`px-4 py-2 rounded-full ${selectedClass === 'first' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setSelectedClass('first')}
        >
          First Class (${seatLayout.first.price})
        </button>
      </div>
      
      <div className="mb-6 p-4 bg-gray-50 rounded-md">
        <div className="flex items-center space-x-4 mb-2">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-100 rounded-md mr-2"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-600 rounded-md mr-2"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-300 rounded-md mr-2"></div>
            <span>Booked</span>
          </div>
        </div>
      </div>
      
      <div className="overflow-auto">
        {/* Aircraft front indicator */}
        <div className="text-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
          <p className="text-sm">Front of Aircraft</p>
        </div>
        
        {/* Seat map */}
        <div className="flex justify-center">
          <div>
            {renderSeats()}
          </div>
        </div>
      </div>
      
      {selectedSeats.length > 0 && (
        <div className="mt-6 p-4 bg-blue-50 rounded-md">
          <h3 className="font-medium mb-2">Selected Seats:</h3>
          <div className="flex flex-wrap gap-2">
            {selectedSeats.map(seat => (
              <span key={seat} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                {seat}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SeatMap;