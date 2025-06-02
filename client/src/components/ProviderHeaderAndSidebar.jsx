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
import { MdDocumentScanner } from "react-icons/md";
import Logo from '../assets/NewLogoClean.png';


export default function ProviderHeaderSidebar({ sidebarOpen, toggleSidebar }) {
    const { currentUser } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [displayedNotifications, setDisplayedNotifications] = useState(5);
    const [notifications, setNotifications] = useState([]);

    const dropdownRef = useRef(null);
    const notificationRef = useRef(null);

    const userId = currentUser ? currentUser._id : null;

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
        if (
            location.pathname === '/provider-dashboard' ||
            location.pathname === '/scholarships' ||
            location.pathname === '/scholar-applications' ||
            location.pathname === '/provider-forums'
        ) {
            toggleSidebar(true);
        }
    }, [location]);

    const handleProfileClick = () => {
        navigate('/provider-profile/' + currentUser._id);
    };

    const handleSettingsClick = () => {
        navigate('/provider-settings');
    };    const handleSignOut = async () => {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const userId = currentUser ? currentUser._id : null;
        if (!userId) {
            console.log('User ID is not available');
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

    const generateBreadcrumb = () => {
        const pathnames = location.pathname.split('/').filter((x) => x);
        const [titles, setTitles] = useState({});

        const capitalizeWords = (str) => {
            return str.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
        };        useEffect(() => {
            const fetchTitles = async () => {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
                const newTitles = {};
                for (const value of pathnames) {
                    if (value === 'view-scholarships') {
                        const id = pathnames[pathnames.indexOf(value) + 1];
                        if (id) {
                            try {
                                const response = await fetch(`${apiUrl}/api/provider/scholarshipProgramTitle/${id.trim()}`);
                                if (!response.ok) {
                                    throw new Error('Network response was not ok');
                                }
                                const data = await response.json();
                                newTitles[id] = data.scholarshipProgramTitle;
                            } catch (error) {
                                console.error('Error fetching scholarship program title:', error);
                            }
                        }
                    }
                }
                setTitles(newTitles);
            };

            fetchTitles();
        }, [location.pathname]);

        return (
            <>
                <h1 className="text-lg font-bold text-blue-500">
                    {currentUser.scholarshipProviderDetails.organizationName}
                </h1>
                {pathnames.map((value, index) => {
                    const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
                    const displayValue = titles[value] || capitalizeWords(value);
                    return (
                        <span key={index} className="text-lg font-bold text-blue-500">
                            /&nbsp;<Link to={routeTo}>{displayValue}</Link>
                        </span>
                    );
                })}
            </>
        );
    };

    const handleSeeAllNotifications = () => {
        navigate('/provider-notification');
    };    const handleNotificationClick = async (notificationId) => {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        try {
            const response = await fetch(`${apiUrl}/api/notification/mark-as-read/${notificationId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to mark notification as read');
            }

            setNotifications((prevNotifications) =>
                prevNotifications.map((notification) =>
                    notification._id === notificationId ? { ...notification, read: true } : notification
                )
            );

            setUnreadCount((prevCount) => prevCount - 1);

            navigate(`/provider-notification/${notificationId}`);
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };    useEffect(() => {
        const fetchNotifications = async () => {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
            if (!userId) {
                console.warn('User is not logged in. Skipping fetch notifications.');
                return;
            }

            try {
                setLoading(true);
                const response = await fetch(`${apiUrl}/api/notification/notifications/${userId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch notifications');
                }
                const data = await response.json();
                setNotifications(data);

                const unread = data.filter((notification) => !notification.read).length;
                setUnreadCount(unread);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, [userId]);

    const truncateMessage = (message, maxLength) => {
        if (message.length > maxLength) {
            return message.substring(0, maxLength) + '...';
        }
        return message;
    };

    return (
        <header className="bg-white text-gray-800 p-4 flex justify-between items-center shadow border-b w-full">
            <div className="max-w-8xl w-full mx-auto pl-10 pr-28 flex justify-between items-center">
                <div className='flex items-center gap-2'>
                    <button className="text-blue-600" onClick={toggleSidebar}>
                        <FontAwesomeIcon icon={faBars} className='w-4 h-4' />
                    </button>
                    {generateBreadcrumb()}
                </div>


                <div className="flex gap-4 items-center">
                    {currentUser && currentUser.role === 'scholarship_provider' && (
                        <div className='font-semibold'>
                            <button
                                onClick={toggleNotification}
                                className={`relative p-3 ${showNotification ? 'bg-blue-600 text-white rounded-full' : 'hover:bg-slate-200 hover:rounded-full focus:bg-blue-600 group focus:rounded-full'}`}
                            >
                                <IoIosNotifications className={`w-5 h-5 ${showNotification ? 'text-white' : 'text-blue-600 group-focus:text-white'} scale-125`} />
                                {unreadCount > 0 && (
                                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                                        {unreadCount}
                                    </span>
                                )}
                                {showNotification && (
                                    <div ref={notificationRef} className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 border bg-white text-gray-800 shadow-lg rounded-md p-4 w-96 z-50">
                                        <div className="flex flex-col justify-start">
                                            <span className="text-xl text-left border-b py-2 w-full">Notification Inbox</span>
                                            <div className="flex flex-row justify-start mt-4 gap-2 font-medium">
                                                <button
                                                    className={`px-4 py-2 rounded-md ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setFilter('all');
                                                    }}
                                                >
                                                    All
                                                </button>
                                                <button
                                                    className={`px-4 py-2 rounded-md ${filter === 'unread' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setFilter('unread');
                                                    }}
                                                >
                                                    Unread
                                                </button>
                                            </div>
                                            <div className="flex flex-col items-start p-2 mt-4">
                                                <div className="flex flex-col gap-2 mt-2">
                                                    {loading ? (
                                                        <div className="flex justify-center items-center h-32">
                                                            <svg className="animate-spin h-8 w-8 text-blue-600" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                                            </svg>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            {filter === 'all' && notifications.length > 0 ? (
                                                                <>
                                                                    {notifications.slice(0, displayedNotifications).map((notification) => (
                                                                        <div
                                                                            key={notification._id}
                                                                            className="flex flex-row items-center hover:bg-slate-200 rounded-md p-2 text-sm w-full gap-4 cursor-pointer border-b border-gray-200"
                                                                            onClick={() => handleNotificationClick(notification._id)}
                                                                        >
                                                                            <img
                                                                                src={notification.senderId?.profilePicture || 'default-avatar.png'}
                                                                                alt="Sender's Avatar"
                                                                                className="w-12 h-12 rounded-full object-cover"
                                                                            />
                                                                            <div className="flex flex-col text-left">
                                                                                {notification.senderId?.role === 'scholarship_provider' && (
                                                                                    <span className="font-bold">{notification.senderId.scholarshipProviderDetails?.organizationName || 'Unknown Organization'}</span>
                                                                                )}
                                                                                {notification.senderId?.role === 'admin' && (
                                                                                    <span className="font-bold">{notification.senderId.username || 'Unknown User'}</span>
                                                                                )}
                                                                                {notification.senderId?.role === 'applicant' && (
                                                                                    <span className="font-bold">{`${notification.senderId.applicantDetails?.firstName || 'Unknown'} ${notification.senderId.applicantDetails?.lastName || 'Applicant'}`}</span>
                                                                                )}
                                                                                <span className="text-sm font-normal">{truncateMessage(notification.message, 50)}
                                                                                    <span className="text-blue-600 font-semibold"> See More</span>
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </>
                                                            ) : filter === 'unread' && notifications.filter(notification => !notification.read).length > 0 ? (
                                                                <>
                                                                    {notifications.filter(notification => !notification.read).slice(0, displayedNotifications).map((notification) => (
                                                                        <div
                                                                            key={notification._id}
                                                                            className="flex flex-row items-center hover:bg-slate-200 rounded-md p-2 text-sm w-full gap-4 cursor-pointer border-b border-gray-200"
                                                                            onClick={() => handleNotificationClick(notification._id)}
                                                                        >
                                                                            <img
                                                                                src={notification.senderId?.profilePicture || 'default-avatar.png'}
                                                                                alt="Sender's Avatar"
                                                                                className="w-12 h-12 rounded-full object-cover"
                                                                            />
                                                                            <div className="flex flex-col text-left">
                                                                                {notification.senderId?.role === 'scholarship_provider' && (
                                                                                    <span className="font-bold">{notification.senderId.scholarshipProviderDetails?.organizationName || 'Unknown Organization'}</span>
                                                                                )}
                                                                                {notification.senderId?.role === 'admin' && (
                                                                                    <span className="font-bold">{notification.senderId.username || 'Unknown User'}</span>
                                                                                )}
                                                                                {notification.senderId?.role === 'applicant' && (
                                                                                    <span className="font-bold">{`${notification.senderId.applicantDetails?.firstName || 'Unknown'} ${notification.senderId.applicantDetails?.lastName || 'Applicant'}`}</span>
                                                                                )}
                                                                                <span className="text-sm font-normal">{truncateMessage(notification.message, 50)}
                                                                                    <span className="text-blue-600 font-semibold"> See More</span>
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </>
                                                            ) : (
                                                                <div className="text-center text-gray-500">No new notifications</div>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleSeeAllNotifications();
                                                }}
                                                className="bg-blue-600 text-white rounded-md p-2 mt-4 font-medium hover:bg-blue-800 transition ease-in-out"
                                            >
                                                See All Notifications
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </button>
                        </div>
                    )}

                    <div className="relative" ref={dropdownRef}>
                        <img
                            src={currentUser.profilePicture || 'https://via.placeholder.com/40'}
                            alt="Profile"
                            className="h-9 w-9 rounded-full object-cover cursor-pointer" // Add cursor-pointer class
                            onClick={toggleDropdown}
                        />
                        {dropdownOpen && (
                            <div className="absolute mt-2 left-1/2 transform -translate-x-1/2 bg-white text-gray-800 shadow-lg rounded-md p-2 w-52 z-50 font-medium text-center">
                                <ul>
                                    <li className="p-2 hover:bg-gray-100 cursor-pointer" onClick={handleProfileClick}>Profile</li>
                                    <li className="p-2 hover:bg-gray-100 cursor-pointer" onClick={handleSettingsClick}>Settings</li>
                                    <li className="p-2 hover:bg-red-600 hover:text-white cursor-pointer" onClick={handleSignOut}>Sign out</li>
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
                            <img src={Logo} alt='Logo' className='w-6 h-6 rounded-md' />
                            <span className='font-bold text-blue-600 text-2xl'>HubIsko</span>
                        </div>
                        <button onClick={toggleSidebar} className='border border-blue-600 rounded-full items-center justify-center flex w-8 hover:bg-slate-200 transition hover:border-none'>
                            <IoClose className='w-4 h-4 text-blue-600' />
                        </button>
                    </div>

                    <nav className="">
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    to={'/provider-dashboard'}
                                    className={`flex items-center gap-2 text-gray-800 py-2.5 px-4 rounded transition duration-200 hover:bg-blue-500 hover:text-white group ${location.pathname === '/provider-dashboard' ? 'bg-blue-600 text-white' : ''}`}
                                >
                                    <FaHouse className={`w-4 h-4 ${location.pathname === '/provider-dashboard' ? 'text-white' : 'text-blue-600'}`} />
                                    Dashboard
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to={'/scholarships'}
                                    className={`flex items-center gap-2 text-gray-800 py-2.5 px-4 rounded transition duration-200 hover:bg-blue-500 hover:text-white group ${location.pathname === '/scholarships' ? 'bg-blue-600 text-white' : ''}`}
                                >
                                    <FaGoogleScholar className={`w-4 h-4 ${location.pathname === '/scholarships' ? 'text-white' : 'text-blue-600'}`} />
                                    Scholarships
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to={'/scholar-applications'}
                                    className={`flex items-center gap-2 text-gray-800 py-2.5 px-4 rounded transition duration-200 hover:bg-blue-500 hover:text-white group ${location.pathname === '/scholar-applications' ? 'bg-blue-600 text-white' : ''}`}
                                >
                                    <IoDocuments className={`w-4 h-4 ${location.pathname === '/scholar-applications' ? 'text-white' : 'text-blue-600'}`} />
                                    Applications
                                </Link>
                            </li>

                            {/* <li>
                                <Link
                                    to={'/validation-page'}
                                    className={`flex items-center gap-2 text-gray-800 py-2.5 px-4 rounded transition duration-200 hover:bg-blue-500 hover:text-white group ${location.pathname === '/validation-page' ? 'bg-blue-600 text-white' : ''}`}
                                >
                                    <MdDocumentScanner className={`w-4 h-4 ${location.pathname === '/validation-page' ? 'text-white' : 'text-blue-600'}`} />
                                    Validation
                                </Link>
                            </li> */}

                            <li>
                                <Link
                                    to={'/provider/forums'}
                                    className={`flex items-center gap-2 text-gray-800 py-2.5 px-4 rounded transition duration-200 hover:bg-blue-500 hover:text-white group ${location.pathname === '/provider-forums' ? 'bg-blue-600 text-white' : ''}`}
                                >
                                    <MdForum className={`w-4 h-4 ${location.pathname === '/provider-forums' ? 'text-white' : 'text-blue-600'}`} />
                                    Forums
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to={'/provider-settings'}
                                    className={`flex items-center gap-2 text-gray-800 py-2.5 px-4 rounded transition duration-200 hover:bg-blue-500 hover:text-white group ${location.pathname === '/provider-settings' ? 'bg-blue-600 text-white' : ''}`}
                                >
                                    <FaCog className={`w-4 h-4 ${location.pathname === '/provider-settings' ? 'text-white' : 'text-blue-600'}`} />
                                    Settings
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </aside>
            )}
        </header>
    );
}