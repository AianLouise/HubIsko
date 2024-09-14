import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { IoMdArrowDropdown } from "react-icons/io";
import Layout from "../../components/Layout";
import Snackbar from '../../components/Snackbar';
import ConfirmationModal from '../../components/ConfirmationModal';

export default function StudentApplicationDetails() {
    const { id } = useParams();
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const [successMessage, setSuccessMessage] = useState('');
    const [showSnackbar, setShowSnackbar] = useState(false);
    const closeSnackbar = () => setShowSnackbar(false);
    const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState('');

    const fetchStudentDetails = async () => {
        try {
            const response = await fetch(`/api/adminApp/student/${id}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setStudent(data.student);
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudentDetails();
    }, [id]);

    const handleApprove = async (studentId) => {
        try {
            const response = await fetch(`/api/adminApp/student/approve/${studentId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            console.log(`Approved student with id: ${studentId}`);
            setSuccessMessage('Application approved successfully!');
            setShowSnackbar(true);
            setIsApproveModalOpen(false);
            fetchStudentDetails(); // Refetch student details
        } catch (error) {
            console.error("Error approving student:", error);
        }
    };

    const handleReject = async (studentId) => {
        try {
            const response = await fetch(`/api/adminApp/student/reject/${studentId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ rejectReason: rejectReason })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('Decline reason updated:', data);
            setSuccessMessage('Application rejected successfully!');
            setShowSnackbar(true);
            setIsRejectModalOpen(false);
            fetchStudentDetails(); // Refetch student details
        } catch (error) {
            console.error('Error declining student:', error);
        } finally {
            handleModalClose();
        }
    };

    const handleRejectClick = () => {
        setIsRejectModalOpen(true);
    };

    const handleModalClose = () => {
        setIsRejectModalOpen(false);
        setRejectReason('');
    };

    const handleReasonChange = (e) => {
        setRejectReason(e.target.value);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!student) return <p>No student data available</p>;

    return (
        <div className="flex flex-col min-h-screen font-medium text-slate-700">
            <main className="flex-grow bg-[#f8f8fb] pb-24">
                <div className='max-w-8xl mx-auto px-24 gap-10 flex-col flex mt-16'>
                    <div className="flex gap-2 items-center">
                        <Link to={'/students'} className="border shadow px-6 py-2 bg-white rounded-md hover:bg-slate-200">
                            <span>Students</span>
                        </Link>
                        <IoMdArrowDropdown className='-rotate-90 w-8 h-8 text-blue-600' />
                        <div className="border shadow px-6 py-2 bg-white rounded-md">
                            <span className="text-blue-600">{student.name}'s Application</span>
                        </div>
                    </div>

                    <div className=" bg-white p-8 rounded-md shadow-md w-full">
                        <div className="text-lg font-bold bg-slate-200 border-2 px-4 py-2 rounded-md">Student Details</div>

                        <div className="grid grid-cols-3 gap-8 my-4 border-b pb-4">
                            <div className="">
                                <label className="block text-sm font-medium text-slate-400">Name</label>
                                <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">{student.name}</span>
                            </div>
                            <div className="">
                                <label className="block text-sm font-medium text-slate-400">Email</label>
                                <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">{student.email}</span>
                            </div>
                            <div className="">
                                <label className="block text-sm font-medium text-slate-400">Phone Number</label>
                                <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">{student.phoneNumber}</span>
                            </div>
                            <div className="">
                                <label className="block text-sm font-medium text-slate-400">Address</label>
                                <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">{student.address}</span>
                            </div>
                            <div className="">
                                <label className="block text-sm font-medium text-slate-400">City</label>
                                <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">{student.city}</span>
                            </div>
                            <div className="">
                                <label className="block text-sm font-medium text-slate-400">Province</label>
                                <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">{student.province}</span>
                            </div>
                            <div className="">
                                <label className="block text-sm font-medium text-slate-400">Region</label>
                                <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">{student.region}</span>
                            </div>
                            <div className="">
                                <label className="block text-sm font-medium text-slate-400">Barangay</label>
                                <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">{student.barangay}</span>
                            </div>
                        </div>

                        <div className="text-lg font-bold bg-slate-200 border-2 px-4 py-2 rounded-md">Documents</div>

                        <div className="grid grid-cols-3 gap-8 my-4 border-b pb-4">
                            <div className="">
                                <label className="block text-sm font-medium text-slate-400">ID Proof</label>
                                <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">{student.idProof || 'Not Provided'}</span>
                            </div>
                            <div className="">
                                <label className="block text-sm font-medium text-slate-400">Proof of Address</label>
                                <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">{student.proofOfAddress || 'Not Provided'}</span>
                            </div>
                            <div className="">
                                <label className="block text-sm font-medium text-slate-400">Other Documents</label>
                                <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">{student.otherDocuments || 'Not Provided'}</span>
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 mt-6">
                            {student.status === 'Pending Verification' && (
                                <>
                                    <button
                                        className="border shadow px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                        onClick={() => setIsApproveModalOpen(true)}
                                    >
                                        Approve
                                    </button>

                                    <ConfirmationModal
                                        isOpen={isApproveModalOpen}
                                        onClose={() => setIsApproveModalOpen(false)}
                                        onConfirm={() => handleApprove(student._id)}
                                        message="Are you sure you want to approve this student?"
                                    />

                                    <button
                                        className="border shadow px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                        onClick={() => setIsRejectModalOpen(true)}
                                    >
                                        Reject
                                    </button>

                                    <ConfirmationModal
                                        isOpen={isRejectModalOpen}
                                        onClose={() => setIsRejectModalOpen(false)}
                                        onConfirm={() => handleReject(student._id)}
                                        message="Are you sure you want to reject this student?"
                                    />
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {isRejectModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                        <h2 className="text-xl font-bold mb-4">Reason for Decline</h2>
                        <textarea
                            className="w-full p-2 border border-gray-300 rounded-md"
                            rows="4"
                            value={rejectReason}
                            onChange={handleReasonChange}
                            placeholder="What are the reasons for declining this application?"
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
                                onClick={() => handleReject(student._id)}
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
                    onAction={() => navigate('/student-applications')}
                    actionText="Go to Application List"
                />
            )}
        </div>
    );
}