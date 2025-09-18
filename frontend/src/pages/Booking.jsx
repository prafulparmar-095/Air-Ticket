import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import useApi from '../hooks/useApi'
import { flightsService } from '../services/flights'
import { bookingsService } from '../services/bookings'
import LoadingSpinner from '../components/layout/LoadingSpinner'
import PassengerForm from '../components/booking/BookingSummary'
import SeatSelection from '../components/booking/SeatSelection'
import BookingSummary from '../components/booking/BookingSummary'
import { ArrowLeft, User, Armchair, CreditCard } from 'lucide-react'

const Booking = () => {
  const { flightId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [passengers, setPassengers] = useState([])
  const [selectedSeats, setSelectedSeats] = useState({})
  const [loading, setLoading] = useState(false)

  const { data: flight, loading: flightLoading, error: flightError } = useApi(
    `/flights/${flightId}`
  )

  const steps = [
    { number: 1, title: 'Passenger Details', icon: User },
    { number: 2, title: 'Seat Selection', icon: Chair },
    { number: 3, title: 'Review & Pay', icon: CreditCard }
  ]

  const handlePassengerSubmit = (passengerData) => {
    setPassengers(passengerData)
    setCurrentStep(2)
  }

  const handleSeatSelect = (seats) => {
    setSelectedSeats(seats)
    setCurrentStep(3)
  }

  const handleBookingSubmit = async () => {
    setLoading(true)
    try {
      const bookingData = {
        flightId: flight.id,
        passengers: passengers.map((passenger, index) => ({
          ...passenger,
          seat: selectedSeats[index] || null
        })),
        totalAmount: flight.price * passengers.length
      }

      const response = await bookingsService.create(bookingData)
      navigate(`/payment/${response.data.id}`)
    } catch (error) {
      console.error('Booking failed:', error)
    } finally {
      setLoading(false)
    }
  }

  if (flightLoading) return <LoadingSpinner />
  if (flightError) return <div className="text-center text-red-600">Error loading flight</div>

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Flights
        </button>

        {/* Progress Steps */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex justify-between items-center">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    currentStep >= step.number
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'border-gray-300 text-gray-400'
                  }`}
                >
                  <step.icon className="w-5 h-5" />
                </div>
                <span
                  className={`ml-2 font-medium ${
                    currentStep >= step.number ? 'text-blue-600' : 'text-gray-400'
                  }`}
                >
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div
                    className={`w-16 h-0.5 mx-4 ${
                      currentStep > step.number ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {currentStep === 1 && (
              <PassengerForm
                passengerCount={1} // You can make this dynamic based on search
                onSubmit={handlePassengerSubmit}
              />
            )}
            {currentStep === 2 && (
              <SeatSelection
                flight={flight}
                passengerCount={passengers.length}
                onSeatSelect={handleSeatSelect}
              />
            )}
            {currentStep === 3 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold mb-6">Review Booking</h2>
                <button
                  onClick={handleBookingSubmit}
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Confirm Booking'}
                </button>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <BookingSummary
              flight={flight}
              passengerCount={passengers.length}
              selectedSeats={selectedSeats}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Booking