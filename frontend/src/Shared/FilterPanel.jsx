import React from 'react';

const FilterPanel = ({ filters, onFilterChange, onClearFilters }) => {
  const handleFilterChange = (filterName, value) => {
    onFilterChange({
      ...filters,
      [filterName]: value
    });
  };

  const handleClear = () => {
    onClearFilters();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Filters</h3>
        <button
          onClick={handleClear}
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          Clear All
        </button>
      </div>

      <div className="space-y-4">
        {/* Price Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="radio"
                id="price-any"
                name="price"
                checked={filters.price === 'any'}
                onChange={() => handleFilterChange('price', 'any')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="price-any" className="ml-2 text-sm text-gray-700">Any price</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="price-economy"
                name="price"
                checked={filters.price === 'economy'}
                onChange={() => handleFilterChange('price', 'economy')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="price-economy" className="ml-2 text-sm text-gray-700">Economy ($0 - $300)</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="price-business"
                name="price"
                checked={filters.price === 'business'}
                onChange={() => handleFilterChange('price', 'business')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="price-business" className="ml-2 text-sm text-gray-700">Business ($300 - $600)</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="price-first"
                name="price"
                checked={filters.price === 'first'}
                onChange={() => handleFilterChange('price', 'first')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="price-first" className="ml-2 text-sm text-gray-700">First Class ($600+)</label>
            </div>
          </div>
        </div>

        {/* Time Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Departure Time</label>
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="radio"
                id="time-any"
                name="time"
                checked={filters.time === 'any'}
                onChange={() => handleFilterChange('time', 'any')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="time-any" className="ml-2 text-sm text-gray-700">Any time</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="time-morning"
                name="time"
                checked={filters.time === 'morning'}
                onChange={() => handleFilterChange('time', 'morning')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="time-morning" className="ml-2 text-sm text-gray-700">Morning (6AM - 12PM)</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="time-afternoon"
                name="time"
                checked={filters.time === 'afternoon'}
                onChange={() => handleFilterChange('time', 'afternoon')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="time-afternoon" className="ml-2 text-sm text-gray-700">Afternoon (12PM - 6PM)</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="time-evening"
                name="time"
                checked={filters.time === 'evening'}
                onChange={() => handleFilterChange('time', 'evening')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="time-evening" className="ml-2 text-sm text-gray-700">Evening (6PM - 12AM)</label>
            </div>
          </div>
        </div>

        {/* Airline Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Airlines</label>
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="airline-all"
                checked={filters.airlines.includes('all')}
                onChange={(e) => {
                  const airlines = e.target.checked ? ['all'] : [];
                  handleFilterChange('airlines', airlines);
                }}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="airline-all" className="ml-2 text-sm text-gray-700">All airlines</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="airline-air-india"
                checked={filters.airlines.includes('air-india')}
                onChange={(e) => {
                  const airlines = e.target.checked
                    ? [...filters.airlines.filter(a => a !== 'all'), 'air-india']
                    : filters.airlines.filter(a => a !== 'air-india');
                  handleFilterChange('airlines', airlines);
                }}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="airline-air-india" className="ml-2 text-sm text-gray-700">Air India</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="airline-indigo"
                checked={filters.airlines.includes('indigo')}
                onChange={(e) => {
                  const airlines = e.target.checked
                    ? [...filters.airlines.filter(a => a !== 'all'), 'indigo']
                    : filters.airlines.filter(a => a !== 'indigo');
                  handleFilterChange('airlines', airlines);
                }}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="airline-indigo" className="ml-2 text-sm text-gray-700">Indigo</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="airline-spicejet"
                checked={filters.airlines.includes('spicejet')}
                onChange={(e) => {
                  const airlines = e.target.checked
                    ? [...filters.airlines.filter(a => a !== 'all'), 'spicejet']
                    : filters.airlines.filter(a => a !== 'spicejet');
                  handleFilterChange('airlines', airlines);
                }}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="airline-spicejet" className="ml-2 text-sm text-gray-700">SpiceJet</label>
            </div>
          </div>
        </div>

        {/* Stops Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Stops</label>
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="radio"
                id="stops-any"
                name="stops"
                checked={filters.stops === 'any'}
                onChange={() => handleFilterChange('stops', 'any')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="stops-any" className="ml-2 text-sm text-gray-700">Any</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="stops-nonstop"
                name="stops"
                checked={filters.stops === 'nonstop'}
                onChange={() => handleFilterChange('stops', 'nonstop')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="stops-nonstop" className="ml-2 text-sm text-gray-700">Non-stop</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="stops-1stop"
                name="stops"
                checked={filters.stops === '1stop'}
                onChange={() => handleFilterChange('stops', '1stop')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="stops-1stop" className="ml-2 text-sm text-gray-700">1 Stop</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="stops-2stops"
                name="stops"
                checked={filters.stops === '2stops'}
                onChange={() => handleFilterChange('stops', '2stops')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="stops-2stops" className="ml-2 text-sm text-gray-700">2+ Stops</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;