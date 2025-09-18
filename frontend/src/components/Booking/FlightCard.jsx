import React from 'react';

const FlightCard = ({ flight, onSelect }) => {
  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-bold text-sm">AI</span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{flight.airline}</h3>
            <p className="text-sm text-gray-500">{flight.flightNumber}</p>
          </div>
        </div>
        
        <div className="text-right">
          <span className="text-2xl font-bold text-gray-900">
            ${flight.prices.economy}
          </span>
          <p className="text-sm text-gray-500">Economy</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {formatTime(flight.departure.datetime)}
          </div>
          <div className="text-sm text-gray-500">{flight.departure.airport}</div>
          <div className="text-xs text-gray-400">{flight.departure.city}</div>
        </div>

        <div className="flex-1 px-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center">
              <div className="bg-white px-2 text-sm text-gray-500">
                {formatDuration(flight.duration)}
              </div>
            </div>
          </div>
          <div className="text-center text-xs text-gray-400 mt-1">
            {flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
          </div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {formatTime(flight.arrival.datetime)}
          </div>
          <div className="text-sm text-gray-500">{flight.arrival.airport}</div>
          <div className="text-xs text-gray-400">{flight.arrival.city}</div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          {formatDate(flight.departure.datetime)}
        </div>
        
        <button
          onClick={() => onSelect(flight)}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
        >
          Select Flight
        </button>
      </div>
    </div>
  );
};

export default FlightCard;