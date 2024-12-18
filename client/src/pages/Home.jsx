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
import { FaCheck, FaRocket } from "react-icons/fa6";
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
          <div className='text-center lg:px-56 pt-32'>
            <h1 className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-slate-800 px-4 sm:px-8 md:px-12 lg:px-20'>
              Explore <span className='text-blue-600'>Scholarships</span> Through <span className='text-blue-600'>Technology.</span>
            </h1>
            <h4 className='pt-10 text-sm lg:text-2xl font-medium text-slate-700'>
              A Scholarship Management System for Your Locale!
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


                  <Link to="/forums">
                    <button className='group flex items-center border p-4 text-md font-semibold rounded-full hover:bg-slate-200 transition-all ease-in-out bg-white'>
                      Visit our Forums <FaAngleRight className='group-hover:translate-x-2 group-hover:bg-blue-600 text-xl ml-2 bg-slate-400 text-white rounded-full transition ease-in-out' />
                    </button>
                  </Link>

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

          {/* Landing Image */}
          <div className='overflow-hidden -translate-y-32 flex flex-col lg:flex-row items-center justify-center'>
            <img src={LandingImage} alt="Landing Image" className='w-full h-auto' />
            <div className='flex flex-col lg:w-1/2 gap-4'>
            </div>
          </div>

          <div className='text-slate-700 w-full mb-40 rounded-md p-4 '>

            <div className='font-bold text-2xl lg:text-4xl w-full text-center mb-10'>Browse Our Features</div>

            <div className='m-2 flex flex-col justify-between gap-2 items-center text-center'>
              <div className='hidden lg:flex flex-row gap-3 font-semibold mb-6'>
                <button
                  className={`border text-center rounded-xl px-16 py-4 bg-slate-200 hover:bg-slate-300 w-64 ${selectedTab === 'Explore Resources' ? 'bg-white shadow-md hover:bg-white' : ''}`}
                  onClick={() => handleTabClick('Explore Resources')}
                >
                  Scholarship Finder
                </button>
                <button
                  className={`border text-center rounded-xl px-16 py-4 bg-slate-200 hover:bg-slate-300 w-64 ${selectedTab === 'Fast Processing' ? 'bg-white shadow-md hover:bg-white' : ''}`}
                  onClick={() => handleTabClick('Fast Processing')}
                >
                  Instant Notifications
                </button>
                <button
                  className={`border text-center rounded-xl px-16 py-4 bg-slate-200 hover:bg-slate-300 w-64 ${selectedTab === 'Organization Tools' ? 'bg-white shadow-md hover:bg-white' : ''}`}
                  onClick={() => handleTabClick('Organization Tools')}
                >
                  Scholar Tools
                </button>
                <button
                  className={`border text-center rounded-xl px-16 py-4 bg-slate-200 hover:bg-slate-300 w-64 ${selectedTab === 'Enhanced Security' ? 'bg-white shadow-md hover:bg-white' : ''}`}
                  onClick={() => handleTabClick('Enhanced Security')}
                >
                  Enhanced Security and Forums
                </button>
              </div>

              {selectedTab === 'Explore Resources' && (
                <div className='w-full lg:border rounded-md'>
                  {/* Mobile navigation buttons */}
                  <div className='flex w-full lg:hidden flex-row gap-3 font-semibold mb-6 items-center'>
                    <button onClick={() => handleTabClick('Enhanced Security')}>
                      <VscTriangleRight className='w-10 h-10 text-blue-600 rotate-180' />
                    </button>
                    <div className='border text-center rounded-xl px-16 py-4 bg-slate-200 hover:bg-slate-300 focus:bg-white focus:shadow-md'>
                      <span>{buttonText}</span>
                    </div>
                    <button onClick={() => handleTabClick('Fast Processing')}>
                      <VscTriangleRight className='w-10 h-10 text-blue-600' />
                    </button>
                  </div>

                  {/* Content for 'Explore Resources' tab */}
                  <div className='rounded-xl w-full h-[500px] lg:h-[600px] shadow-md flex flex-row'>

                    {/* Text content */}
                    <div className='flex flex-col justify-center text-left w-[800px] px-10 lg:px-20 pt-16 pb-32 gap-3'>
                      <FaSearch className='w-8 h-8 lg:w-16 lg:h-16 text-blue-600 my-4' />

                      <div className='text-2xl lg:text-4xl font-bold'>
                        Find Scholarships!
                      </div>
                      <div className='text-sm lg:text-lg font-medium text-slate-500'>
                        Reliable materials for your learning journey!
                      </div>
                      <span>
                        Discover a variety of scholarships that suit your academic goals.
                        Whether you're looking for undergraduate programs or postgraduate opportunities,
                        explore resources designed to help you secure financial aid with ease.
                      </span>
                      <span>
                        Get access to a well-curated list of scholarships from top institutions,
                        and use our powerful search tools to filter results that fit your needs.
                      </span>

                      {/* Learn more link */}
                      <div className='flex flex-row'>
                        <Link to="/about" className='flex flex-row items-center gap-2 text-blue-600 text-xl font-medium pt-4 hover:text-slate-700 group'>
                          <h2>Learn More</h2>
                          <FaArrowRight className='text-lg mt-1 font-normal group-hover:text-slate-700 group-hover:translate-x-2 transition ease-in-out' />
                        </Link>
                      </div>
                    </div>

                    {/* Image content */}
                    <div className='hidden lg:flex justify-center items-center w-1/2'>
                      <img src={HomeFinder} alt="Home Finder" className='w-[350px] h-auto hover:-translate-y-2 transition ease-in-out' />
                    </div>
                  </div>
                </div>
              )}


              {selectedTab === 'Fast Processing' && (
                <div className='w-full lg:border rounded-md'>
                  {/* Mobile navigation buttons */}
                  <div className='flex lg:hidden flex-row gap-3 font-semibold mb-6 items-center'>
                    <button onClick={() => handleTabClick('Explore Resources')}>
                      <VscTriangleRight className='w-10 h-10 text-blue-600 rotate-180' />
                    </button>
                    <button className='border w-[208px] text-center rounded-xl px-16 py-4 bg-slate-200 hover:bg-slate-300 focus:bg-white focus:shadow-md'>
                      {buttonText}
                    </button>
                    <button onClick={() => handleTabClick('Organization Tools')}>
                      <VscTriangleRight className='w-10 h-10 text-blue-600' />
                    </button>
                  </div>

                  {/* Content for 'New Feature' tab */}
                  <div className='rounded-xl w-full h-[500px] lg:h-[600px] shadow-md flex flex-row'>

                    {/* Text content */}
                    <div className='flex flex-col justify-center text-left w-[800px] px-10 lg:px-20 pt-16 pb-32 gap-3'>
                      <FaRocket className='w-8 h-8 lg:w-16 lg:h-16 text-blue-600 my-4' />
                      <div className='text-2xl lg:text-4xl font-bold'>
                        Instant Notifications
                      </div>
                      <div className='text-sm lg:text-lg font-medium text-slate-500'>
                        Stay Updated Instantly!
                      </div>
                      <span>
                        With our new instant notifications feature, you will never miss an important update.
                        Get real-time alerts on your applications, deadlines, and more.
                      </span>
                      <span>
                        Whether you're applying for multiple scholarships or managing applications,
                        enjoy a streamlined process that keeps you informed every step of the way.
                      </span>

                      {/* Learn more link */}
                      <div className='flex flex-row'>
                        <Link to="/about" className='flex flex-row items-center gap-2 text-blue-600 text-xl font-medium pt-4 hover:text-slate-700 group'>
                          <h2>Learn More</h2>
                          <FaArrowRight className='text-lg mt-1 font-normal group-hover:text-slate-700 group-hover:translate-x-2 transition ease-in-out' />
                        </Link>
                      </div>
                    </div>

                    {/* Image content */}
                    <div className='hidden lg:flex justify-center items-center w-1/2'>
                      <img src={HomeProcess} alt="New Feature" className='w-[300px] h-auto hover:-translate-y-2 transition ease-in-out' />
                    </div>
                  </div>
                </div>
              )}


              {selectedTab === 'Organization Tools' && (
                <div className='w-full lg:border rounded-md'>
                  {/* Mobile navigation buttons */}
                  <div className='flex lg:hidden flex-row gap-3 font-semibold mb-6 items-center'>
                    <button onClick={() => handleTabClick('Fast Processing')}>
                      <VscTriangleRight className='w-10 h-10 text-blue-600 rotate-180' />
                    </button>
                    <button className='border w-[208px] text-center rounded-xl px-16 py-4 bg-slate-200 hover:bg-slate-300 focus:bg-white focus:shadow-md'>
                      {buttonText}
                    </button>
                    <button onClick={() => handleTabClick('Enhanced Security')}>
                      <VscTriangleRight className='w-10 h-10 text-blue-600' />
                    </button>
                  </div>

                  {/* Content for 'Organization Tools' tab */}
                  <div className='rounded-xl w-full h-[500px] lg:h-[600px] lg:mt-0 mt-10 shadow-md flex flex-row'>

                    {/* Text content */}
                    <div className='flex flex-col justify-center text-left w-[800px] px-10  lg:px-20 pt-16 pb-32 gap-3'>
                      <FaTools className='w-16 h-16 text-blue-600 mb-4' />
                      <div className='text-2xl lg:text-4xl font-bold'>
                        Scholar Tools
                      </div>
                      <div className='text-sm lg:text-lg font-medium text-slate-500'>
                        Organize, Track, and Manage with Ease!
                      </div>
                      <span>
                        Our platform provides a comprehensive dashboard for scholars to keep
                        track of applications, deadlines, and required documents,
                        all in one place. Never miss an opportunity with our built-in reminders and real-time updates.
                      </span>
                      <span>
                        Whether you're juggling multiple scholarships or just need a simple way to stay organized,
                        our Scholar Tools are designed to streamline the entire process.
                      </span>

                      {/* Learn more link */}
                      <div className='flex flex-row'>
                        <Link to="/about" className='flex flex-row items-center gap-2 text-blue-600 text-xl font-medium hover:text-slate-700 group'>
                          <h2>Learn More</h2>
                          <FaArrowRight className='text-lg mt-1 font-normal group-hover:text-slate-700 group-hover:translate-x-2 transition ease-in-out' />
                        </Link>
                      </div>
                    </div>

                    {/* Image content */}
                    <div className='hidden lg:flex justify-center items-center w-1/2'>
                      <img src={HomeTools} alt="Home Tools" className='w-[300px] h-auto hover:-translate-y-2 transition ease-in-out' />
                    </div>
                  </div>
                </div>
              )}


              {selectedTab === 'Enhanced Security' && (
                <div className='w-full lg:border rounded-md'>
                  {/* Mobile navigation buttons */}
                  <div className='flex lg:hidden flex-row gap-3 font-semibold mb-6 items-center'>
                    <button onClick={() => handleTabClick('Organization Tools')}>
                      <VscTriangleRight className='w-10 h-10 text-blue-600 rotate-180' />
                    </button>
                    <button className='border w-[208px] text-center rounded-xl px-16 py-4 bg-slate-200 hover:bg-slate-300 focus:bg-white focus:shadow-md'>
                      {buttonText}
                    </button>
                    <button onClick={() => handleTabClick('Explore Resources')}>
                      <VscTriangleRight className='w-10 h-10 text-blue-600' />
                    </button>
                  </div>

                  {/* Content for 'Enhanced Security' tab */}
                  <div className='rounded-xl w-full h-[500px] lg:h-[600px] shadow-md flex flex-row'>

                    {/* Text content */}
                    <div className='flex flex-col justify-center text-left w-[800px] px-10 lg:px-20 pt-16 pb-32 gap-3'>
                      <MdForum className='w-8 h-8 lg:w-16 lg:h-16 text-blue-600' />
                      <div className='text-2xl lg:text-4xl font-bold'>
                        Enhanced Security and Forums
                      </div>
                      <div className='text-sm lg:text-lg font-medium text-slate-500'>
                        Safe and secure discussions with our community.
                      </div>
                      <span>
                        At HubIsko, we prioritize your safety. Engage with peers in secure forums, share experiences, and gain insights while ensuring your privacy. We implement advanced security measures to protect your data.
                      </span>
                      <span>
                        Join discussions, ask questions, and get advice from fellow scholars—all within a safe environment built for collaboration and learning.
                      </span>

                      {/* Learn more link */}
                      <div className='flex flex-row'>
                        <Link to="/about" className='flex flex-row items-center gap-2 text-blue-600 text-xl font-medium pt-4 hover:text-slate-700 group'>
                          <h2>Learn More</h2>
                          <FaArrowRight className='text-lg mt-1 font-normal group-hover:text-slate-700 group-hover:translate-x-2 transition ease-in-out' />
                        </Link>
                      </div>
                    </div>

                    {/* Image content */}
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

            {/* Heading */}
            <div className='pb-2 font-bold text-2xl lg:text-4xl w-full text-center mb-8'>
              What we'll provide?
            </div>

            {/* Abundant Opportunities */}
            <div className='flex flex-row gap-8 text-center items-center justify-center text-md font-medium'>
              <div className='bg-white flex flex-row items-center justify-between w-full border rounded-md shadow-md hover:-translate-y-2 transition-all p-8 lg:p-10'>

                {/* Icon */}
                <div className='flex w-1/2 items-center justify-center rounded-md mr-8'>
                  <FaHandshake className='w-[300px] h-auto object-cover text-blue-600' />
                </div>

                {/* Text */}
                <div className='w-1/2 text-left flex flex-col gap-8'>
                  <div className='text-blue-600 text-md font-semibold'>
                    ABUNDANT OPPORTUNITIES
                  </div>
                  <span className='hidden lg:block font-bold text-3xl'>
                    Maximize your scholarship opportunities with minimal effort
                  </span>

                  <div className='hidden lg:flex flex-col text-base text-slate-600 gap-1'>
                    <span>1. Access a wide variety of scholarships tailored to your field of study.</span>
                    <span>2. Use advanced filters to easily find and apply for scholarships that match your qualifications.</span>
                    <span>3. Enjoy a seamless application process with automated document submissions.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* User-Friendly Automation */}
            <div className='flex flex-row gap-8 text-center items-center justify-between lg:justify-center text-md font-medium'>
              <div className='flex flex-row items-center justify-between w-full rounded-md hover:-translate-y-2 transition-all p-10 lg:p-10'>

                {/* Text */}
                <div className='w-1/2 text-left flex flex-col gap-8'>
                  <div className='text-blue-600 text-md font-semibold'>
                    USER-FRIENDLY AUTOMATION
                  </div>
                  <span className='hidden lg:block font-bold text-4xl'>
                    Stay organized with dashboard overviews and timely alerts
                  </span>

                  <div className='hidden lg:flex flex-col text-base text-slate-600 gap-1'>
                    <span>1. Track your scholarship application status with real-time updates.</span>
                    <span>2. Get timely alerts for upcoming deadlines and new opportunities.</span>
                    <span>3. Manage all your applications and documents in one organized dashboard.</span>
                  </div>
                </div>

                {/* Image */}
                <div className='flex w-1/2 items-center justify-center rounded-md ml-8'>
                  <img src={HomeNotification} alt="Home Notification" className='w-[400px] h-auto object-cover' />
                </div>

              </div>
            </div>

            {/* Responsive System and Users */}
            <div className='flex flex-row gap-8 text-center items-center justify-center text-md font-medium'>
              <div className='bg-white flex flex-row items-center justify-between w-full border rounded-md shadow-md hover:-translate-y-2 transition-all p-10 lg:p-10'>

                {/* Image */}
                <div className='flex w-1/2 items-center justify-center rounded-md mr-8'>
                  <img src={HomeNetwork} alt="Home Network" className='w-[400px] h-auto object-cover mr-8' />
                </div>

                {/* Text */}
                <div className='w-1/2 text-left flex flex-col gap-8'>
                  <div className='text-blue-600 text-md font-semibold'>
                    RESPONSIVE SYSTEM AND USERS
                  </div>
                  <span className='hidden lg:block font-bold text-4xl'>
                    Access a wide network of scholarship providers and applicants
                  </span>

                  <div className='hidden lg:flex flex-col text-base text-slate-600 gap-1'>
                    <span>1. Easily connect with providers and other applicants across various fields of study.</span>
                    <span>2. Join a supportive community where you can collaborate and seek advice.</span>
                    <span>3. Explore a platform built for efficient communication and quick response times.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className='flex flex-row gap-8 text-center items-center justify-between lg:justify-center text-md font-medium'>
              <div className='flex flex-row items-center justify-between w-full rounded-md hover:-translate-y-2 transition-all p-10 lg:p-10'>

                <div className='w-1/2 text-left flex flex-col gap-8'>
                  {/* Title */}
                  <div className='text-blue-600 text-md font-semibold'>
                    STEP BY STEP PROCESS
                  </div>

                  {/* Main Heading */}
                  <span className='hidden lg:block font-bold text-4xl'>
                    The system will present you step-by-step stages when applying.
                  </span>

                  {/* Process Description */}
                  <div className='hidden lg:flex flex-col text-base text-slate-600 gap-1'>
                    <span className=''>1. Sign up with your account details or register as a new user.</span>
                    <span className=''>2. Fill in the scholarship application form with your credentials and required documents.</span>
                    <span className=''>3. Review your application and submit it for approval.</span>
                    <span className=''>4. Track the progress of your application through notifications and updates.</span>
                  </div>

                  {/* Additional Details (Optional) */}
                  <div className='hidden lg:flex flex-col text-base text-slate-500 gap-2 mt-4'>
                    <span className='font-semibold'>Tips for a successful application:</span>
                    <ul className='list-disc ml-4'>
                      <li>Ensure all your documents are up to date and clear.</li>
                      <li>Double-check your eligibility for the scholarship before applying.</li>
                      <li>Keep an eye on your email for important updates and communications.</li>
                    </ul>
                  </div>
                </div>

                {/* Image Section */}
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
                    <div className='pb-2 font-bold text-md lg:text-xl'>Ready to register as a student and be part of our community?</div>
                    <p className='text-sm lg:text-lg text-slate-500 font-medium'>Join us! It's completely free!</p>
                    <div className='flex flex-row justify-between items-center'>
                      <Link to="/register" className="mt-4 bg-blue-600 text-white p-2 rounded-md lg:rounded-full font-medium px-3 lg:px-4 flex flex-row items-center gap-2 cursor-pointer">
                        Register as Student <FaAngleRight />
                      </Link>

                      <div className='lg:block hidden rounded-md'>
                        <MdEmail className='w-24 h-auto text-blue-600' />
                      </div>
                    </div>
                  </div>
                </div>

                <div className='mb-4 text-slate-700 flex flex-col text-center justify-center border border-b lg:w-1/2 bg-white p-10'>
                  <div className='text-left'>
                    <div className='pb-2 font-bold text-md lg:text-xl'>Are you looking to provide scholarships to deserving students?</div>
                    <p className='text-sm lg:text-lg text-slate-500 font-medium'>We're looking to help you!</p>
                    <div className='flex flex-row justify-between items-center'>
                      <Link to="/apply-as-provider" className="mt-4 bg-blue-600 text-white p-2 rounded-md lg:rounded-full font-medium px-3 lg:px-4 flex flex-row items-center gap-2 cursor-pointer">
                        Apply as a Provider <FaAngleRight />
                      </Link>

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