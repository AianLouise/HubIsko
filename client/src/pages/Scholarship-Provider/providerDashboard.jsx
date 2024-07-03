import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// Uncomment and correct the import path for your signOut action
import { signOut } from '../../redux/user/userSlice.js';

export default function ProviderDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/signout');
      // Uncomment and use the dispatch if you're managing state with Redux
      dispatch(signOut());
      console.log('Signed out successfully');
      navigate('/'); // Use navigate to redirect to login page
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-5 font-sans">
      <div className="flex justify-between items-center">
        <h1 className="text-center text-gray-800 text-3xl">Provider Dashboard</h1>
        <button
          className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700 transition duration-300"
          onClick={handleSignOut}
        >
          Sign Out
        </button>
      </div>
      <div className="flex justify-around mt-10">
        <div className="bg-gray-200 p-5 rounded-lg">
          <h2 className="text-lg">Total Scholarships</h2>
          <p className="text-2xl font-bold">15</p>
        </div>
        <div className="bg-gray-200 p-5 rounded-lg">
          <h2 className="text-lg">Applications Received</h2>
          <p className="text-2xl font-bold">45</p>
        </div>
        <div className="bg-gray-200 p-5 rounded-lg">
          <h2 className="text-lg">Active Scholarships</h2>
          <p className="text-2xl font-bold">10</p>
        </div>
      </div>
      <div className="mt-10">
        <h2 className="text-lg">Recent Activity</h2>
        <ul className="list-disc pl-5">
          <li>New application received for Scholarship A</li>
          <li>Scholarship B has been updated</li>
          <li>New scholarship posted: Scholarship C</li>
        </ul>
      </div>
    </div>
  );
}