import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaUser, FaGraduationCap, FaCog, FaBars, FaTimes } from 'react-icons/fa';

export default function AccountManagement() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { 
      to: "/profile", 
      label: "Profile", 
      icon: FaUser,
      description: "Personal information and avatar"
    },
    { 
      to: "/student-info", 
      label: "Student Info", 
      icon: FaGraduationCap,
      description: "Academic details and enrollment"
    },
    { 
      to: "/account-settings", 
      label: "Account Settings", 
      icon: FaCog,
      description: "Privacy and preferences"
    }
  ];

  const getActiveLinkClass = ({ isActive }) =>
    isActive 
      ? "flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-md shadow-sm text-sm transition-all duration-200" 
      : "flex items-center gap-2 px-3 py-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all duration-200 text-sm";

  const getMobileLinkClass = ({ isActive }) =>
    isActive
      ? "flex items-center gap-3 px-3 py-2 bg-blue-600 text-white rounded-md shadow-sm text-sm"
      : "flex items-center gap-3 px-3 py-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all duration-200 text-sm";

  return (
    <div className='sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm'>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          {/* Header */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-blue-700 rounded-md flex items-center justify-center">
              <FaCog className="w-3 h-3 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-slate-800">Account Settings</h1>
              <p className="text-xs text-slate-500 hidden sm:block">Manage your account and preferences</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:block">
            <ul className="flex gap-1">
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <li key={item.to}>
                    <NavLink to={item.to} className={getActiveLinkClass}>
                      <IconComponent className="w-3.5 h-3.5" />
                      <span className="font-medium">{item.label}</span>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200"
          >
            {isMobileMenuOpen ? (
              <FaTimes className="w-4 h-4" />
            ) : (
              <FaBars className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden pb-3 border-t border-slate-200 mt-3 pt-3">
            <nav>
              <ul className="space-y-1">
                {navigationItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <li key={item.to}>
                      <NavLink 
                        to={item.to} 
                        className={getMobileLinkClass}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <IconComponent className="w-3.5 h-3.5" />
                        <div className="flex-1">
                          <span className="font-medium block">{item.label}</span>
                          <span className="text-xs text-slate-500">{item.description}</span>
                        </div>
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}