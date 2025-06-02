import React from 'react';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram, FaMapMarkerAlt, FaEnvelope } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import logo from '../assets/NewLogo.png';
import { MdPhone } from 'react-icons/md';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-blue-700 to-blue-600 text-white text-sm">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-8 sm:py-10">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Column 1: About */}
          <div className="flex flex-col items-center md:items-start col-span-2 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center mb-3">
              <img src={logo} alt="HubIsko Logo" className="w-10 h-10 mr-2 filter brightness-0 invert" />
              <h1 className="text-xl font-bold">HubIsko</h1>
            </div>
            <p className="text-xs sm:text-sm text-blue-100 mb-3 text-center md:text-left">
              Your dedicated platform for discovering and managing scholarship opportunities through innovative technology.
            </p>
            <div className="flex space-x-2 mt-1">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                className="bg-white text-blue-600 p-1.5 rounded-full hover:bg-blue-100 transition duration-300">
                <FaFacebookF className="text-xs" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                className="bg-white text-blue-600 p-1.5 rounded-full hover:bg-blue-100 transition duration-300">
                <FaTwitter className="text-xs" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                className="bg-white text-blue-600 p-1.5 rounded-full hover:bg-blue-100 transition duration-300">
                <FaLinkedinIn className="text-xs" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                className="bg-white text-blue-600 p-1.5 rounded-full hover:bg-blue-100 transition duration-300">
                <FaInstagram className="text-xs" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col items-start">
            <h2 className="text-base font-semibold mb-3 relative pb-2 before:content-[''] before:absolute before:w-8 before:h-0.5 before:bg-white before:bottom-0 before:left-0">
              Quick Links
            </h2>
            <ul className="space-y-1.5">
              <li>
                <Link to="/scholarship-listing" className="text-xs sm:text-sm text-blue-100 hover:text-white transition duration-300 flex items-center">
                  <span className="mr-1.5">›</span> Find Scholarships
                </Link>
              </li>
              <li>
                <Link to="/forums" className="text-xs sm:text-sm text-blue-100 hover:text-white transition duration-300 flex items-center">
                  <span className="mr-1.5">›</span> Community Forums
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-xs sm:text-sm text-blue-100 hover:text-white transition duration-300 flex items-center">
                  <span className="mr-1.5">›</span> About Us
                </Link>
              </li>
              <li>
                <Link to="/apply-as-provider" className="text-xs sm:text-sm text-blue-100 hover:text-white transition duration-300 flex items-center">
                  <span className="mr-1.5">›</span> Become a Provider
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div className="flex flex-col items-start">
            <h2 className="text-base font-semibold mb-3 relative pb-2 before:content-[''] before:absolute before:w-8 before:h-0.5 before:bg-white before:bottom-0 before:left-0">
              Support
            </h2>
            <ul className="space-y-1.5">
              <li>
                <Link to="/faq" className="text-xs sm:text-sm text-blue-100 hover:text-white transition duration-300 flex items-center">
                  <span className="mr-1.5">›</span> FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-xs sm:text-sm text-blue-100 hover:text-white transition duration-300 flex items-center">
                  <span className="mr-1.5">›</span> Contact Us
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-xs sm:text-sm text-blue-100 hover:text-white transition duration-300 flex items-center">
                  <span className="mr-1.5">›</span> Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-of-use" className="text-xs sm:text-sm text-blue-100 hover:text-white transition duration-300 flex items-center">
                  <span className="mr-1.5">›</span> Terms of Use
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div className="flex flex-col items-start col-span-2 sm:col-span-2 lg:col-span-1 mt-4 sm:mt-0">
            <h2 className="text-base font-semibold mb-3 relative pb-2 before:content-[''] before:absolute before:w-8 before:h-0.5 before:bg-white before:bottom-0 before:left-0">
              Contact Us
            </h2>
            <ul className="space-y-2">
              <li className="flex items-start">
                <FaMapMarkerAlt className="text-blue-200 mt-1 mr-2 flex-shrink-0 text-xs" />
                <span className="text-xs sm:text-sm text-blue-100">123 Scholarship Ave, Education District, Philippines</span>
              </li>              <li className="flex items-center">
                <MdPhone className="text-blue-200 mr-2 flex-shrink-0 text-xs" />
                <a href="tel:+6302812334567" className="text-xs sm:text-sm text-blue-100 hover:text-white transition duration-300">+63 (02) 8123-4567</a>
              </li><li className="flex items-center">
                <FaEnvelope className="text-blue-200 mr-2 flex-shrink-0 text-xs" />
                <a href="mailto:connectwithhubisko@gmail.com" className="text-xs sm:text-sm text-blue-100 hover:text-white transition duration-300">connectwithhubisko@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="bg-blue-800 py-3">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-center items-center">
          <p className="text-xs text-blue-200 mb-2 md:mb-0">
            &copy; {new Date().getFullYear()} HubIsko. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}