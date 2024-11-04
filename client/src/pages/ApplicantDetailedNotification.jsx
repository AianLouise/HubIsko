import React from 'react';
import NotificationsPage from '../components/AllNotifications';
import Header from '../components/Header';
import Footer from '../components/Footer';
import NotificationDetailPage from '../components/NotificationDetailPage';
import useTokenExpiry from '../hooks/useTokenExpiry'; // Adjust the import path

export default function ApplicantDetailedNotification() {
    useTokenExpiry();

    return (
        <div className='flex flex-col min-h-screen'>
            <Header />
            <main className='flex-grow bg-[#f8f8fb] no-scrollbar font-medium flex justify-center items-center py-10 md:py-20'>
                <NotificationDetailPage />
            </main>
            <Footer />
        </div>
    );
}