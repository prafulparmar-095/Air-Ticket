import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">SkyBook</h3>
            <p className="text-gray-400">Book your flights with ease and enjoy the best prices for your journey.</p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white">Home</Link></li>
              <li><Link to="/search" className="text-gray-400 hover:text-white">Flights</Link></li>
              <li><a href="#" className="text-gray-400 hover:text-white">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Top Destinations</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">Delhi</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Mumbai</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Bangalore</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Chennai</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <address className="text-gray-400 not-italic">
              <p><i className="fas fa-map-marker-alt mr-2"></i>123 Sky Tower, Aviation Road</p>
              <p className="mt-2"><i className="fas fa-phone mr-2"></i>+91 98765 43210</p>
              <p className="mt-2"><i className="fas fa-envelope mr-2"></i>info@skybook.com</p>
            </address>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} SkyBook. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;