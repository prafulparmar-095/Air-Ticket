import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useApi } from '../hooks/useApi'
import LoadingSpinner from '../components/LoadingSpinner'
import { formatDate, formatTime, formatDuration, formatCurrency } from '../utils/formatters'

const SearchResults = () => {
  const [flights, setFlights] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    price: '',
    duration: '',
    airlines: [],
    departureTime: '',
    arrivalTime: ''
  })
  const location = useLocation()
  const navigate = useNavigate()
  const api = useApi()

  const searchParams = new URLSearchParams(location.search)
  const origin = searchParams.get('origin')
  const destination = searchParams.get('destination')
  const departureDate = searchParams.get('departureDate')
  const passengers = parseInt(searchParams.get('passengers') || '1')
  const tripType = searchParams.get('tripType') || 'one-way'

  useEffect(() => {
    const searchFlights = async () => {
      try {
        const response = await api.get('/flights/search', {
          params: {
            origin,
            destination,
            departureDate,
            passengers
          }
        })
        setFlights(response.data)
      } catch (error) {
        console.error('Failed to search flights:', error)
      } finally {
        setLoading(false)
      }
    }

    if (origin && destination && departureDate) {
      searchFlights()
    }
  }, [origin, destination, departureDate, passengers])

  const handleBookFlight = (flightId) => {
    navigate(`/booking/${flightId}?passengers=${passengers}`)
  }

  const filteredFlights = flights.filter(flight => {
    if (filters.price === 'low' && flight.price > 300) return false
    if (filters.price === 'high' && flight.price <= 300) return false
    // Add more filter logic here
    return true
  })

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Flight Results</h1>
        <p className="text-gray-600">
          {origin} to {destination} • {formatDate(departureDate)} • {passengers}{' '}
          {passengers === 1 ? 'passenger' : 'passengers'}
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters */}
        <div className="w-full md:w-1/4">
          <div className="bg-white rounded-lg shadow p-4 sticky top-4">
            <h3 className="font-semibold mb-4">Filters</h3>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Price</h4>
                <select
                  value={filters.price}
                  onChange={(e) => setFilters(prev => ({ ...prev, price: e.target.value }))}
                  className="input-field"
                >
                  <option value="">Any price</option>
                  <option value="low">Under $300</option>
                  <option value="high">Over $300</option>
                </select>
              </div>

              <div>
                <h4 className="font-medium mb-2">Duration</h4>
                <select
                  value={filters.duration}
                  onChange={(e) => setFilters(prev => ({ ...prev, duration: e.target.value }))}
                  className="input-field"
                >
                  <option value="">Any duration</option>
                  <option value="short">Under 3 hours</option>
                  <option value="medium">3–6 hours</option>
                  <option value="long">Over 6 hours</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="w-full md:w-3/4">
          {filteredFlights.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <h3 className="text-xl font-semibold mb-2">No flights found</h3>
              <p className="text-gray-600">
                Try adjusting your search criteria or filters.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFlights.map((flight) => (
                <div key={flight._id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-4">
                      <img
                        src={flight.airline.logo}
                        alt={flight.airline.name}
                        className="w-12 h-12 object-contain"
                      />
                      <div>
                        <h3 className="font-semibold">{flight.airline.name}</h3>
                        <p className="text-sm text-gray-600">{flight.flightNumber}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary-600">
                        {formatCurrency(flight.price)}
                      </p>
                      <p className="text-sm text-gray-600">per person</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold">
                        {formatTime(flight.departureTime)}
                      </p>
                      <p className="text-sm text-gray-600">{flight.origin}</p>
                    </div>

                    <div className="flex-1 px-4">
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center">
                          <span className="bg-white px-2 text-sm text-gray-500">
                            {formatDuration(flight.duration)}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-center text-gray-500 mt-1">
                        {flight.stops === 0
                          ? 'Non-stop'
                          : `${flight.stops} stop${flight.stops === 1 ? '' : 's'}`}
                      </p>
                    </div>

                    <div className="text-center">
                      <p className="text-2xl font-bold">
                        {formatTime(flight.arrivalTime)}
                      </p>
                      <p className="text-sm text-gray-600">{flight.destination}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleBookFlight(flight._id)}
                    className="w-full btn-primary"
                  >
                    Select Flight
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SearchResults
