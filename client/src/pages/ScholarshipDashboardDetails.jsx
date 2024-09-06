import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FaAngleRight } from 'react-icons/fa';
import { FaRegHeart, FaRegEye } from 'react-icons/fa';
import { BiCommentDots } from 'react-icons/bi';
import { BsArrowLeft } from 'react-icons/bs';
import ApplicationForm from './ApplicationForm';

export default function ScholarshipDashboardDetails() {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('scholars');

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const currentUser = useSelector((state) => state.user.currentUser);
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

    const handleDocumentReady = async (documentId) => {
        try {
            const response = await fetch(`/api/validation/mark-as-ready`, {
                method: 'POST',
                body: JSON.stringify({ documentId, studentId: currentUser.id }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Error marking document as ready');
            }

            const data = await response.json();
            // Update the local state to reflect the document as ready
            setValidationDocuments((prevDocs) =>
                prevDocs.map((doc) =>
                    doc.id === documentId ? { ...doc, status: 'Ready' } : doc
                )
            );
        } catch (error) {
            console.error('Failed to mark document as ready:', error);
        }
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
                                <div className="w-32 h-32 bg-blue-600 rounded-full mb-4 shadow-lg">
                                    <img src={application.scholarshipProgram.scholarshipImage} alt="Scholarship Program" className="w-full h-full object-cover rounded-full" />
                                </div>
                                <span className='text-3xl font-bold'>{application.scholarshipProgram.title}</span>
                            </div>
                        ) : (
                            <span className='text-3xl font-bold'>Loading...</span>
                        )}
                    </div>

                    <div className="tabs flex justify-center border-b mb-6">
                        {[
                            { label: 'Application Details', value: 'scholars' },
                            { label: 'Announcement', value: 'announcement' },
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

                        {activeTab === 'announcement' && (
                            <div className='flex flex-col gap-4'>
                                <div className='flex justify-between items-center gap-4'>
                                    <span className='text-2xl font-bold'>Announcements</span>
                                    <div className="flex gap-2 items-center bg-white shadow px-6 py-2 rounded-md border text-md">
                                        <input type="text"
                                            placeholder="Search Announcements"
                                            className="w-full bg-transparent outline-none" />
                                    </div>
                                </div>

                                <div className='grid grid-cols-3 gap-10'>
                                    <div className='bg-white border p-4 rounded-md flex flex-col gap-4 hover:-translate-y-1 hover:shadow-lg transition ease-in-out'>

                                        <div className='flex gap-2'>
                                            <div className='bg-blue-600 w-12 h-12 rounded-md'></div>
                                            <div className='flex flex-col'>
                                                <span className='font-bold'>Organization Name</span>
                                                <span className='text-blue-600'>Scholarship Title</span>
                                            </div>
                                        </div>

                                        <p className='bg-slate-200 p-4 rounded-md'><span className='text-blue-600 font-bold'>@Students</span> Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi, vel.</p>
                                        <span className='text-sm flex items-end justify-end w-full text-slate-600'>Announced: July 7,2024</span>
                                        <div className='border-t mt-2'>
                                            <div className='flex flex-row justify-between mt-2 gap-2'>
                                                <div className='flex flex-row gap-2'>
                                                    <div className='flex flex-row gap-1 px-2'>
                                                        <FaRegHeart className='w-6 h-6 font-bold text-blue-600' />
                                                        <span>123</span>
                                                    </div>
                                                    <div className='flex flex-row gap-1'>
                                                        <BiCommentDots className='w-6 h-6 text-blue-600' />
                                                        <span>10</span>
                                                    </div>
                                                </div>
                                                <div className='flex flex-row gap-1 pr-2'>
                                                    <FaRegEye className='w-6 h-6 text-blue-600' />
                                                    <span>1.2k</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        )}

                        {activeTab === 'validation' && (
                            <div>
                                {/* Upcoming Document Validation */}
                                <div className='mb-8'>
                                    {/* Upcoming Document Validation Header */}
                                    <h3 className='text-2xl font-bold mb-4'>Upcoming Document Validation</h3>

                                    {/* Upcoming Document Validation Content */}
                                    <div className='bg-white border-l-4 border-blue-500 text-black-700 p-4 rounded-md shadow relative mb-6'>
                                        <div className='flex justify-between items-center mb-4'>
                                            <h3 className='text-xl font-bold'>Jose Rizal Scholarship Program 2024-2025 Validation of Grades</h3>
                                            <span className='text-blue-600'>Status: Not Submitted</span>
                                        </div>

                                        <p className='mb-4'>
                                            Please be informed that the document validation for the 2024-2025 academic year is upcoming. Ensure all required documents are submitted on time.
                                        </p>

                                        {/* Displaying the required documents */}
                                        <div className='flex items-center justify-between mb-4'>
                                            <span>Proof of Enrollment</span>
                                        </div>

                                        <div className='flex items-center justify-between mb-4'>
                                            <span>Transcript of Records</span>
                                        </div>

                                        <div className='flex items-center justify-between mb-4'>
                                            <span>Financial Aid Application</span>
                                        </div>
                                    </div>
                                </div>

                                <div className='mb-8'>
                                    {/* Previous Document Validation Header */}
                                    <h3 className='text-2xl font-bold mb-4'>Previous Document Validation</h3>

                                    {/* Previous Document Validation Content */}
                                    <div className='bg-gray-100 border-l-4 border-gray-500 text-gray-700 p-4 rounded-md shadow relative'>
                                        <div className='flex justify-between items-center mb-4'>
                                            <h3 className='text-xl font-bold'>Jose Rizal Scholarship Program 2023-2024 Validation of Grades</h3>
                                            <span className='text-gray-600'>Status: Completed</span>
                                        </div>

                                        <p className='mb-4'>
                                            The document validation for the 2023-2024 academic year has been completed. Below are the details of the submitted documents.
                                        </p>

                                        {/* Displaying the previous documents */}
                                        <div className='flex items-center justify-between mb-4'>
                                            <span>Proof of Enrollment</span>
                                        </div>

                                        <div className='flex items-center justify-between mb-4'>
                                            <span>Transcript of Records</span>
                                        </div>

                                        <div className='flex items-center justify-between mb-4'>
                                            <span>Financial Aid Application</span>
                                        </div>
                                    </div>
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

const validationDocuments = [
    {
        id: 1,
        name: 'Birth Certificate',
        status: 'Submitted',
    },
    {
        id: 2,
        name: 'Transcript of Records',
        status: 'Not Submitted',
    },
    {
        id: 3,
        name: 'Recommendation Letter',
        status: 'Submitted',
    },
    {
        id: 4,
        name: 'Passport',
        status: 'Not Submitted',
    },
];