import React, { useState } from 'react';
import { FaUser, FaLock, FaCog, FaBook, FaFileAlt } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import ProviderHeaderSidebar from '../../components/ProviderHeaderAndSidebar';

export default function Settings() {
    const { currentUser } = useSelector((state) => state.user);

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedTab, setSelectedTab] = useState('Update Information');

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const handleTabClick = (tab) => setSelectedTab(tab);

    return (
        <div className="flex flex-col min-h-screen">
            <main className={`flex-grow bg-[#f8f8fb] transition-all duration-200 ease-in-out ${sidebarOpen ? 'ml-64' : ''}`}>
                <ProviderHeaderSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} currentPath={`${currentUser.scholarshipProviderDetails.organizationName} / Settings`} />

                <div className="max-w-8xl mx-24 mt-12">
                    <div className="bg-white border shadow rounded-md px-6 py-8">
                        <h1 className="text-4xl font-bold mb-4">Settings</h1>
                        <nav className="mb-8">
                            <ul className="flex items-center gap-8 font-medium">
                                <li>
                                    <button onClick={() => handleTabClick('Update Information')} className="relative flex py-3 group hover:text-blue-600">
                                        <FaUser className="mr-2" />
                                        <span>Update Information</span>
                                        <span className={`absolute left-0 top-0 w-full h-[2px] bg-blue-600 transition-transform duration-200 ease-in-out group-hover:scale-x-100 ${selectedTab === 'Update Information' ? 'text-blue-600 scale-x-100' : 'scale-x-0'}`}></span>
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => handleTabClick('Change Password')} className="relative flex py-3 group hover:text-blue-600">
                                        <FaLock className="mr-2" />
                                        <span>Change Password</span>
                                        <span className={`absolute left-0 top-0 w-full h-[2px] bg-blue-600 transition-transform duration-200 ease-in-out group-hover:scale-x-100 ${selectedTab === 'Change Password' ? 'text-blue-600 scale-x-100' : 'scale-x-0'}`}></span>
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => handleTabClick('Programs')} className="relative flex py-3 group hover:text-blue-600">
                                        <FaBook className="mr-2" />
                                        <span>Programs</span>
                                        <span className={`absolute left-0 top-0 w-full h-[2px] bg-blue-600 transition-transform duration-200 ease-in-out group-hover:scale-x-100 ${selectedTab === 'Programs' ? 'text-blue-600 scale-x-100' : 'scale-x-0'}`}></span>
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => handleTabClick('Applications')} className="relative flex py-3 group hover:text-blue-600">
                                        <FaFileAlt className="mr-2" />
                                        <span>Applications</span>
                                        <span className={`absolute left-0 top-0 w-full h-[2px] bg-blue-600 transition-transform duration-200 ease-in-out group-hover:scale-x-100 ${selectedTab === 'Applications' ? 'text-blue-600 scale-x-100' : 'scale-x-0'}`}></span>
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => handleTabClick('General Settings')} className="relative flex py-3 group hover:text-blue-600">
                                        <FaCog className="mr-2" />
                                        <span>General Settings</span>
                                        <span className={`absolute left-0 top-0 w-full h-[2px] bg-blue-600 transition-transform duration-200 ease-in-out group-hover:scale-x-100 ${selectedTab === 'General Settings' ? 'text-blue-600 scale-x-100' : 'scale-x-0'}`}></span>
                                    </button>
                                </li>
                            </ul>
                        </nav>

                        {selectedTab === 'Update Information' && (
                            <div className='bg-white border shadow rounded-md p-4'>
                                <h2 className='text-2xl font-bold mb-4'>Update Information</h2>
                                <form>
                                    <div className='mb-4'>
                                        <label className='block text-sm font-medium text-gray-700'>Organization Name</label>
                                        <input type='text' className='mt-1 p-2 border rounded-md w-full' defaultValue={currentUser.scholarshipProviderDetails.organizationName} />
                                    </div>
                                    <div className='mb-4'>
                                        <label className='block text-sm font-medium text-gray-700'>Email</label>
                                        <input type='email' className='mt-1 p-2 border rounded-md w-full' defaultValue={currentUser.email} />
                                    </div>
                                    <div className='mb-4'>
                                        <label className='block text-sm font-medium text-gray-700'>Phone Number</label>
                                        <input type='text' className='mt-1 p-2 border rounded-md w-full' defaultValue={currentUser.phoneNumber} />
                                    </div>
                                    <button type='submit' className='bg-blue-600 text-white px-4 py-2 rounded-md'>Save Changes</button>
                                </form>
                            </div>
                        )}

                        {selectedTab === 'Change Password' && (
                            <div className='bg-white border shadow rounded-md p-4'>
                                <h2 className='text-2xl font-bold mb-4'>Change Password</h2>
                                <form>
                                    <div className='mb-4'>
                                        <label className='block text-sm font-medium text-gray-700'>Current Password</label>
                                        <input type='password' className='mt-1 p-2 border rounded-md w-full' />
                                    </div>
                                    <div className='mb-4'>
                                        <label className='block text-sm font-medium text-gray-700'>New Password</label>
                                        <input type='password' className='mt-1 p-2 border rounded-md w-full' />
                                    </div>
                                    <div className='mb-4'>
                                        <label className='block text-sm font-medium text-gray-700'>Confirm New Password</label>
                                        <input type='password' className='mt-1 p-2 border rounded-md w-full' />
                                    </div>
                                    <button type='submit' className='bg-blue-600 text-white px-4 py-2 rounded-md'>Change Password</button>
                                </form>
                            </div>
                        )}

                        {selectedTab === 'Programs' && (
                            <div className='bg-white border shadow rounded-md p-4'>
                                <h2 className='text-2xl font-bold mb-4'>Programs</h2>
                                <span>Container for Programs</span>
                            </div>
                        )}

                        {selectedTab === 'Applications' && (
                            <div className='bg-white border shadow rounded-md p-4'>
                                <h2 className='text-2xl font-bold mb-4'>Applications</h2>
                                <span>Container for Applications</span>
                            </div>
                        )}

                        {selectedTab === 'General Settings' && (
                            <div className='bg-white border shadow rounded-md p-4'>
                                <h2 className='text-2xl font-bold mb-4'>General Settings</h2>
                                <span>Container for General Settings</span>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}