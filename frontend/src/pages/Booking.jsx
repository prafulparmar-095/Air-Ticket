import { useState, useEffect } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { useApi } from '../hooks/useApi'
import { useAuth } from '../hooks/useAuth'
import { Plane, User, Mail, Phone, Calendar, MapPin, CreditCard } from 'lucide-react'
import { formatDate, formatTime, formatDuration, formatCurrency, capitalizeFirst } from '../utils/formatters'
import { validateEmail, validateName, validatePhone } from '../utils/validators'
import Payment from '../components/Payment'
import LoadingSpinner from '../components/LoadingSpinner'

const Booking = () => {
  const { flightId } = useParams()
  const [searchParams] = useSearchParams()
  const [flight, setFlight] = useState(null)
  const [passengers, setPassengers] = useState([])
  const [contactInfo, setContactInfo] = useState({
    email: '',
    phone: ''
  })
  const [errors, setErrors] = useState({})
  const [booking, setBooking] = useState(null)
  const [step, setStep] = useState('passengers')
  const api = useApi()
  const { user } = useAuth()
  const navigate = useNavigate()

  const searchCriteria = {
    adult: parseInt(searchParams.get('adult')) || 1,
    child: parseInt(searchParams.get('child')) || 0,
    infant: parseInt(searchParams.get('infant')) || 0,
    cabinClass: searchParams.get('cabinClass') || 'economy'
  }

  useEffect(() => {
    fetchFlight()
    initializePassengers()
    if (user) {
      setContactInfo({
        email: user.email,
        phone: user.phone
      })
    }
  }, [flightId, user])

  const fetchFlight = async () => {
    try {
      const response = await api.get(`/flights/${flightId}`)
      setFlight(response.data.flight)
    } catch (error) {
      console.error('Error fetching flight:', error)
    }
  }

  const initializePassengers = () => {
    const passengersList = []
    
    // Add adults
    for (let i = 0; i < searchCriteria.adult; i++) {
      passengersList.push({
        type: 'adult',
        firstName: '',
        lastName: '',
        gender: '',
        dateOfBirth: '',
        passportNumber: '',
        passportExpiry: ''
      })
    }
    
    // Add children
    for (let i = 0; i < searchCriteria.child; i++) {
      passengersList.push({
        type: 'child',
        firstName: '',
        lastName: '',
        gender: '',
        dateOfBirth: '',
        passportNumber: '',
        passportExpiry: ''
      })
    }
    
    // Add infants
    for (let i = 0; i < searchCriteria.infant; i++) {
      passengersList.push({
        type: 'infant',
        firstName: '',
        lastName: '',
        gender: '',
        dateOfBirth: '',
        passportNumber: '',
        passportExpiry: ''
      })
    }
    
    setPassengers(passengersList)
  }

  const updatePassenger = (index, field, value) => {
    setPassengers(prev => prev.map((passenger, i) => 
      i === index ? { ...passenger, [field]: value } : passenger
    ))
  }

  const validatePassengers = () => {
    const newErrors = {}
    
    passengers.forEach((passenger, index) => {
      if (!passenger.firstName) {
        newErrors[`passenger-${index}-firstName`] = 'First name is required'
      }
      if (!passenger.lastName) {
        newErrors[`passenger-${index}-lastName`] = 'Last name is required'
      }
      if (!passenger.gender) {
        newErrors[`passenger-${index}-gender`] = 'Gender is required'
      }
      if (!passenger.dateOfBirth) {
        newErrors[`passenger-${index}-dateOfBirth`] = 'Date of birth is required'
      }
    })
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateContactInfo = () => {
    const newErrors = {}
    
    if (!contactInfo.email) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(contactInfo.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    if (!contactInfo.phone) {
      newErrors.phone = 'Phone number is required'
    } else if (!validatePhone(contactInfo.phone)) {
      newErrors.phone = 'Please enter a valid phone number'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleContactInfoChange = (field, value) => {
    setContactInfo(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleCreateBooking = async () => {
    if (!validateContactInfo()) return

    try {
      const response = await api.post('/bookings', {
        flightId,
        passengers,
        contactInfo,
        cabinClass: searchCriteria.cabinClass
      })
      setBooking(response.data.booking)
      setStep('payment')
    } catch (error) {
      console.error('Error creating booking:', error)
    }
  }

  const handlePaymentSuccess = () => {
    navigate('/payment-success', { 
      state: { bookingId: booking._id } 
    })
  }

  if (!flight) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  const totalAmount = flight.price * passengers.length

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center">
            {['passengers', 'review', 'payment', 'confirmation'].map((s, index) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step === s
                      ? 'bg-primary-600 text-white'
                      : index < ['passengers', 'review', 'payment', 'confirmation'].indexOf(step)
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {index + 1}
                </div>
                <span
                  className={`ml-2 ${
                    step === s ? 'text-primary-600 font-medium' : 'text-gray-600'
                  }`}
                >
                  {capitalizeFirst(s)}
                </span>
                {index < 3 && (
                  <div
                    className={`w-16 h-1 mx-4 ${
                      index < ['passengers', 'review', 'payment', 'confirmation'].indexOf(step)
                        ? 'bg-green-500'
                        : 'bg-gray-200'
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {step === 'passengers' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-6">Passenger Details</h2>
                
                <div className="space-y-6">
                  {passengers.map((passenger, index) => (
                    <div key={index} className="border-t pt-6 first:border-t-0 first:pt-0">
                      <h3 className="text-lg font-medium mb-4">
                        {capitalizeFirst(passenger.type)} {index + 1}
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            First Name *
                          </label>
                          <input
                            type="text"
                            value={passenger.firstName}
                            onChange={(e) => updatePassenger(index, 'firstName', e.target.value)}
                            className={`input-field ${errors[`passenger-${index}-firstName`] ? 'border-red-300' : ''}`}
                          />
                          {errors[`passenger-${index}-firstName`] && (
                            <p className="text-red-600 text-sm mt-1">
                              {errors[`passenger-${index}-firstName`]}
                            </p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Last Name *
                          </label>
                          <input
                            type="text"
                            value={passenger.lastName}
                            onChange={(e) => updatePassenger(index, 'lastName', e.target.value)}
                            className={`input-field ${errors[`passenger-${index}-lastName`] ? 'border-red-300' : ''}`}
                          />
                          {errors[`passenger-${index}-lastName`] && (
                            <p className="text-red-600 text-sm mt-1">
                              {errors[`passenger-${index}-lastName`]}
                            </p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Gender *
                          </label>
                          <select
                            value={passenger.gender}
                            onChange={(e) => updatePassenger(index, 'gender', e.target.value)}
                            className={`input-field ${errors[`passenger-${index}-gender`] ? 'border-red-300' : ''}`}
                          >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                          {errors[`passenger-${index}-gender`] && (
                            <p className="text-red-600 text-sm mt-1">
                              {errors[`passenger-${index}-gender`]}
                            </p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Date of Birth *
                          </label>
                          <input
                            type="date"
                            value={passenger.dateOfBirth}
                            onChange={(e) => updatePassenger(index, 'dateOfBirth', e.target.value)}
                            className={`input-field ${errors[`passenger-${index}-dateOfBirth`] ? 'border-red-300' : ''}`}
                          />
                          {errors[`passenger-${index}-dateOfBirth`] && (
                            <p className="text-red-600 text-sm mt-1">
                              {errors[`passenger-${index}-dateOfBirth`]}
                            </p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Passport Number
                          </label>
                          <input
                            type="text"
                            value={passenger.passportNumber}
                            onChange={(e) => updatePassenger(index, 'passportNumber', e.target.value)}
                            className="input-field"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Passport Expiry
                          </label>
                          <input
                            type="date"
                            value={passenger.passportExpiry}
                            onChange={(e) => updatePassenger(index, 'passportExpiry', e.target.value)}
                            className="input-field"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium mb-4">Contact Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          value={contactInfo.email}
                          onChange={(e) => handleContactInfoChange('email', e.target.value)}
                          className={`input-field ${errors.email ? 'border-red-300' : ''}`}
                        />
                        {errors.email && (
                          <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          value={contactInfo.phone}
                          onChange={(e) => handleContactInfoChange('phone', e.target.value)}
                          className={`input-field ${errors.phone ? 'border-red-300' : ''}`}
                        />
                        {errors.phone && (
                          <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => {
                      if (validatePassengers()) {
                        setStep('review')
                      }
                    }}
                    className="w-full btn-primary"
                  >
                    Continue to Review
                  </button>
                </div>
              </div>
            )}
            
            {step === 'review' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-6">Review Booking</h2>
                
                {/* Flight Details */}
                <div className="border-b pb-6 mb-6">
                  <h3 className="text-lg font-medium mb-4">Flight Details</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="font-semibold">
                          {flight.origin} → {flight.destination}
                        </p>
                        <p className="text-gray-600">
                          {formatDate(flight.departureTime)} • {passengers.length} passenger(s)
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary-600">
                          {formatCurrency(totalAmount)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Departure</p>
                        <p className="font-medium">{formatTime(flight.departureTime)}</p>
                        <p className="text-gray-600">{flight.origin}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-600">{formatDuration(flight.duration)}</p>
                        <div className="relative">
                          <div className="h-px bg-gray-300 my-2"></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-gray-50 px-2">
                              <Plane className="h-4 w-4 text-gray-400" />
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-600">
                          {flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Arrival</p>
                        <p className="font-medium">{formatTime(flight.arrivalTime)}</p>
                        <p className="text-gray-600">{flight.destination}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Passenger Details */}
                <div className="border-b pb-6 mb-6">
                  <h3 className="text-lg font-medium mb-4">Passenger Details</h3>
                  <div className="space-y-4">
                    {passengers.map((passenger, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <p className="font-medium">
                          {passenger.firstName} {passenger.lastName}
                        </p>
                        <p className="text-gray-600 capitalize">
                          {passenger.type} • {passenger.gender} • {formatDate(passenger.dateOfBirth)}
                        </p>
                        {passenger.passportNumber && (
                          <p className="text-gray-600">
                            Passport: {passenger.passportNumber} (Expires: {formatDate(passenger.passportExpiry)})
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Contact Information */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-4">Contact Information</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="font-medium">{contactInfo.email}</p>
                    <p className="text-gray-600">{contactInfo.phone}</p>
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  <button
                    onClick={() => setStep('passengers')}
                    className="btn-secondary"
                  >
                    Back to Details
                  </button>
                  <button
                    onClick={handleCreateBooking}
                    className="btn-primary"
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}
            
            {step === 'payment' && booking && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-6">Payment</h2>
                <Payment
                  amount={totalAmount}
                  bookingId={booking._id}
                  onSuccess={handlePaymentSuccess}
                />
              </div>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h3 className="text-lg font-semibold mb-4">Booking Summary</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Flight</span>
                  <span className="font-medium">{formatCurrency(flight.price)} × {passengers.length}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Taxes & Fees</span>
                  <span className="font-medium">{formatCurrency(flight.price * 0.15 * passengers.length)}</span>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary-600">
                      {formatCurrency(totalAmount * 1.15)}
                    </span>
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                  <h4 className="font-medium text-blue-800 mb-2">Free Cancellation</h4>
                  <p className="text-sm text-blue-600">
                    Cancel within 24 hours for a full refund
                  </p>
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