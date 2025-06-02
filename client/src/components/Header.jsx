import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { signOut } from '../redux/user/userSlice';
import { IoIosNotifications } from "react-icons/io";
import { IoMenu } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import { BsThreeDots } from "react-icons/bs";
import { GoHomeFill } from 'react-icons/go';
import { MdDashboard } from "react-icons/md";
import { FaGoogleScholar, FaDoorOpen } from "react-icons/fa6";
import { BsChatLeftTextFill } from "react-icons/bs";
import { IoPersonCircleSharp, IoInformationCircle } from "react-icons/io5";
import { useLocation } from 'react-router-dom';
import { useRef } from 'react';
import NewLogo from '../assets/NewLogo.png';

export default function Header() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useSelector(state => state.user);

  const [showDropdown, setShowDropdown] = useState(false);
  const showDropdownRef = useRef(null);
  const [showNotification, setShowNotification] = useState(false);
  const notificationRef = useRef(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [displayedNotifications, setDisplayedNotifications] = useState(10);

  const ShowModal = () => setShowModal(!showModal);

  const handleClickOutside = (event) => {
    if (notificationRef.current && !notificationRef.current.contains(event.target)) {
      setShowNotification(false);
    }
    if (showDropdownRef.current && !showDropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => setShowDropdown(!showDropdown);
  const toggleNotification = () => setShowNotification(!showNotification);
  const toggleSidebar = () => setSidebarVisible(!sidebarVisible);

  const handleSeeAllNotifications = () => {
    navigate('/notifications');
  };

  const handleNotificationClick = async (notificationId) => {
    try {
      // Send a request to the server to mark the notification as read
      const response = await fetch(`/api/notification/mark-as-read/${notificationId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to mark notification as read');
      }

      // Update the local state to reflect the change
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification._id === notificationId ? { ...notification, read: true } : notification
        )
      );

      // Update the unread count
      setUnreadCount((prevCount) => prevCount - 1);

      // Navigate to the notification details page
      navigate(`/notifications/${notificationId}`);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const isNotificationsPage = location.pathname === '/notifications';

  const handleSignOut = async () => {
    const userId = currentUser ? currentUser._id : null;
    if (!userId) {
      console.log('User ID is not available');
      return;
    }

    try {
      await fetch('/api/auth/signout', {
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

  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown2 = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const [notifications, setNotifications] = useState([]);

  const userId = currentUser ? currentUser._id : null;

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!userId) {
        console.warn('User is not logged in. Skipping fetch notifications.');
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`/api/notification/notifications/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch notifications');
        }
        const data = await response.json();
        setNotifications(data);

        const unread = data.filter(notification => !notification.read).length;
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

  useEffect(() => {
    const handleScroll = () => {
      if (notificationRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = notificationRef.current;
        if (scrollTop + clientHeight >= scrollHeight) {
          handleSeeAllNotifications();
        }
      }
    };

    if (notificationRef.current) {
      notificationRef.current.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (notificationRef.current) {
        notificationRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, [notificationRef]);

  return (<div className='border-b bg-white shadow-sm sticky top-0 z-40'>
    <div className='flex justify-between items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3'>
      <Link to='/'>
        <div className="flex items-center space-x-2">
          <img src={NewLogo} alt='HubIsko Logo' className='w-8 h-8 object-contain' />
          <h2 className="text-xl font-bold text-gray-800">HubIsko</h2>
        </div>
      </Link>

      {/* Mobile Nav Controls */}
      <div className='flex items-center gap-3 md:hidden'>
        {currentUser && (
          <Link
            to={'/notifications'}
            className={`flex items-center justify-center p-1.5 rounded-full relative ${isNotificationsPage ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'bg-white text-blue-600 border border-gray-200 hover:bg-blue-50'}`}
          >
            <IoIosNotifications className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                {unreadCount}
              </span>
            )}
          </Link>
        )}
        <button className="text-gray-600 hover:text-blue-600 rounded-md p-1.5 hover:bg-blue-50 border border-gray-200" onClick={toggleSidebar}>
          <IoMenu className="w-5 h-5" />
        </button>
      </div>

      {/* Desktop Navigation */}
      <ul className='md:flex hidden items-center gap-5 text-gray-600'>
        <Link to='/'>
          <li className={`p-2 font-medium ${location.pathname === '/' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 border-b-2 border-transparent hover:text-blue-600 hover:border-blue-600'}`}>
            Home
          </li>
        </Link>

        {currentUser && currentUser.role === 'applicant' && (
          <Link to='/scholar-dashboard'>
            <li className={`p-2 font-medium ${location.pathname === '/scholar-dashboard' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 border-b-2 border-transparent hover:text-blue-600 hover:border-blue-600'}`}>
              Scholar Dashboard
            </li>
          </Link>
        )}

        <Link to='/scholarship-listing'>
          <li className={`p-2 font-medium ${location.pathname === '/scholarship-listing' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 border-b-2 border-transparent hover:text-blue-600 hover:border-blue-600'}`}>
            Scholarship Listing
          </li>
        </Link>

        <Link to='/forums'>
          <li className={`p-2 font-medium ${location.pathname === '/forums' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 border-b-2 border-transparent hover:text-blue-600 hover:border-blue-600'}`}>
            Forums
          </li>
        </Link>

        {/* Notification */}
        {currentUser && currentUser.role === 'applicant' && (
          <div className='relative'>              <button
            onClick={toggleNotification}
            className={`relative p-2 rounded-full ${showNotification ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100 text-gray-600 hover:text-blue-600'}`}
          >
            <IoIosNotifications className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>

            {showNotification && (
              <div ref={notificationRef} className="absolute top-full right-0 mt-2 border bg-white text-gray-800 shadow-lg rounded-lg p-3 w-96 z-50">
                <div className="flex flex-col">
                  <div className="flex items-center justify-between pb-2 border-b">
                    <span className="text-lg font-semibold text-gray-800">Notifications</span>
                    <div className="flex gap-2">
                      <button
                        className={`px-3 py-1 rounded-md text-sm ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setFilter('all');
                        }}
                      >
                        All
                      </button>
                      <button
                        className={`px-3 py-1 rounded-md text-sm ${filter === 'unread' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setFilter('unread');
                        }}
                      >
                        Unread
                      </button>
                    </div>
                  </div>

                  <div className="max-h-[320px] overflow-y-auto py-2 mt-2">
                    {loading ? (
                      <div className="flex justify-center items-center h-32">
                        <svg className="animate-spin h-6 w-6 text-blue-600" viewBox="0 0 24 24">
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
                                className={`flex items-center p-2 text-sm gap-3 cursor-pointer border-b border-gray-100 hover:bg-blue-50 rounded-md ${!notification.read ? 'bg-blue-50' : ''}`}
                                onClick={() => handleNotificationClick(notification._id)}
                              >
                                <img
                                  src={notification.senderId?.profilePicture || 'default-avatar.png'}
                                  alt="Sender's Avatar"
                                  className="w-10 h-10 rounded-full object-cover border border-gray-200"
                                />
                                <div className="flex-1 min-w-0">
                                  {notification.senderId?.role === 'scholarship_provider' && (
                                    <span className="font-semibold text-gray-800">{notification.senderId.scholarshipProviderDetails?.organizationName || 'Unknown Organization'}</span>
                                  )}
                                  {notification.senderId?.role === 'admin' && (
                                    <span className="font-semibold text-gray-800">{notification.senderId.username || 'Unknown User'}</span>
                                  )}
                                  {notification.senderId?.role === 'applicant' && (
                                    <span className="font-semibold text-gray-800">{`${notification.senderId.applicantDetails?.firstName || 'Unknown'} ${notification.senderId.applicantDetails?.lastName || 'Applicant'}`}</span>
                                  )}
                                  <p className="text-gray-600 text-sm truncate">{truncateMessage(notification.message, 50)}</p>
                                </div>
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                                )}
                              </div>
                            ))}
                          </>
                        ) : filter === 'unread' && notifications.filter(notification => !notification.read).length > 0 ? (
                          <>
                            {notifications.filter(notification => !notification.read).slice(0, displayedNotifications).map((notification) => (
                              <div
                                key={notification._id}
                                className="flex items-center p-2 text-sm gap-3 cursor-pointer border-b border-gray-100 hover:bg-blue-50 rounded-md bg-blue-50"
                                onClick={() => handleNotificationClick(notification._id)}
                              >
                                <img
                                  src={notification.senderId?.profilePicture || 'default-avatar.png'}
                                  alt="Sender's Avatar"
                                  className="w-10 h-10 rounded-full object-cover border border-gray-200"
                                />
                                <div className="flex-1 min-w-0">
                                  {notification.senderId?.role === 'scholarship_provider' && (
                                    <span className="font-semibold text-gray-800">{notification.senderId.scholarshipProviderDetails?.organizationName || 'Unknown Organization'}</span>
                                  )}
                                  {notification.senderId?.role === 'admin' && (
                                    <span className="font-semibold text-gray-800">{notification.senderId.username || 'Unknown User'}</span>
                                  )}
                                  {notification.senderId?.role === 'applicant' && (
                                    <span className="font-semibold text-gray-800">{`${notification.senderId.applicantDetails?.firstName || 'Unknown'} ${notification.senderId.applicantDetails?.lastName || 'Applicant'}`}</span>
                                  )}
                                  <p className="text-gray-600 text-sm truncate">{truncateMessage(notification.message, 50)}</p>
                                </div>
                                <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                              </div>
                            ))}
                          </>
                        ) : (
                          <div className="text-center py-6 text-gray-500">No notifications to display</div>
                        )}
                      </>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSeeAllNotifications();
                    }}
                    className="mt-2 bg-blue-600 text-white rounded-md p-2 text-sm font-medium hover:bg-blue-700 w-full"
                  >
                    See All Notifications
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {currentUser ? (
          <div ref={showDropdownRef} className="relative ml-2">
            <div className="flex items-center cursor-pointer" onClick={toggleDropdown}>
              <img
                src={currentUser.profilePicture}
                alt='profile'
                className='h-9 w-9 rounded-full object-cover border-2 border-gray-200'
              />
              <span className="ml-2 text-sm font-medium text-gray-700 hidden lg:block">
                {currentUser.username}
              </span>
            </div>

            {showDropdown && (
              <div className="absolute right-0 mt-2 py-2 w-56 bg-white rounded-lg shadow-xl z-20 border border-gray-100">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{currentUser.username}</p>
                  <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
                </div>
                <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                  <div className="flex items-center">
                    <IoPersonCircleSharp className="mr-2 h-4 w-4" />
                    Manage Account
                  </div>
                </Link>
                <Link to='/about' className='block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600'>
                  <div className="flex items-center">
                    <IoInformationCircle className="mr-2 h-4 w-4" />
                    About Us
                  </div>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 border-t border-gray-100 mt-1"
                >
                  <div className="flex items-center">
                    <FaDoorOpen className="mr-2 h-4 w-4" />
                    Sign out
                  </div>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-3 ml-2">
            <Link to='/login'>
              <button className='px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50'>
                Login
              </button>
            </Link>
            <div className="relative">
              <button
                className='px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 hover-bg-transition'
                onClick={toggleDropdown2}
              >
                Register
              </button>
              {dropdownVisible && (
                <div className="absolute right-0 mt-2 w-60 bg-white rounded-lg shadow-lg border border-gray-100 z-20 overflow-hidden">
                  <Link to='/register'>
                    <div className='p-3 hover:bg-blue-50 text-gray-700 cursor-pointer border-b border-gray-100'>
                      <div className="font-medium">Register as a Student</div>
                      <p className="text-xs text-gray-500">Create a student account for scholarship applications</p>
                    </div>
                  </Link>
                  <Link to='/apply-as-provider'>
                    <div className='p-3 hover:bg-blue-50 text-gray-700 cursor-pointer'>
                      <div className="font-medium">Register as a Scholarship Provider</div>
                      <p className="text-xs text-gray-500">Create an account to offer scholarships</p>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </ul>
    </div>

    {/* Mobile Sidebar */}
    <div className={`fixed inset-0 bg-gray-600 bg-opacity-50 z-50 ${sidebarVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={toggleSidebar}>
      <div className={`fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-xl transform ${sidebarVisible ? 'translate-x-0' : 'translate-x-full'} slide-transition gpu-accelerated`} onClick={e => e.stopPropagation()}>
        <div className="h-full flex flex-col">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img src={NewLogo} alt='HubIsko Logo' className='w-8 h-auto' />
              <h2 className="text-xl font-bold text-gray-800">HubIsko</h2>
            </div>
            <button
              className="p-1.5 rounded-full text-gray-500 hover:bg-gray-100"
              onClick={toggleSidebar}
            >
              <IoClose className="w-5 h-5" />
            </button>
          </div>

          {currentUser && (
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <img
                  src={currentUser.profilePicture}
                  alt="Profile"
                  className="h-12 w-12 rounded-full object-cover border border-gray-200"
                />
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{currentUser.username}</h3>
                  <p className="text-xs text-gray-500">{currentUser.email}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto py-2 px-3">
            <div className="space-y-1">
              <Link to='/' onClick={toggleSidebar}>
                <div className={`flex items-center space-x-3 px-3 py-2.5 rounded-md ${location.pathname === '/' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                  <GoHomeFill className='w-5 h-5' />
                  <span className="text-sm font-medium">Home</span>
                </div>
              </Link>

              {currentUser && currentUser.role === 'applicant' && (
                <Link to='/scholar-dashboard' onClick={toggleSidebar}>
                  <div className={`flex items-center space-x-3 px-3 py-2.5 rounded-md ${location.pathname === '/scholar-dashboard' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                    <MdDashboard className='w-5 h-5' />
                    <span className="text-sm font-medium">Scholar Dashboard</span>
                  </div>
                </Link>
              )}

              <Link to='/scholarship-listing' onClick={toggleSidebar}>
                <div className={`flex items-center space-x-3 px-3 py-2.5 rounded-md ${location.pathname === '/scholarship-listing' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                  <FaGoogleScholar className='w-5 h-5' />
                  <span className="text-sm font-medium">Scholarship Listing</span>
                </div>
              </Link>

              <Link to='/forums' onClick={toggleSidebar}>
                <div className={`flex items-center space-x-3 px-3 py-2.5 rounded-md ${location.pathname === '/forums' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                  <BsChatLeftTextFill className='w-5 h-5' />
                  <span className="text-sm font-medium">Forums</span>
                </div>
              </Link>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              {currentUser ? (
                <div className="space-y-1">
                  <Link to="/profile" onClick={toggleSidebar}>
                    <div className={`flex items-center space-x-3 px-3 py-2.5 rounded-md ${location.pathname === '/profile' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                      <IoPersonCircleSharp className='w-5 h-5' />
                      <span className="text-sm font-medium">Manage Account</span>
                    </div>
                  </Link>

                  <Link to='/about' onClick={toggleSidebar}>
                    <div className={`flex items-center space-x-3 px-3 py-2.5 rounded-md ${location.pathname === '/about' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                      <IoInformationCircle className='w-5 h-5' />
                      <span className="text-sm font-medium">About Us</span>
                    </div>
                  </Link>

                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-md text-red-600 hover:bg-red-50 mt-2"
                  >
                    <FaDoorOpen className='w-5 h-5' />
                    <span className="text-sm font-medium">Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3 px-3 pt-2">
                  <Link to='/login' onClick={toggleSidebar}>
                    <button className="w-full py-2 text-center text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50">
                      Login
                    </button>
                  </Link>

                  <div className="relative">
                    <button
                      className="w-full py-2 text-center text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                      onClick={toggleDropdown2}
                    >
                      Register
                    </button>
                    {dropdownVisible && (
                      <div className="mt-2 w-full bg-white rounded-md shadow border border-gray-200 overflow-hidden">
                        <Link to='/register' onClick={toggleSidebar}>
                          <div className='p-3 hover:bg-blue-50 text-gray-700 border-b border-gray-100'>
                            <div className="text-sm font-medium">Register as Student</div>
                          </div>
                        </Link>
                        <Link to='/apply-as-provider' onClick={toggleSidebar}>
                          <div className='p-3 hover:bg-blue-50 text-gray-700'>
                            <div className="text-sm font-medium">Register as Provider</div>
                          </div>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* NOTIFICATION MODAL */}
    {showModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto bg-gray-600 bg-opacity-50">
        <div className='bg-white rounded-lg shadow-xl w-full max-w-xl max-h-[80vh] flex flex-col'>
          <div className='flex items-center justify-between p-4 border-b border-gray-200'>
            <h1 className='text-xl font-bold text-gray-800'>Notifications</h1>
            <button className='p-1.5 rounded-full text-gray-500 hover:bg-gray-100' onClick={ShowModal}>
              <IoClose className='w-5 h-5' />
            </button>
          </div>

          <div className='flex gap-2 p-4 border-b border-gray-200'>
            <button className={`px-4 py-1.5 rounded-md text-sm font-medium ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`} onClick={() => setFilter('all')}>
              All
            </button>
            <button className={`px-4 py-1.5 rounded-md text-sm font-medium ${filter === 'unread' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`} onClick={() => setFilter('unread')}>
              Unread
            </button>
          </div>

          <div className='flex-1 overflow-y-auto p-4'>
            <h2 className='font-medium text-gray-700 mb-3'>Recent Notifications</h2>

            {loading ? (
              <div className="flex justify-center items-center h-32">
                <svg className="animate-spin h-8 w-8 text-blue-600" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
              </div>
            ) : notifications.length > 0 ? (
              <div className='space-y-2'>
                {notifications.slice(0, displayedNotifications).map((notification) => (
                  <div
                    key={notification._id}
                    className={`flex items-center p-3 rounded-lg cursor-pointer ${!notification.read ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                    onClick={() => handleNotificationClick(notification._id)}
                  >
                    <img
                      src={notification.senderId?.profilePicture || 'default-avatar.png'}
                      alt="Sender's Avatar"
                      className="w-12 h-12 rounded-full object-cover border border-gray-200 mr-3"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-800">
                          {notification.senderId?.role === 'scholarship_provider' && notification.senderId.scholarshipProviderDetails?.organizationName}
                          {notification.senderId?.role === 'admin' && notification.senderId.username}
                          {notification.senderId?.role === 'applicant' &&
                            `${notification.senderId.applicantDetails?.firstName || ''} ${notification.senderId.applicantDetails?.lastName || ''}`}
                        </span>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        )}
                      </div>
                      <p className="text-gray-600">{truncateMessage(notification.message, 80)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">No notifications to display</div>
            )}
          </div>

          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleSeeAllNotifications}
              className="w-full bg-blue-600 text-white rounded-md py-2 font-medium hover:bg-blue-700"
            >
              See All Notifications
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
  );
}
