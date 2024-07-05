import React, { useEffect, useRef, useState } from 'react';
import Sidebar from '../../components/ProviderSidebar';
import { useDispatch, useSelector } from 'react-redux';
import { signOut } from '../../redux/user/userSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

export default function ProviderDashboard() {
  // State initialization
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Redux hooks
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);

  // Toggle functions
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  // Effect hook for handling clicks outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sign out handler
  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/signout');
      dispatch(signOut());
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={`flex flex-col min-h-screen`}>
      {/* Header component inline with conditional padding */}
      <header className={`bg-gray-50 text-gray-800 p-4 flex justify-between items-center shadow-lg ${sidebarOpen ? 'pl-64' : 'pl-4'}`}>
        <div className="container mx-auto flex justify-between items-center">
          <button onClick={toggleSidebar} className="text-blue-500 mr-auto ml-5">
            <FontAwesomeIcon icon={faBars} />
          </button>
          <h1 className="text-lg font-bold ml-4 text-blue-500">Provider Dashboard</h1>
          <div className="relative flex items-center ml-auto">
            <span className="text-base mr-4">{currentUser.username}</span>
            <div className="relative" ref={dropdownRef}>
              <img src={currentUser.profilePicture || 'https://via.placeholder.com/40'} alt="Profile" className="h-8 w-8 mr-2 rounded-full" onClick={toggleDropdown} />
              {dropdownOpen && (
                <div className="absolute mt-2 right-0 bg-white text-gray-800 shadow-lg rounded-md p-2 w-52 z-50">
                  <ul>
                    <li className="p-2 hover:bg-gray-100 cursor-pointer">Profile</li>
                    <li className="p-2 hover:bg-gray-100 cursor-pointer">Settings</li>
                    <li className="p-2 hover:bg-gray-100 cursor-pointer" onClick={handleSignOut}>Sign out</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar component now as a separate component */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main content with conditional margin */}
      <main className={`flex-grow p-10 transition-all duration-300 ease-in-out ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold text-slate-800">Welcome, Provider</h1>
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
    </div>
  );
}