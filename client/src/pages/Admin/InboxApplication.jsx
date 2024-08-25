import React, { useState, useEffect } from "react";
import { BiFilter } from "react-icons/bi";
import { GoDotFill } from "react-icons/go";
import { Link } from "react-router-dom";

export default function InboxApplication() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a fetch call
    const fetchData = async () => {
      try {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <svg className="animate-spin h-10 w-10 text-blue-600" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen font-medium text-slate-700">
      <main className="flex-grow bg-[#f8f8fb]">
        <div className='border-b mb-8'>
          <div className={'flex items-center mx-auto justify-between px-24'}>
            <div className='flex flex-col gap-2 w-1/2'>
              <h1 className='text-4xl font-bold text-gray-800'>Applications</h1>
            </div>
            <div className='bg-blue-600 w-36 h-36 my-8 rounded-md'></div>
          </div>
        </div>
        <div className='max-w-8xl mx-auto px-24 gap-2 flex-col flex'>
          <div className="flex flex-col gap-4">
            <span>Organizations with Scholarship Activities</span>
            <div className="flex gap-2">
              <div className="flex flex-col items-center">
                <Link to={'/student-details'} className="bg-blue-600 w-16 h-16 rounded-full hover:border-blue-400 hover:border-2"></Link>
                <span>DepEd</span>
                <div className="flex text-sm justify-center items-center">
                  <GoDotFill className="text-blue-600 w-4 h-4" />
                  <span>+20</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button className=" bg-blue-600 rounded-md p-2  text-white flex gap-2">
              <BiFilter className="w-6 h-6" /> Filter
            </button>
            <input 
              type="text"
              placeholder="Search in the inbox..."
              className="border border-gray-300 rounded-md p-2 pr-8"
            />
          </div>
          <table className='w-full mt-4 rounded-md border border-gray-200'>
            <thead className="border-2 rounded-md">
              <tr className='bg-slate-100'>
                <th className='border border-gray-200 p-2'>Name</th>
                <th className='border border-gray-200 p-2'>Email</th>
                <th className="border border-gray-200 p-2">Address</th>
                <th className='border border-gray-200 p-2'>Organization Applied to</th>
                <th className='border border-gray-200 p-2'>Date</th>
                <th className='border border-gray-200 p-2'>Action</th>
              </tr>
            </thead>
            <tbody className="text-center">
              <tr className="divide-x">
                <td className='p-2'>John Doe</td>
                <td className='p-2'>sample@email.com</td>
                <td className='p-2'>123 Street</td>
                <td className='p-2'>DepEd</td>
                <td className='p-2'>1/11/11</td>
                <td className="py-4">
                  <Link to={''} className="bg-blue-600 hover:bg-blue-800 px-4 py-2 rounded-md text-white">View Details</Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}