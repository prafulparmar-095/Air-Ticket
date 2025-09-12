// frontend/src/components/FilterSidebar.jsx
import { useState, useEffect } from 'react';

const FilterSidebar = ({ filters, setFilters, flights }) => {
  const [priceRange, setPriceRange] = useState(filters.priceRange);
  const [airlineOptions, setAirlineOptions] = useState([]);
  
  useEffect(() => {
    if (flights && flights.length > 0) {
      // Extract unique airlines from flights
      const airlines = [...new Set(flights.map(flight => flight.airline))];
      setAirlineOptions(airlines);
      
      // Set initial price range based on flights
      const prices = flights.map(f => f.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      setPriceRange([minPrice, maxPrice]);
      setFilters(prev => ({ ...prev, priceRange: [minPrice, maxPrice] }));
    }
  }, [flights, setFilters]);
  
  const handleAirlineChange = (airline) => {
    const updatedAirlines = filters.airlines.includes(airline)
      ? filters.airlines.filter(a => a !== airline)
      : [...filters.airlines, airline];
    
    setFilters({ ...filters, airlines: updatedAirlines });
  };
  
  const handlePriceChange = (values) => {
    setPriceRange(values);
    setFilters({ ...filters, priceRange: values });
  };
  
  const handleStopsChange = (stops) => {
    setFilters({ ...filters, stops });
  };
  
  const handleTimeChange = (type, value) => {
    setFilters({ ...filters, [type]: value });
  };
  
  const handleDurationChange = (duration) => {
    setFilters({ ...filters, duration });
  };
  
  const clearFilters = () => {
    const minPrice = Math.min(...flights.map(f => f.price));
    const maxPrice = Math.max(...flights.map(f => f.price));
    
    setFilters({
      airlines: [],
      priceRange: [minPrice, maxPrice],
      stops: 'any',
      departureTime: 'any',
      arrivalTime: 'any',
      duration: 'any'
    });
    setPriceRange([minPrice, maxPrice]);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 sticky top-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg">Filters</h3>
        <button 
          onClick={clearFilters}
          className="text-blue-600 text-sm hover:underline"
        >
          Clear all
        </button>
      </div>
      
      <div className="space-y-6">
        {/* Price Filter */}
        <div>
          <h4 className="font-medium mb-2">Price Range</h4>
          <div className="px-2">
            <input
              type="range"
              min={priceRange[0]}
              max={priceRange[1]}
              value={filters.priceRange[1]}
              onChange={(e) => handlePriceChange([filters.priceRange[0], parseInt(e.target.value)])}
              className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between mt-2">
              <span className="text-sm text-gray-600">${filters.priceRange[0]}</span>
              <span className="text-sm text-gray-600">${filters.priceRange[1]}</span>
            </div>
          </div>
        </div>
        
        {/* Airlines Filter */}
        {airlineOptions.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Airlines</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {airlineOptions.map(airline => (
                <label key={airline} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.airlines.includes(airline)}
                    onChange={() => handleAirlineChange(airline)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm">{airline}</span>
                </label>
              ))}
            </div>
          </div>
        )}
        
        {/* Stops Filter */}
        <div>
          <h4 className="font-medium mb-2">Stops</h4>
          <div className="space-y-2">
            {['any', '0', '1', '2'].map(stop => (
              <label key={stop} className="flex items-center">
                <input
                  type="radio"
                  name="stops"
                  checked={filters.stops === stop}
                  onChange={() => handleStopsChange(stop)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm">
                  {stop === 'any' ? 'Any' : stop === '0' ? 'Non-stop' : `${stop} stop${stop === '1' ? '' : 's'}`}
                </span>
              </label>
            ))}
          </div>
        </div>
        
        {/* Departure Time Filter */}
        <div>
          <h4 className="font-medium mb-2">Departure Time</h4>
          <div className="space-y-2">
            <select
              value={filters.departureTime}
              onChange={(e) => handleTimeChange('departureTime', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-sm"
            >
              <option value="any">Any time</option>
              <option value="0-6">Before 6 AM</option>
              <option value="6-12">6 AM - 12 PM</option>
              <option value="12-18">12 PM - 6 PM</option>
              <option value="18-24">After 6 PM</option>
            </select>
          </div>
        </div>
        
        {/* Arrival Time Filter */}
        <div>
          <h4 className="font-medium mb-2">Arrival Time</h4>
          <div className="space-y-2">
            <select
              value={filters.arrivalTime}
              onChange={(e) => handleTimeChange('arrivalTime', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-sm"
            >
              <option value="any">Any time</option>
              <option value="0-6">Before 6 AM</option>
              <option value="6-12">6 AM - 12 PM</option>
              <option value="12-18">12 PM - 6 PM</option>
              <option value="18-24">After 6 PM</option>
            </select>
          </div>
        </div>
        
        {/* Duration Filter */}
        <div>
          <h4 className="font-medium mb-2">Flight Duration</h4>
          <div className="space-y-2">
            <select
              value={filters.duration}
              onChange={(e) => handleDurationChange(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-sm"
            >
              <option value="any">Any duration</option>
              <option value="0-3">Up to 3 hours</option>
              <option value="3-6">3-6 hours</option>
              <option value="6-9">6-9 hours</option>
              <option value="9-12">9-12 hours</option>
              <option value="12-24">Over 12 hours</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;