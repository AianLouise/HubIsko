import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { FaStar, FaWrench, FaRegHeart, FaRegEye } from 'react-icons/fa';
import { BiCommentDots } from 'react-icons/bi';
import { FaNewspaper } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import ProviderHeaderSidebar from '../../components/ProviderHeaderAndSidebar';

export default function ProviderForums() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
 
  return (
    <div className={`flex flex-col min-h-screen`}>

      <main className={`flex-grow bg-[#f8f8fb] transition-all duration-300 ease-in-out ${sidebarOpen ? 'ml-64' : ''} `}>
      <ProviderHeaderSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

        <div className='border-b mb-8'>
          <div className={'flex items-center mx-auto justify-between px-24'}>
            <div className='flex flex-col gap-2 w-1/2'>
              <h1 className='text-4xl font-bold text-gray-800'>Welcome to the forums!</h1>
              <p className='text-lg text-slate-500 font-medium'>Freely browse discussions here!</p>
            </div>
            <div className='bg-blue-600 w-36 h-36 my-8 rounded-md'></div>
          </div>
        </div>

        <div className='max-w-8xl mx-auto px-24 gap-10 flex-col flex'>

          <div className='flex flex-row justify-between'>
            <div className='flex flex-row items-center justify-center gap-4'>

              <select name="Gender" id="Gender" className='bg-white border rounded-lg p-3 w-60 font-bold text-left'>
                <option value="All posts">All posts</option>
                <option value="My Posts">My posts</option>
              </select>

              <button className='flex gap-2 items-center justify-center bg-blue-600 p-3 rounded-md border hover:bg-blue-800 transition ease-in-out'>
                <FaPlus className='w-5 h-5 text-white' />
                <span className='font-medium text-white'>Create a New post</span>
              </button>
            </div>

            <div>
              <input
                type="text"
                placeholder='Search Posts'
                name=""
                id=""
                className='border-2 p-2 px-6 text-lg font-medium rounded-md focus:outline-blue-400' />
            </div>
          </div>


          <div className='flex gap-2 items-center pb-2 font-bold text-lg border-b mb-8'>
            <FaStar className='text-blue-600' />
            Featured Posts
          </div>

          <div className='grid grid-cols-2 gap-2'>

            <div className='flex flex-col gap-2 px-8 py-6 border rounded-md bg-white shadow'>
              <div className='flex flex-row gap-4 mb-2'>
                <Link to={'/preview-profile'} className='bg-blue-600 rounded-full w-12 h-12 text-white flex items-center justify-center'>
                  <FaWrench className='w-6 h-6' />
                </Link>
                <div className='flex flex-col'>
                  <span className='font-medium'>Admin</span>
                  <span className='text-sm text-slate-500'>July 10, 2024</span>
                </div>
              </div>

              <span className='font-bold'>Frequently Asked Questions (FAQs)</span>
              <span className='text-sm'>This Post contains Questions and Answers regarding forums and scholarship listing.</span>
              <div className='border-t mt-2'>
                <div className='flex flex-row justify-between mt-3 gap-2'>


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


            <div className='flex flex-col gap-2 px-8 py-6 border rounded-md bg-white shadow'>
              <div className='flex flex-row gap-4 mb-2'>
                <div className='bg-blue-600 rounded-full w-12 h-12 text-white flex items-center justify-center'>
                  <FaWrench className='w-6 h-6' />
                </div>
                <div className='flex flex-col'>
                  <span className='font-medium'>Admin</span>
                  <span className='text-sm text-slate-500'>July 10, 2024</span>
                </div>
              </div>

              <span className='font-bold'>System Announcements</span>
              <span className='text-sm'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Lorem ipsum dolor sit.</span>
              <div className='border-t mt-2'>
                <div className='flex flex-row justify-between mt-3 gap-2'>


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

          <div className='flex gap-2 items-center border-b my-4 py-2'>
            <FaNewspaper className='w-6 h-6 text-blue-600' />
            <span className='font-bold text-lg'>Recent posts</span>
          </div>


        </div>


      </main>

    </div>
  );
}
