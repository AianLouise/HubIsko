import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link, useNavigate } from 'react-router-dom';
import { FaAngleRight } from "react-icons/fa";
import { BiFilter } from 'react-icons/bi';
import useTokenExpiry from '../hooks/useTokenExpiry';
import ScholarshipAnnouncements from '../components/ScholarDashboard/ScholarshipAnnouncements';

export default function ScholarDashboard() {
  useTokenExpiry();
  const navigate = useNavigate();

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
        const response = await fetch(`/api/profile/user/${currentUser._id}`, {
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
        const response = await fetch(`/api/scholarshipApplication/get-applications/${userId}`, {
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
    <div className="flex flex-col min-h-screen"> {/* Flex container */}
      <Header />
      <main className="flex-grow bg-[#f8f8fb] pb-24"> {/* Main content grows to fill available space */}
        <div className='flex flex-col gap-4 py-2 max-w-6xl mx-auto justify-between p-4 lg:px-24'>

          {userDetails.status === 'Pending Verification' && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 m-6 rounded-md" role="alert">
              <p className="font-bold">Account Under Verification</p>
              <p>Your account is currently under verification. Some features may be restricted until your account is fully verified.</p>
            </div>
          )}

          {userDetails.status === 'Rejected' && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 m-6 rounded-md" role="alert">
              <p className="font-bold">Account Rejected</p>
              <p>Your account has been rejected. Reason: {userDetails.rejectReason}</p>
            </div>
          )}

          {userDetails.status === 'Verified' && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 my-8 rounded-md" role="alert">
              <p className="font-bold">Welcome Back!</p>
              <p>Your account is fully verified. Enjoy all the features available to you.</p>
            </div>
          )}

          {userDetails.status === 'Verify Account' && (
            <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 m-6 rounded-md" role="alert">
              <p className="font-bold">Verify Your Account</p>
              <p>Please verify your account to access all features. You can do this by visiting the verification page.</p>
              <button
                onClick={handleVerifyClick}
                className={`mt-4 py-2 px-4 rounded bg-blue-500 text-white font-semibold hover:bg-blue-700 transition duration-200 focus:outline-none ${isLoading ? 'cursor-not-allowed' : ''}`}
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
          )}

          <ScholarshipAnnouncements />

          <span className='font-bold text-xl lg:text-2xl'>Scholarship Applications</span>

          {/* <div className='mb-2'>
            <span className='font-medium text-slate-500 lg:text-base text-sm'>Recent Scholarship Activities</span>

            <div className='flex lg:grid lg:grid-rows-1 lg:grid-cols-3 gap-2 text-sm mt-4 lg:mt-2'>

              <button onClick={handlePrev} className='lg:hidden rounded-md'>
                <IoMdArrowDropleftCircle className='w-10 h-10 text-blue-600' />
              </button>



              {activities.map((activity, index) => (
                <div
                  key={index}
                  className={`border ${activity.borderColor} shadow rounded-md w-full lg:p-2 py-4 flex items-center justify-center lg:flex-col gap-2 font-medium ${index === currentIndex ? 'block' : 'hidden'} lg:block`}
                >
                  <div className='items-center flex justify-center'>
                    <span className='py-2'>{activity.title}</span>
                    <span className={`${activity.textColor} lg:px-2 py-2 rounded-md`}>{activity.scholarshipTitle}</span>
                  </div>
                </div>
              ))}

              <button onClick={handleNext} className='lg:hidden rounded-md'>
                <IoMdArrowDropleftCircle className='w-10 h-10 rotate-180  text-blue-600' />
              </button>
            </div>
          </div> */}

          <div className="flex flex-col lg:flex-row justify-between items-center mt-4 font-medium px-4">
            <div className='flex flex-wrap gap-2 lg:gap-4'>
              <button
                className={`flex gap-2 items-center ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-white hover:bg-slate-200'} shadow lg:px-6 lg:py-2 px-4 py-2 rounded-md text-sm lg:text-md`}
                onClick={() => setFilter('all')}
              >
                <h2 className="hidden lg:block rounded-t-lg text-center">All Applications</h2>
                <h2 className="lg:hidden block rounded-t-lg text-center">All</h2>
                <div className='font-bold '>({allApplications.length})</div>
              </button>

              <button
                className={`flex gap-2 items-center ${filter === 'approved' ? 'bg-green-600 text-white border-green-600' : 'bg-white hover:bg-slate-200'} shadow lg:px-6 lg:py-2 px-4 py-2 rounded-md text-sm lg:text-md`}
                onClick={() => setFilter('approved')}
              >
                <h2 className="rounded-t-lg text-center">Approved</h2>
                <div className={`font-bold ${filter === 'approved' ? 'text-white' : 'text-green-600'}`}>({approvedApplications.length})</div>
              </button>

              <button
                className={`flex gap-2 items-center ${filter === 'pending' ? 'bg-yellow-500 text-white border-yellow-500' : 'bg-white hover:bg-slate-200'} shadow lg:px-6 lg:py-2 px-4 py-2 rounded-md text-sm lg:text-md`}
                onClick={() => setFilter('pending')}
              >
                <h2 className="rounded-t-lg text-center">Pending</h2>
                <div className={`font-bold ${filter === 'pending' ? 'text-white' : 'text-yellow-500'}`}>({pendingApplications.length})</div>
              </button>

              <button
                className={`flex gap-2 items-center ${filter === 'rejected' ? 'bg-red-600 text-white border-red-600' : 'bg-white hover:bg-slate-200'} shadow lg:px-6 lg:py-2 px-4 py-2 rounded-md text-sm lg:text-md`}
                onClick={() => setFilter('rejected')}
              >
                <h2 className="rounded-t-lg text-center">Rejected</h2>
                <div className={`font-bold ${filter === 'rejected' ? 'text-white' : 'text-red-600'}`}>({rejectedApplications.length})</div>
              </button>
            </div>

            <div className="flex w-full lg:w-auto mt-4 lg:mt-0 gap-2 items-center bg-white shadow px-4 lg:px-6 py-2 rounded-md border text-sm lg:text-md">
              <input
                type="text"
                placeholder="Search Applications"
                className="w-full bg-transparent outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="lg:grid gap-4">
            <div className="bg-white shadow rounded-lg col-span-1 md:col-span-2">
              <div className='flex items-center justify-between font-semibold text-xl w-full p-4 rounded-t-lg border-b'>
                <h2 className='font-bold text-xl'>Inbox</h2>
                <button
                  className='flex items-center gap-2 bg-blue-600 text-sm lg:text-base text-white shadow rounded-md lg:px-6 px-3 py-2'
                  onClick={() => setSortOrder(sortOrder === 'recent' ? 'oldest' : 'recent')}
                >
                  <BiFilter className='w-6 h-6' />
                  {sortOrder === 'recent' ? 'Recent' : 'Oldest'}
                </button>
              </div>

              <div className="space-y-4 p-4 text-slate-800">
                {filteredApplications.length === 0 ? (
                  <div className='h-full flex flex-col gap-2 justify-center items-center'>
                    <span className='text-xl font-medium text-slate-500'>You have no applications yet.</span>
                    <Link to={'/scholarship-listing'}>
                      <button className='flex gap-2 items-center text-base lg:text-lg bg-blue-600 rounded-md px-4 py-2 text-white fond-medium hover:bg-blue-800 group transition ease-in-out'>
                        Go to Scholarship List
                        <FaAngleRight className='w-5 h-5 group-hover:translate-x-2 transition ease-in-out' />
                      </button>
                    </Link>
                  </div>
                ) : (
                  <div className="overflow-y-auto max-h-[800px]">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Title
                          </th>
                          <th scope="col" className="lg:table-cell hidden px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Organization
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th scope="col" className="lg:table-cell hidden px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredApplications.map(application => (
                          <tr key={application._id} className="hover:bg-slate-200">
                            {isMobile ? (
                              <Link to={`/scholarship-dashboard-details/${application._id}`} className="contents">
                                <td className="px-6 py-4 whitespace-nowrap flex gap-2 items-center">
                                  <div className='lg:table-cell hidden bg-white w-12 h-12 rounded-md'>
                                    {application.scholarshipProgram && application.scholarshipProgram.scholarshipImage ? (
                                      <img src={application.scholarshipProgram.scholarshipImage} alt="Scholarship" className='w-full h-full object-cover rounded-md' />
                                    ) : (
                                      <div className='w-full h-full flex items-center justify-center text-white'>N/A</div>
                                    )}
                                  </div>
                                  <span className='text-sm lg:text-base lg:font-bold'>{application.scholarshipProgram?.title}</span>
                                </td>

                                <td className="lg:table-cell hidden px-6 py-4 whitespace-nowrap">
                                  <span>{application.scholarshipProgram?.organizationName}</span>
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap ">
                                  <div className='flex flex-row items-center gap-2'>
                                    <div className={`rounded-full w-2 h-2 ${getStatusColor(application.applicationStatus)}`}></div>
                                    <span className='lg:text-base text-sm'>{toSentenceCase(application.applicationStatus)}</span>
                                  </div>
                                </td>

                                <td className="lg:table-cell hidden px-6 py-4 whitespace-nowrap">
                                  <Link to={`/scholarship-dashboard-details/${application._id}`}>
                                    <button className='flex gap-2 items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition ease-in-out'>
                                      View
                                      <FaAngleRight className='w-5 h-5' />
                                    </button>
                                  </Link>
                                </td>
                              </Link>
                            ) : (
                              <>
                                <td className="lg:px-6 py-4 whitespace-nowrap flex gap-2 items-center">
                                  <div className='bg-whit w-12 h-12 rounded-md'>
                                    {application.scholarshipProgram && application.scholarshipProgram.scholarshipImage ? (
                                      <img src={application.scholarshipProgram.scholarshipImage} alt="Scholarship" className='w-full h-full object-cover rounded-md' />
                                    ) : (
                                      <div className='w-full h-full flex items-center justify-center text-white'>N/A</div>
                                    )}
                                  </div>
                                  <span className='text-sm lg:text-base lg:font-bold'>{application.scholarshipProgram?.title}</span>
                                </td>
                                <td className="lg:table-cell hidden px-6 py-4 whitespace-nowrap">
                                  <span>{application.scholarshipProgram?.organizationName}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className='flex items-center gap-2'>
                                    <div className={`rounded-full w-2 h-2 ${getStatusColor(application.applicationStatus)}`}></div>
                                    <span className='lg:text-base text-sm'>{toSentenceCase(application.applicationStatus)}</span>
                                  </div>
                                </td>
                                <td className="lg:table-cell hidden px-6 py-4 whitespace-nowrap">
                                  <Link to={`/scholarship-dashboard-details/${application._id}`}>
                                    <button className='flex gap-2 items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition ease-in-out'>
                                      View
                                      <FaAngleRight className='w-5 h-5' />
                                    </button>
                                  </Link>
                                </td>
                              </>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
