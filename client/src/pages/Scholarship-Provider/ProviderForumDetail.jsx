import React, { useState } from 'react';
import ProviderHeaderSidebar from '../../components/ProviderHeaderAndSidebar';

export default function ProviderForumDetail() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
 
  return (
    <div className={`flex flex-col min-h-screen`}>

      <main className={`flex-grow bg-[#f8f8fb] transition-all duration-200 ease-in-out ${sidebarOpen ? 'ml-64' : ''} `}>
      <ProviderHeaderSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

        <div className='max-w-8xl mx-auto px-24 gap-10 flex-col flex'>

          <div className='flex gap-1 mt-10 items-center'>
            <Link to='/provider-forums'>
              <button className='bg-white border shadow px-4 py-1 mr-2 rounded-md hover:bg-slate-200 transition ease-in-out'>Forums</button>
            </Link>
            <IoMdArrowDropdown className='-rotate-90 text-2xl text-blue-600' />
            <button className='bg-white border shadow px-4 py-1 ml-2 rounded-md hover:bg-slate-200 transition ease-in-out'>{post.title}</button>
          </div>


        </div>

      </main>

    </div>
  );
}   