import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import ProviderHeaderSidebar from '../../components/ProviderHeaderAndSidebar';
import { useSelector } from 'react-redux';

export default function Scholarships() {
  const { currentUser } = useSelector((state) => state.user);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    const fetchScholarships = async () => {
      if (currentUser && currentUser._id) {
        try {
          const response = await fetch(`/api/scholarshipProgram/provider/${currentUser._id}`);
          const data = await response.json();
          setScholarships(data);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching scholarships:', error);
          setError('Failed to fetch scholarships');
          setLoading(false);
        }
      }
    };

    fetchScholarships();
  }, [currentUser]);

  return (
    <div className={`flex flex-col min-h-screen`}>
      <main className={`flex-grow bg-[#f8f8fb] transition-all duration-200 ease-in-out ${sidebarOpen ? 'ml-64' : ''} `}>
        <ProviderHeaderSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

        <div className='border-b mb-8'>
          <div className={'flex gap-2 items-center mx-auto px-24 h-36'}>
            <h1 className='text-4xl font-bold text-gray-800'>Scholarship Program(s): </h1>
            <span className='text-blue-600 text-4xl my-8 rounded-md font-bold'>{Array.isArray(scholarships) ? scholarships.length : 0}</span>
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

          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div>Error: {error}</div>
          ) : !Array.isArray(scholarships) || scholarships.length === 0 ? (
            <div className="flex justify-center items-center h-full">
              No scholarships available at the moment.
            </div>
          ) : (
            <div className='grid grid-cols-3 gap-8'>
              {scholarships.map((scholarship) => (
                <div key={scholarship._id} className='bg-white rounded-md shadow'>
                  <div className='bg-blue-600 w-full h-36 rounded-t-md'></div>
                  <div className='p-4'>
                    <div className='flex justify-between items-center'>
                      <h1 className='text-xl font-bold text-gray-800'>{scholarship.title}</h1>
                      <span className={`text-xl ${scholarship.slotsFilled === scholarship.totalSlots ? 'text-red-600' : ''}`}>
                        {scholarship.slotsFilled}/{scholarship.totalSlots}
                      </span>
                    </div>
                    <span className='text-slate-600'>{scholarship.amount}</span>
                    <p className='text-gray-500'>{scholarship.description}</p>
                    <div className='flex justify-between items-center mt-4'>
                      <button className='text-blue-600 font-bold border hover:bg-slate-200 px-4 rounded-md'>View Details</button>
                      <span className='text-gray-500'>Deadline: {scholarship.deadline}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
