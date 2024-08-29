import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { IoMdArrowDropdown } from "react-icons/io";
import Layout from "../../components/Layout";
import ScholarshipsDataDetails from "./ScholarshipsDataDetails";
import ScholarshipsDataDisplay from "./ScholarshipsDataDisplay";
import ConfirmationModal from "../../components/ConfirmationModal"; // Adjust the import path as needed
import Snackbar from "../../components/Snackbar"; // Adjust the import path as needed


export default function ScholarshipProgramApplicationDetails() {
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(true);
    const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [showSnackbar, setShowSnackbar] = useState(false);
    const closeSnackbar = () => setShowSnackbar(false);
    const [declineReason, setDeclineReason] = useState('');
    const navigate = useNavigate();

    const { id } = useParams();
    const [scholarshipDetails, setScholarshipDetails] = useState(null);

    const fetchScholarshipDetails = async () => {
        try {
            const response = await fetch(`/api/admin/scholarship-program/${id}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setScholarshipDetails(data.scholarshipProgram);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchScholarshipDetails();
    }, [id]);

    const handleNextClick = () => {
        setCurrentStep(2);
    };

    const handleVerifyClick = () => {
        setIsVerifyModalOpen(true);
    };

    const handleVerifyConfirm = async () => {
        try {
            const response = await fetch(`/api/admin/scholarships/${scholarshipDetails._id}/verify`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('Scholarship program verified successfully', data);
            setSuccessMessage('Application approved successfully!');
            setShowSnackbar(true);
            setIsVerifyModalOpen(false);
            fetchScholarshipDetails();
        } catch (error) {
            console.error('Error verifying scholarship program', error);
        }
    };

    const handleDeclineClick = () => {
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setDeclineReason('');
    };

    const handleReasonChange = (e) => {
        setDeclineReason(e.target.value);
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch(`/api/admin/scholarships/${scholarshipDetails._id}/decline/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ declineReason: declineReason })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('Decline reason updated:', data);
            setSuccessMessage('Application declined successfully!');
            setShowSnackbar(true);
            setIsVerifyModalOpen(false);
            fetchScholarshipDetails();
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        } finally {
            handleModalClose();
        }
    };

    return (
        <div className="flex flex-col min-h-screen font-medium text-slate-700">
            <Layout />
            <main className="flex-grow bg-[#f8f8fb]">
                <div className="flex gap-2 items-center max-w-8xl mx-auto px-24 mt-16 mb-10">
                    <Link to={'/scholarship-program-applications'} className="border shadow px-6 py-2 bg-white rounded-md hover:bg-slate-200">
                        <span>Scholarship Program Applications</span>
                    </Link>

                    <IoMdArrowDropdown className='-rotate-90 w-8 h-8 text-blue-600' />

                    <div className="border shadow px-6 py-2 bg-white rounded-md hover:bg-slate-200"
                        onClick={() => setCurrentStep(1)}
                    >
                        <span className={currentStep === 1 ? "text-blue-600" : ""}>
                            {scholarshipDetails?.title ? `${scholarshipDetails.title}'s Application` : "Loading..."}
                        </span>
                    </div>

                    {currentStep === 2 && (
                        <>
                            <IoMdArrowDropdown className='-rotate-90 w-8 h-8 text-blue-600' />

                            <div className="border shadow px-6 py-2 bg-white rounded-md">
                                <span className="text-blue-600">{scholarshipDetails.title}'s Scholarship Listing View</span>
                            </div>
                        </>
                    )}
                </div>

                {currentStep === 1 && (
                    <>
                        <ScholarshipsDataDetails />
                        <div className="flex justify-end gap-4 px-24 pb-10">
                            <button
                                type="button"
                                className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                                onClick={handleNextClick}
                            >
                                Next
                            </button>
                        </div>
                    </>
                )}

                {currentStep === 2 && (
                    <>
                        <ScholarshipsDataDisplay status={scholarshipDetails} />
                        {scholarshipDetails.status === "Pending Approval" && (
                            <div className="flex justify-end gap-4 px-24 pb-10">
                                <button
                                    type="button"
                                    className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-700"
                                    onClick={handleDeclineClick}
                                >
                                    Decline
                                </button>

                                <button
                                    type="button"
                                    className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-800"
                                    onClick={handleVerifyClick}
                                >
                                    Verify
                                </button>

                                <ConfirmationModal
                                    isOpen={isVerifyModalOpen}
                                    onClose={() => setIsVerifyModalOpen(false)}
                                    onConfirm={handleVerifyConfirm}
                                    message="Are you sure you want to verify this application?"
                                />
                            </div>
                        )}
                    </>
                )}
                {isModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                            <h2 className="text-xl font-bold mb-4">Reason for Decline</h2>
                            <textarea
                                className="w-full p-2 border border-gray-300 rounded-md"
                                rows="4"
                                value={declineReason}
                                onChange={handleReasonChange}
                                placeholder="What are the reasons for declining this scholarship?"
                            />
                            <div className="flex justify-end gap-4 mt-4">
                                <button
                                    type="button"
                                    className="border px-4 py-2 rounded-md hover:bg-slate-200"
                                    onClick={handleModalClose}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700"
                                    onClick={handleSubmit}
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {showSnackbar && (
                    <Snackbar
                        message={successMessage}
                        onClose={closeSnackbar}
                        onAction={() => navigate('/scholarship-program-applications')}
                        actionText="Go to Application List"
                    />
                )}
            </main>
        </div>
    );
}