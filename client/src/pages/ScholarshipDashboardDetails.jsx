import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FaAngleRight } from 'react-icons/fa';
import { FaRegHeart, FaRegEye } from 'react-icons/fa';
import { BiCommentDots } from 'react-icons/bi';
import { BsArrowLeft } from 'react-icons/bs';


export default function ScholarshipDashboardDetails() {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('scholars');

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };
 
return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-[#f8f8fb]">
        <div className='flex flex-col gap-4 py-12 max-w-6xl mx-auto justify-between p-4 lg:px-24'>

            <div className='flex gap-2 font-medium'>
                <Link to='/scholar-dashboard' className='text-blue-600 flex gap-2 items-center hover:bg-slate-200 bg-white shadow rounded-md border px-6 py-2'>
                <BsArrowLeft className='w-6 h-6' /> Back to
                Scholarship Dashboard</Link>
            </div>

            <div className='flex flex-col items-center'>
                <div className="w-32 h-32 bg-blue-600 rounded-full mb-4 shadow-lg"></div>
                <span className='text-3xl font-bold'>Scholarship Title</span>
            </div>

            <div className="tabs flex justify-center border-b mb-6">
                        {[
                            { label: 'View Scholars', value: 'scholars' },
                            { label: 'Post Announcement', value: 'announcement' },
                            { label: 'Validation', value: 'validation' },
                        ].map((tab) => (
                            <button
                                key={tab.value}
                                className={`tab px-4 py-2 mx-2 transition-colors duration-300 ${activeTab === tab.value
                                    ? 'border-b-2 border-blue-600 text-blue-600'
                                    : 'text-gray-600 hover:text-blue-600'
                                    }`}
                                onClick={() => handleTabChange(tab.value)}
                            >
                                {tab.label}
                            </button>
                        ))}
            </div>

            <div className='content'>
                {activeTab === 'scholars' && (
                    <div className='flex flex-col gap-4'>
                        <div className='flex justify-between items-center gap-4'>
                            <span className='text-2xl font-bold'>Scholars <span className='text-blue-600'>(0)</span></span>
                          
                            <div className='flex gap-4'>
                                <input type="text" placeholder='Search Scholar' className='border p-2 rounded-md' />
                            </div>
                        </div>

                        <div className="overflow-y-auto bg-white p-4 rounded-md shadow border max-h-[800] h-64">
                        <table className="min-w-full divide-y divide-gray-200">
                                <thead className='text-left'>
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>

                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>

                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">University</th>

                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>

                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap">John Doe</td>
                                        <td className="px-6 py-4 whitespace-nowrap">SampleEmail.com</td>
                                        <td className="px-6 py-4 whitespace-nowrap">School ng Mang Tomas</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                        <button className='flex gap-2 items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition ease-in-out'>
                                            View Profile
                                            <FaAngleRight className='w-5 h-5' />
                                            </button>
                                        </td>

                                   
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div> 
                    )}

                    {activeTab === 'announcement' && (
                        <div className='flex flex-col gap-4'>
                            <div className='flex justify-between items-center gap-4'>
                                <span className='text-2xl font-bold'>Announcements</span>
                                <div className="flex gap-2 items-center bg-white shadow px-6 py-2 rounded-md border text-md">
                                    <input type="text" 
                                    placeholder="Search Announcements" 
                                    className="w-full bg-transparent outline-none" />
                                </div>
                            </div>
                            
                            <div className='grid grid-cols-3 gap-10'> 
                                <div className='bg-white border p-4 rounded-md flex flex-col gap-4 hover:-translate-y-1 hover:shadow-lg transition ease-in-out'>

                                    <div className='flex gap-2'>
                                    <div className='bg-blue-600 w-12 h-12 rounded-md'></div>
                                    <div className='flex flex-col'>
                                        <span className='font-bold'>Organization Name</span>
                                        <span className='text-blue-600'>Scholarship Title</span>
                                    </div>
                                    </div>

                                    <p className='bg-slate-200 p-4 rounded-md'><span className='text-blue-600 font-bold'>@Students</span> Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi, vel.</p>
                                    <span className='text-sm flex items-end justify-end w-full text-slate-600'>Announced: July 7,2024</span>
                                    <div className='border-t mt-2'>
                                    <div className='flex flex-row justify-between mt-2 gap-2'>
                                        <div className='flex flex-row gap-2'>
                                        <div className='flex flex-row gap-1 px-2'>
                                            <FaRegHeart className='w-6 h-6 font-bold text-blue-600' />
                                            <span>123</span>
                                        </div>
                                        <div className='flex flex-row gap-1'>
                                            <BiCommentDots className='w-6 h-6 text-blue-600' />
                                            <span>10</span>
                                        </div>
                                        </div>
                                        <div className='flex flex-row gap-1 pr-2'>
                                        <FaRegEye className='w-6 h-6 text-blue-600' />
                                        <span>1.2k</span>
                                        </div>
                                    </div>
                                    </div>
                                </div>
                            </div>
                                                
                        </div>
                    )}

                    {activeTab === 'validation' && (
                        <div>
                            <div className='bg-white rounded-md shadow border p-4'>

                                Container for Validation

                            </div>

                        </div>
                        
                        )}


            </div>

        </div>
      </main>
      <Footer />
    </div>

    );
}
