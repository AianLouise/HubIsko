import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';
import { useEffect } from 'react';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import logo from '../assets/logo.png';

export default function SignUp() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    dateOfBirth: '',
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
    const { type, checked, value, id } = e.target;
    setFormData({ ...formData, [id]: type === 'checkbox' ? checked : value });
  };

  const validateForm = () => {
    const { username, email, password, confirmPassword, fullName, dateOfBirth } = formData;
    if (!username || !email || !password || !confirmPassword || !fullName || !dateOfBirth) {
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
        navigate('/login');
      }
    } catch (error) {
      setError(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex flex-col md:flex-row items-center justify-center p-4 gap-10 min-h-screen'>
      {/* Left Column for Graphic or Welcome Message */}
      <div className='flex-1 flex justify-center items-center'>
        <Link to='/'>
          <img src={logo} alt="Logo" className="w-48 h-auto" />
        </Link>
      </div>

      {/* Right Column for Sign Up Form */}
      <div className='flex flex-1 flex-col items-center justify-center'>
        <h1 className='text-3xl text-center font-semibold my-7'>Register</h1>
        <form onSubmit={handleSubmit} className='w-full max-w-md flex flex-col gap-4'>
          <input type="text" id="fullName" placeholder="Full Name" className='bg-slate-100 p-3 rounded-lg' onChange={handleChange} />
          <input type="date" id="dateOfBirth" placeholder="Date of Birth" className='bg-slate-100 p-3 rounded-lg' onChange={handleChange} />
          <input type="text" id="username" placeholder="Username" className='bg-slate-100 p-3 rounded-lg' onChange={handleChange} />
          <input type="email" id="email" placeholder="Email" className='bg-slate-100 p-3 rounded-lg' onChange={handleChange} />
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              placeholder="Password"
              className='bg-slate-100 p-3 rounded-lg w-full'
              onChange={handleChange}
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
              className='bg-slate-100 p-3 rounded-lg w-full'
              onChange={handleChange}
            />
            <button
              type="button"
              onClick={toggleConfirmPasswordVisibility}
              className='absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-blue-500 hover:underline'
            >
              <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
            </button>
          </div>
          <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
            {loading ? 'Loading...' : 'Register'}
          </button>
          <OAuth />
        </form>
        <div className='flex gap-2 mt-5'>
          <p>Have an account?</p>
          <Link to='/login'>
            <span className='text-blue-500'>Login</span>
          </Link>
        </div>
        {error && <p className='text-red-700'>{error}</p>}
      </div>
    </div>
  );
}