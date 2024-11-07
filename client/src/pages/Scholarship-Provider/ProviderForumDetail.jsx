import React, { useEffect, useState } from 'react';
import ProviderHeaderSidebar from '../../components/ProviderHeaderAndSidebar';
import ForumPost from '../../components/Forum/ForumPost';

export default function ProviderForumDetail() {
  useEffect(() => {
    window.scrollTo(0, 0);
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className={`flex flex-col min-h-screen`}>

      <main className={`flex-grow bg-[#f8f8fb] transition-all duration-200 ease-in-out ${sidebarOpen ? 'ml-64' : ''} `}>
        <ProviderHeaderSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <ForumPost />
      </main>

    </div>
  );
}   