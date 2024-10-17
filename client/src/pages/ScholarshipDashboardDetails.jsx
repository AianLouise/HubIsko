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
    }, [currentUser, navigate]);

    // Fetch application details
    useEffect(() => {
        const fetchApplicationDetails = async () => {
            try {
                const response = await fetch(`/api/scholarshipApplication/get-applications-details/${applicationId}`);
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
                const response = await fetch('/api/announcement/student-scholarship-program', {
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

    const isApproved = application?.applicationStatus === 'Approved';

    const filteredAnnouncements = scholarshipData.flatMap((item) => item.announcements).filter((announcement) =>
        announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        announcement.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Utility function to truncate text
    const truncateText = (text, maxLength) => {
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + '...';
        }
        return text;
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow bg-[#f8f8fb]">
                <div className='flex flex-col gap-4 py-12 max-w-6xl mx-auto justify-between p-4 lg:px-24'>

                    <div className='flex gap-2 font-medium'>
                        <button
                            onClick={handleBackClick}
                            className='text-blue-600 flex gap-2 items-center hover:bg-slate-200 bg-white shadow rounded-md border px-6 py-2'
                        >
                            <BsArrowLeft className='w-6 h-6' /> Back to Scholarship Dashboard
                        </button>
                    </div>

                    <div>
                        {application && application.scholarshipProgram ? (
                            <div className='flex flex-col items-center'>
                                <div className="w-32 h-32 bg-white rounded-full mb-4 shadow-lg">
                                    <img src={application.scholarshipProgram.scholarshipImage} alt="Scholarship Program" className="w-full h-full object-cover rounded-full" />
                                </div>
                                <span className='text-3xl font-bold'>{application.scholarshipProgram.title}</span>
                            </div>
                        ) : (
                            <div className="flex justify-center items-center h-screen">
                                <svg className="animate-spin h-10 w-10 text-blue-600" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                </svg>
                            </div>
                        )}
                    </div>

                    <div className="tabs flex justify-center border-b mb-6">
                        {[{ label: 'Application Details', value: 'scholars' },
                        { label: 'Announcement', value: 'announcement' }
                        ].map((tab) => (
                            isApproved || tab.value === 'scholars' ? (
                                <button
                                    key={tab.value}
                                    className={`tab px-4 py-2 mx-2 transition-colors duration-300 ${activeTab === tab.value
                                        ? 'border-b-2 border-blue-600 text-blue-600'
                                        : 'text-gray-600 hover:text-blue-600'
                                        }`}
                                    onClick={() => handleTabChange(tab.value)}
                                >
                                    {tab.label}
                                </button>
                            ) : null
                        ))}
                    </div>

                    <div className='content'>
                        {activeTab === 'scholars' && (
                            <div className='flex flex-col gap-4'>
                                <div className='flex justify-between items-center gap-4'>
                                    <span className='text-2xl font-bold'>Application Detail</span>
                                </div>

                                <ApplicationForm />
                            </div>
                        )}

                        {activeTab === 'announcement' && isApproved && (
                            <div className='flex flex-col gap-4'>
                                <div className='flex justify-between items-center gap-4'>
                                    <span className='text-2xl font-bold'>Announcements</span>
                                    <div className="hidden lg:flex gap-2 items-center bg-white shadow px-6 py-2 rounded-md border text-md">
                                        <input
                                            type="text"
                                            placeholder="Search Announcements"
                                            className="w-full bg-transparent outline-none"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="lg:hidden flex gap-2 items-center bg-white shadow px-6 py-2 rounded-md border text-md">
                                    <input
                                        type="text"
                                        placeholder="Search Announcements"
                                        className="w-full bg-transparent outline-none"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>

                                <div className='relative'>
                                    {filteredAnnouncements.length > 0 ? (
                                        <div className='flex flex-col gap-4 mx-10 lg:mx-0'>
                                            {filteredAnnouncements.map((announcement) => (
                                                <div
                                                    className='bg-white border p-4 rounded-md flex flex-col gap-4 hover:-translate-y-1 hover:shadow-lg transition ease-in-out cursor-pointer w-full'
                                                    key={announcement._id}
                                                    onClick={() => handleAnnouncementClick(announcement._id)}
                                                >
                                                    <div className='flex gap-2'>
                                                        <div className='bg-white w-12 h-12 rounded-md overflow-hidden'>
                                                            <img src={scholarshipData.find((item) => item.scholarshipProgram._id === announcement.scholarshipProgram).scholarshipProgram.scholarshipImage} alt="Scholarship" className="w-full h-full object-cover" />
                                                        </div>
                                                        <div className='flex flex-col'>
                                                            <span className='font-bold'>{scholarshipData.find((item) => item.scholarshipProgram._id === announcement.scholarshipProgram).scholarshipProgram.organizationName}</span>
                                                            <span className='text-blue-600'>{scholarshipData.find((item) => item.scholarshipProgram._id === announcement.scholarshipProgram).scholarshipProgram.title}</span>
                                                        </div>
                                                    </div>

                                                    <p className='bg-slate-200 p-4 rounded-md whitespace-pre-line'>
                                                        <div className="flex justify-between items-center">
                                                            <h1 className="text-2xl font-bold text-blue-600">{announcement.title}</h1>
                                                        </div>
                                                        <span className='text-blue-600 font-bold'></span> {truncateText(announcement.content, 100)}
                                                    </p>
                                                    <span className='text-sm flex items-end justify-end w-full text-slate-600'>
                                                        Announced: {formatDistanceToNow(new Date(announcement.date), { addSuffix: true })}
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
                                                            {/* <div className='flex flex-row gap-1 pr-2'>
                                                                <FaRegEye className='w-6 h-6 text-blue-600' />
                                                                <span>1.2k</span>
                                                            </div> */}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className='flex items-center justify-center h-52'>
                                            <p className='text-gray-700'>No announcements available.</p>
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