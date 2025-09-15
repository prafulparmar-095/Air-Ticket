import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Plane, Calendar, Users } from 'lucide-react'

const FlightSearch = () => {
  const [searchData, setSearchData] = useState({
    origin: '',
    destination: '',
    departureDate: '',
    returnDate: '',
    passengers: 1,
    tripType: 'one-way'
  })
  const navigate = useNavigate()

  const handleInputChange = (field, value) => {
    setSearchData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSearch = (e) => {
    e.preventDefault()
    // Navigate to search results with query parameters
    const params = new URLSearchParams()
    params.append('origin', searchData.origin)
    params.append('destination', searchData.destination)
    params.append('departureDate', searchData.departureDate)
    if (searchData.tripType === 'round-trip') {
      params.append('returnDate', searchData.returnDate)
    }
    params.append('passengers', searchData.passengers)
    params.append('tripType', searchData.tripType)
    
    navigate(`/search-results?${params.toString()}`)
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Search Flights</h2>
      
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="flex space-x-4 mb-4">
          {['one-way', 'round-trip'].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => handleInputChange('tripType', type)}
              className={`px-4 py-2 rounded-full font-medium ${
                searchData.tripType === type
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {type === 'one-way' ? 'One Way' : 'Round Trip'}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              From
            </label>
            <input
              type="text"
              value={searchData.origin}
              onChange={(e) => handleInputChange('origin', e.target.value)}
              placeholder="City or airport"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              To
            </label>
            <input
              type="text"
              value={searchData.destination}
              onChange={(e) => handleInputChange('destination', e.target.value)}
              placeholder="City or airport"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Departure
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="date"
                value={searchData.departureDate}
                onChange={(e) => handleInputChange('departureDate', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {searchData.tripType === 'round-trip' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Return
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="date"
                  value={searchData.returnDate}
                  onChange={(e) => handleInputChange('returnDate', e.target.value)}
                  min={searchData.departureDate || new Date().toISOString().split('T')[0]}
                  className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Passengers
          </label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <select
              value={searchData.passengers}
              onChange={(e) => handleInputChange('passengers', parseInt(e.target.value))}
              className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {[1, 2, 3, 4, 5, 6].map(num => (
                <option key={num} value={num}>
                  {num} Passenger{num > 1 ? 's' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
        >
          <Search className="h-5 w-5 mr-2" />
          Search Flights
        </button>
      </form>
    </div>
  )
}

export default FlightSearch