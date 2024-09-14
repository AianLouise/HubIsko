import React, { useEffect } from 'react';
import Header from '../components/Header'
import Footer from '../components/Footer'
import { FaAngleRight } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaSearch } from "react-icons/fa";
import { FaFastForward } from "react-icons/fa";
import { FaTools } from "react-icons/fa";
import { MdForum } from "react-icons/md";
import { FaArrowRight } from "react-icons/fa";
import { FaHandshake } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { VscTriangleRight } from "react-icons/vsc";
import { useState } from 'react';
import { FaBuildingCircleArrowRight } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import HomeFinder from '../assets/HomeFinder.png';
import HomeProcess from '../assets/HomeProcess.png';
import HomeTools from '../assets/HomeTools.png';
import HomeForums from '../assets/HomeForums.png';
import HomeNotification from '../assets/HomeNotification.png';
import HomeTeam from '../assets/HomeTeam.png';
import HomeNetwork from '../assets/HomeNetwork.png';
import useTokenExpiry from '../hooks/useTokenExpiry'; // Adjust the import path


export default function Home() {
  useTokenExpiry();
  
  useEffect(() => {
    document.title = "Home | HubIsko";
  }, []);

  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const userId = currentUser?._id;
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`/api/auth/user/${userId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setUserDetails(data);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    if (userId) {
      fetchUserDetails();
    }
  }, [userId]);

  useEffect(() => {
    if (userDetails) {
      if (userDetails.role === 'admin') {
        navigate('/admin-dashboard');
      } else if (userDetails.role === 'scholarship_provider') {
        if (!userDetails.emailVerified) {
          navigate('/verify-your-email', { state: { email: userDetails.email } });
        } else {
          navigate('/provider-dashboard');
        }
      } else if (userDetails.role === 'applicant') {
        if (!userDetails.emailVerified) {
          navigate('/verify-your-email', { state: { email: userDetails.email } });
        } else {
          navigate('/');
        }
      } else {
        navigate('/');
      }
    }
  }, [userDetails, navigate]);

  const [selectedTab, setSelectedTab] = useState('Explore Resources');

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
    setButtonText(tab);
  };

  const [buttonText, setButtonText] = useState('Explore Resources');


  return (
    <div className="flex flex-col min-h-screen"> {/* Flex container */}
      <Header />
      <main className="flex-grow bg-[#f8f8fb] no-scrollbar"> {/* Main content grows to fill available space */}
        <div className=''>
          <div className='text-center lg:px-56 py-20'>
            <h1 className='text-4xl sm:px-none lg:text-8xl font-bold text-slate-800 lg:px-20'>
              Explore Scholarships through <span className='text-blue-600'>technology.</span>
            </h1>
            <h4 className='pt-10  text-sm lg:text-2xl font-medium text-slate-700'>
              A scholarship management system for your locale!
            </h4>
            <div className='mt-8 flex gap-4 justify-center'>



              {!currentUser ? (
                // For Unregistered Users
                <div className="flex items-center space-x-4">
                  <Link to="/register">
                    <button className='border bg-blue-600 text-white p-4 text-md font-semibold rounded-full hover:bg-blue-700 transition-colors'>
                      Sign Up for Free
                    </button>
                  </Link>


                  <button className='group flex items-center border p-4 text-md font-semibold rounded-full hover:bg-slate-200 transition-all ease-in-out bg-white'>
                    Visit our Forums <FaAngleRight className='group-hover:translate-x-2 group-hover:bg-blue-600 text-xl ml-2 bg-slate-400 text-white rounded-full transition ease-in-out' />
                  </button>

                </div>
              ) : (
                // For Registered Users
                <div className="flex items-center space-x-4">
                  <Link to="/scholarship-listing">
                    <button className='border bg-blue-600 text-white p-4 text-md font-semibold rounded-full hover:bg-blue-700 transition-colors'>
                      View Scholarships
                    </button>
                  </Link>

                  <Link to="/forums">
                    <button className='group flex items-center border p-4 text-md font-semibold rounded-full hover:bg-slate-200 transition-all ease-in-out bg-white'>
                      Visit our Forums <FaAngleRight className='group-hover:translate-x-2 group-hover:bg-blue-600 text-xl ml-2 bg-slate-400 text-white rounded-full transition ease-in-out' />
                    </button>
                  </Link>
                </div>
              )}

            </div>
          </div>
        </div>
        <div className='px-4 max-w-6xl mx-auto'>
          <div className='border shadow-2xl rounded-md mb-40 w-6xl transition-all hover:-translate-y-2 bg-white'>
            <h1 className='text-center lg:text-left bg-blue-600 p-4 text-white font-bold text-xl lg:text-2xl rounded-t-md'>Our Goal</h1>
            <p className='mb-4 text-slate-700 p-6 lg:px-8 font-medium'>
              Our comprehensive scholarship management system is designed to streamline
              the process of finding, applying for, and managing scholarships. Whether
              you're a student seeking financial assistance or an organization looking
              to provide scholarships, our platform offers a suite of tools to simplify
              your journey.
            </p>
          </div>

          <div className='text-slate-700 w-full mb-40 rounded-md p-4 '>

            <div className='font-bold text-2xl lg:text-4xl w-full text-center mb-10'>Browse Our Features</div>

            <div className='m-2 flex flex-col justify-between gap-2 items-center text-center'>
              <div className=' hidden lg:flex flex-row gap-3 font-semibold mb-6'>
                <button className={`border text-center rounded-xl px-16 py-4 bg-slate-200 hover:bg-slate-300 ${selectedTab === 'Explore Resources' ? 'bg-white shadow-md hover:bg-white' : ''}`} onClick={() => handleTabClick('Explore Resources')}>Scholarship Finder</button>
                <button className={`border text-center rounded-xl px-16 py-4 bg-slate-200 hover:bg-slate-300 ${selectedTab === 'Fast Processing' ? 'bg-white shadow-md hover:bg-white' : ''}`} onClick={() => handleTabClick('Fast Processing')} >Automated Processing</button>
                <button className={`border text-center rounded-xl px-16 py-4 bg-slate-200 hover:bg-slate-300 ${selectedTab === 'Organization Tools' ? 'bg-white shadow-md hover:bg-white' : ''}`} onClick={() => handleTabClick('Organization Tools')} >Scholar Dashboard</button>
                <button className={`border text-center rounded-xl px-16 py-4 bg-slate-200 hover:bg-slate-300 ${selectedTab === 'Enhanced Security' ? 'bg-white shadow-md hover:bg-white' : ''}`} onClick={() => handleTabClick('Enhanced Security')}>Forums</button>
              </div>



              {selectedTab === 'Explore Resources' && (

                <div className='w-full lg:border rounded-md'>
                  <div className='flex w-full lg:hidden flex-row gap-3 font-semibold mb-6 items-center'>

                    <button onClick={() => handleTabClick('Enhanced Security')} >
                      <VscTriangleRight className='w-10 h-10 text-blue-600 rotate-180' />
                    </button>

                    <div className='border text-center rounded-xl px-16 py-4 bg-slate-200 hover:bg-slate-300 focus:bg-white focus:shadow-md'>

                      <span>{buttonText}</span></div>

                    <button onClick={() => handleTabClick('Fast Processing')}>
                      <VscTriangleRight className='w-10 h-10 text-blue-600' />
                    </button>
                  </div>


                  <div className='rounded-xl w-full h-[500px] lg:h-[600px] shadow-md flex flex-row'>

                    <div className='flex flex-col justify-center text-left w-[800px] px-10 lg:px-20 pt-16 pb-32 gap-3'>
                      <FaSearch className='text-xl lg:text-6xl text-blue-600 my-4' />
                      <div className='text-2xl lg:text-4xl font-bold'>Find Scholarships!</div>
                      <div className='text-sm lg:text-lg font-medium text-slate-500'>Reliable materials for your learnings!</div>
                      <span>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi molestiae, aspernatur praesentium sint earum ullam perspiciatis vel fugit temporibus necessitatibus!</span>
                      <div className='flex flex-row'>
                        <Link to="" className='flex flex-row gap-2 text-blue-600 text-xl font-medium pt-4 hover:text-slate-700 group'>
                          Learn More <FaArrowRight className='text-lg mt-1 font-normal group-hover:text-slate-700 group-hover:translate-x-2 transition ease-in-out' />
                        </Link>
                      </div>
                    </div>


                    <div className='hidden lg:flex justify-center items-center w-1/2'>
                      {/* <div className='bg-blue-600 rounded-md w-1/2 h-64 hover:-translate-y-2 transition ease-in-out'></div> */}
                      <img src={HomeFinder} alt="Home Finder" className='w-[350px] h-auto hover:-translate-y-2 transition ease-in-out' />
                    </div>
                  </div>
                </div>
              )}

              {selectedTab === 'Fast Processing' && (
                <div className='w-full lg:border rounded-md'>
                  <div className='flex lg:hidden flex-row gap-3 font-semibold mb-6 items-center'>

                    <button onClick={() => handleTabClick('Explore Resources')} >
                      <VscTriangleRight className='w-10 h-10 text-blue-600 rotate-180' />
                    </button>

                    <button className='border w-[208px] text-center rounded-xl px-16 py-4 bg-slate-200 hover:bg-slate-300 focus:bg-white focus:shadow-md'>{buttonText}</button>

                    <button onClick={() => handleTabClick('Organization Tools')}>
                      <VscTriangleRight className='w-10 h-10 text-blue-600' />
                    </button>

                  </div>


                  <div className='rounded-xl w-full h-[500px] lg:h-[600px] shadow-md flex flex-row'>

                    <div className='flex flex-col justify-center text-left w-[800px] px-10 lg:px-20 pt-16 pb-32 gap-3'>
                      <FaFastForward className='text-xl lg:text-6xl text-blue-600 my-4' />
                      <div className='text-2xl lg:text-4xl font-bold'>Automated Processing</div>
                      <div className='text-sm lg:text-lg font-medium text-slate-500'>Apply and Go!</div>
                      <span>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi molestiae, aspernatur praesentium sint earum ullam perspiciatis vel fugit temporibus necessitatibus!</span>
                      <div className='flex flex-row'>
                        <Link to="" className='flex flex-row gap-2 text-blue-600 text-xl font-medium pt-4 hover:text-slate-700 group'>
                          Learn More <FaArrowRight className='text-lg mt-1 font-normal group-hover:text-slate-700 group-hover:translate-x-2 transition ease-in-out' />
                        </Link>
                      </div>
                    </div>


                    <div className='hidden lg:flex justify-center items-center w-1/2'>
                      {/* <div className='bg-blue-600 rounded-md w-1/2 h-64 hover:-translate-y-2 transition ease-in-out'></div> */}
                      <img src={HomeProcess} alt="Home Process" className='w-[300px] h-auto hover:-translate-y-2 transition ease-in-out' />
                    </div>
                  </div>
                </div>
              )}

              {selectedTab === 'Organization Tools' && (
                <div className='w-full lg:border rounded-md'>
                  <div className='flex lg:hidden flex-row gap-3 font-semibold mb-6 items-center'>

                    <button onClick={() => handleTabClick('Fast Processing')} >
                      <VscTriangleRight className='w-10 h-10 text-blue-600 rotate-180' />
                    </button>

                    <button className='border w-[208px] text-center rounded-xl px-16 py-4 bg-slate-200 hover:bg-slate-300 focus:bg-white focus:shadow-md'>{buttonText}</button>

                    <button onClick={() => handleTabClick('Enhanced Security')}>
                      <VscTriangleRight className='w-10 h-10 text-blue-600' />
                    </button>

                  </div>


                  <div className='rounded-xl w-full h-[500px] lg:h-[600px] shadow-md flex flex-row'>

                    <div className='flex flex-col justify-center text-left w-[800px] px-10 lg:px-20 pt-16 pb-32 gap-3'>
                      <FaTools className='text-xl lg:text-6xl text-blue-600 my-4' />
                      <div className='text-2xl lg:text-4xl font-bold'>Scholar Tools</div>
                      <div className='text-sm lg:text-lg font-medium text-slate-500'>Our Scholar dashboard will help students in organization!</div>
                      <span>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi molestiae, aspernatur praesentium sint earum ullam perspiciatis vel fugit temporibus necessitatibus!</span>
                      <div className='flex flex-row'>
                        <Link to="" className='flex flex-row gap-2 text-blue-600 text-xl font-medium pt-4 hover:text-slate-700 group'>
                          Learn More <FaArrowRight className='text-lg mt-1 font-normal group-hover:text-slate-700 group-hover:translate-x-2 transition ease-in-out' />
                        </Link>
                      </div>
                    </div>


                    <div className='hidden lg:flex justify-center items-center w-1/2'>
                      {/* <div className='bg-blue-600 rounded-md w-1/2 h-64 hover:-translate-y-2 transition ease-in-out'></div> */}
                      <img src={HomeTools} alt="Home Tools" className='w-[300px] h-auto hover:-translate-y-2 transition ease-in-out' />
                    </div>
                  </div>
                </div>
              )}

              {selectedTab === 'Enhanced Security' && (
                <div className='w-full lg:border rounded-md'>
                  <div className='flex lg:hidden flex-row gap-3 font-semibold mb-6 items-center'>

                    <button onClick={() => handleTabClick('Organization Tools')} >
                      <VscTriangleRight className='w-10 h-10 text-blue-600 rotate-180' />
                    </button>


                    <button className='border w-[208px] text-center rounded-xl px-16 py-4 bg-slate-200 hover:bg-slate-300 focus:bg-white focus:shadow-md'>{buttonText}</button>

                    <button onClick={() => handleTabClick('Explore Resources')}>
                      <VscTriangleRight className='w-10 h-10 text-blue-600' />
                    </button>
                  </div>


                  <div className='rounded-xl w-full h-[500px] lg:h-[600px] shadow-md flex flex-row'>

                    <div className='flex flex-col justify-center text-left w-[800px] px-10 lg:px-20 pt-16 pb-32 gap-3'>
                      <MdForum className='text-xl lg:text-6xl text-blue-600 my-4' />
                      <div className='text-2xl lg:text-4xl font-bold'>Community Forums</div>
                      <div className='text-sm lg:text-lg font-medium text-slate-500'>Browse through our community's discussions!</div>
                      <span>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi molestiae, aspernatur praesentium sint earum ullam perspiciatis vel fugit temporibus necessitatibus!</span>
                      <div className='flex flex-row'>
                        <Link to="" className='flex flex-row gap-2 text-blue-600 text-xl font-medium pt-4 hover:text-slate-700 group'>
                          Learn More <FaArrowRight className='text-lg mt-1 font-normal group-hover:text-slate-700 group-hover:translate-x-2 transition ease-in-out' />
                        </Link>
                      </div>
                    </div>


                    <div className='hidden lg:flex justify-center items-center w-1/2'>
                      <img src={HomeForums} alt="Home Forums" className='w-[350px] h-auto hover:-translate-y-2 transition ease-in-out' />
                    </div>
                  </div>
                </div>
              )}




            </div>
          </div>


          {/* BENEFITS */}
          <div className='mb-36 border-b text-slate-700 flex flex-col gap-8 text-center'>

            <div className='pb-2 font-bold text-2xl lg:text-4xl w-full text-center mb-8'>What we'll provide?</div>

            <div className='flex flex-row gap-8 text-center items-center justify-center text-md font-semibold'>

              <div className='bg-white flex flex-row items-center justify-between w-full border lg:h-96 rounded-md shadow-md hover:-translate-y-2 transition-all p-8 lg:p-20'>
                <div className='flex w-1/2 items-center justify-center rounded-md mr-8'>
                  <FaHandshake className='w-[300px] h-auto object-cover text-blue-600 ' />
                </div>

                <div className='w-1/2 text-left flex flex-col gap-8'>
                  <div className=' text-blue-600 text-md font-semibold'>ABUNDANT OPPORTUNITIES</div>
                  <span className='hidden lg:block font-bold text-4xl'> Maximize your scholarship opportunities with minimal effort </span>

                  <div className='hidden lg:flex flex-col text-lg text-slate-600 gap-1'>
                    <span className=''>Lorem ipsum dolor sit.</span>
                    <span className=''>Lorem ipsum dolor sit.</span>
                    <span className=''>Lorem ipsum dolor sit.</span>
                  </div>
                </div>
              </div>

            </div>

            <div className='flex flex-row gap-8 text-center items-center justify-between lg:justify-center text-md font-semibold'>

              <div className='flex flex-row items-center justify-between w-full lg:h-96 rounded-md hover:-translate-y-2 transition-all p-10 lg:p-20'>

                <div className='w-1/2 text-left flex flex-col gap-8'>
                  <div className='text-blue-600 text-md font-semibold'>USER-FRIENDLY AUTOMATION</div>
                  <span className='hidden lg:block font-bold text-4xl'> Stay organized with dashboard overviews and timely alerts </span>

                  <div className='hidden lg:flex flex-col text-lg text-slate-600 gap-1'>
                    <span className=''>Lorem ipsum dolor sit.</span>
                    <span className=''>Lorem ipsum dolor sit.</span>
                    <span className=''>Lorem ipsum dolor sit.</span>
                  </div>
                </div>

                <div className='flex w-1/2 items-center justify-center rounded-md ml-8'>
                  <img src={HomeNotification} alt="Home Notification" className='w-[400px] h-auto object-cover' />
                </div>

              </div>

            </div>

            <div className='flex flex-row gap-8 text-center items-center justify-center text-md font-semibold'>

              <div className='bg-white flex flex-row items-center justify-between w-full border lg:h-96 rounded-md shadow-md hover:-translate-y-2 transition-all p-10 lg:p-20'>
                <div className='flex w-1/2 items-center justify-center rounded-md mr-8'>
                  <img src={HomeNetwork} alt="Home Network" className='w-[400px] h-auto object-cover mr-8' />
                </div>

                <div className='w-1/2 text-left flex flex-col gap-8'>
                  <div className='text-blue-600 text-md font-semibold'>RESPONSIVE SYSTEM AND USERS</div>
                  <span className='hidden lg:block font-bold text-4xl'> Access a wide network of scholarship providers and applicants </span>

                  <div className='hidden lg:flex flex-col text-lg text-slate-600 gap-1'>
                    <span className=''>Lorem ipsum dolor sit.</span>
                    <span className=''>Lorem ipsum dolor sit.</span>
                    <span className=''>Lorem ipsum dolor sit.</span>
                  </div>
                </div>
              </div>

            </div>

            <div className='flex flex-row gap-8 text-center items-center justify-center text-md font-semibold'>

              <div className='flex flex-row items-center justify-between w-full lg:h-96 rounded-md hover:-translate-y-2 transition-all p-10 lg:p-20'>

                <div className='w-1/2 text-left flex flex-col gap-8'>
                  <div className='text-blue-600 text-md font-semibold'>STEP BY STEP PROCESS</div>
                  <span className='hidden lg:block font-bold text-4xl'> The system will present you step by step stages when applying. </span>

                  <div className='hidden lg:flex flex-col text-lg text-slate-600 gap-1'>
                    <span className=''>Lorem ipsum dolor sit.</span>
                    <span className=''>Lorem ipsum dolor sit.</span>
                    <span className=''>Lorem ipsum dolor sit.</span>
                  </div>
                </div>

                <div className='flex w-1/2 items-center justify-center rounded-md ml-8'>

                  <img src={HomeTeam} alt="Home Team" className='w-[350px] h-auto object-cover' />
                </div>
              </div>

            </div>

          </div>


          {/* APPLY FOR ROLE */}
          {!currentUser && (
            <div>
              <div className='flex justify-center text-2xl lg:text-4xl font-bold text-slate-700 pb-10'>Apply now!</div>
              <div className='flex flex-col lg:flex-row gap-10 border text-center p-10 rounded-md shadow-inner mb-10'>

                <div className='mb-4 text-slate-700 flex flex-col text-center justify-center border border-b lg:w-1/2 bg-white p-10'>
                  <div className='text-left'>
                    <div className='pb-2 font-bold text-md lg:text-xl'>Ready to take the next step in your educational journey?
                    </div>
                    <p className='text-sm lg:text-lg text-slate-500 font-medium '>Join us! It's completely free!</p>
                    <div className='flex flex-row justify-between items-center'>
                      <div className='hidden lg:block border rounded-full italic pl-4 p-1 mt-4 text-left bg-[#f8f8fb] font-medium text-slate-400'>
                        <div className='flex flex-row gap-10 text-center items-center'>
                          <div className='hidden lg:block text-sm lg:text-md'>Enter your email</div>
                          <div className=' bg-blue-600 text-white p-2 rounded-full px-4 flex flex-row items-center gap-2'>forums <FaAngleRight /></div>
                        </div>
                      </div>

                      <div className='lg:hidden mt-6'>
                        <button className='bg-blue-600 rounded-md text-white px-14 py-2 text-sm font-medium'>Apply Now!</button>
                      </div>

                      <MdEmail className='w-24 h-auto text-blue-600' />
                    </div>
                  </div>
                </div>

                <div className='mb-4 text-slate-700 flex flex-col text-center justify-center border border-b lg:w-1/2 bg-white p-10'>
                  <div className='text-left'>
                    <div className='pb-2 font-bold text-md lg:text-xl'>Are you looking to provide scholarships to deserving students?
                    </div>
                    <p className='text-sm lg:text-lg text-slate-500 font-medium '>We're looking to help you!</p>
                    <div className='flex flex-row justify-between items-center'>
                      <a href="/apply-as-provider" className="mt-4 bg-blue-600 text-white p-2 rounded-md lg:rounded-full font-medium px-3 lg:px-4 flex flex-row items-center gap-2 cursor-pointer">
                        Apply as a Provider <FaAngleRight />
                      </a>

                      <div className='lg:block hidden rounded-md'>
                        <FaBuildingCircleArrowRight className='w-24 h-20 text-blue-600' />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </div>
  );
}