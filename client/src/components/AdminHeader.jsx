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
import { FaBullhorn, FaGoogleScholar, FaGraduationCap } from "react-icons/fa6";
import { FaFileCircleQuestion } from "react-icons/fa6";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from '../redux/user/userSlice';
import Logo from '../assets/NewLogoClean.png';
import { FaCog, FaFileAlt, FaHistory, FaUniversity } from 'react-icons/fa'; // Import the new icon


export default function AdminHeader({ sidebarOpen, toggleSidebar }) {
    const [isAccountsDropdownOpen, setIsAccountsDropdownOpen] = useState(false);
    const [isInboxDropdownOpen, setIsInboxDropdownOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const toggleAccountsDropdown = () => {
        setIsAccountsDropdownOpen(!isAccountsDropdownOpen);
    };

    const toggleInboxDropdown = () => {
        setIsInboxDropdownOpen(!isInboxDropdownOpen);
    };

    useEffect(() => {
        if (location.pathname.startsWith('/accounts')
            || location.pathname.startsWith('/students')
            || location.pathname.startsWith('/student-applications')
            || location.pathname.startsWith('/provider-accounts')
            || location.pathname.startsWith('/verification-details')
            || location.pathname.startsWith('/student-details')
            || location.pathname.startsWith('/provider-details')
            || location.pathname.startsWith('/scholarship-provider')
        ) {
            setIsAccountsDropdownOpen(true);
        } else {
            setIsAccountsDropdownOpen(false);
        }

        if (location.pathname.startsWith('/scholarship-programs')
            || location.pathname.startsWith('/scholarship-program-applications')
            || location.pathname.startsWith('/scholarship-announcements')
            || location.pathname.startsWith('/scholarship-applications')

        ) {
            setIsInboxDropdownOpen(true);
        } else {
            setIsInboxDropdownOpen(false);
        }
    }, [location.pathname]);

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => {
        setDropdownOpen(prevState => !prevState);
    };

    const handleClickOutside = (event) => {
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

    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.user.currentUser);
    const handleSignOut = async () => {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const userId = currentUser ? currentUser._id : null;
        if (!userId) {
            console.log('User ID is not available1');
            return;
        }

        try {
            await fetch(`${apiUrl}/api/auth/signout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId }),
            });
            dispatch(signOut());
            navigate('/');
        } catch (error) {
            console.log(error);
        }
    };

    const [pendingVerificationCount, setPendingVerificationCount] = useState(0);
    const [pendingApprovalCount, setPendingApprovalCount] = useState(0);
    const [totalPendingCount, setTotalPendingCount] = useState(0);
    useEffect(() => {
        const fetchPendingCounts = async () => {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
            try {
                const response = await fetch(`${apiUrl}/api/adminApp/users/pending-verification`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setPendingVerificationCount(data.userCount);
                setPendingApprovalCount(data.scholarshipProgramCount);
                setTotalPendingCount(data.userCount + data.scholarshipProgramCount);
            } catch (error) {
                // console.error('Error fetching pending counts:', error);
            }
        };

        fetchPendingCounts();
    }, []);    // Breadcrumbs based on current location
    const generateBreadcrumb = () => {
        const pathnames = location.pathname.split('/').filter(x => x);

        const capitalizeWords = (str) => {
            return str.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
        };

        return (
            <nav className="flex items-center space-x-2 text-sm">
                <Link to="/admin-dashboard" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200">
                    <GoHomeFill className="w-4 h-4" />
                    <span>Admin</span>
                </Link>
                {pathnames.map((value, index) => {
                    const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
                    const isLast = index === pathnames.length - 1;

                    return (
                        <div key={index} className="flex items-center space-x-2">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                            {isLast ? (
                                <span className="text-gray-900 font-medium">{capitalizeWords(value)}</span>
                            ) : (
                                <Link
                                    to={routeTo}
                                    className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                                >
                                    {capitalizeWords(value)}
                                </Link>
                            )}
                        </div>
                    );
                })}
            </nav>
        );
    }; return (
        <header className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-40">
            <div className="max-w-full w-full mx-auto px-6 lg:px-8 py-4">
                <div className="flex justify-between items-center">
                    {/* Left Section - Menu Button and Breadcrumbs */}
                    <div className="flex items-center gap-4">
                        <button
                            className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onClick={toggleSidebar}
                        >
                            <FontAwesomeIcon icon={faBars} className="w-5 h-5" />
                        </button>
                        <div className="flex items-center gap-1">
                            {generateBreadcrumb()}
                        </div>
                    </div>

                    {/* Right Section - Admin Profile */}
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-blue-50 rounded-lg border border-blue-100">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm font-medium text-blue-800">System Online</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-semibold text-gray-900">{currentUser?.adminDetails?.firstName || 'Admin'}</p>
                                <p className="text-xs text-gray-500">Administrator</p>
                            </div>

                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={toggleDropdown}
                                    className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <div className="relative">
                                        <img
                                            src={currentUser?.profilePicture || 'https://via.placeholder.com/40'}
                                            alt="Admin Profile"
                                            className="w-10 h-10 rounded-lg object-cover border-2 border-blue-200"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                        />
                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold border-2 border-blue-200" style={{ display: 'none' }}>
                                            {currentUser?.adminDetails?.firstName?.charAt(0) || 'A'}
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                                    </div>
                                </button>

                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-50 py-2">
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <p className="text-sm font-semibold text-gray-900">{currentUser?.adminDetails?.firstName || 'Admin'}</p>
                                            <p className="text-xs text-gray-500">{currentUser?.email}</p>
                                        </div>
                                        <div className="py-2">
                                            <Link to="/admin-settings" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors duration-200">
                                                <FaCog className="w-4 h-4 text-blue-600" />
                                                Settings
                                            </Link>
                                            <button
                                                onClick={handleSignOut}
                                                className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 w-full text-left"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                </svg>
                                                Sign Out
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>            {sidebarOpen && (
                <div className="fixed inset-0 z-50">
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={toggleSidebar}></div>
                    <aside className="fixed inset-y-0 left-0 flex flex-col w-72 bg-white shadow-2xl border-r border-gray-200">
                        {/* Sidebar Header */}
                        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-600 to-blue-700">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md">
                                    <img src={Logo} alt="HubIsko Logo" className="w-6 h-6" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-white">HubIsko</h1>
                                    <p className="text-blue-100 text-xs">Admin Portal</p>
                                </div>
                            </div>
                            <button
                                onClick={toggleSidebar}
                                className="p-2 rounded-lg text-white hover:bg-white/20 transition-colors duration-200"
                            >
                                <CgClose className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Sidebar Navigation */}
                        <nav className="flex-1 px-4 py-6 overflow-y-auto">
                            <ul className="space-y-2">
                                {/* Dashboard */}
                                <li>
                                    <Link
                                        to="/admin-dashboard"
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${location.pathname.startsWith('/admin-dashboard')
                                                ? 'bg-blue-600 text-white shadow-md'
                                                : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                                            }`}
                                    >
                                        <GoHomeFill className={`w-5 h-5 ${location.pathname.startsWith('/admin-dashboard') ? 'text-white' : 'text-blue-600'
                                            }`} />
                                        <span className="font-medium">Dashboard</span>
                                    </Link>
                                </li>

                                {/* Accounts Section */}
                                <li>
                                    <div className="space-y-1">
                                        <Link
                                            to="/accounts"
                                            onClick={toggleAccountsDropdown}
                                            className={`flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${location.pathname.startsWith('/accounts') ||
                                                    location.pathname.startsWith('/students') ||
                                                    location.pathname.startsWith('/provider-accounts') ||
                                                    location.pathname.startsWith('/verification-details') ||
                                                    location.pathname.startsWith('/student-details') ||
                                                    location.pathname.startsWith('/student-applications') ||
                                                    location.pathname.startsWith('/provider-details') ||
                                                    location.pathname.startsWith('/scholarship-provider')
                                                    ? 'bg-blue-600 text-white shadow-md'
                                                    : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <BsFillPersonFill className={`w-5 h-5 ${location.pathname.startsWith('/accounts') ||
                                                        location.pathname.startsWith('/students') ||
                                                        location.pathname.startsWith('/provider-accounts') ||
                                                        location.pathname.startsWith('/verification-details') ||
                                                        location.pathname.startsWith('/student-details') ||
                                                        location.pathname.startsWith('/provider-details') ||
                                                        location.pathname.startsWith('/scholarship-provider')
                                                        ? 'text-white' : 'text-blue-600'
                                                    }`} />
                                                <span className="font-medium">Accounts</span>
                                            </div>
                                            <svg
                                                className={`w-4 h-4 transition-transform duration-200 ${isAccountsDropdownOpen ? 'rotate-180' : ''
                                                    }`}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </Link>

                                        {isAccountsDropdownOpen && (
                                            <ul className="ml-6 space-y-1 border-l-2 border-blue-100 pl-4">
                                                <li>
                                                    <Link
                                                        to="/accounts"
                                                        className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all duration-200 ${location.pathname === '/accounts'
                                                                ? 'bg-blue-100 text-blue-700 font-medium'
                                                                : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                                                            }`}
                                                    >
                                                        <BsFillPersonFill className="w-4 h-4 text-blue-600" />
                                                        Users
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link
                                                        to="/students"
                                                        className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all duration-200 ${location.pathname === '/students'
                                                                ? 'bg-blue-100 text-blue-700 font-medium'
                                                                : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                                                            }`}
                                                    >
                                                        <PiStudentFill className="w-4 h-4 text-blue-600" />
                                                        Students
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link
                                                        to="/student-applications"
                                                        className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all duration-200 ${location.pathname === '/student-applications'
                                                                ? 'bg-blue-100 text-blue-700 font-medium'
                                                                : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                                                            }`}
                                                    >
                                                        <FaFileAlt className="w-4 h-4 text-blue-600" />
                                                        Student Applications
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link
                                                        to="/scholarship-provider"
                                                        className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all duration-200 ${location.pathname === '/scholarship-provider'
                                                                ? 'bg-blue-100 text-blue-700 font-medium'
                                                                : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                                                            }`}
                                                    >
                                                        <BsBuildingFill className="w-4 h-4 text-blue-600" />
                                                        Scholarship Providers
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link
                                                        to="/scholarship-provider-applications"
                                                        className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all duration-200 ${location.pathname === '/scholarship-provider-applications'
                                                                ? 'bg-blue-100 text-blue-700 font-medium'
                                                                : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                                                            }`}
                                                    >
                                                        <FaFileAlt className="w-4 h-4 text-blue-600" />
                                                        Provider Applications
                                                    </Link>
                                                </li>
                                            </ul>
                                        )}
                                    </div>
                                </li>

                                {/* Scholarship Programs Section */}                                <li>
                                    <Link
                                        to="/scholarship-programs"
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${location.pathname.startsWith('/scholarship-programs') ||
                                            location.pathname.startsWith('/scholarship-program-applications') ||
                                            location.pathname.startsWith('/scholarship-applications')
                                            ? 'bg-blue-600 text-white shadow-md'
                                            : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                                            }`}
                                    >
                                        <FaGraduationCap className={`w-5 h-5 ${location.pathname.startsWith('/scholarship-programs') ||
                                            location.pathname.startsWith('/scholarship-program-applications') ||
                                            location.pathname.startsWith('/scholarship-applications')
                                            ? 'text-white' : 'text-blue-600'
                                            }`} />
                                        <span className="font-medium">Scholarship Programs</span>
                                    </Link>
                                </li>

                                {/* Application Inbox */}
                                <li>
                                    <Link
                                        to="/application-inbox"
                                        className={`flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${location.pathname.startsWith('/application-inbox')
                                                ? 'bg-blue-600 text-white shadow-md'
                                                : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <BsInboxFill className={`w-5 h-5 ${location.pathname.startsWith('/application-inbox') ? 'text-white' : 'text-blue-600'
                                                }`} />
                                            <span className="font-medium">Application Inbox</span>
                                        </div>
                                        {totalPendingCount > 0 && (
                                            <span className={`px-2 py-1 text-xs font-bold rounded-full ${location.pathname.startsWith('/application-inbox')
                                                    ? 'bg-white text-blue-600'
                                                    : 'bg-blue-600 text-white'
                                                }`}>
                                                {totalPendingCount}
                                            </span>
                                        )}
                                    </Link>
                                </li>

                                {/* Forums */}
                                <li>
                                    <Link
                                        to="/admin-forums"
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${location.pathname === '/admin-forums'
                                                ? 'bg-blue-600 text-white shadow-md'
                                                : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                                            }`}
                                    >
                                        <MdForum className={`w-5 h-5 ${location.pathname === '/admin-forums' ? 'text-white' : 'text-blue-600'
                                            }`} />
                                        <span className="font-medium">Forums</span>
                                    </Link>
                                </li>

                                {/* Log History */}
                                <li>
                                    <Link
                                        to="/log-history"
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${location.pathname === '/log-history'
                                                ? 'bg-blue-600 text-white shadow-md'
                                                : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                                            }`}
                                    >
                                        <FaHistory className={`w-5 h-5 ${location.pathname === '/log-history' ? 'text-white' : 'text-blue-600'
                                            }`} />
                                        <span className="font-medium">Log History</span>
                                    </Link>
                                </li>

                                {/* Generate Reports */}
                                <li>
                                    <Link
                                        to="/admin-reports"
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${location.pathname === '/admin-reports'
                                                ? 'bg-blue-600 text-white shadow-md'
                                                : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                                            }`}
                                    >
                                        <FaFileAlt className={`w-5 h-5 ${location.pathname === '/admin-reports' ? 'text-white' : 'text-blue-600'
                                            }`} />
                                        <span className="font-medium">Generate Reports</span>
                                    </Link>
                                </li>

                                {/* Settings */}
                                <li>
                                    <Link
                                        to="/admin-settings"
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${location.pathname === '/admin-settings'
                                                ? 'bg-blue-600 text-white shadow-md'
                                                : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                                            }`}
                                    >
                                        <FaCog className={`w-5 h-5 ${location.pathname === '/admin-settings' ? 'text-white' : 'text-blue-600'
                                            }`} />
                                        <span className="font-medium">Settings</span>
                                    </Link>
                                </li>
                            </ul>
                        </nav>

                        {/* Sidebar Footer */}
                        <div className="p-4 border-t border-gray-200 bg-gray-50">
                            <div className="flex items-center gap-3 px-3 py-2">
                                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white text-sm font-bold">
                                        {currentUser?.adminDetails?.firstName?.charAt(0) || 'A'}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {currentUser?.adminDetails?.firstName || 'Admin'}
                                    </p>
                                    <p className="text-xs text-gray-500">Administrator</p>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            )}
        </header>
    );
}