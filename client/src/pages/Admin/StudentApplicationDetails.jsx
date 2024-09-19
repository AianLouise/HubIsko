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

    if (loading)  return (
        <div className="flex justify-center items-center h-screen">
            <svg className="animate-spin h-10 w-10 text-blue-600" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
        </div>
    );
    if (error) return <p>Error: {error}</p>;
    if (!student) return <p>No student data available</p>;

    return (
        <div className="flex flex-col min-h-screen  text-slate-700">
            <main className="flex-grow bg-[#f8f8fb] pb-24">
                <div className='max-w-8xl mx-auto px-24 flex-col flex mt-16'>
                    <div className="flex gap-2 items-center font-medium">
                        <Link to={'/student-applications'} className="border shadow px-6 py-2 bg-white rounded-md hover:bg-slate-200">
                            <span>Student Applications</span>
                        </Link>
                        <IoMdArrowDropdown className='-rotate-90 w-8 h-8 text-blue-600' />
                        <div className="border shadow px-6 py-2 bg-white rounded-md">
                            <span className="text-blue-600">{student?.applicantDetails?.firstName} {student?.applicantDetails?.lastName}'s Application</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-10 p-8 w-full">

                        <div className="flex flex-col bg-white border p-4 py-6 rounded-md shadow">
                        <div className="text-lg font-bold bg-blue-500 text-white px-4 py-2 rounded-md">Student Details</div>
                        <div className="grid grid-cols-4 gap-5 my-4 py-4 px-8">
                            <div className="">
                                <label className="block text-sm  text-slate-400">First Name</label>
                                <span className="mt-1 block px-3 font-medium bg-slate-100 py-2 border border-gray-300 rounded-md">{student?.applicantDetails?.firstName}</span>
                            </div>
                            <div className="">
                                <label className="block text-sm  text-slate-400">Middle Name</label>
                                <span className="mt-1 block px-3 font-medium bg-slate-100 py-2 border border-gray-300 rounded-md">{student?.applicantDetails?.middleName}</span>
                            </div>
                            <div className="">
                                <label className="block text-sm  text-slate-400">Last Name</label>
                                <span className="mt-1 block px-3 font-medium bg-slate-100 py-2 border border-gray-300 rounded-md">{student?.applicantDetails?.lastName}</span>
                            </div>
                            <div className="">
                                <label className="block text-sm  text-slate-400">Name Extension</label>
                                <span className="mt-1 block px-3 font-medium bg-slate-100 py-2 border border-gray-300 rounded-md">{student?.applicantDetails?.nameExtension}</span>
                            </div>
                            <div className="">
                                <label className="block text-sm  text-slate-400">Birthdate</label>
                                <span className="mt-1 block px-3 font-medium bg-slate-100 py-2 border border-gray-300 rounded-md">{student?.applicantDetails?.birthdate}</span>
                            </div>
                            <div className="">
                                <label className="block text-sm  text-slate-400">Gender</label>
                                <span className="mt-1 block px-3 font-medium bg-slate-100 py-2 border border-gray-300 rounded-md">{student?.applicantDetails?.gender}</span>
                            </div>
                            <div className="">
                                <label className="block text-sm  text-slate-400">Blood Type</label>
                                <span className="mt-1 block px-3 font-medium bg-slate-100 py-2 border border-gray-300 rounded-md">{student?.applicantDetails?.bloodType}</span>
                            </div>
                            <div className="">
                                <label className="block text-sm  text-slate-400">Civil Status</label>
                                <span className="mt-1 block px-3 font-medium bg-slate-100 py-2 border border-gray-300 rounded-md">{student?.applicantDetails?.civilStatus}</span>
                            </div>
                            <div className="">
                                <label className="block text-sm  text-slate-400">Maiden Name</label>
                                <span className="mt-1 block px-3 font-medium bg-slate-100 py-2 border border-gray-300 rounded-md">{student?.applicantDetails?.maidenName}</span>
                            </div>
                            <div className="">
                                <label className="block text-sm  text-slate-400">Spouse Name</label>
                                <span className="mt-1 block px-3 font-medium bg-slate-100 py-2 border border-gray-300 rounded-md">{student?.applicantDetails?.spouseName}</span>
                            </div>
                            <div className="">
                                <label className="block text-sm  text-slate-400">Spouse Occupation</label>
                                <span className="mt-1 block px-3 font-medium bg-slate-100 py-2 border border-gray-300 rounded-md">{student?.applicantDetails?.spouseOccupation}</span>
                            </div>
                            <div className="">
                                <label className="block text-sm  text-slate-400">Religion</label>
                                <span className="mt-1 block px-3 font-medium bg-slate-100 py-2 border border-gray-300 rounded-md">{student?.applicantDetails?.religion}</span>
                            </div>
                            <div className="">
                                <label className="block text-sm  text-slate-400">Height</label>
                                <span className="mt-1 block px-3 font-medium bg-slate-100 py-2 border border-gray-300 rounded-md">{student?.applicantDetails?.height}</span>
                            </div>
                            <div className="">
                                <label className="block text-sm  text-slate-400">Weight</label>
                                <span className="mt-1 block px-3 font-medium bg-slate-100 py-2 border border-gray-300 rounded-md">{student?.applicantDetails?.weight}</span>
                            </div>
                            <div className="">
                                <label className="block text-sm  text-slate-400">Birthplace</label>
                                <span className="mt-1 block px-3 font-medium bg-slate-100 py-2 border border-gray-300 rounded-md">{student?.applicantDetails?.birthplace}</span>
                            </div>
                            <div className="">
                                <label className="block text-sm  text-slate-400">Contact Number</label>
                                <span className="mt-1 block px-3 font-medium bg-slate-100 py-2 border border-gray-300 rounded-md">{student?.applicantDetails?.contactNumber}</span>
                            </div>
                        </div>
                        </div>


                        <div className="flex flex-col bg-white border p-4 py-6 rounded-md shadow">
                        <div className="text-lg font-bold bg-blue-500 text-white px-4 py-2 rounded-md">Address</div>
                        <div className="grid grid-cols-3 gap-8 my-4 py-4 px-8">
                            <div className="">
                                <label className="block text-sm  text-slate-400">Region</label>
                                <span className="mt-1 block px-3 font-medium bg-slate-100 py-2 border border-gray-300 rounded-md">{student?.applicantDetails?.address?.region}</span>
                            </div>
                            <div className="">
                                <label className="block text-sm  text-slate-400">Province</label>
                                <span className="mt-1 block px-3 font-medium bg-slate-100 py-2 border border-gray-300 rounded-md">{student?.applicantDetails?.address?.province}</span>
                            </div>
                            <div className="">
                                <label className="block text-sm  text-slate-400">City</label>
                                <span className="mt-1 block px-3 font-medium bg-slate-100 py-2 border border-gray-300 rounded-md">{student?.applicantDetails?.address?.city}</span>
                            </div>
                            <div className="">
                                <label className="block text-sm  text-slate-400">Barangay</label>
                                <span className="mt-1 block px-3 font-medium bg-slate-100 py-2 border border-gray-300 rounded-md">{student?.applicantDetails?.address?.barangay}</span>
                            </div>
                            <div className="">
                                <label className="block text-sm  text-slate-400">Address Details</label>
                                <span className="mt-1 block px-3 font-medium bg-slate-100 py-2 border border-gray-300 rounded-md">{student?.applicantDetails?.address?.addressDetails}</span>
                            </div>
                        </div>
                        </div>

                        
                        <div className="flex flex-col bg-white border p-4 py-6 rounded-md shadow">
                        <div className="text-lg font-bold bg-blue-500 text-white px-4 py-2 rounded-md">Education</div>
                        <div className="grid grid-cols-3 gap-8 my-4 py-4 px-8">
                            <div className="">
                                <label className="block text-sm  text-slate-400">College Course</label>
                                <span className="mt-1 block px-3 font-medium bg-slate-100 py-2 border border-gray-300 rounded-md">{student.applicantDetails.education.college.course}</span>
                            </div>
                            <div className="">
                                <label className="block text-sm  text-slate-400">College School</label>
                                <span className="mt-1 block px-3 font-medium bg-slate-100 py-2 border border-gray-300 rounded-md">{student.applicantDetails.education.college.school}</span>
                            </div>
                            <div className="">
                                <label className="block text-sm  text-slate-400">Elementary Award</label>
                                <span className="mt-1 block px-3 font-medium bg-slate-100 py-2 border border-gray-300 rounded-md">{student.applicantDetails.education.elementary.award}</span>
                            </div>
                            <div className="">
                                <label className="block text-sm  text-slate-400">Elementary School</label>
                                <span className="mt-1 block px-3 font-medium bg-slate-100 py-2 border border-gray-300 rounded-md">{student.applicantDetails.education.elementary.school}</span>
                            </div>
                            <div className="">
                                <label className="block text-sm  text-slate-400">Elementary Year Graduated</label>
                                <span className="mt-1 block px-3 font-medium bg-slate-100 py-2 border border-gray-300 rounded-md">{student.applicantDetails.education.elementary.yearGraduated}</span>
                            </div>
                            <div className="">
                                <label className="block text-sm  text-slate-400">Junior High School Award</label>
                                <span className="mt-1 block px-3 font-medium bg-slate-100 py-2 border border-gray-300 rounded-md">{student.applicantDetails.education.juniorHighSchool.award}</span>
                            </div>
                            <div className="">
                                <label className="block text-sm  text-slate-400">Junior High School School</label>
                                <span className="mt-1 block px-3 font-medium bg-slate-100 py-2 border border-gray-300 rounded-md">{student.applicantDetails.education.juniorHighSchool.school}</span>
                            </div>
                            <div className="">
                                <label className="block text-sm  text-slate-400">Junior High School Year Graduated</label>
                                <span className="mt-1 block px-3 font-medium bg-slate-100 py-2 border border-gray-300 rounded-md">{student.applicantDetails.education.juniorHighSchool.yearGraduated}</span>
                            </div>
                            <div className="">
                                <label className="block text-sm  text-slate-400">Senior High School Award</label>
                                <span className="mt-1 block px-3 font-medium bg-slate-100 py-2 border border-gray-300 rounded-md">{student.applicantDetails.education.seniorHighSchool.award}</span>
                            </div>
                            <div className="">
                                <label className="block text-sm  text-slate-400">Senior High School School</label>
                                <span className="mt-1 block px-3 font-medium bg-slate-100 py-2 border border-gray-300 rounded-md">{student.applicantDetails.education.seniorHighSchool.school}</span>
                            </div>
                            <div className="">
                                <label className="block text-sm  text-slate-400">Senior High School Year Graduated</label>
                                <span className="mt-1 block px-3 font-medium bg-slate-100 py-2 border border-gray-300 rounded-md">{student.applicantDetails.education.seniorHighSchool.yearGraduated}</span>
                            </div>
                        </div>
                        </div>

                        <div className="flex flex-col bg-white border p-4 py-6 rounded-md shadow">
                        <div className="text-lg font-bold bg-blue-500 text-white px-4 py-2 rounded-md">Documents</div>
                        <div className="grid grid-cols-3 gap-8 my-4 py-4 px-8">
                            <div className="">
                                <label className="block text-sm  text-slate-400">Student ID File</label>
                                <a href={student.applicantDetails.studentIdFile} target="_blank" rel="noopener noreferrer" className="mt-1 block px-3 font-medium bg-slate-100 hover:bg-slate-200 py-2 border border-gray-300 rounded-md text-blue-600">View Document</a>
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