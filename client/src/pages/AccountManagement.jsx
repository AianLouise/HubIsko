import React from 'react';
import { NavLink } from 'react-router-dom';

export default function AccountManagement() {
  // Example of a function to determine if a link is active
  const getActiveLinkClass = ({ isActive }) => 
    isActive ? "text-blue-700 font-semibold px-2" : "text-blue-500 hover:text-blue-700 px-2 py-2 hover:bg-blue-600 hover:rounded-md hover:text-white";
  
  return (
 
    <div className='sticky top-0 z-10 mb-10'> 
      <div className="bg-white p-4 shadow">
        <div className="max-w-6xl px-24 mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-slate-800">Account Settings</h1>
          <nav>
            <ul className="flex divide-x-2">
              <li>
                <NavLink to="/profile" className={getActiveLinkClass}>Profile</NavLink>
              </li>

              <li>
                <NavLink to="/personal-info" className={getActiveLinkClass}>Personal Info</NavLink>
              </li>

              <li>
                <NavLink to="/password-and-security" className={getActiveLinkClass}>Password and Security</NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  
  );
}