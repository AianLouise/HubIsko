import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { FaRegHeart } from "react-icons/fa";
import { BiCommentDots } from "react-icons/bi";
import { FaRegEye } from "react-icons/fa6";
import { FaAngleRight } from "react-icons/fa";
import { BiFilter } from 'react-icons/bi';

export default function ScholarDashboard() {
  useEffect(() => {
    document.title = "Scholar Dashboard | HubIsko";
  }, []);

  const currentUser = useSelector((state) => state.user.currentUser);
  const [approvedApplications, setApprovedApplications] = useState([]);
  const [pendingApplications, setPendingApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the user's applications from the backend
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

        // Filter applications to include those with "Approved" and "Pending" status
        const approved = data.filter(app => app.applicationStatus === 'Approved');
        const pending = data.filter(app => app.applicationStatus === 'Pending');
        setApprovedApplications(approved);
        setPendingApplications(pending);

      } catch (error) {
        console.error('Error fetching applications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [currentUser]);

  const allApplications = [...approvedApplications, ...pendingApplications];

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
    <div className="flex flex-col min-h-screen"> {/* Flex container */}
      <Header />
      <main className="flex-grow bg-[#f8f8fb]"> {/* Main content grows to fill available space */}
      <div className='flex flex-col gap-4 py-12 max-w-6xl mx-auto justify-between p-4 lg:px-24'>

      <div className='flex flex-col border-b'>
        <div className='flex justify-between items-center'>
        <span className='font-bold text-2xl'>Scholarship Announcements <span className='text-blue-500'>(0)</span> </span>

        <button className='flex gap-2 bg-white hover:bg-slate-200 px-6 py-2 border shadow rounded-md'>
          <BiFilter className='w-6 h-6 text-blue-600' />
          <span>Recent</span>
        </button>
      </div>

      <div className='grid grid-cols-3 gap-10 my-10'> 
              <div className='bg-white border p-4 rounded-md flex flex-col gap-4 hover:-translate-y-1 hover:shadow-lg transition ease-in-out'>

                <div className='flex gap-2'>
                  <div className='bg-blue-600 w-12 h-12 rounded-md'></div>
                  <div className='flex flex-col'>
                    <span className='font-bold'>Organization Name</span>
                    <span className='text-blue-600'>Scholarship Title</span>
                  </div>
                </div>

                <p className='bg-slate-200 p-4 rounded-md'><span className='text-blue-600 font-bold'>@Students</span> Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi, vel.</p>
                <span className='text-sm flex items-end justify-end w-full text-slate-600'>Announced: July 7,2024</span>
                <div className='border-t mt-2'>
                  <div className='flex flex-row justify-between mt-2 gap-2'>
                    <div className='flex flex-row gap-2'>
                      <div className='flex flex-row gap-1 px-2'>
                        <FaRegHeart className='w-6 h-6 font-bold text-blue-600' />
                        <span>123</span>
                      </div>
                      <div className='flex flex-row gap-1'>
                        <BiCommentDots className='w-6 h-6 text-blue-600' />
                        <span>10</span>
                      </div>
                    </div>
                    <div className='flex flex-row gap-1 pr-2'>
                      <FaRegEye className='w-6 h-6 text-blue-600' />
                      <span>1.2k</span>
                    </div>
                  </div>
                </div>
        </div>
           
      </div>

        {/* If no Scholarship yet */}
        {/* <div className='flex flex-col items-center justify-center gap-2 my-20 text-slate-500 font-medium'>
          You currently have no scholarship announcements.
          <button className='flex gap-2 items-center text-base lg:text-lg bg-blue-600 rounded-md px-6 py-2 text-white fond-medium hover:bg-blue-800 group transition ease-in-out'>
            Why?
          </button>
        </div> */}


      </div>
      <span className='font-bold text-2xl'>Scholarship Applications</span>

      <div className='mb-2'>
          <span className='font-medium text-slate-500'>Recent Scholarship Activities</span>

          <div className='grid grid-cols-3 gap-4 text-sm mt-2'>
            
            <div className='border border-blue-400 shadow rounded-md p-2 py-4 flex items-center justify-center flex-col gap-2 font-medium'>
              <div>
                  <span className='py-2'>You Applied for:</span>
                  <span className='text-blue-600 px-2 py-2 rounded-md'>Scholarship Title</span>
              </div>
            </div>

            <div className='border border-yellow-400  shadow rounded-md flex items-center justify-center flex-col gap-2 font-medium'>
              <div>
              <span className='py-2'>Requested review:</span>
                  <span className=' text-yellow-600 px-2 py-2 rounded-md'>Scholarship Title</span>
              </div>
            </div>

            <div className='border border-green-400  shadow rounded-md flex items-center justify-center flex-col gap-2 font-medium'>
              <div>
                  <span className='py-2'>Approved Application:</span>
                  <span className=' text-green-600 px-2 py-2 rounded-md'>Scholarship Title</span>
              </div>
            </div>

          </div>
      </div>

        <div className="flex flex-row justify-between items-center mt-4">
          <div className='flex gap-4'>
            <button className="flex gap-2 font-medium items-center bg-blue-600 text-white shadow px-6 py-2 rounded-md text-md">
                <h2 className="rounded-t-lg text-center">All Applications</h2>
                <div className='text-white'>(0)</div>
              </button>

              <button className="flex gap-2 items-center bg-white hover:bg-slate-200 shadow px-6 py-2 rounded-md border text-md">
                <h2 className="font-bold rounded-t-lg text-center">Approved</h2>
                <div className='font-bold text-green-600'>({approvedApplications.length})</div>
              </button>
             
              <button className="flex gap-2 items-center bg-white hover:bg-slate-200 shadow px-6 py-2 rounded-md border text-md">
                <h2 className="font-bold rounded-t-lg text-center">Pending</h2>
                <div className='font-bold text-yellow-600'>({pendingApplications.length})</div>
              </button>
          </div>

    
          <div className="flex gap-2 items-center bg-white shadow px-6 py-2 rounded-md border text-md">
            <input type="text" 
            placeholder="Search Applications" 
            className="w-full bg-transparent outline-none" />
          </div>
      </div>

          <div className="grid gap-4 lg:max-h-[350px]">
            {/* Overview of approved applications */}
            <div className="bg-white shadow rounded-lg col-span-1 md:col-span-2">
              <div className='flex items-center justify-between font-semibold text-xl w-full p-4 rounded-t-lg border-b'>
                <h2 className='font-bold text-xl'>Inbox</h2>
                <button className='flex items-center gap-2 bg-blue-600 text-base text-white shadow rounded-md px-6 py-2'>
                  <BiFilter className='w-6 h-6' />
                  Recent</button>
              </div>

              <div className="space-y-4 p-4 text-slate-800">
                {allApplications.length === 0 ? (
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
                  <div className="overflow-y-auto max-h-[800] h-64">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Organization
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Title
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {allApplications.map(application => (
                          <tr key={application._id} className="hover:bg-slate-200">
                            <td className="px-6 py-4 whitespace-nowrap flex gap-2 items-center">
                              <div className='bg-blue-600 w-12 h-12 rounded-md'>
                                {application.scholarshipProgram && application.scholarshipProgram.scholarshipImage ? (
                                  <img src={application.scholarshipProgram.scholarshipImage} alt="Scholarship" className='w-full h-full object-cover rounded-md' />
                                ) : (
                                  <div className='w-full h-full flex items-center justify-center text-white'>N/A</div>
                                )}
                              </div>

                              <span className='font-bold'>{application.scholarshipProgram?.organizationName}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span>{application.scholarshipProgram?.title}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className='flex flex-row items-center gap-2'>
                                <div className={`rounded-full w-2 h-2 ${getStatusColor(application.applicationStatus)}`}></div>
                                <span>{toSentenceCase(application.applicationStatus)}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Link to={`/scholarship-dashboard-details/${application._id}`}>
                                <button className='flex gap-2 items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition ease-in-out'>
                                  View
                                  <FaAngleRight className='w-5 h-5' />
                                </button>
                              </Link>
                            </td>

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
