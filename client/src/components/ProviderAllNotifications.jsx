import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ProviderHeaderSidebar from './ProviderHeaderAndSidebar';
import { format } from 'date-fns';

const ProviderAllNotifications = () => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const userId = currentUser ? currentUser._id : null;

  useEffect(() => {
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
      const response = await fetch(`/api/notification/mark-as-read/${notificationId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to mark notification as read');
      }

      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification._id === notificationId ? { ...notification, read: true } : notification
        )
      );

      navigate(`/provider-notification/${notificationId}`);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const filteredNotifications = filter === 'all'
    ? notifications
    : notifications.filter(notification => !notification.read);

  return (
    <div className={`flex flex-col min-h-screen`}>
      <main className={`flex-grow bg-[#f8f8fb] transition-all duration-200 ease-in-out ${sidebarOpen ? 'ml-64' : ''}`}>
        <ProviderHeaderSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} currentPath={`${currentUser.scholarshipProviderDetails.organizationName} / Dashboard`} />

        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md space-y-6 mt-10 mb-10">
          <h2 className="text-2xl font-bold mb-6 text-blue-600">Notifications</h2>
          <div className="flex justify-start gap-4 mb-4">
            <button
              className={`px-4 py-2 rounded-md ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              className={`px-4 py-2 rounded-md ${filter === 'unread' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => setFilter('unread')}
            >
              Unread
            </button>
          </div>
          <div className="flex flex-col gap-6">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <div
                  key={notification._id}
                  className="flex flex-row items-center text-sm w-full gap-4 border-b pb-4 pt-4 px-4 cursor-pointer hover:bg-gray-100 transition duration-200 ease-in-out transform hover:-translate-y-1 hover:shadow-lg relative"
                  onClick={() => handleNotificationClick(notification._id)}
                >
                  <img
                    src={notification.senderId.profilePicture || 'default-avatar.png'}
                    alt="Sender's Avatar"
                    className="w-12 h-12 rounded-full object-cover border-2 border-blue-600"
                  />
                  <div className="flex flex-col text-left">
                    <span className="text-lg font-bold text-gray-800">{notification.senderName}</span>
                    <span className="text-sm text-gray-600">{notification.message}</span>
                    <span className="text-xs text-gray-400">{format(new Date(notification.createdAt), 'PPpp')}</span>
                  </div>
                  {!notification.read && (
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-blue-600 rounded-full"></span>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500">No notifications available</div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProviderAllNotifications;