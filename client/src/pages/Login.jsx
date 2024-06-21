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

      if (!data.emailVerified) {
        navigate('/verify-your-email', { state: { email: formData.email } });
      } else if (!data.profileComplete) {
        // Navigate to the Complete Profile page if the profile is not complete
        navigate('/complete-profile', { state: { userId: data.userId } });
      } else {
        navigate('/');
      }
      
    } catch (error) {
      dispatch(signInFail(error));
    }
  };

  return (
    <div className='flex flex-col md:flex-row items-center justify-center p-4 gap-10 min-h-screen'>
      {/* Left Column for Logo or Image */}
      <div className='flex-1 flex justify-center items-center'>
        <Link to='/'>
          <img src={logo} alt="Logo" className="w-48 h-auto" />
        </Link>
      </div>

      {/* Right Column for Sign In Form */}
      <div className='flex flex-1 flex-col items-center justify-center'>
        <h1 className='text-3xl text-center font-semibold my-7'>Login</h1>
        <form onSubmit={handleSubmit} className='w-full max-w-md flex flex-col gap-4'>
          <input
            type='email'
            placeholder='Email'
            id='email'
            aria-label='Email'
            required
            className='bg-slate-100 p-3 rounded-lg'
            onChange={handleChange}
          />

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder='Password'
              id='password'
              aria-label='Password'
              required
              className='bg-slate-100 p-3 rounded-lg w-full'
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
          <div className="text-right w-full">
            <Link to='/forgot-password' className='text-sm text-blue-500 hover:underline'>
              Forgot Password?
            </Link>
          </div>

          <button
            type='submit'
            disabled={loading}
            className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-50'
          >
            {loading ? 'Loading...' : 'Login'}
          </button>

          <OAuth />
        </form>
        <div className='flex gap-2 mt-5'>
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
  );
}