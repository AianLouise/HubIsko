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
    const [showShareMessage, setShowShareMessage] = useState(false);

    const fetchProgramDetails = async () => {
        try {
            const response = await fetch(`/api/scholarshipProgram/scholarship-programs/${id}`);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setProgramDetails(data);
            if (data.status === 'Published') {
                setShowShareMessage(true);
            }
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
            });
            if (!response.ok) throw new Error('Failed to publish the program');
            await response.json();
            setShowPublishModal(false);
            fetchProgramDetails(); // Refresh the fetch after publishing
        } catch (error) {
            console.error('Error publishing the program:', error);
            setError(error.message);
        }
    };

    const numberOfScholarships = scholarshipProgram?.numberOfScholarships || 0;
    const numberOfScholarshipsSlotFilled = scholarshipProgram?.numberOfScholarshipsSlotFilled || 0;

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
                    <div className="flex flex-col items-center mb-6">
                        <img
                            src={scholarshipProgram?.scholarshipImage || 'default-image-path.jpg'}
                            alt="Scholarship Program"
                            className="w-32 h-32 object-cover rounded-full mb-4 shadow-lg"
                        />
                        <h1 className="text-4xl font-bold text-center text-blue-600">{scholarshipProgram?.title}</h1>
                    </div>

                    {/* Congratulatory Message */}
                    {scholarshipProgram?.status === 'Approved' && (
                        <div className="bg-green-100 text-green-700 p-4 mb-6 rounded-md shadow-md">
                            <h2 className="text-2xl font-bold">Congratulations!</h2>
                            <p>Your scholarship program has been approved. You can now publish it to make it visible to students.</p>
                            <button
                                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700"
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
                                <div className="mt-6 flex justify-end space-x-4">
                                    <button
                                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
                                        onClick={() => setShowPublishModal(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="bg-blue-600 text-white px-4 py-2 rounded-md"
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
                        <div className="bg-blue-100 text-blue-700 p-4 mt-6 rounded-md shadow-md">
                            <h3 className="text-xl font-bold">Share Your Scholarship Program!</h3>
                            <p>Congratulations, your scholarship program has been published successfully!</p>
                            <p className="mt-2">Let others know about it by sharing it on the <Link to="/provider-forums" className="text-blue-600 underline">forums</Link>.</p>
                            <p>You can also discuss your program and connect with potential applicants!</p>
                            <button
                                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700"
                                onClick={() => navigate('/provider-forums')}
                            >
                                Go to Forums
                            </button>
                        </div>
                    )}

                    {/* Tabs for different sections */}
                    <div className="tabs flex justify-center border-b mb-6">
                        {[
                            { label: 'Program Details', value: 'details' },
                            { label: 'Edit Program', value: 'edit' },
                            { label: 'Post Announcement', value: 'announcement' },
                            { label: 'Validation', value: 'validation' },
                            { label: 'View Scholars', value: 'scholars' },
                            { label: 'Scholar Applications', value: 'applications' },
                        ].map((tab) => (
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
                        ))}
                    </div>

                    {/* Content Area */}
                    <div className="content">
                        {activeTab === 'details' && scholarshipProgram && (
                            <ProgramDetails scholarshipProgram={scholarshipProgram} />
                        )}

                        {activeTab === 'edit' && scholarshipProgram?.status !== 'Pending Approval' && (
                            <EditProgram />
                        )}

                        {activeTab === 'announcement' && scholarshipProgram?.status !== 'Pending Approval' && (
                            <PostAnnouncement />
                        )}

                        {activeTab === 'validation' && scholarshipProgram?.status !== 'Pending Approval' && (
                            <Validation />
                        )}

                        {activeTab === 'scholars' && scholarshipProgram?.status !== 'Pending Approval' && (
                            <ViewScholars
                                scholars={scholars}
                                numberOfScholarships={numberOfScholarships}
                                numberOfScholarshipsSlotFilled={numberOfScholarshipsSlotFilled}
                            />
                        )}

                        {activeTab === 'applications' && scholarshipProgram?.status !== 'Pending Approval' && (
                            <ScholarshipApplication applications={applications} />
                        )}

                        {activeTab !== 'details' && scholarshipProgram?.status === 'Pending Approval' && (
                            <div className="p-6 bg-white rounded-lg shadow-md">
                                <h2 className="text-2xl font-bold mb-4 text-red-600">Access Restricted</h2>
                                <p className="text-gray-700">
                                    Access to this section is restricted while the status is "Pending Approval".
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}