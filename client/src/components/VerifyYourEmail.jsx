import React, { useState } from 'react';

export default function VerifyYourEmail() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleResendEmail = async () => {
    try {
      const response = await fetch('/api/auth/resend-verification-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      setMessage(error.message || 'An error occurred');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Verify Your Email</h2>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        <button
          onClick={handleResendEmail}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Resend Verification Email
        </button>
        {message && <p className="mt-4 text-center text-red-500">{message}</p>}
      </div>
    </div>
  );
}
