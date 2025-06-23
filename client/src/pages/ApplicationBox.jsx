import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { FaAngleRight } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useTokenExpiry from '../hooks/useTokenExpiry'; // Adjust the import path

export default function ApplicationBox() {
  useTokenExpiry();

  useEffect(() => {
    document.title = "Scholar Dashboard | HubIsko";
    window.scrollTo(0, 0);
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

  return (
    <div className='flex flex-col min-h-screen'>
      <Header />
      <main className="flex-grow bg-[#f8f8fb] font-medium">
        <div className="max-w-6xl p-2 lg:px-24 mx-auto">

        <div className="w-full block lg:hidden text-center p-4">
        <strong className="text-xl text-center">Application Inbox</strong>
        </div>
      
          <div className="border bg-white flex flex-col gap-8 rounded-md p-4 shadow lg:mt-20">
            <div className="flex justify-between items-center">
              <span className="text-xl hidden lg:block">Application Inbox</span>
              <input
                type="text"
                placeholder='Search inbox...'
                name=""
                id=""
                className='border-2 py-2 px-4 w-full lg:w-[300px] font-medium rounded-md focus:outline-blue-400' />
            </div>

            <div className="flex flex-col">
              <div className="space-y-4 text-slate-800">
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
                        <div className='flex items-center justify-between hover:bg-slate-200 bg-slate-200 lg:bg-none p-2 rounded-md'>
                          <div className='flex flex-row gap-2'>
                            <div className='bg-blue-600 w-8 h-8 lg:w-12 lg:h-12 rounded-full'>
                              {application.scholarshipProgram && application.scholarshipProgram.scholarshipImage ? (
                                <img src={application.scholarshipProgram.scholarshipImage} alt="Scholarship" className='w-full h-full object-cover rounded-full' />
                              ) : (
                                <div className='w-full h-full flex items-center justify-center text-white'>No Image</div>
                              )}
                            </div>
                            <div className='flex flex-col'>
                              <div className='flex items-center gap-2'>
                                <span className='font-bold text-sm lg:text-lg'>{application.scholarshipProgram?.organizationName}</span>
                                <div className='bg-blue-600 w-2 h-2 rounded-full  hidden lg:block'></div>
                                <span className='text-blue-600 text-sm  hidden lg:block'>New</span>
                              </div>
                              <span className="text-sm lg:text-base">{application.scholarshipProgram?.title}</span>
                            </div>
                          </div>
                          <div className='flex flex-row items-center text-sm lg:text-lg gap-2'>
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
        </div>
      </main>
      <Footer />
    </div>
  );
}