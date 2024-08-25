import React, { useEffect, useState } from 'react';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      // Fetch notifications from the API
      // const response = await fetch('/api/notifications');
      // const data = await response.json();
      // setNotifications(data);

      // Dummy data for notifications
      const dummyNotifications = [
        {
          _id: '1',
          senderId: {
            profilePicture: 'default-avatar.png',
            scholarshipProviderDetails: {
              organizationName: 'Dummy Organization 1'
            }
          },
          message: 'This is a dummy notification message 1.',
          createdAt: new Date().toISOString()
        },
        {
          _id: '2',
          senderId: {
            profilePicture: 'default-avatar.png',
            scholarshipProviderDetails: {
              organizationName: 'Dummy Organization 2'
            }
          },
          message: 'This is a dummy notification message 2.',
          createdAt: new Date().toISOString()
        }
      ];

      setNotifications(dummyNotifications);
    };

    fetchNotifications();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md space-y-6 mt-10">
      <h2 className="text-3xl font-bold mb-6 text-blue-600">All Notifications</h2>
      <div className="flex flex-col gap-6">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div key={notification._id} className="flex flex-row items-center text-sm w-full gap-4 border-b pb-4">
              <img
                src={notification.senderId.profilePicture || 'default-avatar.png'}
                alt="Sender's Avatar"
                className="w-12 h-12 rounded-full object-cover border-2 border-blue-600"
              />
              <div className="flex flex-col text-left">
                <span className="text-xl font-bold">{notification.senderId.scholarshipProviderDetails.organizationName}</span>
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