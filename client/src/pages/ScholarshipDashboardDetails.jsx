import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FaAngleRight, FaRegHeart, FaRegEye } from 'react-icons/fa';
import { BiCommentDots } from 'react-icons/bi';
import { BsArrowLeft } from 'react-icons/bs';
import ApplicationForm from './ApplicationForm';
import { formatDistanceToNow } from 'date-fns';
import useTokenExpiry from '../hooks/useTokenExpiry'; // Adjust the import path

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function ScholarshipDashboardDetails() {
    useTokenExpiry();

    const navigate = useNavigate();
    const { currentUser } = useSelector((state) => state.user);
    const userId = currentUser?._id;
    const { id: applicationId } = useParams();
    const [activeTab, setActiveTab] = useState('scholars');
    const [application, setApplication] = useState(null);
    const [validations, setValidations] = useState([]);
    const [carouselIndex, setCarouselIndex] = useState(0);
    const [scholarshipData, setScholarshipData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    // Redirect based on user role and email verification status
    useEffect(() => {
        if (currentUser) {
            if (currentUser.role === 'admin') {
                navigate('/admin-dashboard');
            } else if (currentUser.role === 'scholarship_provider') {
                if (!currentUser.emailVerified) {
                    navigate('/verify-your-email', { state: { email: currentUser.email } });
                } else {
                    navigate('/provider-dashboard');
                }
            }
        }
    }, [currentUser, navigate]);    // Fetch application details
    useEffect(() => {
        const fetchApplicationDetails = async () => {
            try {
                const response = await fetch(`${apiUrl}/api/scholarshipApplication/get-applications-details/${applicationId}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setApplication(data);
            } catch (error) {
                console.error('Error fetching application details:', error);
            }
        };

        fetchApplicationDetails();
    }, [applicationId]);

    // Fetch announcements
    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const response = await fetch(`${apiUrl}/api/announcement/student-scholarship-program`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userId }),
                });
                const data = await response.json();
                const filteredData = data.data.filter(item => item.scholarshipProgram._id === application?.scholarshipProgram?._id);
                setScholarshipData(filteredData);
            } catch (error) {
                console.error('Error fetching announcements:', error);
            }
        };

        if (application?.scholarshipProgram?._id) {
            fetchAnnouncements();
        }
    }, [userId, application?.scholarshipProgram?._id]);

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const handleAnnouncementClick = (announcementId) => {
        navigate(`/announcement/${announcementId}`);
    };

    const handleBackClick = () => {
        navigate(-1);
    };

    const isApproved = application?.applicationStatus === 'Approved'; const filteredAnnouncements = scholarshipData.flatMap((item) => item.announcements).filter((announcement) =>
        announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        announcement.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow bg-[#f8f8fb]">                <div className='flex flex-col gap-6 py-6 md:py-12 max-w-7xl mx-auto px-4 lg:px-8'>

                {/* Modern Back Button */}
                <div className='flex items-center'>
                    <button
                        onClick={handleBackClick}
                        className='group flex items-center gap-3 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 hover:text-blue-600 border border-gray-200 hover:border-blue-300 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md'
                    >
                        <BsArrowLeft className='w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200' />
                        <span className='font-medium text-sm md:text-base'>Back to Dashboard</span>
                    </button>
                </div>

                {/* Modern Hero Section */}
                <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 rounded-2xl p-6 md:p-8 text-white shadow-xl">
                    {application && application.scholarshipProgram ? (
                        <div className='flex flex-col md:flex-row items-center gap-6 md:gap-8'>
                            <div className="relative">
                                <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-2xl shadow-lg overflow-hidden ring-4 ring-white/20">
                                    <img
                                        src={application.scholarshipProgram.scholarshipImage}
                                        alt="Scholarship Program"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                            </div>
                            <div className='text-center md:text-left flex-1'>
                                <h1 className='text-2xl md:text-3xl lg:text-4xl font-bold mb-2 leading-tight'>
                                    {application.scholarshipProgram.title}
                                </h1>
                                <p className='text-blue-100 text-sm md:text-base mb-3'>
                                    {application.scholarshipProgram.organizationName}
                                </p>
                                <div className='flex flex-wrap justify-center md:justify-start gap-2'>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${application.applicationStatus === 'Approved'
                                        ? 'bg-green-500/20 text-green-100'
                                        : application.applicationStatus === 'Pending'
                                            ? 'bg-yellow-500/20 text-yellow-100'
                                            : 'bg-red-500/20 text-red-100'
                                        }`}>
                                        {application.applicationStatus}
                                    </span>
                                    <span className='px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs font-medium'>
                                        Application ID: {applicationId.slice(-8)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-center items-center py-12">
                            <div className="flex items-center gap-3">
                                <svg className="animate-spin h-8 w-8 text-white" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                </svg>
                                <span className="text-lg font-medium">Loading scholarship details...</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Modern Navigation Tabs */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="flex">
                        {[
                            { label: 'Application Details', value: 'scholars', icon: '📄' },
                            { label: 'Announcements', value: 'announcement', icon: '📢' }
                        ].map((tab) => (
                            (isApproved || tab.value === 'scholars') ? (
                                <button
                                    key={tab.value}
                                    className={`flex-1 px-4 md:px-6 py-4 text-center font-medium transition-all duration-300 relative ${activeTab === tab.value
                                        ? 'text-blue-600 bg-blue-50 border-b-2 border-blue-600'
                                        : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                                        }`}
                                    onClick={() => handleTabChange(tab.value)}
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        <span className="text-lg">{tab.icon}</span>
                                        <span className="hidden sm:inline">{tab.label}</span>
                                        <span className="sm:hidden text-sm">{tab.label.split(' ')[0]}</span>
                                    </div>
                                    {activeTab === tab.value && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                                    )}
                                </button>
                            ) : null
                        ))}
                    </div>
                </div>

                <div className='content'>
                    {activeTab === 'scholars' && (
                        <div className='flex flex-col gap-6'>
                            {/* Application Form Container */}
                            <div className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden'>
                                <ApplicationForm />
                            </div>
                        </div>
                    )}{activeTab === 'announcement' && isApproved && (
                        <div className='flex flex-col gap-6'>
                            {/* Header Section */}
                            <div className='bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 md:p-8 text-white'>
                                <div className='flex flex-col md:flex-row md:justify-between md:items-center gap-4'>
                                    <div>
                                        <h2 className='text-2xl md:text-3xl font-bold mb-2'>Scholarship Announcements</h2>
                                        <p className='text-blue-100 text-sm md:text-base'>
                                            Stay updated with the latest news and updates from your scholarship program
                                        </p>
                                    </div>
                                    <div className='bg-white/10 backdrop-blur-sm rounded-xl p-3'>
                                        <div className='text-center'>
                                            <div className='text-2xl font-bold'>{filteredAnnouncements.length}</div>
                                            <div className='text-xs text-blue-100'>Announcements</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Search Section */}
                            <div className='bg-white rounded-xl p-4 shadow-sm border border-gray-100'>
                                <div className='relative'>
                                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                        <svg className='h-5 w-5 text-gray-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                                        </svg>
                                    </div>
                                    <input
                                        type='text'
                                        placeholder='Search announcements by title or content...'
                                        className='w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Announcements Grid */}
                            <div className='relative min-h-[400px]'>
                                {filteredAnnouncements.length > 0 ? (
                                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                                        {filteredAnnouncements
                                            .filter((announcement) => announcement.status !== 'Deleted')
                                            .map((announcement) => {
                                                const scholarshipInfo = scholarshipData.find((item) =>
                                                    item.scholarshipProgram._id === announcement.scholarshipProgram
                                                );

                                                return (
                                                    <div
                                                        key={announcement._id}
                                                        className='group bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all duration-300 cursor-pointer overflow-hidden transform hover:-translate-y-1'
                                                        onClick={() => handleAnnouncementClick(announcement._id)}
                                                    >
                                                        {/* Card Header */}
                                                        <div className='p-6 border-b border-gray-50'>
                                                            <div className='flex items-start gap-4'>
                                                                <div className='w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 ring-2 ring-blue-50'>
                                                                    <img
                                                                        src={scholarshipInfo?.scholarshipProgram.scholarshipImage}
                                                                        alt='Scholarship Program'
                                                                        className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                                                                    />
                                                                </div>
                                                                <div className='flex-1 min-w-0'>
                                                                    <h3 className='font-semibold text-gray-900 mb-1 line-clamp-1'>
                                                                        {scholarshipInfo?.scholarshipProgram.organizationName}
                                                                    </h3>
                                                                    <p className='text-blue-600 text-sm font-medium line-clamp-1'>
                                                                        {scholarshipInfo?.scholarshipProgram.title}
                                                                    </p>
                                                                    <p className='text-xs text-gray-500 mt-1'>
                                                                        {formatDistanceToNow(new Date(announcement.date), { addSuffix: true })}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Card Content */}
                                                        <div className='p-6'>
                                                            <h4 className='text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200'>
                                                                {announcement.title}
                                                            </h4>
                                                            <div className='bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4 mb-4'>
                                                                <p className='text-gray-700 leading-relaxed line-clamp-3'>
                                                                    {announcement.content}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {/* Card Footer */}
                                                        <div className='px-6 pb-6'>
                                                            <div className='flex items-center justify-between pt-4 border-t border-gray-50'>
                                                                <div className='flex items-center gap-4'>
                                                                    <div className='flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors'>
                                                                        <FaRegHeart className='w-4 h-4' />
                                                                        <span className='text-sm font-medium'>{announcement.likesCount || 0}</span>
                                                                    </div>
                                                                    <div className='flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors'>
                                                                        <BiCommentDots className='w-4 h-4' />
                                                                        <span className='text-sm font-medium'>{announcement.comments?.length || 0}</span>
                                                                    </div>
                                                                </div>
                                                                <div className='flex items-center text-blue-600 text-sm font-medium group-hover:text-blue-700'>
                                                                    Read more
                                                                    <FaAngleRight className='w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform duration-200' />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                    </div>
                                ) : (
                                    <div className='flex flex-col items-center justify-center h-64 bg-white rounded-xl border border-gray-100'>
                                        <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4'>
                                            <svg className='w-8 h-8 text-gray-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-6l-2 2h-4l-2-2H4' />
                                            </svg>
                                        </div>
                                        <h3 className='text-lg font-semibold text-gray-900 mb-1'>No Announcements Found</h3>
                                        <p className='text-gray-500 text-center max-w-sm'>
                                            {searchQuery
                                                ? `No announcements match your search for "${searchQuery}".`
                                                : 'There are currently no announcements available for this scholarship program.'
                                            }
                                        </p>
                                        {searchQuery && (
                                            <button
                                                onClick={() => setSearchQuery('')}
                                                className='mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200'
                                            >
                                                Clear Search
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            </main>
            <Footer />
        </div>
    );
}