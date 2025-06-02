import React from 'react';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram, FaMapMarkerAlt, FaEnvelope } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import logo from '../assets/NewLogo.png';
import { MdPhone } from 'react-icons/md';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-blue-700 to-blue-600 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: About */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center mb-4">
              <img src={logo} alt="HubIsko Logo" className="w-12 h-12 mr-2 filter brightness-0 invert" />
              <h1 className="text-2xl font-bold">HubIsko</h1>
            </div>
            <p className="text-sm text-blue-100 mb-4 text-center md:text-left">
              Your dedicated platform for discovering and managing scholarship opportunities through innovative technology.
            </p>
            <div className="flex space-x-3 mt-2">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" 
                className="bg-white text-blue-600 p-2 rounded-full hover:bg-blue-100 transition duration-300">
                <FaFacebookF className="text-sm" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" 
                className="bg-white text-blue-600 p-2 rounded-full hover:bg-blue-100 transition duration-300">
                <FaTwitter className="text-sm" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" 
                className="bg-white text-blue-600 p-2 rounded-full hover:bg-blue-100 transition duration-300">
                <FaLinkedinIn className="text-sm" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" 
                className="bg-white text-blue-600 p-2 rounded-full hover:bg-blue-100 transition duration-300">
                <FaInstagram className="text-sm" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col items-center md:items-start">
            <h2 className="text-lg font-semibold mb-4 relative pb-2 before:content-[''] before:absolute before:w-10 before:h-1 before:bg-white before:bottom-0 before:left-0 before:right-0 md:before:mx-0 before:mx-auto">
              Quick Links
            </h2>
            <ul className="space-y-2">
              <li>
                <Link to="/scholarship-listing" className="text-blue-100 hover:text-white transition duration-300 flex items-center">
                  <span className="mr-2">›</span> Find Scholarships
                </Link>
              </li>
              <li>
                <Link to="/forums" className="text-blue-100 hover:text-white transition duration-300 flex items-center">
                  <span className="mr-2">›</span> Community Forums
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-blue-100 hover:text-white transition duration-300 flex items-center">
                  <span className="mr-2">›</span> About Us
                </Link>
              </li>
              <li>
                <Link to="/apply-as-provider" className="text-blue-100 hover:text-white transition duration-300 flex items-center">
                  <span className="mr-2">›</span> Become a Provider
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div className="flex flex-col items-center md:items-start">
            <h2 className="text-lg font-semibold mb-4 relative pb-2 before:content-[''] before:absolute before:w-10 before:h-1 before:bg-white before:bottom-0 before:left-0 before:right-0 md:before:mx-0 before:mx-auto">
              Support
            </h2>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="text-blue-100 hover:text-white transition duration-300 flex items-center">
                  <span className="mr-2">›</span> FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-blue-100 hover:text-white transition duration-300 flex items-center">
                  <span className="mr-2">›</span> Contact Us
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-blue-100 hover:text-white transition duration-300 flex items-center">
                  <span className="mr-2">›</span> Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-of-use" className="text-blue-100 hover:text-white transition duration-300 flex items-center">
                  <span className="mr-2">›</span> Terms of Use
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div className="flex flex-col items-center md:items-start">
            <h2 className="text-lg font-semibold mb-4 relative pb-2 before:content-[''] before:absolute before:w-10 before:h-1 before:bg-white before:bottom-0 before:left-0 before:right-0 md:before:mx-0 before:mx-auto">
              Contact Us
            </h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <FaMapMarkerAlt className="text-blue-200 mt-1 mr-3 flex-shrink-0" />
                <span className="text-blue-100">123 Scholarship Ave, Education District, Philippines</span>
              </li>
              <li className="flex items-center">
                <MdPhone className="text-blue-200 mr-3 flex-shrink-0" />
                <a href="tel:+639123456789" className="text-blue-100 hover:text-white transition duration-300">+63 912 345 6789</a>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="text-blue-200 mr-3 flex-shrink-0" />
                <a href="mailto:info@hubisko.edu.ph" className="text-blue-100 hover:text-white transition duration-300">info@hubisko.edu.ph</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="bg-blue-800 py-4">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm">
          <p className="text-blue-200 mb-2 md:mb-0">
            &copy; {new Date().getFullYear()} HubIsko. All rights reserved.
          </p>
          <p className="text-blue-200">
            Designed with <span className="text-red-400">♥</span> for scholarship seekers
          </p>
        </div>
      </div>
    </footer>
  );
}