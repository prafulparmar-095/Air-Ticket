// frontend/src/components/Header.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11.43a1 1 0 01.725-.962l5-1.429a1 1 0 001.17-1.409l-7-14z"></path>
            </svg>
            <span className="text-xl font-bold text-blue-600">SkyBooker</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">Home</Link>
            
            {user ? (
              <>
                <Link to="/profile" className="text-gray-700 hover:text-blue-600 font-medium">My Bookings</Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-gray-700 hover:text-blue-600 font-medium">Admin</Link>
                )}
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700">Hello, {user.name}</span>
                  <button 
                    onClick={handleLogout}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-700 hover:text-blue-600 font-medium">Login</Link>
                <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">Sign Up</Link>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <button 
            className="md:hidden focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">Home</Link>
              
              {user ? (
                <>
                  <Link to="/profile" className="text-gray-700 hover:text-blue-600 font-medium">My Bookings</Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" className="text-gray-700 hover:text-blue-600 font-medium">Admin</Link>
                  )}
                  <div className="pt-4 border-t border-gray-200">
                    <span className="block text-gray-700 mb-2">Hello, {user.name}</span>
                    <button 
                      onClick={handleLogout}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg w-full"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col space-y-4 pt-4 border-t border-gray-200">
                  <Link to="/login" className="text-gray-700 hover:text-blue-600 font-medium text-center">Login</Link>
                  <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-center">Sign Up</Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;