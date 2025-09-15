import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useApi } from '../hooks/useApi'
import { Plane, Clock, MapPin, Calendar, Users, Filter, ArrowUpDown } from 'lucide-react'
import { formatDate, formatTime, formatDuration, formatCurrency } from '../utils/formatters'
import LoadingSpinner from '../components/LoadingSpinner'

const SearchResults = () => {
  const [searchParams] = useSearchParams()
  const [flights, setFlights] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('price')
  const [filters, setFilters] = useState({
    airlines: [],
    priceRange: [0, 5000],
    stops: 'any'
  })
  const api = useApi()
  const navigate = useNavigate()

  const searchCriteria = {
    origin: searchParams.get('origin'),
    destination: searchParams.get('destination'),
    departureDate: searchParams.get('departureDate'),
    returnDate: searchParams.get('returnDate'),
    adult: parseInt(searchParams.get('adult')) || 1,
    child: parseInt(searchParams.get('child')) || 0,
    infant: parseInt(searchParams.get('infant')) || 0,
    cabinClass: searchParams.get('cabinClass') || 'economy',
    tripType: searchParams.get('tripType') || 'one-way'
  }

  useEffect(() => {
    searchFlights()
  }, [searchParams])

  const searchFlights = async () => {
    try {
      setLoading(true)
      const response = await api.get('/flights/search', {
        params: searchCriteria
      })
      setFlights(response.data.flights)
    } catch (error) {
      console.error('Error searching flights:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBookFlight = (flightId) => {
    navigate(`/booking/${flightId}?${searchParams.toString()}`)
  }

  const sortedAndFilteredFlights = flights
    .filter(flight => {
      // Airline filter
      if (filters.airlines.length > 0 && !filters.airlines.includes(flight.airline)) {
        return false
      }
      
      // Price filter
      if (flight.price < filters.priceRange[0] || flight.price > filters.priceRange[1]) {
        return false
      }
      
      // Stops filter
      if (filters.stops !== 'any') {
        const stops = flight.stops || 0
        if (filters.stops === 'nonstop' && stops !== 0) return false
        if (filters.stops === '1stop' && stops !== 1) return false
        if (filters.stops === '2+stops' && stops < 2) return false
      }
      
      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price
        case 'duration':
          return a.duration - b.duration
        case 'departure':
          return new Date(a.departureTime) - new Date(b.departureTime)
        case 'arrival':
          return new Date(a.arrivalTime) - new Date(b.arrivalTime)
        default:
          return 0
      }
    })

  const airlines = [...new Set(flights.map(flight => flight.airline))]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-2xl font-bold mb-4">Flight Results</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-primary-600" />
              <span>{searchCriteria.origin} → {searchCriteria.destination}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-primary-600" />
              <span>{formatDate(searchCriteria.departureDate)}</span>
            </div>
            {searchCriteria.returnDate && (
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-primary-600" />
                <span>{formatDate(searchCriteria.returnDate)}</span>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-primary-600" />
              <span>{searchCriteria.adult + searchCriteria.child + searchCriteria.infant} Passenger(s)</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <Filter className="h-5 w-5" />
                <span>Filters</span>
              </h2>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Price Range</h3>
                <input
                  type="range"
                  min="0"
                  max="5000"
                  value={filters.priceRange[1]}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    priceRange: [prev.priceRange[0], parseInt(e.target.value)]
                  }))}
                  className="w-full mb-2"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{formatCurrency(0)}</span>
                  <span>{formatCurrency(filters.priceRange[1])}</span>
                </div>
              </div>

              {/* Airlines */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Airlines</h3>
                <div className="space-y-2">
                  {airlines.map(airline => (
                    <label key={airline} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={filters.airlines.includes(airline)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters(prev => ({
                              ...prev,
                              airlines: [...prev.airlines, airline]
                            }))
                          } else {
                            setFilters(prev => ({
                              ...prev,
                              airlines: prev.airlines.filter(a => a !== airline)
                            }))
                          }
                        }}
                        className="rounded text-primary-600"
                      />
                      <span>{airline}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Stops */}
              <div>
                <h3 className="font-medium mb-3">Number of Stops</h3>
                <div className="space-y-2">
                  {['any', 'nonstop', '1stop', '2+stops'].map(stop => (
                    <label key={stop} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="stops"
                        checked={filters.stops === stop}
                        onChange={() => setFilters(prev => ({ ...prev, stops: stop }))}
                        className="text-primary-600"
                      />
                      <span>
                        {stop === 'any' && 'Any'}
                        {stop === 'nonstop' && 'Non-stop'}
                        {stop === '1stop' && '1 Stop'}
                        {stop === '2+stops' && '2+ Stops'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {/* Sort Options */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium">Sort by:</span>
                {[
                  { value: 'price', label: 'Price' },
                  { value: 'duration', label: 'Duration' },
                  { value: 'departure', label: 'Departure Time' },
                  { value: 'arrival', label: 'Arrival Time' }
                ].map(option => (
                  <button
                    key={option.value}
                    onClick={() => setSortBy(option.value)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      sortBy === option.value
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Flights List */}
            <div className="space-y-4">
              {sortedAndFilteredFlights.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <Plane className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No flights found</h3>
                  <p className="text-gray-500">Try adjusting your filters or search criteria</p>
                </div>
              ) : (
                sortedAndFilteredFlights.map(flight => (
                  <div key={flight._id} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                          <Plane className="h-6 w-6 text-primary-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{flight.airline}</h3>
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

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="text-center">
                        <p className="text-2xl font-bold">{formatTime(flight.departureTime)}</p>
                        <p className="text-sm text-gray-600">{flight.origin}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">
                          {formatDuration(flight.duration)}
                        </p>
                        <div className="relative">
                          <div className="h-px bg-gray-300 my-2"></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-white px-2">
                              <Clock className="h-4 w-4 text-gray-400" />
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">
                          {flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold">{formatTime(flight.arrivalTime)}</p>
                        <p className="text-sm text-gray-600">{flight.destination}</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-600">
                        {searchCriteria.cabinClass && (
                          <span className="capitalize">{searchCriteria.cabinClass.replace('_', ' ')}</span>
                        )}
                      </div>
                      <button
                        onClick={() => handleBookFlight(flight._id)}
                        className="btn-primary"
                      >
                        Select Flight
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchResults