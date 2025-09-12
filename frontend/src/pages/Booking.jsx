import { useState, useEffect } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useApi } from '../hooks/useApi'
import Payment from '../components/Payment'
import LoadingSpinner from '../components/LoadingSpinner'
import { formatDate, formatTime, formatDuration, formatCurrency } from '../utils/formatters'
import { toast } from 'react-toastify'

const Booking = () => {
  const { flightId } = useParams()
  const [searchParams] = useSearchParams()
  const passengersCount = parseInt(searchParams.get('passengers') || '1')
  const { user } = useAuth()
  const api = useApi()
  const navigate = useNavigate()

  const [flight, setFlight] = useState(null)
  const [passengers, setPassengers] = useState([])
  const [selectedClass, setSelectedClass] = useState('economy')
  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState(null)
  const [step, setStep] = useState(1) // 1: Passenger details, 2: Payment

  useEffect(() => {
    const fetchFlight = async () => {
      try {
        const response = await api.get(`/flights/${flightId}`)
        setFlight(response.data)
        
        // Initialize passengers array
        const initialPassengers = Array(passengersCount).fill().map(() => ({
          firstName: '',
          lastName: '',
          dateOfBirth: '',
          gender: '',
          passportNumber: '',
          nationality: ''
        }))
        setPassengers(initialPassengers)
      } catch (error) {
        console.error('Failed to fetch flight:', error)
        toast.error('Failed to load flight details')
      } finally {
        setLoading(false)
      }
    }

    fetchFlight()
  }, [flightId, passengersCount])

  const handlePassengerChange = (index, field, value) => {
    const updatedPassengers = [...passengers]
    updatedPassengers[index][field] = value
    setPassengers(updatedPassengers)
  }

  const handleCreateBooking = async () => {
    if (!user) {
      toast.error('Please login to continue with booking')
      navigate('/login', { state: { from: window.location.pathname } })
      return
    }

    try {
      const response = await api.post('/bookings', {
        flightId,
        passengers,
        class: selectedClass,
        totalAmount: flight.price * passengers.length
      })
      
      setBooking(response.data)
      setStep(2)
    } catch (error) {
      console.error('Failed to create booking:', error)
      toast.error('Failed to create booking')
    }
  }

  const handlePaymentSuccess = (payment) => {
    toast.success('Payment successful! Your booking is confirmed.')
    navigate('/payment-success', { 
      state: { 
        bookingId: booking._id,
        paymentId: payment._id 
      } 
    })
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner />
      </div>
    )
  }

  if (!flight) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Flight not found</h2>
          <p className="text-gray-600">The requested flight could not be found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Complete Your Booking</h1>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className={`flex items-center ${step >= 1 ? 'text-primary-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                step >= 1 ? 'border-primary-600 bg-primary-600 text-white' : 'border-gray-300'
              }`}>
                1
              </div>
              <span className="ml-2 font-medium">Passenger Details</span>
            </div>
            
            <div className="flex-1 h-1 bg-gray-300 mx-4"></div>
            
            <div className={`flex items-center ${step >= 2 ? 'text-primary-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                step >= 2 ? 'border-primary-600 bg-primary-600 text-white' : 'border-gray-300'
              }`}>
                2
              </div>
              <span className="ml-2 font-medium">Payment</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {step === 1 && (
              <div className="card">
                <h2 className="text-2xl font-bold mb-6">Passenger Details</h2>
                
                {/* Flight Summary */}
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">
                        {flight.origin} → {flight.destination}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {formatDate(flight.departureTime)} • {formatDuration(flight.duration)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {flight.airline.name} • {flight.flightNumber}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary-600">
                        {formatCurrency(flight.price * passengers.length)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {passengers.length} {passengers.length === 1 ? 'passenger' : 'passengers'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Class Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Travel Class
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {['economy', 'business', 'first'].map((cls) => (
                      <div
                        key={cls}
                        onClick={() => setSelectedClass(cls)}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedClass === cls
                            ? 'border-primary-600 bg-primary-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <h4 className="font-semibold capitalize">{cls}</h4>
                        <p className="text-sm text-gray-600">
                          {cls === 'economy' ? 'Standard seating' :
                           cls === 'business' ? 'Extra legroom' :
                           'Luxury experience'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Passenger Forms */}
                <div className="space-y-6">
                  {passengers.map((passenger, index) => (
                    <div key={index} className="border-t pt-6">
                      <h3 className="text-lg font-semibold mb-4">
                        Passenger {index + 1}
                      </h3>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            First Name *
                          </label>
                          <input
                            type="text"
                            value={passenger.firstName}
                            onChange={(e) => handlePassengerChange(index, 'firstName', e.target.value)}
                            className="input-field"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Last Name *
                          </label>
                          <input
                            type="text"
                            value={passenger.lastName}
                            onChange={(e) => handlePassengerChange(index, 'lastName', e.target.value)}
                            className="input-field"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Date of Birth *
                          </label>
                          <input
                            type="date"
                            value={passenger.dateOfBirth}
                            onChange={(e) => handlePassengerChange(index, 'dateOfBirth', e.target.value)}
                            className="input-field"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Gender *
                          </label>
                          <select
                            value={passenger.gender}
                            onChange={(e) => handlePassengerChange(index, 'gender', e.target.value)}
                            className="input-field"
                            required
                          >
                            <option value="">Select</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Passport Number *
                          </label>
                          <input
                            type="text"
                            value={passenger.passportNumber}
                            onChange={(e) => handlePassengerChange(index, 'passportNumber', e.target.value)}
                            className="input-field"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nationality *
                          </label>
                          <input
                            type="text"
                            value={passenger.nationality}
                            onChange={(e) => handlePassengerChange(index, 'nationality', e.target.value)}
                            className="input-field"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleCreateBooking}
                  disabled={passengers.some(p => !p.firstName || !p.lastName || !p.dateOfBirth || !p.gender || !p.passportNumber || !p.nationality)}
                  className="w-full btn-primary mt-8 disabled:opacity-50"
                >
                  Continue to Payment
                </button>
              </div>
            )}

            {step === 2 && booking && (
              <Payment 
                booking={booking} 
                onSuccess={handlePaymentSuccess}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card sticky top-4">
              <h3 className="text-lg font-semibold mb-4">Booking Summary</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Flight:</span>
                  <span className="font-semibold">
                    {flight.origin} → {flight.destination}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span>{formatDate(flight.departureTime)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Passengers:</span>
                  <span>{passengers.length}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Class:</span>
                  <span className="capitalize">{selectedClass}</span>
                </div>
                
                <div className="flex justify-between text-lg font-bold pt-3 border-t">
                  <span>Total:</span>
                  <span className="text-primary-600">
                    {formatCurrency(flight.price * passengers.length)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Booking