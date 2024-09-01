import React, { useEffect, useState } from "react";
import { BiFilter } from "react-icons/bi";
import { Link } from "react-router-dom";
import Layout from "../../components/Layout";

export default function ProviderAccounts() {
  useEffect(() => {
    document.title = "Scholarship Provider | HubIsko";
}, []);

  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllProviders = async () => {
      try {
        const response = await fetch('/api/admin/all-providers');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setProviders(data.providers);
      } catch (error) {
        console.error('Error fetching all providers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProviders();
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
    <div className="flex flex-col min-h-screen">
     
      <main className="flex-grow bg-[#f8f8fb] font-medium text-slate-700">
        <div className='border-b mb-8'>
          <div className={'flex items-center mx-auto justify-between px-24'}>
            <div className='flex flex-col gap-2 w-1/2'>
              <h1 className='text-4xl font-bold text-gray-800'>Providers Info</h1>
              <p className='text-lg text-slate-500 font-medium'>This will serve as a storage for Provider's info</p>
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
                  <th className='border border-gray-200 p-2'>Organization</th>
                  <th className='border border-gray-200 p-2'>Email</th>
                  <th className='border border-gray-200 p-2'>Contact Person</th>
                  <th className='border border-gray-200 p-2'>Actions</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {providers.map((provider, index) => (
                  <tr key={provider._id} className="divide-x">
                    <td className='p-2'>{index + 1}</td>
                    <td className='p-2'>{provider.scholarshipProviderDetails.organizationName}</td>
                    <td className='p-2'>{provider.email}</td>
                    <td className='p-2'>{provider.scholarshipProviderDetails.contactPersonName}</td>
                    <td className='py-4'>
                      <Link to={`/provider-details/${provider._id}`} className='bg-blue-600 hover:bg-blue-800 px-4 py-2 rounded-md text-white'>View Details</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}