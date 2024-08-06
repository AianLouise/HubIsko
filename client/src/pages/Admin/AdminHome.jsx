import React, { useState } from "react";
import AdminHeader from "../../components/AdminHeader";

export default function AdminHome() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    return (
        <div className={`flex flex-col ${sidebarOpen ? 'ml-64' : ''} transition-all duration-200`}>
            <AdminHeader sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
            
            <div className="max-w-8xl px-24 gap-10 flex-col flex">
                Sample Content
            </div>
        </div>
    );
}