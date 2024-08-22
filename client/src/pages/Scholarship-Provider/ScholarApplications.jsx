import React, { useEffect, useState } from 'react';
import { BiFilter } from 'react-icons/bi';
import ProviderHeaderSidebar from '../../components/ProviderHeaderAndSidebar';
import { useSelector } from 'react-redux';

export default function ScholarApplications() {
  const { currentUser } = useSelector((state) => state.user);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch(`/api/scholarshipProgram/provider/${currentUser._id}/applications`);
        if (!response.ok) {
          throw new Error('Failed to fetch applications');
        }
        const data = await response.json();
        setApplications(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [currentUser._id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className={`flex flex-col min-h-screen`}>
      <main className={`flex-grow bg-[#f8f8fb] transition-all duration-200 ease-in-out ${sidebarOpen ? 'ml-64' : ''} `}>
        <ProviderHeaderSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} currentPath={`${currentUser.scholarshipProviderDetails.organizationName} / Applications`} />
        <div className='border-b mb-8'>
          <div className={'flex items-center mx-auto justify-between px-24'}>
            <div className='flex flex-col gap-2 w-1/2'>
              <h1 className='text-4xl font-bold text-gray-800'>Application Page</h1>
              <p className='text-lg text-slate-500 font-medium'>This will serve as an inbox for applications</p>
            </div>
            <div className='bg-blue-600 w-36 h-36 my-8 rounded-md'></div>
          </div>
        </div>

        <div className='max-w-8xl mx-auto px-24 gap-10 flex-col flex'>
          <div className='flex items-center gap-4'>
            <input
              type="text"
              className='border border-gray-300 rounded-md p-2 pr-8'
              placeholder='Search for applications...'
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
                  <th className='border border-gray-200 p-2 '>#No</th>
                  <th className='border border-gray-200 p-2 '>Name</th>
                  <th className='border border-gray-200 p-2 '>Scholarship Program</th>
                  <th className='border border-gray-200 p-2 '>Date</th>
                  <th className='border border-gray-200 p-2 '>Status</th>
                  <th className='border border-gray-200 p-2 '>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((application, index) => (
                  <tr key={application._id} className='hover:bg-gray-100 text-center'>
                    <td className='border border-gray-200 p-2'>{index + 1}</td>
                    <td className='border border-gray-200 p-2'>{`${application.firstName} ${application.lastName}`}</td>
                    <td className='border border-gray-200 p-2'>{application.scholarshipProgram.title}</td>
                    <td className='border border-gray-200 p-2'>{new Date(application.appliedOn).toLocaleDateString()}</td>
                    <td className='border border-gray-200 p-2'>
                      <span className={`px-2 py-1 rounded-full text-white ${application.applicationStatus === 'Approved' ? 'bg-green-500' : application.applicationStatus === 'Pending' ? 'bg-yellow-500' : 'bg-red-500'}`}>
                        {application.applicationStatus}
                      </span>
                    </td>
                    <td className='border border-gray-200 p-2'>
                      <div className='flex justify-center gap-2'>
                        <button className='bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600'>Review Application</button>
                      </div>
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