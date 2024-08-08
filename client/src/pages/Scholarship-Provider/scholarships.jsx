import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import ProviderHeaderSidebar from '../../components/ProviderHeaderAndSidebar';


export default function Scholarships() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
 
  return (
    <div className={`flex flex-col min-h-screen`}>

      <main className={`flex-grow bg-[#f8f8fb] transition-all duration-200 ease-in-out ${sidebarOpen ? 'ml-64' : ''} `}>
      <ProviderHeaderSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

        <div className='border-b mb-8'>
          <div className={'flex gap-2 items-center mx-auto px-24 h-36'}>

            <h1 className='text-4xl font-bold text-gray-800'>Scholarship Program(s): </h1>
            <span className='text-blue-600 text-4xl my-8 rounded-md font-bold'> 50</span>

          </div>
        </div>

        <div className='max-w-8xl mx-auto px-24 gap-10 flex-col flex'>


          <div className='flex justify-between'>

            <Link to='/post-scholarship'>
              <button className='bg-blue-600 text-white px-8 py-4 shadow rounded-md flex items-center gap-2 hover:bg-blue-800'>
                <FontAwesomeIcon icon={faPlus} className='w-4 h-4' />
                <span>Post a Scholarship</span>
              </button>
            </Link>

            <input
              type="text"
              placeholder='Search scholarships...'
              className='border-2 rounded-md px-4 py-2 w-96 focus:border-white focus:outline-blue-600'
            />
          </div>


          <div className='grid grid-cols-3 gap-8'>

            <div className='bg-white rounded-md shadow'>
              <div className='bg-blue-600 w-full h-36 rounded-t-md'></div>
              <div className='p-4'>
                <div className='flex justify-between items-center'>
                  <h1 className='text-xl font-bold text-gray-800'>Scholarship Name</h1>
                  <span className='text-xl'>0/50</span>
                </div>
                <span className='text-slate-600'>Php 50,000 ~ 80,000</span>
                <p className='text-gray-500'>Description of the scholarship</p>
                <div className='flex justify-between items-center mt-4'>
                  <button className='text-blue-600 font-bold border hover:bg-slate-200 px-4 rounded-md'>View Details</button>
                  <span className='text-gray-500'>Deadline: 12/12/2021</span>
                </div>
              </div>
            </div>

            <div className='bg-white rounded-md shadow'>
              <div className='bg-blue-600 w-full h-36 rounded-t-md'></div>
              <div className='p-4'>
                <div className='flex justify-between items-center'>
                  <h1 className='text-xl font-bold text-gray-800'>Scholarship Name</h1>
                  <span className='text-xl text-red-600'>50/50</span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-slate-600'>Php 50,000 ~ 80,000</span>
                  {/* IF 50/50 */}
                  <span className='text-red-600'>Slots full</span>
                </div>
                <p className='text-gray-500'>Description of the scholarship</p>
                <div className='flex justify-between items-center mt-4'>
                  <button className='text-blue-600 font-bold border hover:bg-slate-200 px-4 rounded-md'>View Details</button>
                  <span className='text-gray-500'>Deadline: 12/12/2021</span>
                </div>
              </div>
            </div>

            <div className='bg-white rounded-md shadow'>
              <div className='bg-blue-600 w-full h-36 rounded-t-md'></div>
              <div className='p-4'>
                <div className='flex justify-between items-center'>
                  <h1 className='text-xl font-bold text-gray-800'>Scholarship Name</h1>
                  <span className='text-lg text-yellow-500'>Pending for Approval</span>
                </div>
                <span className='text-slate-600'>Php 50,000 ~ 80,000</span>
                <p className='text-gray-500'>Description of the scholarship</p>
                <div className='flex justify-between items-center mt-4'>
                  <button className='text-blue-600 font-bold border hover:bg-slate-200 px-4 rounded-md'>View Details</button>
                  <span className='text-gray-500'>Deadline: 12/12/2021</span>
                </div>
              </div>
            </div>

          </div>


        </div>
      </main>
    </div>
  );
}
