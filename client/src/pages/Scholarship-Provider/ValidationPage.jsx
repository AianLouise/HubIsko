import React from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import ProviderHeaderSidebar from '../../components/ProviderHeaderAndSidebar';
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";
import { MdPending } from "react-icons/md";
import { FaClock } from "react-icons/fa6";

const scholarships = [
    { id: 1, name: "Scholarship A", date: "12/12/2021", status: "Ongoing"},
    { id: 2, name: "Scholarship B", date: "12/12/2021", status: "Completed"},
    { id: 3, name: "Scholarship C", date: "12/12/2021", status: "Pending"},
    { id: 4, name: "Scholarship D", date: "12/12/2021", status: "Pending"},
    { id: 5, name: "Scholarship E", date: "12/12/2021", status: "Pending"},
  ];



export default function ValidationPage() { 
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedTab, setSelectedTab] = useState('Update Information');

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const handleTabClick = (tab) => setSelectedTab(tab);


    return (
        <div className="flex flex-col min-h-screen">
            <main className={`flex-grow bg-[#f8f8fb] transition-all duration-200 ease-in-out ${sidebarOpen ? 'ml-64' : ''}`}>
                <ProviderHeaderSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar}  />

                <div className="max-w-8xl mx-24 mt-6">

                    <span>
                        <h1 className="text-3xl font-bold mb-4">Validation</h1>
                    </span>

                    <div className="flex gap-10">
                        <div className="flex flex-col items-center w-1/4 bg-white border shadow px-4 py-6 rounded-md">
                            <span className="bg-blue-500 w-full px-8 py-2 text-center rounded-md text-white font-medium">Your Scholarships</span>

                            <div className="mt-4 w-full">
                                {scholarships.map((scholarship) => (
                                <div key={scholarship.id} className="flex justify-between bg-slate-200 p-4 my-2 rounded-md">
                                    <div className="flex gap-2 items-center">
                                    <div className="bg-blue-600 w-8 h-8 rounded-full"></div>
                                    <h3 className="text-sm font-medium">{scholarship.name}</h3>
                                    </div>

                                                
                                    <div className="flex items-center gap-2">
                                    <span className={`p-2 rounded-full text-white flex items-center gap-2 
                                        ${scholarship.status === 'Ongoing' ? 'bg-blue-500' 
                                        : scholarship.status === 'Completed' ? 'bg-green-500' 
                                        : 'bg-yellow-500'}`}>
                                            {scholarship.status === 'Ongoing' && <MdPending className="w-4 h-4" />}
                                            {scholarship.status === 'Completed' && <FaCheckCircle className="w-4 h-4" />}
                                            {scholarship.status === 'Pending' && <FaClock className="w-4 h-4" />}
                                        </span>
                                    </div>
                                </div>
                                ))}
                            </div>
                            
                            <div className="flex items-center justify-between w-full mt-8 border-t pt-4">

                                <MdOutlineKeyboardArrowRight className="w-8 h-8 text-blue-600 cursor-pointer rotate-180" />

                                <span className="text-sm">Page 1 / 1</span>

                                <MdOutlineKeyboardArrowRight className="w-8 h-8 text-blue-600 cursor-pointer rotate" />

                            </div>
                        </div>

                        <div className="flex flex-col gap-4 w-full">
                
                            <div className="flex gap-4 items-center">
                                <input type="text" placeholder="Search" className="border rounded-md p-2 px-4" />
                            </div>
                            <div className="w-full h-full">
                                <div className="flex flex-col  justify-between h-full border rounded-md bg-white w-full">
                                <table className="min-w-full divide-y border-b divide-gray-200">
                                    <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scholarship</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date of Validation</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mark as</th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                    {scholarships.map((scholarship) => (
                                        <tr key={scholarship.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">John Doe</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{scholarship.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{scholarship.date}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 rounded-full text-white 
                                        ${scholarship.status === 'Ongoing' ? 'bg-blue-500' 
                                        : scholarship.status === 'Completed' ? 'bg-green-500' 
                                        : 'bg-yellow-500'}`}>
                                            
                                        {scholarship.status}
                                        </span>
                                        </td>
                                        <td className="flex gap-2 px-6 py-4 whitespace-nowrap">
                                            <button className="bg-blue-600 text-white px-4 py-1 rounded-full hover:bg-blue-900">Complete</button>
                                            <button className="bg-red-600 text-white px-4 py-1 rounded-full hover:bg-red-900">Missing</button>
                                        </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                                <div>
                                <div className="flex gap-8 items-center justify-end w-full mt-8 py-4 px-8">

                                    <MdOutlineKeyboardArrowRight className="w-8 h-8 text-blue-600 cursor-pointer rotate-180" />

                                    <span className="text-sm">Page 1 / 1</span>

                                    <MdOutlineKeyboardArrowRight className="w-8 h-8 text-blue-600 cursor-pointer rotate" />
                                </div>
                                </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* History */}
                    <div className="flex flex-col my-8 w-full">
                    <span className="w-full py-2 mb-4 rounded-md border-b text-lg text-slate-600 font-medium">Activities</span>
                        <div className="flex flex-col items-center bg-white border shadow rounded-md">
                            <div className="w-full divide-y">
                            <div className="flex justify-between hover:bg-slate-100 p-4 py-6 relative group">
                                <div className="flex gap-2 items-center">
                                    <div className="bg-blue-600 w-8 h-8 rounded-full"></div>
                                    <h3 className="text-sm font-medium">
                                    Scholarship has completed its validation! <span className="text-blue-600">(40/50)</span> applications were validated
                                    </h3>
                                </div>
                                <button className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white px-4 py-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    View
                                </button>
                            </div>

                            <div className="flex justify-between hover:bg-slate-100 p-4 py-6 relative group">
                                <div className="flex gap-2 items-center">
                                        <div className="bg-blue-600 w-8 h-8 rounded-full"></div>
                                        <h3 className="text-sm font-medium">Scholarship A is now ongoing! <span className="text-blue-600">(00/00/0000) | (8:00 am - 5:00pm)</span> </h3>
                                </div>
                                <button className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white px-4 py-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    View
                                </button>
                            </div>

                            
                            </div>
                        </div>
                    </div>

                </div>
            
            </main>
        </div>
    );
    }
    