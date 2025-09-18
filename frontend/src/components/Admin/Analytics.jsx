import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/admin';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Line, Bar, Doughnut, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');
  const [chartType, setChartType] = useState('line');

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      // This would typically call a dedicated analytics endpoint
      const data = await adminService.getDashboardStats();
      setAnalyticsData(data);
    } catch (error) {
      console.error('Failed to load analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading analytics...</p>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="text-center py-12 text-red-600">
        Failed to load analytics data
      </div>
    );
  }

  // Prepare chart data
  const revenueChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Revenue ($)',
        data: analyticsData.revenueByMonth?.map(item => item.total) || Array(12).fill(0),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      }
    ]
  };

  const bookingStatusData = {
    labels: ['Confirmed', 'Pending', 'Cancelled', 'Completed'],
    datasets: [
      {
        label: 'Bookings by Status',
        data: [
          analyticsData.bookingsByStatus?.confirmed || 0,
          analyticsData.bookingsByStatus?.pending || 0,
          analyticsData.bookingsByStatus?.cancelled || 0,
          analyticsData.bookingsByStatus?.completed || 0
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(59, 130, 246, 0.8)'
        ],
        borderWidth: 1,
      }
    ]
  };

  const userGrowthData = {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [
      {
        label: 'New Users',
        data: [150, 230, 180, 280],
        backgroundColor: 'rgba(79, 70, 229, 0.8)',
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        <div className="flex space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="line">Line Chart</option>
            <option value="bar">Bar Chart</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="text-2xl font-bold text-blue-600">{analyticsData.totalUsers}</div>
          <div className="text-sm text-gray-600">Total Users</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="text-2xl font-bold text-green-600">{analyticsData.totalBookings}</div>
          <div className="text-sm text-gray-600">Total Bookings</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="text-2xl font-bold text-purple-600">${analyticsData.totalRevenue?.toFixed(2)}</div>
          <div className="text-sm text-gray-600">Total Revenue</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="text-2xl font-bold text-orange-600">92%</div>
          <div className="text-sm text-gray-600">Booking Success Rate</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Revenue Trend</h3>
          <div className="h-80">
            {chartType === 'line' ? (
              <Line data={revenueChartData} options={chartOptions} />
            ) : (
              <Bar data={revenueChartData} options={chartOptions} />
            )}
          </div>
        </div>

        {/* Booking Status Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Booking Status Distribution</h3>
          <div className="h-80">
            <Doughnut data={bookingStatusData} options={chartOptions} />
          </div>
        </div>

        {/* User Growth Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">User Growth</h3>
          <div className="h-80">
            <Bar data={userGrowthData} options={chartOptions} />
          </div>
        </div>

        {/* Top Routes */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Popular Routes</h3>
          <div className="space-y-3">
            {[
              { route: 'DEL → BOM', bookings: 245 },
              { route: 'BOM → DEL', bookings: 218 },
              { route: 'DEL → BLR', bookings: 189 },
              { route: 'BLR → DEL', bookings: 176 },
              { route: 'BOM → BLR', bookings: 154 }
            ].map((item, index) => (
              <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm font-medium">{item.route}</span>
                <span className="text-sm text-gray-600">{item.bookings} bookings</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Analytics Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Flight Performance */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Flight Performance</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Average Load Factor</span>
              <span className="font-semibold">78%</span>
            </div>
            <div className="flex justify-between">
              <span>On-time Performance</span>
              <span className="font-semibold">85%</span>
            </div>
            <div className="flex justify-between">
              <span>Cancellation Rate</span>
              <span className="font-semibold text-red-600">2.3%</span>
            </div>
          </div>
        </div>

        {/* Customer Satisfaction */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Customer Satisfaction</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Overall Rating</span>
              <span className="font-semibold">4.2/5</span>
            </div>
            <div className="flex justify-between">
              <span>Would Recommend</span>
              <span className="font-semibold">89%</span>
            </div>
            <div className="flex justify-between">
              <span>Complaint Resolution</span>
              <span className="font-semibold">94%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;