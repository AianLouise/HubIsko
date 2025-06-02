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

  const [selectedTab, setSelectedTab] = useState('Scholarship Search');

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
    setButtonText(tab);
  };

  const [buttonText, setButtonText] = useState('Scholarship Search');

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-[#f8f8fb] no-scrollbar overflow-x-hidden">
        {/* Hero Section */}
        <div className="h-screen">
          <div className='text-center md:max-w-4xl lg:max-w-5xl mx-auto'>
            {/* Landing Image */}
            <div className='flex justify-center items-center mb-0'>
              <img src={LandingImage} alt="Landing Image" className='w-full max-w-3xl h-auto' />
            </div>

            <h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-slate-800 mt-[-5rem] mb-2'>
              Explore <span className='text-blue-600'>Scholarships</span> Through <span className='text-blue-600'>Technology.</span>
            </h1>

            <h4 className='text-sm md:text-base lg:text-xl font-medium text-slate-700 py-7'>
              A Scholarship Management System for Your Locale!
            </h4>

            {/* CTA Buttons */}
            <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
              {!currentUser ? (
                <>
                  <Link to="/register" className="w-full sm:w-auto">
                    <button className='w-full sm:w-auto border bg-blue-600 text-white py-3 px-6 text-md font-semibold rounded-full hover:bg-blue-700 transition-colors'>
                      Sign Up for Free
                    </button>
                  </Link>

                  <Link to="/forums" className="w-full sm:w-auto">
                    <button className='w-full sm:w-auto group flex items-center justify-center border py-3 px-6 text-md font-semibold rounded-full hover:bg-slate-200 transition-all ease-in-out bg-white'>
                      Visit our Forums <FaAngleRight className='group-hover:translate-x-2 group-hover:bg-blue-600 text-xl ml-2 bg-slate-400 text-white rounded-full transition ease-in-out' />
                    </button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/scholarship-listing" className="w-full sm:w-auto">
                    <button className='w-full sm:w-auto border bg-blue-600 text-white py-3 px-6 text-md font-semibold rounded-full hover:bg-blue-700 transition-colors'>
                      View Scholarships
                    </button>
                  </Link>

                  <Link to="/forums" className="w-full sm:w-auto">
                    <button className='w-full sm:w-auto group flex items-center justify-center border py-3 px-6 text-md font-semibold rounded-full hover:bg-slate-200 transition-all ease-in-out bg-white'>
                      Visit our Forums <FaAngleRight className='group-hover:translate-x-2 group-hover:bg-blue-600 text-xl ml-2 bg-slate-400 text-white rounded-full transition ease-in-out' />
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        <div className='px-4 sm:px-6 md:px-8 max-w-6xl mx-auto'>
          {/* Features Section */}
          <div className='text-slate-700 w-full mb-20 md:mb-32 rounded-md p-4'>
            <h2 className='font-bold text-2xl md:text-3xl lg:text-4xl w-full text-center mb-10'>Browse Our Features</h2>

            <div className='flex flex-col justify-between gap-6 items-center text-center'>
              {/* Desktop Tabs */}
              <div className='hidden md:grid grid-cols-2 lg:grid-cols-4 gap-3 font-semibold mb-6 w-full'>
                <button
                  className={`border text-center rounded-xl py-3 px-4 bg-slate-200 hover:bg-slate-300 ${selectedTab === 'Scholarship Search' ? 'bg-white shadow-md hover:bg-white' : ''}`}
                  onClick={() => handleTabClick('Scholarship Search')}
                >
                  Scholarship Search
                </button>
                <button
                  className={`border text-center rounded-xl py-3 px-4 bg-slate-200 hover:bg-slate-300 ${selectedTab === 'Application Tracking' ? 'bg-white shadow-md hover:bg-white' : ''}`}
                  onClick={() => handleTabClick('Application Tracking')}
                >
                  Application Tracking
                </button>
                <button
                  className={`border text-center rounded-xl py-3 px-4 bg-slate-200 hover:bg-slate-300 ${selectedTab === 'Management Tools' ? 'bg-white shadow-md hover:bg-white' : ''}`}
                  onClick={() => handleTabClick('Management Tools')}
                >
                  Management Tools
                </button>
                <button
                  className={`border text-center rounded-xl py-3 px-4 bg-slate-200 hover:bg-slate-300 ${selectedTab === 'Community & Support' ? 'bg-white shadow-md hover:bg-white' : ''}`}
                  onClick={() => handleTabClick('Community & Support')}
                >
                  Community & Support
                </button>
              </div>

              {/* Feature Content */}
              <div className='w-full border rounded-md shadow-md'>
                {/* Mobile Tab Navigation */}
                <div className='flex md:hidden justify-between items-center p-4 bg-white border-b'>
                  <button onClick={() => {
                    const tabs = ['Explore Resources', 'Application Tracking', 'Management Tools', 'Community & Support'];
                    const currentIndex = tabs.indexOf(selectedTab);
                    const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;
                    handleTabClick(tabs[prevIndex]);
                  }} className="flex-none">
                    <VscTriangleRight className='w-8 h-8 text-blue-600 rotate-180' />
                  </button>

                  <div className='flex-1 text-center px-2 font-semibold truncate'>
                    {buttonText}
                  </div>

                  <button onClick={() => {
                    const tabs = ['Scholarship Search', 'Application Tracking', 'Management Tools', 'Community & Support'];
                    const currentIndex = tabs.indexOf(selectedTab);
                    const nextIndex = (currentIndex + 1) % tabs.length;
                    handleTabClick(tabs[nextIndex]);
                  }} className="flex-none">
                    <VscTriangleRight className='w-8 h-8 text-blue-600' />
                  </button>
                </div>

                {/* Feature Content Area */}
                {selectedTab === 'Scholarship Search' && (
                  <div className='w-full p-6 md:p-8'>
                    <div className='flex flex-col md:flex-row items-center md:items-start gap-8'>
                      {/* Text content */}
                      <div className='flex flex-col text-left md:w-1/2 gap-4'>
                        <div className='flex items-center gap-3'>
                          <FaSearch className='w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 text-blue-600' />
                          <h3 className='text-xl md:text-2xl lg:text-3xl font-bold'>
                            Find Scholarships
                          </h3>
                        </div>

                        {/* Mobile Image */}
                        <div className='flex md:hidden justify-center items-center w-full my-3'>
                          <img src={HomeFinder} alt="Scholarship Search" className='w-[150px] h-auto hover:-translate-y-2 transition ease-in-out' />
                        </div>

                        <p className='text-sm md:text-base font-medium text-slate-500'>
                          Discover opportunities that match your profile
                        </p>
                        <p className='text-sm md:text-base'>
                          Our advanced search system helps you find scholarships that match your academic qualifications,
                          field of study, and personal background. Filter by location, amount, deadline, and more.
                        </p>
                        <p className='text-sm md:text-base'>
                          Save time with personalized recommendations based on your profile and preferences,
                          ensuring you never miss opportunities that are the perfect fit for you.
                        </p>

                        {/* Learn more link */}
                        <Link to="/about" className='flex items-center gap-2 text-blue-600 font-medium pt-2 hover:text-slate-700 group'>
                          <span>Learn More</span>
                          <FaArrowRight className='group-hover:translate-x-2 transition ease-in-out' />
                        </Link>
                      </div>

                      {/* Desktop Image content */}
                      <div className='hidden md:flex justify-center items-center md:w-1/2 self-center'>
                        <img src={HomeFinder} alt="Scholarship Search" className='w-full max-w-[200px] h-auto hover:-translate-y-2 transition ease-in-out' />
                      </div>
                    </div>
                  </div>
                )}

                {selectedTab === 'Application Tracking' && (
                  <div className='w-full p-6 md:p-8'>
                    <div className='flex flex-col md:flex-row items-center md:items-start gap-8'>
                      {/* Text content */}
                      <div className='flex flex-col text-left md:w-1/2 gap-4'>
                        <div className='flex items-center gap-3'>
                          <FaRocket className='w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 text-blue-600' />
                          <h3 className='text-xl md:text-2xl lg:text-3xl font-bold'>
                            Track Applications
                          </h3>
                        </div>

                        {/* Mobile Image */}
                        <div className='flex md:hidden justify-center items-center w-full my-3'>
                          <img src={HomeProcess} alt="Application Tracking" className='w-[150px] h-auto hover:-translate-y-2 transition ease-in-out' />
                        </div>

                        <p className='text-sm md:text-base font-medium text-slate-500'>
                          Monitor your applications in real-time
                        </p>
                        <p className='text-sm md:text-base'>
                          Keep track of all your scholarship applications in one place. Our tracking system shows you exactly where each application
                          stands – from submission to final decision.
                        </p>
                        <p className='text-sm md:text-base'>
                          Receive timely notifications about application status changes, upcoming deadlines, and required actions,
                          giving you complete control over your scholarship journey.
                        </p>

                        {/* Learn more link */}
                        <Link to="/about" className='flex items-center gap-2 text-blue-600 font-medium pt-2 hover:text-slate-700 group'>
                          <span>Learn More</span>
                          <FaArrowRight className='group-hover:translate-x-2 transition ease-in-out' />
                        </Link>
                      </div>

                      {/* Desktop Image content */}
                      <div className='hidden md:flex justify-center items-center md:w-1/2 self-center'>
                        <img src={HomeProcess} alt="Application Tracking" className='w-full max-w-[200px] h-auto hover:-translate-y-2 transition ease-in-out' />
                      </div>
                    </div>
                  </div>
                )}

                {selectedTab === 'Management Tools' && (
                  <div className='w-full p-6 md:p-8'>
                    <div className='flex flex-col md:flex-row items-center md:items-start gap-8'>
                      {/* Text content */}
                      <div className='flex flex-col text-left md:w-1/2 gap-4'>
                        <div className='flex items-center gap-3'>
                          <FaTools className='w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 text-blue-600' />
                          <h3 className='text-xl md:text-2xl lg:text-3xl font-bold'>
                            Document Management
                          </h3>
                        </div>

                        {/* Mobile Image */}
                        <div className='flex md:hidden justify-center items-center w-full my-3'>
                          <img src={HomeTools} alt="Document Management" className='w-[150px] h-auto hover:-translate-y-2 transition ease-in-out' />
                        </div>

                        <p className='text-sm md:text-base font-medium text-slate-500'>
                          Keep all your documents organized in one place
                        </p>
                        <p className='text-sm md:text-base'>
                          Store, manage, and reuse your important documents securely in our digital repository.
                          Transcripts, recommendation letters, essays, and more – all available at your fingertips
                          whenever you need them for applications.
                        </p>
                        <p className='text-sm md:text-base'>
                          Our smart system reminds you when documents need updating and helps you prepare exactly
                          what each scholarship requires, saving you time and reducing application stress.
                        </p>

                        {/* Learn more link */}
                        <Link to="/about" className='flex items-center gap-2 text-blue-600 font-medium pt-2 hover:text-slate-700 group'>
                          <span>Learn More</span>
                          <FaArrowRight className='group-hover:translate-x-2 transition ease-in-out' />
                        </Link>
                      </div>

                      {/* Desktop Image content */}
                      <div className='hidden md:flex justify-center items-center md:w-1/2 self-center'>
                        <img src={HomeTools} alt="Document Management" className='w-full max-w-[200px] h-auto hover:-translate-y-2 transition ease-in-out' />
                      </div>
                    </div>
                  </div>
                )}

                {selectedTab === 'Community & Support' && (
                  <div className='w-full p-6 md:p-8'>
                    <div className='flex flex-col md:flex-row items-center md:items-start gap-8'>
                      {/* Text content */}
                      <div className='flex flex-col text-left md:w-1/2 gap-4'>
                        <div className='flex items-center gap-3'>
                          <MdForum className='w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-blue-600' />
                          <h3 className='text-xl md:text-2xl lg:text-3xl font-bold'>
                            Community Forums
                          </h3>
                        </div>

                        {/* Mobile Image */}
                        <div className='flex md:hidden justify-center items-center w-full my-3'>
                          <img src={HomeForums} alt="Community Forums" className='w-[150px] h-auto hover:-translate-y-2 transition ease-in-out' />
                        </div>

                        <p className='text-sm md:text-base font-medium text-slate-500'>
                          Connect with peers and get expert advice
                        </p>
                        <p className='text-sm md:text-base'>
                          Join our active community forums where you can connect with fellow applicants,
                          current scholars, and scholarship providers. Share experiences, ask questions,
                          and get advice on application strategies.
                        </p>
                        <p className='text-sm md:text-base'>
                          Participate in discussions about scholarship opportunities, application tips,
                          and student life. Our moderated forums ensure a supportive, respectful environment
                          for meaningful conversations.
                        </p>

                        {/* Learn more link */}
                        <Link to="/about" className='flex items-center gap-2 text-blue-600 font-medium pt-2 hover:text-slate-700 group'>
                          <span>Learn More</span>
                          <FaArrowRight className='group-hover:translate-x-2 transition ease-in-out' />
                        </Link>
                      </div>

                      {/* Desktop Image content */}
                      <div className='hidden md:flex justify-center items-center md:w-1/2 self-center'>
                        <img src={HomeForums} alt="Community Forums" className='w-full max-w-[200px] h-auto hover:-translate-y-2 transition ease-in-out' />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* What we'll provide? */}
          <div className='mb-16 md:mb-24 text-slate-700'>
            {/* Heading */}
            <h2 className='font-bold text-2xl md:text-3xl lg:text-4xl text-center mb-10'>
              What we'll provide?
            </h2>

            {/* Benefits Cards */}
            <div className='space-y-8'>
              {/* Abundant Opportunities */}
              <div className='bg-white border rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300'>
                <div className='flex flex-col md:flex-row p-6 md:p-8 gap-6 items-center'>
                  {/* Icon */}
                  <div className='flex justify-center items-center md:w-1/3'>
                    <FaHandshake className='w-20 h-20 md:w-32 md:h-32 text-blue-600' />
                  </div>

                  {/* Text */}
                  <div className='md:w-2/3 text-left flex flex-col gap-4'>
                    <div className='text-blue-600 text-sm md:text-base font-semibold'>
                      ABUNDANT OPPORTUNITIES
                    </div>
                    <h3 className='font-bold text-xl md:text-2xl lg:text-3xl'>
                      Maximize your scholarship opportunities with minimal effort
                    </h3>

                    <div className='text-sm md:text-base text-slate-600 space-y-2'>
                      <p>1. Access a wide variety of scholarships tailored to your field of study.</p>
                      <p>2. Use advanced filters to easily find and apply for scholarships that match your qualifications.</p>
                      <p>3. Enjoy a seamless application process with automated document submissions.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* User-Friendly Automation */}
              <div className='bg-white border rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300'>
                <div className='flex flex-col-reverse md:flex-row p-6 md:p-8 gap-6 items-center'>
                  {/* Text */}
                  <div className='md:w-2/3 text-left flex flex-col gap-4'>
                    <div className='text-blue-600 text-sm md:text-base font-semibold'>
                      USER-FRIENDLY AUTOMATION
                    </div>
                    <h3 className='font-bold text-xl md:text-2xl lg:text-3xl'>
                      Stay organized with dashboard overviews and timely alerts
                    </h3>

                    <div className='text-sm md:text-base text-slate-600 space-y-2'>
                      <p>1. Track your scholarship application status with real-time updates.</p>
                      <p>2. Get timely alerts for upcoming deadlines and new opportunities.</p>
                      <p>3. Manage all your applications and documents in one organized dashboard.</p>
                    </div>
                  </div>

                  {/* Image */}
                  <div className='flex justify-center items-center mb-4 md:mb-0 md:w-1/3'>
                    <img src={HomeNotification} alt="Home Notification" className='w-20 h-20 md:w-auto md:max-h-48 object-contain' />
                  </div>
                </div>
              </div>

              {/* Responsive System and Users */}
              <div className='bg-white border rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300'>
                <div className='flex flex-col md:flex-row p-6 md:p-8 gap-6 items-center'>
                  {/* Image */}
                  <div className='flex justify-center items-center md:w-1/3'>
                    <img src={HomeNetwork} alt="Home Network" className='w-20 h-20 md:w-auto md:max-h-48 object-contain' />
                  </div>

                  {/* Text */}
                  <div className='md:w-2/3 text-left flex flex-col gap-4'>
                    <div className='text-blue-600 text-sm md:text-base font-semibold'>
                      RESPONSIVE SYSTEM AND USERS
                    </div>
                    <h3 className='font-bold text-xl md:text-2xl lg:text-3xl'>
                      Access a wide network of scholarship providers and applicants
                    </h3>

                    <div className='text-sm md:text-base text-slate-600 space-y-2'>
                      <p>1. Easily connect with providers and other applicants across various fields of study.</p>
                      <p>2. Join a supportive community where you can collaborate and seek advice.</p>
                      <p>3. Explore a platform built for efficient communication and quick response times.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step by Step Process */}
              <div className='bg-white border rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300'>
                <div className='flex flex-col-reverse md:flex-row p-6 md:p-8 gap-6 items-center'>
                  {/* Text */}
                  <div className='md:w-2/3 text-left flex flex-col gap-4'>
                    <div className='text-blue-600 text-sm md:text-base font-semibold'>
                      STEP BY STEP PROCESS
                    </div>
                    <h3 className='font-bold text-xl md:text-2xl lg:text-3xl'>
                      The system will present you step-by-step stages when applying
                    </h3>

                    <div className='text-sm md:text-base text-slate-600 space-y-2'>
                      <p>1. Sign up with your account details or register as a new user.</p>
                      <p>2. Fill in the scholarship application form with your credentials and required documents.</p>
                      <p>3. Review your application and submit it for approval.</p>
                      <p>4. Track the progress of your application through notifications and updates.</p>
                    </div>

                    <div className='text-sm md:text-base text-slate-500 mt-2'>
                      <p className='font-semibold'>Tips for a successful application:</p>
                      <ul className='list-disc ml-5 mt-2 space-y-1'>
                        <li>Ensure all your documents are up to date and clear.</li>
                        <li>Double-check your eligibility for the scholarship before applying.</li>
                        <li>Keep an eye on your email for important updates and communications.</li>
                      </ul>
                    </div>
                  </div>

                  {/* Image */}
                  <div className='flex justify-center items-center mb-4 md:mb-0 md:w-1/3'>
                    <img src={HomeTeam} alt="Home Team" className='w-20 h-20 md:w-auto md:max-h-48 object-contain' />
                  </div>
                </div>
              </div>
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