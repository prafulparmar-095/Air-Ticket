// frontend/src/pages/SearchResults.jsx
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { airports } from '../data/airports';

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { post } = useApi();
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useState({});

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchData = {
      origin: params.get('origin'),
      destination: params.get('destination'),
      departureDate: params.get('departureDate'),
      returnDate: params.get('returnDate'),
      travelers: parseInt(params.get('travelers')) || 1,
      class: params.get('class') || 'economy'
    };
    
    setSearchParams(searchData);
    searchFlights(searchData);
  }, [location.search]);

  const searchFlights = async (searchData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await post('/flights/search', searchData);
      setFlights(response.data.departureFlights || []);
    } catch (error) {
      console.error('Failed to search flights:', error);
      setError('Failed to search flights. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getAirportName = (code) => {
    const airport = airports.find(a => a.code === code);
    return airport ? `${airport.city} (${airport.code})` : code;
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDuration = (duration) => {
    return duration || '2h 30m'; // Fallback if duration not available
  };

  const handleBookFlight = (flight) => {
    navigate('/booking', { 
      state: { 
        flight, 
        searchParams 
      } 
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold mb-4">Flight Search Results</h1>
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          <div><span className="font-medium">From:</span> {getAirportName(searchParams.origin)}</div>
          <div><span className="font-medium">To:</span> {getAirportName(searchParams.destination)}</div>
          <div><span className="font-medium">Departure:</span> {searchParams.departureDate}</div>
          {searchParams.returnDate && <div><span className="font-medium">Return:</span> {searchParams.returnDate}</div>}
          <div><span className="font-medium">Travelers:</span> {searchParams.travelers}</div>
          <div><span className="font-medium">Class:</span> {searchParams.class}</div>
        </div>
      </div>

      {flights.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h2 className="text-xl font-bold mb-4">No flights found</h2>
          <p className="text-gray-600">Try adjusting your search criteria.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {flights.map(flight => (
            <div key={flight._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-xl">✈️</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{flight.airline}</h3>
                      <p className="text-gray-600">{flight.number}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-2xl font-bold">{formatTime(flight.departureTime)}</p>
                      <p className="text-gray-600">{getAirportName(flight.origin.split('(')[1]?.replace(')', '') || flight.origin)}</p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-gray-600">{formatDuration(flight.duration)}</p>
                      <div className="w-full h-px bg-gray-300 my-2"></div>
                      <p className="text-sm text-gray-600">Non-stop</p>
                    </div>
                    
                    <div>
                      <p className="text-2xl font-bold">{formatTime(flight.arrivalTime)}</p>
                      <p className="text-gray-600">{getAirportName(flight.destination.split('(')[1]?.replace(')', '') || flight.destination)}</p>
                    </div>
                    
                    <div>
                      <p className="text-3xl font-bold text-blue-600">
                        ${flight[`${searchParams.class}Seats`]?.price || flight.economySeats.price}
                      </p>
                      <p className="text-sm text-gray-600">per person</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 md:mt-0 md:ml-6">
                  <button
                    onClick={() => handleBookFlight(flight)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Book Now
                  </button>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Aircraft:</span> {flight.aircraft}
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Available seats:</span> {flight[`${searchParams.class}Seats`]?.available || flight.economySeats.available}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;