import React, { useEffect, useState } from 'react';
import { BiFilter } from 'react-icons/bi';
import ProviderHeaderSidebar from '../../components/ProviderHeaderAndSidebar';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { IoDocuments } from 'react-icons/io5';

export default function ScholarApplications() {
  useEffect(() => {
    document.title = "Applications | HubIsko";
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  });


  const { currentUser } = useSelector((state) => state.user);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('Recent');

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

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSortChange = () => {
    setSortOrder((prevSortOrder) => (prevSortOrder === 'Recent' ? 'Oldest' : 'Recent'));
  };

  const filteredApplications = applications
    .filter((application) => {
      if (filter === 'All') return true;
      return application.applicationStatus === filter;
    })
    .filter((application) => {
      const fullName = `${application.applicantDetails.firstName} ${application.applicantDetails.lastName}`.toLowerCase();
      const scholarshipTitle = application.scholarshipProgram.title.toLowerCase();
      return fullName.includes(searchQuery.toLowerCase()) || scholarshipTitle.includes(searchQuery.toLowerCase());
    })
    .sort((a, b) => {
      if (sortOrder === 'Recent') {
        return new Date(b.submissionDate) - new Date(a.submissionDate);
      } else {
        return new Date(a.submissionDate) - new Date(b.submissionDate);
      }
    });

  return (
    <div className="flex flex-col min-h-screen">
      <main className={`flex-grow bg-[#f8f8fb] transition-all duration-200 ease-in-out ${sidebarOpen ? 'ml-64' : ''}`}>
        <ProviderHeaderSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} currentPath={`${currentUser.scholarshipProviderDetails.organizationName} / Applications`} />

        {/* Status Check */}
        {currentUser?.status === 'Pending Verification' && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 m-6 rounded-md" role="alert">
            <p className="font-bold">Account Under Verification</p>
            <p>Your account is currently under verification. Some features may be restricted until your account is fully verified.</p>
          </div>
        )}

        <div className="border-b mb-8">
          <div className="flex items-center mx-auto justify-between px-24">
            <div className="flex flex-col gap-2 w-1/2">
              <h1 className="text-4xl font-bold text-gray-800">Application Dashboard</h1>
              <p className="text-lg text-slate-500 font-medium">Manage and review all incoming scholarship applications here.</p>
            </div>
            <div className="bg-blue-600 w-36 h-36 my-8 rounded-md flex items-center justify-center">
              <IoDocuments className="text-white text-6xl" />
            </div>
          </div>
        </div>

        <div className="max-w-8xl mx-auto px-24 flex-col flex min-h-screen py-4">
          <div className="flex justify-between items-center gap-4">
            <div className='flex gap-2 font-medium text-sm'>
              <button
                className={`border shadow rounded-md px-4 py-2 ${filter === 'All' ? 'bg-slate-200' : 'hover:bg-slate-200'}`}
                onClick={() => handleFilterChange('All')}
              >
                All <span className='text-blue-600'>({applications.filter(app => app.applicationStatus === 'All' || filter === 'All').length})</span>
              </button>

              <button
                className={`border shadow rounded-md px-4 py-2 ${filter === 'Approved' ? 'bg-slate-200' : 'hover:bg-slate-200'}`}
                onClick={() => handleFilterChange('Approved')}
              >
                Approved <span className='text-green-600'>({applications.filter(app => app.applicationStatus === 'Approved').length})</span>
              </button>

              <button
                className={`border shadow rounded-md px-4 py-2 ${filter === 'Pending' ? 'bg-slate-200' : 'hover:bg-slate-200'}`}
                onClick={() => handleFilterChange('Pending')}
              >
                Pending <span className='text-yellow-600'>({applications.filter(app => app.applicationStatus === 'Pending').length})</span>
              </button>

              <button
                className={`border shadow rounded-md px-4 py-2 ${filter === 'Rejected' ? 'bg-slate-200' : 'hover:bg-slate-200'}`}
                onClick={() => handleFilterChange('Rejected')}
              >
                Rejected <span className='text-red-600'>({applications.filter(app => app.applicationStatus === 'Rejected').length})</span>
              </button>
            </div>

            <div className='flex gap-2'>
              <input
                type="text"
                className="border border-gray-300 rounded-md p-2 pr-8 focus:outline-blue-600 focus:border-blue-600"
                placeholder="Search for applications..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <button
                className="bg-blue-600 px-4 py-2 rounded-md flex gap-2 text-white hover:bg-blue-700"
                onClick={handleSortChange}
              >
                <BiFilter className="w-6 h-6" />
                <span>{sortOrder === 'Recent' ? 'Sort by Oldest' : 'Sort by Recent'}</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-md bg-white shadow mt-6">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <svg className="animate-spin h-10 w-10 text-blue-600" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
              </div>
            ) : filteredApplications.length === 0 ? (
              <div className="p-6 text-center text-gray-500">No applications available at the moment.</div>
            ) : (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="border border-gray-200 p-2 text-left">No</th>
                    <th className="border border-gray-200 p-2 text-left">Name</th>
                    <th className="border border-gray-200 p-2 text-left">Scholarship Program</th>
                    <th className="border border-gray-200 p-2 text-left">Date</th>
                    <th className="border border-gray-200 p-2 text-left">Status</th>
                    <th className="border border-gray-200 p-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.map((application, index) => (
                    <tr key={application._id} className="hover:bg-gray-100">
                      <td className="border border-gray-200 p-2">{index + 1}</td>
                      <td className="border border-gray-200 p-2">
                        {`${application.applicantDetails.applicantDetails.lastName}, ${application.applicantDetails.applicantDetails.firstName} ${application.applicantDetails.applicantDetails.middleName ? application.applicantDetails.applicantDetails.middleName.charAt(0) + '.' : ''}`}
                      </td>
                      <td className="border border-gray-200 p-2">{application.scholarshipProgram.title}</td>
                      <td className="border border-gray-200 p-2">{new Date(application.submissionDate).toLocaleDateString()}</td>
                      <td className="border border-gray-200 p-2">
                        <span className={`px-2 py-1 rounded-full text-white ${application.applicationStatus === 'Approved' ? 'bg-green-500' : application.applicationStatus === 'Pending' ? 'bg-yellow-500' : 'bg-red-500'}`}>
                          {application.applicationStatus}
                        </span>
                      </td>
                      <td className="border border-gray-200 p-2">
                        <div className="flex justify-center gap-2">
                          <Link
                            to={`/view-scholarships/${application.scholarshipProgram._id}?tab=applications`}
                            className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
                          >
                            Review Application
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}