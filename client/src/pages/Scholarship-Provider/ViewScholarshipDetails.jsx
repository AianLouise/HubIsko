import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProviderHeaderSidebar from '../../components/ProviderHeaderAndSidebar';

export default function ViewScholarshipDetails() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('details');
    const [programDetails, setProgramDetails] = useState(null);
    const [applications, setApplications] = useState([]);
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

    useEffect(() => {
        fetchProgramDetails();
    }, [id]);

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
                <ProviderHeaderSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
                <div className="container mx-auto p-6">
                    <div className="flex flex-col items-center mb-6">
                        <img src={programDetails.scholarshipImage} alt="Scholarship Program" className="w-32 h-32 rounded-full mb-4 shadow-lg" />
                        <h1 className="text-4xl font-bold text-center text-blue-600">{programDetails.title}</h1>
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
                        {activeTab === 'details' && programDetails && (
                            <div>
                                <h2 className="text-2xl font-bold mb-4">Program Details</h2>
                                <p className="text-gray-700">
                                    <strong>Scholarship Title:</strong> {programDetails.title}<br />
                                    <strong>Description:</strong> {programDetails.description}<br />
                                    <strong>Amount:</strong> {programDetails.amount}<br />
                                    <strong>Slots Filled:</strong> {programDetails.slotsFilled}<br />
                                    <strong>Total Slots:</strong> {programDetails.totalSlots}<br />
                                    <strong>Duration:</strong> {programDetails.duration}<br />
                                    <strong>Category:</strong> {programDetails.category}<br />
                                    <strong>Type:</strong> {programDetails.type}<br />
                                    <strong>Academic Requirements:</strong> {programDetails.academicRequirements}<br />
                                    <strong>Field of Study:</strong> {programDetails.fieldOfStudy}<br />
                                    <strong>Level of Education:</strong> {programDetails.levelOfEducation}<br />
                                    <strong>Location:</strong> {programDetails.location}<br />
                                    <strong>Application Start Date:</strong> {new Date(programDetails.applicationStartDate).toLocaleDateString()}<br />
                                    <strong>Application End Date:</strong> {new Date(programDetails.applicationEndDate).toLocaleDateString()}<br />
                                    <strong>Notification Date:</strong> {new Date(programDetails.notificationDate).toLocaleDateString()}<br />
                                    <strong>Coverage:</strong> {programDetails.coverage}<br />
                                    <strong>Contact Person:</strong> {programDetails.contactPerson}<br />
                                    <strong>Status:</strong> {programDetails.status}<br />
                                    <strong>Date Posted:</strong> {new Date(programDetails.datePosted).toLocaleDateString()}
                                </p>
                                {/* Additional details can be included here */}
                            </div>
                        )}

                        {activeTab === 'edit' && (
                            <div className="p-6 bg-white rounded-lg shadow-md">
                                <h2 className="text-2xl font-bold mb-4 text-blue-600">Edit Program</h2>
                                <p className="text-gray-700">
                                    To make changes to the scholarship program, please visit the{' '}
                                    <Link to="/edit-program" className="text-blue-600 hover:underline">
                                        Edit Program Page
                                    </Link>.
                                </p>
                            </div>
                        )}

                        {activeTab === 'announcement' && (
                            <div className="p-6 bg-white rounded-lg shadow-md">
                                <h2 className="text-2xl font-bold mb-4 text-blue-600">Post Announcement</h2>
                                <p className="text-gray-700">
                                    You can post announcements here to keep scholars updated on important information.
                                </p>
                                <form className="mt-4">
                                    <textarea
                                        className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        rows="5"
                                        placeholder="Write your announcement here..."
                                    ></textarea>
                                    <button
                                        type="submit"
                                        className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300"
                                    >
                                        Post Announcement
                                    </button>
                                </form>
                            </div>
                        )}

                        {activeTab === 'validation' && (
                            <div className="p-6 bg-white rounded-lg shadow-md">
                                <h2 className="text-2xl font-bold mb-4 text-blue-600">Validation Page</h2>
                                <p className="text-gray-700">
                                    Review and validate the documents uploaded by scholars.
                                </p>
                                <ul className="list-disc pl-5">
                                    <li className="mb-2">
                                        <strong>John Doe:</strong> <span className="text-gray-600">Documents Approved</span>
                                    </li>
                                    <li className="mb-2">
                                        <strong>Jane Smith:</strong> <span className="text-gray-600">Awaiting Documents</span>
                                    </li>
                                    <li className="mb-2">
                                        <strong>Emily Johnson:</strong> <span className="text-gray-600">Documents Rejected</span>
                                    </li>
                                </ul>
                            </div>
                        )}

                        {activeTab === 'scholars' && (
                            <div className="p-6 bg-white rounded-lg shadow-md">
                                <h2 className="text-2xl font-bold mb-4 text-blue-600">View Scholars</h2>
                                <p className="text-gray-700">
                                    Here is the list of scholars enrolled in the program.
                                </p>
                                <ul className="list-disc pl-5">
                                    <li className="mb-2">
                                        <strong>John Doe:</strong> <span className="text-gray-600">Computer Science, Year 2</span>
                                    </li>
                                    <li className="mb-2">
                                        <strong>Jane Smith:</strong> <span className="text-gray-600">Engineering, Year 3</span>
                                    </li>
                                    <li className="mb-2">
                                        <strong>Emily Johnson:</strong> <span className="text-gray-600">Physics, Year 1</span>
                                    </li>
                                </ul>
                            </div>
                        )}

                        {activeTab === 'applications' && (
                            <div className="p-6 bg-white rounded-lg shadow-md">
                                <h2 className="text-2xl font-bold mb-4 text-blue-600">Scholar Applications</h2>
                                <p className="text-gray-700">
                                    Manage and review applications from scholars here.
                                </p>
                                <ul className="list-disc pl-5">
                                    {applications.map((application) => (
                                        <li key={application.id} className="mb-4">
                                            <strong>{application.scholarName}</strong><br />
                                            <span className="text-gray-600">Status: {application.status}</span><br />
                                            <span className="text-gray-600">Applied On: {new Date(application.appliedOn).toLocaleDateString()}</span><br />
                                            <Link to={`/applications/${application.id}`} className="text-blue-600 hover:underline">
                                                View Details
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
