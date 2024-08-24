import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProviderHeaderSidebar from '../../components/ProviderHeaderAndSidebar';
import { useSelector } from 'react-redux';

const toSentenceCase = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
        case 'pending':
            return 'bg-yellow-500';
        case 'approved':
            return 'bg-green-500';
        case 'rejected':
            return 'bg-red-500';
        case 'completed':
            return 'bg-blue-500';
        default:
            return 'bg-gray-500';
    }
};

export default function ViewScholarshipDetails() {
    const { currentUser } = useSelector((state) => state.user);

    const [sidebarOpen, setSidebarOpen] = useState(false);
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
                            <div className="p-6 bg-white rounded-lg shadow-md">
                                <div className="flex items-center mb-4">
                                    <span className={`px-3 py-1 rounded-full text-white ${scholarshipProgram.status === 'Active' ? 'bg-green-500' :
                                        scholarshipProgram.status === 'Inactive' ? 'bg-red-500' :
                                            'bg-yellow-500'
                                        }`}>
                                        {scholarshipProgram.status}
                                    </span>
                                </div>
                                <h2 className="text-2xl font-bold mb-4">Program Details</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-gray-100 p-4 rounded-lg">
                                        <strong>Scholarship Title:</strong> {scholarshipProgram.title}
                                    </div>
                                    <div className="bg-gray-100 p-4 rounded-lg">
                                        <strong>Amount:</strong> {scholarshipProgram.amount}
                                    </div>
                                    <div className="bg-gray-100 p-4 rounded-lg">
                                        <strong>Slots Filled:</strong> {scholarshipProgram.numberOfScholarshipsSlotFilled}
                                    </div>
                                    <div className="bg-gray-100 p-4 rounded-lg">
                                        <strong>Total Slots:</strong> {scholarshipProgram.numberOfScholarships}
                                    </div>
                                    <div className="bg-gray-100 p-4 rounded-lg">
                                        <strong>Duration:</strong> {scholarshipProgram.renewalDuration}
                                    </div>
                                    <div className="bg-gray-100 p-4 rounded-lg">
                                        <strong>Category:</strong> {scholarshipProgram.category}
                                    </div>
                                    <div className="bg-gray-100 p-4 rounded-lg">
                                        <strong>Type:</strong> {scholarshipProgram.selectionProcess}
                                    </div>
                                    <div className="bg-gray-100 p-4 rounded-lg">
                                        <strong>Academic Requirements:</strong> {scholarshipProgram.minGPA}
                                    </div>
                                    <div className="bg-gray-100 p-4 rounded-lg">
                                        <strong>Field of Study:</strong> {scholarshipProgram.fieldOfStudy}
                                    </div>
                                    <div className="bg-gray-100 p-4 rounded-lg">
                                        <strong>Level of Education:</strong> {scholarshipProgram.selectionCriteria}
                                    </div>
                                    <div className="bg-gray-100 p-4 rounded-lg">
                                        <strong>Location:</strong> {scholarshipProgram.nationality}
                                    </div>
                                    <div className="bg-gray-100 p-4 rounded-lg">
                                        <strong>Application Start Date:</strong> {new Date(scholarshipProgram.startDate).toLocaleDateString()}
                                    </div>
                                    <div className="bg-gray-100 p-4 rounded-lg">
                                        <strong>Application End Date:</strong> {new Date(scholarshipProgram.endDate).toLocaleDateString()}
                                    </div>
                                    <div className="bg-gray-100 p-4 rounded-lg">
                                        <strong>Notification Date:</strong> {new Date(scholarshipProgram.applicationDeadline).toLocaleDateString()}
                                    </div>
                                    <div className="bg-gray-100 p-4 rounded-lg">
                                        <strong>Coverage:</strong> {scholarshipProgram.renewalPolicy}
                                    </div>
                                    <div className="bg-gray-100 p-4 rounded-lg">
                                        <strong>Contact Person:</strong> {scholarshipProgram.contactEmail}
                                    </div>
                                    <div className="bg-gray-100 p-4 rounded-lg">
                                        <strong>Status:</strong> {scholarshipProgram.status}
                                    </div>
                                    <div className="bg-gray-100 p-4 rounded-lg">
                                        <strong>Date Posted:</strong> {new Date(scholarshipProgram.startDate).toLocaleDateString()}
                                    </div>
                                </div>
                                {/* Additional details can be included here */}
                            </div>
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
                                <h2 className="text-2xl font-bold mt-8 mb-4 text-blue-600">Previous Announcements</h2>


                                <div className='bg-white rounded-lg shadow-md border'>
                                    <table className="min-w-full">
                                        <thead>
                                            <tr className='text-left'>
                                                <th className="py-2 px-4 border-b">Date</th>
                                                <th className="py-2 px-4 border-b">Announcement</th>
                                            </tr>
                                        </thead>
                                        <tbody className=''>
                                            <tr className="hover:bg-gray-100">
                                                <td className="py-2 px-4 border-b">2023-10-01</td>
                                                <td className="py-2 px-4 border-b">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.</td>
                                            </tr>
                                            <tr className="hover:bg-gray-100">
                                                <td className="py-2 px-4 border-b">2023-09-15</td>
                                                <td className="py-2 px-4 border-b">Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta.</td>
                                            </tr>
                                            <tr className="hover:bg-gray-100">
                                                <td className="py-2 px-4 border-b">2023-09-01</td>
                                                <td className="py-2 px-4 border-b">Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeTab === 'validation' && (
                            <div className="p-6 bg-white rounded-lg shadow-md space-y-4">
                                <h2 className="text-2xl font-bold mb-4 text-blue-600">Validation Page</h2>
                                <p className="text-slate-600">
                                    Create validation requirements for the school year and review the documents uploaded by scholars.
                                </p>
                                <form className="mb-6">
                                    <h3 className="text-xl font-bold mb-4 text-blue-600">Create Validation Requirement</h3>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 font-bold mb-2" htmlFor="schoolYear">
                                            School Year
                                        </label>
                                        <input
                                            type="text"
                                            id="schoolYear"
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            placeholder="Enter school year (e.g., 2024-2025)"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 font-bold mb-2" htmlFor="requirement">
                                            Requirement
                                        </label>
                                        <input
                                            type="text"
                                            id="requirement"
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            placeholder="Enter requirement (e.g., Transcript, ID Proof)"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300"
                                    >
                                        Add Requirement
                                    </button>
                                </form>
                                <h3 className="text-xl font-bold mb-4 text-blue-600">Validation Status</h3>
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
                            <div className="p-6 bg-white rounded-lg shadow-md space-y-4">
                                <h2 className="text-2xl font-bold mb-4 text-blue-600">View Scholars</h2>

                                <p className="text-gray-700">
                                    Here is the list of scholars enrolled in the program.
                                </p>

                                <div className='rounded-lg shadow-md border'>
                                    <table className="min-w-full">
                                        <thead>
                                            <tr className='text-blue-600'>
                                                <th className="py-2 px-4 border-b">Name</th>
                                                <th className="py-2 px-4 border-b">Course</th>
                                                <th className="py-2 px-4 border-b">Year</th>
                                                <th className="py-2 px-4 border-b">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className='text-center'>
                                            {scholars.map((scholar) => (
                                                <tr key={scholar._id} className="hover:bg-gray-100">
                                                    <td className="py-2 px-4 border-b"><strong>{scholar.applicationDetails.firstName} {scholar.applicationDetails.lastName}</strong></td>
                                                    <td className="py-2 px-4 border-b">{scholar.applicationDetails.education.college.course}</td>
                                                    <td className="py-2 px-4 border-b">{scholar.applicationDetails.education.college.yearGraduated || 'N/A'}</td>
                                                    <td className="py-2 px-4 border-b">
                                                        <Link to={`/scholars/${scholar.applicationDetails.firstName.toLowerCase().replace(' ', '-')}`} className="text-white bg-blue-600 px-4 py-1 rounded-md hover:bg-blue-800">
                                                            View Details
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeTab === 'applications' && (
                            <div className="p-6 bg-white rounded-lg shadow-md">
                                <h2 className="text-2xl font-bold mb-4 text-blue-600">Scholar Applications</h2>
                                <p className="text-gray-700 mb-5">
                                    Manage and review applications from scholars here.
                                </p>

                                <div className='bg-white rounded-lg shadow-md border'>
                                    <table className="min-w-full">
                                        <thead>
                                            <tr className='text-blue-600'>
                                                <th className="py-2 px-4 border-b text-center">Name</th>
                                                <th className="py-2 px-4 border-b text-center">Status</th>
                                                <th className="py-2 px-4 border-b text-center">Submission Date</th>
                                                <th className="py-2 px-4 border-b text-center">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {error ? (
                                                <tr>
                                                    <td colSpan="4" className="py-2 px-4 border-b text-center text-red-600">
                                                        {error}
                                                    </td>
                                                </tr>
                                            ) : applications.length === 0 ? (
                                                <tr>
                                                    <td colSpan="4" className="py-2 px-4 border-b text-center">
                                                        No applications found for this scholarship program.
                                                    </td>
                                                </tr>
                                            ) : (
                                                applications.map(application => (
                                                    <tr key={application._id} className="hover:bg-gray-100">
                                                        <td className="py-2 px-4 border-b text-center">{`${application.firstName} ${application.lastName}`}</td>
                                                        <td className="py-2 px-4 border-b text-center">
                                                            <span className={`inline-block w-3 h-3 mr-2 rounded-full ${getStatusColor(application.applicationStatus)}`}></span>
                                                            {toSentenceCase(application.applicationStatus)}
                                                        </td>
                                                        <td className="py-2 px-4 border-b text-center">{new Date(application.submissionDate).toLocaleDateString()}</td>
                                                        <td className="py-2 px-4 border-b text-center">
                                                            <Link to={`/applications/${application._id}`} className="text-white bg-blue-600 px-4 py-1 rounded-md hover:bg-blue-800">
                                                                View Details
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
