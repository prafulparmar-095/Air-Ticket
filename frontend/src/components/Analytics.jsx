// frontend/src/components/Analytics.jsx
import { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';

const Analytics = () => {
  const { get } = useApi();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const data = await get('/admin/analytics');
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Analytics</h2>
        <p>No analytics data available.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-6">Analytics Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Revenue Overview</h3>
          <p className="text-2xl font-bold">${analytics.revenue.total}</p>
          <p className="text-sm text-blue-600">
            {analytics.revenue.change >= 0 ? '+' : ''}{analytics.revenue.change}% from last month
          </p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800 mb-2">Bookings</h3>
          <p className="text-2xl font-bold">{analytics.bookings.total}</p>
          <p className="text-sm text-green-600">
            {analytics.bookings.change >= 0 ? '+' : ''}{analytics.bookings.change}% from last month
          </p>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-purple-800 mb-2">Users</h3>
          <p className="text-2xl font-bold">{analytics.users.total}</p>
          <p className="text-sm text-purple-600">
            {analytics.users.change >= 0 ? '+' : ''}{analytics.users.change}% from last month
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Top Routes</h3>
          <div className="space-y-3">
            {analytics.topRoutes.map((route, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm font-medium">{route.origin} → {route.destination}</span>
                <span className="text-sm text-gray-500">{route.bookings} bookings</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Popular Airlines</h3>
          <div className="space-y-3">
            {analytics.popularAirlines.map((airline, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm font-medium">{airline.name}</span>
                <span className="text-sm text-gray-500">{airline.bookings} bookings</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;