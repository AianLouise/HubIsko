import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { IoMdArrowDropdown } from 'react-icons/io';
import ApplicationForm from '../ApplicationForm';
import ProviderHeaderSidebar from '../../components/ProviderHeaderAndSidebar';
import Snackbar from '../../components/Snackbar';

export default function ViewApplicationDetails() {
    const { currentUser } = useSelector((state) => state.user);

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { id: applicationId } = useParams();
    const navigate = useNavigate();

    const [application, setApplication] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [showSnackbar, setShowSnackbar] = useState(false);

    const [rejectionNote, setRejectionNote] = useState('');

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    const fetchApplicationDetails = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/scholarshipApplication/get-applications-details/${applicationId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setApplication(data);
            if (data.applicationStatus === 'Rejected') {
                setRejectionNote(data.rejectionNote || '');
            }
        } catch (error) {
            console.error('Error fetching application details:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplicationDetails();
    }, [applicationId]);

        const handleApprove = async (applicationId, applicant, scholarshipId) => {
        console.log(`Starting approval process for application ID: ${applicationId}`);
    
        try {
            // Approve the application
            const response = await fetch(`/api/scholarshipProgram/applications/${applicationId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ applicationStatus: 'Approved' })
            });
    
            if (!response.ok) {
                throw new Error('Approval failed');
            }
    
            const data = await response.json();
            console.log('Application approved:', data);
    
            // Update the approvedScholar field in the scholarshipProgram table
            const updateScholarResponse = await fetch(`/api/scholarshipProgram/scholarship-programs/${scholarshipId}/approve-scholar/${applicant}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
    
            if (!updateScholarResponse.ok) {
                throw new Error('Updating approved scholar failed');
            }
    
            console.log('Approved scholar updated successfully');
    
            // Create a notification
            const notificationResponse = await fetch(`/api/notification/notifications/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    applicantId: applicant, // Pass the applicant's ID as recipientId
                    senderId: currentUser._id, // Pass the current user's ID as senderId
                    scholarshipProgramId: scholarshipId // Pass the scholarship program ID
                })
            });
    
            if (!notificationResponse.ok) {
                throw new Error('Notification creation failed');
            }
    
            console.log('Notification created successfully');
    
            // Fetch updated application details to reflect the new status
            await fetchApplicationDetails();
    
            setSuccessMessage('Application approved successfully!');
            setShowSnackbar(true);
    
        } catch (error) {
            console.error('Error approving application:', error);
            setError('Failed to approve application.');
        }
    };

    const handleReject = async (applicationId, applicant) => {
        console.log(`Starting rejection process for application ID: ${applicationId}`);

        try {
            const response = await fetch(`/api/scholarshipProgram/applications/${applicationId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    applicationStatus: 'Rejected',
                    rejectionNote: rejectionNote, // Include rejection note in the request
                    allowResubmission: true // Allow applicant to resubmit the application
                })
            });

            if (!response.ok) {
                throw new Error('Rejection failed');
            }

            const data = await response.json();
            console.log('Application rejected:', data);

            // Create a notification
            const notificationResponse = await fetch(`/api/notification/notifications/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    applicantId: applicant, // Pass the applicant's ID as recipientId
                    senderId: currentUser._id, // Pass the current user's ID as senderId
                    scholarshipProgramId: application.scholarshipProgram._id, // Pass the scholarship program ID
                    message: `Your application has been rejected. Reason: ${rejectionNote}. Please update and resubmit your application.` // Notification message
                })
            });

            if (!notificationResponse.ok) {
                throw new Error('Notification creation failed');
            }

            console.log('Notification created successfully');

            // Fetch updated application details to reflect the new status
            await fetchApplicationDetails();

            setSuccessMessage('Application rejected successfully with a resubmission option.');
            setShowSnackbar(true);

        } catch (error) {
            console.error('Error rejecting application:', error);
            setError('Failed to reject application.');
        }
    };

    const closeSnackbar = () => setShowSnackbar(false);

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

    if (!application) {
        return <div>Loading...</div>;
    }

    return (
        <div className={`flex flex-col min-h-screen`}>
            <main className={`flex-grow bg-[#f8f8fb] transition-all duration-200 ease-in-out ${sidebarOpen ? 'ml-64' : ''}`}>
                <ProviderHeaderSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} currentPath={`${currentUser.scholarshipProviderDetails.organizationName} / `} />
                <div className="max-w-6xl px-24 mx-auto my-20">
                    <div className='my-8 flex gap-2 items-center font-medium'>
                        <Link
                            to="#"
                            onClick={(e) => {
                                e.preventDefault();
                                navigate(-1);
                            }}
                            className='bg-white border rounded-md px-6 py-2 shadow hover:bg-slate-200'
                        >
                            <span>{application.scholarshipProgram.title}</span>
                        </Link>
                        <IoMdArrowDropdown className='-rotate-90 text-4xl text-blue-600' />
                        <div className='bg-white border rounded-md px-6 py-2 shadow'>
                            <span className='text-blue-600 font-bold'>
                                {application.firstName} {application.lastName}
                            </span>
                        </div>
                    </div>

                    <ApplicationForm />

                    <div className="relative">
                        {application.applicationStatus === 'Approved' ? (
                            <div className="mt-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
                                This application has already been approved.
                            </div>
                        ) : application.applicationStatus === 'Rejected' ? (
                            <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
                                <p>This application has been rejected.</p>
                                {rejectionNote && (
                                    <div className="mt-2">
                                        <strong>Reason:</strong> {rejectionNote}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="mt-6 flex flex-col gap-4">
                                <textarea
                                    className="border rounded-md p-2 w-full"
                                    placeholder="Enter the reason for rejection (optional)"
                                    value={rejectionNote}
                                    onChange={(e) => setRejectionNote(e.target.value)}
                                />
                                <div className="flex justify-end gap-4">
                                    <button
                                        className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-md"
                                        onClick={() => handleApprove(application._id, application.applicant, application.scholarshipProgram._id)}
                                    >
                                        Approve
                                    </button>
                                    <button
                                        className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-md"
                                        onClick={() => handleReject(application._id, application.applicant)}
                                    >
                                        Reject with Note
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </main>

            {showSnackbar && (
                <Snackbar
                    message={successMessage}
                    onClose={closeSnackbar}
                    onAction={() =>  navigate(-1)}
                    actionText="Go to Application List"
                />
            )}
        </div>
    );
}
