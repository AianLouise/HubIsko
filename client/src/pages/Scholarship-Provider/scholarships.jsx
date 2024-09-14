import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import ProviderHeaderSidebar from '../../components/ProviderHeaderAndSidebar';
import { useSelector } from 'react-redux';
import { LuArchive } from "react-icons/lu";
import { MdOutlinePlayLesson } from "react-icons/md";
import { MdOutlinePendingActions } from "react-icons/md";
import { FaRegThumbsUp } from "react-icons/fa";



export default function Scholarships() {
  useEffect(() => {
    document.title = "Scholarship Program | HubIsko";
  }, []);

  const { currentUser } = useSelector((state) => state.user);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const [showMessage, setShowMessage] = useState(false);

  const handleClick = (e) => {
    if (currentUser?.status !== 'Verified') {
      e.preventDefault(); // Prevent the default link behavior
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000); // Hide the message after 3 seconds
    }
  };

  const [filter, setFilter] = useState('All');

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const filteredScholarships = scholarships.filter((scholarship) => {
    if (filter === 'All') return true;
    if (filter === 'Completed') return scholarship.status === 'Completed';
    if (filter === 'Pending') return scholarship.status === 'Pending Approval';
    return false;
  });

    // Calculate the number of ongoing programs
    const ongoingPrograms = Array.isArray(scholarships)
    ? scholarships.filter(scholarship => scholarship.status === 'Ongoing').length
    : 0;

  // Calculate the number of pending verifications
  const pendingVerifications = Array.isArray(scholarships)
    ? scholarships.filter(scholarship => scholarship.status === 'Pending Verification').length
    : 0;

  // Calculate the service rating (example: average rating from user feedback)
  const serviceRating = Array.isArray(scholarships) && scholarships.length > 0
    ? (scholarships.reduce((acc, scholarship) => acc + (scholarship.rating || 0), 0) / scholarships.length).toFixed(2)
    : 'N/A';

  const truncateDescription = (description, maxLength) => {
    if (description.length <= maxLength) {
      return description;
    }
    return description.substring(0, maxLength) + '...';
  };

  return (
    <div className={`flex flex-col min-h-screen`}>
      <main className={`flex-grow bg-[#f8f8fb] transition-all duration-200 ease-in-out ${sidebarOpen ? 'ml-64' : ''} `}>
        <ProviderHeaderSidebar
          sidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
          currentPath={`${currentUser.scholarshipProviderDetails.organizationName} / Scholarship Program`}
        />

        {/* Status Check */}
        {currentUser?.status === 'Pending Verification' && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 m-6 rounded-md" role="alert">
            <p className="font-bold">Account Under Verification</p>
            <p>Your account is currently under verification. Some features may be restricted until your account is fully verified.</p>
          </div>
        )}

        <div className='h-[250px]'>
          <div className='bg-blue-600 text-white'>
            <div className={'flex gap-2 mx-auto px-24 h-44'}>
              <div className='flex items-center justify-between w-full h-28'>
                <h1 className='text-2xl font-bold '>Scholarship Programs</h1>

                {showMessage && (
                  <div className="fixed top-4 right-4 bg-yellow-100 text-yellow-700 border-l-4 border-yellow-500 px-4 py-2 rounded shadow-lg fade-out">
                    Your account is under verification. You cannot post a scholarship at this time.
                  </div>
                )}
                <Link to='/post-scholarship' onClick={handleClick}>
                  <button className='bg-white text-blue-600 px-4 py-2 shadow rounded-md font-medium flex items-center gap-2 hover:bg-slate-200'>
                    <FontAwesomeIcon icon={faPlus} className='w-4 h-4' />
                    <span>Post a Scholarship</span>
                  </button>
                </Link>
              </div>

            </div>
          </div>

          <div className='px-24 grid grid-cols-4 gap-5 -translate-y-20'>
            <div className='flex flex-col gap-3 bg-white border shadow p-8 py-6 rounded-md'>
              <div className='flex justify-between items-center'>
                <h1 className='text-base font-medium'>All Programs</h1>
                <div className='bg-blue-200 px-3 py-2 rounded-md'>
                  <LuArchive className='text-2xl text-blue-600' />
                </div>
              </div>
              <span className='text-4xl font-bold tracking-wide'>{Array.isArray(scholarships) ? scholarships.length : 0}</span>
            </div>

            <div className='flex flex-col gap-3 bg-white border shadow p-8 py-6 rounded-md'>
              <div className='flex justify-between items-center'>
                <h1 className='text-base font-medium'>Ongoing Programs</h1>
                <div className='bg-blue-200 px-3 py-2 rounded-md'>
                  <MdOutlinePlayLesson className='text-2xl text-blue-600' />
                </div>
              </div>
              <span className='text-4xl font-bold tracking-wide'>{ongoingPrograms}</span>
            </div>

            <div className='flex flex-col gap-3 bg-white border shadow p-8 py-6 rounded-md'>
              <div className='flex justify-between items-center'>
                <h1 className='text-base font-medium'>Pending Verifications</h1>
                <div className='bg-blue-200 px-3 py-2 rounded-md'>
                  <MdOutlinePendingActions className='text-2xl text-blue-600' />
                </div>
              </div>
              <span className='text-4xl font-bold tracking-wide'>{pendingVerifications}</span>
            </div>

            <div className='flex flex-col gap-3 bg-white border shadow p-8 py-6 rounded-md'>
              <div className='flex justify-between items-center'>
                <h1 className='text-base font-medium'>Service Rating</h1>
                <div className='bg-blue-200 px-3 py-2 rounded-md'>
                  <FaRegThumbsUp className='text-2xl text-blue-600' />
                </div>
              </div>
              <span className='text-4xl font-bold tracking-wide'>{serviceRating}%</span>
            </div>
          </div>

        </div>

        <div className='max-w-8xl mx-auto px-24 mt-4 flex-col flex'>
          <div className='flex gap-10'>
            {loading ? (
              <div className="flex justify-center items-center h-screen">
                <svg className="animate-spin h-10 w-10 text-blue-600" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
              </div>
            ) : error ? (
              <div className="flex justify-center items-center h-screen">
                <p className="text-red-600 font-bold">{error}</p>
              </div>
            ) : !Array.isArray(scholarships) || scholarships.length === 0 ? (
              <div className="flex justify-center items-center h-full">
                <p className="text-gray-600 font-medium">No scholarships available at the moment.</p>
              </div>
            ) : (
              <div className="overflow-x-auto border shadow rounded-md bg-white w-full">
                <div className="flex justify-between p-6 border-b items-center">
                  <div className='flex gap-2 font-medium text-sm'>
                    <button
                      className={`border shadow rounded-md hover:bg-slate-200 px-4 py-2 ${filter === 'All' ? 'bg-slate-200' : ''}`}
                      onClick={() => handleFilterChange('All')}
                    >
                      All <span className='text-blue-600'>({scholarships.length})</span>
                    </button>

                    <button
                      className={`border shadow rounded-md hover:bg-slate-200 px-4 py-2 ${filter === 'Completed' ? 'bg-slate-200' : ''}`}
                      onClick={() => handleFilterChange('Completed')}
                    >
                      Completed <span className='text-green-600'>({scholarships.filter(scholarship => scholarship.status === 'Completed').length})</span>
                    </button>

                    <button
                      className={`border shadow rounded-md hover:bg-slate-200 px-4 py-2 ${filter === 'Pending' ? 'bg-slate-200' : ''}`}
                      onClick={() => handleFilterChange('Pending')}
                    >
                      Pending <span className='text-yellow-600'>({scholarships.filter(scholarship => scholarship.status === 'Pending Approval').length})</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder='Search Scholarships'
                    className='p-2 border rounded-md'
                  />
                </div>

                <div className="max-h-[400px] overflow-y-auto">
                  <table className="divide-y w-full divide-gray-200">
                    <thead className="bg-slate-50 text-slate-700 border-b font-bold sticky top-0">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs uppercase tracking-wider">
                          Title
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs uppercase tracking-wider">
                          Amount
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredScholarships.map((scholarship) => (
                        <tr key={scholarship._id}>
                          <td className="px-6 flex gap-4 items-center py-4 whitespace-nowrap">
                            <div
                              className='w-16 h-16 rounded-md'
                              style={{
                                backgroundImage: `url(${scholarship.bannerImage})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                              }}
                            ></div>

                            <h1 className='text-base font-medium text-gray-800'>{scholarship.title}</h1>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`text-base font-medium ${scholarship.numberOfScholarshipsSlotFilled === scholarship.numberOfScholarships ? 'text-red-600' : ''} ${scholarship.status === 'Pending Approval' ? 'bg-yellow-100 text-[#ffb048] font-semibold text-sm px-4 py-2 rounded-md' : ''} ${scholarship.status === 'Active' ? 'bg-green-100 text-green-600 font-semibold text-sm px-4 py-2 rounded-md' : ''} ${scholarship.status === 'Closed' ? 'bg-gray-50 text-gray-500 font-semibold text-sm px-4 py-2 rounded-md' : ''} ${scholarship.status === 'Archived' ? 'bg-blue-50 text-blue-500 font-semibold text-sm px-4 py-2 rounded-md ' : ''} ${scholarship.status === 'Cancelled' ? 'bg-red-50 text-red-500 font-semibold text-sm px-4 py-2 rounded-md' : ''} ${scholarship.status === 'Completed' ? 'bg-purple-50 text-purple-500 font-semibold text-sm px-4 py-2 rounded-md' : ''}`}>
                              {scholarship.status === 'Pending Approval' ? 'Pending Approval' : `${scholarship.numberOfScholarshipsSlotFilled}/${scholarship.numberOfScholarships}`}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className='text-slate-600'>{scholarship.amount}</span>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            <Link to={`/view-scholarships/${scholarship._id}`} className='text-blue-600 font-bold border text-sm hover:bg-slate-200 px-4 py-1 rounded-md'>
                              View Details
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className='flex flex-col bg-white border shadow rounded-md p-6 w-1/2'>
              <h1 className='font-bold'>Performance graph</h1>

              <div className='flex justify-center items-center my-4 w-full h-full border rounded-md'>
                <span>Filler</span>
              </div>

            </div>

          </div>
        </div>


      </main>
    </div>
  );
}
