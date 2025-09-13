// frontend/src/components/FlightManagement.jsx
import { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';

const FlightManagement = () => {
  const { get, post, put, delete: deleteApi } = useApi();
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingFlight, setEditingFlight] = useState(null);
  const [formData, setFormData] = useState({
    airline: '',
    number: '',
    origin: '',
    destination: '',
    departureTime: '',
    arrivalTime: '',
    aircraft: '',
    economySeats: { total: 0, available: 0, price: 0 },
    businessSeats: { total: 0, available: 0, price: 0 },
    firstClassSeats: { total: 0, available: 0, price: 0 }
  });

  useEffect(() => {
    fetchFlights();
  }, []);

  const fetchFlights = async () => {
    try {
      setLoading(true);
      const data = await get('/flights?sort=-createdAt');
      setFlights(data.data);
    } catch (error) {
      console.error('Failed to fetch flights:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingFlight) {
        await put(`/flights/${editingFlight._id}`, formData);
      } else {
        await post('/flights', formData);
      }
      setShowForm(false);
      setEditingFlight(null);
      setFormData({
        airline: '',
        number: '',
        origin: '',
        destination: '',
        departureTime: '',
        arrivalTime: '',
        aircraft: '',
        economySeats: { total: 0, available: 0, price: 0 },
        businessSeats: { total: 0, available: 0, price: 0 },
        firstClassSeats: { total: 0, available: 0, price: 0 }
      });
      fetchFlights();
    } catch (error) {
      console.error('Failed to save flight:', error);
    }
  };

  const handleEdit = (flight) => {
    setEditingFlight(flight);
    setFormData({
      airline: flight.airline,
      number: flight.number,
      origin: flight.origin,
      destination: flight.destination,
      departureTime: flight.departureTime.split('T')[0],
      arrivalTime: flight.arrivalTime.split('T')[0],
      aircraft: flight.aircraft,
      economySeats: flight.economySeats,
      businessSeats: flight.businessSeats,
      firstClassSeats: flight.firstClassSeats
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this flight?')) {
      try {
        await deleteApi(`/flights/${id}`);
        fetchFlights();
      } catch (error) {
        console.error('Failed to delete flight:', error);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSeatChange = (e, seatClass, field) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      [`${seatClass}Seats`]: {
        ...prev[`${seatClass}Seats`],
        [field]: parseInt(value) || 0
      }
    }));
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Flight Management</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Add New Flight
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">
              {editingFlight ? 'Edit Flight' : 'Add New Flight'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Airline</label>
                  <input
                    type="text"
                    name="airline"
                    value={formData.airline}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Flight Number</label>
                  <input
                    type="text"
                    name="number"
                    value={formData.number}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Origin</label>
                  <input
                    type="text"
                    name="origin"
                    value={formData.origin}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Destination</label>
                  <input
                    type="text"
                    name="destination"
                    value={formData.destination}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Departure Time</label>
                  <input
                    type="datetime-local"
                    name="departureTime"
                    value={formData.departureTime}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Arrival Time</label>
                  <input
                    type="datetime-local"
                    name="arrivalTime"
                    value={formData.arrivalTime}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Aircraft</label>
                  <input
                    type="text"
                    name="aircraft"
                    value={formData.aircraft}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Seat Configuration</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {['economy', 'business', 'firstClass'].map(seatClass => (
                    <div key={seatClass} className="bg-gray-50 p-3 rounded-md">
                      <h5 className="font-medium capitalize mb-2">{seatClass.replace(/([A-Z])/g, ' $1')}</h5>
                      <div className="space-y-2">
                        <div>
                          <label className="block text-sm text-gray-600">Total Seats</label>
                          <input
                            type="number"
                            value={formData[`${seatClass}Seats`].total}
                            onChange={(e) => handleSeatChange(e, seatClass, 'total')}
                            className="w-full p-1 border border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600">Available Seats</label>
                          <input
                            type="number"
                            value={formData[`${seatClass}Seats`].available}
                            onChange={(e) => handleSeatChange(e, seatClass, 'available')}
                            className="w-full p-1 border border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600">Price ($)</label>
                          <input
                            type="number"
                            value={formData[`${seatClass}Seats`].price}
                            onChange={(e) => handleSeatChange(e, seatClass, 'price')}
                            className="w-full p-1 border border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingFlight(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {editingFlight ? 'Update' : 'Create'} Flight
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Flight
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Route
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Departure
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Seats
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {flights.map(flight => (
              <tr key={flight._id}>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{flight.airline}</div>
                  <div className="text-sm text-gray-500">{flight.number}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{flight.origin}</div>
                  <div className="text-sm text-gray-500">→ {flight.destination}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(flight.departureTime).toLocaleString()}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>E: {flight.economySeats.available}/{flight.economySeats.total}</div>
                  <div>B: {flight.businessSeats.available}/{flight.businessSeats.total}</div>
                  <div>F: {flight.firstClassSeats.available}/{flight.firstClassSeats.total}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    flight.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                    flight.status === 'departed' ? 'bg-purple-100 text-purple-800' :
                    flight.status === 'landed' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {flight.status}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEdit(flight)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(flight._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FlightManagement;