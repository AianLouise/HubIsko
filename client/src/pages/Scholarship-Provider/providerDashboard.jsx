import React, { useEffect, useState } from 'react';
import ProviderHeaderSidebar from '../../components/ProviderHeaderAndSidebar';
import { BiDotsHorizontal } from 'react-icons/bi';
import { BiSolidRightArrow } from "react-icons/bi";
import { useSelector } from 'react-redux';

export default function ProviderDashboard() {
  useEffect(() => {
    document.title = "Home | HubIsko";
  }, []);

  const { currentUser, loading, error } = useSelector((state) => state.user);
  const orgName = currentUser?.scholarshipProviderDetails.organizationName;

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className={`flex flex-col min-h-screen`}>

      <main className={`flex-grow bg-[#f8f8fb] transition-all duration-200 ease-in-out ${sidebarOpen ? 'ml-64' : ''} `}>
      <ProviderHeaderSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} currentPath={`${currentUser.scholarshipProviderDetails.organizationName} / Dashboard`} />

        <div className='border-b mb-8'>
          <div className={'flex items-center mx-auto justify-between px-24'}>
            <div className='flex flex-col gap-2 w-1/2'>
              <h1 className='text-4xl font-bold text-gray-800'>Welcome {orgName}!</h1>
              <p className='text-lg text-slate-500 font-medium'>Here is your dashboard!</p>
            </div>
            <div className='bg-blue-600 w-36 h-36 my-8 rounded-md overflow-hidden'>
              {currentUser && currentUser.profilePicture ? (
                <img
                  src={currentUser.profilePicture}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-white">
                  No Profile Picture
                </div>
              )}
            </div>
          </div>
        </div>

        <div className='max-w-8xl mx-auto px-24 py-12 gap-10 flex-col flex'>

          <div className='grid grid-cols-2 gap-10'>
            <div className="flex divide-x bg-white p-6 rounded-md shadow-md transition-all">

              <div className='flex flex-col w-1/2 items-center'>
                <h2 className="text-xl font-semibold text-slate-700">Applications Received</h2>
                <p className="text-8xl font-bold flex h-full justify-center items-center">45</p>
              </div>

              <div className='px-4 flex flex-col gap-2 w-full'>
                <span className='font-medium'>Received Applications</span>

                <button className='flex gap-2 justify-between border rounded-md w-full p-2 hover:bg-slate-200'>
                  <div className='flex gap-2 items-center'>
                    <div className='bg-blue-600 w-6 h-6 rounded-md'></div>
                    <span className='font-medium'>Name : <span className='text-blue-600 font-normal'>sent a new application</span></span>
                  </div>

                  <BiDotsHorizontal className='text-blue-600 w-6 h-6' />
                </button>

              </div>
            </div>

            <div className="flex flex-col gap-8">
              <button className="flex justify-between items-center bg-white p-6 rounded-md shadow-md transition-all hover:-translate-y-2 hover:bg-slate-200 group ease-in-out">
                <div>
                  <h2 className="text-xl font-semibold text-slate-700">Total Applications</h2>
                  <p className="text-2xl font-bold text-left">45</p>
                </div>

                <div className='hidden items-center text-blue-600 font-medium gap-2 group-hover:flex ease-in-out transition'>
                  <span>View</span>
                  <BiSolidRightArrow className=' w-6 h-6' />
                </div>

              </button>

              <button className="flex justify-between items-center bg-white p-6 rounded-md shadow-md transition-all hover:-translate-y-2 hover:bg-slate-200 group ease-in-out">
                <div>
                  <h2 className="text-xl font-semibold text-slate-700">Active Applications</h2>
                  <p className="text-2xl font-bold text-left">12</p>
                </div>

                <div className='hidden items-center text-blue-600 font-medium gap-2 group-hover:flex ease-in-out transition'>
                  <span>View</span>
                  <BiSolidRightArrow className=' w-6 h-6' />
                </div>

              </button>
            </div>
          </div>

                   <div className="bg-white p-6 rounded-md shadow-md transition-all">
            <h2 className="text-2xl font-bold text-slate-700 mb-4">Recent Activity</h2>
            <ul className="list-disc pl-5 text-slate-700">
              <li className="mb-2 flex items-center">
                <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                New application received for Scholarship A
              </li>
              <li className="mb-2 flex items-center">
                <span className="inline-block w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                Scholarship B has been updated
              </li>
              <li className="flex items-center">
                <span className="inline-block w-2 h-2 bg-purple-600 rounded-full mr-2"></span>
                New scholarship posted: Scholarship C
              </li>
            </ul>
          </div>
        </div>


      </main>
    </div>
  );
}