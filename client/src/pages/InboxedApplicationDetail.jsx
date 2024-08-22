import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from "../components/Header";
import Footer from "../components/Footer";
import { IoMdArrowDropdown } from 'react-icons/io';

export default function InboxedApplicationDetail() {

    const [showModal, setShowModal] = useState(false);

    const toggleModal = () => {
        setShowModal(!showModal);
    }

    const closeModal = () => {
        setShowModal(false);
    }

    const currentUser = useSelector((state) => state.user.currentUser);
    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);
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

    const getStatusClass = (status) => {
        switch (status) {
            case 'Approved':
                return 'bg-green-100 border-green-400 text-green-700';
            case 'Pending':
                return 'bg-yellow-100 border-yellow-400 text-yellow-700';
            case 'Rejected':
                return 'bg-red-100 border-red-400 text-red-700';
            default:
                return 'bg-blue-100 border-blue-400 text-blue-700';
        }
    };

    if (!application || !currentUser) {
        return (
            <div className="flex justify-center items-center h-screen">
                <svg className="animate-spin h-10 w-10 text-blue-600" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
            </div>
        );
    }

    return (
        <div className='flex flex-col min-h-screen'>
            <Header />
            <main className="flex-grow bg-[#f8f8fb] font-medium">
                <div className="max-w-6xl px-24 mx-auto my-20">
                    
                    <div className='my-8 flex gap-2 items-center'>
                    <Link to={'/application-box'} className='bg-white border rounded-md px-6 py-2 shadow hover:bg-slate-200'>
                     <span>Inbox</span>
                    </Link>

                           <IoMdArrowDropdown className='-rotate-90 text-4xl text-blue-600' />

                    <div className='bg-white border rounded-md px-6 py-2 shadow'>
                    <span className='text-blue-600'>{application.scholarshipProgram.title}</span>
                    </div>
                    </div>

                    <div className="border shadow rounded-md h-auto p-10">
                        <div className="flex justify-between items-center">
                            <span className="text-2xl">Submitted details for: <span className='text-blue-600 font-bold'>{application.scholarshipProgram.title}</span></span>
                            <Link to="/edit-documents">
                                <button className="border bg-blue-600 rounded-md px-4 py-2 text-white hover:bg-blue-800">Edit</button>
                            </Link>
                        </div>
                        <div className="mt-4">
                            {/* Application Status */}
                            <div className={`border px-4 py-3 rounded relative mb-4 ${getStatusClass(application.applicationStatus)}`} role="alert">
                                <strong className="font-bold">Application Status:</strong>
                                <span className="block sm:inline"> {application.applicationStatus}</span>
                            </div>

                            <div className="mt-4 p-4 py-6 bg-white border shadow rounded">
                                <div className="mb-4">
                                    <p className="text-lg font-semibold"><strong>Applicant Name:</strong> {`${application.firstName} ${application.middleName} ${application.lastName}`}</p>
                                    {/* <p><strong>Email:</strong> {application.email}</p> */}
                                    <p className="text-sm text-gray-600"><strong>Submitted Date:</strong> {new Date(application.createdAt).toLocaleDateString()}</p>
                                </div>

                                {/* Personal Details */}
                                <div className="mb-4">
                                    <h3 className="text-md text-blue-600 font-bold mb-2 border-b">Personal Details</h3>
                                    <div className="px-4 pt-2 rounded-lg space-y-1">
                                        <p className="text-sm"><strong>Birthdate:</strong> {application.birthdate}</p>
                                        <p className="text-sm"><strong>Gender:</strong> {application.gender}</p>
                                        <p className="text-sm"><strong>Blood Type:</strong> {application.bloodType}</p>
                                        <p className="text-sm"><strong>Civil Status:</strong> {application.civilStatus}</p>
                                        {application.civilStatus === 'Married' && (
                                            <div>
                                                <p className="text-sm"><strong>Maiden Name:</strong> {application.maidenName}</p>
                                                <p className="text-sm"><strong>Spouse Name:</strong> {application.spouseName}</p>
                                                <p className="text-sm"><strong>Spouse Occupation:</strong> {application.spouseOccupation}</p>
                                            </div>
                                        )}
                                        <p className="text-sm"><strong>Religion:</strong> {application.religion}</p>
                                        <p className="text-sm"><strong>Height:</strong> {application.height}</p>
                                        <p className="text-sm"><strong>Weight:</strong> {application.weight}</p>
                                        <p className="text-sm"><strong>Birthplace:</strong> {application.birthplace}</p>
                                        <p className="text-sm"><strong>Contact Number:</strong> {application.contactNumber}</p>
                                        <p className="text-sm"><strong>Address:</strong> {`${application.address}, ${application.barangay}, ${application.town}, ${application.province}`}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Education Details */}
                            <div className="mt-4 p-4 py-6 bg-white shadow border rounded">
                                <div className="my-2">
                                    <h3 className="text-md text-blue-600 font-bold mb-2 border-b">Educational Background</h3>
                                    <div className="px-4 pt-2 rounded-lg space-y-1">
                                        <p className="text-sm mb-2"><strong>Elementary:</strong> {application.education?.elementary?.school} ({application.education?.elementary?.yearGraduated})</p>
                                        <p className="text-sm mb-2"><strong>Junior High School:</strong> {application.education?.juniorHighSchool?.school} ({application.education?.juniorHighSchool?.yearGraduated})</p>
                                        <p className="text-sm mb-2"><strong>Senior High School:</strong> {application.education?.seniorHighSchool?.school} ({application.education?.seniorHighSchool?.yearGraduated})</p>
                                        <p className="text-sm"><strong>College:</strong> {application.education?.college?.school} - {application.education?.college?.course}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 p-4 py-6 bg-white shadow rounded border">
                                <div className="my-2">
                                    <h3 className="text-md text-blue-600 font-bold mb-2 border-b">Family Details</h3>
                                    <div className="px-4 pt-2 rounded-lg shadow-s">
                                        <p className="text-sm mb-2"><strong>Father:</strong> {`${application.father?.firstName} ${application.father?.middleName} ${application.father?.lastName}`} (Occupation: {application.father?.occupation})</p>
                                        <p className="text-sm mb-2"><strong>Mother:</strong> {`${application.mother?.firstName} ${application.mother?.middleName} ${application.mother?.lastName}`} (Occupation: {application.mother?.occupation})</p>
                                        <p className="text-sm"><strong>Guardian:</strong> {application.guardian ? `${application.guardian?.firstName} ${application.guardian?.middleName} ${application.guardian?.lastName}` : "N/A"}</p>
                                    </div>
                                </div>
                            </div>

                            {application.workExperience && application.workExperience.length > 0 && (
                                <div className="mt-4 p-4 bg-white border shadow rounded">
                                    <div className="my-2">
                                        <h3 className="text-md text-blue-600 font-bold mb-2 border-b">Work Experiences</h3>
                                        <div className="px-4 pt-2 rounded-lg">
                                            {application.workExperience.map((item, index) => (
                                                (item.companyName || item.position || item.startDate || item.monthlySalary || item.statusOfAppointment) && (
                                                    <div key={index} className="mb-4">
                                                        {item.companyName && <p className="text-sm mb-2"><strong>Company Name:</strong> {item.companyName}</p>}
                                                        {item.position && <p className="text-sm mb-2"><strong>Position:</strong> {item.position}</p>}
                                                        {item.startDate && <p className="text-sm mb-2"><strong>Start Date:</strong> {item.startDate}</p>}
                                                        {item.monthlySalary && <p className="text-sm mb-2"><strong>Monthly Salary:</strong> {item.monthlySalary}</p>}
                                                        {item.statusOfAppointment && <p className="text-sm"><strong>Status of Appointment:</strong> {item.statusOfAppointment}</p>}
                                                    </div>
                                                )
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {application.skillsAndQualifications && application.skillsAndQualifications.length > 0 && (
                                <div className="mt-4 p-4 bg-white border shadow rounded">
                                    <div className="my-2">
                                        <h3 className="text-md text-blue-600 font-bold mb-2 border-b">Skills and Qualifications</h3>
                                        <div className="px-4 pt-2 rounded-lg">
                                            {application.skillsAndQualifications.map((item, index) => (
                                                (item.skills || item.qualifications) && (
                                                    <div key={index} className="mb-4">
                                                        {item.skills && <p className="text-sm mb-2"><strong>Skills:</strong> {item.skills}</p>}
                                                        {item.qualifications && <p className="text-sm mb-2"><strong>Qualifications:</strong> {item.qualifications}</p>}
                                                    </div>
                                                )
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="mt-4 p-4 bg-white shadow rounded">
                                <div className="my-2">
                                    <h3 className="text-md text-blue-600 font-bold mb-2 border-b">Documents</h3>
                                    <div className="px-4 pt-2 rounded-lg shadow-sm">
                                        <p className="text-sm mb-2"><strong>Identification Card:</strong> {application.documents?.identificationCard}</p>
                                        <p className="text-sm mb-2"><strong>Proof of Address:</strong> {application.documents?.proofOfAddress}</p>
                                        <p className="text-sm mb-2"><strong>Academic Transcripts:</strong> {application.documents?.academicTranscripts}</p>
                                        <p className="text-sm"><strong>Passport Photo:</strong> {application.documents?.passportPhoto}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main >
            <Footer />

            {/* {
                showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto bg-gray-900 bg-opacity-50">
                        <div className="bg-white flex-col gap-2 flex text-left p-8 w-1/4 shadow rounded-md border">
                            <h1 className='text-2xl text-center font-bold text-blue-600'>Request to Review?</h1>
                            <span className='text-md text-slate-600 text-center'>
                                After you request a review you'll have to <span className="text-blue-600">wait after 1 week</span> to request again.
                            </span>
                            <div className="justify-between w-full flex gap-2 font-medium mt-4">
                                <button onClick={closeModal} className="border rounded-md w-full py-2 hover:bg-slate-200">Cancel</button>
                                <button onClick={closeModal} className="bg-blue-600 text-white rounded-md w-full hover:bg-blue-800">Request</button>
                            </div>
                        </div>
                    </div>
                )
            } */}
        </div >
    )
}
