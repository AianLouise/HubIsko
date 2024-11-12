import React, { useEffect, useState } from "react";
import { BiFilter } from "react-icons/bi";
import { Link } from "react-router-dom";
import Layout from "../../components/Layout";
import { MdPreview, MdDelete } from 'react-icons/md';
import { IoAddCircleOutline } from 'react-icons/io5';

const statusColors = {
  'Verify Account': 'bg-gray-400',
  'Pending Verification': 'bg-yellow-500',
  'Verified': 'bg-green-500',
  'Rejected': 'bg-red-500',
  'Active': 'bg-blue-500',
  'Inactive': 'bg-gray-600',
  'Suspended': 'bg-orange-500',
  'Pending Approval': 'bg-purple-500',
};

const getAccountLink = (account) => {
  const buttonText = account.status === 'Pending Verification' ? 'Verify' : 'View Details';

  if (account.role === 'applicant') {
    const route = account.status === 'Pending Verification' ? `/student-applications/${account._id}` : `/student-details/${account._id}`;
    return <Link to={route} className="bg-blue-600 hover:bg-blue-800 px-4 py-1 rounded-md text-white">{buttonText}</Link>;
  } else if (account.role === 'scholarship_provider') {
    const route = account.status === 'Pending Verification' ? `/scholarship-provider-applications/${account._id}` : `/provider-details/${account._id}`;
    return <Link to={route} className="bg-blue-600 hover:bg-blue-800 px-4 py-1 rounded-md text-white">{buttonText}</Link>;
  } else {
    return null;
  }
};

const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + '...';
};

export default function ProviderAccounts() {
  useEffect(() => {
    document.title = "Scholarship Provider | HubIsko";
  }, []);

  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('A - Z');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchAllProviders = async () => {
      try {
        const response = await fetch('/api/admin/all-providers');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const providersArray = data.providers;

        // Load all profile pictures before setting providers
        await Promise.all(
          providersArray.map(provider => {
            return new Promise((resolve, reject) => {
              const img = new Image();
              img.src = provider.profilePicture;
              img.onload = resolve;
              img.onerror = reject;
            });
          })
        );

        setProviders(providersArray);
      } catch (error) {
        console.error('Error fetching all providers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProviders();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (e) => {
    setSelectedFilter(e.target.value);
  };

  const filteredProviders = providers.filter(provider => {
    const { scholarshipProviderDetails, email } = provider;
    if (!scholarshipProviderDetails) return false;

    const matchesSearchQuery = (scholarshipProviderDetails.organizationName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scholarshipProviderDetails.contactPersonName?.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesSearchQuery;
  }).sort((a, b) => {
    if (selectedFilter === 'A - Z') {
      return a.scholarshipProviderDetails.organizationName.localeCompare(b.scholarshipProviderDetails.organizationName);
    } else if (selectedFilter === 'Z - A') {
      return b.scholarshipProviderDetails.organizationName.localeCompare(a.scholarshipProviderDetails.organizationName);
    } else if (selectedFilter === 'Recent') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (selectedFilter === 'Oldest') {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }
    return 0;
  });

  const totalPages = Math.ceil(filteredProviders.length / itemsPerPage);
  const currentProviders = filteredProviders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

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
        <div className='max-w-8xl mx-auto px-24 gap-4 flex-col flex mt-12 pb-10'>
          <div className="flex items-center justify-between border-b pb-2">
            <h1 className='text-2xl font-bold text-slate-600'>Providers' Info</h1>
          </div>

          <div className='flex gap-4'>
            <div className='overflow-x-auto rounded-md bg-white shadow border w-full'>
              <div className='flex justify-between items-center gap-4 p-4 py-0 rounded-md'>
                <div></div>
                <div className="flex items-center gap-4 p-4">
                  <input
                    type="text"
                    className='border-gray-300 rounded-md p-2 border pr-8'
                    placeholder='Search for providers...'
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                  <select
                    value={selectedFilter}
                    onChange={handleFilterChange}
                    className='border-gray-300 rounded-md p-2 border pr-8 bg-blue-600 text-white'
                  >
                    <option value="A - Z">A - Z</option>
                    <option value="Z - A">Z - A</option>
                    <option value="Recent">Recent</option>
                    <option value="Oldest">Oldest</option>
                  </select>
                </div>
              </div>

              <table className='w-full border-t text-center border-collapse'>
                <thead>
                  <tr className='bg-slate-100'>
                    <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">No.</th>
                    <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Organization</th>
                    <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Email</th>
                    <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Contact Person</th>
                    <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Status</th>
                    <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProviders.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-4 text-center text-gray-500">
                        No providers found.
                      </td>
                    </tr>
                  ) : (
                    currentProviders.map((provider, index) => (
                      <tr key={provider._id} className="font-normal tracking-wide hover:bg-slate-200 border-b">
                        <td className='py-2 px-4 border-b border-gray-200'>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td className='py-2 px-4 border-b border-gray-200 text-left'>
                          <div className="flex gap-2 items-center">
                            <img src={provider.profilePicture} alt="Profile" className="rounded-full h-6 w-6 object-cover" />
                            <span className="truncate max-w-xs" title={provider.scholarshipProviderDetails.organizationName}>
                              {truncateText(provider.scholarshipProviderDetails.organizationName, 20)}
                            </span>
                          </div>
                        </td>
                        <td className='py-2 px-4 border-b border-gray-200'>{provider.email}</td>
                        <td className='py-2 px-4 border-b border-gray-200'>{provider.scholarshipProviderDetails.contactPersonName}</td>
                        <td className='py-2 px-4 border-b border-gray-200'>
                          <div className="flex items-center justify-center">
                            <span className={`w-3 h-3 rounded-full ${statusColors[provider.status]} mr-2`}></span>
                            {provider.status}
                          </div>
                        </td>
                        <td className='py-2 px-4 border-b border-gray-200'>
                          <div className="flex justify-center items-center gap-2">
                            {getAccountLink(provider)}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              <div className='flex justify-between items-center font-normal gap-4 p-4 py-6 text-gray-600 rounded-md'>
                <span>Showing items {currentPage} out of {totalPages}</span>

                <div className="flex items-center px-8">
                  <button onClick={handlePreviousPage} className="border px-4 py-1 rounded-md" disabled={currentPage === 1}>
                    Previous
                  </button>
                  <div className="flex gap-2 px-4">
                    {[...Array(totalPages)].map((_, index) => (
                      <button
                        key={index}
                        onClick={() => handlePageClick(index + 1)}
                        className={`px-3 py-1 rounded-md ${currentPage === index + 1 ? 'bg-blue-600 text-white' : 'border'}`}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                  <button onClick={handleNextPage} className="bg-blue-600 text-white px-4 py-1 rounded-md" disabled={currentPage === totalPages}>
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}