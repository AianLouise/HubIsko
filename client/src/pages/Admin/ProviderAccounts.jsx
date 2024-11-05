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

export default function ProviderAccounts() {
  useEffect(() => {
    document.title = "Scholarship Provider | HubIsko";
  }, []);

  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
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
        setProviders(data.providers);
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

  const toggleFilter = () => {
    setSelectedFilter(prevFilter => (prevFilter === 'Recent' ? 'Oldest' : 'Recent'));
  };

  const filteredProviders = providers.filter(provider => {
    const { scholarshipProviderDetails, email } = provider;
    if (!scholarshipProviderDetails) return false;

    const matchesSearchQuery = (scholarshipProviderDetails.organizationName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scholarshipProviderDetails.contactPersonName?.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesSearchQuery;
  }).sort((a, b) => {
    if (selectedFilter === 'Recent') {
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
            {/* <h1 className='text-xl text-slate-600'>Recently Added</h1> */}
          </div>

          <div className='flex gap-4'>
            <div className='overflow-x-auto rounded-md bg-white shadow border w-full'>
              <div className='flex justify-between items-center gap-4 p-4 py-0 rounded-md'>
                {/* <button className="flex gap-2 items-center bg-blue-600 rounded-md px-6 py-2 shadow text-white font-medium">
                  <IoAddCircleOutline className='w-6 h-6' />
                  Add Provider
                </button> */}
                <div></div>
                <div className="flex items-center gap-4 p-4">
                  <input
                    type="text"
                    className='border-gray-300 rounded-md p-2 border pr-8'
                    placeholder='Search for providers...'
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                  <button onClick={toggleFilter} className='bg-blue-600 px-4 py-2 rounded-md flex gap-2 text-white'>
                    <BiFilter className='w-6 h-6' />
                    <span>{selectedFilter === 'Recent' ? 'Recent' : 'Oldest'}</span>
                  </button>
                </div>
              </div>

              <table className='w-full border-t text-center'>
                <thead>
                  <tr className='bg-slate-100'>
                    <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">#No</th>
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
                      <tr key={provider._id} className="font-normal tracking-wide hover:bg-slate-200">
                        <td className='py-2 px-4 border-b border-gray-200'>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td className='py-2 px-4 border-b border-gray-200 text-left'>
                          <div className="flex gap-2 items-center">
                            <img src={provider.profilePicture} alt="Profile" className="rounded-full h-6 w-6 object-cover" />
                            {provider.scholarshipProviderDetails.organizationName}
                          </div>
                        </td>
                        <td className='py-2 px-4 border-b border-gray-200'>{provider.email}</td>
                        <td className='py-2 px-4 border-b border-gray-200'>{provider.scholarshipProviderDetails.contactPersonName}</td>
                        <td className='py-2 px-4 border-b border-gray-200 flex justify-center items-center'>
                          <span className={`w-3 h-3 rounded-full ${statusColors[provider.status]} mr-2`}></span>
                          {provider.status}
                        </td>
                        <td className='py-2 px-4 border-b border-gray-200'>
                          <div className="flex justify-center items-center gap-2">
                            <Link to={`/provider-details/${provider._id}`} className=''>
                              <MdPreview className='w-6 h-6 text-blue-600 hover:text-blue-800' />
                            </Link>
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

            {/* <div className="divide-y bg-white shadow border rounded-md flex flex-col w-1/3">
              <div className="flex items-center gap-2 p-4">
                <div className="bg-blue-600 w-16 h-16 rounded-full"></div>
                <div className="flex flex-col gap-1">
                  <span className="text-lg font-bold text-slate-800">Provider</span>
                  <span className="text-sm font-normal text-slate-600">Place or Region</span>
                </div>
              </div>

              <div>
                <div className="p-4">
                  <h1 className="mb-2">About the provider</h1>
                  <span className="font-normal text-base">
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Totam aperiam explicabo atque quidem minima officiis, in magnam ea eos quaerat ipsam voluptatibus praesentium, excepturi quos? Eveniet, veritatis quos. Beatae, voluptates.
                  </span>
                </div>
                <ul className="p-4 divide-y font-normal text-slate-600">
                  {[
                    { label: 'Email:', value: 'sample@sample.com' },
                    { label: 'Contact Person:', value: 'Person Sample' },
                    { label: 'Region:', value: 'Mang Tomas' },
                    { label: 'Birthday:', value: 'August 13, 2024' },
                  ].map((item, index) => (
                    <li
                      key={index}
                      className={`flex items-center justify-between py-2 px-2 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}
                    >
                      {item.label}
                      <span className="pr-2">{item.value}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-end p-4">
                <button className="flex px-3 py-1 bg-blue-600 text-white rounded-md">
                  See full Details
                </button>
              </div>
            </div> */}
          </div>
        </div>
      </main>
    </div>
  );
}