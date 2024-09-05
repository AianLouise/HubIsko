import React, { useState , useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import { FaStar, FaWrench, FaRegHeart, FaRegEye } from 'react-icons/fa';
import { BiCommentDots } from 'react-icons/bi';
import { FaNewspaper } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import ProviderHeaderSidebar from '../../components/ProviderHeaderAndSidebar';
import { useSelector } from 'react-redux';

export default function Settings() {
    const { currentUser } = useSelector((state) => state.user);

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    const [selectedTab, setSelectedTab] = useState('About');

    const handleTabClick = (tab) => {
        setSelectedTab(tab);
      };

    

    return (
        <div className={`flex flex-col min-h-screen`}>

            <main className={`flex-grow bg-[#f8f8fb] transition-all duration-200 ease-in-out ${sidebarOpen ? 'ml-64' : ''} `}>
                <ProviderHeaderSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} currentPath={`${currentUser.scholarshipProviderDetails.organizationName} / Settings`} />

                <div className='max-w-8xl mx-24'>
                    
                    <div className='flex flex-col bg-white border border-b-0 shadow rounded-md-t px-6 py-8 mt-12'>
                        <div className='flex gap-2 items-center'>
                            <div className='bg-blue-600 rounded-full w-32 h-32'>
                            </div>

                            <div className='flex flex-col text-left gap-3 ml-4'>
                                <h1 className='text-4xl font-bold'>Organization Name</h1>
                                <h2 className='text-lg text-slate-500'>Scholars: (0) </h2>
                            </div>
                        </div>
                    </div>
                    <div className='bg-white flex items-center gap-2 px-10 border shadow rounded-b'>
                        <nav className='h-12'>
                            <ul className='flex items-center gap-8 font-medium'>

                            <li>
                                <button onClick={() => handleTabClick('About')} className='relative flex py-3 group hover:text-blue-600 '>
                                <span>About</span>
                                <span className={`absolute left-0 top-0 w-full h-[2px] bg-blue-600 transition-transform duration-200 ease-in-out group-hover:scale-x-100 ${selectedTab === 'About' ? 'text-blue-600 scale-x-100' : 'scale-x-0 '}`}></span>
                                </button>
                            </li>

                            <li>
                                <button onClick={() => handleTabClick('Organization')} className='relative flex py-3 group hover:text-blue-600 '>
                                <span>Organization</span>
                                <span className={`absolute left-0 top-0 w-full h-[2px] bg-blue-600 transition-transform duration-200 ease-in-out group-hover:scale-x-100 ${selectedTab === 'Organization' ? 'text-blue-600 scale-x-100' : 'scale-x-0 '}`}></span>
                                </button>
                            </li>

                            <li>
                                <button onClick={() => handleTabClick('Followers')} className='relative flex py-3 group hover:text-blue-600 '>
                                <span>Followers</span>
                                <span className={`absolute left-0 top-0 w-full h-[2px] bg-blue-600 transition-transform duration-200 ease-in-out group-hover:scale-x-100 ${selectedTab === 'Followers' ? 'text-blue-600 scale-x-100' : 'scale-x-0 '}`}></span>
                                </button>
                            </li>

                            </ul>
                        </nav>
                    </div>
                    
                    {selectedTab === 'About' && (
                    <div className=' flex items-center justify-center bg-white border shadow rounded-md p-4 mt-10 h-[400px]'>
                        <span>Container for About</span>
                    </div>
                    )}

                    {selectedTab === 'Organization' && (
                    <div className=' flex items-center justify-center bg-white border shadow rounded-md p-4 mt-10 h-[400px]'>
                        <span>Container for Organization</span>
                    </div>
                    )}

                    {selectedTab === 'Followers' && (
                    <div className=' flex items-center justify-center bg-white border shadow rounded-md p-4 mt-10 h-[400px]'>
                        <span>Container for Followers</span>
                    </div>
                    )}
    

                </div>
            </main>

        </div>
    )
}
