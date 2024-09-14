import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'admin') {
        navigate('/admin-home');
      } else if (currentUser.role === 'scholarship_provider') {
        if (!currentUser.emailVerified) {
          navigate('/verify-your-email', { state: { email: currentUser.email } });
        } else {
          navigate('/provider-dashboard');
        }
      } else if (currentUser.role === 'applicant') {
        if (!currentUser.emailVerified) {
          navigate('/verify-your-email', { state: { email: currentUser.email } });
        } else {
          navigate('/');
        }
      } else {
        navigate('/');
      }
    }
  }, [currentUser, navigate]);

  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // New state to handle message type

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('Processing...');
    setMessageType('info'); // Default message type

    try {
      const response = await fetch('/api/user/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json(); // Parse JSON response

      if (response.ok) {
        setMessage(data.message); // Use server's response message
        setMessageType('success');
      } else {
        setMessage(data.message); // Use server's error message
        setMessageType('error');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again later.');
      setMessageType('error');
    }
  };

  // Function to determine message styling based on messageType
  const messageStyles = () => {
    switch (messageType) {
      case 'success':
        return "text-center text-sm text-green-600";
      case 'error':
        return "text-center text-sm text-red-600";
      default:
        return "text-center text-sm text-indigo-600";
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-3 rounded-xl bg-white shadow-lg">
        <h2 className="text-xl font-semibold text-center text-gray-800">Forgot Password</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
              <label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address:</label>
              <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email address"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Send Reset Link
          </button>
        </form>
        {message && <p className={messageStyles()}>{message}</p>}
      </div>
    </div>
  );
}
