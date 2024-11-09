import React from 'react';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import logo from '../assets/NewLogo.png'; // Adjust the path to your logo file

export default function Footer() {
  return (
    <footer className="bg-blue-600 text-white py-8">
      <div className="container mx-auto px-4">
        {/* Footer Content */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center">
          {/* Left Section: Logo and Info */}
          <div className="text-center lg:text-left mb-6 lg:mb-0 flex items-center justify-center lg:justify-start">
            <img src={logo} alt="HubIsko Logo" className="w-10 h-10 mr-2 filter invert brightness-0" />
            <div>
              <h1 className="text-2xl font-bold mb-2">HubIsko</h1>
              <p>&copy; {new Date().getFullYear()} All rights reserved.</p>
            </div>
          </div>

          {/* Center Section: Links */}
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 text-center lg:text-left mb-6 lg:mb-0">
            <Link to="/privacy-policy" className="hover:text-blue-400">Privacy Policy</Link>
            <Link to="/terms-of-use" className="hover:text-blue-400">Terms of Use</Link>
            <Link to="/about" className="hover:text-blue-400">About Us</Link>
          </div>

          {/* Right Section: Social Media */}
          <div className="flex justify-center lg:justify-end gap-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
              <FaFacebookF className="text-xl" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
              <FaTwitter className="text-xl" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
              <FaLinkedinIn className="text-xl" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
              <FaInstagram className="text-xl" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}