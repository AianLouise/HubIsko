import React, { useEffect } from 'react';
import Header from '../components/Header'
import Footer from '../components/Footer'
import { FaAngleRight } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaSearch } from "react-icons/fa";
import { FaTools } from "react-icons/fa";
import { MdForum } from "react-icons/md";
import { FaArrowRight } from "react-icons/fa";
import { FaHandshake } from "react-icons/fa";
import { FaCheck, FaRocket } from "react-icons/fa6";
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
import useTokenExpiry from '../hooks/useTokenExpiry';
import LandingImage from '../assets/Landing.svg';

export default function Home() {
  useTokenExpiry();

  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
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

  const [selectedTab, setSelectedTab] = useState('Scholarship Search');

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
    setButtonText(tab);
  };

  const [buttonText, setButtonText] = useState('Scholarship Search');

  return (
    <div className="flex flex-col min-h-screen">
      {!imageLoaded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-80">
          <svg className="animate-spin h-12 w-12 text-blue-600" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
        </div>
      )}
      <Header />
      <main className="flex-grow bg-[#f8f8fb] no-scrollbar overflow-x-hidden mt-[-20px]">
        {/* Hero Section */}
        <div className="flex items-center justify-center px-5 sm:px-8 mb-20" style={{ visibility: imageLoaded ? 'visible' : 'hidden' }}>
          <div className='text-center w-full lg:h-auto py-4 md:py-6 flex flex-col items-center justify-center'>
            {/* Landing Image */}
            <div className='flex justify-center items-center mb-0 w-full'>
              <img
                src={LandingImage}
                alt="Landing Image"
                className='w-full max-w-xl sm:max-w-2xl md:max-w-3xl h-auto mx-auto'
                onLoad={() => setImageLoaded(true)}
                style={{ display: imageLoaded ? 'block' : 'none' }}
              />
              {!imageLoaded && (
                <div className="w-full max-w-xl sm:max-w-2xl md:max-w-3xl h-64 flex items-center justify-center bg-gray-100 animate-pulse rounded-lg mx-auto">
                  <span className="text-gray-400 text-lg">Loading image...</span>
                </div>
              )}
            </div>

            <h1 className='text-3xl lg:text-7xl font-bold text-slate-800 mt-[-2rem] sm:mt-[-6rem] mb-2 sm:mb-3 px-4 mx-auto'>
              Explore <span className='text-blue-600'>Scholarships</span> <br /> Through <span className='text-blue-600'>Technology.</span>
            </h1>
            <h4 className='text-sm sm:text-base font-medium text-slate-700 mb-4 sm:mb-5 px-4 mx-auto'>
              A Scholarship Management System for Your Locale!
            </h4>
            {/* CTA Buttons */}
            <div className='flex flex-col sm:flex-row gap-3 justify-center items-center px-4 sm:px-0 mx-auto'>
              {!currentUser ? (
                <>
                  <Link to="/register" className="w-full sm:w-auto">
                    <button className='w-full sm:w-auto border bg-blue-600 text-white py-2 px-4 sm:px-5 text-sm font-semibold rounded-full hover:bg-blue-700 transition-colors'>
                      Sign Up for Free
                    </button>
                  </Link>

                  <Link to="/forums" className="w-full sm:w-auto">
                    <button className='w-full sm:w-auto group flex items-center justify-center border py-2.5 px-4 sm:px-6 text-sm font-semibold rounded-full hover:bg-slate-200 transition-all ease-in-out bg-white'>
                      Visit our Forums <FaAngleRight className='group-hover:translate-x-2 group-hover:bg-blue-600 text-lg ml-2 bg-slate-400 text-white rounded-full transition ease-in-out' />
                    </button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/scholarship-listing" className="w-full sm:w-auto">
                    <button className='w-full sm:w-auto border bg-blue-600 text-white py-2 px-4 sm:px-5 text-sm font-semibold rounded-full hover:bg-blue-700 transition-colors'>
                      View Scholarships
                    </button>
                  </Link>

                  <Link to="/forums" className="w-full sm:w-auto">
                    <button className='w-full sm:w-auto group flex items-center justify-center border py-2.5 px-4 sm:px-6 text-sm font-semibold rounded-full hover:bg-slate-200 transition-all ease-in-out bg-white'>
                      Visit our Forums <FaAngleRight className='group-hover:translate-x-2 group-hover:bg-blue-600 text-lg ml-2 bg-slate-400 text-white rounded-full transition ease-in-out' />
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        <div className='px-4 sm:px-6 md:px-8 max-w-6xl mx-auto'>
          {/* Features Section */}
          <div className='mb-24 md:mb-32'>
            <h2 className='font-bold text-2xl md:text-3xl lg:text-4xl w-full text-center mb-6'>
              How HubIsko Helps You Succeed
            </h2>
            <p className='text-slate-600 text-center max-w-3xl mx-auto mb-12'>
              Our comprehensive platform provides everything you need for your scholarship journey, from discovery to application success.
            </p>

            {/* Feature Cards - Unified design combining the best of both previous sections */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>

              {/* Card 1: Scholarship Search */}
              <div className='bg-white border rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full'>
                <div className='p-6 md:p-8 flex flex-col h-full'>
                  {/* Header */}
                  <div className='flex items-start gap-4 mb-4'>
                    <div className='bg-blue-100 p-3 rounded-full'>
                      <FaSearch className='w-6 h-6 md:w-8 md:h-8 text-blue-600' />
                    </div>
                    <div>
                      <div className='text-blue-600 text-sm font-semibold tracking-wider mb-1'>
                        SCHOLARSHIP DISCOVERY
                      </div>
                      <h3 className='font-bold text-xl md:text-2xl text-slate-800'>
                        Find Your Perfect Match
                      </h3>
                    </div>
                  </div>

                  {/* Content */}
                  <div className='flex flex-col md:flex-row gap-6 flex-grow'>
                    <div className='md:w-3/5'>
                      <p className='text-slate-700 mb-4'>
                        Our advanced search system helps you find scholarships that match your academic qualifications,
                        field of study, and personal background.
                      </p>
                      <ul className='space-y-2 text-slate-600 text-sm md:text-base mb-4'>
                        <li className='flex items-start'>
                          <FaCheck className='w-4 h-4 text-blue-600 mt-1 mr-2 flex-shrink-0' />
                          <span>Customizable filters for location, amount, and deadlines</span>
                        </li>
                        <li className='flex items-start'>
                          <FaCheck className='w-4 h-4 text-blue-600 mt-1 mr-2 flex-shrink-0' />
                          <span>Personalized recommendations based on your profile</span>
                        </li>
                        <li className='flex items-start'>
                          <FaCheck className='w-4 h-4 text-blue-600 mt-1 mr-2 flex-shrink-0' />
                          <span>Curated database of verified local scholarship providers</span>
                        </li>
                      </ul>
                    </div>
                    <div className='md:w-2/5 flex justify-center items-center'>
                      <img src={HomeFinder} alt="Scholarship Search" className='w-[120px] md:w-[160px] h-auto' />
                    </div>
                  </div>

                  {/* Footer */}
                  <div className='mt-auto pt-4'>
                    <Link to="/about" className='flex items-center gap-2 text-blue-600 font-medium hover:text-blue-800 group'>
                      <span>Learn More</span>
                      <FaArrowRight className='group-hover:translate-x-2 transition ease-in-out' />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Card 2: Application Tracking */}
              <div className='bg-white border rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full'>
                <div className='p-6 md:p-8 flex flex-col h-full'>
                  {/* Header */}
                  <div className='flex items-start gap-4 mb-4'>
                    <div className='bg-blue-100 p-3 rounded-full'>
                      <FaRocket className='w-6 h-6 md:w-8 md:h-8 text-blue-600' />
                    </div>
                    <div>
                      <div className='text-blue-600 text-sm font-semibold tracking-wider mb-1'>
                        APPLICATION MANAGEMENT
                      </div>
                      <h3 className='font-bold text-xl md:text-2xl text-slate-800'>
                        Track Your Progress
                      </h3>
                    </div>
                  </div>

                  {/* Content */}
                  <div className='flex flex-col md:flex-row gap-6 flex-grow'>
                    <div className='md:w-3/5'>
                      <p className='text-slate-700 mb-4'>
                        Monitor all your scholarship applications in one place with our intuitive tracking system, from submission to final decision.
                      </p>
                      <ul className='space-y-2 text-slate-600 text-sm md:text-base mb-4'>
                        <li className='flex items-start'>
                          <FaCheck className='w-4 h-4 text-blue-600 mt-1 mr-2 flex-shrink-0' />
                          <span>Real-time status updates for all applications</span>
                        </li>
                        <li className='flex items-start'>
                          <FaCheck className='w-4 h-4 text-blue-600 mt-1 mr-2 flex-shrink-0' />
                          <span>Deadline notifications and requirement reminders</span>
                        </li>
                        <li className='flex items-start'>
                          <FaCheck className='w-4 h-4 text-blue-600 mt-1 mr-2 flex-shrink-0' />
                          <span>Organized dashboard with status and priority views</span>
                        </li>
                      </ul>
                    </div>
                    <div className='md:w-2/5 flex justify-center items-center'>
                      <img src={HomeProcess} alt="Application Tracking" className='w-[120px] md:w-[160px] h-auto' />
                    </div>
                  </div>

                  {/* Footer */}
                  <div className='mt-auto pt-4'>
                    <Link to="/about" className='flex items-center gap-2 text-blue-600 font-medium hover:text-blue-800 group'>
                      <span>Learn More</span>
                      <FaArrowRight className='group-hover:translate-x-2 transition ease-in-out' />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Card 3: Document Management */}
              <div className='bg-white border rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full'>
                <div className='p-6 md:p-8 flex flex-col h-full'>
                  {/* Header */}
                  <div className='flex items-start gap-4 mb-4'>
                    <div className='bg-blue-100 p-3 rounded-full'>
                      <FaTools className='w-6 h-6 md:w-8 md:h-8 text-blue-600' />
                    </div>
                    <div>
                      <div className='text-blue-600 text-sm font-semibold tracking-wider mb-1'>
                        DOCUMENT REPOSITORY
                      </div>
                      <h3 className='font-bold text-xl md:text-2xl text-slate-800'>
                        Organize Your Materials
                      </h3>
                    </div>
                  </div>

                  {/* Content */}
                  <div className='flex flex-col md:flex-row gap-6 flex-grow'>
                    <div className='md:w-3/5'>
                      <p className='text-slate-700 mb-4'>
                        Store and manage all your important documents securely in our digital repository, ready to use whenever you need them.
                      </p>
                      <ul className='space-y-2 text-slate-600 text-sm md:text-base mb-4'>
                        <li className='flex items-start'>
                          <FaCheck className='w-4 h-4 text-blue-600 mt-1 mr-2 flex-shrink-0' />
                          <span>Secure storage for transcripts, essays, and recommendation letters</span>
                        </li>
                        <li className='flex items-start'>
                          <FaCheck className='w-4 h-4 text-blue-600 mt-1 mr-2 flex-shrink-0' />
                          <span>Reuse documents across multiple applications</span>
                        </li>
                        <li className='flex items-start'>
                          <FaCheck className='w-4 h-4 text-blue-600 mt-1 mr-2 flex-shrink-0' />
                          <span>Document update reminders for time-sensitive materials</span>
                        </li>
                      </ul>
                    </div>
                    <div className='md:w-2/5 flex justify-center items-center'>
                      <img src={HomeTools} alt="Document Management" className='w-[120px] md:w-[160px] h-auto' />
                    </div>
                  </div>

                  {/* Footer */}
                  <div className='mt-auto pt-4'>
                    <Link to="/about" className='flex items-center gap-2 text-blue-600 font-medium hover:text-blue-800 group'>
                      <span>Learn More</span>
                      <FaArrowRight className='group-hover:translate-x-2 transition ease-in-out' />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Card 4: Community Support */}
              <div className='bg-white border rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full'>
                <div className='p-6 md:p-8 flex flex-col h-full'>
                  {/* Header */}
                  <div className='flex items-start gap-4 mb-4'>
                    <div className='bg-blue-100 p-3 rounded-full'>
                      <MdForum className='w-6 h-6 md:w-8 md:h-8 text-blue-600' />
                    </div>
                    <div>
                      <div className='text-blue-600 text-sm font-semibold tracking-wider mb-1'>
                        COMMUNITY ENGAGEMENT
                      </div>
                      <h3 className='font-bold text-xl md:text-2xl text-slate-800'>
                        Connect and Collaborate
                      </h3>
                    </div>
                  </div>

                  {/* Content */}
                  <div className='flex flex-col md:flex-row gap-6 flex-grow'>
                    <div className='md:w-3/5'>
                      <p className='text-slate-700 mb-4'>
                        Join our active community where you can connect with fellow applicants, scholars, and scholarship providers.
                      </p>
                      <ul className='space-y-2 text-slate-600 text-sm md:text-base mb-4'>
                        <li className='flex items-start'>
                          <FaCheck className='w-4 h-4 text-blue-600 mt-1 mr-2 flex-shrink-0' />
                          <span>Direct communication with scholarship providers</span>
                        </li>
                        <li className='flex items-start'>
                          <FaCheck className='w-4 h-4 text-blue-600 mt-1 mr-2 flex-shrink-0' />
                          <span>Forum discussions on scholarship strategies and tips</span>
                        </li>
                        <li className='flex items-start'>
                          <FaCheck className='w-4 h-4 text-blue-600 mt-1 mr-2 flex-shrink-0' />
                          <span>Mentorship opportunities with current scholars</span>
                        </li>
                      </ul>
                    </div>
                    <div className='md:w-2/5 flex justify-center items-center'>
                      <img src={HomeForums} alt="Community Forums" className='w-[120px] md:w-[160px] h-auto' />
                    </div>
                  </div>

                  {/* Footer */}
                  <div className='mt-auto pt-4'>
                    <Link to="/about" className='flex items-center gap-2 text-blue-600 font-medium hover:text-blue-800 group'>
                      <span>Learn More</span>
                      <FaArrowRight className='group-hover:translate-x-2 transition ease-in-out' />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Application Process Section */}
          <div className='mb-16 md:mb-24'>
            <h2 className='font-bold text-2xl md:text-3xl lg:text-4xl text-center mb-10'>
              Your Journey With HubIsko
            </h2>

            {/* Process Timeline */}
            <div className='bg-white border rounded-lg shadow-md p-6 md:p-10'>
              <div className='grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4'>
                {/* Step 1 */}
                <div className='relative flex flex-col items-center text-center'>
                  <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 z-10'>
                    <span className='text-blue-600 text-2xl font-bold'>1</span>
                  </div>
                  <h3 className='font-bold text-lg mb-2 text-slate-800'>Create Your Profile</h3>
                  <p className='text-slate-600 text-sm'>Sign up and complete your profile with academic qualifications and personal information.</p>

                  {/* Desktop connector */}
                  <div className='hidden md:block absolute top-8 left-[60%] w-full h-1 bg-blue-200'></div>
                </div>

                {/* Step 2 */}
                <div className='relative flex flex-col items-center text-center'>
                  <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 z-10'>
                    <span className='text-blue-600 text-2xl font-bold'>2</span>
                  </div>
                  <h3 className='font-bold text-lg mb-2 text-slate-800'>Discover Scholarships</h3>
                  <p className='text-slate-600 text-sm'>Browse and save scholarships that match your qualifications and interests.</p>

                  {/* Desktop connector */}
                  <div className='hidden md:block absolute top-8 left-[60%] w-full h-1 bg-blue-200'></div>
                </div>

                {/* Step 3 */}
                <div className='relative flex flex-col items-center text-center'>
                  <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 z-10'>
                    <span className='text-blue-600 text-2xl font-bold'>3</span>
                  </div>
                  <h3 className='font-bold text-lg mb-2 text-slate-800'>Apply With Ease</h3>
                  <p className='text-slate-600 text-sm'>Submit applications directly through our platform with all your prepared documents.</p>

                  {/* Desktop connector */}
                  <div className='hidden md:block absolute top-8 left-[60%] w-full h-1 bg-blue-200'></div>
                </div>                {/* Step 4 */}
                <div className='relative flex flex-col items-center text-center'>
                  <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 z-10'>
                    <span className='text-blue-600 text-2xl font-bold'>4</span>
                  </div>
                  <h3 className='font-bold text-lg mb-2 text-slate-800'>Track Your Success</h3>
                  <p className='text-slate-600 text-sm'>Monitor application status and receive updates throughout the selection process.</p>
                </div>
              </div>

              <div className='mt-12 text-center'>
                <p className='text-slate-700 text-sm italic mb-4'>For the best experience:</p>
                <div className='inline-flex flex-col sm:flex-row gap-4 justify-center text-left max-w-xl'>
                  <ul className='space-y-2 text-slate-600 text-sm'>
                    <li className='flex items-start'>
                      <FaCheck className='w-4 h-4 text-blue-600 mt-1 mr-2 flex-shrink-0' />
                      <span>Keep your profile information up-to-date and accurate</span>
                    </li>
                    <li className='flex items-start'>
                      <FaCheck className='w-4 h-4 text-blue-600 mt-1 mr-2 flex-shrink-0' />
                      <span>Upload clear, high-quality documents in the requested format</span>
                    </li>
                    <li className='flex items-start'>
                      <FaCheck className='w-4 h-4 text-blue-600 mt-1 mr-2 flex-shrink-0' />
                      <span>Submit applications well before deadlines to avoid technical issues</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>          {/* Success Stories Section */}
          <div className='mb-16 md:mb-24'>
            <h2 className='font-bold text-2xl md:text-3xl lg:text-4xl text-center mb-6'>
              Success Stories
            </h2>
            <p className='text-slate-600 text-center max-w-3xl mx-auto mb-12'>
              Learn how HubIsko has helped students achieve their academic dreams through scholarship opportunities.
            </p>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              {/* Testimonial 1 */}
              <div className='bg-white border rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col'>
                <div className='mb-4 text-blue-600'>
                  <svg className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>
                <p className='text-slate-700 mb-6 flex-grow italic text-sm md:text-base'>
                  "Thanks to HubIsko, I found and secured a full scholarship that covered my entire tuition. The application tracking feature helped me stay organized and meet all deadlines."
                </p>
                <div className='flex items-center gap-3 mt-auto pt-4 border-t border-slate-200'>
                  <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center'>
                    <span className='text-blue-600 font-bold'>MR</span>
                  </div>
                  <div>
                    <p className='font-semibold text-slate-800'>Maria Rodriguez</p>
                    <p className='text-sm text-slate-500'>Computer Science Student</p>
                  </div>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className='bg-white border rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col'>
                <div className='mb-4 text-blue-600'>
                  <svg className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>
                <p className='text-slate-700 mb-6 flex-grow italic text-sm md:text-base'>
                  "The document management system saved me countless hours. I could upload my recommendation letters once and reuse them for multiple scholarship applications."
                </p>
                <div className='flex items-center gap-3 mt-auto pt-4 border-t border-slate-200'>
                  <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center'>
                    <span className='text-blue-600 font-bold'>JN</span>
                  </div>
                  <div>
                    <p className='font-semibold text-slate-800'>James Nguyen</p>
                    <p className='text-sm text-slate-500'>Medical Student</p>
                  </div>
                </div>
              </div>

              {/* Testimonial 3 */}
              <div className='bg-white border rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col'>
                <div className='mb-4 text-blue-600'>
                  <svg className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>
                <p className='text-slate-700 mb-6 flex-grow italic text-sm md:text-base'>
                  "As a first-generation college student, the community forums provided invaluable advice and support. I connected with mentors who guided me through the scholarship process."
                </p>
                <div className='flex items-center gap-3 mt-auto pt-4 border-t border-slate-200'>
                  <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center'>
                    <span className='text-blue-600 font-bold'>SW</span>
                  </div>
                  <div>
                    <p className='font-semibold text-slate-800'>Sarah Williams</p>
                    <p className='text-sm text-slate-500'>Education Major</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className='mb-16 md:mb-24 bg-white border rounded-lg shadow-md p-6 md:p-10'>
            <h2 className='font-bold text-2xl md:text-3xl lg:text-4xl text-center mb-6'>
              Frequently Asked Questions
            </h2>
            <p className='text-slate-600 text-center max-w-3xl mx-auto mb-12'>
              Get quick answers to common questions about HubIsko and the scholarship application process.
            </p>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8'>
              {/* FAQ Item 1 */}
              <div className='border-b border-slate-200 pb-5'>
                <h3 className='font-bold text-lg mb-2 text-slate-800 flex items-center'>
                  <span className='text-blue-600 mr-2'>Q:</span>
                  Is it free to use HubIsko?
                </h3>
                <p className='text-slate-600 pl-6'>
                  Yes, HubIsko is completely free for students. You can create an account, search for scholarships, and manage your applications at no cost.
                </p>
              </div>

              {/* FAQ Item 2 */}
              <div className='border-b border-slate-200 pb-5'>
                <h3 className='font-bold text-lg mb-2 text-slate-800 flex items-center'>
                  <span className='text-blue-600 mr-2'>Q:</span>
                  How are scholarship providers verified?
                </h3>
                <p className='text-slate-600 pl-6'>
                  All scholarship providers undergo a thorough verification process to ensure legitimacy. We verify organizational details, contact information, and scholarship funding sources.
                </p>
              </div>

              {/* FAQ Item 3 */}
              <div className='border-b border-slate-200 pb-5'>
                <h3 className='font-bold text-lg mb-2 text-slate-800 flex items-center'>
                  <span className='text-blue-600 mr-2'>Q:</span>
                  Can I apply for multiple scholarships?
                </h3>
                <p className='text-slate-600 pl-6'>
                  Absolutely! There's no limit to how many scholarships you can apply for on HubIsko. We encourage you to apply for all opportunities that match your qualifications.
                </p>
              </div>

              {/* FAQ Item 4 */}
              <div className='border-b border-slate-200 pb-5'>
                <h3 className='font-bold text-lg mb-2 text-slate-800 flex items-center'>
                  <span className='text-blue-600 mr-2'>Q:</span>
                  How secure is my personal information?
                </h3>
                <p className='text-slate-600 pl-6'>
                  Your data security is our priority. We use industry-standard encryption to protect your personal information and documents. We never share your data with third parties without your consent.
                </p>
              </div>

              {/* FAQ Item 5 */}
              <div className='border-b border-slate-200 pb-5'>
                <h3 className='font-bold text-lg mb-2 text-slate-800 flex items-center'>
                  <span className='text-blue-600 mr-2'>Q:</span>
                  Can I get notifications about new scholarships?
                </h3>
                <p className='text-slate-600 pl-6'>
                  Yes, you can set up personalized alerts for new scholarship opportunities that match your profile and preferences. Notifications can be received via email or in-app messages.
                </p>
              </div>

              {/* FAQ Item 6 */}
              <div className='border-b border-slate-200 pb-5'>
                <h3 className='font-bold text-lg mb-2 text-slate-800 flex items-center'>
                  <span className='text-blue-600 mr-2'>Q:</span>
                  What if I need help with my application?
                </h3>
                <p className='text-slate-600 pl-6'>
                  Our community forums provide access to peers and mentors who can offer advice. Additionally, our support team is available to assist with technical issues or questions about the platform.
                </p>
              </div>
            </div>

            <div className='text-center mt-10'>
              <Link to="/about" className='inline-flex items-center gap-2 bg-blue-600 text-white py-3 px-6 rounded-full font-medium hover:bg-blue-700 transition-colors'>
                <span>View More FAQs</span>
                <FaArrowRight />
              </Link>
            </div>
          </div>

          {/* APPLY FOR ROLE */}
          {!currentUser && (
            <div className="mb-16">
              <h2 className='text-2xl md:text-3xl lg:text-4xl font-bold text-slate-700 text-center mb-8'>Apply now!</h2>

              <div className='grid md:grid-cols-2 gap-6 rounded-lg overflow-hidden'>
                {/* Student Registration Card */}
                <div className='bg-white border rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6'>
                  <div className='flex flex-col h-full'>
                    <div className='mb-auto text-center md:text-left'>
                      <h3 className='text-xl font-bold text-slate-800 mb-2'>Ready to register as a student?</h3>
                      <p className='text-slate-500 mb-6'>Join us! It's completely free!</p>
                    </div>

                    <div className='flex flex-col md:flex-row items-center md:justify-between gap-4'>
                      <Link to="/register" className="w-full md:w-auto">
                        <button className='w-full md:w-auto bg-blue-600 text-white py-2 px-4 rounded-lg md:rounded-full font-medium flex items-center justify-center md:justify-start gap-2 hover:bg-blue-700 transition-colors'>
                          Register as Student <FaAngleRight />
                        </button>
                      </Link>

                      <div className='hidden md:block'>
                        <MdEmail className='w-16 h-16 text-blue-600' />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Provider Application Card */}
                <div className='bg-white border rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6'>
                  <div className='flex flex-col h-full'>
                    <div className='mb-auto text-center md:text-left'>
                      <h3 className='text-xl font-bold text-slate-800 mb-2'>Looking to provide scholarships?</h3>
                      <p className='text-slate-500 mb-6'>We're looking to help you!</p>
                    </div>

                    <div className='flex flex-col md:flex-row items-center md:justify-between gap-4'>
                      <Link to="/apply-as-provider" className="w-full md:w-auto">
                        <button className='w-full md:w-auto bg-blue-600 text-white py-2 px-4 rounded-lg md:rounded-full font-medium flex items-center justify-center md:justify-start gap-2 hover:bg-blue-700 transition-colors'>
                          Apply as a Provider <FaAngleRight />
                        </button>
                      </Link>

                      <div className='hidden md:block'>
                        <FaBuildingCircleArrowRight className='w-16 h-16 text-blue-600' />
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