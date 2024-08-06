import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import Sidebar from '../../components/ProviderSidebar';
import { useDispatch, useSelector } from 'react-redux';
import { signOut } from '../../redux/user/userSlice';
import { useEffect, useRef, useState } from 'react';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

export default function PreviewProfile() {

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

      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <main className={`flex-grow bg-[#f8f8fb] transition-all duration-300 ease-in-out ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>


        <div className='border-b mb-8 py-8'>
          <div className='flex flex-row items-center mx-auto max-w-8xl gap-10 px-24'>
            <div className='bg-blue-600 w-36 h-36 my-8 rounded-md'></div>
            <div className='flex flex-col items-start gap-2 w-1/2 '>
              <span className='text-xl font-medium text-gray-600'>Student</span>
              <span className='text-4xl font-bold text-gray-800'>Username</span>
              <span className='text-xl font-medium text-gray-600'>Followers: N</span>
            </div>
          </div>
        </div>

        <div className='flex flex-col gap-4 max-w-8xl px-24 mx-auto'>
          <div className='flex flex-row gap-4 justify-between font-semibold mb-6'>
            <button className='border text-center rounded-xl w-1/2 px-16 py-4 bg-slate-200 hover:bg-slate-300 focus:bg-white focus:shadow-md'>Profile</button>
            <button className='border text-center rounded-xl w-1/2 px-16 py-4 bg-slate-200 hover:bg-slate-300 focus:bg-white focus:shadow-md'>Posts</button>
            <button className='border text-center rounded-xl w-1/2 px-16 py-4 bg-slate-200 hover:bg-slate-300 focus:bg-white focus:shadow-md'>Comments</button>
          </div>

          <div className='border-2 rounded-md p-10 flex justify-center items-center bg-white h-96 mb-20'>
            <span>Container</span>
          </div>
        </div>


      </main>

    </div>

  );
}