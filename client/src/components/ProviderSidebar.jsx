import React from 'react';
import { FaHouse } from "react-icons/fa6";
import { FaGoogleScholar } from "react-icons/fa6";
import { IoDocuments } from "react-icons/io5";
import { FaCog } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { MdForum } from "react-icons/md";

function Sidebar({ isOpen, toggleSidebar }) {
  return (
    <div className={`fixed inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} w-64 transition-transform duration-200 ease-in-out bg-white p-5 border-r-2`}>


      <div className='flex justify-between mb-8'>
      <div className='flex items-center gap-2'>
      <div className='bg-blue-600 w-6 h-6 rounded-md'></div>
      <span className='font-bold text-blue-600 text-2xl'>HubIsko</span>
      </div>

      <button  onClick={toggleSidebar} className='border border-blue-600 rounded-full items-center justify-center flex w-8 hover:bg-slate-200 transition hover:border-none'>

      <IoClose className='w-4 h-4 text-blue-600' />

      </button>
      </div>


      <nav className='font-medium'>
        <ul className="space-y-2">
          <li>
            
            <a href="#" className="flex items-center gap-2 text-gray-800 py-2.5 px-4 rounded transition duration-200 hover:bg-blue-500 hover:text-white group">
            <FaHouse className='w-4 h-4 text-blue-600 group-hover:text-white transition' />
              Home
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center gap-2 text-gray-800 py-2.5 px-4 rounded transition duration-200 hover:bg-blue-500 hover:text-white group">
            <FaGoogleScholar className='w-4 h-4 text-blue-600 group-hover:text-white transition' />
              Scholarships
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center gap-2 text-gray-800 py-2.5 px-4 rounded transition duration-200 hover:bg-blue-500 hover:text-white group">
            <IoDocuments className='w-4 h-4 text-blue-600 group-hover:text-white transition' />
              Applications
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center gap-2 text-gray-800 py-2.5 px-4 rounded transition duration-200 hover:bg-blue-500 hover:text-white group">
            <MdForum className='w-4 h-4 text-blue-600 group-hover:text-white transition' />
              Forums
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center gap-2 text-gray-800 py-2.5 px-4 rounded transition duration-200 hover:bg-blue-500 hover:text-white">
            <FaCog className='w-4 h-4 text-blue-600 group-hover:text-white transition' />
              Settings
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;