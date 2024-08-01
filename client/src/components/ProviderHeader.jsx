import React, { useState } from 'react';
import Sidebar from './ProviderSidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { signOut } from '../redux/user/userSlice';
import { useEffect, useRef } from 'react';

export default function ProviderHeader() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);


    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.user.currentUser);

    useEffect(() => {
        const handleClickOutside = (event) => {
          if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setDropdownOpen(false);
          }
        };
    
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
      }, []);

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
  
   

    return (
        <>
            <header className={`bg-white text-gray-800 p-4 flex justify-between items-center shadow border-b ${sidebarOpen ? 'pl-64' : 'pl-0'}`}>
            <div className="max-w-8xl w-full mx-auto px-24 flex justify-between items-center">
                <div className='flex items-center gap-2'>
                    <button onClick={toggleSidebar} className="text-blue-600">
                        <FontAwesomeIcon icon={faBars} className=' w-4 h-4 ' />
                    </button>

                    <h1 className="text-lg font-bold text-blue-500">Provider Dashboard</h1>
                    <h1 className="text-lg font-bold text-blue-500">/ Name </h1>
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
        </>
    );
}