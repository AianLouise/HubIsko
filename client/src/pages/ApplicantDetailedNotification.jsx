import React from 'react'
import NotificationsPage from '../components/notification'
import Header from '../components/Header'
import Footer from '../components/Footer'
import NotificationDetailPage from '../components/NotificationDetailPage'

export default function ApplicantDetailedNotification() {
    return (
        <div className='flex flex-col min-h-screen'>
            <Header />
            <main className='flex-grow bg-[#f8f8fb] no-scrollbar font-medium'>
                <NotificationDetailPage />
            </main>
            <Footer />
        </div>
    )
}
