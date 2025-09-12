import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Components
import Header from './components/Header'
import Footer from './components/Footer'

// Pages
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import SearchResults from './pages/SearchResults'
import AdminPanel from './pages/AdminPanel'
import Booking from './pages/Booking'
import PaymentSuccess from './pages/PaymentSuccess'

// Context
import { AuthProvider } from './context/AuthContext'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/booking/:flightId" element={<Booking />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
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