import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer' // Import the Footer component
import { FaAngleRight } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaSearch } from "react-icons/fa";
import { FaFastForward } from "react-icons/fa";
import { FaTools } from "react-icons/fa";
import { MdForum } from "react-icons/md";
import { FaArrowRight } from "react-icons/fa";
import { FaHandshake } from "react-icons/fa";
import { FaBell, FaCheck, FaClock, FaRocket } from "react-icons/fa6";
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
import { MdFindInPage } from "react-icons/md";
import { MdDashboard } from "react-icons/md";
import { PiSteps } from "react-icons/pi";
import { BsFillChatRightTextFill } from "react-icons/bs";
import { MdAccountBox } from "react-icons/md";
import logo from '../assets/NewLogo.png'; // Adjust the path to your logo file


export default function AboutUs() {
  useTokenExpiry();
  return (
    <div className="flex flex-col min-h-screen"> {/* Wrap content in a flex container */}
      <Header />
      <main className="flex-grow px-4 lg:px-0 max-w-2xl lg:mx-auto"> {/* Main content area */}
        <div className='my-10'>
          <h1 className='text-3xl font-bold text-slate-800 mb-4'>About Us</h1>
          <div className='flex justify-center mb-6'>
            <img src={logo} alt="Logo" className='w-24 h-24' />
          </div>
          <p className='mb-4 text-slate-700 text-justify'>
            At the heart of our HubIsko Scholarship Management System is a commitment to
            empowering students and organizations in the pursuit of educational
            excellence. Our mission is to simplify the scholarship process, making
            education accessible to all. Our vision is to become the leading platform
            for scholarship management, where opportunities meet potential.
          </p>
          <p className='mb-4 text-slate-700 text-justify'>
            Our team is composed of passionate educators, technologists, and advocates
            for higher education. We believe in the transformative power of education
            and are dedicated to removing financial barriers to academic achievement.
          </p>
          <p className='mb-4 text-slate-700 text-justify'>
            With years of experience in the educational sector, our organization has
            developed a deep understanding of the challenges faced by students and
            scholarship providers. We've channeled this knowledge into creating a
            comprehensive system that addresses these challenges head-on, offering
            an intuitive, reliable, and efficient platform.
          </p>
          <p className='mb-4 text-slate-700 text-justify'>
            Thank you for choosing to explore HubIsko. We
            are excited to support you on your journey to educational success!
          </p>
        </div>

        <div className=''>
          <h1 className='text-xl font-bold'>The features we'll provide</h1>
          <div className='flex flex-col gap-10 my-10 items-center'>
            <div className='border flex flex-col justify-center text-left p-10 rounded-md lg:px-20 gap-3'>
              <div className='flex flex-col gap-3'>
                <FaSearch className='w-16 h-16 text-blue-600 my-4' />
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
              </div>
              <div className='flex flex-col'>
                <span className='border-b my-2 font-medium'>Features:</span>
                <div className='flex flex-col lg:flex-row gap-2'>
                  <div className='flex px-6 py-2 border shadow rounded-md gap-2 items-center'>
                    <FaSearch className='w-4 h-4 text-blue-600' />
                    <span className=''>Scholarship Listing</span>
                  </div>
                  <div className='flex px-6 py-2 border shadow rounded-md gap-2 items-center'>
                    <MdFindInPage className='w-4 h-4 text-blue-600' />
                    <span className=''>Forum Inquiry</span>
                  </div>
                </div>
              </div>
            </div>
            <div className='bg-[#f8f8fb] rounded-md flex flex-col justify-center items-end text-right p-10 lg:px-20 gap-3'>
              <div className='flex flex-col items-end gap-3'>
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
              </div>
              <div className='flex flex-col w-full'>
                <span className='border-b my-2 font-medium'>Features:</span>
                <div className='flex gap-2 justify-end'>
                  <div className='flex px-6 py-2 border shadow rounded-md gap-2 items-center'>
                    <MdDashboard className='w-4 h-4 text-blue-600' />
                    Scholar Dashboard
                  </div>
                </div>
              </div>
            </div>

            <div className='flex flex-col gap-10 items-center'>
              {/* Text content */}
              <div className='border flex flex-col justify-center text-left p-10 rounded-md lg:px-20 gap-3'>
                <div className='flex flex-col gap-3'>
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
                </div>
                <div className='flex flex-col'>
                  <span className='border-b my-2 font-medium'>Features:</span>
                  <div className='flex gap-2'>
                    <div className='flex px-6 py-2 border shadow rounded-md gap-2 items-center'>
                      <FaBell className='w-4 h-4 text-blue-600' />
                      <span className='text-sm'>Real-time application updates</span>
                    </div>
                    <div className='flex px-6 py-2 border shadow rounded-md gap-2 items-center'>
                      <FaClock className='w-4 h-4 text-blue-600' />
                      <span className='text-sm'>Instant deadline reminders</span>
                    </div>
                    <div className='flex px-6 py-2 border shadow rounded-md gap-2 items-center'>
                      <FaRocket className='w-4 h-4 text-blue-600' />
                      <span className='text-sm'>Quick response times</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='bg-[#f8f8fb] rounded-md flex flex-col justify-center items-end text-right p-10 lg:px-20 gap-3'>
              <div className='flex flex-col items-end gap-3'>
                <MdForum className='w-8 h-8 lg:w-16 lg:h-16 text-blue-600' />
                <div className='text-2xl lg:text-3xl font-bold'>
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
              </div>
              <div className='flex flex-col w-full'>
                <span className='border-b my-2 font-medium'>Features:</span>
                <div className='flex flex-col lg:flex-row gap-2 justify-end'>
                  <div className='flex px-6 py-2 border shadow rounded-md gap-2 items-center'>
                    <BsFillChatRightTextFill className='w-4 h-4 text-blue-600' />
                    HubIsko Forums
                  </div>
                  <div className='flex px-6 py-2 border shadow rounded-md gap-2 items-center'>
                    <MdAccountBox className='w-4 h-4 text-blue-600' />
                    Account Management
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </main>
      <Footer /> {/* Place the Footer component here */}
    </div>
  );
}