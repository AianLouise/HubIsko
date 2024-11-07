import React, { useEffect, useState } from 'react';
import ProviderHeaderSidebar from '../../components/ProviderHeaderAndSidebar';
import { useSelector } from 'react-redux';
import Forums from '../../components/Forum/Forums';

export default function ProviderForums() {
  useEffect(() => {
    window.scrollTo(0, 0);
  });

  const { currentUser } = useSelector((state) => state.user);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const isLoggedIn = !!currentUser;

  return (
    <div className={`flex flex-col min-h-screen`}>

      <main className={`flex-grow bg-[#f8f8fb] transition-all duration-200 ease-in-out ${sidebarOpen ? 'ml-64' : ''} `}>
        <ProviderHeaderSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <Forums />
      </main>

    </div>
  );
}
