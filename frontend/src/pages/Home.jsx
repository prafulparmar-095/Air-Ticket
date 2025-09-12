import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const Home = () => {
  const navigate = useNavigate()
  const [searchData, setSearchData] = useState({
    origin: '',
    destination: '',
    departureDate: '',
    returnDate: '',
    passengers: 1,
    tripType: 'one-way'
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setSearchData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSearch = (e) => {
    e.preventDefault()
    
    if (!searchData.origin || !searchData.destination || !searchData.departureDate) {
      toast.error('Please fill in all required fields')
      return
    }

    const params = new URLSearchParams({
      origin: searchData.origin,
      destination: searchData.destination,
      departureDate: searchData.departureDate,
      passengers: searchData.passengers,
      tripType: searchData.tripType
    })
    
    if (searchData.returnDate && searchData.tripType === 'round-trip') {
      params.append('returnDate', searchData.returnDate)
    }
    
    navigate(`/search?${params.toString()}`)
  }

  return (
    <div className="relative">
      {/* Hero Section */}
      <div 
        className="bg-cover bg-center h-96"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2074&q=80)'
        }}
      >
        <div className="container mx-auto px-4 h-full flex items-center">
          <div className="text-white max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Book Your Flight with Ease
            </h1>
            <p className="text-xl mb-8">
              Discover amazing destinations around the world with our flight booking service.
            </p>
          </div>
        </div>
      </div>

      {/* Search Form */}
      <div className="container mx-auto px-4 -mt-16 relative z-10">
        <div className="bg-white rounded-lg shadow-xl p-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="tripType"
                  value="one-way"
                  checked={searchData.tripType === 'one-way'}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                One Way
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="tripType"
                  value="round-trip"
                  checked={searchData.tripType === 'round-trip'}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                Round Trip
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From *
                </label>
                <input
                  type="text"
                  name="origin"
                  value={searchData.origin}
                  onChange={handleInputChange}
                  placeholder="City or airport code"
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To *
                </label>
                <input
                  type="text"
                  name="destination"
                  value={searchData.destination}
                  onChange={handleInputChange}
                  placeholder="City or airport code"
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Departure *
                </label>
                <input
                  type="date"
                  name="departureDate"
                  value={searchData.departureDate}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              {searchData.tripType === 'round-trip' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Return
                  </label>
                  <input
                    type="date"
                    name="returnDate"
                    value={searchData.returnDate}
                    onChange={handleInputChange}
                    className="input-field"
                    min={searchData.departureDate || new Date().toISOString().split('T')[0]}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Passengers
                </label>
                <select
                  name="passengers"
                  value={searchData.passengers}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'Passenger' : 'Passengers'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary w-full md:w-auto"
            >
              Search Flights
            </button>
          </form>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Fast Booking</h3>
            <p className="text-gray-600">
              Book your flights in minutes with our easy-to-use platform.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Best Prices</h3>
            <p className="text-gray-600">
              Get the best deals and competitive prices on all flights.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
            <p className="text-gray-600">
              Our customer support team is available around the clock.
            </p>
          </div>
        </div>
      </div>

      {/* Popular Destinations */}
      <div className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Popular Destinations</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'New York', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80', price: '$299' },
              { name: 'Paris', image: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2064&q=80', price: '$349' },
              { name: 'Tokyo', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2094&q=80', price: '$599' }
            ].map((destination, index) => (
              <div key={index} className="relative group overflow-hidden rounded-lg">
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold">{destination.name}</h3>
                    <p className="text-lg">From {destination.price}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home