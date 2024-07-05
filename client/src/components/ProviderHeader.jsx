import React, { useState } from 'react';
import { FaSignOutAlt, FaTimes, FaBars } from 'react-icons/fa';
import ProviderSidebar from './ProviderSidebar'; // Ensure this path is correct

export default function ProviderHeader() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <>
            <header className="default-header-styles">
                <div className="container mx-auto flex justify-between items-center">
                    <button onClick={toggleSidebar} className="text-xl p-2 mr-4">
                        {isSidebarOpen ? <FaTimes /> : <FaBars />}
                    </button>
                    <div className="flex items-center">
                        <img src="https://via.placeholder.com/40" alt="Logo" className="h-10 w-10 mr-2" />
                        <h1 className="text-xl font-bold">Scholarship Provider Dashboard</h1>
                    </div>
                    <button className="flex items-center bg-white text-indigo-600 py-2 px-4 rounded hover:bg-gray-100">
                        <FaSignOutAlt className="mr-2" /> Sign Out
                    </button>
                </div>
            </header>
            <ProviderSidebar isSidebarOpen={isSidebarOpen} />
        </>
    );
}