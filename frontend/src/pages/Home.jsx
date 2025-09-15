import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Plane, Shield, Clock, Users } from 'lucide-react'
import { CABIN_CLASSES, PASSENGER_TYPES } from '../utils/constants'
import { validateFlightSearch } from '../utils/validators'

const Home = () => {
  const navigate = useNavigate()
  const [searchData, setSearchData] = useState({
    tripType: 'one-way',
    origin: '',
    destination: '',
    departureDate: '',
    returnDate: '',
    passengers: {
      adult: 1,
      child: 0,
      infant: 0
    },
    cabinClass: 'economy'
  })
  const [errors, setErrors] = useState({})

  const handleInputChange = (field, value) => {
    setSearchData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handlePassengerChange = (type, value) => {
    setSearchData(prev => ({
      ...prev,
      passengers: {
        ...prev.passengers,
        [type]: parseInt(value)
      }
    }))
  }

  const handleSearch = (e) => {
    e.preventDefault()
    
    const validation = validateFlightSearch(searchData)
    if (!validation.isValid) {
      setErrors(validation.errors)
      return
    }

    setErrors({})
    
    // Convert to URL parameters
    const params = new URLSearchParams()
    params.append('origin', searchData.origin)
    params.append('destination', searchData.destination)
    params.append('departureDate', searchData.departureDate)
    if (searchData.returnDate) {
      params.append('returnDate', searchData.returnDate)
    }
    params.append('adult', searchData.passengers.adult)
    params.append('child', searchData.passengers.child)
    params.append('infant', searchData.passengers.infant)
    params.append('cabinClass', searchData.cabinClass)
    params.append('tripType', searchData.tripType)

    navigate(`/search?${params.toString()}`)
  }

  const totalPassengers = Object.values(searchData.passengers).reduce((a, b) => a + b, 0)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Travel The World With Ease
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Book your flights with confidence and enjoy a seamless travel experience
            </p>
          </div>
        </div>
      </section>

      {/* Search Form */}
      <section className="relative -mt-16 max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-6">
          <div className="flex space-x-4 mb-6">
            {['one-way', 'round-trip'].map((type) => (
              <button
                key={type}
                onClick={() => handleInputChange('tripType', type)}
                className={`px-6 py-2 rounded-full font-medium ${
                  searchData.tripType === type
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type === 'one-way' ? 'One Way' : 'Round Trip'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSearch} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From
                </label>
                <input
                  type="text"
                  value={searchData.origin}
                  onChange={(e) => handleInputChange('origin', e.target.value)}
                  placeholder="City or airport"
                  className="input-field"
                  list="cities"
                />
                {errors.origin && (
                  <p className="text-red-600 text-sm mt-1">{errors.origin}</p>
                )}
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
                  className="input-field"
                  list="cities"
                />
                {errors.destination && (
                  <p className="text-red-600 text-sm mt-1">{errors.destination}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Departure
                </label>
                <input
                  type="date"
                  value={searchData.departureDate}
                  onChange={(e) => handleInputChange('departureDate', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="input-field"
                />
                {errors.departureDate && (
                  <p className="text-red-600 text-sm mt-1">{errors.departureDate}</p>
                )}
              </div>

              {searchData.tripType === 'round-trip' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Return
                  </label>
                  <input
                    type="date"
                    value={searchData.returnDate}
                    onChange={(e) => handleInputChange('returnDate', e.target.value)}
                    min={searchData.departureDate || new Date().toISOString().split('T')[0]}
                    className="input-field"
                  />
                  {errors.returnDate && (
                    <p className="text-red-600 text-sm mt-1">{errors.returnDate}</p>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Passengers & Class
                </label>
                <div className="flex space-x-4">
                  <select
                    value={totalPassengers}
                    onChange={(e) => {
                      // This is a simplified implementation
                      const newAdults = Math.max(1, parseInt(e.target.value) - 
                        (searchData.passengers.child + searchData.passengers.infant))
                      handlePassengerChange('adult', newAdults)
                    }}
                    className="input-field"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                      <option key={num} value={num}>
                        {num} Passenger{num > 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>

                  <select
                    value={searchData.cabinClass}
                    onChange={(e) => handleInputChange('cabinClass', e.target.value)}
                    className="input-field"
                  >
                    {CABIN_CLASSES.map((cls) => (
                      <option key={cls.value} value={cls.value}>
                        {cls.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full btn-primary flex items-center justify-center space-x-2"
                >
                  <Search className="h-5 w-5" />
                  <span>Search Flights</span>
                </button>
              </div>
            </div>
          </form>

          <datalist id="cities">
            {['New York', 'London', 'Paris', 'Tokyo', 'Dubai', 'Singapore', 
              'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Sydney'].map(city => (
              <option key={city} value={city} />
            ))}
          </datalist>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Choose AirTicket?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We provide the best travel experience with our premium services
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Shield,
              title: 'Secure Booking',
              description: 'Your transactions are protected with advanced security measures'
            },
            {
              icon: Clock,
              title: 'Instant Confirmation',
              description: 'Get immediate booking confirmation and e-tickets'
            },
            {
              icon: Users,
              title: '24/7 Support',
              description: 'Our customer support team is always ready to help you'
            }
          ].map((feature, index) => (
            <div key={index} className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <feature.icon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Popular Destinations
            </h2>
            <p className="text-xl text-gray-600">
              Discover amazing places around the world
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Paris', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/17/15/6d/d6/paris.jpg?w=1400&h=1400&s=1', price: '$299' },
              { name: 'Tokyo', image: '/api/placeholder/300/200', price: '$499' },
              { name: 'Dubai', image: '/api/placeholder/300/200', price: '$399' },
              { name: 'New York', image: '/api/placeholder/300/200', price: '$349' }
            ].map((destination, index) => (
              <div key={index} className="relative group overflow-hidden rounded-lg">
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="w-full h-48 object-cover transition-transform group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all">
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-semibold">{destination.name}</h3>
                    <p className="text-primary-200">From {destination.price}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home