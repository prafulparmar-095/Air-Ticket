import { useState } from 'react'
import useApi from '../hooks/useApi'
import { bookingsService } from '../services/bookings'
import LoadingSpinner from '../components/layout/LoadingSpinner'
import { Calendar, Plane, MapPin, Clock, User, CreditCard } from 'lucide-react'

const MyBookings = () => {
  const [filter, setFilter] = useState('all')
  const { data: bookings, loading, error, refetch } = useApi('/bookings/user')

  const filteredBookings = bookings?.filter(booking => {
    if (filter === 'all') return true
    if (filter === 'upcoming') return booking.status === 'confirmed'
    if (filter === 'completed') return booking.status === 'completed'
    if (filter === 'cancelled') return booking.status === 'cancelled'
    return true
  })

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return

    try {
      await bookingsService.cancel(bookingId)
      refetch()
    } catch (error) {
      console.error('Failed to cancel booking:', error)
    }
  }

  if (loading) return <LoadingSpinner />
  if (error) return <div className="text-center text-red-600">Error: {error}</div>

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
            
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="all">All Bookings</option>
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {filteredBookings?.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No bookings found
              </h3>
              <p className="text-gray-600">
                {filter === 'all' 
                  ? "You haven't made any bookings yet."
                  : `No ${filter} bookings found.`
                }
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredBookings?.map((booking) => (
                <div key={booking.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Booking #{booking.bookingReference}
                      </h3>
                      <p className="text-gray-600">
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {booking.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div>
                      <h4 className="font-semibold mb-2">Flight Details</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Plane className="w-4 h-4 text-gray-400" />
                          <span>{booking.flight.airline}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span>
                            {booking.flight.origin} → {booking.flight.destination}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>
                            {new Date(booking.flight.departureTime).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Passengers</h4>
                      <div className="space-y-2">
                        {booking.passengers.map((passenger, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span>
                              {passenger.firstName} {passenger.lastName}
                              {passenger.seat && ` (Seat ${passenger.seat})`}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center border-t pt-4">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-gray-400" />
                      <span className="font-semibold">
                        ${booking.totalAmount}
                      </span>
                    </div>

                    {booking.status === 'confirmed' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50"
                        >
                          Cancel Booking
                        </button>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                          View Details
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MyBookings