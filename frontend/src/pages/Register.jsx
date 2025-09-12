import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { validateEmail, validatePassword, validateName, validatePhone } from '../utils/validators'
import { toast } from 'react-toastify'

const Register = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    dateOfBirth: ''
  })
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setUserData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Validation
    if (!validateName(userData.name)) {
      toast.error('Please enter a valid name (at least 2 characters)')
      setLoading(false)
      return
    }

    if (!validateEmail(userData.email)) {
      toast.error('Please enter a valid email address')
      setLoading(false)
      return
    }

    if (!validatePassword(userData.password)) {
      toast.error('Password must be at least 6 characters long')
      setLoading(false)
      return
    }

    if (userData.password !== userData.confirmPassword) {
      toast.error('Passwords do not match')
      setLoading(false)
      return
    }

    if (userData.phone && !validatePhone(userData.phone)) {
      toast.error('Please enter a valid phone number')
      setLoading(false)
      return
    }

    const result = await register({
      name: userData.name,
      email: userData.email,
      password: userData.password,
      phone: userData.phone,
      dateOfBirth: userData.dateOfBirth
    })

    if (result.success) {
      toast.success('Registration successful!')
      navigate('/')
    } else {
      toast.error(result.message)
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={userData.name}
                onChange={handleChange}
                className="input-field mt-1"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={userData.email}
                onChange={handleChange}
                className="input-field mt-1"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number (Optional)
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={userData.phone}
                onChange={handleChange}
                className="input-field mt-1"
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
                Date of Birth (Optional)
              </label>
              <input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={userData.dateOfBirth}
                onChange={handleChange}
                className="input-field mt-1"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={userData.password}
                onChange={handleChange}
                className="input-field mt-1"
                placeholder="Enter your password"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={userData.confirmPassword}
                onChange={handleChange}
                className="input-field mt-1"
                placeholder="Confirm your password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register;