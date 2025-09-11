import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsProfileDropdownOpen(false);
  };

  return (
    <header className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-white text-blue-600 p-2 rounded-lg">
              <i className="fas fa-plane text-xl"></i>
            </div>
            <span className="text-xl font-bold">SkyBook</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-blue-200 transition">Home</Link>
            <Link to="/search" className="hover:text-blue-200 transition">Flights</Link>
            {user && user.role === 'admin' && (
              <Link to="/admin" className="hover:text-blue-200 transition">Admin</Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <i className="fas fa-user"></i>
                  </div>
                  <span>{user.name}</span>
                  <i className={`fas fa-chevron-down text-xs transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`}></i>
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 text-gray-800 z-50">
                    <Link 
                      to="/profile" 
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <i className="fas fa-user mr-2"></i>Profile
                    </Link>
                    <button 
                      onClick={handleLogout} 
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      <i className="fas fa-sign-out-alt mr-2"></i>Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link to="/login" className="px-4 py-2 rounded hover:bg-blue-500 transition">
                  <i className="fas fa-sign-in-alt mr-2"></i>Login
                </Link>
                <Link to="/register" className="px-4 py-2 bg-white text-blue-600 rounded hover:bg-gray-100 transition">
                  <i className="fas fa-user-plus mr-2"></i>Register
                </Link>
              </div>
            )}

            <button 
              className="md:hidden text-xl"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-2 border-t border-blue-500">
            <div className="flex flex-col space-y-3">
              <Link to="/" className="px-2 py-1 hover:bg-blue-500 rounded" onClick={() => setIsMenuOpen(false)}>
                <i className="fas fa-home mr-2"></i>Home
              </Link>
              <Link to="/search" className="px-2 py-1 hover:bg-blue-500 rounded" onClick={() => setIsMenuOpen(false)}>
                <i className="fas fa-plane mr-2"></i>Flights
              </Link>
              {user && user.role === 'admin' && (
                <Link to="/admin" className="px-2 py-1 hover:bg-blue-500 rounded" onClick={() => setIsMenuOpen(false)}>
                  <i className="fas fa-cog mr-2"></i>Admin
                </Link>
              )}
              {user ? (
                <>
                  <Link to="/profile" className="px-2 py-1 hover:bg-blue-500 rounded" onClick={() => setIsMenuOpen(false)}>
                    <i className="fas fa-user mr-2"></i>Profile
                  </Link>
                  <button onClick={handleLogout} className="text-left px-2 py-1 hover:bg-blue-500 rounded">
                    <i className="fas fa-sign-out-alt mr-2"></i>Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="px-2 py-1 hover:bg-blue-500 rounded" onClick={() => setIsMenuOpen(false)}>
                    <i className="fas fa-sign-in-alt mr-2"></i>Login
                  </Link>
                  <Link to="/register" className="px-2 py-1 hover:bg-blue-500 rounded" onClick={() => setIsMenuOpen(false)}>
                    <i className="fas fa-user-plus mr-2"></i>Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;