import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { BsArrowLeft } from 'react-icons/bs';
import { IoMdArrowDropdown } from 'react-icons/io';
import ApplicationForm from '../ApplicationForm';
import ProviderHeaderSidebar from '../../components/ProviderHeaderAndSidebar';
import Modal from 'react-modal';
import { FaArrowLeft } from 'react-icons/fa6';

export default function ScholarView() {
    const { currentUser } = useSelector((state) => state.user);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('scholars');
    const [scholar, setScholar] = useState(null);
    const [isValidated, setIsValidated] = useState(false);
    const [isTerminateModalOpen, setIsTerminateModalOpen] = useState(false);
    const [validationResults, setValidationResults] = useState([]); // Added state for validation results

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    useEffect(() => {
        // Fetch scholar data
        const fetchScholar = async () => {
            try {
                // Fetch the user data directly using the scholarship application ID
                const response = await fetch(`/api/scholar/applicantDetails/${id}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const userData = await response.json();
                setScholar(userData);
                setIsValidated(userData.isValidated); // Assuming the user data has an isValidated field
            } catch (error) {
                console.error('Error fetching scholar data:', error);
            }
        };

        fetchScholar();
    }, [id]);

    const [application, setApplication] = useState(null);
    const { id: applicationId } = useParams(); // Extract applicationId from the URL

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

    // Fetch validation results by scholar ID
    useEffect(() => {
        const fetchValidationResults = async () => {
            try {
                const response = await fetch(`/api/validation/validation-results/scholar/${application?.applicant}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setValidationResults(data);
            } catch (error) {
                console.error('Error fetching validation results:', error);
            }
        };

        fetchValidationResults();
    }, [application?.applicant]);

    console.log(validationResults);

    return (
        <div className={`flex flex-col min-h-screen`}>
            <main className={`flex-grow bg-[#f8f8fb] transition-all duration-200 ease-in-out ${sidebarOpen ? 'ml-64' : ''}`}>
                <ProviderHeaderSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
                <div className='flex flex-col gap-4 py-12 max-w-6xl mx-auto justify-between p-4 lg:px-24'>
                    <div className='my-8 flex gap-2 items-center'>
                        <Link
                            to="#"
                            onClick={(e) => {
                                e.preventDefault();
                                navigate(-1);
                            }}
                            className='bg-white border rounded-md px-6 py-2 shadow hover:bg-slate-200 flex items-center gap-2'
                        >
                            <FaArrowLeft className='text-blue-600' />
                            <span>{application?.scholarshipProgram.title}</span>
                        </Link>

                        <IoMdArrowDropdown className='-rotate-90 text-4xl text-blue-600' />
                        <div className='bg-white border rounded-md px-6 py-2 shadow'>
                            {scholar ? (
                                <span className='text-blue-600 font-medium'>
                                    {scholar.applicantDetails.firstName} {scholar.applicantDetails.lastName}
                                </span>
                            ) : (
                                <span>Loading...</span>
                            )}
                        </div>
                    </div>

                    <div className="tabs flex justify-center border-b mb-6">
                        {[
                            { label: 'Application Details', value: 'scholars' },
                            { label: 'Validation', value: 'validation' },
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

                    <div className='content'>
                        {activeTab === 'scholars' && (
                            <div className='flex flex-col gap-4'>
                                <div className='flex justify-between items-center gap-4'>
                                    <span className='text-2xl font-bold'>Application Detail</span>
                                </div>

                                <ApplicationForm />
                            </div>
                        )}

                        {activeTab === 'validation' && (
                            <div className='mb-8'>
                                <h3 className='text-2xl font-bold mb-4'>Validation Results Posted by the Program</h3>
                                {validationResults.length > 0 ? (
                                    validationResults
                                        .filter(result => result.validationStatus === 'Done') // Filter results with validationStatus "Done"
                                        .sort((a, b) => new Date(b.datePosted) - new Date(a.datePosted)) // Sort by datePosted in descending order
                                        .map((result, index) => (
                                            <div
                                                key={index}
                                                className={`bg-white border-l-4 text-black-700 p-4 rounded-md shadow relative mb-6 ${result.status === 'Approved' ? 'border-green-500 bg-green-100' :
                                                        result.status === 'Rejected' ? 'border-red-500 bg-red-100' :
                                                            'border-orange-500 bg-orange-100'
                                                    }`}
                                            >
                                                <div className='flex justify-between items-center mb-4'>
                                                    <h3 className='text-xl font-bold'>{result.validationTitle}</h3>
                                                    <div className='text-sm text-gray-500'>
                                                        {result.datePosted && (
                                                            <p>
                                                                Date Posted: {new Date(result.datePosted).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at {new Date(result.datePosted).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className='mb-4'>
                                                    <p className='font-medium text-gray-800'>Status:</p>
                                                    <p className='text-gray-700'>
                                                        {result.status}
                                                    </p>
                                                    {result.status === 'Rejected' && (
                                                        <p className='text-red-500'><strong>Feedback:</strong> {result.feedback}</p>
                                                    )}
                                                </div>
                                                {result.dateDone && (
                                                    <div className='absolute bottom-4 right-4 text-sm text-gray-500'>
                                                        <p className='font-medium text-gray-800'>Date Done:</p>
                                                        <p className='text-gray-700'>
                                                            {new Date(result.dateDone).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at {new Date(result.dateDone).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                                        </p>
                                                    </div>
                                                )}
                                                <span className='absolute top-0 right-0 bg-blue-500 text-white rounded-full px-3 py-1 text-xs'>{result.validationStatus}</span>
                                            </div>
                                        ))
                                ) : (
                                    <p>No validation results available yet.</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}