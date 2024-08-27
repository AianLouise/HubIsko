import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import NewLogo from '../assets/NewLogo.png';
import SmallLogo from '../assets/NewLogoClean.png';

export default function SignUp() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    role: 'applicant',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.message.includes('E11000 duplicate key error collection') ?
          'Email already exists. Please use a different email.' :
          data.message || 'An error occurred');
      } else {
        navigate('/resend-verification-email', { state: { email: formData.email } });
      }
    } catch (error) {
      setError(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const { username, email, password, confirmPassword, firstName, lastName } = formData;
    if (!username || !email || !password || !confirmPassword || !firstName || !lastName) {
      setError('Please fill in all fields');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Email is invalid');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  return (
    <div className='bg-[#f8f8fb] flex flex-col md:flex-row items-center text-left gap-10 min-h-screen'>

      {/* Left Column for Logo or Image */}
      <div className='w-1/2 hidden lg:flex justify-center items-center z-10 mx-auto'>
        <img src={NewLogo} alt='HubIsko Logo' className='w-80 h-auto bg-white p-4 rounded-full' />
      </div>

      <div className='absolute w-full h-full z-0'>
        <div className='bg-blue-600 rounded-full w-full h-full -translate-x-[1100px]'></div>
      </div>

      {/* Right Column for Sign Up Form */}
      <div className='lg:w-1/2 w-full flex items-center justify-center z-10'>
        <div className='bg-white w-full lg:w-[600px] lg:h-[850px] flex flex-col items-start justify-center shadow-md p-8 lg:p-20'>
          <div className='flex flex-col justify-center text-left gap-4 mb-2 w-full'>
            <div className='flex flex-row gap-2 items-center mb-4'>
              <img src={SmallLogo} alt='HubIsko Logo' className='w-12 h-auto' />
              <span className='font-bold text-lg'>HubIsko</span>
            </div>
            <h1 className='text-2xl lg:text-4xl font-bold'>Create your account</h1>
            <span className='text-sm lg:text-medium text-slate-500'>You can sign up with:</span>
            <OAuth />
            <div>
              <div className='border-b-2 mt-4'></div>
              <div className='text-center -translate-y-4'>
                <span className='bg-white p-1 px-4 text-slate-500 font-medium'> OR </span>
              </div>
            </div>
          </div>
          <form onSubmit={handleSubmit} className='w-full max-w-md flex flex-col gap-4'>
            <div className="flex gap-4 justify-between">
              <input type="text" id="firstName" placeholder="First Name" className='border bg-white p-3 rounded-lg focus:outline-blue-600' onChange={handleChange} required />
              <input type="text" id="lastName" placeholder="Last Name" className='border bg-white p-3 rounded-lg focus:outline-blue-600' onChange={handleChange} required />
            </div>
            <input type="email" id="email" placeholder="Email Address" className='border bg-white p-3 rounded-lg focus:outline-blue-600' onChange={handleChange} required />
            <input type="text" id="username" placeholder="Username" className='border bg-white p-3 rounded-lg focus:outline-blue-600' onChange={handleChange} required />
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="Password"
                className='border bg-white p-3 rounded-lg focus:outline-blue-600 w-full'
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className='absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-blue-500 hover:underline'
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>

            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                placeholder="Confirm Password"
                className='border bg-white p-3 rounded-lg focus:outline-blue-600 w-full'
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className='absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-blue-500 hover:underline'
              >
                <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
              </button>
            </div>
            <button disabled={loading} className='bg-blue-600 text-white p-3 rounded-lg hover:opacity-95 disabled:opacity-50'>
              {loading ? 'Loading...' : 'Register'}
            </button>
          </form>
          <div className='flex text-center justify-center items-center gap-2 mt-5 w-full z-10'>
            <p>Already have an account?</p>
            <Link to='/login'>
              <span className='text-blue-500 hover:underline'>Login</span>
            </Link>
          </div>
        </div>
        {error && (
          <div className="fixed top-5 right-5 bg-red-500 text-white px-4 py-2 rounded-md shadow-md opacity-95">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}