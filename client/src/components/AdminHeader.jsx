import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { CgClose } from "react-icons/cg";
import { GoHomeFill } from "react-icons/go";
import { BsFillPersonFill } from "react-icons/bs";
import { BsFlagFill } from "react-icons/bs";

export default function AdminHeader({ sidebarOpen, toggleSidebar }) {
    return (
        <header className="bg-white text-gray-800 p-4 flex justify-between items-center shadow border-b w-full">
            <div className="max-w-8xl w-full mx-auto px-24 flex justify-between items-center">
                <div className='flex items-center gap-2'>
                    <button className="text-blue-600" onClick={toggleSidebar}>
                        <FontAwesomeIcon icon={faBars} className='w-4 h-4' />
                    </button>
                    <h1 className="text-lg font-bold text-blue-500">Admin Dashboard</h1>
                    <h1 className="text-lg font-bold text-blue-500">/ Home</h1>
                </div>
                <div className="flex gap-2 items-center">
                    <span className="text-base">Admin</span>
                </div>
            </div>

            {sidebarOpen && (
                <aside className="fixed font-medium inset-y-0 left-0 transform translate-x-0 w-64 transition-transform duration-200 ease-in-out bg-white shadow-lg p-4 z-50">
                   
                   
                   
                   <div className="flex justify-between items-center pb-2 mb-4 border-b">

                    <div className="flex gap-2 items-center">
                    <div className="bg-blue-600 w-8 h-8 rounded-md"></div>
                    <span className="font-bold">HubIsko</span>
                    </div>
                  
                   <button onClick={toggleSidebar} className="text-blue-600 border p-2 rounded-full hover:bg-slate-200">
                        <CgClose className="w-4 h-4" />
                    </button>

                   </div>
               
                    <nav>
                        <ul>
                            <li>
                            <a href="#" className="flex gap-2 items-center text-gray-800 hover:bg-blue-200 py-2 px-4 rounded-md">
                                <GoHomeFill className="w-5 h-5 text-blue-600" /> 
                                Dashboard
                            </a>
                            </li>

                            <li>
                            <a href="#" className="flex gap-2 items-center text-gray-800 hover:bg-blue-200 py-2 px-4 rounded-md">
                                <BsFillPersonFill className="w-5 h-5 text-blue-600" /> 
                                Accounts
                            </a>
                            </li>

                            <li>
                            <a href="#" className="flex gap-2 items-center text-gray-800 hover:bg-blue-200 py-2 px-4 rounded-md">
                                <BsFlagFill className="w-5 h-5 text-blue-600" /> 
                                Events
                            </a>
                            </li>

                        </ul>
                    </nav>
                </aside>
            )}
        </header>
    );
}