import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';
import { useEffect } from 'react';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function SignUp() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    role: 'applicant',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [logoUrl, setLogoUrl] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchLogoUrl = async () => {
      const storage = getStorage();
      const logoRef = ref(storage, '/System Files/logo.jpg'); // Update the path to your logo
      try {
        const url = await getDownloadURL(logoRef);
        setLogoUrl(url);
      } catch (error) {
        console.error('Failed to fetch logo:', error);
        // Handle any errors or set a default logo if needed
      }
    };

    fetchLogoUrl();
  }, []);

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
    const { username, email, password, confirmPassword, firstName, lastName, dateOfBirth } = formData;
    if (!username || !email || !password || !confirmPassword || !firstName || !lastName || !dateOfBirth) {
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
    <div className='bg-[#f8f8fb] flex flex-col md:flex-row items-center justify-center p-4 gap-10 min-h-screen'>
      {/* Left Column for Graphic or Welcome Message */}
      <div className='flex-1 flex justify-center items-center'>
        <Link to='/'>
          <div className='bg-blue-600 w-56 h-56 rounded-md'></div>
        </Link>
      </div>

      {/* Right Column for Sign Up Form */}
      <div className='flex flex-1 justify-center'>
        <div className='bg-white w-[600px] h-[850px] flex flex-col items-start justify-center shadow-md p-20'>
          <div className='flex flex-col justify-center text-left gap-4 mb-2 w-full'>
            <div className='flex flex-row gap-2 items-center mb-4'>
              <div className='bg-blue-600 w-10 h-10 rounded-md'></div>
              <span className='font-bold text-lg'>HubIsko</span>
            </div>
            <h1 className='text-4xl font-bold'>Create your account</h1>
            <span className='text-medium text-slate-500'>You can sign up with:</span>
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
            <input 
              type="date" 
              id="dateOfBirth" 
              className='border bg-white p-3 rounded-lg focus:outline-blue-600' 
              onChange={handleChange} 
              required 
              max={new Date().toISOString().split('T')[0]} // Set max attribute to today's date
            />
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
          <div className='flex text-center justify-center items-center gap-2 mt-5 w-full'>
            <p>Already have an account?</p>
            <Link to='/login'>
              <span className='text-blue-500'>Login</span>
            </Link>
          </div>
        </div>
        {error && <p className='text-red-700'>{error}</p>}
      </div>
    </div>
  );
}
