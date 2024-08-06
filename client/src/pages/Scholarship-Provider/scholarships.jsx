import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import Sidebar from '../../components/ProviderSidebar';
import { useDispatch, useSelector } from 'react-redux';
import { signOut } from '../../redux/user/userSlice';
import { useEffect, useRef, useState } from 'react';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';


export default function Scholarships() {
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
    <div className={`flex flex-col min-h-screen font-medium`}>
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

      <main className={`flex-grow bg-[#f8f8fb] transition-all duration-300 ease-in-out ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>

        <div className='border-b mb-8'>
          <div className={'flex gap-2 items-center mx-auto px-24 h-36'}>

            <h1 className='text-4xl font-bold text-gray-800'>Scholarship Program(s): </h1>
            <span className='text-blue-600 text-4xl my-8 rounded-md font-bold'> 50</span>

          </div>
        </div>

        <div className='max-w-8xl mx-auto px-24 gap-10 flex-col flex'>


          <div className='flex justify-between'>

            <Link to='/post-scholarship'>
              <button className='bg-blue-600 text-white px-8 py-4 shadow rounded-md flex items-center gap-2 hover:bg-blue-800'>
                <FontAwesomeIcon icon={faPlus} className='w-4 h-4' />
                <span>Post a Scholarship</span>
              </button>
            </Link>

            <input
              type="text"
              placeholder='Search scholarships...'
              className='border-2 rounded-md px-4 py-2 w-96 focus:border-white focus:outline-blue-600'
            />
          </div>


          <div className='grid grid-cols-3 gap-8'>

            <div className='bg-white rounded-md shadow'>
              <div className='bg-blue-600 w-full h-36 rounded-t-md'></div>
              <div className='p-4'>
                <div className='flex justify-between items-center'>
                  <h1 className='text-xl font-bold text-gray-800'>Scholarship Name</h1>
                  <span className='text-xl'>0/50</span>
                </div>
                <span className='text-slate-600'>Php 50,000 ~ 80,000</span>
                <p className='text-gray-500'>Description of the scholarship</p>
                <div className='flex justify-between items-center mt-4'>
                  <button className='text-blue-600 font-bold border hover:bg-slate-200 px-4 rounded-md'>View Details</button>
                  <span className='text-gray-500'>Deadline: 12/12/2021</span>
                </div>
              </div>
            </div>

            <div className='bg-white rounded-md shadow'>
              <div className='bg-blue-600 w-full h-36 rounded-t-md'></div>
              <div className='p-4'>
                <div className='flex justify-between items-center'>
                  <h1 className='text-xl font-bold text-gray-800'>Scholarship Name</h1>
                  <span className='text-xl text-red-600'>50/50</span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-slate-600'>Php 50,000 ~ 80,000</span>
                  {/* IF 50/50 */}
                  <span className='text-red-600'>Slots full</span>
                </div>
                <p className='text-gray-500'>Description of the scholarship</p>
                <div className='flex justify-between items-center mt-4'>
                  <button className='text-blue-600 font-bold border hover:bg-slate-200 px-4 rounded-md'>View Details</button>
                  <span className='text-gray-500'>Deadline: 12/12/2021</span>
                </div>
              </div>
            </div>

            <div className='bg-white rounded-md shadow'>
              <div className='bg-blue-600 w-full h-36 rounded-t-md'></div>
              <div className='p-4'>
                <div className='flex justify-between items-center'>
                  <h1 className='text-xl font-bold text-gray-800'>Scholarship Name</h1>
                  <span className='text-lg text-yellow-500'>Pending for Approval</span>
                </div>
                <span className='text-slate-600'>Php 50,000 ~ 80,000</span>
                <p className='text-gray-500'>Description of the scholarship</p>
                <div className='flex justify-between items-center mt-4'>
                  <button className='text-blue-600 font-bold border hover:bg-slate-200 px-4 rounded-md'>View Details</button>
                  <span className='text-gray-500'>Deadline: 12/12/2021</span>
                </div>
              </div>
            </div>

          </div>


        </div>
      </main>
    </div>
  );
}
