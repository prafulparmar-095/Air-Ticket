import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import useApi from '../hooks/useApi'
import { flightsService } from '../services/flights'
import FlightCard from '../components/booking/FlightCard'
import LoadingSpinner from '../components/layout/LoadingSpinner'
import { Filter, Plane, SlidersHorizontal } from 'lucide-react'

const FlightList = () => {
  const [searchParams] = useSearchParams()
  const [flights, setFlights] = useState([])
  const [filteredFlights, setFilteredFlights] = useState([])
  const [filters, setFilters] = useState({
    priceRange: [0, 2000],
    airlines: [],
    departureTime: '',
    arrivalTime: '',
    stops: 'any'
  })
  const [showFilters, setShowFilters] = useState(false)

  const searchData = {
    origin: searchParams.get('origin'),
    destination: searchParams.get('destination'),
    departureDate: searchParams.get('departureDate'),
    returnDate: searchParams.get('returnDate'),
    passengers: parseInt(searchParams.get('passengers')) || 1
  }

  const { data, loading, error } = useApi(
    `/flights/search?origin=${searchData.origin}&destination=${searchData.destination}&date=${searchData.departureDate}`
  )

  useEffect(() => {
    if (data) {
      setFlights(data)
      setFilteredFlights(data)
    }
  }, [data])

  const applyFilters = () => {
    let filtered = flights

    // Price filter
    filtered = filtered.filter(flight => 
      flight.price >= filters.priceRange[0] && flight.price <= filters.priceRange[1]
    )

    // Airline filter
    if (filters.airlines.length > 0) {
      filtered = filtered.filter(flight =>
        filters.airlines.includes(flight.airline)
      )
    }

    // Stops filter
    if (filters.stops !== 'any') {
      filtered = filtered.filter(flight =>
        flight.stops === parseInt(filters.stops)
      )
    }

    setFilteredFlights(filtered)
  }

  useEffect(() => {
    applyFilters()
  }, [filters, flights])

  if (loading) return <LoadingSpinner />
  if (error) return <div className="text-center text-red-600">Error: {error}</div>

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Flights from {searchData.origin} to {searchData.destination}
            </h1>
            <p className="text-gray-600">
              {searchData.departureDate} • {searchData.passengers} passenger{searchData.passengers > 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-300 hover:border-gray-400"
          >
            <SlidersHorizontal className="w-5 h-5" />
            Filters
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="lg:col-span-1 bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="w-5 h-5" />
                <h3 className="font-semibold">Filters</h3>
              </div>

              <div className="space-y-6">
                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="2000"
                    value={filters.priceRange[1]}
                    onChange={(e) => setFilters({
                      ...filters,
                      priceRange: [0, parseInt(e.target.value)]
                    })}
                    className="w-full"
                  />
                </div>

                {/* Airlines */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Airlines
                  </label>
                  <div className="space-y-2">
                    {['Delta', 'United', 'American', 'Southwest'].map(airline => (
                      <label key={airline} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.airlines.includes(airline)}
                          onChange={(e) => {
                            const updatedAirlines = e.target.checked
                              ? [...filters.airlines, airline]
                              : filters.airlines.filter(a => a !== airline)
                            setFilters({ ...filters, airlines: updatedAirlines })
                          }}
                          className="rounded text-blue-600"
                        />
                        <span className="ml-2 text-sm">{airline}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Stops */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stops
                  </label>
                  <select
                    value={filters.stops}
                    onChange={(e) => setFilters({ ...filters, stops: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="any">Any</option>
                    <option value="0">Non-stop</option>
                    <option value="1">1 Stop</option>
                    <option value="2">2+ Stops</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Flight Results */}
          <div className={`${showFilters ? 'lg:col-span-3' : 'lg:col-span-4'}`}>
            {filteredFlights.length === 0 ? (
              <div className="text-center py-12">
                <Plane className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No flights found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search criteria or filters
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredFlights.map((flight) => (
                  <FlightCard
                    key={flight.id}
                    flight={flight}
                    searchData={searchData}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FlightList