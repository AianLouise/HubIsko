import React, { useState, useEffect } from "react";
import { BiFilter } from "react-icons/bi";
import { Link } from "react-router-dom";
import Layout from "../../components/Layout";
import { MdPreview } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { IoAddCircleOutline } from "react-icons/io5";
import { PiArrowRightFill } from "react-icons/pi";
import { RiGraduationCapFill } from "react-icons/ri";
import { FaUsers } from "react-icons/fa";

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'pending verification':
      return 'bg-yellow-500';
    case 'verified':
      return 'bg-green-600';
    case 'rejected':
      return 'bg-red-500';
    case 'verify account':
      return 'bg-gray-400';
    case 'active':
      return 'bg-blue-500';
    case 'inactive':
      return 'bg-gray-600';
    case 'suspended':
      return 'bg-orange-500';
    case 'pending approval':
      return 'bg-purple-500';
    default:
      return 'bg-gray-500';
  }
};

const toSentenceCase = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const getAccountLink = (account) => {
  const buttonText = account.status === 'Pending Verification' ? 'Verify' : 'View Details';

  if (account.status === 'Verify Account') {
    return null;
  }

  const route = account.status === 'Pending Verification' 
    ? `/student-applications/${account._id}` 
    : `/student-details/${account._id}`;
  
  return (
    <Link
      to={route}
      className="inline-flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-all duration-300 hover:shadow-md hover:scale-105"
    >
      {buttonText}
      <PiArrowRightFill className="ml-1 w-3 h-3" />
    </Link>
  );
};

