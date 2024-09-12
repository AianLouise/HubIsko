import React from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import useTokenExpiry from '../hooks/useTokenExpiry'; // Adjust the import path

const ConfirmationPage = () => {
  useTokenExpiry();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-400 to-blue-700">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center border-2 border-gray-200">
        <div className="flex justify-center mb-4">
          <FaCheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold text-slate-800 mb-4 underline underline-blue-600">Validation Successful!</h1>
        <p className="text-gray-700 mb-8">You have successfully completed the student validation process! <br/> Please proceed to the home page.</p>
        <Link to="/" className="bg-blue-600 text-white py-2 px-8 rounded-md font-semibold hover:bg-blue-800 transition duration-200">Go to Home Page</Link>
      </div>
    </div>
  );
};

export default ConfirmationPage;