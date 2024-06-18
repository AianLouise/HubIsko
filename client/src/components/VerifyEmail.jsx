import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      const token = new URLSearchParams(location.search).get('token');
      try {
        const response = await fetch(`/api/auth/verify-email?token=${token}`);
        const data = await response.text();
        setMessage(data);
        if (response.ok) {
          setTimeout(() => {
            navigate('/sign-in');
          }, 3000);
        }
      } catch (error) {
        setMessage('Error verifying email');
      }
    };

    verifyEmail();
  }, [location, navigate]);

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Email Verification</h1>
      <p className="text-center">{message}</p>
    </div>
  );
};

export default VerifyEmail;
