import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';
import { faEye, faEyeSlash, faCheck, faTimes, faUser, faEnvelope, faLock, faCircleExclamation, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import NewLogo from '../assets/NewLogo.png';
import SmallLogo from '../assets/NewLogoClean.png';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const PasswordRequirements = ({ requirements }) => {
  return (
    <motion.ul
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="list-none p-0 my-2 space-y-1.5"
    >
      {requirements.map((req, index) => (
        <li
          key={index}
          className={`flex items-center gap-2 text-sm ${req.met ? 'text-green-600' : 'text-gray-500'}`}
        >
          <span className={`flex items-center justify-center w-5 h-5 rounded-full ${req.met ? 'bg-green-100' : 'bg-gray-100'}`}>
            <FontAwesomeIcon icon={req.met ? faCheck : faTimes} className={`text-xs ${req.met ? 'text-green-600' : 'text-gray-400'}`} />
          </span>
          {req.text}
        </li>
      ))}
    </motion.ul>
  );
};

const ConfirmPasswordRequirements = ({ requirements }) => {
  return (
    <motion.ul
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="list-none p-0 my-2 space-y-1.5"
    >
      {requirements.map((req, index) => (
        <li
          key={index}
          className={`flex items-center gap-2 text-sm ${req.met ? 'text-green-600' : 'text-gray-500'}`}
        >
          <span className={`flex items-center justify-center w-5 h-5 rounded-full ${req.met ? 'bg-green-100' : 'bg-gray-100'}`}>
            <FontAwesomeIcon icon={req.met ? faCheck : faTimes} className={`text-xs ${req.met ? 'text-green-600' : 'text-gray-400'}`} />
          </span>
          {req.text}
        </li>
      ))}
    </motion.ul>
  );
};

export default function SignUp() {
  //Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    role: 'applicant',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [passwordRequirements, setPasswordRequirements] = useState([
    { text: 'Password must be at least 6 characters', met: false },
    { text: 'Password must contain at least one uppercase letter', met: false },
    { text: 'Password must contain at least one special character', met: false },
  ]);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [confirmPasswordRequirements, setConfirmPasswordRequirements] = useState([
    { text: 'Passwords must match', met: false },
  ]);

  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'admin') {
        navigate('/admin-dashboard');
      } else if (currentUser.role === 'scholarship_provider') {
        if (!currentUser.emailVerified) {
          navigate('/verify-your-email', { state: { email: currentUser.email } });
        } else {
          navigate('/provider-dashboard');
        }
      } else if (currentUser.role === 'applicant') {
        if (!currentUser.emailVerified) {
          navigate('/verify-your-email', { state: { email: currentUser.email } });
        } else {
          navigate('/');
        }
      } else {
        navigate('/');
      }
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    if (errors.global) {
      const timer = setTimeout(() => {
        setErrors((prevErrors) => ({ ...prevErrors, global: '' }));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errors.global]);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    validateField(id, value);
  };

  const validateField = (field, value) => {
    let error = '';
    let updatedRequirements = [...passwordRequirements];

    switch (field) {
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Email is invalid';
        }
        break;
      case 'password':
        updatedRequirements[0].met = value.length >= 6;
        updatedRequirements[1].met = /[A-Z]/.test(value);
        updatedRequirements[2].met = /[!@#$%^&*(),.?":{}|<>]/.test(value);

        if (!updatedRequirements[0].met) {
          error = 'Password must be at least 6 characters';
        } else if (!updatedRequirements[1].met) {
          error = 'Password must contain at least one uppercase letter';
        } else if (!updatedRequirements[2].met) {
          error = 'Password must contain at least one special character';
        }
        break;
      case 'confirmPassword':
        if (value !== formData.password) {
          error = 'Passwords do not match';
        }
        break;
      default:
        if (!value) {
          error = 'This field is required';
        }
        break;
    }

    setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
    setPasswordRequirements(updatedRequirements);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return; setLoading(true);
    setErrors({});
    try {
      const res = await fetch(`${apiUrl}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!data.success) {
        setErrors({
          global: data.message.includes('E11000 duplicate key error collection') ?
            'Email already exists. Please use a different email.' :
            data.message || 'An error occurred'
        });
      } else {
        navigate('/resend-verification-email', { state: { email: formData.email } });
      }
    } catch (error) {
      setErrors({ global: error.message || 'An error occurred' });
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const { email, password, confirmPassword, firstName, lastName } = formData;
    let valid = true;
    if (!email || !password || !confirmPassword || !firstName || !lastName) {
      setErrors((prevErrors) => ({ ...prevErrors, global: 'Please fill in all fields' }));
      valid = false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrors((prevErrors) => ({ ...prevErrors, email: 'Email is invalid' }));
      valid = false;
    }
    if (password.length < 6) {
      setErrors((prevErrors) => ({ ...prevErrors, password: 'Password must be at least 6 characters' }));
      valid = false;
    } else if (!/[A-Z]/.test(password)) {
      setErrors((prevErrors) => ({ ...prevErrors, password: 'Password must contain at least one uppercase letter' }));
      valid = false;
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      setErrors((prevErrors) => ({ ...prevErrors, password: 'Password must contain at least one special character' }));
      valid = false;
    }
    if (password !== confirmPassword) {
      setErrors((prevErrors) => ({ ...prevErrors, confirmPassword: 'Passwords do not match' }));
      valid = false;
    }
    return valid;
  };
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-blue-50 to-white overflow-hidden">
      {/* Left Side - Illustration & Branding */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="md:w-1/2 flex flex-col items-center justify-center p-8 md:p-16 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-[30%] left-[-50%] w-[800px] h-[800px] bg-blue-600 rounded-full opacity-10"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-blue-400 rounded-full opacity-10"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <Link to="/" className="mb-8">
            <img
              src={NewLogo}
              alt="HubIsko Logo"
              className="w-64 h-auto filter drop-shadow-lg transition-transform duration-300 hover:scale-105"
            />
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold text-blue-800 mb-4 text-center">Join HubIsko Today</h1>
          <p className="text-lg text-gray-600 mb-6 text-center max-w-md">
            Start your scholarship journey and unlock educational opportunities
          </p>

          <div className="hidden md:block mt-6 p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg max-w-md">
            <h3 className="text-xl font-bold text-gray-800 mb-3">Get Started in Minutes</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <div className="mr-2 mt-0.5 text-blue-600">1.</div>
                <span className="text-gray-700">Create your student account</span>
              </li>
              <li className="flex items-start">
                <div className="mr-2 mt-0.5 text-blue-600">2.</div>
                <span className="text-gray-700">Complete your profile information</span>
              </li>
              <li className="flex items-start">
                <div className="mr-2 mt-0.5 text-blue-600">3.</div>
                <span className="text-gray-700">Browse available scholarship opportunities</span>
              </li>
              <li className="flex items-start">
                <div className="mr-2 mt-0.5 text-blue-600">4.</div>
                <span className="text-gray-700">Apply for scholarships that fit your profile</span>
              </li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Right Side - Registration Form */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="md:w-1/2 flex items-center justify-center p-4 md:p-12"
      >
        <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-2xl shadow-xl">
          <div className="flex items-center mb-6">
            <img src={SmallLogo} alt="HubIsko" className="w-10 h-10 mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">Create your account</h2>
          </div>

          <OAuth />

          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-300"></div>
            <div className="px-4 text-sm text-gray-500">or sign up with email</div>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FontAwesomeIcon icon={faUser} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="firstName"
                    placeholder="John"
                    required
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    onChange={handleChange}
                  />
                </div>
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">
                    <FontAwesomeIcon icon={faCircleExclamation} className="mr-1" /> {errors.firstName}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FontAwesomeIcon icon={faUser} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="lastName"
                    placeholder="Doe"
                    required
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    onChange={handleChange}
                  />
                </div>
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">
                    <FontAwesomeIcon icon={faCircleExclamation} className="mr-1" /> {errors.lastName}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={faEnvelope} className="text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  placeholder="your@email.com"
                  required
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  onChange={handleChange}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  <FontAwesomeIcon icon={faCircleExclamation} className="mr-1" /> {errors.email}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={faLock} className="text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  onChange={handleChange}
                  value={formData.password}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>

              {formData.password !== '' && <PasswordRequirements requirements={passwordRequirements} />}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={faLock} className="text-gray-400" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  onChange={handleChange}
                  value={formData.confirmPassword}
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                >
                  <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                </button>
              </div>

              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  <FontAwesomeIcon icon={faCircleExclamation} className="mr-1" /> {errors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </span>
              ) : "Register"}
            </button>

            <div className="text-center pt-4">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="font-medium text-blue-600 hover:text-blue-800 transition">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </motion.div>

      {/* Error Notification */}
      {errors.global && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-5 right-5 z-50 flex items-center p-4 bg-red-50 border-l-4 border-red-500 rounded-md shadow-lg"
        >
          <div className="flex-shrink-0 mr-3">
            <FontAwesomeIcon icon={faCircleExclamation} className="h-5 w-5 text-red-500" />
          </div>
          <div className="flex-1 text-sm text-red-700">
            {errors.global}
          </div>
          <button
            className="ml-3 text-red-400 hover:text-red-600"
            onClick={() => setErrors({ ...errors, global: '' })}
          >
            <FontAwesomeIcon icon={faXmark} className="h-4 w-4" />
          </button>
        </motion.div>
      )}
    </div>
  );
}