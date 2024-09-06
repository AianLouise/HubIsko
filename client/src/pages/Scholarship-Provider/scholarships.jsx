import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import ProviderHeaderSidebar from '../../components/ProviderHeaderAndSidebar';
import { useSelector } from 'react-redux';

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

        <div className='border-b mb-8'>
          <div className={'flex gap-2 items-center mx-auto px-24 h-36'}>
            <h1 className='text-4xl font-bold text-gray-800'>Scholarship Program(s): </h1>
            <span className='text-blue-600 text-4xl my-8 rounded-md font-bold'>{Array.isArray(scholarships) ? scholarships.length : 0}</span>
          </div>
        </div>

        <div className='max-w-8xl mx-auto px-24 py-12 gap-10 flex-col flex'>

          <div className='flex justify-between items-center mb-6'>
            {showMessage && (
              <div className="fixed top-4 right-4 bg-yellow-100 text-yellow-700 border-l-4 border-yellow-500 px-4 py-2 rounded shadow-lg fade-out">
                Your account is under verification. You cannot post a scholarship at this time.
              </div>
            )}
            <Link to='/post-scholarship' onClick={handleClick}>
              <button className='bg-blue-600 text-white px-8 py-4 shadow rounded-md flex items-center gap-2 hover:bg-blue-800'>
                <FontAwesomeIcon icon={faPlus} className='w-4 h-4' />
                <span>Post a Scholarship</span>
              </button>
            </Link>

            <input
              type="text"
              placeholder='Search scholarships...'
              className='border-2 rounded-md px-4 py-2 w-96 focus:border-blue-600 focus:outline-none'
            />
          </div>

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
            <div className='grid grid-cols-3 gap-8'>
              {scholarships.map((scholarship) => (
                <div key={scholarship._id} className='bg-white rounded-md shadow hover:shadow-lg transition-shadow duration-300'>
                  <div
                    className='w-full h-36 rounded-t-md'
                    style={{
                      backgroundImage: `url(${scholarship.bannerImage})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  ></div>
                  <div className='p-4'>
                    <div className='flex justify-between items-center mb-2'>
                      <h1 className='text-lg font-bold text-gray-800'>{scholarship.title}</h1>
                    </div>
                    <span className='text-slate-600 block mb-2'>{scholarship.amount}</span>
                    <p className='text-gray-500 mb-4'>{truncateDescription(scholarship.description, 100)}</p>
                    <div className='flex justify-between items-center'>
                      <Link to={`/view-scholarships/${scholarship._id}`} className='text-blue-600 font-bold border hover:bg-slate-200 px-4 py-1 rounded-md'>
                        View Details
                      </Link>
                      <span className={`text-base font-semibold ${scholarship.numberOfScholarshipsSlotFilled === scholarship.numberOfScholarships ? 'text-red-600' : ''} ${scholarship.status === 'Pending Approval' ? 'text-yellow-500' : ''} ${scholarship.status === 'Active' ? 'text-green-500' : ''} ${scholarship.status === 'Closed' ? 'text-gray-500' : ''} ${scholarship.status === 'Archived' ? 'text-blue-500' : ''} ${scholarship.status === 'Cancelled' ? 'text-red-500' : ''} ${scholarship.status === 'Completed' ? 'text-purple-500' : ''}`}>
                        {scholarship.status === 'Pending Approval' ? 'Pending Approval' : `${scholarship.numberOfScholarshipsSlotFilled}/${scholarship.numberOfScholarships}`}
                      </span>
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
