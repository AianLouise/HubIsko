import React, { useEffect, useRef, useState } from 'react';
import Sidebar from '../../components/ProviderSidebar';
import { useDispatch, useSelector } from 'react-redux';
import { signOut } from '../../redux/user/userSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { BiDotsHorizontal } from 'react-icons/bi';
import { BiSolidRightArrow } from "react-icons/bi";


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
      navigate('/'); // Navigate to home page
    } catch (error) {
      console.log(error);
    }
  };

  const maxUsernameLength = 6;
  const truncatedUsername = currentUser.username.length > maxUsernameLength
    ? currentUser.username.slice(0, maxUsernameLength) + '...'
    : currentUser.username;

  return (
    <div className={`flex flex-col min-h-screen`}>
      {/* Header component inline with conditional padding */}
      <header className={`bg-white text-gray-800 p-4 flex justify-between items-center shadow border-b ${sidebarOpen ? 'pl-64' : 'pl-0'}`}>
        <div className="max-w-8xl w-full mx-auto px-24 flex justify-between items-center">

          <div className='flex items-center gap-2'>
            <button onClick={toggleSidebar} className="text-blue-600">
              <FontAwesomeIcon icon={faBars} className=' w-4 h-4 ' />
            </button>

            <h1 className="text-lg font-bold text-blue-500">Provider Dashboard</h1>
            <h1 className="text-lg font-bold text-blue-500">/ Home </h1>
          </div>

          <div className="flex gap-2 items-center">
            <span className="text-base">{truncatedUsername}</span>
            <div className="relative" ref={dropdownRef}>
              <img src={currentUser.profilePicture || 'https://via.placeholder.com/40'} alt="Profile" className="h-8 w-8 rounded-full" onClick={toggleDropdown} />
              {dropdownOpen && (
                <div className="absolute mt-2 right-0 bg-white text-gray-800 shadow-lg rounded-md p-2 w-52 z-50 font-medium">
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

      <main className={`flex-grow bg-[#f8f8fb] transition-all duration-300 ease-in-out ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>

        <div className='border-b mb-8'>
          <div className={'flex items-center mx-auto justify-between px-24'}>
            <div className='flex flex-col gap-2 w-1/2'>
              <h1 className='text-4xl font-bold text-gray-800'>Welcome provider!</h1>
              <p className='text-lg text-slate-500 font-medium'>Here is your dashboard!</p>
            </div>
            <div className='bg-blue-600 w-36 h-36 my-8 rounded-md'></div>
          </div>
        </div>

        <div className='max-w-8xl mx-auto px-24 gap-10 flex-col flex'>

          <div className='grid grid-cols-2 gap-10'>
            <div className="flex divide-x bg-white p-6 rounded-md shadow-md transition-all">

              <div className='flex flex-col w-1/2 items-center'>
                <h2 className="text-xl font-semibold text-slate-700">Applications Received</h2>
                <p className="text-8xl font-bold flex h-full justify-center items-center">45</p>
              </div>

              <div className='px-4 flex flex-col gap-2 w-full'>
                <span className='font-medium'>Received Applications</span>

                <button className='flex gap-2 justify-between border rounded-md w-full p-2 hover:bg-slate-200'>
                  <div className='flex gap-2 items-center'>
                    <div className='bg-blue-600 w-6 h-6 rounded-md'></div>
                    <span className='font-medium'>Name : <span className='text-blue-600 font-normal'>sent a new application</span></span>
                  </div>

                  <BiDotsHorizontal className='text-blue-600 w-6 h-6' />
                </button>





              </div>
            </div>

            <div className="flex flex-col gap-8">
              <button className="flex justify-between items-center bg-white p-6 rounded-md shadow-md transition-all hover:-translate-y-2 hover:bg-slate-200 group ease-in-out">
                <div>
                  <h2 className="text-xl font-semibold text-slate-700">Total Applications</h2>
                  <p className="text-2xl font-bold text-left">45</p>
                </div>

                <div className='hidden items-center text-blue-600 font-medium gap-2 group-hover:flex ease-in-out transition'>
                  <span>View</span>
                  <BiSolidRightArrow className=' w-6 h-6' />
                </div>

              </button>

              <button className="flex justify-between items-center bg-white p-6 rounded-md shadow-md transition-all hover:-translate-y-2 hover:bg-slate-200 group ease-in-out">
                <div>
                  <h2 className="text-xl font-semibold text-slate-700">Active Applications</h2>
                  <p className="text-2xl font-bold text-left">12</p>
                </div>

                <div className='hidden items-center text-blue-600 font-medium gap-2 group-hover:flex ease-in-out transition'>
                  <span>View</span>
                  <BiSolidRightArrow className=' w-6 h-6' />
                </div>

              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-md shadow-md transition-all">
            <h2 className="text-2xl font-bold text-slate-700 mb-4">Recent Activity</h2>
            <ul className="list-disc pl-5 text-slate-700">
              <li className="mb-2">New application received for Scholarship A</li>
              <li className="mb-2">Scholarship B has been updated</li>
              <li>New scholarship posted: Scholarship C</li>
            </ul>
          </div>
        </div>


      </main>
    </div>
  );
}