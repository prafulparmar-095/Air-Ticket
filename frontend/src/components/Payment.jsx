import { useState } from 'react'
import { useApi } from '../hooks/useApi'
import { validateCardNumber, validateExpiryDate, validateCVV } from '../utils/validators'
import { toast } from 'react-toastify'

const Payment = ({ booking, onSuccess }) => {
  const [paymentMethod, setPaymentMethod] = useState('credit_card')
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  })
  const [loading, setLoading] = useState(false)
  const api = useApi()

  const handleCardChange = (e) => {
    const { name, value } = e.target
    setCardDetails(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Validate card details
    if (paymentMethod === 'credit_card' || paymentMethod === 'debit_card') {
      if (!validateCardNumber(cardDetails.number)) {
        toast.error('Please enter a valid card number')
        setLoading(false)
        return
      }
      if (!validateExpiryDate(cardDetails.expiry)) {
        toast.error('Please enter a valid expiry date')
        setLoading(false)
        return
      }
      if (!validateCVV(cardDetails.cvv)) {
        toast.error('Please enter a valid CVV')
        setLoading(false)
        return
      }
      if (!cardDetails.name.trim()) {
        toast.error('Please enter cardholder name')
        setLoading(false)
        return
      }
    }

    try {
      const response = await api.post('/payments/create', {
        bookingId: booking._id,
        amount: booking.totalAmount,
        paymentMethod,
        cardDetails: paymentMethod.includes('card') ? cardDetails : undefined
      })

      if (response.data.success) {
        onSuccess(response.data.payment)
      } else {
        toast.error('Payment failed: ' + response.data.message)
      }
    } catch (error) {
      toast.error('Payment failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-6">Payment Details</h2>
      
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold">Total Amount:</span>
          <span className="text-2xl font-bold text-primary-600">
            ${booking.totalAmount}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payment Method
          </label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="input-field"
          >
            <option value="credit_card">Credit Card</option>
            <option value="debit_card">Debit Card</option>
            <option value="paypal">PayPal</option>
          </select>
        </div>

        {(paymentMethod === 'credit_card' || paymentMethod === 'debit_card') && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Number
              </label>
              <input
                type="text"
                name="number"
                value={cardDetails.number}
                onChange={handleCardChange}
                placeholder="1234 5678 9012 3456"
                className="input-field"
                maxLength="19"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date
                </label>
                <input
                  type="text"
                  name="expiry"
                  value={cardDetails.expiry}
                  onChange={handleCardChange}
                  placeholder="MM/YY"
                  className="input-field"
                  maxLength="5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CVV
                </label>
                <input
                  type="text"
                  name="cvv"
                  value={cardDetails.cvv}
                  onChange={handleCardChange}
                  placeholder="123"
                  className="input-field"
                  maxLength="4"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cardholder Name
              </label>
              <input
                type="text"
                name="name"
                value={cardDetails.name}
                onChange={handleCardChange}
                placeholder="John Doe"
                className="input-field"
              />
            </div>
          </>
        )}

        {paymentMethod === 'paypal' && (
          <div className="p-4 bg-yellow-50 rounded-lg">
            <p className="text-yellow-800">
              You will be redirected to PayPal to complete your payment.
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary disabled:opacity-50"
        >
          {loading ? 'Processing...' : `Pay $${booking.totalAmount}`}
        </button>
      </form>
    </div>
  )
}

export default Payment