export default function Students() {
  useEffect(() => {
    document.title = "Students | HubIsko";
  }, []);

  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchAllApplicants = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/admin/all-applicants`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      const applicantsArray = data.applicants;

      // Load all profile pictures before setting applicants
      await Promise.all(
        applicantsArray.map(applicant => {
          return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = applicant.profilePicture;
            img.onload = resolve;
            img.onerror = resolve; // Continue even if image fails to load
          });
        })
      );

      setApplicants(applicantsArray);
    } catch (error) {
      console.error('Error fetching all applicants:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllApplicants();
  }, []);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('A - Z');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

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

  const filteredApplicants = applicants.filter(applicant => {
    const { applicantDetails, email } = applicant;
    if (!applicantDetails) return false;

    const matchesSearchQuery = applicantDetails.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      applicantDetails.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearchQuery;
  }).sort((a, b) => {
    if (selectedFilter === 'A - Z') {
      return a.applicantDetails.lastName.localeCompare(b.applicantDetails.lastName);
    } else if (selectedFilter === 'Z - A') {
      return b.applicantDetails.lastName.localeCompare(a.applicantDetails.lastName);
    } else if (selectedFilter === 'Recent') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (selectedFilter === 'Oldest') {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }
    return 0;
  });
  const totalPages = Math.ceil(filteredApplicants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentApplicants = filteredApplicants.slice(startIndex, endIndex);

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
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Loading Students</h3>
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
                <h1 className="text-3xl font-bold mb-2">Student Management</h1>
                <p className="text-blue-100 text-base font-medium">
                  Comprehensive student account oversight and management system
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                <RiGraduationCapFill className="text-white text-4xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Card */}
        <div className="max-w-7xl mx-auto px-6 -mt-6 relative z-10">
          <div className="bg-white rounded-xl shadow-md border border-blue-100 p-4 hover:shadow-lg transition-all duration-300 hover:scale-102 max-w-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <RiGraduationCapFill className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-right">
                <p className="text-green-600 font-medium text-xs uppercase tracking-wide">Total Students</p>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-800 mb-2">{filteredApplicants.length}</div>
            <div className="flex items-center text-green-600 text-xs">
              <span className="bg-green-100 px-2 py-1 rounded-full">Registered</span>
            </div>
          </div>
        </div>

        {/* Students Management Section */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Filter and Search Controls */}
          <div className="bg-white rounded-xl shadow-md border border-blue-100 p-4 mb-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold text-gray-800">Student Records</h2>
              </div>

              <div className="flex gap-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search students..."
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
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm bg-white"
                >
                  <option value="A - Z">A - Z</option>
                  <option value="Z - A">Z - A</option>
                  <option value="Recent">Recent</option>
                  <option value="Oldest">Oldest</option>
                </select>
              </div>
            </div>
          </div>          {/* Students Table */}
          <div className="bg-white rounded-xl shadow-md border border-blue-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider">No.</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider">Student</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider">Email</th>
                    <th className="py-3 px-4 text-center text-xs font-semibold uppercase tracking-wider">Date Applied</th>
                    <th className="py-3 px-4 text-center text-xs font-semibold uppercase tracking-wider">Status</th>
                    <th className="py-3 px-4 text-center text-xs font-semibold uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentApplicants && currentApplicants.length > 0 ? (
                    currentApplicants.map((applicant, index) => (
                      <tr key={applicant._id} className={`hover:bg-blue-50 transition-all duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                        <td className="py-3 px-4 text-sm text-gray-700">
                          {startIndex + index + 1}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <div className="relative">
                              <img
                                src={applicant.profilePicture}
                                alt="Profile"
                                className="w-9 h-9 rounded-full object-cover border-2 border-blue-200 shadow-sm"
                              />
                              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-semibold text-gray-900">
                                {`${applicant.applicantDetails.lastName}, ${applicant.applicantDetails.firstName} ${applicant.applicantDetails.middleName.charAt(0)}.`}
                              </div>
                              <div className="text-xs text-gray-500">Student</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm text-gray-900">{applicant.email}</div>
                          <div className="text-xs text-gray-500">Contact Email</div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="text-sm text-gray-900">{new Date(applicant.createdAt).toLocaleDateString()}</div>
                          <div className="text-xs text-gray-500">Registration Date</div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center">
                            <span className={`inline-block w-2.5 h-2.5 mr-2 rounded-full ${getStatusColor(applicant.status)}`}></span>
                            <span className="text-sm font-medium text-gray-700">
                              {toSentenceCase(applicant.status)}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex justify-center">
                            {getAccountLink(applicant)}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="py-8 text-center">
                        <div className="flex flex-col items-center">
                          <div className="bg-gray-100 p-6 rounded-full mb-3">
                            <FaUsers className="w-8 h-8 text-gray-400" />
                          </div>
                          <h3 className="text-base font-semibold text-gray-600 mb-2">No students found</h3>
                          <p className="text-sm text-gray-500">Try adjusting your search criteria</p>
                        </div>
                      </td>
                    </tr>
                  )}                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination Controls */}
          {filteredApplicants.length > 0 && (
            <div className="bg-white rounded-xl shadow-md border border-blue-100 p-4 mt-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Results info */}
                <div className="text-sm text-gray-600">
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredApplicants.length)} of {filteredApplicants.length} students
                </div>

                {/* Pagination buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                      currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200'
                    }`}
                  >
                    Previous
                  </button>

                  {/* Page numbers */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNumber;
                      if (totalPages <= 5) {
                        pageNumber = i + 1;
                      } else if (currentPage <= 3) {
                        pageNumber = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNumber = totalPages - 4 + i;
                      } else {
                        pageNumber = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`w-8 h-8 rounded-lg text-sm font-medium transition-all duration-300 ${
                            currentPage === pageNumber
                              ? 'bg-blue-600 text-white shadow-md'
                              : 'bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                      currentPage === totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200'
                    }`}
                  >
                    Next
                  </button>
                </div>

                {/* Quick jump to page */}
                {totalPages > 5 && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-600">Go to page:</span>
                    <input
                      type="number"
                      min="1"
                      max={totalPages}
                      value={currentPage}
                      onChange={(e) => {
                        const page = parseInt(e.target.value);
                        if (page >= 1 && page <= totalPages) {
                          handlePageChange(page);
                        }
                      }}
                      className="w-16 px-2 py-1 border border-gray-200 rounded text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <span className="text-gray-600">of {totalPages}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}