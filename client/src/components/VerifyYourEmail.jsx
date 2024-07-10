import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';

const RESEND_DELAY = 30; // seconds

export default function VerifyYourEmail() {
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
    setIsButtonDisabled(true);
    localStorage.setItem('lastResendTime', Date.now());

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
          Your email <strong>{emailAddress}</strong> is not verified. Please check your inbox for the verification email or click the button below to resend the verification email.
        </p>
        <button
          onClick={handleResendEmail}
          className={`w-full p-2 rounded text-white ${isButtonDisabled ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
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
