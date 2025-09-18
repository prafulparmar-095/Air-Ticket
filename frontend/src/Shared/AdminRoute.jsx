import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import LoadingSpinner from '../components/layout/LoadingSpinner'
const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext)

  if (loading) {
    return <LoadingSpinner />
  }

  return user && user.role === 'admin' ? children : <Navigate to="/login" />
}

export default AdminRoute