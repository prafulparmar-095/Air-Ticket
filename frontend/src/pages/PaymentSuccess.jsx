import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useApi } from '../hooks/useApi'
import { toast } from 'react-toastify'

const PaymentSuccess = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const api = useApi()

  const { bookingId, paymentId } = location.state || {}

  useEffect(() => {
    if (!bookingId || !paymentId) {
      navigate('/')
      return
    }

    // Send confirmation email
    const sendConfirmation = async () => {
      try {
        await api.post('/bookings/confirm', {
          bookingId,
          paymentId
        })
      } catch (error) {
        console.error('Failed to send confirmation:', error)
      }
    }

    sendConfirmation()
  }, [bookingId, paymentId])

  if (!bookingId || !paymentId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Invalid Payment</h2>
          <p className="text-gray-600">Please check your booking history or contact support.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-green-100 text-green-600 p-8 rounded-lg mb-6">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
          <p className="text-lg">Your flight has been booked successfully.</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Booking Details</h2>
          <div className="space-y-2 text-left">
            <div className="flex justify-between">
              <span className="text-gray-600">Booking ID:</span>
              <span className="font-semibold">{bookingId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment ID:</span>
              <span className="font-semibold">{paymentId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className="font-semibold text-green-600">Confirmed</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-gray-600">
            A confirmation email has been sent to {user?.email}. 
            Please check your inbox for detailed booking information.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/profile')}
              className="btn-primary"
            >
              View My Bookings
            </button>
            <button
              onClick={() => navigate('/')}
              className="btn-secondary"
            >
              Book Another Flight
            </button>
          </div>

          <p className="text-sm text-gray-500 mt-8">
            Need help? Contact our support team at support@skybooker.com
          </p>
        </div>
      </div>
    </div>
  )
}

export default PaymentSuccess