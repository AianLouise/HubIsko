import React from 'react';
import { NavLink } from 'react-router-dom';

export default function AccountManagement() {
  // Example of a function to determine if a link is active
  const getActiveLinkClass = ({ isActive }) => 
    isActive ? "text-blue-700 font-semibold" : "text-blue-500 hover:text-blue-700";

  return (
    <div>
      <div className="bg-gray-100 p-4 shadow">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-700">Account Settings</h1>
          <nav>
            <ul className="flex space-x-4">
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