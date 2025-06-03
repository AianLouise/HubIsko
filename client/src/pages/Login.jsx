import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFail } from '../redux/user/userSlice';
import OAuth from '../components/OAuth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faEnvelope, faLock, faCircleExclamation, faXmark } from '@fortawesome/free-solid-svg-icons';
import NewLogo from '../assets/NewLogo.png';
import SmallLogo from '../assets/NewLogoClean.png';
import { motion } from 'framer-motion';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const [showPassword, setShowPassword] = useState(false);
  const [showErrorNotification, setShowErrorNotification] = useState(false);
  const [showSlowConnectionNotification, setShowSlowConnectionNotification] = useState(false);

  const dispatch = useDispatch();
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
        } else if (currentUser.applicantDetails.status === 'Verified') {
          navigate('/scholar-dashboard');
        } else if (!currentUser.applicantDetails.profileComplete) {
          navigate('/CoRH', { state: { userId: currentUser._id } });
        } else {
          navigate('/scholar-dashboard');
        }
      } else {
        navigate('/');
      }
    }
  }, [currentUser, navigate]);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1080); // Tailwind's lg breakpoint is 1024px
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Call initially to set the state based on the initial window size

    return () => window.removeEventListener('resize', handleResize);
  }, []);



  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());

      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
        setShowSlowConnectionNotification(true);
        setTimeout(() => setShowSlowConnectionNotification(false), 5000); // Hide after 5 seconds
      }, 10000); // 10 seconds timeout      

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const res = await fetch(`${apiUrl}/api/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFail(data));
        setShowErrorNotification(true);
        setTimeout(() => setShowErrorNotification(false), 5000); // Hide after 5 seconds
        return;
      }
      dispatch(signInSuccess(data));

      // Navigate based on user's role and verification status
      if (data.role === 'admin') {
        navigate('/admin-dashboard');
      } else if (data.role === 'scholarship_provider') {
        if (!data.emailVerified) {
          navigate('/verify-your-email', { state: { email: formData.email } });
        } else {
          navigate('/provider-dashboard');
        }
      } else if (data.role === 'applicant') {
        if (!data.emailVerified) {
          navigate('/verify-your-email', { state: { email: formData.email } });
        } else if (data.applicantDetails.status === 'Verified') {
          navigate('/scholar-dashboard');
        } else if (!data.applicantDetails.profileComplete) {
          navigate('/CoRH', { state: { userId: data._id } });
        } else {
          navigate('/scholar-dashboard');
        }
      } else {
        navigate('/');
      }
    } catch (error) {
      dispatch(signInFail(error));
      setShowErrorNotification(true);
      setTimeout(() => setShowErrorNotification(false), 5000); // Hide after 5 seconds
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-blue-50 to-white">
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

          <h1 className="text-3xl md:text-4xl font-bold text-blue-800 mb-4 text-center">Welcome to HubIsko</h1>
          <p className="text-lg text-gray-600 mb-6 text-center max-w-md">
            Your gateway to scholarship opportunities and academic success
          </p>

          <div className="hidden md:block mt-6 p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg max-w-md">
            <h3 className="text-xl font-bold text-gray-800 mb-3">Why Choose HubIsko?</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <div className="mr-2 mt-0.5 text-blue-600">•</div>
                <span className="text-gray-700">Access to thousands of scholarship opportunities</span>
              </li>
              <li className="flex items-start">
                <div className="mr-2 mt-0.5 text-blue-600">•</div>
                <span className="text-gray-700">Streamlined application process</span>
              </li>
              <li className="flex items-start">
                <div className="mr-2 mt-0.5 text-blue-600">•</div>
                <span className="text-gray-700">Connect with scholarship providers directly</span>
              </li>
              <li className="flex items-start">
                <div className="mr-2 mt-0.5 text-blue-600">•</div>
                <span className="text-gray-700">Track all your applications in one place</span>
              </li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Right Side - Login Form */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="md:w-1/2 flex items-center justify-center p-4 md:p-16"
      >
        <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-2xl shadow-xl">
          <div className="flex items-center mb-6">
            <img src={SmallLogo} alt="HubIsko" className="w-10 h-10 mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">Log in to your account</h2>
          </div>

          <OAuth />

          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-300"></div>
            <div className="px-4 text-sm text-gray-500">or continue with email</div>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
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
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs text-blue-600 hover:text-blue-800 transition">
                  Forgot password?
                </Link>
              </div>
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
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </span>
              ) : "Sign in"}
            </button>
          </form>

          <div className="text-center pt-4">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <button onClick={openModal} className="font-medium text-blue-600 hover:text-blue-800 transition">
                Register now
              </button>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Modal for Registration Options */}
      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="relative p-6 md:p-8">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FontAwesomeIcon icon={faXmark} className="h-5 w-5" />
              </button>

              <div className="text-center mb-6">
                <img src={SmallLogo} alt="HubIsko Logo" className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-800">Join HubIsko</h3>
                <p className="text-gray-600 mt-2">Choose how you want to register</p>
              </div>

              <div className="space-y-4">
                <Link
                  to="/register"
                  className="flex items-center justify-center w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow transition-all"
                >
                  Register as a Student
                </Link>

                <div className="relative">
                  <Link
                    to="/apply-as-provider"
                    className={`flex items-center justify-center w-full py-3 px-4 bg-blue-800 hover:bg-blue-900 text-white font-medium rounded-lg shadow transition-all ${isMobile ? "opacity-50 pointer-events-none" : ""
                      }`}
                    onClick={(e) => isMobile && e.preventDefault()}
                  >
                    Register as a Scholarship Provider
                  </Link>
                  {isMobile && (
                    <div className="mt-1 text-center text-sm text-red-500">
                      <FontAwesomeIcon icon={faCircleExclamation} className="mr-1" />
                      Not available on mobile devices
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 text-center text-sm text-gray-600">
                Already have an account?{" "}
                <button onClick={closeModal} className="font-medium text-blue-600 hover:text-blue-800 transition">
                  Sign in instead
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Notifications */}
      {showErrorNotification && (
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
            {error.message || 'Something went wrong!'}
          </div>
          <button
            className="ml-3 text-red-400 hover:text-red-600"
            onClick={() => setShowErrorNotification(false)}
          >
            <FontAwesomeIcon icon={faXmark} className="h-4 w-4" />
          </button>
        </motion.div>
      )}

      {showSlowConnectionNotification && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-5 right-5 z-50 flex items-center p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-md shadow-lg"
        >
          <div className="flex-shrink-0 mr-3">
            <FontAwesomeIcon icon={faCircleExclamation} className="h-5 w-5 text-yellow-500" />
          </div>
          <div className="flex-1 text-sm text-yellow-700">
            Slow internet connection. Please try again later.
          </div>
          <button
            className="ml-3 text-yellow-400 hover:text-yellow-600"
            onClick={() => setShowSlowConnectionNotification(false)}
          >
            <FontAwesomeIcon icon={faXmark} className="h-4 w-4" />
          </button>
        </motion.div>
      )}
    </div>
  );
}
