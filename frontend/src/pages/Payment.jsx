// frontend/src/pages/Payment.jsx
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../hooks/useAuth';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { post } = useApi();
  const { user } = useAuth();
  const [booking, setBooking] = useState(null);
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
    paymentMethod: 'credit_card'
  });

  useEffect(() => {
    if (location.state?.booking && location.state?.flight) {
      setBooking(location.state.booking);
      setFlight(location.state.flight);
    } else {
      navigate('/');
    }
  }, [location.state, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Simulate payment processing
      const paymentResponse = await post('/payments/process', {
        bookingId: booking._id,
        amount: booking.fareDetails.totalAmount,
        paymentMethod: paymentData.paymentMethod,
        cardDetails: {
          last4: paymentData.cardNumber.slice(-4),
          brand: 'visa' // This would be determined from card number in real app
        }
      });

      if (paymentResponse.success) {
        navigate('/payment-success', { 
          state: { 
            booking: paymentResponse.booking,
            flight 
          } 
        });
      } else {
        setError('Payment failed. Please try again.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setError('Payment processing failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    return parts.length ? parts.join(' ') : value;
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\D/g, '').substring(0, 4);
    if (v.length > 2) {
      return `${v.substring(0, 2)}/${v.substring(2)}`;
    }
    return v;
  };

  if (!booking || !flight) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Payment</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-bold mb-4">Order Summary</h2>
            
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
              <h3 className="font-semibold mb-2">Price Breakdown</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Base Fare</span>
                  <span>${booking.fareDetails.baseFare * booking.passengers.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax ({booking.fareDetails.tax}%)</span>
                  <span>${(booking.fareDetails.baseFare * booking.passengers.length * booking.fareDetails.tax / 100).toFixed(2)}</span>
                </div>
                {booking.fareDetails.baggageFee > 0 && (
                  <div className="flex justify-between">
                    <span>Baggage Fee</span>
                    <span>${booking.fareDetails.baggageFee}</span>
                  </div>
                )}
                {booking.fareDetails.seatSelectionFee > 0 && (
                  <div className="flex justify-between">
                    <span>Seat Selection</span>
                    <span>${booking.fareDetails.seatSelectionFee}</span>
                  </div>
                )}
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${booking.fareDetails.totalAmount}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-bold mb-4">Payment Details</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method
                </label>
                <select
                  name="paymentMethod"
                  value={paymentData.paymentMethod}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="credit_card">Credit Card</option>
                  <option value="debit_card">Debit Card</option>
                  <option value="paypal">PayPal</option>
                </select>
              </div>

              {paymentData.paymentMethod !== 'paypal' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formatCardNumber(paymentData.cardNumber)}
                      onChange={(e) => setPaymentData(prev => ({
                        ...prev,
                        cardNumber: e.target.value.replace(/\D/g, '')
                      }))}
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Card Holder Name
                    </label>
                    <input
                      type="text"
                      name="cardHolder"
                      value={paymentData.cardHolder}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={formatExpiryDate(paymentData.expiryDate)}
                        onChange={(e) => setPaymentData(prev => ({
                          ...prev,
                          expiryDate: e.target.value.replace(/\D/g, '')
                        }))}
                        placeholder="MM/YY"
                        maxLength="5"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CVV
                      </label>
                      <input
                        type="text"
                        name="cvv"
                        value={paymentData.cvv}
                        onChange={(e) => setPaymentData(prev => ({
                          ...prev,
                          cvv: e.target.value.replace(/\D/g, '')
                        }))}
                        placeholder="123"
                        maxLength="4"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              {paymentData.paymentMethod === 'paypal' && (
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md">
                  <p className="text-yellow-800">
                    You will be redirected to PayPal to complete your payment.
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : `Pay $${booking.fareDetails.totalAmount}`}
              </button>
            </form>

            <div className="mt-6 p-4 bg-gray-50 rounded-md">
              <h3 className="font-semibold mb-2">Secure Payment</h3>
              <p className="text-sm text-gray-600">
                Your payment information is encrypted and secure. We do not store your card details.
              </p>
              <div className="flex space-x-2 mt-2">
                <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                  <span className="text-xs">🔒</span>
                </div>
                <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                  <span className="text-xs">SSL</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;