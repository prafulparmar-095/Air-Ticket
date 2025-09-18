import React from 'react';
import { Link } from 'react-router-dom';

const PaymentFailed = ({ error, onRetry }) => {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4 text-center">
      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </div>
      
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Failed</h1>
      <p className="text-lg text-gray-600 mb-6">
        We encountered an issue processing your payment. Please try again.
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800 font-medium">Error: {error}</p>
        </div>
      )}

      <div className="space-y-4">
        <button
          onClick={onRetry}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-medium mr-4"
        >
          Try Again
        </button>
        
        <Link
          to="/"
          className="inline-block bg-gray-200 text-gray-800 px-8 py-3 rounded-lg hover:bg-gray-300 font-medium"
        >
          Return to Home
        </Link>
      </div>

      <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
        <h3 className="font-semibold mb-2">Need Help?</h3>
        <p className="text-sm text-gray-600">
          If you continue to experience issues, please contact our support team at{" "}
          <a href="mailto:support@airindia.com" className="text-blue-600 hover:text-blue-800">
            support@airindia.com
          </a>{" "}
          or call us at +1-800-AIR-INDIA.
        </p>
      </div>
    </div>
  );
};

export default PaymentFailed;