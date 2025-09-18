import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useApi from '../hooks/useApi'
import { bookingsService } from '../services/bookings'
import { paymentsService } from '../services/payments'
import PaymentForm from '../components/payment/PaymentForm'
import LoadingSpinner from '../components/layout/LoadingSpinner'
import { ArrowLeft, CreditCard, Shield, CheckCircle } from 'lucide-react'

const Payment = () => {
  const { bookingId } = useParams()
  const navigate = useNavigate()
  const [paymentStatus, setPaymentStatus] = useState('pending')
  const [loading, setLoading] = useState(false)

  const { data: booking, loading: bookingLoading } = useApi(
    `/bookings/${bookingId}`
  )

  const handlePaymentSubmit = async (paymentData) => {
    setLoading(true)
    try {
      const response = await paymentsService.confirm({
        bookingId,
        ...paymentData
      })
      
      if (response.data.status === 'succeeded') {
        setPaymentStatus('success')
        // Redirect to success page after 3 seconds
        setTimeout(() => {
          navigate(`/booking-confirmation/${bookingId}`)
        }, 3000)
      } else {
        setPaymentStatus('failed')
      }
    } catch (error) {
      setPaymentStatus('failed')
    } finally {
      setLoading(false)
    }
  }

  if (bookingLoading) return <LoadingSpinner />

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Booking
        </button>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <CreditCard className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Complete Your Payment
              </h1>
              <p className="text-gray-600">
                Secure payment processed with bank-level encryption
              </p>
            </div>

            {paymentStatus === 'pending' && (
              <PaymentForm
                booking={booking}
                onSubmit={handlePaymentSubmit}
                loading={loading}
              />
            )}

            {paymentStatus === 'success' && (
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Payment Successful!
                </h2>
                <p className="text-gray-600 mb-6">
                  Your booking has been confirmed. Redirecting to confirmation page...
                </p>
              </div>
            )}

            {paymentStatus === 'failed' && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Payment Failed
                </h2>
                <p className="text-gray-600 mb-6">
                  There was an issue processing your payment. Please try again.
                </p>
                <button
                  onClick={() => setPaymentStatus('pending')}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">
                  Secure Payment
                </h3>
                <p className="text-blue-700 text-sm">
                  Your payment information is encrypted and secure. We do not store your card details.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Payment