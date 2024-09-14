import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, Link, useNavigate } from 'react-router-dom';

const RESEND_DELAY = 30; // seconds

export default function VerifyYourEmail() {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const userId = currentUser?._id;
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`/api/auth/user/${userId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setUserDetails(data);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    if (userId) {
      fetchUserDetails();
    }
  }, [userId]);

   useEffect(() => {
    if (userDetails) {
      if (userDetails.role === 'admin') {
        navigate('/admin-dashboard');
      } else if (userDetails.role === 'scholarship_provider') {
        if (!userDetails.emailVerified) {
          navigate('/verify-your-email', { state: { email: userDetails.email } });
        } else {
          navigate('/provider-dashboard');
        }
      } else if (userDetails.role === 'applicant') {
        if (!userDetails.emailVerified) {
          navigate('/verify-your-email', { state: { email: userDetails.email } });
        } else if (!userDetails.applicantDetails.profileComplete) {
          navigate('/CoRH', { state: { userId: userDetails._id } });
        } else {
          navigate('/');
        }
      } else {
        navigate('/');
      }
    }
  }, [userDetails, navigate]);

  const [message, setMessage] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [timer, setTimer] = useState(RESEND_DELAY);
  const location = useLocation();
  const emailAddress = location.state?.email;

  useEffect(() => {
    const lastClickedTime = localStorage.getItem('lastResendTime');
    if (lastClickedTime) {
      const timeElapsed = Math.floor((Date.now() - lastClickedTime) / 1000);
      if (timeElapsed < RESEND_DELAY) {
        setIsButtonDisabled(true);
        setTimer(RESEND_DELAY - timeElapsed);
      } else {
        localStorage.removeItem('lastResendTime');
      }
    }
  }, []);

  useEffect(() => {
    let interval;
    if (isButtonDisabled) {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(interval);
            setIsButtonDisabled(false);
            setTimer(RESEND_DELAY);
            localStorage.removeItem('lastResendTime');
          }
          return prevTimer - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isButtonDisabled]);

  const handleResendEmail = async () => {
    try {
      const response = await fetch('/api/auth/resend-verification-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: emailAddress }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        // Check if the error is because the user is already verified
        if (errorData.message === 'User already verified') {
          // Set a specific message for this case
          setMessage('Your email is already verified. Please log in.');
        } else {
          // Handle other errors
          throw new Error(errorData.message || 'Network response was not ok');
        }
      } else {
        const data = await response.json();
        setMessage(data.message);
        setIsButtonDisabled(true);
        localStorage.setItem('lastResendTime', Date.now());
      }
    } catch (error) {
      setMessage(error.message || 'An error occurred');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Verify Your Email</h2>
        <p className="mb-4">
          Your email <strong>{emailAddress}</strong> is not verified. Please check your inbox for the verification email.
        </p>
        <div className='border-t w-full mt-4'></div>
        <div className='flex items-center justify-center'>
        <p className="text-center -translate-y-3 bg-white px-4 text-slate-500">Didn't receive the email?</p>
        </div>
        <button
          onClick={handleResendEmail}
          className={`w-full p-2 rounded text-white ${isButtonDisabled ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600 font-medium transition ease-in-out'}`}
          disabled={isButtonDisabled}
        >
          {isButtonDisabled ? `Resend available in ${timer}s` : 'Resend Verification Email'}
        </button>
        {message && (
          <div className="mt-4 text-center">
            <p className="text-green-500">{message}</p>
            {message === 'Your email is already verified. Please log in.' && (
              <Link to="/login" className="text-blue-500 hover:underline">
                Go to Login
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
