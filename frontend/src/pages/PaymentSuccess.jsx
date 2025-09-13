// frontend/src/pages/PaymentSuccess.jsx
import { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { booking, flight } = location.state || {};

  useEffect(() => {
    if (!booking || !flight) {
      navigate('/');
    }
  }, [booking, flight, navigate]);

  if (!booking || !flight) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6">
          <div className="flex items-center justify-center mb-2">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-2xl text-white">✓</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
          <p>Your flight has been booked successfully.</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Booking Confirmation</h2>
          
          <div className="mb-4">
            <p className="text-lg font-semibold">Booking Reference</p>
            <p className="text-2xl font-bold text-blue-600">{booking.bookingReference}</p>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold mb-2">Flight Details</h3>
            <p><strong>{flight.airline}</strong> {flight.number}</p>
            <p>{flight.origin} → {flight.destination}</p>
            <p>Departure: {new Date(flight.departureTime).toLocaleString()}</p>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold mb-2">Passengers</h3>
            {booking.passengers.map((passenger, index) => (
              <div key={index} className="mb-2">
                <p>{passenger.firstName} {passenger.lastName}</p>
                {passenger.seat && <p className="text-sm text-gray-600">Seat: {passenger.seat}</p>}
              </div>
            ))}
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">Payment Details</h3>
            <p className="text-lg font-bold">Total Paid: ${booking.fareDetails.totalAmount}</p>
            <p className="text-sm text-gray-600">Payment Status: {booking.payment?.status || 'completed'}</p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
          <h3 className="font-semibold mb-2">What's Next?</h3>
          <p className="text-sm text-blue-800">
            You will receive a confirmation email shortly with your e-ticket and boarding pass.
            Please check-in online 24 hours before your flight.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </Link>
          <Link
            to="/profile"
            className="bg-gray-600 text-white px-6 py-3 rounded-md hover:bg-gray-700 transition-colors"
          >
            View My Bookings
          </Link>
          <button
            onClick={() => window.print()}
            className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors"
          >
            Print Confirmation
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;