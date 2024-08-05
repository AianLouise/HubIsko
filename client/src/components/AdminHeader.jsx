import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

export default function AdminHeader({ sidebarOpen, toggleSidebar }) {
    return (
        <header className="bg-white text-gray-800 p-4 flex justify-between items-center shadow border-b w-full">
            <div className="max-w-8xl w-full mx-auto px-24 flex justify-between items-center">
                <div className='flex items-center gap-2'>
                    <button className="text-blue-600" onClick={toggleSidebar}>
                        <FontAwesomeIcon icon={faBars} className='w-4 h-4' />
                    </button>
                    <h1 className="text-lg font-bold text-blue-500">Admin Dashboard</h1>
                    <h1 className="text-lg font-bold text-blue-500">/ Home</h1>
                </div>
                <div className="flex gap-2 items-center">
                    <span className="text-base">Admin</span>
                </div>
            </div>

            {sidebarOpen && (
                <aside className="fixed inset-y-0 left-0 transform translate-x-0 w-64 transition-transform duration-200 ease-in-out bg-white shadow-lg p-4 z-50">
                    <button onClick={toggleSidebar} className="text-gray-600 mb-4">
                        Close
                    </button>
                    <nav>
                        <ul>
                            <li><a href="#" className="block p-2 text-gray-800">Dashboard</a></li>
                            <li><a href="#" className="block p-2 text-gray-800">Settings</a></li>
                            <li><a href="#" className="block p-2 text-gray-800">Profile</a></li>
                        </ul>
                    </nav>
                </aside>
            )}
        </header>
    );
}