import React, { useState, useEffect } from 'react';
import { useBooking } from '../../context/BookingContext';
import { useNotification } from '../../context/NotificationContext';
import LoadingSpinner from '../Layout/LoadingSpinner';

const BookingHistory = () => {
  const { bookings, loadBookings, loading, cancelBooking } = useBooking();
  const { showNotification } = useNotification();
  const [filter, setFilter] = useState('all');
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    loadBookings();
  }, []);

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.bookingStatus === filter;
  });

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    setCancellingId(bookingId);
    try {
      await cancelBooking(bookingId, 'User requested cancellation');
      showNotification('Booking cancelled successfully!', 'success');
    } catch (error) {
      showNotification(error.message, 'error');
    } finally {
      setCancellingId(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
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

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800'
    };

    return (
      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClasses[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Booking History</h1>
          
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Bookings</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-500">
              {filter === 'all' 
                ? "You haven't made any bookings yet."
                : `You don't have any ${filter} bookings.`
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div key={booking._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Booking Reference: {booking.bookingReference}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Created on {formatDate(booking.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="mb-2">{getStatusBadge(booking.bookingStatus)}</div>
                    <p className="text-lg font-bold text-green-600">
                      ${booking.totalAmount}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Flight Details</h4>
                    <p className="text-sm text-gray-600">
                      {booking.flight?.flightNumber} - {booking.flight?.airline}
                    </p>
                    <p className="text-sm text-gray-600">
                      {booking.flight?.departure?.airport} → {booking.flight?.arrival?.airport}
                    </p>
                    <p className="text-sm text-gray-600">
                      {formatDate(booking.flight?.departure?.datetime)} at {formatTime(booking.flight?.departure?.datetime)}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Passengers</h4>
                    {booking.passengers.map((passenger, index) => (
                      <div key={index} className="text-sm text-gray-600">
                        {passenger.firstName} {passenger.lastName} - Seat {passenger.seat?.number}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <div>
                    <p className="text-sm text-gray-500">
                      Contact: {booking.contactEmail} | {booking.contactPhone}
                    </p>
                  </div>
                  
                  <div className="space-x-2">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      View Details
                    </button>
                    
                    {booking.bookingStatus === 'confirmed' && (
                      <button
                        onClick={() => handleCancelBooking(booking._id)}
                        disabled={cancellingId === booking._id}
                        className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {cancellingId === booking._id ? 'Cancelling...' : 'Cancel Booking'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingHistory;