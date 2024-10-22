import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const NotificationsPage = () => {
  const { currentUser } = useSelector(state => state.user);
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);

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

  const handleNotificationClick = (notificationId) => {
    navigate(`/notifications/${notificationId}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md space-y-6 mt-10 mb-10">
      <h2 className="text-xl font-bold mb-4 text-blue-600">All Notifications</h2>
      <div className="flex flex-col gap-6">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div
              key={notification._id}
              className="flex flex-row items-center text-sm w-full gap-4 border-b pb-4 pt-4 px-4 cursor-pointer hover:bg-gray-100"
              onClick={() => handleNotificationClick(notification._id)}
            >
              <img
                src={notification.senderId.profilePicture || 'default-avatar.png'}
                alt="Sender's Avatar"
                className="w-12 h-12 rounded-full object-cover border-2 border-blue-600"
              />
              <div className="flex flex-col text-left">
                <span className="text-xl font-bold">{notification.senderName}</span>
                <span className="text-sm">{notification.message}</span>
                <span className="text-xs text-gray-500">{new Date(notification.createdAt).toLocaleString()}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">No notifications available</div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;