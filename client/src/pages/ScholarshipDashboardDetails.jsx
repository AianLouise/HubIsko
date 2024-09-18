import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FaAngleRight, FaRegHeart, FaRegEye } from 'react-icons/fa';
import { BiCommentDots } from 'react-icons/bi';
import { BsArrowLeft } from 'react-icons/bs';
import ApplicationForm from './ApplicationForm';
import useTokenExpiry from '../hooks/useTokenExpiry'; // Adjust the import path

export default function ScholarshipDashboardDetails() {
    useTokenExpiry();

    const navigate = useNavigate();
    const { currentUser } = useSelector((state) => state.user);
    const userId = currentUser?._id;

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

    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('scholars');

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const [application, setApplication] = useState(null);
    const { id: applicationId } = useParams();

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

    console.log(application?.scholarshipProgram?._id);

    const [validations, setValidations] = useState([]);

    const programId = application?.scholarshipProgram?._id;

    useEffect(() => {
        // Fetch validations by program from the backend
        const fetchValidationsByProgram = async () => {
            try {
                const response = await fetch(`/api/validation/program/${programId}`);
                const data = await response.json();
                if (Array.isArray(data)) {
                    setValidations(data);
                } else {
                    console.error('Fetched data is not an array:', data);
                }
            } catch (error) {
                console.error('Error fetching validations:', error);
            }
        };

        if (programId) {
            fetchValidationsByProgram();
        }
    }, [programId]);

    const upcomingValidations = validations.filter(validation => validation.status === 'Ongoing');
    const previousValidations = validations.filter(validation => validation.status === 'Done');
    const [carouselIndex, setCarouselIndex] = useState(0);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const isPending = application?.applicationStatus === 'Pending';

    // Announcements
    const [scholarshipData, setScholarshipData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

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

    const filteredAnnouncements = scholarshipData.flatMap((item) => item.announcements).filter((announcement) =>
        announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        announcement.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAnnouncementClick = (announcementId) => {
        navigate(`/announcement/${announcementId}`);
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow bg-[#f8f8fb]">
                <div className='flex flex-col gap-4 py-12 max-w-6xl mx-auto justify-between p-4 lg:px-24'>

                    <div className='flex gap-2 font-medium'>
                        <Link to='/scholar-dashboard' className='text-blue-600 flex gap-2 items-center hover:bg-slate-200 bg-white shadow rounded-md border px-6 py-2'>
                            <BsArrowLeft className='w-6 h-6' /> Back to
                            Scholarship Dashboard</Link>
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
                            <span className='text-3xl font-bold'>Loading...</span>
                        )}
                    </div>

                    <div className="tabs flex justify-center border-b mb-6">
                        {[{ label: 'Application Details', value: 'scholars' },
                        { label: 'Announcement', value: 'announcement' },
                        { label: 'Validation', value: 'validation' }
                        ].map((tab) => (
                            !isPending || tab.value === 'scholars' ? (
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

                        {activeTab === 'announcement' && !isPending && (
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
                                                    <p className='bg-slate-200 p-4 rounded-md'>
                                                        <span className='text-blue-600 font-bold'>@Students</span> {announcement.content}
                                                    </p>
                                                    <span className='text-sm flex items-end justify-end w-full text-slate-600'>
                                                        Announced: {new Date(announcement.date).toLocaleString('en-US', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                            hour: 'numeric',
                                                            minute: 'numeric',
                                                            hour12: true
                                                        })}
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

                        {activeTab === 'validation' && !isPending && (
                            <div className="p-6">
                                {/* Upcoming Document Validation */}
                                <div className='mb-8'>
                                    <h3 className='text-2xl font-bold mb-4'>Upcoming Document Validation</h3>
                                    {upcomingValidations.length > 0 ? (
                                        upcomingValidations.map(validation => (
                                            <div key={validation._id} className='bg-white border-l-4 border-blue-500 text-black-700 p-4 rounded-md shadow relative mb-6'>
                                                <div className='flex justify-between items-center mb-4'>
                                                    <h3 className='text-xl font-bold'>{validation.validationTitle}</h3>
                                                    <span className='text-sm text-gray-500'>{validation.createdAt}</span>
                                                </div>
                                                <p>{validation.validationDescription}</p>
                                                <span className='absolute top-0 right-0 bg-blue-500 text-white rounded-full px-3 py-1 text-xs'>Upcoming</span>
                                            </div>
                                        ))
                                    ) : (
                                        <p>No upcoming validations.</p>
                                    )}
                                </div>

                                {/* Previous Document Validation */}
                                <div>
                                    <h3 className='text-2xl font-bold mb-4'>Previous Document Validation</h3>
                                    {previousValidations.length > 0 ? (
                                        previousValidations.map(validation => (
                                            <div key={validation._id} className='bg-white border-l-4 border-gray-500 text-black-700 p-4 rounded-md shadow relative mb-6'>
                                                <div className='flex justify-between items-center mb-4'>
                                                    <h3 className='text-xl font-bold'>{validation.validationTitle}</h3>
                                                    <span className='text-sm text-gray-500'>{validation.createdAt}</span>
                                                </div>
                                                <p>{validation.validationDescription}</p>
                                                <span className='absolute top-0 right-0 bg-gray-500 text-white rounded-full px-3 py-1 text-xs'>Completed</span>
                                            </div>
                                        ))
                                    ) : (
                                        <p>No previous validations.</p>
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