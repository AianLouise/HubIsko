import React, { useState } from "react";
import { BiFilter } from "react-icons/bi";


export default function Students() {

    return (
        <div className="flex flex-col min-h-screen">
            
        <main className="flex-grow bg-[#f8f8fb]">
        <div className='border-b mb-8'>
          <div className={'flex items-center mx-auto justify-between px-24'}>
            <div className='flex flex-col gap-2 w-1/2'>
              <h1 className='text-4xl font-bold text-gray-800'>Students Info</h1>
              <p className='text-lg text-slate-500 font-medium'>This will serve as a storage for student's info</p>
            </div>
            <div className='bg-blue-600 w-36 h-36 my-8 rounded-md'></div>
          </div>
        </div>

        <div className='max-w-8xl mx-auto px-24 gap-10 flex-col flex'>

          <div className='flex items-center gap-4'>
            <input
              type="text"
              className='border border-gray-300 rounded-md p-2 pr-8'
              placeholder='Search for students...'
            />

            <button className='bg-blue-600 px-4 py-2 rounded-md flex gap-2 text-white'>
              <BiFilter className='w-6 h-6' />
              <span>Filter</span>
            </button>
          </div>

          {/* TABLE */}

          <div className='overflow-x-auto rounded-md bg-white shadow'>
            <table className='w-full border-2 border-gray-200'>
              <thead>
                <tr className='bg-slate-100'>
                  <th className='border border-gray-200'>#No</th>
                  <th className='border border-gray-200 p-2'>Name</th>
                  <th className='border border-gray-200 p-2'>Email</th>
                  <th className='border border-gray-200 p-2'>Date</th>
                  <th className='border border-gray-200 p-2'>Status</th>
                  <th className='border border-gray-200 p-2'>Actions</th>
                </tr>
              </thead>
              <tbody>

              </tbody>
            </table>

          </div>


            </div>
        </main>
        </div>
    );
}