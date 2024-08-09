import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminHeader from './AdminHeader';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
      <div className={`flex flex-col ${sidebarOpen ? 'ml-64' : ''} transition-all duration-200`}>
          <AdminHeader sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
          <div>
              
        <Outlet className={`flex flex-col ${sidebarOpen ? 'ml-64' : ''} transition-all duration-200`} />
          </div>
    </div>
  );
};

export default Layout;