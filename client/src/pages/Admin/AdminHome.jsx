import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BiDotsHorizontal } from "react-icons/bi";
import { BsInboxFill } from "react-icons/bs";

export default function AdminHome() {

    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };


    return (
        <div className="flex flex-col min-h-screen">
            
        <main className="flex-grow bg-[#f8f8fb] font-medium text-slate-700">
        <div className='border-b mb-8'>
                <div className={'flex items-center mx-auto justify-between px-24'}>
                    <div className='flex flex-col gap-2 w-1/2'>
                    <h1 className='text-4xl font-bold text-slate-800'>Welcome Admin!</h1>
                    <p className='text-lg text-slate-500 font-medium'>Here is your dashboard!</p>
                    </div>
                    <div className='bg-blue-600 w-36 h-36 my-8 rounded-md'></div>
                </div>
             </div>
            <div className='max-w-8xl mx-auto px-24 gap-10 flex-col flex'>

                <div className="grid grid-cols-3 gap-10">
                    <Link to={'/accounts'} className="bg-white flex flex-col gap-2 p-4 shadow border rounded-md h-[200px] justify-center items-center hover:bg-slate-200 hover:-translate-y-2 transition ease-in-out">
                        <h1 className="text-2xl font-semibold text-slate-600">Total Accounts</h1>
                        <span className="text-6xl font-bold text-left text-blue-600">100</span>
                    </Link>

                    <Link to={'/scholarships-data'} className="bg-white flex flex-col gap-2 p-4 shadow border rounded-md h-[200px] justify-center items-center hover:bg-slate-200 hover:-translate-y-2 transition ease-in-out">
                        <h1 className="text-2xl font-semibold text-slate-600">Total Scholarships</h1>
                        <span className="text-6xl font-bold text-left text-blue-600">20</span>
                    </Link>

                    <Link to={'/inbox'} className="bg-white flex flex-col gap-2 p-4 shadow border rounded-md h-[200px] justify-center items-center hover:bg-slate-200 hover:-translate-y-2 transition ease-in-out">
                        <h1 className="text-2xl font-semibold text-slate-600">Inbox Received</h1>
                        <span className="text-6xl font-bold text-left text-blue-600">10</span>
                    </Link>
                </div>
                
                <span className="border-b pb-2">Activities</span>
                
                <div className="">
                <div className="bg-white shadow border rounded-md   group">
                    <div className="border-b flex justify-between px-6 items-center py-4 relative">
                        <span className="">History</span>
                        <button onClick={toggleDropdown} className="hover:bg-slate-200 rounded-md">
                            <BiDotsHorizontal className="w-8 h-8 text-blue-600 group-hover:text-blue-800" />
                        </button>
                        {dropdownOpen && (
                            <div className="absolute right-0 bottom-full mb-2 w-30 bg-white border border-gray-300 rounded-md shadow-lg">
                                <Link to={'/inbox'} className="w-full text-left px-4 py-2 text-sm flex gap-2 items-center text-blue-600 hover:bg-gray-100">
                                    <BsInboxFill className="w-6 h-6" /> View All
                                </Link>
                            </div>
                        )}
                    </div>

                  


                    <div className="divide-y">
                        <div className="flex justify-between items-center p-4">
                            <div className="flex gap-2 items-center">
                                <div className="bg-blue-600 w-10 h-10 rounded-full"></div>
                                <div className="flex flex-col">
                                    <h1 className="text-lg font-semibold">DepEd</h1>
                                    <p className="text-slate-500">Posted a Scholarship</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-blue-600">1 hour ago</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-center p-4">
                            <div className="flex gap-2 items-center">
                                <div className="bg-blue-600 w-10 h-10 rounded-full"></div>
                                <div className="flex flex-col">
                                    <h1 className="text-lg font-semibold">John Doe</h1>
                                    <p className="text-slate-500">Sent an Application to DepEd</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-blue-600">1 hour ago</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-center p-4">
                            <div className="flex gap-2 items-center">
                                <div className="bg-blue-600 w-10 h-10 rounded-full"></div>
                                <div className="flex flex-col">
                                    <h1 className="text-lg font-semibold">John Doe</h1>
                                    <p className="text-slate-500">Posted in Forums</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-blue-600">1 hour ago</span>
                            </div>
                        </div>




                    </div>

                    </div>
                </div>
                
       

            </div>
        </main>
        </div>
    );
}