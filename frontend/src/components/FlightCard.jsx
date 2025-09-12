// frontend/src/components/FlightCard.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const FlightCard = ({ flight }) => {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleBook = () => {
    if (!user) {
      navigate('/login', { state: { from: '/booking', flight } });
      return;
    }
    
    navigate('/booking', { state: { flight } });
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${period}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300">
      <div className="p-4 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center space-x-4 w-full md:w-3/5">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="font-bold text-blue-600">{flight.airlineCode}</span>
            </div>
          </div>
          
          <div className="flex-grow">
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-xl font-bold">{formatTime(flight.departureTime)}</div>
                <div className="text-sm text-gray-500">{flight.origin}</div>
                <div className="text-xs text-gray-400">{formatDate(flight.departureDate)}</div>
              </div>
              
              <div className="flex-grow">
                <div className="text-center text-sm text-gray-500">
                  {flight.duration}
                </div>
                <div className="relative">
                  <div className="overflow-hidden h-2 flex rounded bg-gray-100">
                    <div className="w-full bg-blue-500"></div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11.43a1 1 0 01.725-.962l5-1.429a1 1 0 001.17-1.409l-7-14z"></path>
                    </svg>
                  </div>
                </div>
                <div className="text-center text-sm text-gray-500">
                  {flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-xl font-bold">{formatTime(flight.arrivalTime)}</div>
                <div className="text-sm text-gray-500">{flight.destination}</div>
                <div className="text-xs text-gray-400">{formatDate(flight.departureDate)}</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 md:mt-0 w-full md:w-2/5 flex flex-col md:flex-row items-center justify-between">
          <div className="text-2xl font-bold text-gray-800 mb-2 md:mb-0">
            ${flight.price}
            <span className="text-sm font-normal text-gray-600"> /person</span>
          </div>
          
          <button 
            onClick={handleBook}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-300"
          >
            Select
          </button>
        </div>
      </div>
      
      <div 
        className={`border-t border-gray-200 overflow-hidden transition-all duration-300 ${expanded ? 'max-h-96' : 'max-h-0'}`}
      >
        <div className="p-4 bg-gray-50">
          <h4 className="font-medium text-gray-800 mb-2">Flight Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Airline: </span>
              <span className="font-medium">{flight.airline}</span>
            </div>
            <div>
              <span className="text-gray-600">Flight Number: </span>
              <span className="font-medium">{flight.flightNumber}</span>
            </div>
            <div>
              <span className="text-gray-600">Departure: </span>
              <span className="font-medium">{formatTime(flight.departureTime)} from {flight.origin}</span>
            </div>
            <div>
              <span className="text-gray-600">Arrival: </span>
              <span className="font-medium">{formatTime(flight.arrivalTime)} at {flight.destination}</span>
            </div>
            <div>
              <span className="text-gray-600">Duration: </span>
              <span className="font-medium">{flight.duration}</span>
            </div>
            <div>
              <span className="text-gray-600">Stops: </span>
              <span className="font-medium">{flight.stops}</span>
            </div>
            <div>
              <span className="text-gray-600">Aircraft: </span>
              <span className="font-medium">{flight.aircraft || 'Boeing 737'}</span>
            </div>
            <div>
              <span className="text-gray-600">Seats Available: </span>
              <span className="font-medium">{flight.availableSeats || 'Multiple'}</span>
            </div>
          </div>
        </div>
      </div>
      
      <button 
        onClick={() => setExpanded(!expanded)}
        className="w-full py-2 bg-gray-100 text-center text-sm text-blue-600 font-medium hover:bg-gray-200 transition duration-300"
      >
        {expanded ? 'Hide details' : 'Show details'}
      </button>
    </div>
  );
};

export default FlightCard;