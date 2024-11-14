import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProviderHeaderSidebar from '../components/ProviderHeaderAndSidebar';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';

const ProviderNotificationDetailPage = () => {
    const { currentUser } = useSelector((state) => state.user);

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

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
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className={`flex flex-col min-h-screen`}>
            <main className={`flex-grow bg-[#f8f8fb] transition-all duration-200 ease-in-out ${sidebarOpen ? 'ml-64' : ''} `}>
                <ProviderHeaderSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} currentPath={`${currentUser.scholarshipProviderDetails.organizationName} / Dashboard`} />

                <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md space-y-6 mt-10">
                    <h2 className="text-xl font-bold mb-6 text-blue-600">Notification Details</h2>
                    <div className="flex flex-row items-center gap-4">
                        <img
                            src={notification.senderId.profilePicture || 'default-avatar.png'}
                            alt="Sender's Avatar"
                            className="w-16 h-16 rounded-full object-cover border-2 border-blue-600"
                        />
                        <div className="flex flex-col">
                            <span className="text-xl font-bold">{notification.senderName}</span>
                            <span className="text-sm text-gray-500">{format(new Date(notification.createdAt), 'PPpp')}</span>
                        </div>
                    </div>
                    <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                        <p className="text-lg">{notification.message}</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProviderNotificationDetailPage;