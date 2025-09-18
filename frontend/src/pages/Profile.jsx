import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import LoadingSpinner from '../components/layout/LoadingSpinner'
import UserProfile from '../components/profile/UserProfile'
import EditProfile from '../components/profile/EditProfile'
import BookingHistory from '../components/profile/BookingHistory'
import { User, Edit3, History, LogOut } from 'lucide-react'

const Profile = () => {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'edit', label: 'Edit Profile', icon: Edit3 },
    { id: 'bookings', label: 'Booking History', icon: History }
  ]

  if (!user) return <LoadingSpinner />

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {user.firstName} {user.lastName}
                  </h1>
                  <p className="text-gray-600">{user.email}</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-2 text-red-600 hover:text-red-700"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="flex border-b">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                )
              })}
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'profile' && <UserProfile user={user} />}
              {activeTab === 'edit' && <EditProfile user={user} />}
              {activeTab === 'bookings' && <BookingHistory />}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile