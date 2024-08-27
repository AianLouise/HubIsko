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
import PageHeader from "./pageHeader";
import { IoIosNotifications } from "react-icons/io";
import { IoMenu } from "react-icons/io5";
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';


export default function ProviderHeaderSidebar({ sidebarOpen, toggleSidebar, currentPath }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const location = useLocation();

    const [showNotification, setShowNotification] = useState(false);
    const notificationRef = useRef(null);

    const toggleNotification = () => setShowNotification(!showNotification);

    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

    const handleClickOutside = (event) => {
        if (notificationRef.current && !notificationRef.current.contains(event.target)) {
            setShowNotification(false);
        }
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        toggleSidebar(false);

        if (location.pathname === '/provider-dashboard' || location.pathname === '/scholarships' || location.pathname === '/scholar-applications' || location.pathname === '/provider-forums') {
            toggleSidebar(true);
        }
    }, [location]);


    const ShowModal = () => {
        setShowNotification(false);
    };

    const navigate = useNavigate();

    const handleProfileClick = () => {
        navigate('/provider-profile');
    };

    const handleSettingsClick = () => {
        navigate('/provider-settings');
    };


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
                    <PageHeader path={currentPath} />
                </div>


                <div className="flex gap-4 items-center">
                    <div className="relative">
                        <button onClick={toggleNotification} className='relative w-full border rounded-full p-1 scale-150 hover:bg-slate-200 focus:bg-blue-600 group'>
                            <IoIosNotifications className='w-4 h-4 text-blue-600 group-focus:text-white' />
                        </button>
                        {showNotification && (
                            <div ref={notificationRef} className="absolute top-full right-0 mt-2 border bg-white text-gray-800 shadow-lg rounded-md p-4 w-96 z-50">
                                <div className='flex flex-col justify-start'>
                                    <span className='text-2xl text-left border-b py-2 w-full'>Notification Inbox</span>
                                    <div className='flex gap-2 pt-4'>
                                        <button className='border rounded-md p-2 px-4 hover:bg-slate-200 focus:bg-blue-600 focus:text-white'>All</button>
                                        <button className='border rounded-md p-2 px-4 hover:bg-slate-200 focus:bg-blue-600 focus:text-white'>Unread</button>
                                    </div>
                                    <div className='flex flex-col items-start p-2 mt-4'>
                                        <span>New Notifications</span>
                                        <div className='flex flex-col gap-2 mt-2'>
                                            <div className='flex flex-row text-sm w-full gap-4'>
                                                <div className='bg-blue-600 w-24 h-auto rounded-full'></div>
                                                <div className='flex flex-col text-left'>
                                                    <span className='font-bold'>HubIsko</span>
                                                    <span>Application for the scholarship has been approved ... see more</span>
                                                </div>
                                            </div>
                                            <button onClick={ShowModal} className='bg-blue-600 text-white rounded-md p-2 mt-4 font-medium hover:bg-blue-800 transition ease-in-out'>See All Notifications</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="relative" ref={dropdownRef}>
                        <img
                            src={currentUser.profilePicture || 'https://via.placeholder.com/40'}
                            alt="Profile"
                            className="h-9 w-9 rounded-full object-cover" // Add object-cover class
                            onClick={toggleDropdown}
                        />
                        {dropdownOpen && (
                            <div className="absolute mt-2 right-0 bg-white text-gray-800 shadow-lg rounded-md p-2 w-52 z-50 font-medium">
                                <ul>
                                    <li className="p-2 hover:bg-gray-100 cursor-pointer" onClick={handleProfileClick}>Profile</li>
                                    <li className="p-2 hover:bg-gray-100 cursor-pointer" onClick={handleSettingsClick}>Settings</li>
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
                                    Dashboard
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
                                <a href="/provider-settings" className="flex gap-2 items-center text-gray-800 hover:bg-blue-200 py-2 px-4 rounded-md">
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