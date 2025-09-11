import React, { useState, useRef, useEffect } from 'react';

const AirportSearch = ({ 
  label, 
  value, 
  onChange, 
  onSelect, 
  placeholder = "City or airport",
  required = false 
}) => {
  const [query, setQuery] = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Import airport data (you can replace this with API call)
  const airports = [
    {"code": "DEL", "name": "Indira Gandhi International Airport", "city": "Delhi", "country": "India"},
    {"code": "BOM", "name": "Chhatrapati Shivaji Maharaj International Airport", "city": "Mumbai", "country": "India"},
    {"code": "BLR", "name": "Kempegowda International Airport", "city": "Bangalore", "country": "India"},
    {"code": "MAA", "name": "Chennai International Airport", "city": "Chennai", "country": "India"},
    {"code": "HYD", "name": "Rajiv Gandhi International Airport", "city": "Hyderabad", "country": "India"},
    {"code": "CCU", "name": "Netaji Subhas Chandra Bose International Airport", "city": "Kolkata", "country": "India"},
    {"code": "GOI", "name": "Goa International Airport", "city": "Goa", "country": "India"},
    {"code": "PNQ", "name": "Pune Airport", "city": "Pune", "country": "India"},
    {"code": "ATQ", "name": "Sri Guru Ram Dass Jee International Airport", "city": "Amritsar", "country": "India"},
    {"code": "JAI", "name": "Jaipur International Airport", "city": "Jaipur", "country": "India"},
    {"code": "LKO", "name": "Chaudhary Charan Singh International Airport", "city": "Lucknow", "country": "India"},
    {"code": "AMD", "name": "Sardar Vallabhbhai Patel International Airport", "city": "Ahmedabad", "country": "India"},
    {"code": "DXB", "name": "Dubai International Airport", "city": "Dubai", "country": "UAE"},
    {"code": "SIN", "name": "Singapore Changi Airport", "city": "Singapore", "country": "Singapore"},
    {"code": "BKK", "name": "Suvarnabhumi Airport", "city": "Bangkok", "country": "Thailand"},
    {"code": "KUL", "name": "Kuala Lumpur International Airport", "city": "Kuala Lumpur", "country": "Malaysia"},
    {"code": "LHR", "name": "Heathrow Airport", "city": "London", "country": "UK"},
    {"code": "JFK", "name": "John F. Kennedy International Airport", "city": "New York", "country": "USA"},
    {"code": "LAX", "name": "Los Angeles International Airport", "city": "Los Angeles", "country": "USA"}
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          inputRef.current && !inputRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchAirports = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const filtered = airports.filter(airport =>
      airport.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      airport.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      airport.code.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setSuggestions(filtered);
    setIsLoading(false);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onChange(value);
    searchAirports(value);
    setIsOpen(true);
  };

  const handleSelect = (airport) => {
    setQuery(`${airport.city} (${airport.code})`);
    setIsOpen(false);
    setSuggestions([]);
    if (onSelect) {
      onSelect({
        city: airport.city,
        code: airport.code,
        name: airport.name
      });
    }
  };

  const handleFocus = () => {
    if (query && suggestions.length > 0) {
      setIsOpen(true);
    }
  };

  return (
    <div className="relative">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={handleFocus}
          placeholder={placeholder}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          required={required}
        />
        
        {isLoading && (
          <div className="absolute right-3 top-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>

      {isOpen && suggestions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((airport, index) => (
            <div
              key={`${airport.code}-${index}`}
              className="px-4 py-3 cursor-pointer hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0"
              onClick={() => handleSelect(airport)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium text-gray-900">
                    {airport.city} ({airport.code})
                  </div>
                  <div className="text-sm text-gray-600">
                    {airport.name}
                  </div>
                </div>
                <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {airport.country}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isOpen && query && suggestions.length === 0 && !isLoading && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
          <div className="text-center text-gray-500">
            No airports found for "{query}"
          </div>
        </div>
      )}
    </div>
  );
};

export default AirportSearch;