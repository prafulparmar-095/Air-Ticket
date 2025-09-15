import { useState } from 'react'
import { useApi } from '../hooks/useApi'
import { CreditCard, CheckCircle, XCircle } from 'lucide-react'
import LoadingSpinner from './LoadingSpinner'

const Payment = ({ amount, bookingId, onSuccess }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  })
  const api = useApi()

  const handleInputChange = (field, value) => {
    setCardDetails(prev => ({
      ...prev,
      [field]: value
    }))
    
    if (error) setError('')
  }

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []
    
    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    
    return parts.length ? parts.join(' ') : value
  }

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 3) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`
    }
    return value
  }

  const validateForm = () => {
    if (!cardDetails.number || cardDetails.number.replace(/\s/g, '').length !== 16) {
      return 'Please enter a valid 16-digit card number'
    }
    
    if (!cardDetails.expiry || !cardDetails.expiry.includes('/')) {
      return 'Please enter a valid expiry date (MM/YY)'
    }
    
    if (!cardDetails.cvv || cardDetails.cvv.length !== 3) {
      return 'Please enter a valid CVV'
    }
    
    if (!cardDetails.name) {
      return 'Please enter cardholder name'
    }
    
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      setLoading(false)
      return
    }

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simulate successful payment 90% of the time
      const isSuccess = Math.random() > 0.1
      
      if (isSuccess) {
        // Confirm payment with backend
        await api.post('/payments/confirm', {
          paymentMethod: 'card',
          bookingId,
          amount
        })
        onSuccess()
      } else {
        throw new Error('Payment failed. Please try again with a different card.')
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Payment failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="card">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <CreditCard className="h-5 w-5 mr-2" />
          Payment Details
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Card Number
            </label>
            <input
              type="text"
              value={cardDetails.number}
              onChange={(e) => handleInputChange('number', formatCardNumber(e.target.value))}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              className="input-field"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expiry Date
              </label>
              <input
                type="text"
                value={cardDetails.expiry}
                onChange={(e) => handleInputChange('expiry', formatExpiry(e.target.value))}
                placeholder="MM/YY"
                maxLength={5}
                className="input-field"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CVV
              </label>
              <input
                type="text"
                value={cardDetails.cvv}
                onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, '').slice(0, 3))}
                placeholder="123"
                maxLength={3}
                className="input-field"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cardholder Name
            </label>
            <input
              type="text"
              value={cardDetails.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="John Doe"
              className="input-field"
            />
          </div>
        </div>
        
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <XCircle className="h-5 w-5 text-red-600 mr-2" />
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
      </div>

      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600">Total Amount:</span>
          <span className="text-xl font-bold text-primary-600">
            ${amount.toFixed(2)}
          </span>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <>
              <LoadingSpinner size="small" />
              <span className="ml-2">Processing...</span>
            </>
          ) : (
            <>
              <CheckCircle className="h-5 w-5 mr-2" />
              <span>Pay Now</span>
            </>
          )}
        </button>
        
        <p className="text-xs text-gray-500 mt-4 text-center">
          This is a demo payment. No real transaction will be processed.
        </p>
      </div>
    </form>
  )
}

export default Payment