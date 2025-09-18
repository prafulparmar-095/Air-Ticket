import React from 'react';
import { Link } from 'react-router-dom';

const PaymentSuccess = ({ payment, booking }) => {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4 text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
        </svg>
      </div>
      
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
      <p className="text-lg text-gray-600 mb-8">
        Thank you for your payment. Your booking has been confirmed.
      </p>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Transaction Details</h2>
        
        <div className="space-y-3 text-left">
          <div className="flex justify-between">
            <span className="text-gray-600">Transaction ID:</span>
            <span className="font-medium">{payment.transactionId}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Amount Paid:</span>
            <span className="font-medium text-green-600">${payment.amount}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Payment Method:</span>
            <span className="font-medium capitalize">{payment.paymentMethod.replace('_', ' ')}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Booking Reference:</span>
            <span className="font-medium">{booking.bookingReference}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Status:</span>
            <span className="font-medium text-green-600 capitalize">{payment.paymentStatus}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Date:</span>
            <span className="font-medium">
              {new Date(payment.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Link
          to={`/booking-confirmation/${booking._id}`}
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-medium"
        >
          View Booking Details
        </Link>
        
        <div className="text-sm text-gray-600">
          <p>A confirmation email has been sent to your email address.</p>
          <p>You can also view your booking in the "My Bookings" section.</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;