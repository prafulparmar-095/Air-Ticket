import React from 'react';
import FlightCard from './FlightCard';

const FlightList = ({ flights, onSelectFlight }) => {
  if (!flights || flights.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">No flights found</h3>
        <p className="text-gray-500 mt-2">Try adjusting your search criteria</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {flights.map(flight => (
        <FlightCard
          key={flight._id}
          flight={flight}
          onSelect={onSelectFlight}
        />
      ))}
    </div>
  );
};

export default FlightList;