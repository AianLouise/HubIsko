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
import { IoMdArrowDropleftCircle } from "react-icons/io";


export default function ScholarDashboard() {
  useEffect(() => {
    document.title = "Scholar Dashboard | HubIsko";
  }, []);

  const currentUser = useSelector((state) => state.user.currentUser);
  const userId = currentUser._id;

  const [approvedApplications, setApprovedApplications] = useState([]);
  const [pendingApplications, setPendingApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024); // Tailwind's lg breakpoint is 1024px
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Call initially to set the state based on the initial window size

    return () => window.removeEventListener('resize', handleResize);
  }, []);


  const [currentIndex, setCurrentIndex] = useState(0);

  const activities = [
    {
      borderColor: 'border-blue-400',
      textColor: 'text-blue-600',
      title: 'You Applied for:',
      scholarshipTitle: 'Scholarship Title',
    },
    {
      borderColor: 'border-yellow-400',
      textColor: 'text-yellow-600',
      title: 'Requested review:',
      scholarshipTitle: 'Scholarship Title',
    },
    {
      borderColor: 'border-green-400',
      textColor: 'text-green-600',
      title: 'Approved Application:',
      scholarshipTitle: 'Scholarship Title',
    },
  ];


  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % activities.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + activities.length) % activities.length);
  };

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

  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('recent');

  const getFilteredApplications = () => {
    let applications;
    switch (filter) {
      case 'approved':
        applications = approvedApplications;
        break;
      case 'pending':
        applications = pendingApplications;
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
  const [scholarshipData, setScholarshipData] = useState([]);
  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await fetch('/api/announcement/student-scholarship-program', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }),
        });
        const data = await response.json();
        setScholarshipData(data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching announcements:', error);
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, [userId]);

  const handleNextCarousel = () => {
    setCarouselIndex((prevIndex) => (prevIndex + 2) % scholarshipData[0].announcements.length);
  };

  const handlePrevCarousel = () => {
    setCarouselIndex((prevIndex) => (prevIndex - 2 + scholarshipData[0].announcements.length) % scholarshipData[0].announcements.length);
  };

  // Calculate total number of announcements
  const totalAnnouncements = scholarshipData.reduce((total, program) => total + program.announcements.length, 0);


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
      <main className="flex-grow bg-[#f8f8fb] pb-24"> {/* Main content grows to fill available space */}
        <div className='flex flex-col gap-4 py-12 max-w-6xl mx-auto justify-between p-4 lg:px-24'>

          <div className='flex flex-col border-b'>
            <div className='flex flex-col gap-2 lg:gap-0 lg:flex-row lg:justify-between lg:items-center'>
              <span className='font-bold text-xl lg:text-2xl'>
                Scholarship Announcements <span className='text-blue-500'>({totalAnnouncements})</span>
              </span>

              <div className=''>
                <button className='flex gap-2 bg-white hover:bg-slate-200 px-6 py-2 border shadow rounded-md'>
                  <BiFilter className='w-6 h-6 text-blue-600' />
                  <span>Recent</span>
                </button>
              </div>
            </div>

            <div className='relative'>
              <div className='grid grid-cols-1 lg:grid-cols-2 mx-10 lg:mx-0 gap-10 my-10'>
                {scholarshipData.length > 0 ? (
                  scholarshipData[0].announcements.slice(carouselIndex, carouselIndex + 2).map((announcement) => (
                    <div key={announcement._id} className='bg-white border p-4 rounded-md flex flex-col gap-4 hover:-translate-y-1 hover:shadow-lg transition ease-in-out'>
                      <div className='flex gap-2'>
                        <div className='bg-blue-600 w-12 h-12 rounded-md overflow-hidden'>
                          <img src={scholarshipData[0].scholarshipProgram.scholarshipImage} alt="Scholarship" className="w-full h-full object-cover" />
                        </div>
                        <div className='flex flex-col'>
                          <span className='font-bold'>{scholarshipData[0].scholarshipProgram.organizationName}</span>
                          <span className='text-blue-600'>{scholarshipData[0].scholarshipProgram.title}</span>
                        </div>
                      </div>
                      <p className='bg-slate-200 p-4 rounded-md'>
                        <span className='text-blue-600 font-bold'>@Students</span> {announcement.content}
                      </p>
                      <span className='text-sm flex items-end justify-end w-full text-slate-600'>
                        Announced: {new Date(announcement.date).toLocaleDateString()}
                      </span>
                      <div className='border-t mt-2'>
                        <div className='flex flex-row justify-between mt-2 gap-2'>
                          <div className='flex flex-row gap-2'>
                            <div className='flex flex-row gap-1 px-2'>
                              <FaRegHeart className='w-6 h-6 font-bold text-blue-600' />
                              <span>{announcement.likesCount}</span>
                            </div>
                            <div className='flex flex-row gap-1'>
                              <BiCommentDots className='w-6 h-6 text-blue-600' />
                              <span>{announcement.comments.length}</span>
                            </div>
                          </div>
                          <div className='flex flex-row gap-1 pr-2'>
                            <FaRegEye className='w-6 h-6 text-blue-600' />
                            <span>1.2k</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className='text-gray-700'>No announcements available.</p>
                )}
              </div>
              {scholarshipData.length > 0 && scholarshipData[0].announcements.length > 2 && (
                <>
                  <div className='absolute top-1/2 left-4 transform -translate-y-1/2 translate-x-[-80px]'>
                    <button
                      onClick={handlePrevCarousel}
                      className='bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 transition duration-300 transform hover:translate-x-[-5px]'
                    >
                      &lt;
                    </button>
                  </div>
                  <div className='absolute top-1/2 right-4 transform -translate-y-1/2 translate-x-[80px]'>
                    <button
                      onClick={handleNextCarousel}
                      className='bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 transition duration-300 transform hover:translate-x-[5px]'
                    >
                      &gt;
                    </button>
                  </div>
                </>
              )}
            </div>


            {/* If no Scholarship yet */}
            {/* <div className='flex flex-col items-center justify-center gap-2 my-20 text-slate-500 font-medium'>
          You currently have no scholarship announcements.
          <button className='flex gap-2 items-center text-base lg:text-lg bg-blue-600 rounded-md px-6 py-2 text-white fond-medium hover:bg-blue-800 group transition ease-in-out'>
            Why?
          </button>
        </div> */}


          </div>
          <span className='font-bold text-xl lg:text-2xl'>Scholarship Applications</span>

          <div className='mb-2'>
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
          </div>

          <div className="flex flex-row justify-between items-center mt-4">
            <div className='flex gap-4'>
              <button
                className={`flex gap-2 font-medium items-center ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-white hover:bg-slate-200'} shadow lg:px-6 lg:py-2 px-4 py-2 rounded-md text-sm lg:text-md`}
                onClick={() => setFilter('all')}
              >
                <h2 className="hidden  lg:block rounded-t-lg text-center">All Applications</h2>
                <h2 className="lg:hidden block rounded-t-lg text-center">All</h2>
                <div className='font-bold '>({allApplications.length})</div>
              </button>

              <button
                className={`flex gap-2 items-center ${filter === 'approved' ? 'bg-green-600 text-white border-green-600' : 'bg-white hover:bg-slate-200'} shadow lg:px-6 lg:py-2 px-4 py-2 rounded-md text-sm lg:text-md`}
                onClick={() => setFilter('approved')}
              >
                <h2 className="font-bold rounded-t-lg text-center">Approved</h2>
                <div className={`font-bold  ${filter === 'approved' ? 'text-white' : 'text-green-600'}`}>({approvedApplications.length})</div>
              </button>

              <button
                className={`flex gap-2 items-center ${filter === 'pending' ? 'bg-yellow-500 text-white border-yellow-500' : 'bg-white hover:bg-slate-200'} shadow lg:px-6 lg:py-2 px-4 py-2 rounded-md text-sm lg:text-md`}
                onClick={() => setFilter('pending')}
              >
                <h2 className="font-bold rounded-t-lg text-center">Pending</h2>
                <div className={`font-bold  ${filter === 'pending' ? 'text-white' : 'text-yellow-500'}`}>({pendingApplications.length})</div>
              </button>
            </div>

            <div className="hidden lg:flex gap-2 items-center bg-white shadow px-6 py-2 rounded-md border text-md">
              <input
                type="text"
                placeholder="Search Applications"
                className="w-full bg-transparent outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="lg:hidden flex gap-2 items-center bg-white shadow px-6 py-2 rounded-md border text-md">
            <input
              type="text"
              placeholder="Search Applications"
              className="w-full font-bold bg-transparent outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>


          <div className="lg:grid gap-4 lg:max-h-[350px]">
            {/* Overview of approved applications */}
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

              <div className="space-y-4 p-4 text-slate-800 h-96">
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
                  <div className="overflow-y-auto max-h-[800px] h-64">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="">
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
                                  <div className='lg:table-cell hidden bg-blue-600 w-12 h-12 rounded-md'>
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
                                  <div className='bg-blue-600 w-12 h-12 rounded-md'>
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
