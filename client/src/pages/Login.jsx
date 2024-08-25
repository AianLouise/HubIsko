import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFail } from '../redux/user/userSlice';
import OAuth from '../components/OAuth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import NewLogo from '../assets/NewLogo.png';
import SmallLogo from '../assets/NewLogoClean.png';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const [showPassword, setShowPassword] = useState(false);
  const [showErrorNotification, setShowErrorNotification] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);


  //   useEffect(() => {
  //     if (currentUser) {
  //         if (currentUser.role === 'admin') {
  //             navigate('/admin-home');
  //         } else if (currentUser.role === 'scholarship_provider') {
  //             if (!currentUser.emailVerified) {
  //                 navigate('/verify-your-email', { state: { email: currentUser.email } });
  //             } else {
  //                 navigate('/provider-dashboard');
  //             }
  //         } else if (currentUser.role === 'applicant') {
  //             if (!currentUser.emailVerified) {
  //                 navigate('/verify-your-email', { state: { email: currentUser.email } });
  //             } else if (!currentUser.applicantDetails.profileComplete) {
  //                 navigate('/CoRH', { state: { userId: currentUser._id } });
  //             } else {
  //                 navigate('/');
  //             }
  //         } else {
  //             navigate('/');
  //         }
  //     }
  // }, [currentUser, navigate]);

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
        setShowErrorNotification(true);
        setTimeout(() => setShowErrorNotification(false), 5000); // Hide after 5 seconds
        return;
      }
      dispatch(signInSuccess(data));

      // Navigate based on user's role and verification status
      if (data.role === 'admin') {
        navigate('/admin-home');
      } else if (data.role === 'scholarship_provider') {
        if (!data.emailVerified) {
          navigate('/verify-your-email', { state: { email: formData.email } });
        } else {
          navigate('/provider-dashboard');
        }
      } else if (data.role === 'applicant') {
        if (!data.emailVerified) {
          navigate('/verify-your-email', { state: { email: formData.email } });
        } else if (!data.applicantDetails.profileComplete) {
          navigate('/CoRH', { state: { userId: data._id } });
        } else {
          navigate('/');
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
    <div className='bg-[#f8f8fb] flex flex-col md:flex-row items-center text-left gap-10 min-h-screen'>

      {/* Left Column for Logo or Image */}
      <div className='w-1/2 flex justify-center items-center z-10 mx-auto'>
        <img src={NewLogo} alt='HubIsko Logo' className='w-80 h-auto bg-white p-4 rounded-full' />
      </div>

      <div className='absolute w-full h-full'>
        <div className=' bg-blue-600 rounded-full w-full h-full -translate-x-[1100px]'></div>
      </div>

        {/* <img src='../assets/logo.png' alt='HubIsko Logo' className='w-56 h-56' /> */}
   

      {/* Right Column for Sign In Form */}
      <div className='w-1/2 flex items-center justify-center'>
        <div className='flex flex-col items-start justify-center bg-white border rounded-md w-[600px] shadow-md px-24 py-16 relative'>
          <div className='flex flex-col justify-center text-left gap-4 mb-8'>
            <div className='flex flex-row gap-2 items-center mb-4'>
              <img src={SmallLogo} alt='HubIsko Logo' className='w-12 h-auto' />
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
                <span className='bg-white p-1 px-4 text-slate-500 font-medium'>or continue with email </span>
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
          <div className='flex w-full p-2 justify-center gap-2 mt-5'>
            <p>Don't Have an account?</p>
            <button onClick={openModal} className='text-blue-500 hover:underline'>
              Register
            </button>
          </div>

          {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md relative">
                <button onClick={closeModal} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
                <p className="mb-6 text-center">Choose your registration type:</p>
                <div className="flex flex-col gap-4">
                  <Link to="/register" className="bg-blue-500 text-white py-2 px-4 rounded text-center hover:bg-blue-600 transition duration-200">
                    Register as Student
                  </Link>
                  <Link to="/apply-as-provider" className="bg-blue-800 text-white py-2 px-4 rounded text-center hover:bg-blue-900 transition duration-200">
                    Register as Scholarship Provider
                  </Link>
                </div>
              </div>
            </div>
          )}

          {showErrorNotification && (
            <div className="fixed top-5 right-5 bg-red-500 text-white px-4 py-2 rounded-md shadow-md opacity-95">
              {error.message || 'Something went wrong!'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
