import React, { useEffect, useState } from "react";
import { BiFilter } from "react-icons/bi";
import { Link } from "react-router-dom";
import Layout from "../../components/Layout";
import { MdPreview, MdDelete, MdBusiness } from 'react-icons/md';
import { IoAddCircleOutline } from 'react-icons/io5';
import { FaUsers, FaBuilding } from "react-icons/fa";
import { PiArrowRightFill } from "react-icons/pi";

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

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
    return (
      <Link 
        to={route} 
        className="inline-flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-all duration-300 hover:shadow-md hover:scale-105"
      >
        {buttonText}
        <PiArrowRightFill className="ml-1 w-3 h-3" />
      </Link>
    );
  } else if (account.role === 'scholarship_provider') {
    const route = account.status === 'Pending Verification' ? `/scholarship-provider-applications/${account._id}` : `/provider-details/${account._id}`;
    return (
      <Link 
        to={route} 
        className="inline-flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-all duration-300 hover:shadow-md hover:scale-105"
      >
        {buttonText}
        <PiArrowRightFill className="ml-1 w-3 h-3" />
      </Link>
    );
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
    document.title = "Provider Accounts | HubIsko";
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('A - Z');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  useEffect(() => {
    const fetchAllProviders = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${apiUrl}/api/admin/all-providers`);
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
    setCurrentPage(1);
  };

  const handleFilterChange = (e) => {
    setSelectedFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
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
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProviders = filteredProviders.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex justify-center items-center">
        <div className="text-center">
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-blue-100">
            <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Loading Provider Accounts</h3>
            <p className="text-gray-500">Please wait while we fetch the data...</p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <main className="flex-grow">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">Provider Accounts</h1>
                <p className="text-blue-100 text-base font-medium">
                  Manage scholarship provider organizations and their accounts
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                <MdBusiness className="text-white text-4xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Card */}
        <div className="max-w-7xl mx-auto px-6 -mt-6 relative z-10">
          <div className="bg-white rounded-xl shadow-md border border-blue-100 p-4 hover:shadow-lg transition-all duration-300 hover:scale-102 max-w-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <FaBuilding className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-right">
                <p className="text-blue-600 font-medium text-xs uppercase tracking-wide">Total Providers</p>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-800 mb-2">{providers.length}</div>
            <div className="flex items-center text-blue-600 text-xs">
              <span className="bg-blue-100 px-2 py-1 rounded-full">Active Organizations</span>
            </div>
          </div>
        </div>

        {/* Provider Management Section */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Filter and Search Controls */}
          <div className="bg-white rounded-xl shadow-md border border-blue-100 p-4 mb-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold text-gray-800">Provider Directory</h2>
              </div>

              <div className="flex gap-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search providers..."
                    className="w-64 pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                <select
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm bg-white"
                >
                  <option value={5}>5 per page</option>
                  <option value={10}>10 per page</option>
                  <option value={25}>25 per page</option>
                  <option value={50}>50 per page</option>
                </select>
                <select
                  value={selectedFilter}
                  onChange={handleFilterChange}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 hover:shadow-md"
                >
                  <option value="A - Z">A - Z</option>
                  <option value="Z - A">Z - A</option>
                  <option value="Recent">Recent</option>
                  <option value="Oldest">Oldest</option>
                </select>
              </div>
            </div>
          </div>

          {/* Providers Table */}
          <div className="bg-white rounded-xl shadow-md border border-blue-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider">#</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider">Organization</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider">Email</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider">Contact Person</th>
                    <th className="py-3 px-4 text-center text-xs font-semibold uppercase tracking-wider">Status</th>
                    <th className="py-3 px-4 text-center text-xs font-semibold uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentProviders && currentProviders.length > 0 ? (
                    currentProviders.map((provider, index) => (
                      <tr key={provider._id} className={`hover:bg-blue-50 transition-all duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                        <td className="py-3 px-4 text-sm text-gray-900 font-medium">
                          {startIndex + index + 1}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <div className="relative">
                              <img
                                src={provider.profilePicture}
                                alt="Organization Logo"
                                className="w-9 h-9 rounded-full object-cover border-2 border-blue-200 shadow-sm"
                              />
                              <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 border-2 border-white rounded-full ${statusColors[provider.status]}`}></div>
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-semibold text-gray-900 max-w-xs truncate" title={provider.scholarshipProviderDetails.organizationName}>
                                {provider.scholarshipProviderDetails.organizationName}
                              </div>
                              <div className="text-xs text-gray-500">Provider Organization</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm text-gray-900">{provider.email}</div>
                          <div className="text-xs text-gray-500">Primary Contact</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm text-gray-900">{provider.scholarshipProviderDetails.contactPersonName}</div>
                          <div className="text-xs text-gray-500">Representative</div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center">
                            <span className={`inline-block w-2.5 h-2.5 mr-2 rounded-full ${statusColors[provider.status]}`}></span>
                            <span className="text-sm font-medium text-gray-700">
                              {provider.status}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex justify-center">
                            {getAccountLink(provider)}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="py-8 text-center">
                        <div className="flex flex-col items-center">
                          <div className="bg-gray-100 p-6 rounded-full mb-3">
                            <FaBuilding className="w-8 h-8 text-gray-400" />
                          </div>
                          <h3 className="text-base font-semibold text-gray-600 mb-2">No providers found</h3>
                          <p className="text-sm text-gray-500">No provider accounts match your search criteria</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {filteredProviders.length > 0 && (
              <div className="bg-white px-6 py-4 border-t border-gray-100">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <span>Showing {startIndex + 1} to {Math.min(endIndex, filteredProviders.length)} of {filteredProviders.length} providers</span>
                  </div>
                  
                  {totalPages > 1 && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1.5 text-sm border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                      >
                        Previous
                      </button>
                      
                      <div className="flex gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }
                          
                          return (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              className={`px-3 py-1.5 text-sm border rounded-md transition-all duration-200 ${
                                currentPage === pageNum
                                  ? 'bg-blue-600 text-white border-blue-600'
                                  : 'border-gray-200 hover:bg-gray-50'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                      </div>
                      
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1.5 text-sm border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}