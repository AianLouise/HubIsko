import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useTokenExpiry from '../hooks/useTokenExpiry'; // Adjust the import path
import { regions, provinces, cities, barangays } from 'select-philippines-address';
import Modal from 'react-modal';
import ImageModal from '../components/AdminImageModal';

export default function ApplicationForm() {
    useTokenExpiry();

    const navigate = useNavigate();
    const { currentUser } = useSelector((state) => state.user);

    const toggleModal = () => {
        setShowModal(!showModal);
    }

    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id: applicationId } = useParams(); // Extract applicationId from the URL
    const [regionName, setRegionName] = useState('');
    const [provinceName, setProvinceName] = useState('');
    const [cityName, setCityName] = useState('');
    const [barangayName, setBarangayName] = useState('');

    useEffect(() => {
        const fetchApplicationDetails = async () => {
            try {
                const response = await fetch(`/api/scholarshipApplication/get-applications-details/${applicationId}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setApplication(data);
                console.log(data);
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
            case 'Rejected':
                return 'bg-red-100 border-red-400 text-red-700';
            case 'Pending':
                return 'bg-yellow-100 border-yellow-400 text-yellow-700';
            default:
                return '';
        }
    };

    useEffect(() => {
        if (application && application.applicant.applicantDetails.address.region) {
            regions().then((regionList) => {
                const region = regionList.find((r) => r.region_code === application.applicant.applicantDetails.address.region);
                setRegionName(region ? region.region_name : '');
            });
        }
    }, [application]);

    useEffect(() => {
        if (application && application.applicant.applicantDetails.address.province) {
            provinces(application.applicant.applicantDetails.address.region).then((provinceList) => {
                const province = provinceList.find((p) => p.province_code === application.applicant.applicantDetails.address.province);
                setProvinceName(province ? province.province_name : '');
            });
        }
    }, [application]);

    useEffect(() => {
        if (application && application.applicant.applicantDetails.address.city) {
            cities(application.applicant.applicantDetails.address.province).then((cityList) => {
                const city = cityList.find((c) => c.city_code === application.applicant.applicantDetails.address.city);
                setCityName(city ? city.city_name : '');
            });
        }
    }, [application]);

    useEffect(() => {
        if (application && application.applicant.applicantDetails.address.barangay) {
            barangays(application.applicant.applicantDetails.address.city).then((barangayList) => {
                const barangay = barangayList.find((b) => b.brgy_code === application.applicant.applicantDetails.address.barangay);
                setBarangayName(barangay ? barangay.brgy_name : '');
            });
        }
    }, [application]);

    const [showModal, setShowModal] = useState(false);

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const handleResubmit = () => {
        closeModal();
        navigate(`/resubmit-application/${application._id}`); // Navigate to the resubmit application page
    };

    const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState({ name: '', url: '' });

    const openDocumentModal = (name, url) => {
        setSelectedDocument({ name, url });
        setIsDocumentModalOpen(true);
    };

    const closeDocumentModal = () => {
        setIsDocumentModalOpen(false);
        setSelectedDocument({ name: '', url: '' });
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
        <div>
            <div className="border shadow rounded-md h-auto p-4 sm:p-10 bg-white">
                <div className="flex justify-between items-center">
                    <span className="text-2xl">Submitted details for: <span className='text-blue-600 font-bold'>{application.scholarshipProgram.title}</span></span>
                </div>
                <div className="mt-4">
                    {/* Application Status */}
                    <div className={`border px-4 py-3 rounded relative mb-4 ${getStatusClass(application.applicationStatus)}`} role="alert">
                        <strong className="font-bold">Application Status:</strong>
                        <span className="block sm:inline"> {application.applicationStatus}</span>
                    </div>

                    {application.applicationStatus === 'Rejected' && (
                        <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
                            {currentUser.role === 'applicant' ? (
                                <p>Your application has been rejected.</p>
                            ) : currentUser.role === 'scholarship_provider' ? (
                                <p>The application has been rejected.</p>
                            ) : null}
                            {application.rejectionNote && (
                                <div className="mt-2">
                                    <strong>Reason:</strong> {application.rejectionNote}
                                </div>
                            )}
                            {application.allowResubmission && (
                                <div className="mt-2">
                                    {currentUser.role === 'applicant' ? (
                                        <p><strong>Note:</strong> You are allowed to resubmit your application.</p>
                                    ) : currentUser.role === 'scholarship_provider' ? (
                                        <p><strong>Note:</strong> The applicant is allowed to resubmit their application.</p>
                                    ) : null}
                                </div>
                            )}
                            {currentUser.role === 'applicant' && application.allowResubmission && (
                                <button
                                    className="mt-4 bg-blue-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-blue-800"
                                    onClick={handleResubmit}
                                >
                                    Resubmit Application
                                </button>
                            )}
                        </div>
                    )}

                    <div className="mt-4 p-2 sm:p-4 py-6">
                        <div>
                            <p className="text-lg font-semibold">
                                <strong>Name:</strong> {`${application.applicant.applicantDetails.lastName}, ${application.applicant.applicantDetails.firstName} ${application.applicant.applicantDetails.middleName}`}
                            </p>
                            <p><strong>Email:</strong> {application.applicant.email}</p>
                            <p className="text-sm text-gray-600"><strong>Submitted Date:</strong> {new Date(application.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>

                    {/* Personal Details */}
                    <div className="p-2 sm:p-4 py-6">
                        <h3 className="text-md text-blue-600 font-bold mb-2 border-b">Personal Details</h3>
                        <div className="px-2 sm:px-4 pt-2 rounded-lg space-y-1">
                            <p className="text-sm"><strong>Birthdate:</strong> {application.applicant.applicantDetails.birthdate}</p>
                            <p className="text-sm"><strong>Gender:</strong> {application.applicant.applicantDetails.gender}</p>
                            <p className="text-sm"><strong>Blood Type:</strong> {application.applicant.applicantDetails.bloodType}</p>
                            <p className="text-sm"><strong>Civil Status:</strong> {application.applicant.applicantDetails.civilStatus}</p>
                            {application.applicant.applicantDetails.civilStatus === 'Married' && (
                                <div>
                                    <p className="text-sm"><strong>Maiden Name:</strong> {application.applicant.applicantDetails.maidenName}</p>
                                    <p className="text-sm"><strong>Spouse Name:</strong> {application.applicant.applicantDetails.spouseName}</p>
                                    <p className="text-sm"><strong>Spouse Occupation:</strong> {application.applicant.applicantDetails.spouseOccupation}</p>
                                </div>
                            )}
                            <p className="text-sm"><strong>Religion:</strong> {application.applicant.applicantDetails.religion}</p>
                            <p className="text-sm"><strong>Height:</strong> {application.applicant.applicantDetails.height}</p>
                            <p className="text-sm"><strong>Weight:</strong> {application.applicant.applicantDetails.weight}</p>
                            <p className="text-sm"><strong>Birthplace:</strong> {application.applicant.applicantDetails.birthplace}</p>
                            <p className="text-sm"><strong>Contact Number:</strong> {application.applicant.applicantDetails.contactNumber}</p>
                            <p className="text-sm">
                                <strong>Address:</strong> {`${application.applicant.applicantDetails.address.addressDetails}, ${barangayName}, ${cityName}, ${provinceName}, ${regionName}`}
                            </p>
                        </div>
                    </div>

                    {/* Education Details */}
                    <div className="p-2 sm:p-4 py-6">
                        <div className="my-2">
                            <h3 className="text-md text-blue-600 font-bold mb-2 border-b">Educational Background</h3>
                            <div className="px-2 sm:px-4 pt-2 rounded-lg space-y-1">
                                <p className="text-sm mb-2"><strong>Elementary:</strong> {application.applicant.applicantDetails.education?.elementary?.school} ({application.applicant.applicantDetails.education?.elementary?.yearGraduated})</p>
                                <p className="text-sm mb-2"><strong>Junior High School:</strong> {application.applicant.applicantDetails.education?.juniorHighSchool?.school} ({application.applicant.applicantDetails.education?.juniorHighSchool?.yearGraduated})</p>
                                <p className="text-sm mb-2"><strong>Senior High School:</strong> {application.applicant.applicantDetails.education?.seniorHighSchool?.school} ({application.applicant.applicantDetails.education?.seniorHighSchool?.yearGraduated})</p>
                                <p className="text-sm"><strong>College:</strong> {application.applicant.applicantDetails.education?.college?.school} - {application.applicant.applicantDetails.education?.college?.course}</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-2 sm:p-4 py-6">
                        <div className="my-2">
                            <h3 className="text-md text-blue-600 font-bold mb-2 border-b">Family Details</h3>
                            <div className="px-2 sm:px-4 pt-2 rounded-lg shadow-s">
                                {application.guardian.firstName && !application.father.firstName && !application.mother.firstName ? (
                                    <p className="text-sm">
                                        <strong>Guardian:</strong> {`${application.guardian.firstName} ${application.guardian.middleName} ${application.guardian.lastName}`} (Occupation: {application.guardian.occupation})
                                    </p>
                                ) : (
                                    <>
                                        {application.father.firstName && (
                                            <p className="text-sm mb-2">
                                                <strong>Father:</strong> {`${application.father.firstName} ${application.father.middleName} ${application.father.lastName}`} (Occupation: {application.father.occupation})
                                            </p>
                                        )}
                                        {application.mother.firstName && (
                                            <p className="text-sm mb-2">
                                                <strong>Mother:</strong> {`${application.mother.firstName} ${application.mother.middleName} ${application.mother.lastName}`} (Occupation: {application.mother.occupation})
                                            </p>
                                        )}
                                    </>
                                )}
                                {!application.father.firstName && !application.mother.firstName && !application.guardian.firstName && (
                                    <p className="text-sm">No family details available.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {application.workExperience && application.workExperience.length > 0 && (
                        <div className="p-2 sm:p-4">
                            <div className="my-2">
                                <h3 className="text-md text-blue-600 font-bold mb-2 border-b">Work Experiences</h3>
                                <div className="px-2 sm:px-4 pt-2 rounded-lg">
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
                        <div className="p-2 sm:p-4">
                            <div className="my-2">
                                <h3 className="text-md text-blue-600 font-bold mb-2 border-b">Skills and Qualifications</h3>
                                <div className="px-2 sm:px-4 pt-2 rounded-lg">
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

                    <div className="p-2 sm:p-4">
                        <div className="my-2">
                            <h3 className="text-md text-blue-600 font-bold mb-2 border-b">Documents</h3>
                            <div className="px-2 sm:px-4 pt-2">
                                {application.documents && Object.entries(application.documents).map(([key, value], index) => (
                                    <div key={index} className="flex items-center mb-2">
                                        <strong className="w-1/3 text-sm">{key.replace(/_/g, ' ')}:</strong>
                                        <div className="w-2/3 flex justify-end items-center">
                                            <button
                                                onClick={() => openDocumentModal(key, value)}
                                                className="ml-2 bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 text-xs"
                                            >
                                                View Document
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <ImageModal
                            isOpen={isDocumentModalOpen}
                            onClose={closeDocumentModal}
                            imageUrl={selectedDocument.url}
                            documentName={selectedDocument.name}
                        />
                    </div>

                    {/* Modal for resubmission confirmation */}
                    <Modal
                        isOpen={showModal}
                        onRequestClose={closeModal}
                        contentLabel="Request Resubmission"
                        className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto bg-gray-900 bg-opacity-50"
                        overlayClassName="fixed inset-0 bg-gray-900 bg-opacity-50"
                    >
                        <div className="bg-white flex-col gap-2 flex text-left p-8 w-1/4 shadow rounded-md border">
                            <h1 className='text-2xl text-center font-bold text-blue-600'>Request to Resubmit?</h1>
                            <span className='text-md text-slate-600 text-center'>
                                After you request a resubmission, you will need to update your application and submit it again.
                            </span>
                            <div className="justify-between w-full flex gap-2 font-medium mt-4">
                                <button onClick={closeModal} className="border rounded-md w-full py-2 hover:bg-slate-200">Cancel</button>
                                <button onClick={handleResubmit} className="bg-blue-600 text-white rounded-md w-full hover:bg-blue-800">Request Resubmission</button>
                            </div>
                        </div>
                    </Modal>
                </div>
            </div>
        </div>
    )
}