import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useApi } from '../hooks/useApi'
import LoadingSpinner from '../components/LoadingSpinner'
import { formatDate, formatCurrency } from '../utils/formatters'

const Profile = () => {
  const { user } = useAuth()
  const api = useApi()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('bookings')

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get('/bookings/user')
        setBookings(response.data)
      } catch (error) {
        console.error('Failed to fetch bookings:', error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchBookings()
    }
  }, [user])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>

        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Personal Information</h2>
          </div>
          <div className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Name</label>
                <p className="text-lg">{user.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <p className="text-lg">{user.email}</p>
              </div>
              {user.phone && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Phone</label>
                  <p className="text-lg">{user.phone}</p>
                </div>
              )}
              {user.dateOfBirth && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Date of Birth</label>
                  <p className="text-lg">{formatDate(user.dateOfBirth)}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white shadow rounded-lg">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('bookings')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'bookings'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                My Bookings
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'bookings' && (
              <div>
                <h3 className="text-lg font-medium mb-4">Flight Bookings</h3>
                {bookings.length === 0 ? (
                  <p className="text-gray-500">You don't have any bookings yet.</p>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div key={booking._id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold">
                              {booking.flight.origin} → {booking.flight.destination}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {formatDate(booking.flight.departureTime)} • {booking.passengers.length} passengers
                            </p>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            booking.status === 'confirmed' 
                              ? 'bg-green-100 text-green-800'
                              : booking.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-lg font-bold text-primary-600">
                            {formatCurrency(booking.totalAmount)}
                          </p>
                          <p className="text-sm text-gray-600">
                            Booking ID: {booking._id}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile;