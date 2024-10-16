import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { IoMdArrowDropdown, IoMdPeople, IoMdPerson } from "react-icons/io";
import Layout from "../../components/Layout";
import Snackbar from '../../components/Snackbar';
import ConfirmationModal from '../../components/ConfirmationModal';
import { regions, provinces, cities, barangays } from 'select-philippines-address';
import { FaFileAlt } from "react-icons/fa";
import AdminImageModal from "../../components/AdminImageModal";
import { useSelector } from "react-redux";

export default function StudentApplicationDetails() {
    const currentUser = useSelector((state) => state.user.currentUser);
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

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImageUrl, setSelectedImageUrl] = useState('');
    const [selectedDocumentName, setSelectedDocumentName] = useState('');

    const handleViewDocument = (url, name) => {
        setSelectedImageUrl(url);
        setSelectedDocumentName(name);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedImageUrl('');
        setSelectedDocumentName('');
    };

    const fetchStudentDetails = async () => {
        try {
            const response = await fetch(`/api/adminApp/student/${id}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setStudent(data.student);
            setSelectedRegion(data.student.applicantDetails.address.region);
            setSelectedProvince(data.student.applicantDetails.address.province);
            setSelectedCity(data.student.applicantDetails.address.city);
            setSelectedBarangay(data.student.applicantDetails.address.barangay);
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchStudentDetails();
    }, [id]);

    const handleApprove = async (studentId) => {
        const userId = currentUser._id;

        console.log('Approving student:', userId);

        try {
            const response = await fetch(`/api/adminApp/student/approve/${studentId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId })
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
        const userId = currentUser._id;
    
        try {
            const response = await fetch(`/api/adminApp/student/reject/${studentId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ rejectReason: rejectReason, userId })
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

    const [regionList, setRegionList] = useState([]);
    const [provinceList, setProvinceList] = useState([]);
    const [cityList, setCityList] = useState([]);
    const [barangayList, setBarangayList] = useState([]);

    const [selectedRegion, setSelectedRegion] = useState('');
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedBarangay, setSelectedBarangay] = useState('');

    const [formData, setFormData] = useState({});
    const [locationNames, setLocationNames] = useState({
        region: '',
        province: '',
        city: '',
        barangay: ''
    });

    // Fetch all regions on component mount
    useEffect(() => {
        regions().then(setRegionList);
    }, []);

    // Fetch provinces when a region is selected
    useEffect(() => {
        if (selectedRegion) {
            provinces(selectedRegion).then(setProvinceList);
        }
    }, [selectedRegion]);

    // Fetch cities when a province is selected
    useEffect(() => {
        if (selectedProvince) {
            cities(selectedProvince).then(setCityList);
        }
    }, [selectedProvince]);

    // Fetch barangays when a city is selected
    useEffect(() => {
        if (selectedCity) {
            barangays(selectedCity).then(setBarangayList);
        }
    }, [selectedCity]);

    // Save the selected location to the formData state
    const handleSave = () => {
        const locationData = {
            region: selectedRegion,
            province: selectedProvince,
            city: selectedCity,
            barangay: selectedBarangay,
        };

        console.log('Form Data:', locationData);

        setFormData(locationData);
    };

    // Convert codes to names
    useEffect(() => {
        const regionName = regionList.find(region => region.region_code === selectedRegion)?.region_name || '';
        const provinceName = provinceList.find(province => province.province_code === selectedProvince)?.province_name || '';
        const cityName = cityList.find(city => city.city_code === selectedCity)?.city_name || '';
        const barangayName = barangayList.find(barangay => barangay.brgy_code === selectedBarangay)?.brgy_name || '';

        setLocationNames({
            region: regionName,
            province: provinceName,
            city: cityName,
            barangay: barangayName,
        });
    }, [selectedRegion, selectedProvince, selectedCity, selectedBarangay, regionList, provinceList, cityList, barangayList]);

    if (loading) return (
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
                        <Link to={'/student-applications'} className="border shadow px-6 py-2 bg-white rounded-md hover:bg-slate-200 flex items-center gap-2">
                            <FaFileAlt className="w-6 h-6 text-blue-600" />
                            <span>Student Applications</span>
                        </Link>
                        <IoMdArrowDropdown className='-rotate-90 w-8 h-8 text-blue-600' />

                        <div className="border shadow px-6 py-2 bg-white rounded-md flex items-center gap-2">
                            <IoMdPerson className="w-6 h-6 text-blue-600" />
                            <span className="text-blue-600">{student?.applicantDetails?.firstName} {student?.applicantDetails?.lastName}'s Application</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-10 p-8 w-full">

                        <div className="flex flex-col bg-white border p-4 py-6 rounded-md shadow">
                            <div className="text-lg font-bold bg-blue-500 text-white px-4 py-2 rounded-md">Student Details</div>
                            <div className="flex flex-col items-center justify-center py-4">
                                <label className="block text-sm text-slate-600 mb-2">Profile Picture</label>
                                <img
                                    src={student?.profilePicture || 'default-profile-picture-url'}
                                    alt="Student Profile"
                                    className="w-24 h-24 rounded-full object-cover"
                                />
                            </div>
                            <div className="grid grid-cols-4 gap-5 my-4 py-4 px-8">
                                <div className="">
                                    <label className="block text-sm text-slate-600">First Name</label>
                                    <span className="mt-1 block px-3 font-medium bg-slate-100 py-2 border border-gray-300 rounded-md">
                                        {student?.applicantDetails?.firstName || 'N/A'}
                                    </span>
                                </div>
                                <div className="">
                                    <label className="block text-sm text-slate-600">Middle Name</label>
                                    <span className="mt-1 block px-3 font-medium bg-slate-100 py-2 border border-gray-300 rounded-md">
                                        {student?.applicantDetails?.middleName || 'N/A'}
                                    </span>
                                </div>
                                <div className="">
                                    <label className="block text-sm text-slate-600">Last Name</label>
                                    <span className="mt-1 block px-3 font-medium bg-slate-100 py-2 border border-gray-300 rounded-md">
                                        {student?.applicantDetails?.lastName || 'N/A'}
                                    </span>
                                </div>
                                <div className="">
                                    <label className="block text-sm text-slate-600">Name Extension</label>
                                    <span className="mt-1 block px-3 font-medium bg-slate-100 py-2 border border-gray-300 rounded-md">
                                        {student?.applicantDetails?.nameExtension || 'N/A'}
                                    </span>
                                </div>
                                <div className="">
                                    <label className="block text-sm text-slate-600">Birthdate</label>
                                    <span className="mt-1 block px-3 font-medium bg-slate-100 py-2 border border-gray-300 rounded-md">
                                        {student?.applicantDetails?.birthdate || 'N/A'}
                                    </span>
                                </div>
                                <div className="">
                                    <label className="block text-sm text-slate-600">Gender</label>
                                    <span className="mt-1 block px-3 font-medium bg-slate-100 py-2 border border-gray-300 rounded-md">
                                        {student?.applicantDetails?.gender || 'N/A'}
                                    </span>
                                </div>
                                <div className="">
                                    <label className="block text-sm text-slate-600">Blood Type</label>
                                    <span className="mt-1 block px-3 font-medium bg-slate-100 py-2 border border-gray-300 rounded-md">
                                        {student?.applicantDetails?.bloodType || 'N/A'}
                                    </span>
                                </div>
                                <div className="">
                                    <label className="block text-sm text-slate-600">Civil Status</label>
                                    <span className="mt-1 block px-3 font-medium bg-slate-100 py-2 border border-gray-300 rounded-md">
                                        {student?.applicantDetails?.civilStatus || 'N/A'}
                                    </span>
                                </div>
                                {student?.applicantDetails?.civilStatus === 'Married' && (
                                    <>
                                        <div className="">
                                            <label className="block text-sm text-slate-600">Maiden Name</label>
                                            <span className="mt-1 block px-3 font-medium bg-slate-100 py-2 border border-gray-300 rounded-md">
                                                {student?.applicantDetails?.maidenName || 'N/A'}
                                            </span>
                                        </div>
                                        <div className="">
                                            <label className="block text-sm text-slate-600">Spouse Name</label>
                                            <span className="mt-1 block px-3 font-medium bg-slate-100 py-2 border border-gray-300 rounded-md">
                                                {student?.applicantDetails?.spouseName || 'N/A'}
                                            </span>
                                        </div>
                                        <div className="">
                                            <label className="block text-sm text-slate-600">Spouse Occupation</label>
                                            <span className="mt-1 block px-3 font-medium bg-slate-100 py-2 border border-gray-300 rounded-md">
                                                {student?.applicantDetails?.spouseOccupation || 'N/A'}
                                            </span>
                                        </div>
                                    </>
                                )}
                                <div className="">
                                    <label className="block text-sm text-slate-600">Religion</label>
                                    <span className="mt-1 block px-3 font-medium bg-slate-100 py-2 border border-gray-300 rounded-md">
                                        {student?.applicantDetails?.religion || 'N/A'}
                                    </span>
                                </div>
                                <div className="">
                                    <label className="block text-sm text-slate-600">Height</label>
                                    <span className="mt-1 block px-3 font-medium bg-slate-100 py-2 border border-gray-300 rounded-md">
                                        {student?.applicantDetails?.height || 'N/A'}
                                    </span>
                                </div>
                                <div className="">
                                    <label className="block text-sm text-slate-600">Weight</label>
                                    <span className="mt-1 block px-3 font-medium bg-slate-100 py-2 border border-gray-300 rounded-md">
                                        {student?.applicantDetails?.weight || 'N/A'}
                                    </span>
                                </div>
                                <div className="">
                                    <label className="block text-sm text-slate-600">Birthplace</label>
                                    <span className="mt-1 block px-3 font-medium bg-slate-100 py-2 border border-gray-300 rounded-md">
                                        {student?.applicantDetails?.birthplace || 'N/A'}
                                    </span>
                                </div>
                                <div className="">
                                    <label className="block text-sm text-slate-600">Contact Number</label>
                                    <span className="mt-1 block px-3 font-medium bg-slate-100 py-2 border border-gray-300 rounded-md">
                                        {student?.applicantDetails?.contactNumber || 'N/A'}
                                    </span>
                                </div>
                            </div>
                        </div>


                        <div className="flex flex-col bg-white border p-4 py-6 rounded-md shadow">
                            <div className="text-lg font-bold bg-blue-500 text-white px-4 py-2 rounded-md">Address</div>
                            <div className="grid grid-cols-3 gap-8 my-4 py-4 px-8">
                                <div className="">
                                    <label className="block text-sm text-slate-600">Region</label>
                                    <span className="mt-1 block px-3 font-medium bg-slate-100 py-2 border border-gray-300 rounded-md">
                                        {locationNames.region}
                                    </span>
                                </div>
                                <div className="">
                                    <label className="block text-sm text-slate-600">Province</label>
                                    <span className="mt-1 block px-3 font-medium bg-slate-100 py-2 border border-gray-300 rounded-md">
                                        {locationNames.province}
                                    </span>
                                </div>
                                <div className="">
                                    <label className="block text-sm text-slate-600">City</label>
                                    <span className="mt-1 block px-3 font-medium bg-slate-100 py-2 border border-gray-300 rounded-md">
                                        {locationNames.city}
                                    </span>
                                </div>
                                <div className="">
                                    <label className="block text-sm text-slate-600">Barangay</label>
                                    <span className="mt-1 block px-3 font-medium bg-slate-100 py-2 border border-gray-300 rounded-md">
                                        {locationNames.barangay}
                                    </span>
                                </div>
                                <div className="">
                                    <label className="block text-sm text-slate-600">Address Details</label>
                                    <span className="mt-1 block px-3 font-medium bg-slate-100 py-2 border border-gray-300 rounded-md">
                                        {student.applicantDetails.address.addressDetails || 'N/A'}
                                    </span>
                                </div>
                            </div>
                        </div>


                        <div className="flex flex-col bg-white border p-4 py-6 rounded-md shadow">
                            <div className="text-lg font-bold bg-blue-500 text-white px-4 py-2 rounded-md">Education</div>
                            <div className="grid grid-cols-3 gap-8 my-4 py-4 px-8">
                                <div className="">
                                    <label className="block text-sm text-slate-600">Elementary School</label>
                                    <span className="mt-1 block px-3 font-medium bg-slate-100 py-2 border border-gray-300 rounded-md">
                                        {student.applicantDetails.education.elementary.school || 'N/A'}
                                    </span>
                                </div>
                                <div className="">
                                    <label className="block text-sm text-slate-600">Elementary Year Graduated</label>
                                    <span className="mt-1 block px-3 font-medium bg-slate-100 py-2 border border-gray-300 rounded-md">
                                        {student.applicantDetails.education.elementary.yearGraduated || 'N/A'}
                                    </span>
                                </div>
                                <div className="">
                                    <label className="block text-sm text-slate-600">Elementary Award</label>
                                    <span className="mt-1 block px-3 font-medium bg-slate-100 py-2 border border-gray-300 rounded-md">
                                        {student.applicantDetails.education.elementary.award || 'N/A'}
                                    </span>
                                </div>
                                <div className="">
                                    <label className="block text-sm text-slate-600">Junior High School School</label>
                                    <span className="mt-1 block px-3 font-medium bg-slate-100 py-2 border border-gray-300 rounded-md">
                                        {student.applicantDetails.education.juniorHighSchool.school || 'N/A'}
                                    </span>
                                </div>
                                <div className="">
                                    <label className="block text-sm text-slate-600">Junior High School Year Graduated</label>
                                    <span className="mt-1 block px-3 font-medium bg-slate-100 py-2 border border-gray-300 rounded-md">
                                        {student.applicantDetails.education.juniorHighSchool.yearGraduated || 'N/A'}
                                    </span>
                                </div>
                                <div className="">
                                    <label className="block text-sm text-slate-600">Junior High School Award</label>
                                    <span className="mt-1 block px-3 font-medium bg-slate-100 py-2 border border-gray-300 rounded-md">
                                        {student.applicantDetails.education.juniorHighSchool.award || 'N/A'}
                                    </span>
                                </div>
                                <div className="">
                                    <label className="block text-sm text-slate-600">Senior High School School</label>
                                    <span className="mt-1 block px-3 font-medium bg-slate-100 py-2 border border-gray-300 rounded-md">
                                        {student.applicantDetails.education.seniorHighSchool.school || 'N/A'}
                                    </span>
                                </div>
                                <div className="">
                                    <label className="block text-sm text-slate-600">Senior High School Year Graduated</label>
                                    <span className="mt-1 block px-3 font-medium bg-slate-100 py-2 border border-gray-300 rounded-md">
                                        {student.applicantDetails.education.seniorHighSchool.yearGraduated || 'N/A'}
                                    </span>
                                </div>
                                <div className="">
                                    <label className="block text-sm text-slate-600">Senior High School Award</label>
                                    <span className="mt-1 block px-3 font-medium bg-slate-100 py-2 border border-gray-300 rounded-md">
                                        {student.applicantDetails.education.seniorHighSchool.award || 'N/A'}
                                    </span>
                                </div>
                                <div className="">
                                    <label className="block text-sm text-slate-600">College Course</label>
                                    <span className="mt-1 block px-3 font-medium bg-slate-100 py-2 border border-gray-300 rounded-md">
                                        {student.applicantDetails.education.college.course || 'N/A'}
                                    </span>
                                </div>
                                <div className="">
                                    <label className="block text-sm text-slate-600">College School</label>
                                    <span className="mt-1 block px-3 font-medium bg-slate-100 py-2 border border-gray-300 rounded-md">
                                        {student.applicantDetails.education.college.school || 'N/A'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col bg-white border p-4 py-6 rounded-md shadow">
                            <div className="text-lg font-bold bg-blue-500 text-white px-4 py-2 rounded-md">Documents</div>
                            <div className="grid grid-cols-1 gap-8 my-4 py-10 items-center px-8">
                                <div className="flex flex-col items-center">
                                    <label className="block text-sm text-slate-600">Student ID File</label>
                                    <button
                                        onClick={() => handleViewDocument(student.applicantDetails.studentIdFile, 'Student ID File')}
                                        className="mt-1 block px-10 font-medium text-center bg-slate-100 hover:bg-slate-200 py-2 border border-gray-300 rounded-md text-blue-600"
                                    >
                                        View Document
                                    </button>
                                </div>
                                <div className="flex flex-col items-center">
                                    <label className="block text-sm text-slate-600">Certificate of Registration File</label>
                                    <button
                                        onClick={() => handleViewDocument(student.applicantDetails.certificateOfRegistrationFile, 'Certificate of Registration File')}
                                        className="mt-1 block px-10 font-medium text-center bg-slate-100 hover:bg-slate-200 py-2 border border-gray-300 rounded-md text-blue-600"
                                    >
                                        View Document
                                    </button>
                                </div>
                            </div>
                            <AdminImageModal isOpen={isModalOpen} onClose={handleCloseModal} imageUrl={selectedImageUrl} documentName={selectedDocumentName} />
                        </div>

                        <div className="flex justify-end gap-4 mt-6">
                            {student.status === 'Pending Verification' && (
                                <>
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