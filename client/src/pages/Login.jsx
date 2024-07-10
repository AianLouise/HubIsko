import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  signInStart,
  signInSuccess,
  signInFail,
} from '../redux/user/userSlice';
import OAuth from '../components/OAuth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { MdEmail } from "react-icons/md";
import logo from '../assets/logo.png';


export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

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
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFail(data));
        return;
      }
      dispatch(signInSuccess(data));

      // Navigate to the Provider Dashboard if the user's role is scholarship_provider
      if (data.role === 'scholarship_provider') {
        navigate('/provider-dashboard');
      } else if (!data.emailVerified) {
        navigate('/verify-your-email', { state: { email: formData.email } });
      } else if (!data.applicantDetails.profileComplete) {
        // Navigate to the Complete Profile page if the applicant's profile is not complete
        navigate('/CoRH', { state: { userId: data._id } });
      } else {
        navigate('/');
      }

    } catch (error) {
      dispatch(signInFail(error));
    }
  };

  return (
    <div className='bg-[#f8f8fb] flex flex-col md:flex-row items-center text-left p-4 gap-10 min-h-screen'>
      {/* Left Column for Logo or Image */}
      <div className='w-1/2 flex justify-center items-center'>
        <Link to='/'>
          <div className='bg-blue-600 w-56 h-56 rounded-lg'></div>
        </Link>
      </div>

      {/* Right Column for Sign In Form */}
      <div className='w-1/2 flex items-center justify-center'>
      <div className='flex flex-col items-start justify-center bg-white border rounded-md w-[600px]  h-[800px] shadow-md p-24'>
        <div className='flex flex-col justify-center text-left gap-4 mb-8'>
          <div className='flex flex-row gap-2 items-center mb-4'>
            <div className='bg-blue-600 w-10 h-10 rounded-md'></div>
            <span className='font-bold text-lg'>HubIsko</span>
          </div>
        <h1 className='text-4xl font-bold'>Log in to your Account</h1>
        <span className='text-medium text-slate-500'>Welcome back! Please choose the login method:</span>
        </div>
        <form onSubmit={handleSubmit} className='w-full max-w-md flex flex-col gap-4'>

        <OAuth />
        <div>
        <div className='border-b-2 mt-6'></div>
        <div className='text-center -translate-y-4'>
          <span className='bg-white p-1 px-4 text-slate-500 font-medium '>  or continue with email </span>
          </div>
        </div>
          <input
            type='email'
            placeholder='Email'
            id='email'
            aria-label='Email'
            required
            className='border bg-white p-3 rounded-lg focus:outline-blue-600'
            onChange={handleChange}
          />
  
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder='Password'
              id='password'
              aria-label='Password'
              required
              className='border bg-white p-3 rounded-lg w-full focus:outline-blue-600'
              onChange={handleChange}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className='absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-blue-500 hover:underline'
            >
              {showPassword ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />}
            </button>
          </div>

          {/* Forgot Password Link */}
          <div className="text-right w-full mb-2">
            <Link to='/forgot-password' className='text-sm text-blue-500 hover:underline'>
              Forgot Password?
            </Link>
          </div>

          <button
            type='submit'
            disabled={loading}
            className='bg-blue-600 text-white p-3 rounded-lg hover:opacity-95 disabled:opacity-50'
          >
            {loading ? 'Loading...' : 'Login'}
          </button>

        
        </form>
        <div className='flex w-full p-2  justify-center gap-2 mt-5'>
          <p>Don't Have an account?</p>
          <Link to='/register' className='text-blue-500 hover:underline'>
            Register
          </Link>
        </div>
        {error && (
          <p className='text-red-700 mt-5'>
            {error.message || 'Something went wrong!'}
          </p>
        )}
        </div>
      </div>
    </div>
  );
}