import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import ProviderHeaderSidebar from '../../components/ProviderHeaderAndSidebar';
import { useSelector } from 'react-redux';
import ProgramDetails from '../../components/ViewScholarshipDetails/ProgamDetails';
import PostAnnouncement from '../../components/ViewScholarshipDetails/PostAnnouncement';
import ViewScholars from '../../components/ViewScholarshipDetails/ViewScholars';
import ScholarshipApplication from '../../components/ViewScholarshipDetails/ScholarApplication';
import Validation from '../../components/ViewScholarshipDetails/Validation';
import EditProgram from '../../components/ViewScholarshipDetails/EditProgram';
import Modal from 'react-modal';
import { FaInfoCircle, FaEdit, FaBullhorn, FaUsers, FaFileAlt } from 'react-icons/fa';

export default function ViewScholarshipDetails() {
    const { currentUser } = useSelector((state) => state.user);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [activeTab, setActiveTab] = useState(new URLSearchParams(location.search).get('tab') || 'details');
    const [scholarshipProgram, setProgramDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [applications, setApplications] = useState([]);
    const [scholars, setScholars] = useState([]);
    const [showPublishModal, setShowPublishModal] = useState(false);
    const [applicationDeadline, setApplicationDeadline] = useState('');
    const [showShareMessage, setShowShareMessage] = useState(false);

    const [isExtendModalOpen, setIsExtendModalOpen] = useState(false);
    const [newApplicationDeadline, setNewApplicationDeadline] = useState('');
    const [currentApplicationDeadline, setCurrentApplicationDeadline] = useState('');
    const [isDeadlineExpired, setIsDeadlineExpired] = useState(false);

    const fetchProgramDetails = async () => {
        try {
            const response = await fetch(`/api/scholarshipProgram/scholarship-programs/${id}`);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setProgramDetails(data);
            if (data.status === 'Published') {
                setShowShareMessage(true);
            }
            setApplicationDeadline(data.applicationDeadline);
            setCurrentApplicationDeadline(data.applicationDeadline);
            console.log('Program details:', data);
        } catch (error) {
            console.error('Error fetching program details:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProgramDetails();

        const fetchApplications = async () => {
            try {
                const response = await fetch(`/api/scholarshipProgram/scholarship-applications/${id}`);
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                setApplications(data);
                console.log('Applications:', data);
            } catch (error) {
                console.error('Error fetching program applications:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, [id]);

    useEffect(() => {
        if (activeTab === 'scholars') {
            const fetchScholars = async () => {
                try {
                    const response = await fetch(`/api/scholarshipProgram/${id}/approved-scholar-info`);
                    if (!response.ok) throw new Error('Network response was not ok');
                    const data = await response.json();
                    setScholars(data);
                } catch (error) {
                    console.error('Error fetching scholars:', error);
                } finally {
                    setLoading(false);
                }
            };

            fetchScholars();
        }
    }, [activeTab, id]);

    useEffect(() => {
        const handleLocationChange = () => {
            setSidebarOpen(false);
        };

        handleLocationChange();

        return () => {
            // Cleanup if necessary
        };
    }, [location]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        navigate(`?tab=${tab}`);
    };

    const handlePublish = async () => {
        try {
            const response = await fetch(`/api/scholarshipProgram/scholarship-programs/${id}/publish`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ applicationDeadline }), // Include the application deadline in the request body
            });
            if (!response.ok) throw new Error('Failed to publish the program');
            await response.json();
            setShowPublishModal(false);
            console.log('Publishing with deadline:', applicationDeadline);
            fetchProgramDetails(); // Refresh the fetch after publishing
        } catch (error) {
            console.error('Error publishing the program:', error);
            setError(error.message);
        }
    };

    const numberOfScholarships = scholarshipProgram?.numberOfScholarships || 0;
    const numberOfScholarshipsSlotFilled = scholarshipProgram?.numberOfScholarshipsSlotFilled || 0;

    const [showOngoingMessage, setShowOngoingMessage] = useState(false);

    useEffect(() => {
        if (scholarshipProgram && scholarshipProgram.approvedScholars === scholarshipProgram.numberOfScholarships) {
            // Display a message indicating that the slots are full
            setShowShareMessage(false);
            setShowOngoingMessage(true);
        }
    }, [scholarshipProgram]);

    const updateScholarshipStatus = async (id, status) => {
        try {
            const response = await fetch(`/api/scholarshipProgram/update-status/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status }),
            });

            if (!response.ok) {
                throw new Error('Failed to update scholarship status');
            }

            const updatedProgram = await response.json();
            // Update the local state or handle the updated program as needed
            console.log('Scholarship status updated:', updatedProgram);
        } catch (error) {
            console.error('Error updating scholarship status:', error);
        }
    };

    const getTodayDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    const openConfirmModal = () => {
        setIsConfirmModalOpen(true);
    };

    const closeConfirmModal = () => {
        setIsConfirmModalOpen(false);
    };

    const handleStartProgram = () => {
        updateScholarshipStatus(scholarshipProgram.id, 'Ongoing');
        closeConfirmModal();
        fetchProgramDetails(); // Refresh the fetch after updating the status
        window.location.reload(); // Refresh the page
    };

    // 
    useEffect(() => {
        // Check if the application deadline has expired
        if (currentApplicationDeadline) {
            const deadlineDate = new Date(currentApplicationDeadline);
            const today = new Date();
            setIsDeadlineExpired(deadlineDate < today);
        }
    }, [currentApplicationDeadline]);

    const extendApplicationDeadline = () => {
        setIsExtendModalOpen(true);
    };

    const confirmExtendDeadline = async () => {
        try {
            const response = await fetch(`/api/scholarshipProgram/scholarship-programs/${id}/extend-deadline`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ newDeadline: newApplicationDeadline }), // Include the new application deadline in the request body
            });
            if (!response.ok) throw new Error('Failed to extend the application deadline');
            await response.json();
            setIsExtendModalOpen(false);
            console.log('Extending deadline to:', newApplicationDeadline);
            fetchProgramDetails(); // Refresh the fetch after extending the deadline
        } catch (error) {
            console.error('Error extending the application deadline:', error);
            setError(error.message);
        }
    };

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
        <div className={`flex flex-col min-h-screen`}>
            <main className={`flex-grow bg-[#f8f8fb] transition-all duration-200 ease-in-out ${sidebarOpen ? 'ml-64' : ''}`}>
                <ProviderHeaderSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} currentPath={`${currentUser.scholarshipProviderDetails.organizationName} / `} />
                <div className="container mx-auto p-6">
                    <div className="container mx-auto p-6">
                        <div className="flex flex-col items-center mb-6">
                            <img
                                src={scholarshipProgram?.scholarshipImage || 'default-image-path.jpg'}
                                alt="Scholarship Program"
                                className="w-32 h-32 object-cover rounded-full mb-4 shadow-lg"
                            />
                            <h1 className="text-4xl font-bold text-center text-blue-600">{scholarshipProgram?.title}</h1>
                        </div>

                        {/* Congratulatory Message */}
                        {scholarshipProgram?.status === 'Awaiting Publication' && (
                            <div className="bg-yellow-100 text-yellow-700 p-4 mb-6 rounded-md shadow-md">
                                <h2 className="text-xl font-bold mb-2">Awaiting Publication</h2>
                                <p>Your scholarship program is awaiting publication. You can now publish it to make it visible to students.</p>
                                <button
                                    className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded-md shadow hover:bg-yellow-600"
                                    onClick={() => setShowPublishModal(true)}
                                >
                                    Publish Program
                                </button>
                            </div>
                        )}

                        {/* Publish Confirmation Modal */}
                        {showPublishModal && (
                            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                                <div className="bg-white p-6 rounded-md shadow-md">
                                    <h3 className="text-xl font-bold mb-4">Confirm Publish</h3>
                                    <p>Are you sure you want to publish this scholarship program?</p>
                                    <div className="mt-4">
                                        <label className="block text-gray-700 font-semibold mb-2">Application Deadline</label>
                                        <input
                                            type="date"
                                            value={applicationDeadline}
                                            onChange={(e) => setApplicationDeadline(e.target.value)}
                                            className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                                            min={getTodayDate()} // Set the min attribute to today's date
                                            required
                                        />
                                    </div>
                                    <div className="mt-6 flex justify-end space-x-4">
                                        <button
                                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
                                            onClick={() => setShowPublishModal(false)}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
                                            onClick={handlePublish}
                                        >
                                            Confirm
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Message to share on forums after publishing */}
                        {showShareMessage && (
                            <div className="bg-indigo-100 text-indigo-700 p-4 mt-6 rounded-md shadow-md">
                                <h3 className="text-xl font-bold mb-2">Share Your Scholarship Program!</h3>
                                <p>Congratulations, your scholarship program has been published successfully!</p>
                                <p className="mt-2">Let others know about it by sharing it on the <Link to="/provider-forums" className="text-indigo-600 underline">forums</Link>.</p>
                                <p>You can also discuss your program and connect with potential applicants!</p>
                                <div className="mt-4 text-indigo-700">
                                    <p className="text-sm">The program can be started when all slots are filled. If you want to start it early, you can do so by clicking the "Start Program" button below.</p>
                                </div>
                                <div className='flex gap-4 mt-4'>
                                    <button
                                        className="bg-indigo-500 text-white px-4 py-2 rounded-md shadow hover:bg-indigo-600"
                                        onClick={() => navigate('/provider-forums')}
                                    >
                                        Go to Forums
                                    </button>
                                    <button
                                        className="bg-teal-500 text-white px-4 py-2 rounded-md shadow hover:bg-teal-600"
                                        onClick={openConfirmModal}
                                    >
                                        Start Program
                                    </button>
                                    <button
                                        className="bg-yellow-500 text-white px-4 py-2 rounded-md shadow hover:bg-yellow-600"
                                        onClick={extendApplicationDeadline}
                                    >
                                        Extend Application Deadline
                                    </button>
                                </div>
                                {isDeadlineExpired && (
                                    <div className="mt-4 bg-red-100 text-red-700 p-4 rounded-md shadow-md">
                                        <p>The application deadline has expired. Please extend the deadline to allow new applications.</p>
                                    </div>
                                )}
                            </div>
                        )}
                        {isExtendModalOpen && (
                            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                                <div className="bg-white p-6 rounded-md shadow-md">
                                    <h3 className="text-xl font-bold mb-4">Extend Application Deadline</h3>
                                    <p>Current Application Deadline: {new Date(currentApplicationDeadline).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                    <p>Are you sure you want to extend the application deadline?</p>
                                    <div className="mt-4">
                                        <label className="block text-gray-700 font-semibold mb-2">New Application Deadline</label>
                                        <input
                                            type="date"
                                            value={newApplicationDeadline}
                                            onChange={(e) => setNewApplicationDeadline(e.target.value)}
                                            className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                                            min={getTodayDate()} // Set the min attribute to today's date
                                            required
                                        />
                                    </div>
                                    <div className="mt-6 flex justify-end space-x-4">
                                        <button
                                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
                                            onClick={() => setIsExtendModalOpen(false)}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
                                            onClick={confirmExtendDeadline}
                                        >
                                            Confirm
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Ongoing Message */}
                        {showOngoingMessage && scholarshipProgram?.status === 'Published' && (
                            <div className="bg-teal-100 text-teal-700 p-4 mb-6 rounded-md shadow-md">
                                <h2 className="text-2xl font-bold mb-2">Slots are Filled!</h2>
                                <p>All slots for this scholarship program have been filled. You can now start the program.</p>
                                <button
                                    className="mt-4 bg-teal-500 text-white px-4 py-2 rounded-md shadow hover:bg-teal-600"
                                    onClick={openConfirmModal}
                                >
                                    Start Program
                                </button>
                            </div>
                        )}

                        <Modal
                            isOpen={isConfirmModalOpen}
                            onRequestClose={closeConfirmModal}
                            contentLabel="Confirm Start Program"
                            className="fixed inset-0 flex items-center justify-center z-50"
                            overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-40"
                        >
                            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4 md:mx-auto">
                                <h2 className="text-2xl font-bold mb-4">Confirm Start Program</h2>
                                <p>Are you sure you want to start the scholarship program?</p>
                                <div className="flex justify-end gap-4 mt-4">
                                    <button
                                        className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-4 py-2 rounded-md"
                                        onClick={closeConfirmModal}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="bg-teal-500 hover:bg-teal-600 text-white font-semibold px-4 py-2 rounded-md"
                                        onClick={handleStartProgram}
                                    >
                                        Confirm
                                    </button>
                                </div>
                            </div>
                        </Modal>

                        {/* Ongoing Status Message */}
                        {scholarshipProgram?.status === 'Ongoing' && (
                            <div className="bg-teal-100 text-teal-700 p-4 mb-6 rounded-md shadow-md">
                                <h2 className="text-xl font-bold mb-2">Program is Ongoing!</h2>
                                <p>The scholarship program is currently ongoing. Please monitor the progress and manage the applications as needed. Remember to make any necessary announcements for scholars.</p>
                            </div>
                        )}

                        {/* Completed Status Message */}
                        {scholarshipProgram?.status === 'Completed' && (
                            <div className="bg-green-100 text-green-700 p-4 mb-6 rounded-md shadow-md">
                                <h2 className="text-xl font-bold mb-2">Program Completed!</h2>
                                <p>The scholarship program has been successfully completed. Please review the final reports and make any necessary announcements for scholars.</p>
                            </div>
                        )}

                        {/* Rejected Status Message */}
                        {scholarshipProgram?.status === 'Rejected' && (
                            <div className="bg-red-100 text-red-700 p-4 mb-6 rounded-md shadow-md">
                                <h2 className="text-xl font-bold mb-2">Application Rejected</h2>
                                <p>Unfortunately, your scholarship program application has been rejected.</p>
                                {scholarshipProgram?.rejectReason && (
                                    <p className="mt-2"><strong>Reason:</strong> {scholarshipProgram.rejectReason}</p>
                                )}
                                <p className="mt-2">Please review the feedback and consider making the necessary changes before reapplying.</p>
                            </div>
                        )}
                    </div>

                    {/* Tabs for different sections */}
                    <div className="tabs flex justify-center border-b mb-6">
                        {[
                            { label: 'Program Details', value: 'details', icon: <FaInfoCircle className="mr-2" /> },
                            { label: 'Edit Program', value: 'edit', icon: <FaEdit className="mr-2" /> },
                            { label: 'Post Announcement', value: 'announcement', icon: <FaBullhorn className="mr-2" /> },
                            { label: 'View Scholars', value: 'scholars', icon: <FaUsers className="mr-2" /> },
                            { label: 'Scholar Applications', value: 'applications', icon: <FaFileAlt className="mr-2" /> },
                        ].map((tab) => (
                            <button
                                key={tab.value}
                                className={`tab flex items-center px-4 py-2 mx-2 transition-colors duration-300 ${activeTab === tab.value
                                    ? 'border-b-2 border-blue-600 text-blue-600'
                                    : 'text-gray-500 hover:text-blue-600'
                                    }`}
                                onClick={() => handleTabChange(tab.value)}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div className="content">
                        {activeTab === 'details' && scholarshipProgram && (
                            <ProgramDetails scholarshipProgram={scholarshipProgram} />
                        )}

                        {activeTab === 'edit' && scholarshipProgram?.status !== 'Pending Approval' && scholarshipProgram?.status !== 'Rejected' && (
                            <EditProgram />
                        )}

                        {activeTab === 'announcement' && scholarshipProgram?.status !== 'Pending Approval' && scholarshipProgram?.status !== 'Rejected' && (
                            <PostAnnouncement />
                        )}

                        {/* {activeTab === 'validation' && scholarshipProgram?.status !== 'Pending Approval' && scholarshipProgram?.status !== 'Rejected' && (
                            <Validation />
                        )} */}

                        {activeTab === 'scholars' && scholarshipProgram?.status !== 'Pending Approval' && scholarshipProgram?.status !== 'Rejected' && (
                            <ViewScholars
                                scholars={scholars}
                                approvedScholars={scholars.length}
                                numberOfScholarships={numberOfScholarships}
                                numberOfScholarshipsSlotFilled={numberOfScholarshipsSlotFilled}
                            />
                        )}

                        {activeTab === 'applications' && scholarshipProgram?.status !== 'Pending Approval' && scholarshipProgram?.status !== 'Rejected' && (
                            <ScholarshipApplication applications={applications} />
                        )}

                        {activeTab !== 'details' && (scholarshipProgram?.status === 'Pending Approval' || scholarshipProgram?.status === 'Rejected') && (
                            <div className="p-6 bg-white rounded-lg shadow-md">
                                <h2 className="text-2xl font-bold mb-4 text-red-600">Access Restricted</h2>
                                <p className="text-gray-700">
                                    Access to this section is restricted while the status is "{scholarshipProgram?.status === 'Pending Approval' ? 'Pending Approval' : 'Rejected'}".
                                </p>
                                {scholarshipProgram?.status === 'Rejected' && scholarshipProgram?.rejectReason && (
                                    <p className="mt-2 text-gray-700">
                                        <strong>Reason for Rejection:</strong> {scholarshipProgram.rejectReason}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}