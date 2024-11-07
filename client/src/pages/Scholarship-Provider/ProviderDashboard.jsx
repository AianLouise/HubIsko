import React, { useEffect, useState } from 'react';
import ProviderHeaderSidebar from '../../components/ProviderHeaderAndSidebar';
import { BiDotsHorizontal } from 'react-icons/bi';
import { BiSolidRightArrow } from "react-icons/bi";
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { BiCog } from 'react-icons/bi';
import { FaFileAlt, FaUniversity } from 'react-icons/fa';

export default function ProviderDashboard() {
  useEffect(() => {
    document.title = "Dashboard | HubIsko";
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  });

  const { currentUser, loading, error } = useSelector((state) => state.user);
  const orgName = currentUser?.scholarshipProviderDetails.organizationName;
  const userId = currentUser?._id;
  const providerId = currentUser?._id;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);



  const [applicationsCount, setApplicationsCount] = useState(0);
  const [activeApplicationsCount, setActiveApplicationsCount] = useState(0); // Assuming you have a way to get active applications count

  useEffect(() => {
    const fetchApplicationsCount = async () => {
      try {
        const response = await fetch(`/api/provider/countScholarshipApplications/${userId}`); // Adjust the endpoint as necessary
        const data = await response.json();
        setApplicationsCount(data.count);
      } catch (error) {
        console.error('Error fetching applications count:', error);
      }
    };

    if (userId) {
      fetchApplicationsCount();
    }
  }, [userId]);

  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch(`/api/scholarshipActivity/scholarship-activity-logs/provider/${providerId}`);
        const data = await response.json();
        if (Array.isArray(data)) {
          setActivities(data);
        } else {
          console.error('Fetched activities data is not an array:', data);
        }
      } catch (error) {
        console.error('Error fetching activities:', error);
      }
    };

    fetchActivities();
  }, [providerId]);

  const [applicationDetails, setApplicationDetails] = useState([]);

  useEffect(() => {
    // Fetch application details from the backend
    const fetchApplicationDetails = async () => {
      try {
        const response = await fetch(`/api/provider/${userId}/scholarship-programs`); // Adjust the endpoint as needed
        const data = await response.json();
        setApplicationDetails(data.applicationDetails || []);
        setApplicationsCount(data.applicationDetails.length || 0);
      } catch (error) {
        console.error('Error fetching application details:', error);
      }
    };

    fetchApplicationDetails();
  }, [userId]);

  const [scholarships, setScholarships] = useState([]);

  useEffect(() => {
    const fetchScholarships = async () => {
      if (currentUser && currentUser._id) {
        try {
          const response = await fetch(`/api/scholarshipProgram/provider/${currentUser._id}`);
          const data = await response.json();
          if (Array.isArray(data)) {
            setScholarships(data);
          } else {
            setScholarships([]);
          }
        } catch (error) {
          console.error('Error fetching scholarships:', error);
          setError('Failed to fetch scholarships');
        }
      }
    };

    fetchScholarships();
  }, [currentUser]);

  const navigate = useNavigate();

  return (
    <div className={`flex flex-col min-h-screen`}>
      <main className={`flex-grow bg-[#f8f8fb] transition-all duration-200 ease-in-out ${sidebarOpen ? 'ml-64' : ''} `}>
        <ProviderHeaderSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

        {currentUser?.status === 'Pending Verification' && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 m-6 rounded-md" role="alert">
            <p className="font-bold">Account Under Verification</p>
            <p>Your account is currently under verification. Some features may be restricted until your account is fully verified.</p>
          </div>
        )}

        {currentUser?.status === 'Verified' && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 m-6 my-8 rounded-md mx-24" role="alert">
            <p className="font-bold">Welcome Back!</p>
            <p>Your account is fully verified. Enjoy all the features available to you.</p>
          </div>
        )}

        {currentUser?.status === 'Rejected' && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 m-6 my-8 rounded-md mx-24" role="alert">
            <p className="font-bold">Account Rejected</p>
            <p>Your account has been rejected. Reason: {currentUser.rejectReason}</p>
          </div>
        )}

        <div className='bg-blue-500 mx-24 px-10 flex justify-between rounded-md text-white'>
          <div className={'flex w-full gap-4 items-center mx-auto'}>
            <div className='bg-white w-24 h-24 my-8 rounded-full overflow-hidden'>
              {currentUser && currentUser.profilePicture ? (
                <img
                  src={currentUser.profilePicture}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-white">
                  No Profile Picture
                </div>
              )}
            </div>
            <div className='flex flex-col gap-1 w-1/2'>
              <h1 className='text-2xl font-bold '>Welcome {orgName}!</h1>
              <p className='text-base'>Here is your dashboard!</p>
            </div>

          </div>

          <div className='flex items-center w-[200px]'>
            <Link to={'/provider-settings'} className='flex gap-2 font-medium px-6 py-2 rounded-md text-left bg-white hover:bg-slate-200 text-blue-600 shadow whitespace-nowrap'>
              <BiCog className='w-6 h-6' />
              See Settings
            </Link>
          </div>
        </div>

        <div className='max-w-8xl mx-auto px-24 my-8 gap-10 flex-col flex'>
          <div className="min-h-screen p-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="bg-white p-6 rounded-lg shadow-md transition-all hover:shadow-lg">
                <div className="flex flex-col items-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-700">Applications Received</h2>
                  <p className="text-6xl font-bold text-blue-600">{applicationsCount}</p>
                </div>

                <div className="flex flex-col gap-4">
                  <span className="font-medium text-gray-700">Recent Applications</span>
                  <div className="overflow-y-auto max-h-48 flex flex-col gap-2">
                    {applicationDetails.length > 0 ? (
                      applicationDetails.slice(0, 5).map((application, index) => (
                        <Link
                          key={index}
                          to={`/view-scholarships/${application.scholarshipProgram}`}
                          className="flex gap-4 items-center border rounded-md p-3 hover:bg-gray-100 transition-all"
                        >
                          <div className="w-12 h-12 rounded-full overflow-hidden">
                            <img
                              src={application.profilePicture}
                              alt={`${application.firstName} ${application.lastName}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium text-black">
                              {application.lastName}, {application.firstName} {application.middleName ? application.middleName.charAt(0) + '.' : ''}
                            </span>
                            <span className="text-blue-600">sent a new application</span>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <p className="text-gray-500">No applications received yet.</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-8">
                <Link to="/scholar-applications">
                  <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-md transition-all hover:shadow-lg hover:bg-gray-100 group">
                    <div className="flex items-center gap-4">
                      <FaFileAlt className="text-3xl text-blue-500" />
                      <div>
                        <h2 className="text-xl font-semibold text-gray-700">Total Applications</h2>
                        <p className="text-2xl font-bold text-gray-700">{applicationsCount}</p>
                      </div>
                    </div>
                    <div className="hidden items-center text-blue-500 font-medium gap-2 group-hover:flex">
                      <span>View</span>
                      <BiSolidRightArrow className="w-6 h-6" />
                    </div>
                  </div>
                </Link>

                <Link to="/scholarships">
                  <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-md transition-all hover:shadow-lg hover:bg-gray-100 group">
                    <div className="flex items-center gap-4">
                      <FaUniversity className="text-3xl text-blue-500" />
                      <div>
                        <h2 className="text-xl font-semibold text-gray-700">Total Scholarship Programs</h2>
                        <p className="text-2xl font-bold text-gray-700">{Array.isArray(scholarships) ? scholarships.length : 0}</p>
                      </div>
                    </div>
                    <div className="hidden items-center text-blue-500 font-medium gap-2 group-hover:flex">
                      <span>View</span>
                      <BiSolidRightArrow className="w-6 h-6" />
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* <div className="bg-white p-6 rounded-md shadow-md transition-all">
            <h2 className="text-2xl font-bold text-slate-700 mb-4">Recent Activity</h2>
            <ul className="list-disc pl-5 text-slate-700">
              {activities.map(activity => (
                <li key={activity._id} className="mb-2 flex items-center">
                  <span className={`inline-block w-2 h-2 rounded-full mr-2 ${getActivityColor(activity.action)}`}></span>
                  {activity.details} for {activity.scholarshipProgramId.title}
                </li>
              ))}
            </ul>
          </div> */}
        </div>
      </main>
    </div>
  );
}

const getActivityColor = (action) => {
  switch (action) {
    case 'new_application':
      return 'bg-blue-600';
    case 'update_scholarship':
      return 'bg-green-600';
    case 'new_scholarship':
      return 'bg-purple-600';
    default:
      return 'bg-gray-600';
  }
};
