import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { BsArrowLeft } from 'react-icons/bs';
import { IoMdArrowDropdown } from 'react-icons/io';
import ApplicationForm from '../ApplicationForm';
import ProviderHeaderSidebar from '../../components/ProviderHeaderAndSidebar';
import Modal from 'react-modal';
import { FaArrowLeft, FaUser } from 'react-icons/fa6';

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

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

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

    const printScholarDetails = () => {
        const printContents = document.getElementById('scholar-details').innerHTML;
        const originalContents = document.body.innerHTML;
        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
        window.location.reload(); // Reload the page to restore the original content
    };

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
                        <div className='bg-white border rounded-md px-6 py-2 shadow flex items-center gap-2'>
                            {scholar ? (
                                <span className='text-blue-600 font-medium flex items-center gap-2'>
                                    <FaUser className='text-blue-600' /> {/* Add the FaUser icon */}
                                    {scholar.applicantDetails.firstName} {scholar.applicantDetails.lastName}
                                </span>
                            ) : (
                                <span>Loading...</span>
                            )}
                        </div>
                    </div>

                    <div className="tabs flex justify-center border-b mb-6">
                        {[
                            { label: 'Scholar Details', value: 'scholars' },
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
                                    <span className='text-2xl font-bold'>Scholar Details</span>
                                    <div className="flex justify-end">
                                        <button onClick={printScholarDetails} className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-blue-800">
                                            Print Scholar Details
                                        </button>
                                    </div>
                                </div>

                                <ApplicationForm printScholarDetails={printScholarDetails} />
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}