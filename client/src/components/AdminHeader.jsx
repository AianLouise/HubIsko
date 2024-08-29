import React, { useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { CgClose } from "react-icons/cg";
import { GoHomeFill } from "react-icons/go";
import { BsFillPersonFill } from "react-icons/bs";
import { MdForum } from "react-icons/md";
import { BsFlagFill } from "react-icons/bs";
import { useState, useEffect } from "react";
import { PiStudentFill } from "react-icons/pi";
import { BsBuildingFill } from "react-icons/bs";
import { BsInboxFill } from "react-icons/bs";
import { HiDocument } from "react-icons/hi2";
import { FaGoogleScholar } from "react-icons/fa6";
import { FaFileCircleQuestion } from "react-icons/fa6";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from '../redux/user/userSlice';

export default function AdminHeader({ sidebarOpen, toggleSidebar }) {
    const [isAccountsDropdownOpen, setIsAccountsDropdownOpen] = useState(false);
    const [isInboxDropdownOpen, setIsInboxDropdownOpen] = useState(false);
    const location = useLocation();

    const toggleAccountsDropdown = () => {
        setIsAccountsDropdownOpen(!isAccountsDropdownOpen);
    };

    const toggleInboxDropdown = () => {
        setIsInboxDropdownOpen(!isInboxDropdownOpen);
    };

    useEffect(() => {
        if (location.pathname.startsWith('/accounts')
            || location.pathname.startsWith('/students')
            || location.pathname.startsWith('/provider-accounts')
            || location.pathname.startsWith('/verification-details')
            || location.pathname.startsWith('/student-details')
            || location.pathname.startsWith('/provider-details')
        ) {
            setIsAccountsDropdownOpen(true);
        } else {
            setIsAccountsDropdownOpen(false);
        }

        if (location.pathname.startsWith('/inbox')
            || location.pathname.startsWith('/scholarship-program-applications')
            || location.pathname.startsWith('/scholarship-provider-applications')

        ) {
            setIsInboxDropdownOpen(true);
        } else {
            setIsInboxDropdownOpen(false);
        }
    }, [location.pathname]);

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

    // Breadcrumbs based on current location
    const generateBreadcrumb = () => {
        const pathnames = location.pathname.split('/').filter(x => x);

        const capitalizeWords = (str) => {
            return str.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
        };

        return (
            <>
                <h1 className="text-lg font-bold text-blue-500">Admin</h1>
                {pathnames.map((value, index) => {
                    const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
                    return (
                        <span key={index} className="text-lg font-bold text-blue-500">
                            /&nbsp;<Link to={routeTo}>{capitalizeWords(value)}</Link>
                        </span>
                    );
                })}
            </>
        );
    };

    return (
        <header className="bg-white text-gray-800 p-4 flex justify-between items-center shadow border-b w-full">
            <div className="max-w-8xl w-full mx-auto px-20 flex justify-between items-center">
                <div className='flex items-center gap-2'>
                    <button className="text-blue-600" onClick={toggleSidebar}>
                        <FontAwesomeIcon icon={faBars} className='w-4 h-4' />
                    </button>
                    {generateBreadcrumb()}
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
                <aside className="fixed font-medium inset-y-0 left-0 transform translate-x-0 w-64 transition-transform duration-200 ease-in-out bg-white shadow-lg p-4 z-50">


                    <div className="flex justify-between items-center pb-2 mb-4 border-b">

                        <div className="flex gap-2 items-center">
                            <div className="bg-blue-600 w-8 h-8 rounded-md"></div>
                            <span className="font-bold">HubIsko</span>
                        </div>

                        <button onClick={toggleSidebar} className="text-blue-600 border p-2 rounded-full hover:bg-slate-200">
                            <CgClose className="w-4 h-4" />
                        </button>

                    </div>

                    <nav>
                        <ul className="space-y-2">
                            <li>
                                <Link to={'/admin-dashboard'}
                                    className={`flex gap-2 items-center text-gray-800 py-2 px-4 rounded-md ${location.pathname.startsWith('/admin-home') ? 'bg-blue-600 text-white' : ''}`} >
                                    <GoHomeFill className={`w-5 h-5 text-blue-600 ${location.pathname.startsWith('/admin-home') ? 'text-white' : ''}`} />
                                    Dashboard
                                </Link>
                            </li>

                            <li>
                                <div className="">
                                    <Link to={'/accounts'}
                                        onClick={toggleAccountsDropdown}

                                        className={`flex gap-2 items-center text-gray-800 py-2 px-4 rounded-md ${location.pathname.startsWith('/accounts')
                                            || location.pathname.startsWith('/students')
                                            || location.pathname.startsWith('/provider-accounts')
                                            || location.pathname.startsWith('/verification-details')
                                            || location.pathname.startsWith('/student-details')
                                            || location.pathname.startsWith('/provider-details')
                                            ? 'bg-blue-600 text-white' : 'hover:bg-blue-200'}`}>
                                        <BsFillPersonFill className={`w-5 h-5 text-blue-600 
                                 ${location.pathname.startsWith('/accounts')
                                                || location.pathname.startsWith('/students')
                                                || location.pathname.startsWith('/provider-accounts')
                                                || location.pathname.startsWith('/verification-details')
                                                || location.pathname.startsWith('/student-details')
                                                || location.pathname.startsWith('/provider-details')
                                                ? 'text-white' : ''} `} />
                                        Accounts
                                    </Link>


                                    {isAccountsDropdownOpen && (
                                        <ul className="ml-4 my-2 space-y-2">
                                            <li>
                                                <Link to={'/accounts'} className={`flex text-sm gap-2 items-center text-gray-800 hover:bg-blue-200 py-2 px-4 rounded-md ${location.pathname === '/accounts' ? 'bg-blue-600 text-white' : 'hover:bg-blue-200'}`}>
                                                    <BsFillPersonFill className={`w-5 h-5 text-blue-600 ${location.pathname === '/accounts' ? ' text-white' : ''}`} />
                                                    Users
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to={'/students'} className={`flex text-sm gap-2 items-center text-gray-800 hover:bg-blue-200 py-2 px-4 rounded-md ${location.pathname === '/students' ? 'bg-blue-600 text-white' : 'hover:bg-blue-200'}`}>
                                                    <PiStudentFill className={`w-5 h-5 text-blue-600 ${location.pathname === '/students' ? ' text-white' : ''}`} />
                                                    Students
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to={'/scholarship-provider'} className={`flex text-sm gap-2 items-center text-gray-800 hover:bg-blue-200 py-2 px-4 rounded-md ${location.pathname === '/provider-accounts' ? 'bg-blue-600 text-white' : 'hover:bg-blue-200'}`}>
                                                    <BsBuildingFill className={`w-5 h-5 text-blue-600 ${location.pathname === '/provider-accounts' ? ' text-white' : ''}`} />
                                                    Scholarship Providers
                                                </Link>
                                            </li>
                                        </ul>

                                    )}


                                </div>
                            </li>

                            <li>
                                <div>
                                    <Link to={'/application-inbox'}
                                        onClick={toggleInboxDropdown}
                                        className={`flex gap-2 justify-between items-center text-gray-800 py-2 px-4 rounded-md ${location.pathname.startsWith('/inbox')
                                            || location.pathname.startsWith('/scholarship-program-applications')
                                            || location.pathname.startsWith('/scholarship-provider-applications')

                                            ? 'bg-blue-600 text-white' : 'hover:bg-blue-200'}`}>
                                        <div className="flex items-center gap-2">
                                            <BsInboxFill className={`w-5 h-5 text-blue-600 
                                            ${location.pathname.startsWith('/inbox')
                                                    || location.pathname.startsWith('/scholarship-program-applications')
                                                    || location.pathname.startsWith('/scholarship-provider-applications')

                                                    ? 'text-white' : ''} `} />
                                            Application Inbox
                                        </div>
                                        <div className={`bg-blue-600 rounded-full text-center flex items-center justify-center p-3 w-4 h-4 text-sm 
                                            ${location.pathname.startsWith('/inbox')
                                                || location.pathname.startsWith('/scholarship-program-applications')
                                                || location.pathname.startsWith('/scholarship-provider-applications')

                                                ? 'text-blue-600 bg-white' : 'text-white'} `}>1</div>
                                    </Link>


                                    {isInboxDropdownOpen && (


                                        <ul className="ml-4 my-2 space-y-2">
                                            <li>
                                                <Link to={'/scholarship-program-applications'} className={`flex text-sm gap-2 items-center text-gray-800 hover:bg-blue-200 py-2 px-4 rounded-md ${location.pathname === '/scholarship-program-applications' ? 'bg-blue-600 text-white' : 'hover:bg-blue-200'}`}>
                                                    <FaGoogleScholar className={`w-5 h-5 text-blue-600 ${location.pathname === '/scholarship-program-applications' ? ' text-white' : ''}`} />
                                                    Scholarship Program Applications
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to={'/scholarship-provider-applications'} className={`flex text-sm gap-2 items-center text-gray-800 hover:bg-blue-200 py-2 px-4 rounded-md ${location.pathname === '/scholarship-provider-applications' ? 'bg-blue-600 text-white' : 'hover:bg-blue-200'}`}>
                                                    <HiDocument className={`w-5 h-5 text-blue-600 ${location.pathname === '/scholarship-provider-applications' ? ' text-white' : ''}`} />
                                                    Scholarship Provider Applications
                                                </Link>
                                            </li>
                                            <li>
                                                <a href="#" className="flex text-sm gap-2 items-center text-gray-800 hover:bg-blue-200 py-2 px-4 rounded-md">
                                                    <FaFileCircleQuestion className="w-5 h-5 text-blue-600" />
                                                    Requests
                                                </a>
                                            </li>
                                        </ul>

                                    )}
                                </div>
                            </li>

                            <li>
                                <a href="#" className="flex gap-2 items-center text-gray-800 hover:bg-blue-200 py-2 px-4 rounded-md">
                                    <BsFlagFill className="w-5 h-5 text-blue-600" />
                                    Events
                                </a>
                            </li>

                            <li>
                                <a href="/admin-forums" className="flex gap-2 items-center text-gray-800 hover:bg-blue-200 py-2 px-4 rounded-md">
                                    <MdForum className="w-5 h-5 text-blue-600" /> {/* Updated icon */}
                                    Forums
                                </a>
                            </li>

                        </ul>
                    </nav>
                </aside>
            )}
        </header>
    );
}