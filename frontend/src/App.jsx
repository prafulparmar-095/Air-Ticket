import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { AuthProvider } from './context/AuthContext'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import AdminPanel from './pages/AdminPanel'
import Booking from './pages/Booking'
import PaymentSuccess from './pages/PaymentSuccess'
import ProtectedRoute from './components/ProtectedRoute'
import FlightSearch from './components/FlightSearch'
import SearchResults from './pages/SearchResults'
import FlightTicket from './components/FlightTicket'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/search" element={<FlightSearch />} />
              <Route path="/search-results" element={<SearchResults />} />
              <Route
                path="/booking/:flightId"
                element={
                  <ProtectedRoute>
                    <Booking />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ticket/:flightId"
                element={<FlightTicket />}
              />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminPanel />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
          <ToastContainer position="bottom-right" />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
