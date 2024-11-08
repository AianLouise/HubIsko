import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { IoMdArrowDropdown, IoMdBusiness, IoMdSchool } from "react-icons/io";
import Layout from "../../components/Layout";
import ProviderDetails from "./ProviderDetails";
import Snackbar from '../../components/Snackbar';
import ConfirmationModal from '../../components/ConfirmationModal';
import { FaFileAlt } from "react-icons/fa";
import { BsBuildingFill } from "react-icons/bs";
import { regions, provinces, cities, barangays } from 'select-philippines-address';
import { useSelector } from "react-redux";
import AdminImageModal from "../../components/AdminImageModal";

export default function ScholarshipsProviderDetails() {
    const currentUser = useSelector((state) => state.user.currentUser);
    const userId = currentUser._id;

    const { id } = useParams();
    const [provider, setProvider] = useState(null);
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


    const fetchProviderDetails = async () => {
        try {
            const response = await fetch(`/api/admin/scholarship-provider/${id}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setProvider(data.provider);
            setSelectedRegion(data.provider.scholarshipProviderDetails.region);
            setSelectedProvince(data.provider.scholarshipProviderDetails.province);
            setSelectedCity(data.provider.scholarshipProviderDetails.city);
            setSelectedBarangay(data.provider.scholarshipProviderDetails.barangay);
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchProviderDetails();
    }, [id]);

    const handleApprove = async (providerId) => {
        try {
            const userId = currentUser._id;

            const response = await fetch(`/api/adminApp/scholarship-provider/approve/${providerId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            console.log(`Approved provider with id: ${providerId}`);
            setSuccessMessage('Application approved successfully!');
            setShowSnackbar(true);
            setIsApproveModalOpen(false);
            fetchProviderDetails(); // Refetch provider details
        } catch (error) {
            console.error("Error approving scholarship provider:", error);
        }
    };

    const handleReject = async (providerId) => {
        try {
            const userId = currentUser._id;

            const response = await fetch(`/api/adminApp/scholarship-provider/reject/${providerId}`, {
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
            fetchProviderDetails(); // Refetch provider details
        } catch (error) {
            console.error('Error declining scholarship provider:', error);
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
    if (!provider) return <p>No provider data available</p>;

    return (
        <div className="flex flex-col min-h-screen font-medium text-slate-700">

            <main className="flex-grow bg-[#f8f8fb] pb-24">
                <div className='max-w-8xl mx-auto px-24 flex-col flex mt-16'>
                    <div className="flex gap-2 items-center">
                        <Link to={'/scholarship-provider-applications'} className="border shadow px-6 py-2 bg-white rounded-md hover:bg-slate-200 flex items-center gap-2">
                            <FaFileAlt className="w-6 h-6 text-blue-600" />
                            <span>Scholarship Provider Applications</span>
                        </Link>
                        <IoMdArrowDropdown className='-rotate-90 w-8 h-8 text-blue-600' />
                        <div className="border shadow px-6 py-2 bg-white rounded-md flex items-center gap-2">
                            <BsBuildingFill className="w-6 h-6 text-blue-600" />
                            <span className="text-blue-600">{provider.scholarshipProviderDetails.organizationName}'s</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-10 p-8 w-full">

                        <div className="flex flex-col bg-white border p-4 py-6 rounded-md shadow">
                            <div className="text-lg font-bold bg-blue-500 text-white px-4 py-2 rounded-md">Scholarship Provider Details</div>
                            <div className="flex flex-col items-center justify-center py-4">
                                <label className="block text-sm text-slate-600 mb-2">Profile Picture</label>
                                <img
                                    src={provider?.profilePicture || 'default-profile-picture-url'}
                                    alt="Student Profile"
                                    className="w-24 h-24 rounded-full object-cover"
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-8 my-4 p-4">
                                <div className="">
                                    <label className="block text-sm font-medium text-slate-400">Organization Name</label>
                                    <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">{provider.scholarshipProviderDetails.organizationName}</span>
                                </div>
                                <div className="">
                                    <label className="block text-sm font-medium text-slate-400">Organization Type</label>
                                    <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">{provider.scholarshipProviderDetails.organizationType}</span>
                                </div>
                                <div className="">
                                    <label className="block text-sm font-medium text-slate-400">Registration Number</label>
                                    <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">{provider.scholarshipProviderDetails.registrationNumber}</span>
                                </div>
                                <div className="">
                                    <label className="block text-sm font-medium text-slate-400">Website</label>
                                    <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">{provider.scholarshipProviderDetails.website}</span>
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
                                        {provider.scholarshipProviderDetails.addressDetails || 'N/A'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col bg-white border p-4 py-6 rounded-md shadow">
                            <div className="text-lg font-bold bg-blue-500 text-white px-4 py-2 rounded-md">Contact Person Information</div>
                            <div className="grid grid-cols-3 gap-8 p-4">
                                <div className="">
                                    <label className="block text-sm font-medium text-slate-400">Name</label>
                                    <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">{provider.scholarshipProviderDetails.contactPersonName}</span>
                                </div>
                                <div className="">
                                    <label className="block text-sm font-medium text-slate-400">Position</label>
                                    <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">{provider.scholarshipProviderDetails.contactPersonPosition}</span>
                                </div>
                                <div className="">
                                    <label className="block text-sm font-medium text-slate-400">Contact Number</label>
                                    <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">{provider.scholarshipProviderDetails.contactPersonNumber}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col bg-white border p-4 py-6 rounded-md shadow">
                            <div className="text-lg font-bold bg-blue-500 text-white px-4 py-2 rounded-md">Documents</div>
                            <div className="grid grid-cols-3 gap-8 my-4 py-4 px-8">
                                <div className="">
                                    <label className="block text-sm text-slate-400">Registration Certificate</label>
                                    {provider.scholarshipProviderDetails.documents.registrationCertificate ? (
                                        <button
                                            onClick={() => handleViewDocument(provider.scholarshipProviderDetails.documents.registrationCertificate, 'Registration Certificate')}
                                            className="mt-1 block px-3 font-medium text-center bg-slate-100 hover:bg-slate-200 py-2 border w-full border-gray-300 rounded-md text-blue-600"
                                        >
                                            View Document
                                        </button>
                                    ) : (
                                        <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">Not Provided</span>
                                    )}
                                </div>

                                <div className="">
                                    <label className="block text-sm text-slate-400">TIN</label>
                                    {provider.scholarshipProviderDetails.documents.tin ? (
                                        <button
                                            onClick={() => handleViewDocument(provider.scholarshipProviderDetails.documents.tin, 'TIN')}
                                            className="mt-1 block px-3 font-medium text-center bg-slate-100 hover:bg-slate-200 py-2 border w-full border-gray-300 rounded-md text-blue-600"
                                        >
                                            View Document
                                        </button>
                                    ) : (
                                        <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">Not Provided</span>
                                    )}
                                </div>

                                <div className="">
                                    <label className="block text-sm text-slate-400">Proof of Address</label>
                                    {provider.scholarshipProviderDetails.documents.proofOfAddress ? (
                                        <button
                                            onClick={() => handleViewDocument(provider.scholarshipProviderDetails.documents.proofOfAddress, 'Proof of Address')}
                                            className="mt-1 block px-3 font-medium text-center bg-slate-100 hover:bg-slate-200 py-2 border w-full border-gray-300 rounded-md text-blue-600"
                                        >
                                            View Document
                                        </button>
                                    ) : (
                                        <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">Not Provided</span>
                                    )}
                                </div>

                                <div className="">
                                    <label className="block text-sm text-slate-400">Authorization Letter</label>
                                    {provider.scholarshipProviderDetails.documents.authorizationLetter ? (
                                        <button
                                            onClick={() => handleViewDocument(provider.scholarshipProviderDetails.documents.authorizationLetter, 'Authorization Letter')}
                                            className="mt-1 block px-3 font-medium text-center bg-slate-100 hover:bg-slate-200 py-2 border w-full border-gray-300 rounded-md text-blue-600"
                                        >
                                            View Document
                                        </button>
                                    ) : (
                                        <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">Not Provided</span>
                                    )}
                                </div>

                                <div className="">
                                    <label className="block text-sm text-slate-400">ID Proof of Contact Person</label>
                                    {provider.scholarshipProviderDetails.documents.idProofContactPerson ? (
                                        <button
                                            onClick={() => handleViewDocument(provider.scholarshipProviderDetails.documents.idProofContactPerson, 'ID Proof of Contact Person')}
                                            className="mt-1 block px-3 font-medium text-center bg-slate-100 hover:bg-slate-200 py-2 border w-full border-gray-300 rounded-md text-blue-600"
                                        >
                                            View Document
                                        </button>
                                    ) : (
                                        <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">Not Provided</span>
                                    )}
                                </div>
                            </div>
                            <AdminImageModal isOpen={isModalOpen} onClose={handleCloseModal} imageUrl={selectedImageUrl} documentName={selectedDocumentName} />
                        </div>


                        <div className="flex justify-end gap-4 mt-6">
                            {provider.status === 'Pending Verification' && (
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
                                        onConfirm={() => handleReject(provider._id)}
                                        message="Are you sure you want to reject this provider?"
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
                                        onConfirm={() => handleApprove(provider._id)}
                                        message="Are you sure you want to approve this provider?"
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
                                onClick={() => handleReject(provider._id)}
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
                    onAction={() => navigate('/scholarship-provider-applications')}
                    actionText="Go to Application List"
                />
            )}
        </div>
    );
}