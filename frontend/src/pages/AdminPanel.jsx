// frontend/src/pages/AdminPanel.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useApi } from '../hooks/useApi';
import AdminDashboard from '../components/AdminDashboard';
import FlightManagement from '../components/FlightManagement';
import UserManagement from '../components/UserManagement';
import BookingManagement from '../components/BookingManagement';
import Analytics from '../components/Analytics';

const AdminPanel = () => {
  const { user } = useAuth();
  const { get } = useApi();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    activeFlights: 0,
    registeredUsers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchAdminStats();
    }
  }, [user]);

  const fetchAdminStats = async () => {
    try {
      setLoading(true);
      const data = await get('/admin/stats');
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p>You do not have permission to access the admin panel.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'flights', name: 'Flight Management', icon: '✈️' },
    { id: 'bookings', name: 'Booking Management', icon: '🎫' },
    { id: 'users', name: 'User Management', icon: '👥' },
    { id: 'analytics', name: 'Analytics', icon: '📈' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboard stats={stats} />;
      case 'flights':
        return <FlightManagement />;
      case 'bookings':
        return <BookingManagement />;
      case 'users':
        return <UserManagement />;
      case 'analytics':
        return <Analytics />;
      default:
        return <AdminDashboard stats={stats} />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-white rounded-lg shadow-md p-4">
          <div className="mb-6 p-4 bg-blue-50 rounded-md">
            <h2 className="font-bold">Welcome, {user.name}</h2>
            <p className="text-sm text-gray-600">Administrator</p>
          </div>
          
          <nav>
            <ul className="space-y-2">
              {tabs.map(tab => (
                <li key={tab.id}>
                  <button
                    className={`w-full text-left px-4 py-2 rounded-md flex items-center space-x-2 ${
                      activeTab === tab.id ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        
        {/* Main content */}
        <div className="flex-1">
          {loading ? (
            <div className="bg-white rounded-lg shadow-md p-6 flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            renderContent()
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;