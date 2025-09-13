// frontend/src/components/BookingManagement.jsx
import { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';

const BookingManagement = () => {
  const { get, put } = useApi();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await get('/bookings?populate=flight,user');
      setBookings(data.data);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await put(`/bookings/${bookingId}`, { status: newStatus });
      fetchBookings(); // Refresh the list
    } catch (error) {
      console.error('Failed to update booking status:', error);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-6">Booking Management</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reference
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Flight
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookings.map(booking => (
              <tr key={booking._id}>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {booking.bookingReference}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {booking.user?.name || 'N/A'}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {booking.flight?.number} ({booking.flight?.origin} → {booking.flight?.destination})
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${booking.totalAmount}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <select
                    value={booking.status}
                    onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                    className={`border rounded-md px-2 py-1 text-xs font-medium ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-800 border-green-200' :
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                      booking.status === 'cancelled' ? 'bg-red-100 text-red-800 border-red-200' :
                      'bg-blue-100 text-blue-800 border-blue-200'
                    }`}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="completed">Completed</option>
                  </select>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(booking.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingManagement;