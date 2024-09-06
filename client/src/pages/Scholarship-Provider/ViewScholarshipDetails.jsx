import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProviderHeaderSidebar from '../../components/ProviderHeaderAndSidebar';
import { useSelector } from 'react-redux';
import { FaCheckCircle, FaTimesCircle, FaExclamationCircle } from 'react-icons/fa';
import ProgramDetails from '../../components/ViewScholarshipDetails/ProgamDetails';
import PostAnnouncement from '../../components/ViewScholarshipDetails/PostAnnouncement';
import ViewScholars from '../../components/ViewScholarshipDetails/ViewScholars';
import ScholarshipApplication from '../../components/ViewScholarshipDetails/ScholarApplication';
import Validation from '../../components/ViewScholarshipDetails/Validation';



export default function ViewScholarshipDetails() {
    const { currentUser } = useSelector((state) => state.user);

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState('details');

    const [scholarshipProgram, setProgramDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const fetchProgramDetails = async () => {
        try {
            const response = await fetch(`/api/scholarshipProgram/scholarship-programs/${id}`);
            const contentType = response.headers.get("content-type");
            if (!response.ok) {
                const errorText = await response.text(); // Read response as text
                throw new Error(`Network response was not ok: ${errorText}`);
            }
            if (contentType && contentType.indexOf("application/json") !== -1) {
                const data = await response.json();
                setProgramDetails(data);
            } else {
                throw new Error("Received non-JSON response");
            }
        } catch (error) {
            console.error('Error fetching program details:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const [applications, setApplications] = useState([]);

    const fetchApplications = async () => {
        try {
            const response = await fetch(`/api/scholarshipProgram/scholarship-applications/${id}`);
            const contentType = response.headers.get("content-type");

            if (!response.ok) {
                const responseText = await response.text(); // Read response as text
                if (response.status === 404 && responseText.includes("No applications found for this scholarship program")) {
                    setApplications([]);
                    setError(null); // No error, just no applications
                } else {
                    throw new Error(`Network response was not ok: ${responseText}`);
                }
            } else if (contentType && contentType.indexOf("application/json") !== -1) {
                const data = await response.json(); // Parse the JSON directly
                setApplications(data);
            } else {
                throw new Error("Received non-JSON response");
            }
        } catch (error) {
            console.error('Error fetching program applications:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProgramDetails();
        fetchApplications();
    }, [id]);

    const [scholars, setScholars] = useState([]);

    useEffect(() => {
        if (activeTab === 'scholars') {
            const fetchScholars = async () => {
                try {
                    const response = await fetch(`/api/scholarshipProgram/${id}/approved-scholar-info`);
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
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

    if (error) {
        return <div>Error: {error}</div>;
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

                        {activeTab === 'edit' && (
                            <div className="p-6 bg-white rounded-lg shadow-md">
                                <h2 className="text-2xl font-bold mb-4 text-blue-600">Edit Program</h2>
                                <p className="text-gray-700">
                                    To make changes to the scholarship program, please visit the{' '}
                                    <Link to="/edit-program/:id" className="text-blue-600 hover:underline">
                                        Edit Program Page
                                    </Link>.
                                </p>
                            </div>
                        )}

                        {activeTab === 'announcement' && (
                            <PostAnnouncement />
                        )}

                        {activeTab === 'validation' && (
                            <Validation />
                        )}

                        {activeTab === 'scholars' && (
                            <ViewScholars scholars={scholars} />
                        )}

                        {activeTab === 'applications' && (
                            <ScholarshipApplication applications={applications} />
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
