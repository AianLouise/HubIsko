import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import Sidebar from '../../components/ProviderSidebar';
import { useDispatch, useSelector } from 'react-redux';
import { signOut } from '../../redux/user/userSlice';
import { useEffect, useRef, useState } from 'react';
import { BiFilter } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';


export default function ScholarApplications() {
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

  const maxUsernameLength = 6;
  const truncatedUsername = currentUser.username.length > maxUsernameLength 
  ? currentUser.username.slice(0, maxUsernameLength) + '...' 
  : currentUser.username;

  const [recentPosts, setRecentPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecentPosts();
  }, []);

  const fetchRecentPosts = async () => {
    try {
      const response = await fetch('/api/forums/posts');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setRecentPosts(data);
    } catch (error) {
      console.error('Error fetching recent posts:', error);
    }
  };

  // Function to handle clicking on a post
  const handlePostClick = (postId) => {
    // Navigate to post details page (assuming route '/post/:postId' is defined)
    navigate(`/forums/post/${postId}`);
  };

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
                
        <div className='border-b mb-8'>
          <div className={'flex items-center mx-auto justify-between px-24'}>
            <div className='flex flex-col gap-2 w-1/2'>
              <h1 className='text-4xl font-bold text-gray-800'>Application Page</h1>
              <p className='text-lg text-slate-500 font-medium'>This will serve as an inbox for applications</p>
            </div>
            <div className='bg-blue-600 w-36 h-36 my-8 rounded-md'></div>
          </div>
        </div>

        <div className='max-w-8xl mx-auto px-24 gap-10 flex-col flex'>

        <div className='flex items-center gap-4'>
            <input 
            type="text" 
            className='border border-gray-300 rounded-md p-2 pr-8'
            placeholder='Search for applications...'
            />

            <button className='bg-blue-600 px-4 py-2 rounded-md flex gap-2 text-white'>
            <BiFilter className='w-6 h-6' />
            <span>Filter</span>
            </button>
        </div>

        {/* TABLE */}

        <div className='overflow-x-auto rounded-md bg-white shadow'>
            <table className='w-full border-2 border-gray-200'>
            <thead>
                <tr className='bg-slate-100'>
                <th className='border border-gray-200'>#No</th>
                <th className='border border-gray-200 p-2'>Name</th>
                <th className='border border-gray-200 p-2'>Email</th>
                <th className='border border-gray-200 p-2'>Date</th>
                <th className='border border-gray-200 p-2'>Status</th>
                <th className='border border-gray-200 p-2'>Actions</th>
                </tr>
            </thead>
            <tbody>
            
            </tbody>
            </table>
        
        </div>
        
        </div>
        </main>
        </div>

    );

}