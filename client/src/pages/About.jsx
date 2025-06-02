import React, { useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { Link } from 'react-router-dom';
import { FaSearch, FaTools, FaArrowRight, FaHandshake } from "react-icons/fa";
import { MdForum } from "react-icons/md";
import { FaBell, FaClock, FaRocket } from "react-icons/fa6";
import { MdFindInPage, MdDashboard, MdAccountBox, MdOutlineGroups2, MdOutlineLoop } from "react-icons/md";
import { BsFillChatRightTextFill, BsShieldLock, BsCalendar2Check } from "react-icons/bs";
import { HiOutlineLightBulb } from "react-icons/hi";
import logo from '../assets/NewLogo.png';
import HomeNetwork from '../assets/HomeNetwork.png';
import HomeTeam from '../assets/HomeTeam.png';
import useTokenExpiry from '../hooks/useTokenExpiry';


export default function AboutUs() {
  useTokenExpiry();
  
  // Effect to scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "About Us | HubIsko";
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-blue-50">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-2/3 mb-8 md:mb-0 md:pr-8">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">About HubIsko</h1>
                <p className="text-blue-100 text-lg mb-6">
                  Transforming the scholarship landscape through technology and innovation.
                </p>
                <div className="flex space-x-4">
                  <Link to="/scholarship-listing" className="bg-white text-blue-700 px-6 py-2 rounded-full font-medium hover:bg-blue-100 transition duration-300">
                    Explore Scholarships
                  </Link>
                  <Link to="/forums" className="border border-white text-white px-6 py-2 rounded-full font-medium hover:bg-blue-700 transition duration-300">
                    Join Community
                  </Link>
                </div>
              </div>
              <div className="md:w-1/3 flex justify-center">
                <img src={logo} alt="HubIsko Logo" className="w-40 h-40 md:w-48 md:h-48 object-contain bg-white p-4 rounded-full shadow-lg" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Our Mission Section */}
        <div className="container mx-auto px-4 py-16 max-w-6xl">
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-10">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 md:pr-8 mb-8 md:mb-0">
                <h2 className="text-2xl md:text-3xl font-bold text-blue-800 mb-6">Our Mission & Vision</h2>
                <p className="text-slate-700 mb-4 leading-relaxed">
                  At the heart of our HubIsko Scholarship Management System is a commitment to
                  empowering students and organizations in the pursuit of educational
                  excellence. Our mission is to simplify the scholarship process, making
                  education accessible to all.
                </p>
                <p className="text-slate-700 mb-4 leading-relaxed">
                  Our vision is to become the leading platform for scholarship management, 
                  where opportunities meet potential. We strive to create a world where financial 
                  barriers no longer prevent talented individuals from pursuing higher education.
                </p>
                <div className="mt-6 flex space-x-2">
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">Innovation</span>
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">Accessibility</span>
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">Excellence</span>
                </div>
              </div>
              <div className="md:w-1/2 bg-blue-50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-blue-700 mb-4">Our Core Values</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="bg-blue-600 p-2 rounded-full mr-3 text-white">
                      <HiOutlineLightBulb className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800">Innovation</h4>
                      <p className="text-slate-600">We constantly seek new ways to improve the scholarship application experience.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-blue-600 p-2 rounded-full mr-3 text-white">
                      <MdOutlineGroups2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800">Community</h4>
                      <p className="text-slate-600">We foster a supportive environment for students and providers to connect and grow.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-blue-600 p-2 rounded-full mr-3 text-white">
                      <BsShieldLock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800">Integrity</h4>
                      <p className="text-slate-600">We maintain the highest standards of trust and transparency in all our operations.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>        {/* Features Section */}
        <div className="bg-gradient-to-b from-gray-50 to-white py-16">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Our Features</h2>
              <p className="text-slate-600 max-w-3xl mx-auto">
                Discover the powerful tools and services designed to make your scholarship journey smoother and more successful.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">              
              {/* Feature 1: Scholarship Search */}
              <div id="scholarship-search" className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-blue-600 p-4 text-white">
                  <FaSearch className="w-10 h-10 mx-auto" />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-slate-800 mb-3">Scholarship Search</h3>
                  
                  <div className="mb-6 border-l-4 border-blue-600 pl-4 italic text-slate-600">
                    "Find the perfect scholarships that match your qualifications, interests, and career goals with our advanced search tools."
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <h4 className="font-semibold text-blue-700">How It Works:</h4>
                    <p className="text-slate-700">
                      Our intelligent search system analyzes your academic profile, field of study, location, and other factors to match you with the most relevant scholarship opportunities. You can filter results by:
                    </p>
                    <ul className="list-disc pl-5 text-slate-700 space-y-2">
                      <li><span className="font-medium">Scholarship Amount</span> - Find opportunities that meet your financial needs</li>
                      <li><span className="font-medium">Application Deadline</span> - Sort by upcoming deadlines to prioritize your applications</li>
                      <li><span className="font-medium">Eligibility Criteria</span> - Filter by GPA requirements, field of study, and more</li>
                      <li><span className="font-medium">Scholarship Type</span> - Academic, athletic, need-based, merit-based, etc.</li>
                      <li><span className="font-medium">Provider</span> - Search by specific institutions or organizations</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <h4 className="font-semibold text-blue-700">Key Benefits:</h4>
                    <ul className="list-disc pl-5 text-slate-700 space-y-2">
                      <li><span className="font-medium">Personalized Recommendations</span> - Receive suggestions based on your profile and preferences</li>
                      <li><span className="font-medium">Saved Searches</span> - Save your search criteria for future use</li>
                      <li><span className="font-medium">New Opportunity Alerts</span> - Get notifications when new scholarships match your profile</li>
                      <li><span className="font-medium">Detailed Information</span> - View comprehensive details about each scholarship</li>
                    </ul>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-6">
                    <span className="bg-blue-100 text-blue-700 text-sm font-medium px-3 py-1 rounded-full flex items-center">
                      <FaSearch className="w-4 h-4 mr-2" /> Advanced Filtering
                    </span>
                    <span className="bg-blue-100 text-blue-700 text-sm font-medium px-3 py-1 rounded-full flex items-center">
                      <MdFindInPage className="w-4 h-4 mr-2" /> Smart Matching
                    </span>
                  </div>
                </div>
              </div>
                
              {/* Feature 2: Application Management */}
              <div id="application-tracking" className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-blue-600 p-4 text-white">
                  <FaRocket className="w-10 h-10 mx-auto" />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-slate-800 mb-3">Application Management</h3>
                  
                  <div className="mb-6 border-l-4 border-blue-600 pl-4 italic text-slate-600">
                    "Track your applications, monitor deadlines, and streamline your entire scholarship application process in one central location."
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <h4 className="font-semibold text-blue-700">Tracking Features:</h4>
                    <p className="text-slate-700">
                      Our comprehensive application management system helps you stay organized throughout your scholarship journey:
                    </p>
                    <ul className="list-disc pl-5 text-slate-700 space-y-2">
                      <li><span className="font-medium">Application Status Tracker</span> - View the real-time status of all your applications</li>
                      <li><span className="font-medium">Calendar View</span> - Visualize upcoming deadlines and important dates</li>
                      <li><span className="font-medium">Progress Indicators</span> - Track your completion status for each application</li>
                      <li><span className="font-medium">Statistics and Insights</span> - Get analytics on your application activity and success rates</li>
                      <li><span className="font-medium">Deadline Notifications</span> - Receive timely alerts for approaching deadlines</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <h4 className="font-semibold text-blue-700">Why It Matters:</h4>
                    <ul className="list-disc pl-5 text-slate-700 space-y-2">
                      <li><span className="font-medium">Centralized Management</span> - No more juggling multiple applications across different platforms</li>
                      <li><span className="font-medium">Time Efficiency</span> - Save time with templates and reusable information</li>
                      <li><span className="font-medium">Reduced Stress</span> - Clear visibility helps you stay organized and reduces application anxiety</li>
                      <li><span className="font-medium">Improved Success Rate</span> - Never miss a deadline or required document again</li>
                    </ul>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-6">
                    <span className="bg-blue-100 text-blue-700 text-sm font-medium px-3 py-1 rounded-full flex items-center">
                      <FaTools className="w-4 h-4 mr-2" /> Application Tools
                    </span>
                    <span className="bg-blue-100 text-blue-700 text-sm font-medium px-3 py-1 rounded-full flex items-center">
                      <BsCalendar2Check className="w-4 h-4 mr-2" /> Deadline Tracking
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Feature 3: Document Repository */}
              <div id="document-repository" className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-blue-600 p-4 text-white">
                  <FaTools className="w-10 h-10 mx-auto" />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-slate-800 mb-3">Document Repository</h3>
                  
                  <div className="mb-6 border-l-4 border-blue-600 pl-4 italic text-slate-600">
                    "Store, organize, and securely manage all your important documents in one centralized digital repository."
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <h4 className="font-semibold text-blue-700">Repository Features:</h4>
                    <p className="text-slate-700">
                      Our secure document management system keeps all your important files organized and readily available:
                    </p>
                    <ul className="list-disc pl-5 text-slate-700 space-y-2">
                      <li><span className="font-medium">Secure Storage</span> - Safely store transcripts, essays, and recommendation letters</li>
                      <li><span className="font-medium">Document Categories</span> - Organize files by type, purpose, or application</li>
                      <li><span className="font-medium">Version Control</span> - Maintain multiple versions of documents like essays and resumes</li>
                      <li><span className="font-medium">Easy Sharing</span> - Securely share documents with recommenders or scholarship providers</li>
                      <li><span className="font-medium">Document Templates</span> - Access templates for common scholarship requirements</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <h4 className="font-semibold text-blue-700">Key Benefits:</h4>
                    <ul className="list-disc pl-5 text-slate-700 space-y-2">
                      <li><span className="font-medium">Time Saving</span> - Reuse documents across multiple scholarship applications</li>
                      <li><span className="font-medium">Organization</span> - Never lose track of important files or miss submission requirements</li>
                      <li><span className="font-medium">Accessibility</span> - Access your documents from anywhere, at any time</li>
                      <li><span className="font-medium">Document Updates</span> - Receive reminders to update time-sensitive materials</li>
                    </ul>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-6">
                    <span className="bg-blue-100 text-blue-700 text-sm font-medium px-3 py-1 rounded-full flex items-center">
                      <BsShieldLock className="w-4 h-4 mr-2" /> Secure Storage
                    </span>
                    <span className="bg-blue-100 text-blue-700 text-sm font-medium px-3 py-1 rounded-full flex items-center">
                      <MdOutlineLoop className="w-4 h-4 mr-2" /> Reusable Content
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Feature 4: Community Engagement */}
              <div id="community-engagement" className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-blue-600 p-4 text-white">
                  <MdForum className="w-10 h-10 mx-auto" />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-slate-800 mb-3">Community Engagement</h3>
                  
                  <div className="mb-6 border-l-4 border-blue-600 pl-4 italic text-slate-600">
                    "Connect with fellow students, scholarship recipients, and providers to share knowledge and build valuable networks."
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <h4 className="font-semibold text-blue-700">Community Features:</h4>
                    <p className="text-slate-700">
                      Our active community platform creates opportunities for collaboration, mentorship, and knowledge sharing:
                    </p>
                    <ul className="list-disc pl-5 text-slate-700 space-y-2">
                      <li><span className="font-medium">Discussion Forums</span> - Engage in conversations about scholarship strategies and experiences</li>
                      <li><span className="font-medium">Provider Communication</span> - Direct messaging with scholarship providers for questions</li>
                      <li><span className="font-medium">Peer Support</span> - Connect with other applicants and current scholarship recipients</li>
                      <li><span className="font-medium">Resource Sharing</span> - Access shared tips, guides, and success stories</li>
                      <li><span className="font-medium">Mentorship Opportunities</span> - Get guidance from students who have successfully secured scholarships</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <h4 className="font-semibold text-blue-700">Why It Matters:</h4>
                    <ul className="list-disc pl-5 text-slate-700 space-y-2">
                      <li><span className="font-medium">Knowledge Sharing</span> - Learn from others' experiences and successful strategies</li>
                      <li><span className="font-medium">Network Building</span> - Create connections that can benefit your educational journey</li>
                      <li><span className="font-medium">Emotional Support</span> - Find encouragement and motivation throughout the application process</li>
                      <li><span className="font-medium">Insider Information</span> - Gain insights about specific scholarships from previous recipients</li>
                    </ul>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-6">
                    <span className="bg-blue-100 text-blue-700 text-sm font-medium px-3 py-1 rounded-full flex items-center">
                      <MdOutlineGroups2 className="w-4 h-4 mr-2" /> Peer Networking
                    </span>
                    <span className="bg-blue-100 text-blue-700 text-sm font-medium px-3 py-1 rounded-full flex items-center">
                      <FaHandshake className="w-4 h-4 mr-2" /> Mentorship
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>{/* Team Section */}
        <div className="container mx-auto px-4 py-16 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Our Team</h2>
            <p className="text-slate-600 max-w-3xl mx-auto">
              A dedicated group of educators, technologists, and advocates committed to making education accessible to all.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 p-8 md:p-12">
                <h3 className="text-2xl font-bold text-blue-700 mb-4">Our Expertise</h3>
                <p className="text-slate-700 mb-6 leading-relaxed">
                  Our team is composed of passionate educators, technologists, and advocates
                  for higher education. We believe in the transformative power of education
                  and are dedicated to removing financial barriers to academic achievement.
                </p>
                <p className="text-slate-700 mb-6 leading-relaxed">
                  With years of experience in the educational sector, our organization has
                  developed a deep understanding of the challenges faced by students and
                  scholarship providers. We've channeled this knowledge into creating a
                  comprehensive system that addresses these challenges head-on, offering
                  an intuitive, reliable, and efficient platform.
                </p>
                <div className="grid grid-cols-2 gap-4 mt-8">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <FaSearch className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="font-medium">User Research</span>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <FaTools className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="font-medium">Technical Skills</span>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <MdForum className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="font-medium">Communication</span>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <FaRocket className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="font-medium">Innovation</span>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2 bg-gradient-to-r from-blue-600 to-blue-800 p-8 md:p-12 text-white flex flex-col justify-center">
                <h3 className="text-2xl font-bold mb-6">Join Our Community</h3>
                <p className="mb-6 leading-relaxed">
                  Thank you for choosing to explore HubIsko. We are excited to support you on your journey to educational success!
                </p>
                <p className="mb-8 leading-relaxed">
                  Whether you're a student seeking scholarships or a provider looking to make a difference, 
                  we invite you to join our growing community.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/register" className="bg-white text-blue-700 px-6 py-3 rounded-lg font-medium hover:bg-blue-100 transition duration-300 text-center">
                    Create an Account
                  </Link>
                  <Link to="/contact" className="border border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition duration-300 text-center">
                    Contact Our Team
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 mb-5">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-2/3 mb-8 md:mb-0">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to find your perfect scholarship?</h2>
                <p className="text-blue-100 mb-6">
                  Join thousands of students who have already discovered opportunities through HubIsko.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/scholarship-listing" className="bg-white text-blue-700 px-6 py-3 rounded-lg font-medium hover:bg-blue-100 transition duration-300 text-center">
                    Browse Scholarships
                  </Link>
                  <Link to="/register" className="border border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition duration-300 text-center">
                    Sign Up Now
                  </Link>
                </div>
              </div>
              <div className="md:w-1/3 flex justify-center">
                <img src={HomeTeam} alt="Scholarship Team" className="w-64 h-auto rounded-lg shadow-lg" />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}