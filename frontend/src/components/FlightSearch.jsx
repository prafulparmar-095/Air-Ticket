// frontend/src/components/FlightSearch.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { airports } from '../data/airports';

const FlightSearch = () => {
  const [searchData, setSearchData] = useState({
    origin: '',
    destination: '',
    departureDate: '',
    returnDate: '',
    travelers: 1,
    class: 'economy',
    tripType: 'one-way'
  });
  
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    airlines: [],
    priceRange: [0, 1000],
    departureTime: '',
    arrivalTime: '',
    stops: 'any'
  });
  
  const navigate = useNavigate();
  
  const handleSearch = (e) => {
    e.preventDefault();
    // Navigate to search results with query parameters
    const queryParams = new URLSearchParams(searchData).toString();
    navigate(`/search-results?${queryParams}`);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleAirportSelect = (field, airportCode) => {
    setSearchData(prev => ({ ...prev, [field]: airportCode }));
  };

  // Filter airports for suggestions
  const getAirportSuggestions = (query, field) => {
    if (!query) return airports;
    
    const currentValue = field === 'origin' ? searchData.destination : searchData.origin;
    
    return airports.filter(airport => 
      airport.code.toLowerCase().includes(query.toLowerCase()) ||
      airport.city.toLowerCase().includes(query.toLowerCase()) ||
      airport.name.toLowerCase().includes(query.toLowerCase())
    ).filter(airport => airport.code !== currentValue);
  };

  const [originSuggestions, setOriginSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);

  const handleAirportInput = (field, value) => {
    setSearchData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'origin') {
      setOriginSuggestions(getAirportSuggestions(value, 'origin'));
      setShowOriginSuggestions(true);
    } else {
      setDestinationSuggestions(getAirportSuggestions(value, 'destination'));
      setShowDestinationSuggestions(true);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="flex space-x-4 mb-4">
        <button 
          className={`px-4 py-2 rounded-full ${searchData.tripType === 'one-way' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setSearchData(prev => ({ ...prev, tripType: 'one-way', returnDate: '' }))}
        >
          One Way
        </button>
        <button 
          className={`px-4 py-2 rounded-full ${searchData.tripType === 'round-trip' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setSearchData(prev => ({ ...prev, tripType: 'round-trip' }))}
        >
          Round Trip
        </button>
      </div>
      
      <form onSubmit={handleSearch}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Origin Airport */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
            <input
              type="text"
              name="origin"
              value={searchData.origin}
              onChange={(e) => handleAirportInput('origin', e.target.value)}
              onFocus={() => setShowOriginSuggestions(true)}
              placeholder="City or airport"
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
            {showOriginSuggestions && originSuggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {originSuggestions.map(airport => (
                  <div
                    key={airport.code}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      handleAirportSelect('origin', airport.code);
                      setShowOriginSuggestions(false);
                    }}
                  >
                    <div className="font-medium">{airport.city} ({airport.code})</div>
                    <div className="text-sm text-gray-600">{airport.name}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Destination Airport */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
            <input
              type="text"
              name="destination"
              value={searchData.destination}
              onChange={(e) => handleAirportInput('destination', e.target.value)}
              onFocus={() => setShowDestinationSuggestions(true)}
              placeholder="City or airport"
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
            {showDestinationSuggestions && destinationSuggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {destinationSuggestions.map(airport => (
                  <div
                    key={airport.code}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      handleAirportSelect('destination', airport.code);
                      setShowDestinationSuggestions(false);
                    }}
                  >
                    <div className="font-medium">{airport.city} ({airport.code})</div>
                    <div className="text-sm text-gray-600">{airport.name}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Departure Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Departure</label>
            <input
              type="date"
              name="departureDate"
              value={searchData.departureDate}
              onChange={handleInputChange}
              min={new Date().toISOString().split('T')[0]}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          
          {/* Return Date */}
          {searchData.tripType === 'round-trip' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Return</label>
              <input
                type="date"
                name="returnDate"
                value={searchData.returnDate}
                onChange={handleInputChange}
                min={searchData.departureDate || new Date().toISOString().split('T')[0]}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          )}
          
          {/* Travelers */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Travelers</label>
            <select
              name="travelers"
              value={searchData.travelers}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              {[1, 2, 3, 4, 5, 6].map(num => (
                <option key={num} value={num}>{num} {num === 1 ? 'Traveler' : 'Travelers'}</option>
              ))}
            </select>
          </div>
          
          {/* Class */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
            <select
              name="class"
              value={searchData.class}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="economy">Economy</option>
              <option value="premium-economy">Premium Economy</option>
              <option value="business">Business</option>
              <option value="first">First Class</option>
            </select>
          </div>
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors"
        >
          Search Flights
        </button>
      </form>
    </div>
  );
};

export default FlightSearch;