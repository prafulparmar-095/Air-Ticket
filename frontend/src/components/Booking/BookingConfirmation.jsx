import React from 'react';
import { Link } from 'react-router-dom';

const BookingConfirmation = ({ booking }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!booking) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Booking Not Found</h2>
        <p className="text-gray-600 mt-2">Please check your booking reference or try again later.</p>
        <Link to="/" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
        <p className="text-gray-600">Your flight has been successfully booked.</p>
        <p className="text-lg font-semibold text-blue-600 mt-2">
          Booking Reference: {booking.bookingReference}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Booking Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="font-medium mb-2">Flight Information</h3>
            <p><span className="text-gray-600">Flight:</span> {booking.flight.flightNumber}</p>
            <p><span className="text-gray-600">Airline:</span> {booking.flight.airline}</p>
            <p><span className="text-gray-600">Aircraft:</span> {booking.flight.aircraft}</p>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Travel Dates</h3>
            <p><span className="text-gray-600">Departure:</span> {formatDate(booking.flight.departure.datetime)}</p>
            <p><span className="text-gray-600">Time:</span> {formatTime(booking.flight.departure.datetime)}</p>
            <p><span className="text-gray-600">Duration:</span> {Math.floor(booking.flight.duration / 60)}h {booking.flight.duration % 60}m</p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-medium mb-2">Route</h3>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <p className="font-semibold">{booking.flight.departure.airport}</p>
              <p className="text-sm text-gray-600">{booking.flight.departure.city}</p>
            </div>
            <div className="flex-1 px-4 text-center">
              <div className="w-full border-t-2 border-dashed border-gray-300 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="text-center">
              <p className="font-semibold">{booking.flight.arrival.airport}</p>
              <p className="text-sm text-gray-600">{booking.flight.arrival.city}</p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-medium mb-2">Passengers</h3>
          <div className="space-y-3">
            {booking.passengers.map((passenger, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium">{passenger.firstName} {passenger.lastName}</p>
                <p className="text-sm text-gray-600">
                  Seat: {passenger.seat.number} ({passenger.seat.class})
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Total Amount:</span>
            <span className="text-2xl font-bold text-green-600">${booking.totalAmount}</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">Payment Status: {booking.paymentStatus}</p>
        </div>
      </div>

      <div className="bg-blue-50 rounded-lg p-6 mb-6">
        <h3 className="font-semibold mb-3">📧 Confirmation Email Sent</h3>
        <p className="text-gray-700">
          A confirmation email has been sent to {booking.contactEmail} with your booking details and e-ticket.
        </p>
      </div>

      <div className="bg-yellow-50 rounded-lg p-6 mb-6">
        <h3 className="font-semibold mb-3">ℹ️ Important Information</h3>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Please arrive at the airport at least 2 hours before departure for domestic flights</li>
          <li>Carry a valid government-issued photo ID for all passengers</li>
          <li>Check-in online 24 hours before departure to save time at the airport</li>
          <li>Baggage allowance: 7kg cabin baggage + 15kg check-in baggage per passenger</li>
        </ul>
      </div>

      <div className="text-center">
        <Link
          to="/my-bookings"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 mr-4"
        >
          View My Bookings
        </Link>
        <Link
          to="/"
          className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300"
        >
          Book Another Flight
        </Link>
      </div>
    </div>
  );
};

export default BookingConfirmation;