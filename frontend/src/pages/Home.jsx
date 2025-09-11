import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AirportSearch from '../components/AirportSearch';
import DatePicker from '../components/DataPicker';

const Home = () => {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    from: '',
    fromCode: '',
    to: '',
    toCode: '',
    departure: '',
    return: '',
    travelers: 1,
    tripType: 'one-way'
  });

  const [errors, setErrors] = useState({});

  const handleSearch = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    
    if (!searchData.fromCode) {
      newErrors.from = 'Please select a departure airport';
    }
    
    if (!searchData.toCode) {
      newErrors.to = 'Please select a destination airport';
    }
    
    if (!searchData.departure) {
      newErrors.departure = 'Please select departure date';
    }
    
    if (searchData.tripType === 'round-trip' && !searchData.return) {
      newErrors.return = 'Please select return date';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    navigate('/search', { state: searchData });
  };

  const handleFromSelect = (airport) => {
    setSearchData(prev => ({
      ...prev,
      from: `${airport.city} (${airport.code})`,
      fromCode: airport.code
    }));
    setErrors(prev => ({ ...prev, from: undefined }));
  };

  const handleToSelect = (airport) => {
    setSearchData(prev => ({
      ...prev,
      to: `${airport.city} (${airport.code})`,
      toCode: airport.code
    }));
    setErrors(prev => ({ ...prev, to: undefined }));
  };

  const handleInputChange = (name, value) => {
    setSearchData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-blue-900 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Book Your Flight With Ease</h1>
            <p className="text-xl mb-8">Find the best deals on flights to your favorite destinations</p>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="container mx-auto px-4 py-8 -mt-16 relative z-20">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex border-b border-gray-200 mb-6">
            <button 
              className={`px-4 py-2 font-semibold ${searchData.tripType === 'one-way' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              onClick={() => handleInputChange('tripType', 'one-way')}
            >
              One Way
            </button>
            <button 
              className={`px-4 py-2 font-semibold ${searchData.tripType === 'round-trip' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              onClick={() => handleInputChange('tripType', 'round-trip')}
            >
              Round Trip
            </button>
          </div>

          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* From Airport */}
            <div>
              <AirportSearch
                label="From"
                value={searchData.from}
                onChange={(value) => handleInputChange('from', value)}
                onSelect={handleFromSelect}
                placeholder="Departure city or airport"
                required
              />
              {errors.from && <p className="mt-1 text-sm text-red-600">{errors.from}</p>}
            </div>

            {/* To Airport */}
            <div>
              <AirportSearch
                label="To"
                value={searchData.to}
                onChange={(value) => handleInputChange('to', value)}
                onSelect={handleToSelect}
                placeholder="Destination city or airport"
                required
              />
              {errors.to && <p className="mt-1 text-sm text-red-600">{errors.to}</p>}
            </div>

            {/* Departure Date */}
            <div>
              <DatePicker
                label="Departure"
                value={searchData.departure}
                onChange={(value) => handleInputChange('departure', value)}
                minDate={today}
                required
              />
              {errors.departure && <p className="mt-1 text-sm text-red-600">{errors.departure}</p>}
            </div>

            {/* Return Date (only for round trip) */}
            {searchData.tripType === 'round-trip' && (
              <div>
                <DatePicker
                  label="Return"
                  value={searchData.return}
                  onChange={(value) => handleInputChange('return', value)}
                  minDate={searchData.departure || tomorrowStr}
                  required
                />
                {errors.return && <p className="mt-1 text-sm text-red-600">{errors.return}</p>}
              </div>
            )}

            {/* Travelers */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Travelers</label>
              <select
                name="travelers"
                value={searchData.travelers}
                onChange={(e) => handleInputChange('travelers', parseInt(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <option key={num} value={num}>{num} {num === 1 ? 'Traveler' : 'Travelers'}</option>
                ))}
              </select>
            </div>

            {/* Search Button */}
            <div className="md:col-span-2 lg:col-span-1 flex items-end">
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition"
              >
                <i className="fas fa-search mr-2"></i>Search Flights
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* ... rest of your Home page content ... */}
    </div>
  );
};

export default Home;