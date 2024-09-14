import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';
import { faEye, faEyeSlash, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import NewLogo from '../assets/NewLogo.png';
import SmallLogo from '../assets/NewLogoClean.png';

const PasswordRequirements = ({ requirements }) => {
  return (
    <ul className="list-none p-0">
      {requirements.map((req, index) => (
        <li
          key={index}
          className={`flex items-center gap-2 text-sm ${req.met ? 'text-green-500' : 'text-red-500'} animate-fadeIn`}
        >
          <FontAwesomeIcon icon={req.met ? faCheck : faTimes} />
          {req.text}
        </li>
      ))}
    </ul>
  );
};

const ConfirmPasswordRequirements = ({ requirements }) => {
  return (
    <ul className="list-none p-0">
      {requirements.map((req, index) => (
        <li
          key={index}
          className={`flex items-center gap-2 text-sm ${req.met ? 'text-green-500' : 'text-red-500'} animate-fadeIn`}
        >
          <FontAwesomeIcon icon={req.met ? faCheck : faTimes} />
          {req.text}
        </li>
      ))}
    </ul>
  );
};

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
    if (!validateForm()) return;
    setLoading(true);
    setErrors({});
    try {
      const res = await fetch('/api/auth/signup', {
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
    const { username, email, password, confirmPassword, firstName, lastName } = formData;
    let valid = true;
    if (!username || !email || !password || !confirmPassword || !firstName || !lastName) {
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
    <div className='bg-[#f8f8fb] flex flex-col md:flex-row items-center text-left gap-10 min-h-screen'>

      {/* Left Column for Logo or Image */}
      <div className='w-1/2 hidden lg:flex justify-center items-center z-10 mx-auto'>
        <Link to="/">
          <img src={NewLogo} alt='HubIsko Logo' className='w-80 h-auto bg-white p-4 rounded-full transition-transform duration-300 ease-in-out transform hover:scale-110' />
        </Link>
      </div>

      <div className='absolute w-full h-full'>
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
              <div className='w-full'>
                <input type="text" id="firstName" placeholder="First Name" className='border bg-white p-3 rounded-lg focus:outline-blue-600 w-full' onChange={handleChange} required />
                {errors.firstName && <span className='text-red-500 text-sm'>{errors.firstName}</span>}
              </div>
              <div className='w-full'>
                <input type="text" id="lastName" placeholder="Last Name" className='border bg-white p-3 rounded-lg focus:outline-blue-600 w-full' onChange={handleChange} required />
                {errors.lastName && <span className='text-red-500 text-sm'>{errors.lastName}</span>}
              </div>
            </div>
            <div className='w-full'>
              <input type="email" id="email" placeholder="Email Address" className='border bg-white p-3 rounded-lg focus:outline-blue-600 w-full' onChange={handleChange} required />
              {errors.email && <span className='text-red-500 text-sm'>{errors.email}</span>}
            </div>
            <div className='w-full'>
              <input type="text" id="username" placeholder="Username" className='border bg-white p-3 rounded-lg focus:outline-blue-600 w-full' onChange={handleChange} required />
              {errors.username && <span className='text-red-500 text-sm'>{errors.username}</span>}
            </div>

            <div className="relative w-full">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="Password"
                className='border bg-white p-3 rounded-lg focus:outline-blue-600 w-full pr-10'
                value={formData.password}
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
              {formData.password !== '' && <PasswordRequirements requirements={passwordRequirements} />}

            <div className="relative w-full">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                placeholder="Confirm Password"
                className='border bg-white p-3 rounded-lg focus:outline-blue-600 w-full'
                value={formData.confirmPassword}
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
              {errors.confirmPassword && <span className='text-red-500 text-sm'>{errors.confirmPassword}</span>}

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
        {errors.global && (
          <div className="fixed top-5 right-5 bg-red-500 text-white px-4 py-2 rounded-md shadow-md opacity-95">
            {errors.global}
          </div>
        )}
      </div>
    </div>
  );
}