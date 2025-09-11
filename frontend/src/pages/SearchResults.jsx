import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';

const SearchResults = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const searchData = location.state || {};

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (searchData.from) params.append('from', searchData.from);
        if (searchData.to) params.append('to', searchData.to);
        if (searchData.departure) params.append('departure', searchData.departure);

        const response = await axios.get(`/api/flights?${params}`);
        setFlights(response.data);
      } catch (err) {
        setError('Failed to fetch flights');
        console.error('Error fetching flights:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, [searchData]);

  const formatDate = (dateString) => {
    const options = { weekday: 'short', day: 'numeric', month: 'short' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Flight Search Results</h1>
        <p className="text-gray-600">
          {searchData.from} to {searchData.to} • {searchData.departure ? formatDate(searchData.departure) : 'Any date'} • {searchData.travelers} {searchData.travelers === 1 ? 'Traveler' : 'Travelers'}
        </p>
      </div>

      {flights.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <i className="fas fa-search text-4xl text-gray-400 mb-4"></i>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No flights found</h2>
          <p className="text-gray-600">Try adjusting your search criteria</p>
        </div>
      ) : (
        <div className="space-y-4">
          {flights.map(flight => (
            <div key={flight._id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <i className="fas fa-plane text-blue-600"></i>
                    </div>
                    <div>
                      <h3 className="font-semibold">{flight.airline}</h3>
                      <p className="text-sm text-gray-600">{flight.flightNumber}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">₹{flight.price}</p>
                    <p className="text-sm text-gray-600">per person</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-center">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{formatTime(flight.departure.time)}</p>
                    <p className="text-sm text-gray-600">{flight.departure.city} ({flight.departure.code})</p>
                  </div>
                  
                  <div className="flex-1 px-4">
                    <div className="flex items-center">
                      <div className="flex-1 border-t border-gray-300"></div>
                      <div className="px-2 text-sm text-gray-600">{flight.duration}</div>
                      <div className="flex-1 border-t border-gray-300"></div>
                    </div>
                    <div className="text-center text-xs text-gray-500">Non-stop</div>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-2xl font-bold">{formatTime(flight.arrival.time)}</p>
                    <p className="text-sm text-gray-600">{flight.arrival.city} ({flight.arrival.code})</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 flex justify-end">
                <button
                  onClick={() => navigate(`/booking/${flight._id}`)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition"
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;