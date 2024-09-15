import React, { useEffect, useState } from 'react';
import ProviderHeaderSidebar from '../../components/ProviderHeaderAndSidebar';
import { BiDotsHorizontal } from 'react-icons/bi';
import { BiSolidRightArrow } from "react-icons/bi";
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { BiCog } from 'react-icons/bi';

export default function ProviderDashboard() {
  useEffect(() => {
    document.title = "Dashboard | HubIsko";
  }, []);

  const { currentUser, loading, error } = useSelector((state) => state.user);
  const orgName = currentUser?.scholarshipProviderDetails.organizationName;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const userId = currentUser?._id;
  const providerId = currentUser?._id;

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

  const navigate = useNavigate();

  return (
    <div className={`flex flex-col min-h-screen`}>
      <main className={`flex-grow bg-[#f8f8fb] transition-all duration-200 ease-in-out ${sidebarOpen ? 'ml-64' : ''} `}>
        <ProviderHeaderSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} currentPath={`${currentUser.scholarshipProviderDetails.organizationName} / Dashboard`} />

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
          <div className='grid grid-cols-2 gap-10'>
            <div className="flex divide-x bg-white p-6 rounded-md shadow-md transition-all">
              <div className='flex flex-col w-1/2 items-center'>
                <h2 className="text-xl font-semibold text-slate-700">Applications Received</h2>
                <p className="text-8xl font-bold flex h-full justify-center items-center">{applicationsCount}</p>
              </div>

              <div className='px-4 flex flex-col gap-2 w-full'>
                <span className='font-medium'>Received Applications</span>

                <div className='overflow-y-auto max-h-48 flex flex-col gap-2'>
                  {applicationDetails.length > 0 ? (
                    applicationDetails.slice(0, 3).map((application, index) => (
                      <Link
                        key={index}
                        to={`/view-scholarships/${application.scholarshipProgram}`}
                        className='flex gap-2 justify-between border rounded-md w-full p-2 hover:bg-slate-200'
                      >
                        <div className='flex gap-2 items-center text-left'>
                          <div className='w-6 h-6 rounded-md overflow-hidden'>
                            <img src={application.profilePicture} alt={`${application.firstName} ${application.lastName}`} className='w-full h-full object-cover' />
                          </div>
                          <span className='font-medium'>
                            <span className='text-black font-normal'>{application.firstName} {application.lastName}</span> <span className='text-blue-600 font-normal'>sent a new application</span>
                          </span>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p>No applications received yet.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-8">
              <Link to="/scholar-applications">
                <div className="flex justify-between items-center bg-white p-6 rounded-md shadow-md transition-all hover:-translate-y-2 hover:bg-slate-200 group ease-in-out">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-700">Total Applications</h2>
                    <p className="text-2xl font-bold text-left">{applicationsCount}</p>
                  </div>

                  <div className='hidden items-center text-blue-600 font-medium gap-2 group-hover:flex ease-in-out transition'>
                    <span>View</span>
                    <BiSolidRightArrow className=' w-6 h-6' />
                  </div>
                </div>
              </Link>

              <button className="flex justify-between items-center bg-white p-6 rounded-md shadow-md transition-all hover:-translate-y-2 hover:bg-slate-200 group ease-in-out">
                <div>
                  <h2 className="text-xl font-semibold text-slate-700">Total Scholarship Programs</h2>
                  <p className="text-2xl font-bold text-left">{activeApplicationsCount}</p>
                </div>

                <div className='hidden items-center text-blue-600 font-medium gap-2 group-hover:flex ease-in-out transition'>
                  <span>View</span>
                  <BiSolidRightArrow className=' w-6 h-6' />
                </div>
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-md shadow-md transition-all">
            <h2 className="text-2xl font-bold text-slate-700 mb-4">Recent Activity</h2>
            <ul className="list-disc pl-5 text-slate-700">
              {activities.map(activity => (
                <li key={activity._id} className="mb-2 flex items-center">
                  <span className={`inline-block w-2 h-2 rounded-full mr-2 ${getActivityColor(activity.action)}`}></span>
                  {activity.details} for {activity.scholarshipProgramId.title}
                </li>
              ))}
            </ul>
          </div>
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
