import { useState, useEffect } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import useApi from '../../hooks/useApi'
import { BarChart3, Users, Plane, CreditCard, TrendingUp, Calendar, Download } from 'lucide-react'

const AdminAnalytics = () => {
  const [timeRange, setTimeRange] = useState('30days')
  const [chartData, setChartData] = useState(null)
  
  const { data: analytics, loading, error } = useApi(`/admin/analytics?range=${timeRange}`)

  useEffect(() => {
    if (analytics) {
      setChartData(analytics)
    }
  }, [analytics])

  if (loading) return <AdminLayout><div className="flex justify-center py-8"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div></AdminLayout>
  if (error) return <AdminLayout><div className="text-center text-red-600 py-8">Error: {error}</div></AdminLayout>

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600">Insights and performance metrics</p>
          </div>
          <div className="flex items-center gap-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="7days">Last 7 days</option>
              <option value="30days">Last 30 days</option>
              <option value="90days">Last 90 days</option>
              <option value="year">This year</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Download className="w-5 h-5" />
              Export
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h2 className="text-2xl font-bold">{chartData?.totalUsers || 0}</h2>
                <p className="text-gray-600">Total Users</p>
                <p className="text-sm text-green-600 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +12% from last period
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Plane className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h2 className="text-2xl font-bold">{chartData?.totalFlights || 0}</h2>
                <p className="text-gray-600">Total Flights</p>
                <p className="text-sm text-green-600 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +8% from last period
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <CreditCard className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <h2 className="text-2xl font-bold">{chartData?.totalBookings || 0}</h2>
                <p className="text-gray-600">Total Bookings</p>
                <p className="text-sm text-green-600 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +15% from last period
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <h2 className="text-2xl font-bold">${chartData?.totalRevenue || 0}</h2>
                <p className="text-gray-600">Total Revenue</p>
                <p className="text-sm text-green-600 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +20% from last period
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Revenue Overview</h3>
              <Calendar className="w-5 h-5 text-gray-400" />
            </div>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <BarChart3 className="w-12 h-12 mx-auto mb-2" />
                <p>Revenue chart will be displayed here</p>
              </div>
            </div>
          </div>

          {/* Bookings Chart */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Booking Trends</h3>
              <Calendar className="w-5 h-5 text-gray-400" />
            </div>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <TrendingUp className="w-12 h-12 mx-auto mb-2" />
                <p>Booking trends chart will be displayed here</p>
              </div>
            </div>
          </div>

          {/* Popular Routes */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-6">Popular Routes</h3>
            <div className="space-y-4">
              {chartData?.popularRoutes?.slice(0, 5).map((route, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                    </div>
                    <div>
                      <div className="font-medium">{route.origin} → {route.destination}</div>
                      <div className="text-sm text-gray-500">{route.bookings} bookings</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">${route.revenue}</div>
                    <div className="text-sm text-green-600">+{route.growth}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* User Demographics */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-6">User Demographics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-center">{chartData?.userStats?.activeUsers || 0}</div>
                <div className="text-sm text-gray-600 text-center">Active Users</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-center">{chartData?.userStats?.newUsers || 0}</div>
                <div className="text-sm text-gray-600 text-center">New Users</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-center">{chartData?.userStats?.avgBookings || 0}</div>
                <div className="text-sm text-gray-600 text-center">Avg. Bookings/User</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-center">${chartData?.userStats?.avgSpend || 0}</div>
                <div className="text-sm text-gray-600 text-center">Avg. Spend/User</div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Metrics */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-6">Performance Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{(chartData?.conversionRate || 0) * 100}%</div>
              <div className="text-sm text-gray-600">Conversion Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">${chartData?.avgBookingValue || 0}</div>
              <div className="text-sm text-gray-600">Avg. Booking Value</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{chartData?.occupancyRate || 0}%</div>
              <div className="text-sm text-gray-600">Seat Occupancy</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{chartData?.cancellationRate || 0}%</div>
              <div className="text-sm text-gray-600">Cancellation Rate</div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminAnalytics