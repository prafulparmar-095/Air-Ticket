import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useApi } from '../hooks/useApi'
import LoadingSpinner from '../components/LoadingSpinner'

const AdminPanel = () => {
  const { user } = useAuth()
  const api = useApi()
  const [activeTab, setActiveTab] = useState('flights')
  const [flights, setFlights] = useState([])
  const [bookings, setBookings] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [showFlightForm, setShowFlightForm] = useState(false)
  const [flightForm, setFlightForm] = useState({
    airline: '',
    flightNumber: '',
    origin: '',
    destination: '',
    departureTime: '',
    arrivalTime: '',
    duration: 0,
    price: 0,
    seats: {
      economy: 0,
      business: 0,
      first: 0
    }
  })

  useEffect(() => {
    if (user && user.isAdmin) {
      fetchData()
    }
  }, [user, activeTab])

  const fetchData = async () => {
    setLoading(true)
    try {
      if (activeTab === 'flights') {
        const response = await api.get('/flights')
        setFlights(response.data)
      } else if (activeTab === 'bookings') {
        const response = await api.get('/bookings')
        setBookings(response.data)
      } else if (activeTab === 'users') {
        const response = await api.get('/users')
        setUsers(response.data)
      }
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFlightSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/flights', flightForm)
      setShowFlightForm(false)
      setFlightForm({
        airline: '',
        flightNumber: '',
        origin: '',
        destination: '',
        departureTime: '',
        arrivalTime: '',
        duration: 0,
        price: 0,
        seats: {
          economy: 0,
          business: 0,
          first: 0
        }
      })
      fetchData()
    } catch (error) {
      console.error('Failed to create flight:', error)
    }
  }

  if (!user || !user.isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Access Denied</h2>
          <p className="text-gray-600">You need admin privileges to access this page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Panel</h1>

      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {['flights', 'bookings', 'users'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              {activeTab === 'flights' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Flights Management</h2>
                    <button
                      onClick={() => setShowFlightForm(true)}
                      className="btn-primary"
                    >
                      Add New Flight
                    </button>
                  </div>

                  {showFlightForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                      <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
                        <h3 className="text-lg font-semibold mb-4">Add New Flight</h3>
                        <form onSubmit={handleFlightSubmit} className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <input
                              type="text"
                              placeholder="Airline"
                              value={flightForm.airline}
                              onChange={(e) => setFlightForm(prev => ({ ...prev, airline: e.target.value }))}
                              className="input-field"
                              required
                            />
                            <input
                              type="text"
                              placeholder="Flight Number"
                              value={flightForm.flightNumber}
                              onChange={(e) => setFlightForm(prev => ({ ...prev, flightNumber: e.target.value }))}
                              className="input-field"
                              required
                            />
                            <input
                              type="text"
                              placeholder="Origin"
                              value={flightForm.origin}
                              onChange={(e) => setFlightForm(prev => ({ ...prev, origin: e.target.value }))}
                              className="input-field"
                              required
                            />
                            <input
                              type="text"
                              placeholder="Destination"
                              value={flightForm.destination}
                              onChange={(e) => setFlightForm(prev => ({ ...prev, destination: e.target.value }))}
                              className="input-field"
                              required
                            />
                            <input
                              type="datetime-local"
                              placeholder="Departure Time"
                              value={flightForm.departureTime}
                              onChange={(e) => setFlightForm(prev => ({ ...prev, departureTime: e.target.value }))}
                              className="input-field"
                              required
                            />
                            <input
                              type="datetime-local"
                              placeholder="Arrival Time"
                              value={flightForm.arrivalTime}
                              onChange={(e) => setFlightForm(prev => ({ ...prev, arrivalTime: e.target.value }))}
                              className="input-field"
                              required
                            />
                            <input
                              type="number"
                              placeholder="Duration (minutes)"
                              value={flightForm.duration}
                              onChange={(e) => setFlightForm(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                              className="input-field"
                              required
                            />
                            <input
                              type="number"
                              placeholder="Price"
                              value={flightForm.price}
                              onChange={(e) => setFlightForm(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                              className="input-field"
                              required
                            />
                          </div>
                          <div className="flex space-x-4">
                            <button type="submit" className="btn-primary">
                              Create Flight
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowFlightForm(false)}
                              className="btn-secondary"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}

                  <div className="overflow-x-auto">
                    <table className="min-w-full table-auto">
                      <thead>
                        <tr>
                          <th className="px-4 py-2">Flight Number</th>
                          <th className="px-4 py-2">Route</th>
                          <th className="px-4 py-2">Departure</th>
                          <th className="px-4 py-2">Arrival</th>
                          <th className="px-4 py-2">Price</th>
                          <th className="px-4 py-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {flights.map((flight) => (
                          <tr key={flight._id}>
                            <td className="px-4 py-2">{flight.flightNumber}</td>
                            <td className="px-4 py-2">{flight.origin} → {flight.destination}</td>
                            <td className="px-4 py-2">{new Date(flight.departureTime).toLocaleString()}</td>
                            <td className="px-4 py-2">{new Date(flight.arrivalTime).toLocaleString()}</td>
                            <td className="px-4 py-2">${flight.price}</td>
                            <td className="px-4 py-2">
                              <button className="text-blue-600 hover:text-blue-800 mr-2">
                                Edit
                              </button>
                              <button className="text-red-600 hover:text-red-800">
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'bookings' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Bookings Management</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full table-auto">
                      <thead>
                        <tr>
                          <th className="px-4 py-2">Booking ID</th>
                          <th className="px-4 py-2">User</th>
                          <th className="px-4 py-2">Flight</th>
                          <th className="px-4 py-2">Passengers</th>
                          <th className="px-4 py-2">Total Amount</th>
                          <th className="px-4 py-2">Status</th>
                          <th className="px-4 py-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map((booking) => (
                          <tr key={booking._id}>
                            <td className="px-4 py-2">{booking._id}</td>
                            <td className="px-4 py-2">{booking.user.name}</td>
                            <td className="px-4 py-2">{booking.flight.origin} → {booking.flight.destination}</td>
                            <td className="px-4 py-2">{booking.passengers.length}</td>
                            <td className="px-4 py-2">${booking.totalAmount}</td>
                            <td className="px-4 py-2">
                              <span className={`px-2 py-1 rounded text-xs ${
                                booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {booking.status}
                              </span>
                            </td>
                            <td className="px-4 py-2">
                              <button className="text-blue-600 hover:text-blue-800">
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'users' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Users Management</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full table-auto">
                      <thead>
                        <tr>
                          <th className="px-4 py-2">Name</th>
                          <th className="px-4 py-2">Email</th>
                          <th className="px-4 py-2">Role</th>
                          <th className="px-4 py-2">Bookings</th>
                          <th className="px-4 py-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr key={user._id}>
                            <td className="px-4 py-2">{user.name}</td>
                            <td className="px-4 py-2">{user.email}</td>
                            <td className="px-4 py-2">
                              <span className={`px-2 py-1 rounded text-xs ${
                                user.isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {user.isAdmin ? 'Admin' : 'User'}
                              </span>
                            </td>
                            <td className="px-4 py-2">{user.bookingsCount || 0}</td>
                            <td className="px-4 py-2">
                              <button className="text-blue-600 hover:text-blue-800 mr-2">
                                Edit
                              </button>
                              <button className="text-red-600 hover:text-red-800">
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminPanel