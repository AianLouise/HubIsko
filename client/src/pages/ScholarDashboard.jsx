import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link, useNavigate } from 'react-router-dom';
import { FaAngleRight, FaSearch, FaUser, FaGraduationCap, FaCalendarAlt, FaChartLine } from "react-icons/fa";
import { BiFilter } from 'react-icons/bi';
import { HiOutlineDocumentText, HiOutlineCheckCircle, HiOutlineClock, HiOutlineXCircle } from 'react-icons/hi';
import useTokenExpiry from '../hooks/useTokenExpiry';
import ScholarshipAnnouncements from '../components/ScholarDashboard/ScholarshipAnnouncements';

export default function ScholarDashboard() {
  useTokenExpiry();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  useEffect(() => {
    document.title = "Scholar Dashboard | HubIsko";
  }, []);

  const currentUser = useSelector((state) => state.user.currentUser);
  const [userDetails, setUserDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [approvedApplications, setApprovedApplications] = useState([]);
  const [pendingApplications, setPendingApplications] = useState([]);
  const [rejectedApplications, setRejectedApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('recent');

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024); // Tailwind's lg breakpoint is 1024px
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Call initially to set the state based on the initial window size

    return () => window.removeEventListener('resize', handleResize);
  }, []);
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/profile/user/${currentUser._id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        setUserDetails(data);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    if (currentUser) {
      fetchUserDetails();
    }
  }, [currentUser]);
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const userId = currentUser._id; // Assuming currentUser contains the user object with an id
        const response = await fetch(`${apiUrl}/api/scholarshipApplication/get-applications/${userId}`, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        const approved = data.filter(app => app.applicationStatus === 'Approved');
        const pending = data.filter(app => app.applicationStatus === 'Pending');
        const rejected = data.filter(app => app.applicationStatus === 'Rejected');
        setApprovedApplications(approved);
        setPendingApplications(pending);
        setRejectedApplications(rejected);
      } catch (error) {
        console.error('Error fetching applications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [currentUser]);

  const allApplications = [...approvedApplications, ...pendingApplications, ...rejectedApplications];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-400';
      case 'Approved':
        return 'bg-green-400';
      case 'Rejected':
        return 'bg-red-400';
      case 'Completed':
        return 'bg-blue-400';
      default:
        return 'bg-gray-400';
    }
  };

  const toSentenceCase = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const getFilteredApplications = () => {
    let applications;
    switch (filter) {
      case 'approved':
        applications = approvedApplications;
        break;
      case 'pending':
        applications = pendingApplications;
        break;
      case 'rejected':
        applications = rejectedApplications;
        break;
      default:
        applications = allApplications;
    }

    if (searchQuery) {
      applications = applications.filter(application =>
        application.scholarshipProgram?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        application.scholarshipProgram?.organizationName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (sortOrder === 'recent') {
      applications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else {
      applications.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    return applications;
  };

  const filteredApplications = getFilteredApplications();

  const handleVerifyClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/verify-profile');
    }, 2000);
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

  if (!userDetails) {
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
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow">
        
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-500 py-8 sm:py-12 mb-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">
              {/* Text Content */}
              <div className="text-white w-full lg:w-2/3 text-center lg:text-left">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 leading-tight">
                  Welcome Back, {userDetails?.applicantDetails?.firstName}!
                </h1>
                <p className="text-blue-100 text-base sm:text-lg mb-4 sm:mb-6 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  Track your scholarship applications, discover new opportunities, and manage your academic journey all in one place.
                </p>
                
                {/* Quick Actions */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                  <Link to="/scholarship-listing">
                    <button className="bg-white text-blue-700 font-semibold py-3 px-6 rounded-lg hover:bg-blue-50 transition-all duration-300 shadow-lg transform hover:scale-105 inline-flex items-center">
                      <FaSearch className="mr-2" />
                      Browse Scholarships
                    </button>
                  </Link>
                  <Link to="/forums">
                    <button className="bg-blue-600 border-2 border-white text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-800 transition-all duration-300 inline-flex items-center">
                      <HiOutlineDocumentText className="mr-2" />
                      Join Forums
                    </button>
                  </Link>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="w-full lg:w-1/3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4 text-center text-white">
                    <HiOutlineDocumentText className="w-8 h-8 mx-auto mb-2 text-yellow-300" />
                    <div className="font-bold text-2xl">{allApplications.length}</div>
                    <div className="text-blue-100 text-sm">Total Applications</div>
                  </div>
                  <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4 text-center text-white">
                    <HiOutlineCheckCircle className="w-8 h-8 mx-auto mb-2 text-green-300" />
                    <div className="font-bold text-2xl">{approvedApplications.length}</div>
                    <div className="text-blue-100 text-sm">Approved</div>
                  </div>
                  <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4 text-center text-white">
                    <HiOutlineClock className="w-8 h-8 mx-auto mb-2 text-orange-300" />
                    <div className="font-bold text-2xl">{pendingApplications.length}</div>
                    <div className="text-blue-100 text-sm">Pending</div>
                  </div>
                  <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4 text-center text-white">
                    <FaChartLine className="w-8 h-8 mx-auto mb-2 text-blue-300" />
                    <div className="font-bold text-2xl">
                      {allApplications.length > 0 ? Math.round((approvedApplications.length / allApplications.length) * 100) : 0}%
                    </div>
                    <div className="text-blue-100 text-sm">Success Rate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pb-12">
          
          {/* Status Alerts */}
          <div className="mb-8">
            {userDetails.status === 'Pending Verification' && (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-500 text-yellow-800 p-6 rounded-lg shadow-md">
                <div className="flex items-center">
                  <HiOutlineClock className="w-6 h-6 mr-3 text-yellow-600" />
                  <div>
                    <p className="font-bold text-lg">Account Under Verification</p>
                    <p className="mt-1">Your account is currently under verification. Some features may be restricted until your account is fully verified.</p>
                  </div>
                </div>
              </div>
            )}

            {userDetails.status === 'Rejected' && (
              <div className="bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 text-red-800 p-6 rounded-lg shadow-md">
                <div className="flex items-center">
                  <HiOutlineXCircle className="w-6 h-6 mr-3 text-red-600" />
                  <div>
                    <p className="font-bold text-lg">Account Rejected</p>
                    <p className="mt-1">Your account has been rejected. Reason: {userDetails.rejectReason}</p>
                  </div>
                </div>
              </div>
            )}

            {userDetails.status === 'Verified' && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 text-green-800 p-6 rounded-lg shadow-md">
                <div className="flex items-center">
                  <HiOutlineCheckCircle className="w-6 h-6 mr-3 text-green-600" />
                  <div>
                    <p className="font-bold text-lg">Welcome Back!</p>
                    <p className="mt-1">Your account is fully verified. Enjoy all the features available to you.</p>
                  </div>
                </div>
              </div>
            )}

            {userDetails.status === 'Verify Account' && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 text-blue-800 p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FaUser className="w-6 h-6 mr-3 text-blue-600" />
                    <div>
                      <p className="font-bold text-lg">Verify Your Account</p>
                      <p className="mt-1">Please verify your account to access all features. You can do this by visiting the verification page.</p>
                    </div>
                  </div>
                  <button
                    onClick={handleVerifyClick}
                    className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg transform hover:scale-105 ${isLoading ? 'cursor-not-allowed opacity-75' : ''}`}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <svg className="animate-spin h-5 w-5 text-white mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                      </svg>
                    ) : (
                      'Verify Profile'
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Announcements */}
          <div className="mb-8">
            <ScholarshipAnnouncements />
          </div>

          {/* Applications Section */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
              <h2 className="text-2xl font-bold text-white">Scholarship Applications</h2>
              <p className="text-blue-100 mt-1">Manage and track your scholarship applications</p>
            </div>

            {/* Filters and Search */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                {/* Filter Buttons */}
                <div className="flex flex-wrap gap-2">
                  <button
                    className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                      filter === 'all' 
                        ? 'bg-blue-600 text-white shadow-lg' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => setFilter('all')}
                  >
                    <HiOutlineDocumentText className="w-4 h-4 mr-2" />
                    All ({allApplications.length})
                  </button>
                  
                  <button
                    className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                      filter === 'approved' 
                        ? 'bg-green-600 text-white shadow-lg' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => setFilter('approved')}
                  >
                    <HiOutlineCheckCircle className="w-4 h-4 mr-2" />
                    Approved ({approvedApplications.length})
                  </button>
                  
                  <button
                    className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                      filter === 'pending' 
                        ? 'bg-yellow-500 text-white shadow-lg' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => setFilter('pending')}
                  >
                    <HiOutlineClock className="w-4 h-4 mr-2" />
                    Pending ({pendingApplications.length})
                  </button>
                  
                  <button
                    className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                      filter === 'rejected' 
                        ? 'bg-red-600 text-white shadow-lg' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => setFilter('rejected')}
                  >
                    <HiOutlineXCircle className="w-4 h-4 mr-2" />
                    Rejected ({rejectedApplications.length})
                  </button>
                </div>

                {/* Search and Sort */}
                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search applications..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <button
                    className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-all duration-300"
                    onClick={() => setSortOrder(sortOrder === 'recent' ? 'oldest' : 'recent')}
                  >
                    <BiFilter className="w-4 h-4 mr-2" />
                    {sortOrder === 'recent' ? 'Recent First' : 'Oldest First'}
                  </button>
                </div>
              </div>
            </div>

            {/* Applications List */}
            <div className="p-6">
              {filteredApplications.length === 0 ? (
                <div className="text-center py-12">
                  <HiOutlineDocumentText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No applications found</h3>
                  <p className="text-gray-500 mb-6">
                    {searchQuery ? 'No applications match your search criteria.' : 'You haven\'t applied to any scholarships yet.'}
                  </p>
                  <Link to="/scholarship-listing">
                    <button className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg transform hover:scale-105">
                      <FaGraduationCap className="mr-2" />
                      Browse Scholarships
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredApplications.map(application => (
                    <div key={application._id} className="border border-gray-200 rounded-lg hover:shadow-md transition-all duration-300">
                      <div className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden bg-gray-100">
                                {application.scholarshipProgram?.scholarshipImage ? (
                                  <img 
                                    src={application.scholarshipProgram.scholarshipImage} 
                                    alt="Scholarship" 
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <FaGraduationCap className="w-6 h-6 text-gray-400" />
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                {application.scholarshipProgram?.title || 'Scholarship Title'}
                              </h3>
                              <p className="text-sm text-gray-600 mb-2">
                                {application.scholarshipProgram?.organizationName}
                              </p>
                              
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <div className="flex items-center">
                                  <FaCalendarAlt className="w-4 h-4 mr-1" />
                                  Applied: {new Date(application.createdAt).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                            <div className="flex items-center">
                              <div className={`w-3 h-3 rounded-full mr-2 ${getStatusColor(application.applicationStatus)}`}></div>
                              <span className={`font-medium text-sm px-3 py-1 rounded-full ${
                                application.applicationStatus === 'Approved' ? 'bg-green-100 text-green-800' :
                                application.applicationStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {toSentenceCase(application.applicationStatus)}
                              </span>
                            </div>
                            
                            <Link to={`/scholarship-dashboard-details/${application._id}`}>
                              <button className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 shadow hover:shadow-md">
                                View Details
                                <FaAngleRight className="w-4 h-4 ml-2" />
                              </button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
