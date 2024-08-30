import React from 'react';
import { NavLink } from 'react-router-dom';

export default function AccountManagement() {
  // Example of a function to determine if a link is active
  const getActiveLinkClass = ({ isActive }) => 
    isActive ? "text-white bg-blue-600 px-2 py-2 rounded-md font-semibold" : "text-blue-500 hover:text-blue-700 px-2 py-2 hover:bg-slate-200 hover:rounded-md";
  
  return (
 
    <div className='sticky top-0'> 
      <div className="bg-white p-4 shadow">
        <div className="max-w-6xl lg:px-24 px-2 mx-auto flex flex-col lg:flex-row lg:justify-between justify-center lg:gap-0 gap-4 items-center">
          <h1 className="text-xl font-bold text-slate-800">Account Settings</h1>
          <nav>
            <ul className="flex divide-x-2 text-sm lg:text-base">
              <li>
                <NavLink to="/profile" className={getActiveLinkClass}>Profile</NavLink>
              </li>

              <li>
                <NavLink to="/student-info" className={getActiveLinkClass}>Student Info</NavLink>
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