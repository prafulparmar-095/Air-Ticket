import React, { useState } from 'react';
import axios from 'axios';

const Payment = ({ booking, onSuccess, onCancel }) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setError(null);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update booking status to confirmed
      await axios.put(`/api/bookings/${booking._id}/confirm`, {
        paymentId: 'simulated_payment_' + Date.now()
      });
      
      onSuccess({ id: 'simulated_payment_' + Date.now() });
    } catch (err) {
      const message = err.response?.data?.message || 'Payment failed';
      setError(message);
      setProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setPaymentMethod('card')}
              className={`p-3 border rounded-lg text-center ${
                paymentMethod === 'card' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300'
              }`}
            >
              <i className="fas fa-credit-card mb-2"></i>
              <div>Credit Card</div>
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod('upi')}
              className={`p-3 border rounded-lg text-center ${
                paymentMethod === 'upi' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300'
              }`}
            >
              <i className="fas fa-mobile-alt mb-2"></i>
              <div>UPI</div>
            </button>
          </div>
        </div>

        {paymentMethod === 'card' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
              <input
                type="text"
                name="number"
                value={cardDetails.number}
                onChange={handleCardChange}
                placeholder="1234 5678 9012 3456"
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
              <input
                type="text"
                name="name"
                value={cardDetails.name}
                onChange={handleCardChange}
                placeholder="John Doe"
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                <input
                  type="text"
                  name="expiry"
                  value={cardDetails.expiry}
                  onChange={handleCardChange}
                  placeholder="MM/YY"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                <input
                  type="text"
                  name="cvv"
                  value={cardDetails.cvv}
                  onChange={handleCardChange}
                  placeholder="123"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {paymentMethod === 'upi' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">UPI ID</label>
            <input
              type="text"
              placeholder="yourname@upi"
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium mb-2">Order Summary</h3>
          <div className="flex justify-between mb-1">
            <span>Flight:</span>
            <span>{booking.flight.airline} - {booking.flight.flightNumber}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>Passengers:</span>
            <span>{booking.passengers.length}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>Base Fare:</span>
            <span>₹{booking.totalPrice}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>Taxes & Fees:</span>
            <span>₹0</span>
          </div>
          <div className="border-t border-gray-200 pt-2 mt-2">
            <div className="flex justify-between font-semibold">
              <span>Total:</span>
              <span>₹{booking.totalPrice}</span>
            </div>
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-3 px-4 rounded-lg transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={processing}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition disabled:opacity-50"
          >
            {processing ? 'Processing...' : `Pay ₹${booking.totalPrice}`}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Payment;