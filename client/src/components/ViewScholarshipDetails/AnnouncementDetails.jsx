import React, { useEffect, useState } from 'react';
import AnnouncementDetails from '../../components/Announcement/AnnouncementDetails';
import ProviderHeaderSidebar from '../ProviderHeaderAndSidebar';

export default function AnnouncementView() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    useEffect(() => {
        window.scrollTo(0, 0);
    });

    return (
        <div className={`flex flex-col min-h-screen`}>
            <main className={`flex-grow bg-[#f8f8fb] transition-all duration-200 ease-in-out ${sidebarOpen ? 'ml-64' : ''}`}>
                <ProviderHeaderSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
                <AnnouncementDetails />
            </main>

        </div>
    );
}