import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FaHouse } from "react-icons/fa6";
import { FaGoogleScholar } from "react-icons/fa6";
import { IoDocuments } from "react-icons/io5";
import { FaCog } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { MdForum } from "react-icons/md";
import { Link } from 'react-router-dom';
import { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { signOut } from '../redux/user/userSlice';

export default function ProviderHeaderSidebar({ sidebarOpen, toggleSidebar }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.user.currentUser);

    const handleSignOut = async () => {
        try {
            await fetch('/api/auth/signout');
            dispatch(signOut());
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <header className="bg-white text-gray-800 p-4 flex justify-between items-center shadow border-b w-full">
            <div className="max-w-8xl w-full mx-auto px-20 flex justify-between items-center">
                <div className='flex items-center gap-2'>
                    <button className="text-blue-600" onClick={toggleSidebar}>
                        <FontAwesomeIcon icon={faBars} className='w-4 h-4' />
                    </button>
                    <h1 className="text-lg font-bold text-blue-500">Provider Dashboard</h1>
                    <h1 className="text-lg font-bold text-blue-500">/ Home</h1>
                </div>


                <div className="flex gap-2 items-center">
                    <span className="text-base">{currentUser.username}</span>
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

            {sidebarOpen && (
                <aside className="fixed font-medium inset-y-0 left-0 transform translate-x-0 w-64 transition-transform duration-300 ease-in-out bg-white shadow-lg p-4 z-50">                   
                   <div className='flex justify-between mb-8'>
                        <div className='flex items-center gap-2'>
                        <div className='bg-blue-600 w-6 h-6 rounded-md'></div>
                        <span className='font-bold text-blue-600 text-2xl'>HubIsko</span>
                        </div>
                        <button onClick={toggleSidebar} className='border border-blue-600 rounded-full items-center justify-center flex w-8 hover:bg-slate-200 transition hover:border-none'>
                        <IoClose className='w-4 h-4 text-blue-600' />
                        </button>
                    </div>
               
               
                    <nav className="">
                        <ul className="space-y-2">
                            <li>
                           <Link to={'/provider-dashboard'} className="flex items-center gap-2 text-gray-800 py-2.5 px-4 rounded transition duration-200 hover:bg-blue-500 hover:text-white group">
                            <FaHouse className="w-4 h-4 text-blue-600" />
                                Home
                            </Link>
                            </li>

                            <li>
                           <Link to={'/scholarships'} className="flex items-center gap-2 text-gray-800 py-2.5 px-4 rounded transition duration-200 hover:bg-blue-500 hover:text-white group">
                             <FaGoogleScholar className="w-4 h-4 text-blue-600" />
                                Scholarships
                          </Link>
                            </li>

                                 
                            <li>
                            <Link to={'/scholar-applications'} className="flex items-center gap-2 text-gray-800 py-2.5 px-4 rounded transition duration-200 hover:bg-blue-500 hover:text-white group">
                             <IoDocuments className="w-4 h-4 text-blue-600" />
                                Applications
                            </Link>
                            </li>

                            <li>
                            <Link to={'/provider-forums'} className="flex items-center gap-2 text-gray-800 py-2.5 px-4 rounded transition duration-200 hover:bg-blue-500 hover:text-white group">
                             <MdForum className="w-4 h-4 text-blue-600" />
                                Forums
                            </Link>
                            </li>

                            <li>
                            <a href="#" className="flex gap-2 items-center text-gray-800 hover:bg-blue-200 py-2 px-4 rounded-md">
                            <FaCog className="w-4 h-4 text-blue-600" />
                                Settings
                            </a>
                            </li>

                        </ul>
                    </nav>
                </aside>
            )}
        </header>
    );
}