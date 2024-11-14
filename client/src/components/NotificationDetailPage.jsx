import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';

const NotificationDetailPage = () => {
  const { notificationId } = useParams();
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const fetchNotification = async () => {
      try {
        const response = await fetch(`/api/notification/notification-details/${notificationId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setNotification(data);
      } catch (error) {
        console.error('Error fetching notification:', error);
      }
    };

    fetchNotification();
  }, [notificationId]);

  if (!notification) {
    return (
      <div className="flex justify-center items-center">
        <svg className="animate-spin h-10 w-10 text-blue-600" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-6 text-blue-600">Notification Details</h2>
      <div className="flex flex-row items-center gap-4">
        <img
          src={notification.senderId.profilePicture || 'default-avatar.png'}
          alt="Sender's Avatar"
          className="w-16 h-16 rounded-full object-cover border-2 border-blue-600"
        />
        <div className="flex flex-col">
          <span className="text-xl font-bold">
            {notification.senderId.role === 'admin'
              ? notification.senderId.username
              : notification.senderId.role === 'applicant'
                ? `${notification.senderId.applicantDetails.firstName} ${notification.senderId.applicantDetails.middleName ? notification.senderId.applicantDetails.middleName.charAt(0) + '.' : ''} ${notification.senderId.applicantDetails.lastName}`
                : notification.senderId.scholarshipProviderDetails.organizationName}
          </span>
          <span className="text-sm text-gray-500">{format(new Date(notification.createdAt), 'PPpp')}</span>
        </div>
      </div>
      <div className="mt-4 p-4 bg-gray-100 rounded-lg">
        <p className="text-lg">{notification.message}</p>
      </div>
    </div>
  );
};

export default NotificationDetailPage;