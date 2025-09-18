import { useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { Users, Plane, CreditCard, BarChart3 } from 'lucide-react'

const AdminDashboard = () => {
  const [stats] = useState({
    totalUsers: 1245,
    totalFlights: 89,
    totalBookings: 567,
    revenue: 125430
  })

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome to the admin dashboard</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h2 className="text-2xl font-bold">{stats.totalUsers}</h2>
                <p className="text-gray-600">Total Users</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Plane className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h2 className="text-2xl font-bold">{stats.totalFlights}</h2>
                <p className="text-gray-600">Total Flights</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <CreditCard className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <h2 className="text-2xl font-bold">{stats.totalBookings}</h2>
                <p className="text-gray-600">Total Bookings</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <h2 className="text-2xl font-bold">${stats.revenue}</h2>
                <p className="text-gray-600">Revenue</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminDashboard