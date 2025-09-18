import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Plane, Calendar, Users, ArrowRightLeft } from 'lucide-react'

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

  const handleChange = (e) => {
    setSearchData({
      ...searchData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    Object.entries(searchData).forEach(([key, value]) => {
      if (value) params.append(key, value)
    })
    navigate(`/flights/results?${params.toString()}`)
  }

  const swapAirports = () => {
    setSearchData({
      ...searchData,
      origin: searchData.destination,
      destination: searchData.origin
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Plane className="w-12 h-12 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Find Your Perfect Flight
            </h1>
            <p className="text-xl text-gray-600">
              Search for flights to destinations around the world
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
            <div className="flex space-x-4 mb-6">
              <button
                type="button"
                className={`px-4 py-2 rounded-lg font-semibold ${
                  searchData.tripType === 'one-way'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
                onClick={() => setSearchData({ ...searchData, tripType: 'one-way' })}
              >
                One Way
              </button>
              <button
                type="button"
                className={`px-4 py-2 rounded-lg font-semibold ${
                  searchData.tripType === 'round-trip'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
                onClick={() => setSearchData({ ...searchData, tripType: 'round-trip' })}
              >
                Round Trip
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From
                  </label>
                  <input
                    type="text"
                    name="origin"
                    value={searchData.origin}
                    onChange={handleChange}
                    placeholder="City or airport"
                    className="input pl-10"
                    required
                  />
                  <Search className="absolute left-3 top-9 text-gray-400 w-5 h-5" />
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    To
                  </label>
                  <input
                    type="text"
                    name="destination"
                    value={searchData.destination}
                    onChange={handleChange}
                    placeholder="City or airport"
                    className="input pl-10"
                    required
                  />
                  <Search className="absolute left-3 top-9 text-gray-400 w-5 h-5" />
                </div>

                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={swapAirports}
                    className="bg-gray-100 p-2 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <ArrowRightLeft className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Departure
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="departureDate"
                      value={searchData.departureDate}
                      onChange={handleChange}
                      className="input pl-10"
                      required
                      min={new Date().toISOString().split('T')[0]}
                    />
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  </div>
                </div>

                {searchData.tripType === 'round-trip' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Return
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        name="returnDate"
                        value={searchData.returnDate}
                        onChange={handleChange}
                        className="input pl-10"
                        min={searchData.departureDate}
                      />
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Passengers
                  </label>
                  <div className="relative">
                    <select
                      name="passengers"
                      value={searchData.passengers}
                      onChange={handleChange}
                      className="input pl-10"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? 'Passenger' : 'Passengers'}
                        </option>
                      ))}
                    </select>
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  </div>
                </div>
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-12 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors"
                >
                  Search Flights
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FlightSearch