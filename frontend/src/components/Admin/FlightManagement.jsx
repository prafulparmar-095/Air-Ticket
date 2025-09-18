import React, { useState, useEffect } from 'react';
import { flightService } from '../../services/flights';
import SearchBar from '../Shared/SearchBar';
import Pagination from '../Shared/Pagination';
import Modal from '../Shared/Modal';
import { useNotification } from '../../context/NotificationContext';

const FlightManagement = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const { showNotification } = useNotification();

  const itemsPerPage = 10;

  useEffect(() => {
    loadFlights();
  }, [currentPage, searchTerm]);

  const loadFlights = async () => {
    try {
      setLoading(true);
      // This would typically call an admin endpoint for flights
      const response = await flightService.searchFlights({
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm
      });
      setFlights(response.flights || []);
      setTotalPages(response.totalPages || 1);
    } catch (error) {
      showNotification('Failed to load flights', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchTerm(query);
    setCurrentPage(1);
  };

  const handleCreateFlight = async (flightData) => {
    try {
      await flightService.createFlight(flightData);
      showNotification('Flight created successfully', 'success');
      setIsCreateModalOpen(false);
      loadFlights();
    } catch (error) {
      showNotification('Failed to create flight', 'error');
    }
  };

  const handleUpdateFlight = async (flightId, flightData) => {
    try {
      await flightService.updateFlight(flightId, flightData);
      showNotification('Flight updated successfully', 'success');
      setIsEditModalOpen(false);
      setSelectedFlight(null);
      loadFlights();
    } catch (error) {
      showNotification('Failed to update flight', 'error');
    }
  };

  const handleDeleteFlight = async (flightId) => {
    if (!window.confirm('Are you sure you want to delete this flight?')) {
      return;
    }

    try {
      await flightService.deleteFlight(flightId);
      showNotification('Flight deleted successfully', 'success');
      loadFlights();
    } catch (error) {
      showNotification('Failed to delete flight', 'error');
    }
  };

  const openEditModal = (flight) => {
    setSelectedFlight(flight);
    setIsEditModalOpen(true);
  };

  const closeModals = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedFlight(null);
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading flights...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Flight Management</h1>
        <div className="flex space-x-4">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search flights..."
            className="w-80"
          />
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Add Flight
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Flight Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Route
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Departure
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Arrival
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aircraft
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {flights.map((flight) => (
              <tr key={flight._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {flight.flightNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {flight.departure?.airport} → {flight.arrival?.airport}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDateTime(flight.departure?.datetime)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDateTime(flight.arrival?.datetime)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {flight.aircraft}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    flight.status === 'scheduled' 
                      ? 'bg-green-100 text-green-800' 
                      : flight.status === 'cancelled'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {flight.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => openEditModal(flight)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteFlight(flight._id)}
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

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* Create Flight Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={closeModals}
        title="Add New Flight"
        size="large"
      >
        <FlightForm
          onSubmit={handleCreateFlight}
          onCancel={closeModals}
        />
      </Modal>

      {/* Edit Flight Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={closeModals}
        title="Edit Flight"
        size="large"
      >
        {selectedFlight && (
          <FlightForm
            flight={selectedFlight}
            onSubmit={(data) => handleUpdateFlight(selectedFlight._id, data)}
            onCancel={closeModals}
            isEdit
          />
        )}
      </Modal>
    </div>
  );
};

// Flight Form Component
const FlightForm = ({ flight, onSubmit, onCancel, isEdit = false }) => {
  const [formData, setFormData] = useState({
    flightNumber: flight?.flightNumber || '',
    airline: flight?.airline || 'Air India',
    aircraft: flight?.aircraft || '',
    departure: {
      airport: flight?.departure?.airport || '',
      city: flight?.departure?.city || '',
      datetime: flight?.departure?.datetime || '',
      terminal: flight?.departure?.terminal || ''
    },
    arrival: {
      airport: flight?.arrival?.airport || '',
      city: flight?.arrival?.city || '',
      datetime: flight?.arrival?.datetime || '',
      terminal: flight?.arrival?.terminal || ''
    },
    duration: flight?.duration || '',
    prices: {
      economy: flight?.prices?.economy || '',
      business: flight?.prices?.business || '',
      first: flight?.prices?.first || ''
    },
    status: flight?.status || 'scheduled'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Flight Number</label>
          <input
            type="text"
            name="flightNumber"
            value={formData.flightNumber}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Airline</label>
          <input
            type="text"
            name="airline"
            value={formData.airline}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Aircraft</label>
        <input
          type="text"
          name="aircraft"
          value={formData.aircraft}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Departure</h4>
          <div className="space-y-2">
            <input
              type="text"
              name="departure.airport"
              value={formData.departure.airport}
              onChange={handleChange}
              placeholder="Airport Code"
              className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              name="departure.city"
              value={formData.departure.city}
              onChange={handleChange}
              placeholder="City"
              className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="datetime-local"
              name="departure.datetime"
              value={formData.departure.datetime}
              onChange={handleChange}
              className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Arrival</h4>
          <div className="space-y-2">
            <input
              type="text"
              name="arrival.airport"
              value={formData.arrival.airport}
              onChange={handleChange}
              placeholder="Airport Code"
              className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              name="arrival.city"
              value={formData.arrival.city}
              onChange={handleChange}
              placeholder="City"
              className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="datetime-local"
              name="arrival.datetime"
              value={formData.arrival.datetime}
              onChange={handleChange}
              className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Economy Price ($)</label>
          <input
            type="number"
            name="prices.economy"
            value={formData.prices.economy}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Business Price ($)</label>
          <input
            type="number"
            name="prices.business"
            value={formData.prices.business}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">First Class Price ($)</label>
          <input
            type="number"
            name="prices.first"
            value={formData.prices.first}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="scheduled">Scheduled</option>
          <option value="boarding">Boarding</option>
          <option value="in-air">In Air</option>
          <option value="landed">Landed</option>
          <option value="delayed">Delayed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {isEdit ? 'Update Flight' : 'Create Flight'}
        </button>
      </div>
    </form>
  );
};

export default FlightManagement;