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

  return (
    <div className='border-b bg-[#f8f8fb] shadow-sm'>
      <div className='flex justify-between text-md max-w-6xl mx-auto p-6 lg:px-20'>
        <Link to='/' className='flex items-center'>
          <img src={NewLogo} alt='HubIsko Logo' className='w-10 h-auto mx-2' />
          <h1 className='font-bold text-2xl hover:text-slate-600 ease-in-out transition-colors'>HubIsko</h1>
        </Link>

        <div className='flex items-center gap-4 md:hidden'>
          {currentUser && (
            <Link
              to={'/notifications'}
              className={`flex items-center p-1.5 rounded-full ${isNotificationsPage ? 'bg-white text-blue-600 border' : 'bg-blue-600 text-white'}`}
            >
              <IoIosNotifications className="w-6 h-6" />
            </Link>
          )}
          <button className="bg-blue-600 text-white rounded-md p-2" onClick={toggleSidebar}>
            <IoMenu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Sidebar */}
        <div className={`fixed shadow-lg inset-0 z-50 flex justify-end transition-transform transform ${sidebarVisible ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="bg-white shadow-lg border w-64 p-4 h-full">

            <div className='mb-4 pb-4 border-b flex justify-between items-center'>
              <span className='font-bold text-slate-700 text-lg'>Sidebar</span>
              <button className="bg-blue-600 text-white p-1.5 rounded-full" onClick={toggleSidebar}><IoClose className="w-5 h-5" /></button>
            </div>

            <ul className='flex flex-col gap-4 p-2 text-white font-medium'>

              <Link to='/'>
                <li className={`px-4 p-2 rounded-md flex items-center gap-2 ${location.pathname === '/' ? 'bg-blue-600' : 'bg-slate-500'}`}>
                  <GoHomeFill className='w-5 h-5' />Home
                </li>
              </Link>

              {currentUser && currentUser.role === 'applicant' && (
                <Link to='/scholar-dashboard'>
                  <li className={`px-4 p-2 rounded-md flex items-center gap-2 ${location.pathname === '/scholar-dashboard' ? 'bg-blue-600' : 'bg-slate-500'}`}>

                    <MdDashboard className='w-5 h-5' />Scholar Dashboard
                  </li></Link>
              )}

              <Link to='/scholarship-listing'>
                <li className={`px-4 p-2 rounded-md flex items-center gap-2 ${location.pathname === '/scholarship-listing' ? 'bg-blue-600' : 'bg-slate-500'}`}>

                  <FaGoogleScholar className='w-5 h-5' />Scholarship Listing
                </li></Link>

              <Link to='/forums'>
                <li className={`px-4 p-2 rounded-md flex items-center gap-2 ${location.pathname === '/forums' ? 'bg-blue-600' : 'bg-slate-500'}`}>

                  <BsChatLeftTextFill className='w-5 h-5' />Forums
                </li></Link>

              {currentUser ? (
                <ul className='flex flex-col gap-4 text-white font-medium'>
                  <Link to="/profile"
                    className={`px-4 p-2 rounded-md flex items-center gap-2 ${location.pathname === '/profile' ? 'bg-blue-600' : 'bg-slate-500'}`}>

                    <IoPersonCircleSharp className='w-5 h-5' />Manage Account
                  </Link>

                  <Link to='/about'>
                    <li className={`px-4 p-2 rounded-md flex items-center gap-2 ${location.pathname === '/about' ? 'bg-blue-600' : 'bg-slate-500'}`}>

                      <IoInformationCircle className='w-5 h-5' />About Us
                    </li></Link>

                  <button onClick={handleSignOut} className="border-2 text-slate-700 px-4 p-2 text-left rounded-md flex items-center gap-2">

                    <FaDoorOpen className='w-5 h-5' />Sign Out</button>
                </ul>
              ) : (
                <>
                  <Link to='/login'><li className='border p-2 px-4 text-slate-700 rounded-md hover:bg-slate-200'>Login</li></Link>
                  <div className="relative">
                    <li className='bg-blue-600 text-white p-2 px-4 rounded-md hover:bg-blue-800 cursor-pointer' onClick={toggleDropdown2}>
                      Register
                    </li>
                    {dropdownVisible && (
                      <ul className="text-left absolute bg-white shadow-lg rounded-lg mt-2 w-56 left-1/2 transform -translate-x-1/2 border border-gray-200">
                        <Link to='/register'>
                          <li className='p-2 px-4 hover:bg-blue-400 text-slate-700 cursor-pointer'>Register as Student</li>
                        </Link>
                        <Link to='/apply-as-provider'>
                          <li className='p-2 px-4 hover:bg-blue-400 text-slate-700 cursor-pointer'>Register as Scholarship Provider</li>
                        </Link>
                      </ul>
                    )}
                  </div>
                </>
              )}
            </ul>
          </div>
        </div>

        {/* Desktop Navigation */}
        <ul className='lg:flex hidden gap-6 font-bold text-slate-600'>
          <Link to='/'>
            <li className={`p-2 ${location.pathname === '/' ? 'text-blue-600 border-b-2 border-blue-600' : 'hover:text-blue-600 hover:border-b-2'} hover:-translate-y-0.5 transition-all ease-in-out`}>
              Home
            </li>
          </Link>

          {currentUser && currentUser.role === 'applicant' && (
            <Link to='/scholar-dashboard'>
              <li className={`p-2 ${location.pathname === '/scholar-dashboard' ? 'text-blue-600 border-b-2 border-blue-600' : 'hover:text-blue-600 hover:border-b-2'} hover:-translate-y-0.5 transition-all ease-in-out`}>
                Scholar Dashboard
              </li>
            </Link>
          )}

          <Link to='/scholarship-listing'>
            <li className={`p-2 ${location.pathname === '/scholarship-listing' ? 'text-blue-600 border-b-2 border-blue-600' : 'hover:text-blue-600 hover:border-b-2'} hover:-translate-y-0.5 transition-all ease-in-out`}>
              Scholarship Listing
            </li>
          </Link>
          <Link to='/forums'>
            <li className={`p-2 ${location.pathname === '/forums' ? 'text-blue-600 border-b-2 border-blue-600' : 'hover:text-blue-600 hover:border-b-2'} hover:-translate-y-0.5 transition-all ease-in-out`}>
              Forums
            </li>
          </Link>

          {/* Notification */}
          {currentUser && currentUser.role === 'applicant' && (
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
                                          <span className='text-blue-600 font-semibold'>  See More</span>
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
                                          <span className='text-blue-600 font-semibold'>  See More</span>
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

          {currentUser ? (
            <div ref={showDropdownRef} className="relative"> {/* This div wraps both the image and the dropdown */}
              <img src={currentUser.profilePicture} alt='profile' className='h-10 w-10 rounded-full object-cover cursor-pointer' onClick={toggleDropdown} />
              {showDropdown && (
                <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 py-2 w-48 bg-white rounded-md shadow-xl z-20 font-medium text-center">
                  {/* Dropdown items here */}
                  <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Manage Account</Link>
                  <Link to='/about' className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>About Us</Link>
                  <button onClick={handleSignOut} className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-red-600 hover:text-white">Sign out</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to='/login'>
                <li className='border p-2 px-4 rounded-full hover:bg-slate-200'>
                  Login
                </li>
              </Link>
              <div className="relative">
                <li className='bg-blue-600 text-white p-2 px-4 rounded-full hover:bg-blue-800 cursor-pointer' onClick={toggleDropdown2}>
                  Register
                </li>
                {dropdownVisible && (
                  <ul className="absolute bg-white shadow-lg rounded-lg mt-2 w-64 left-1/2 transform -translate-x-1/2 border border-gray-200">
                    <Link to='/register'>
                      <li className='p-2 px-4 bg-white hover:bg-blue-600 hover:text-white text-center cursor-pointer rounded-t-lg border-b border-blue-600'>
                        Register as a Student
                      </li>
                    </Link>
                    <Link to='/apply-as-provider'>
                      <li className='p-2 px-4 bg-white hover:bg-blue-600 hover:text-white text-center cursor-pointer rounded-b-lg'>
                        Register as a Scholarship Provider
                      </li>
                    </Link>
                  </ul>
                )}
              </div>
            </>
          )}
        </ul>
      </div>

      {/* NOTIFICATION MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto bg-gray-900 bg-opacity-50">
          <div className='bg-white rounded-md shadow w-1/2 h-[800px]'>
            <div className='flex items-center justify-between'>
              <h1 className='text-2xl p-4 font-bold'>Notifications</h1>
              <button className='p-2 mx-4 border rounded-full hover:bg-slate-200'>
                <IoClose onClick={ShowModal} className='w-6 h-6 text-blue-600' />
              </button>
            </div>
            <div className='flex gap-2 px-4'>
              <button className='border rounded-md p-2 px-4 hover:bg-slate-200 focus:bg-blue-600 focus:text-white'>All</button>
              <button className='border rounded-md p-2 px-4 hover:bg-slate-200 focus:bg-blue-600 focus:text-white'>Unread</button>

            </div>
            <div className='flex flex-col p-2 px-4 mt-4 w-full'>
              <span className='font-medium'>New Notifications</span>
              <div className='flex flex-col gap-2 mt-2 hover:bg-slate-200 w-full p-2 rounded-md group'>
                <div className='flex flex-row justify-between items-center text-sm w-full gap-8'>
                  <div className='bg-blue-600 w-16 h-16 rounded-full mr-4'></div>
                  <div className='flex flex-col text-left'>
                    <div className='flex gap-2 items-center font-bold text-lg '>
                      <div className='bg-blue-600 w-2 h-2 rounded-full'></div>
                      HubIsko
                    </div>
                    <span>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Cupiditate voluptatum repellat dolore officia voluptatem non debitis! Ullam nobis vel temporibus?</span>

                  </div>
                  <BsThreeDots className='w-10 h-10' />
                </div>
              </div>
            </div>
          </div>
        </div>

      )}
    </div>
  );
}
