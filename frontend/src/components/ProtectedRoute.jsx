import { useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login')
    } else if (!loading && adminOnly && user.role !== 'admin') {
      navigate('/')
    }
  }, [user, loading, navigate, adminOnly])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!user || (adminOnly && user.role !== 'admin')) {
    return null
  }

  return children
}

export default ProtectedRoute;