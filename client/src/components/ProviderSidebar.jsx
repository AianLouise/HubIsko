import React from 'react';

function Sidebar({ isOpen, toggleSidebar }) {
  return (
    <div className={`fixed inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} w-64 transition-transform duration-200 ease-in-out bg-white p-5 shadow-lg`}>
      <nav>
        <ul className="space-y-2">
          <li>
            <a href="#" className="text-gray-800 block py-2.5 px-4 rounded transition duration-200 hover:bg-blue-500 hover:text-white">
              Home
            </a>
          </li>
          <li>
            <a href="#" className="text-gray-800 block py-2.5 px-4 rounded transition duration-200 hover:bg-blue-500 hover:text-white">
              Scholarships
            </a>
          </li>
          <li>
            <a href="#" className="text-gray-800 block py-2.5 px-4 rounded transition duration-200 hover:bg-blue-500 hover:text-white">
              Applications
            </a>
          </li>
          <li>
            <a href="#" className="text-gray-800 block py-2.5 px-4 rounded transition duration-200 hover:bg-blue-500 hover:text-white">
              Settings
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;