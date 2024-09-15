import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { BsArrowLeft } from 'react-icons/bs';
import { IoMdArrowDropdown } from 'react-icons/io';
import ApplicationForm from '../ApplicationForm';
import ProviderHeaderSidebar from '../../components/ProviderHeaderAndSidebar';

export default function ScholarView() {
    const { currentUser } = useSelector((state) => state.user);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('scholars');
    const [scholar, setScholar] = useState(null);
    const [isValidated, setIsValidated] = useState(false);

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

    const handleValidationChange = () => {
        setIsValidated(!isValidated);
    };

    const saveValidationStatus = async () => {
        try {
            const response = await fetch(`/api/scholar/validate/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ isValidated }),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            alert('Validation status saved successfully');
        } catch (error) {
            console.error('Error saving validation status:', error);
        }
    };


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

    return (
        <div className={`flex flex-col min-h-screen`}>
            <main className={`flex-grow bg-[#f8f8fb] transition-all duration-200 ease-in-out ${sidebarOpen ? 'ml-64' : ''}`}>
                <ProviderHeaderSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} currentPath={`${currentUser.scholarshipProviderDetails.organizationName} / `} />
                <div className='flex flex-col gap-4 py-12 max-w-6xl mx-auto justify-between p-4 lg:px-24'>

                    <div className='my-8 flex gap-2 items-center font-medium'>
                        <Link
                            to="#"
                            onClick={(e) => {
                                e.preventDefault();
                                navigate(-1);
                            }}
                            className='bg-white border rounded-md px-6 py-2 shadow hover:bg-slate-200'
                        >
                            <span>{application?.scholarshipProgram.title}</span>
                        </Link>
                        <IoMdArrowDropdown className='-rotate-90 text-4xl text-blue-600' />
                        <div className='bg-white border rounded-md px-6 py-2 shadow'>
                            {scholar ? (
                                <span className='text-blue-600 font-bold'>
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
                            { label: 'Document Validation', value: 'validation' },
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
                            <div>
                                <div className='bg-white rounded-md shadow border p-4'>
                                    <label className='flex items-center'>
                                        <input
                                            type='checkbox'
                                            checked={isValidated}
                                            onChange={handleValidationChange}
                                            className='mr-2'
                                        />
                                        Successfully Validated
                                    </label>
                                    <button
                                        onClick={saveValidationStatus}
                                        className='mt-4 px-4 py-2 bg-blue-600 text-white rounded-md'
                                    >
                                        Save Validation Status
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}