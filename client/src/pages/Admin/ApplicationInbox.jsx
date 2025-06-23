import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BiFilter } from "react-icons/bi";
import { PiArrowRightFill } from "react-icons/pi";
import { GoDotFill } from "react-icons/go";
import { BsInboxFill } from "react-icons/bs";
import { FaUserGraduate, FaUniversity, FaBell, FaEye } from "react-icons/fa";
import { MdNotifications, MdInbox } from "react-icons/md";

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function ApplicationInbox() {
  useEffect(() => {
    document.title = "Application Inbox | HubIsko";
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [pendingProviders, setPendingProviders] = useState(0);
  const [pendingStudents, setPendingStudents] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activityLogs, setActivityLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch total number of pending providers
        const pendingProvidersResponse = await fetch(`${apiUrl}/api/adminApp/search-pending-verification-providers`);
        const pendingProvidersData = await pendingProvidersResponse.json();
        setPendingProviders(pendingProvidersData.length);

        // Fetch total number of pending students
        const pendingStudentsResponse = await fetch(`${apiUrl}/api/adminApp/search-pending-verification-students`);
        const pendingStudentsData = await pendingStudentsResponse.json();
        setPendingStudents(pendingStudentsData.length);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    const fetchActivityLogs = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/activity/activity-logs`);
        const data = await response.json();
        const filteredLogs = Array.isArray(data) ? data.filter(log =>
          log.action === 'APPROVE_SCHOLARSHIP_PROVIDER' ||
          log.action === 'APPROVE_STUDENT' ||
          log.action === 'SIGNUP_PROVIDER' ||
          log.action === 'CREATE' ||
          log.action === 'COMPLETE_PROFILE'
        ) : [];
        setActivityLogs(filteredLogs);
      } catch (error) {
        console.error('Error fetching activity logs:', error);
      }
    };

    fetchActivityLogs();
  }, []);

  const getUserDisplayName = (user) => {
    if (!user) return 'N/A';
    if (user.applicantDetails?.firstName || user.applicantDetails?.lastName || user.applicantDetails?.middleName) {
      const middleInitial = user.applicantDetails.middleName ? `${user.applicantDetails.middleName.charAt(0)}.` : '';
      return `${user.applicantDetails.lastName || ''}, ${user.applicantDetails.firstName || ''} ${middleInitial}`.trim();
    }
    if (user.scholarshipProviderDetails?.organizationName) return user.scholarshipProviderDetails.organizationName;
    return user.username || 'N/A';
  };

  const formatDetails = (log) => {
    switch (log.action) {
      case 'APPROVE_SCHOLARSHIP_PROVIDER':
        return `Scholarship provider successfully verified by ${getUserDisplayName(log.userId)}. Details: ${log.details}`;
      case 'APPROVE_STUDENT':
        return `Student successfully verified by ${getUserDisplayName(log.userId)}. Details: ${log.details}`;
      case 'SIGNUP_PROVIDER':
        return `New provider created an account and applied for verification: ${getUserDisplayName(log.userId)}`;
      case 'CREATE':
        return `Student created an account: ${getUserDisplayName(log.userId)}`;
      case 'COMPLETE_PROFILE':
        return `Student completed their profile and applied for verification: ${getUserDisplayName(log.userId)}`;
      default:
        return log.action;
    }
  };
  const isNewLog = (timestamp) => {
    const logDate = new Date(timestamp);
    const currentDate = new Date();
    const timeDifference = currentDate - logDate;
    const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
    return timeDifference < oneDayInMilliseconds;
  };

  // Filter and pagination logic
  const filteredLogs = activityLogs.filter(log => {
    if (!searchQuery) return true;
    const searchTerm = searchQuery.toLowerCase();
    return (
      getUserDisplayName(log.userId).toLowerCase().includes(searchTerm) ||
      formatDetails(log).toLowerCase().includes(searchTerm) ||
      log.action.toLowerCase().includes(searchTerm)
    );
  });

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLogs = filteredLogs.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
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
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Loading Application Inbox</h3>
            <p className="text-gray-500">Please wait while we fetch the data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Sort activity logs to show new notifications on top
  const sortedActivityLogs = [...currentLogs].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <main className="flex-grow">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">Application Inbox</h1>
                <p className="text-blue-100 text-base font-medium">
                  Manage student and scholarship provider applications with recent activity
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                <MdInbox className="text-white text-4xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Application Cards */}
        <div className="max-w-7xl mx-auto px-6 -mt-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Link
              to="/student-applications"
              className="bg-white rounded-xl shadow-md border border-blue-100 p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-100 p-3 rounded-lg group-hover:bg-blue-600 transition-all duration-300">
                  <FaUserGraduate className="w-6 h-6 text-blue-600 group-hover:text-white" />
                </div>
                <div className="text-right">
                  <p className="text-blue-600 font-medium text-xs uppercase tracking-wide">Student Applications</p>
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-800 mb-2">{pendingStudents}</div>
              <div className="flex items-center text-blue-600 text-sm">
                <span>Click to view pending student applications</span>
                <PiArrowRightFill className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </Link>

            <Link
              to="/scholarship-provider-applications"
              className="bg-white rounded-xl shadow-md border border-blue-100 p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="bg-indigo-100 p-3 rounded-lg group-hover:bg-indigo-600 transition-all duration-300">
                  <FaUniversity className="w-6 h-6 text-indigo-600 group-hover:text-white" />
                </div>
                <div className="text-right">
                  <p className="text-indigo-600 font-medium text-xs uppercase tracking-wide">Provider Applications</p>
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-800 mb-2">{pendingProviders}</div>
              <div className="flex items-center text-indigo-600 text-sm">
                <span>Click to view pending provider applications</span>
                <PiArrowRightFill className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Activity Header and Controls */}
          <div className="bg-white rounded-xl shadow-md border border-blue-100 p-4 mb-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold text-gray-800">Recent Activity</h2>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {filteredLogs.length} activities
                </span>
              </div>

              <div className="flex gap-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search activities..."
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
              </div>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-white rounded-xl shadow-md border border-blue-100 overflow-hidden">
            <div className="divide-y divide-gray-100">
              {sortedActivityLogs && sortedActivityLogs.length > 0 ? (
                sortedActivityLogs.map((log, index) => (
                  <div key={log._id || index} className="p-4 hover:bg-blue-50 transition-all duration-200">
                    <div className="flex items-start gap-4">
                      <div className="relative">
                        <img
                          src={log.userId?.profilePicture || '/default-avatar.png'}
                          alt="Profile"
                          className="w-12 h-12 rounded-full object-cover border-2 border-blue-200 shadow-sm"
                          onError={(e) => {
                            e.target.src = '/default-avatar.png';
                          }}
                        />
                        {isNewLog(log.timestamp) && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 rounded-full border-2 border-white flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-sm font-semibold text-gray-900">
                              {getUserDisplayName(log.userId)}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                              {formatDetails(log)}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              {isNewLog(log.timestamp) && (
                                <>
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    New
                                  </span>
                                  <GoDotFill className="text-blue-600 w-2 h-2" />
                                </>
                              )}
                              <span className="text-xs text-gray-500">
                                {new Date(log.timestamp).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center">
                  <div className="flex flex-col items-center">
                    <div className="bg-gray-100 p-6 rounded-full mb-3">
                      <FaBell className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-base font-semibold text-gray-600 mb-2">No activities found</h3>
                    <p className="text-sm text-gray-500">No recent activities match your search criteria</p>
                  </div>
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {filteredLogs.length > 0 && (
              <div className="bg-white px-6 py-4 border-t border-gray-100">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <span>Showing {startIndex + 1} to {Math.min(endIndex, filteredLogs.length)} of {filteredLogs.length} activities</span>
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