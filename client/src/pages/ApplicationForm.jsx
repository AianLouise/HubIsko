import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useTokenExpiry from '../hooks/useTokenExpiry'; // Adjust the import path
import { regions, provinces, cities, barangays } from 'select-philippines-address';
import Modal from 'react-modal';

export default function ApplicationForm() {
    useTokenExpiry();

    const navigate = useNavigate();
    const { currentUser } = useSelector((state) => state.user);

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
    }; if (!application || !currentUser) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex justify-center items-center">
                <div className="text-center">
                    <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    <p className="text-gray-600">Loading application details...</p>
                </div>
            </div>
        );
    } return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <style>
                {`
                    @media print {
                        body {
                            font-size: 10px;
                        }
                        .text-md {
                            font-size: 12px;
                        }
                        .text-lg {
                            font-size: 14px;
                        }
                        .text-xl {
                            font-size: 16px;
                        }
                        .text-2xl {
                            font-size: 18px;
                        }
                    }
                `}
            </style>

            {/* Hero Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-6 md:py-8 lg:py-12 rounded-xl mb-6 md:mb-8">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <h1 className="text-xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-4">
                            Application Details
                        </h1>
                        <p className="text-sm md:text-lg text-blue-100 mb-4">
                            Submitted details for: <span className='font-bold text-white'>{application.scholarshipProgram.title}</span>
                        </p>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 md:p-4 border border-white/20">
                                <div className="text-lg md:text-2xl font-bold">Application</div>
                                <div className="text-blue-100 text-xs md:text-sm">Status: {application.applicationStatus}</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 md:p-4 border border-white/20">
                                <div className="text-lg md:text-2xl font-bold">Submitted</div>
                                <div className="text-blue-100 text-xs md:text-sm">{new Date(application.createdAt).toLocaleDateString()}</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 md:p-4 border border-white/20">
                                <div className="text-lg md:text-2xl font-bold">Documents</div>
                                <div className="text-blue-100 text-xs md:text-sm">{Object.keys(application.documents || {}).length} Files</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="p-4 md:p-6 lg:p-8">
                    <div id="scholar-details" className="space-y-6 md:space-y-8">
                        {/* Application Status */}
                        <div className={`border-l-4 px-4 md:px-6 py-4 rounded-r-lg ${getStatusClass(application.applicationStatus)}`} role="alert">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                                <div>
                                    <strong className="font-bold text-sm md:text-base">Application Status:</strong>
                                    <span className="block sm:inline text-sm md:text-base ml-0 sm:ml-2">{application.applicationStatus}</span>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-xs md:text-sm font-medium ${getStatusClass(application.applicationStatus)}`}>
                                    {application.applicationStatus}
                                </div>
                            </div>
                        </div>
                        {application.applicationStatus === 'Rejected' && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-4 md:p-6">
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0">
                                        <svg className="w-5 h-5 text-red-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-red-800 font-semibold text-sm md:text-base mb-2">Application Rejected</h3>
                                        {currentUser.role === 'applicant' ? (
                                            <p className="text-red-700 text-sm md:text-base">Your application has been rejected.</p>
                                        ) : currentUser.role === 'scholarship_provider' ? (
                                            <p className="text-red-700 text-sm md:text-base">The application has been rejected.</p>
                                        ) : null}
                                        {application.rejectionNote && (
                                            <div className="mt-3 p-3 bg-red-100 rounded-lg">
                                                <strong className="text-red-800 text-sm">Reason:</strong>
                                                <p className="text-red-700 text-sm mt-1">{application.rejectionNote}</p>
                                            </div>
                                        )}
                                        {application.allowResubmission && (
                                            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                                                {currentUser.role === 'applicant' ? (
                                                    <p className="text-blue-800 text-sm"><strong>Good news:</strong> You are allowed to resubmit your application.</p>
                                                ) : currentUser.role === 'scholarship_provider' ? (
                                                    <p className="text-blue-800 text-sm"><strong>Note:</strong> The applicant is allowed to resubmit their application.</p>
                                                ) : null}
                                            </div>
                                        )}
                                        {currentUser.role === 'applicant' && application.allowResubmission && (
                                            <button
                                                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 md:px-6 py-2 md:py-3 rounded-lg transition-colors duration-200 text-sm md:text-base"
                                                onClick={handleResubmit}
                                            >
                                                Resubmit Application
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}                        {/* Applicant Profile Section */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 md:p-6 border border-blue-200">
                            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                                <div className="relative">
                                    <img
                                        src={application.applicant.profilePicture}
                                        alt="Profile"
                                        className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-white shadow-lg object-cover"
                                    />
                                    <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white rounded-full p-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                        </svg>
                                    </div>
                                </div>
                                <div className="flex-1 text-center sm:text-left">
                                    <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                                        {`${application.applicant.applicantDetails.lastName}, ${application.applicant.applicantDetails.firstName} ${application.applicant.applicantDetails.middleName}`}
                                    </h2>
                                    <div className="space-y-1">
                                        <p className="text-sm md:text-base text-gray-700 flex items-center justify-center sm:justify-start gap-2">
                                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                            </svg>
                                            {application.applicant.email}
                                        </p>
                                        <p className="text-xs md:text-sm text-gray-600 flex items-center justify-center sm:justify-start gap-2">
                                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4M8 7h8M8 7H6a1 1 0 00-1 1v9a1 1 0 001 1h12a1 1 0 001-1V8a1 1 0 00-1-1h-2"></path>
                                            </svg>
                                            Submitted: {new Date(application.createdAt).toLocaleDateString('en-US', {
                                                weekday: 'short',
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Personal Details */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 md:px-6 py-3 md:py-4">
                                <h3 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                    </svg>
                                    Personal Details
                                </h3>
                            </div>
                            <div className="p-4 md:p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                            <div>
                                                <p className="text-xs text-gray-500 font-medium">Birthdate</p>
                                                <p className="text-sm font-semibold text-gray-900">{application.applicant.applicantDetails.birthdate}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                            <div>
                                                <p className="text-xs text-gray-500 font-medium">Gender</p>
                                                <p className="text-sm font-semibold text-gray-900">{application.applicant.applicantDetails.gender}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                            <div>
                                                <p className="text-xs text-gray-500 font-medium">Blood Type</p>
                                                <p className="text-sm font-semibold text-gray-900">{application.applicant.applicantDetails.bloodType}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                            <div>
                                                <p className="text-xs text-gray-500 font-medium">Civil Status</p>
                                                <p className="text-sm font-semibold text-gray-900">{application.applicant.applicantDetails.civilStatus}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                            <div>
                                                <p className="text-xs text-gray-500 font-medium">Religion</p>
                                                <p className="text-sm font-semibold text-gray-900">{application.applicant.applicantDetails.religion}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                            <div>
                                                <p className="text-xs text-gray-500 font-medium">Height & Weight</p>
                                                <p className="text-sm font-semibold text-gray-900">{application.applicant.applicantDetails.height} / {application.applicant.applicantDetails.weight}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                            <div>
                                                <p className="text-xs text-gray-500 font-medium">Birthplace</p>
                                                <p className="text-sm font-semibold text-gray-900">{application.applicant.applicantDetails.birthplace}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                            <div>
                                                <p className="text-xs text-gray-500 font-medium">Contact Number</p>
                                                <p className="text-sm font-semibold text-gray-900">{application.applicant.applicantDetails.contactNumber}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {application.applicant.applicantDetails.civilStatus === 'Married' && (
                                    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                        <h4 className="font-semibold text-blue-900 mb-3 text-sm">Spouse Information</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                            <div>
                                                <p className="text-xs text-blue-600 font-medium">Maiden Name</p>
                                                <p className="text-sm font-semibold text-blue-900">{application.applicant.applicantDetails.maidenName}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-blue-600 font-medium">Spouse Name</p>
                                                <p className="text-sm font-semibold text-blue-900">{application.applicant.applicantDetails.spouseName}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-blue-600 font-medium">Spouse Occupation</p>
                                                <p className="text-sm font-semibold text-blue-900">{application.applicant.applicantDetails.spouseOccupation}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                                    <h4 className="font-semibold text-gray-900 mb-3 text-sm flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                        </svg>
                                        Address
                                    </h4>
                                    <p className="text-sm text-gray-700">
                                        {`${application.applicant.applicantDetails.address.addressDetails}, ${barangayName}, ${cityName}, ${provinceName}, ${regionName}`}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Education Details */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-4 md:px-6 py-3 md:py-4">
                                <h3 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                                    </svg>
                                    Educational Background
                                </h3>
                            </div>
                            <div className="p-4 md:p-6">
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                            <h4 className="font-semibold text-green-800 text-sm mb-2">Elementary</h4>
                                            <p className="text-sm text-green-700">{application.applicant.applicantDetails.education?.elementary?.school}</p>
                                            <p className="text-xs text-green-600 mt-1">Graduated: {application.applicant.applicantDetails.education?.elementary?.yearGraduated}</p>
                                        </div>
                                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                            <h4 className="font-semibold text-blue-800 text-sm mb-2">Junior High School</h4>
                                            <p className="text-sm text-blue-700">{application.applicant.applicantDetails.education?.juniorHighSchool?.school}</p>
                                            <p className="text-xs text-blue-600 mt-1">Graduated: {application.applicant.applicantDetails.education?.juniorHighSchool?.yearGraduated}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                                            <h4 className="font-semibold text-purple-800 text-sm mb-2">Senior High School</h4>
                                            <p className="text-sm text-purple-700">{application.applicant.applicantDetails.education?.seniorHighSchool?.school}</p>
                                            <p className="text-xs text-purple-600 mt-1">Graduated: {application.applicant.applicantDetails.education?.seniorHighSchool?.yearGraduated}</p>
                                        </div>
                                        <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                                            <h4 className="font-semibold text-indigo-800 text-sm mb-2">College</h4>
                                            <p className="text-sm text-indigo-700">{application.applicant.applicantDetails.education?.college?.school}</p>
                                            <p className="text-xs text-indigo-600 mt-1">Course: {application.applicant.applicantDetails.education?.college?.course}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Family Details */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-4 md:px-6 py-3 md:py-4">
                                <h3 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                    </svg>
                                    Family Details
                                </h3>
                            </div>
                            <div className="p-4 md:p-6">
                                {application.guardian.firstName && !application.father.firstName && !application.mother.firstName ? (
                                    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                                        <h4 className="font-semibold text-yellow-800 text-sm mb-2">Guardian Information</h4>
                                        <p className="text-sm text-yellow-700">
                                            {`${application.guardian.firstName} ${application.guardian.middleName} ${application.guardian.lastName}`}
                                        </p>
                                        <p className="text-xs text-yellow-600 mt-1">Occupation: {application.guardian.occupation}</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {application.father.firstName && (
                                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                                <h4 className="font-semibold text-blue-800 text-sm mb-2">Father</h4>
                                                <p className="text-sm text-blue-700">
                                                    {`${application.father.firstName} ${application.father.middleName} ${application.father.lastName}`}
                                                </p>
                                                <p className="text-xs text-blue-600 mt-1">Occupation: {application.father.occupation}</p>
                                            </div>
                                        )}
                                        {application.mother.firstName && (
                                            <div className="p-4 bg-pink-50 rounded-lg border border-pink-200">
                                                <h4 className="font-semibold text-pink-800 text-sm mb-2">Mother</h4>
                                                <p className="text-sm text-pink-700">
                                                    {`${application.mother.firstName} ${application.mother.middleName} ${application.mother.lastName}`}
                                                </p>
                                                <p className="text-xs text-pink-600 mt-1">Occupation: {application.mother.occupation}</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {!application.father.firstName && !application.mother.firstName && !application.guardian.firstName && (
                                    <div className="text-center py-8">
                                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                                            </svg>
                                        </div>
                                        <p className="text-sm text-gray-500">No family details available.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Work Experience */}
                        {application.workExperience && application.workExperience.length > 0 && (
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                <div className="bg-gradient-to-r from-orange-600 to-red-600 px-4 md:px-6 py-3 md:py-4">
                                    <h3 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6.5M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m-8 0h8m-8 0v13a2 2 0 002 2h4a2 2 0 002-2V6"></path>
                                        </svg>
                                        Work Experience
                                    </h3>
                                </div>
                                <div className="p-4 md:p-6">
                                    <div className="space-y-4">
                                        {application.workExperience.map((item, index) => (
                                            (item.companyName || item.position || item.startDate || item.monthlySalary || item.statusOfAppointment) && (
                                                <div key={index} className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        {item.companyName && (
                                                            <div>
                                                                <p className="text-xs text-orange-600 font-medium">Company</p>
                                                                <p className="text-sm font-semibold text-orange-900">{item.companyName}</p>
                                                            </div>
                                                        )}
                                                        {item.position && (
                                                            <div>
                                                                <p className="text-xs text-orange-600 font-medium">Position</p>
                                                                <p className="text-sm font-semibold text-orange-900">{item.position}</p>
                                                            </div>
                                                        )}
                                                        {item.startDate && (
                                                            <div>
                                                                <p className="text-xs text-orange-600 font-medium">Start Date</p>
                                                                <p className="text-sm font-semibold text-orange-900">{item.startDate}</p>
                                                            </div>
                                                        )}
                                                        {item.monthlySalary && (
                                                            <div>
                                                                <p className="text-xs text-orange-600 font-medium">Monthly Salary</p>
                                                                <p className="text-sm font-semibold text-orange-900">{item.monthlySalary}</p>
                                                            </div>
                                                        )}
                                                        {item.statusOfAppointment && (
                                                            <div className="md:col-span-2">
                                                                <p className="text-xs text-orange-600 font-medium">Status of Appointment</p>
                                                                <p className="text-sm font-semibold text-orange-900">{item.statusOfAppointment}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Skills and Qualifications */}
                        {application.skillsAndQualifications && application.skillsAndQualifications.length > 0 && (
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                <div className="bg-gradient-to-r from-teal-600 to-cyan-600 px-4 md:px-6 py-3 md:py-4">
                                    <h3 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                                        </svg>
                                        Skills and Qualifications
                                    </h3>
                                </div>
                                <div className="p-4 md:p-6">
                                    <div className="space-y-4">
                                        {application.skillsAndQualifications.map((item, index) => (
                                            (item.skills || item.qualifications) && (
                                                <div key={index} className="p-4 bg-teal-50 rounded-lg border border-teal-200">
                                                    <div className="space-y-3">
                                                        {item.skills && (
                                                            <div>
                                                                <p className="text-xs text-teal-600 font-medium">Skills</p>
                                                                <p className="text-sm font-semibold text-teal-900">{item.skills}</p>
                                                            </div>
                                                        )}
                                                        {item.qualifications && (
                                                            <div>
                                                                <p className="text-xs text-teal-600 font-medium">Qualifications</p>
                                                                <p className="text-sm font-semibold text-teal-900">{item.qualifications}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Documents */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="bg-gradient-to-r from-gray-700 to-gray-800 px-4 md:px-6 py-3 md:py-4">
                                <h3 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                    </svg>
                                    Documents ({Object.keys(application.documents || {}).length} files)
                                </h3>
                            </div>
                            <div className="p-4 md:p-6">
                                {application.documents && Object.entries(application.documents).length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {Object.entries(application.documents).map(([key, value], index) => (
                                            <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                                        </svg>
                                                    </div>
                                                    <h4 className="font-semibold text-gray-900 text-sm">
                                                        {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                    </h4>
                                                </div>
                                                <div className="border border-gray-300 rounded-lg overflow-hidden">
                                                    <img
                                                        src={value}
                                                        alt={key}
                                                        className="w-full h-48 md:h-64 object-contain bg-white cursor-pointer hover:scale-105 transition-transform duration-200"
                                                        onClick={() => window.open(value, '_blank')}
                                                    />
                                                </div>
                                                <p className="text-xs text-gray-500 mt-2 text-center">Click to view full size</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                            </svg>
                                        </div>
                                        <p className="text-sm text-gray-500">No documents available.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Modal for resubmission confirmation */}
                        <Modal
                            isOpen={showModal}
                            onRequestClose={closeModal}
                            contentLabel="Request Resubmission"
                            className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto bg-gray-900 bg-opacity-50"
                            overlayClassName="fixed inset-0 bg-gray-900 bg-opacity-50"
                        >
                            <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8 w-full max-w-md mx-4 border border-gray-200">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                                        </svg>
                                    </div>
                                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">Request Resubmission?</h2>
                                    <p className="text-sm md:text-base text-gray-600 mb-6">
                                        After you request a resubmission, you will need to update your application and submit it again.
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <button
                                            onClick={closeModal}
                                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleResubmit}
                                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                                        >
                                            Request Resubmission
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Modal>                    </div>
                </div>
            </div>
        </div>
    );
}