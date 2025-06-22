import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const NotificationsPage = () => {
  const { currentUser } = useSelector(state => state.user);
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');

  const userId = currentUser ? currentUser._id : null;

  useEffect(() => {
    // Fetch notifications when the component mounts
    const fetchNotifications = async () => {
      if (!userId) {
        console.warn('User is not logged in. Skipping fetch notifications.');
        return;
      }

      try {
        const response = await fetch(`/api/notification/notifications/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch notifications');
        }
        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, [userId]);

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

      // Navigate to the notification details page
      navigate(`/notifications/${notificationId}`);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const filteredNotifications = filter === 'all'
    ? notifications
    : notifications.filter(notification => !notification.read);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-5 5v-5zM4 2v20l8-8 8 8V2H4z"></path>
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Notifications</h1>
                  <p className="text-blue-100 text-sm">Stay updated with your latest activities</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="px-8 py-4 border-b border-gray-100">
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
              <button
                className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${filter === 'all'
                    ? 'bg-white text-blue-600 shadow-sm border border-blue-200'
                    : 'text-gray-600 hover:text-gray-800'
                  }`}
                onClick={() => setFilter('all')}
              >
                All Notifications
                <span className="ml-2 bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                  {notifications.length}
                </span>
              </button>
              <button
                className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${filter === 'unread'
                    ? 'bg-white text-blue-600 shadow-sm border border-blue-200'
                    : 'text-gray-600 hover:text-gray-800'
                  }`}
                onClick={() => setFilter('unread')}
              >
                Unread
                <span className="ml-2 bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs">
                  {notifications.filter(n => !n.read).length}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <div
                key={notification._id}
                className={`bg-white rounded-xl shadow-sm border transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer group ${!notification.read ? 'border-l-4 border-l-blue-500 bg-blue-50/30' : 'border-gray-200'
                  }`}
                onClick={() => handleNotificationClick(notification._id)}
              >
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    {/* Avatar with status indicator */}
                    <div className="relative flex-shrink-0">
                      <img
                        src={notification.senderId.profilePicture || 'default-avatar.png'}
                        alt="Sender's Avatar"
                        className="w-14 h-14 rounded-full object-cover border-3 border-white shadow-lg"
                      />
                      {!notification.read && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 border-2 border-white rounded-full animate-pulse"></div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {notification.senderName}
                          </h3>
                          <p className="text-gray-600 mt-1 line-clamp-2 leading-relaxed">
                            {notification.message}
                          </p>

                          {/* Timestamp and status */}
                          <div className="flex items-center mt-3 space-x-4">
                            <div className="flex items-center text-sm text-gray-500">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                              </svg>
                              {format(new Date(notification.createdAt), 'MMM dd, yyyy • h:mm a')}
                            </div>
                            {!notification.read && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                New
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Arrow icon */}
                        <div className="ml-4 flex-shrink-0">
                          <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-5 5v-5zM4 2v20l8-8 8 8V2H4z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
              <p className="text-gray-500 max-w-sm mx-auto">
                {filter === 'unread'
                  ? "You're all caught up! No unread notifications at the moment."
                  : "You don't have any notifications yet. Check back later for updates."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;