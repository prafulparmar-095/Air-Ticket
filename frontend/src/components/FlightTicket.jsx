import { useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { Plane, Calendar, Clock, MapPin, User, CreditCard } from 'lucide-react'

const FlightTicket = () => {
  const { flightId } = useParams()
  const [searchParams] = useSearchParams()
  const [passengerData, setPassengerData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  })
  const [bookingComplete, setBookingComplete] = useState(false)

  // Mock flight data - in real app, this would come from your backend
  const flight = {
    id: parseInt(flightId),
    airline: 'Air India',
    flightNumber: 'AI-101',
    origin: searchParams.get('origin'),
    destination: searchParams.get('destination'),
    departureTime: new Date(`${searchParams.get('departureDate')}T08:00:00`),
    arrivalTime: new Date(`${searchParams.get('departureDate')}T11:30:00`),
    duration: 210,
    price: 12000,
    stops: 0
  }

  const passengers = parseInt(searchParams.get('passengers')) || 1

  const handleInputChange = (field, value) => {
    setPassengerData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Simulate booking process
    setBookingComplete(true)
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
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

  if (bookingComplete) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Booking Confirmed!</h2>
            <p className="text-gray-600 mb-6">Your flight has been successfully booked</p>
            
            {/* Ticket Display */}
            <div className="bg-blue-50 border-2 border-blue-200 border-dashed rounded-lg p-6 mb-6">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-blue-800">E-Ticket</h3>
                <p className="text-sm text-blue-600">Booking Reference: BK{Date.now().toString().slice(-6)}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Flight</p>
                  <p className="font-semibold">{flight.airline} {flight.flightNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-semibold">{formatDate(flight.departureTime)}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">From</p>
                  <p className="font-semibold">{flight.origin}</p>
                  <p className="text-sm">{formatTime(flight.departureTime)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">To</p>
                  <p className="font-semibold">{flight.destination}</p>
                  <p className="text-sm">{formatTime(flight.arrivalTime)}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Passenger</p>
                  <p className="font-semibold">{passengerData.firstName} {passengerData.lastName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Class</p>
                  <p className="font-semibold">Economy</p>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => window.print()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Print Ticket
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Complete Your Booking</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Flight Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Flight Details</h2>
              
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold">{flight.origin} → {flight.destination}</h3>
                  <p className="text-gray-600">{flight.airline} • {flight.flightNumber}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-blue-600">{formatCurrency(flight.price * passengers)}</p>
                  <p className="text-sm text-gray-600">for {passengers} passenger{passengers > 1 ? 's' : ''}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Departure</p>
                  <p className="font-medium">{formatTime(flight.departureTime)}</p>
                  <p className="text-gray-600">{formatDate(flight.departureTime)}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-600">{formatDuration(flight.duration)}</p>
                  <div className="relative my-2">
                    <div className="h-px bg-gray-300"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white px-2">
                        <Plane className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600">{flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop`}</p>
                </div>
                <div>
                  <p className="text-gray-600">Arrival</p>
                  <p className="font-medium">{formatTime(flight.arrivalTime)}</p>
                  <p className="text-gray-600">{formatDate(flight.arrivalTime)}</p>
                </div>
              </div>
            </div>
            
            {/* Passenger Form */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Passenger Information</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={passengerData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={passengerData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={passengerData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={passengerData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  Confirm Booking
                </button>
              </form>
            </div>
          </div>
          
          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h3 className="text-lg font-semibold mb-4">Booking Summary</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Flight</span>
                  <span className="font-medium">{formatCurrency(flight.price)} × {passengers}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Taxes & Fees</span>
                  <span className="font-medium">{formatCurrency(flight.price * 0.18 * passengers)}</span>
                </div>
                
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-blue-600">
                      {formatCurrency(flight.price * passengers * 1.18)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FlightTicket