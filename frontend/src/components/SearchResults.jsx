import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Plane, Clock, MapPin, Calendar, Users, Filter, ArrowUpDown } from 'lucide-react'

const SearchResults = () => {
  const [searchParams] = useSearchParams()
  const [flights, setFlights] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('price')
  const navigate = useNavigate()

  const searchCriteria = {
    origin: searchParams.get('origin'),
    destination: searchParams.get('destination'),
    departureDate: searchParams.get('departureDate'),
    returnDate: searchParams.get('returnDate'),
    passengers: parseInt(searchParams.get('passengers')) || 1,
    tripType: searchParams.get('tripType') || 'one-way'
  }

  useEffect(() => {
    // Simulate API call to fetch flights
    const fetchFlights = async () => {
      setLoading(true)
      try {
        // Mock flight data - in real app, this would come from your backend
        const mockFlights = [
          {
            id: 1,
            airline: 'Air India',
            flightNumber: 'AI-101',
            origin: searchCriteria.origin,
            destination: searchCriteria.destination,
            departureTime: new Date(`${searchCriteria.departureDate}T08:00:00`),
            arrivalTime: new Date(`${searchCriteria.departureDate}T11:30:00`),
            duration: 210, // minutes
            price: 12000,
            stops: 0
          },
          {
            id: 2,
            airline: 'Emirates',
            flightNumber: 'EK-202',
            origin: searchCriteria.origin,
            destination: searchCriteria.destination,
            departureTime: new Date(`${searchCriteria.departureDate}T14:00:00`),
            arrivalTime: new Date(`${searchCriteria.departureDate}T18:45:00`),
            duration: 285,
            price: 18500,
            stops: 1
          },
          {
            id: 3,
            airline: 'IndiGo',
            flightNumber: '6E-303',
            origin: searchCriteria.origin,
            destination: searchCriteria.destination,
            departureTime: new Date(`${searchCriteria.departureDate}T20:00:00`),
            arrivalTime: new Date(`${searchCriteria.departureDate}T23:15:00`),
            duration: 195,
            price: 9500,
            stops: 0
          }
        ]
        setFlights(mockFlights)
      } catch (error) {
        console.error('Error fetching flights:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFlights()
  }, [searchParams])

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
  }

  const handleBookFlight = (flightId) => {
    navigate(`/booking/${flightId}?${searchParams.toString()}`)
  }

  const sortedFlights = [...flights].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return a.price - b.price
      case 'duration':
        return a.duration - b.duration
      case 'departure':
        return a.departureTime - b.departureTime
      default:
        return 0
    }
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Search Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Flight Results</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div className="flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-blue-600" />
              <span>{searchCriteria.origin} → {searchCriteria.destination}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-blue-600" />
              <span>{new Date(searchCriteria.departureDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-blue-600" />
              <span>{searchCriteria.passengers} Passenger{searchCriteria.passengers > 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>

        {/* Sort Options */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium">Sort by:</span>
            {['price', 'duration', 'departure'].map((option) => (
              <button
                key={option}
                onClick={() => setSortBy(option)}
                className={`px-3 py-1 rounded-full text-sm ${
                  sortBy === option
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Flight Results */}
        <div className="space-y-6">
          {sortedFlights.map((flight) => (
            <div key={flight.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Plane className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{flight.airline}</h3>
                    <p className="text-gray-600">{flight.flightNumber}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">{formatCurrency(flight.price)}</p>
                  <p className="text-sm text-gray-600">per person</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <p className="text-2xl font-bold">{formatTime(flight.departureTime)}</p>
                  <p className="text-gray-600">{flight.origin}</p>
                </div>
                
                <div className="text-center">
                  <p className="text-gray-600">{formatDuration(flight.duration)}</p>
                  <div className="relative my-2">
                    <div className="h-px bg-gray-300"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white px-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600">
                    {flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                  </p>
                </div>
                
                <div className="text-center">
                  <p className="text-2xl font-bold">{formatTime(flight.arrivalTime)}</p>
                  <p className="text-gray-600">{flight.destination}</p>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Economy • Free cancellation
                </div>
                <button
                  onClick={() => handleBookFlight(flight.id)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                >
                  Select Flight
                </button>
              </div>
            </div>
          ))}
        </div>

        {flights.length === 0 && !loading && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <Plane className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No flights found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchResults