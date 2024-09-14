import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCheckCircle } from "react-icons/fa";
import { useSelector } from 'react-redux';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'admin') {
        navigate('/admin-dashboard');
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

  const location = useLocation();
  const [message, setMessage] = useState('');
  const [redirectMessage, setRedirectMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      const token = new URLSearchParams(location.search).get('token');
      try {
        const response = await fetch(`/api/auth/verify-email?token=${token}`);
        const data = await response.text();
        setMessage(data);
        if (response.ok) {
          setRedirectMessage('Redirecting to login page...');
          setTimeout(() => {
            navigate('/login');
          }, 5000);
        }
      } catch (error) {
        setMessage('Error verifying email');
      }
    };

    verifyEmail();
  }, [location, navigate]);

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f8fb] no-scrollbar justify-center items-center">
      <div className="text-center px-8 py-10">
        <h1 className="text-5xl font-bold text-slate-800 mb-8">
          Email Verification
        </h1>
        <div className="mt-8 flex justify-center">
          <FaCheckCircle className="text-4xl text-blue-600" />
        </div>
        <p className="text-lg text-slate-700 pt-6">{message}</p>
        {redirectMessage && <p className="text-md text-slate-600 pt-4">{redirectMessage}</p>}
      </div>
    </div>
  );
};

export default VerifyEmail;
