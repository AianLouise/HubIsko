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
    <div className="flex flex-col min-h-screen">
      <header className="bg-blue-600 text-white p-4 text-2xl font-bold text-center">
        Provider Dashboard
      </header>
      <main className="flex-grow bg-[#f8f8fb] p-10">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold text-slate-800">Welcome, Provider</h1>
          <button
            className="bg-red-500 text-white py-2 px-4 rounded-full hover:bg-red-700 transition duration-300"
            onClick={handleSignOut}
          >
            Sign Out
          </button>
        </div>
        <div className="grid grid-cols-3 gap-8 mb-10">
          <div className="bg-white p-6 rounded-md shadow-md transition-all hover:-translate-y-2">
            <h2 className="text-xl font-semibold text-slate-700 mb-2">Total Scholarships</h2>
            <p className="text-2xl font-bold">15</p>
          </div>
          <div className="bg-white p-6 rounded-md shadow-md transition-all hover:-translate-y-2">
            <h2 className="text-xl font-semibold text-slate-700 mb-2">Applications Received</h2>
            <p className="text-2xl font-bold">45</p>
          </div>
          <div className="bg-white p-6 rounded-md shadow-md transition-all hover:-translate-y-2">
            <h2 className="text-xl font-semibold text-slate-700 mb-2">Active Scholarships</h2>
            <p className="text-2xl font-bold">10</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-md shadow-md transition-all hover:-translate-y-2">
          <h2 className="text-2xl font-bold text-slate-700 mb-4">Recent Activity</h2>
          <ul className="list-disc pl-5 text-slate-700">
            <li className="mb-2">New application received for Scholarship A</li>
            <li className="mb-2">Scholarship B has been updated</li>
            <li>New scholarship posted: Scholarship C</li>
          </ul>
        </div>
      </main>
      <footer className="bg-slate-800 text-white p-4 text-center">
        &copy; 2024 Scholarship Management System
      </footer>
    </div>
  );
}
