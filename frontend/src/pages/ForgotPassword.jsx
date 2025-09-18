import { useState, useEffect } from 'react'
import { useApi } from '../hooks/useApi'
import { 
  Users, 
  Plane, 
  CreditCard, 
  BarChart3,
  Calendar,
  Plus,
  Edit3,
  Trash2
} from 'lucide-react'
import { formatDate, formatCurrency } from '../utils/formatters'
import LoadingSpinner from '../components/LoadingSpinner'

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [stats, setStats] = useState({})
  const [flights, setFlights] = useState([])
  const [bookings, setBookings] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const api = useApi()

  useEffect(() => {
    fetchStats()
    if (activeTab === 'flights') fetchFlights()
    if (activeTab === 'bookings') fetchBookings()
    if (activeTab === 'users') fetchUsers()
  }, [activeTab])

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/stats')
      setStats(response.data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchFlights = async () => {
    try {
      const response = await api.get('/flights')
      setFlights(response.data.flights)
    } catch (error) {
      console.error('Error fetching flights:', error)
    }
  }

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings')
      setBookings(response.data.bookings)
    } catch (error) {
      console.error('Error fetching bookings:', error)
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users')
      setUsers(response.data.users)
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const handleDeleteFlight = async (flightId) => {
    if (!window.confirm('Are you sure you want to delete this flight?')) return

    try {
      await api.delete(`/flights/${flightId}`)
      setFlights(flights.filter(flight => flight._id !== flightId))
    } catch (error) {
      console.error('Error deleting flight:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
                { id: 'flights', label: 'Flights', icon: Plane },
                { id: 'bookings', label: 'Bookings', icon: CreditCard },
                { id: 'users', label: 'Users', icon: Users }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-6 text-sm font-medium border-b-2 flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'dashboard' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white border rounded-lg p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Users</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                      </div>
                      <Users className="h-8 w-8 text-primary-600" />
                    </div>
                  </div>
                  <div className="bg-white border rounded-lg p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Flights</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalFlights}</p>
                      </div>
                      <Plane className="h-8 w-8 text-primary-600" />
                    </div>
                  </div>
                  <div className="bg-white border rounded-lg p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
                      </div>
                      <CreditCard className="h-8 w-8 text-primary-600" />
                    </div>
                  </div>
                  <div className="bg-white border rounded-lg p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {formatCurrency(stats.totalRevenue)}
                        </p>
                      </div>
                      <BarChart3 className="h-8 w-8 text-primary-600" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white border rounded-lg p-6 shadow-sm">
                    <h3 className="text-lg font-medium mb-4">Recent Bookings</h3>
                    <div className="space-y-4">
                      {stats.recentBookings?.map(booking => (
                        <div key={booking._id} className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">
                              {booking.flight.origin} → {booking.flight.destination}
                            </p>
                            <p className="text-sm text-gray-600">
                              {formatDate(booking.createdAt)} • {booking.passengers.length} passengers
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-primary-600">
                              {formatCurrency(booking.totalAmount)}
                            </p>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              booking.status === 'confirmed' 
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {booking.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white border rounded-lg p-6 shadow-sm">
                    <h3 className="text-lg font-medium mb-4">Popular Routes</h3>
                    <div className="space-y-3">
                      {stats.popularRoutes?.map(route => (
                        <div key={route._id} className="flex justify-between items-center">
                          <p className="font-medium">
                            {route._id.origin} → {route._id.destination}
                          </p>
                          <div className="text-right">
                            <p className="text-sm text-gray-600">{route.count} bookings</p>
                            <p className="text-sm text-primary-600">
                              {formatCurrency(route.totalRevenue)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'flights' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Flight Management</h2>
                  <button className="btn-primary flex items-center space-x-2">
                    <Plus className="h-5 w-5" />
                    <span>Add Flight</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full table-auto">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Flight
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Route
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Schedule
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {flights.map(flight => (
                        <tr key={flight._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <p className="font-medium">{flight.airline}</p>
                              <p className="text-sm text-gray-600">{flight.flightNumber}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <p className="font-medium">
                                {flight.origin} → {flight.destination}
                              </p>
                              <p className="text-sm text-gray-600">
                                {flight.duration} minutes • {flight.stops} stops
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <p className="font-medium">{formatDate(flight.departureTime)}</p>
                              <p className="text-sm text-gray-600">
                                {formatDate(flight.arrivalTime, { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="font-bold text-primary-600">
                              {formatCurrency(flight.price)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex space-x-2">
                              <button className="text-blue-600 hover:text-blue-800">
                                <Edit3 className="h-5 w-5" />
                              </button>
                              <button 
                                onClick={() => handleDeleteFlight(flight._id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </div>
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
                <h2 className="text-xl font-semibold mb-6">Booking Management</h2>
                <div className="overflow-x-auto">
                  <table className="w-full table-auto">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Booking ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Flight
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Passengers
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {bookings.map(booking => (
                        <tr key={booking._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <p className="text-sm font-medium">{booking._id}</p>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <p className="font-medium">
                                {booking.flight.origin} → {booking.flight.destination}
                              </p>
                              <p className="text-sm text-gray-600">
                                {booking.flight.airline} • {formatDate(booking.flight.departureTime)}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <p className="text-sm">{booking.passengers.length} passengers</p>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="font-bold text-primary-600">
                              {formatCurrency(booking.totalAmount)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              booking.status === 'confirmed' 
                                ? 'bg-green-100 text-green-800'
                                : booking.status === 'cancelled'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {booking.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <p className="text-sm">{formatDate(booking.createdAt)}</p>
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
                <h2 className="text-xl font-semibold mb-6">User Management</h2>
                <div className="overflow-x-auto">
                  <table className="w-full table-auto">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contact
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Bookings
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Joined
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map(user => (
                        <tr key={user._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-gray-600">ID: {user._id}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <p className="text-sm">{user.email}</p>
                              <p className="text-sm text-gray-600">{user.phone}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              user.role === 'admin' 
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <p className="text-sm">{user.bookingsCount || 0} bookings</p>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <p className="text-sm">{formatDate(user.createdAt)}</p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPanel