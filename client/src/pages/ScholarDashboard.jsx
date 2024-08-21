import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
// import { MdModeEdit } from "react-icons/md";
// import { IoDocumentAttachOutline } from "react-icons/io5";
// import { HiDocumentText } from "react-icons/hi";
// import { MdLockOutline } from "react-icons/md";
import { FaRegHeart } from "react-icons/fa";
import { BiCommentDots } from "react-icons/bi";
import { FaRegEye } from "react-icons/fa6";
import { FaAngleRight } from "react-icons/fa";



export default function ScholarDashboard() {
  useEffect(() => {
    document.title = "Scholar Dashboard | HubIsko";
  }, []);

  const currentUser = useSelector((state) => state.user.currentUser);
  const [applications, setApplications] = useState([]);
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

        setApplications(data);

      } catch (error) {
        console.error('Error fetching applications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [currentUser]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-400';
      case 'approved':
        return 'bg-green-400';
      case 'rejected':
        return 'bg-red-400';
      case 'completed':
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
        <div className='py-12 max-w-6xl mx-auto justify-between px-24'>
          {/* <h1 className='text-3xl font-bold mb-4 text-slate-800'>
            Scholar Dashboard
          </h1> */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[350px]">
            {/* Overview of current applications */}

            <div className="flex flex-col items-center h-[350px] max-h-[350px] bg-white shadow rounded-lg">

              <h2 className="font-bold text-xl mb-2 w-full p-4 rounded-t-lg border-b-2">Current Applications</h2>
              <div className='text-8xl mt-20 font-bold text-blue-600'>00</div>
              {/* Application items */}

            </div>

            <div className="bg-white shadow rounded-lg col-span-1 md:col-span-2">
              <div className='flex justify-between "font-semibold text-xl w-full bg-blue-600 p-4 rounded-t-lg text-white'>
                <h2 >Scholarships</h2>

                <Link to={`/application-box`}>
                  <button className='bg-white text-blue-600 font-bold px-2 rounded-md hover:bg-slate-200'>See all</button>
                </Link>
              </div>

              <div className="space-y-4 p-4 text-slate-800">
                {applications.length === 0 ? (
                  <div className='h-full flex flex-col gap-2 justify-center items-center mt-20'>
                    <span className='text-xl font-medium text-slate-500'>You have no Applications yet.</span>
                    <Link to={'/scholarship-listing'}>
                      <button className='flex gap-2 items-center bg-blue-600 rounded-md px-4 py-2 text-white fond-medium hover:bg-blue-800 group transition ease-in-out'>
                        Go to Scholarship List
                        <FaAngleRight className='w-5 h-5 group-hover:translate-x-2 transition ease-in-out' />
                      </button>
                    </Link>
                  </div>
                ) : (
                  <div className="overflow-y-auto h-64">
                    {applications.map(application => (
                      <Link key={application._id} to={`/application-detail/${application._id}`}>
                        <div className='flex items-center justify-between hover:bg-slate-200 p-2 rounded-md'>
                          <div className='flex flex-row gap-2'>
                            <div className='bg-blue-600 w-12 h-12 rounded-md'>
                              <img src={application.scholarshipProgram.scholarshipImage} alt="Scholarship" className='w-full h-full object-cover rounded-md' />
                            </div>
                            <div className='flex flex-col'>
                              <div className='flex items-center gap-2'>
                                <span className='font-bold'>{application.scholarshipProgram.organizationName}</span>
                                <div className='bg-blue-600 w-2 h-2 rounded-full'></div>
                                <span className='text-blue-600 text-sm'>New</span>
                              </div>
                              <span>{application.scholarshipProgram.title}</span>
                            </div>
                          </div>
                          <div className='flex flex-row items-center gap-2'>
                          <div className={`rounded-full w-2 h-2 ${getStatusColor(application.applicationStatus)}`}></div>
                          <span>{toSentenceCase(application.applicationStatus)}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Forum Posts */}
          <div className='w-full flex justify-center border-t-2 mt-14'>
            <span className='text-2xl bg-[#f8f8fb] -translate-y-5 px-8 font-medium text-slate-500'>Your Forum Posts</span>
          </div>

          {/* POSTS */}

          <div className='grid grid-cols-3 sm:grid-rows-1 gap-8'>
            <div className='bg-white border p-4 rounded-md flex flex-col hover:-translate-y-1 hover:shadow-lg transition ease-in-out'>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi, vel.
              <span className='text-sm flex items-end justify-end w-full text-slate-600'>Posted: July 7,2024</span>

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


        </div>
      </main>
      <Footer />
    </div>
  );
}