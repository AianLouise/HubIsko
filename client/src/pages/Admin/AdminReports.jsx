import React, { useState } from "react";
import { FaFileAlt } from 'react-icons/fa';
import { useDispatch, useSelector } from "react-redux";

export default function AdminSettings() {
    const { currentUser } = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const [selectedTab, setSelectedTab] = useState('Update Information');

    const handleTabClick = (tab) => setSelectedTab(tab);

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                        <FaFileAlt className="mr-4 text-blue-600" /> {/* Updated icon */}
                        Generate Reports
                    </h1>
                </div>
            </header>
            <main className="flex-grow">
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="px-4 py-6 sm:px-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                     <div className="bg-white shadow rounded-lg p-6">
                                <h2 className="text-xl font-bold mb-4">Accounts Report</h2>
                                <p className="text-gray-600">Generate a detailed report of all account activities and balances.</p>
                                
                                <div className="mt-4">
                                    <label className="block text-gray-700">Start Date</label>
                                    <input type="date" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                                </div>
                                
                                <div className="mt-4">
                                    <label className="block text-gray-700">End Date</label>
                                    <input type="date" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                                </div>
                                
                                <div className="mt-4">
                                    <label className="block text-gray-700">Role</label>
                                    <select className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                                        <option value="">All Roles</option>
                                        <option value="admin">Admin</option>
                                        <option value="scholarship_provider">Scholarship Provider</option>
                                        <option value="applicant">Applicant</option>
                                    </select>
                                </div>
                                
                                <button className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">Generate</button>
                            </div>
                                                    <div className="bg-white shadow rounded-lg p-6">
                                <h2 className="text-xl font-bold mb-4">Scholarship Program Report</h2>
                                <p className="text-gray-600">Generate a detailed report of all scholarship programs and their statuses.</p>
                                
                                <div className="mt-4">
                                    <label className="block text-gray-700">Program</label>
                                    <select className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                                        <option value="">All Programs</option>
                                        <option value="program1">Program 1</option>
                                        <option value="program2">Program 2</option>
                                        <option value="program3">Program 3</option>
                                        {/* Add more options as needed */}
                                    </select>
                                </div>
                                
                                <div className="mt-4">
                                    <label className="block text-gray-700">Status</label>
                                    <select className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                                        <option value="">All Statuses</option>
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                        <option value="completed">Completed</option>
                                        {/* Add more options as needed */}
                                    </select>
                                </div>
                                
                                <button className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">Generate</button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}