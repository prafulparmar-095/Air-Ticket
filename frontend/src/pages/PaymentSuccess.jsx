import { useEffect, useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useApi } from '../hooks/useApi'
import { CheckCircle, Download, Mail, Calendar, MapPin, Users } from 'lucide-react'
import { formatDate, formatTime, formatCurrency } from '../utils/formatters'
import LoadingSpinner from '../components/LoadingSpinner'

const PaymentSuccess = () => {
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const location = useLocation()
  const navigate = useNavigate()
  const api = useApi()

  const bookingId = location.state?.bookingId

  useEffect(() => {
    if (!bookingId) {
      navigate('/')
      return
    }

    fetchBooking()
  }, [bookingId])

  const fetchBooking = async () => {
    try {
      const response = await api.get(`/bookings/${bookingId}`)
      setBooking(response.data.booking)
    } catch (error) {
      console.error('Error fetching booking:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadTicket = async () => {
    try {
      const response = await api.get(`/bookings/${bookingId}/ticket`, {
        responseType: 'blob'
      })
      
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `ticket-${bookingId}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      console.error('Error downloading ticket:', error)
    }
  }

  const handleEmailTicket = async () => {
    try {
      await api.post(`/bookings/${bookingId}/send-ticket`)
      alert('Ticket has been sent to your email!')
    } catch (error) {
      console.error('Error sending ticket:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Booking not found</h1>
          <Link to="/" className="btn-primary">
            Go Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-600">
            Your booking has been confirmed. Here are your booking details.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Booking Confirmation</h2>
              <p className="text-gray-600">Booking ID: {booking._id}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary-600">
                {formatCurrency(booking.totalAmount)}
              </p>
              <p className="text-sm text-gray-600">Paid on {formatDate(booking.createdAt)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium mb-3 flex items-center">
                <MapPin className="h-5 w-5 text-primary-600 mr-2" />
                Flight Details
              </h3>
              <p className="font-semibold">
                {booking.flight.origin} → {booking.flight.destination}
              </p>
              <p className="text-gray-600">{booking.flight.airline} • {booking.flight.flightNumber}</p>
              <p className="text-gray-600 capitalize">{booking.cabinClass.replace('_', ' ')} Class</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium mb-3 flex items-center">
                <Calendar className="h-5 w-5 text-primary-600 mr-2" />
                Departure
              </h3>
              <p className="font-semibold">{formatDate(booking.flight.departureTime)}</p>
              <p className="text-gray-600">
                {formatTime(booking.flight.departureTime)} - {formatTime(booking.flight.arrivalTime)}
              </p>
              <p className="text-gray-600">Duration: {Math.floor(booking.flight.duration / 60)}h {booking.flight.duration % 60}m</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-medium mb-3 flex items-center">
              <Users className="h-5 w-5 text-primary-600 mr-2" />
              Passengers
            </h3>
            <div className="space-y-2">
              {booking.passengers.map((passenger, index) => (
                <p key={index} className="text-gray-600">
                  {passenger.firstName} {passenger.lastName} ({passenger.type})
                </p>
              ))}
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handleDownloadTicket}
              className="flex items-center space-x-2 btn-primary"
            >
              <Download className="h-5 w-5" />
              <span>Download Ticket</span>
            </button>
            <button
              onClick={handleEmailTicket}
              className="flex items-center space-x-2 btn-secondary"
            >
              <Mail className="h-5 w-5" />
              <span>Email Ticket</span>
            </button>
          </div>
        </div>

        <div className="text-center">
          <Link to="/profile" className="text-primary-600 hover:text-primary-700 font-medium">
            View all bookings in your profile →
          </Link>
        </div>
      </div>
    </div>
  )
}

export default PaymentSuccess