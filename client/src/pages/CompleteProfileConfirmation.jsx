import React from 'react';
import { Link } from 'react-router-dom';

const ConfirmationPage = () => {

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">Registration Successful!</h1>
        <p className="text-gray-700 mb-4">You have successfully registered.</p>
        <p className="text-gray-700 mb-8">Click below to go to the home page.</p>
        <Link to="/" className="bg-blue-500 text-white py-2 px-4 rounded-md font-semibold hover:bg-blue-600">Go to Home Page</Link>
      </div>
    </div>
  );
};

export default ConfirmationPage;
