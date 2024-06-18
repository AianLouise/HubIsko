import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';

export default function SignUp() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false, // Existing state for terms checkbox
    fullName: '', // Added fullName to formData
    dateOfBirth: '', // Added dateOfBirth to formData
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.id]: value });
  };

  const validateForm = () => {
    const { username, email, password, confirmPassword, termsAccepted, fullName, dateOfBirth } = formData;
    if (!username || !email || !password || !confirmPassword || !fullName || !dateOfBirth) {
      setError('Please fill in all fields');
      return false;
    }
    // Enhanced email validation
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
    if (!termsAccepted) {
      setError('You must accept the terms and conditions');
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message || 'An error occurred');
        return;
      }
      navigate('/login');
    } catch (error) {
      setError(error.message || 'An error occurred');
      setLoading(false);
    }
  };

  return (
    <div className='flex flex-col md:flex-row items-center justify-center p-4 gap-10 min-h-screen'>
      {/* Left Column for Graphic or Welcome Message */}
      <div className='flex-1 flex justify-center items-center'>
        <Link to='/'>
          <img src='https://via.placeholder.com/150' alt='Welcome' className='w-48 h-auto' />
        </Link>
      </div>

      {/* Right Column for Sign Up Form */}
      <div className='flex flex-1 flex-col items-center justify-center'>
        <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
        <form onSubmit={handleSubmit} className='w-full max-w-md flex flex-col gap-4'>
          <input type="text" id="fullName" placeholder="Full Name" className='bg-slate-100 p-3 rounded-lg' onChange={handleChange} />
          <input type="date" id="dateOfBirth" placeholder="Date of Birth" className='bg-slate-100 p-3 rounded-lg' onChange={handleChange} />
          <input type="text" id="username" placeholder="Username" className='bg-slate-100 p-3 rounded-lg' onChange={handleChange} />
          <input type="email" id="email" placeholder="Email" className='bg-slate-100 p-3 rounded-lg' onChange={handleChange} />
          <input type="password" id="password" placeholder="Password" className='bg-slate-100 p-3 rounded-lg' onChange={handleChange} />
          <input type="password" id="confirmPassword" placeholder="Confirm Password" className='bg-slate-100 p-3 rounded-lg' onChange={handleChange} />
          <div className="flex items-center gap-2">
            <input type="checkbox" id="termsAccepted" onChange={handleChange} />
            <label htmlFor="termsAccepted">I agree to the Terms and Conditions</label>
          </div>
          <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
            {loading ? 'Loading...' : 'Sign Up'}
          </button>
          <OAuth />
        </form>
        <div className='flex gap-2 mt-5'>
          <p>Have an account?</p>
          <Link to='/login'>
            <span className='text-blue-500'>Sign In</span>
          </Link>
        </div>
        {error && <p className='text-red-700'>{error}</p>}
      </div>
    </div>
  );
}