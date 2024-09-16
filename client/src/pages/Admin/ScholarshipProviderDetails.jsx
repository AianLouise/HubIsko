import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { IoMdArrowDropdown } from "react-icons/io";
import Layout from "../../components/Layout";
import ProviderDetails from "./ProviderDetails";
import Snackbar from '../../components/Snackbar';
import ConfirmationModal from '../../components/ConfirmationModal';

export default function ScholarshipsProviderDetails() {
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

    const fetchProviderDetails = async () => {
        try {
            const response = await fetch(`/api/admin/scholarship-provider/${id}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setProvider(data.provider);
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProviderDetails();
    }, [id]);

    const handleApprove = async (providerId) => {
        try {
            const response = await fetch(`/api/admin/scholarship-provider/approve/${providerId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
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
            const response = await fetch(`/api/admin/scholarship-provider/reject/${providerId}`, {
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

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!provider) return <p>No provider data available</p>;

    return (
        <div className="flex flex-col min-h-screen font-medium text-slate-700">

            <main className="flex-grow bg-[#f8f8fb] pb-24">
                <div className='max-w-8xl mx-auto px-24 flex-col flex mt-16'>
                    <div className="flex gap-2 items-center">
                        <Link to={'/accounts'} className="border shadow px-6 py-2 bg-white rounded-md hover:bg-slate-200">
                            <span>Scholarships</span>
                        </Link>
                        <IoMdArrowDropdown className='-rotate-90 w-8 h-8 text-blue-600' />
                        <div className="border shadow px-6 py-2 bg-white rounded-md">
                            <span className="text-blue-600">{provider.scholarshipProviderDetails.organizationName}'s</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-10 p-8 w-full">

                    <div className="flex flex-col bg-white border p-4 py-6 rounded-md shadow">
                        <div className="text-lg font-bold bg-blue-500 text-white px-4 py-2 rounded-md">Scholarship Provider Details</div>

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
                                <label className="block text-sm font-medium text-slate-400">Contact Person Name</label>
                                <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">{provider.scholarshipProviderDetails.contactPersonName}</span>
                            </div>
                            <div className="">
                                <label className="block text-sm font-medium text-slate-400">Contact Person Position</label>
                                <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">{provider.scholarshipProviderDetails.contactPersonPosition}</span>
                            </div>
                            <div className="">
                                <label className="block text-sm font-medium text-slate-400">Contact Person Number</label>
                                <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">{provider.scholarshipProviderDetails.contactPersonNumber}</span>
                            </div>
                            <div className="">
                                <label className="block text-sm font-medium text-slate-400">Address Details</label>
                                <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">{provider.scholarshipProviderDetails.addressDetails}</span>
                            </div>
                            <div className="">
                                <label className="block text-sm font-medium text-slate-400">Region</label>
                                <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">{provider.scholarshipProviderDetails.region}</span>
                            </div>
                            <div className="">
                                <label className="block text-sm font-medium text-slate-400">Province</label>
                                <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">{provider.scholarshipProviderDetails.province}</span>
                            </div>
                            <div className="">
                                <label className="block text-sm font-medium text-slate-400">City</label>
                                <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">{provider.scholarshipProviderDetails.city}</span>
                            </div>
                            <div className="">
                                <label className="block text-sm font-medium text-slate-400">Barangay</label>
                                <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">{provider.scholarshipProviderDetails.barangay}</span>
                            </div>
                            <div className="">
                                <label className="block text-sm font-medium text-slate-400">Website</label>
                                <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">{provider.scholarshipProviderDetails.website}</span>
                            </div>
                        </div>
                        </div>

                    <div className="flex flex-col bg-white border p-4 py-6 rounded-md shadow">
                        <div className="text-lg font-bold bg-blue-500 text-white px-4 py-2 rounded-md">Contact Information</div>
                        <div className="grid grid-cols-3 gap-8 p-4">
                            <div className="">
                                <label className="block text-sm font-medium text-slate-400">Email Address</label>
                                <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">{provider.scholarshipProviderDetails.email}</span>
                            </div>
                            <div className="">
                                <label className="block text-sm font-medium text-slate-400">Contact Person</label>
                                <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">{provider.scholarshipProviderDetails.contactPersonName}</span>
                            </div>
                            <div className="">
                                <label className="block text-sm font-medium text-slate-400">Contact Number</label>
                                <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">{provider.scholarshipProviderDetails.contactPersonNumber}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col bg-white border p-4 py-6 rounded-md shadow">
                        <div className="text-lg font-bold bg-blue-500 text-white px-4 py-2 rounded-md">Documents</div>
                        <div className="grid grid-cols-3 gap-8 p-4">
  <div className="">
    <label className="block text-sm font-medium text-slate-400">Registration Certificate</label>
    <div className="border p-2 border-gray-300 rounded-md">
      {provider.scholarshipProviderDetails.documents.registrationCertificate ? (
        <div className="flex items-center justify-center overflow-hidden h-[600px]">
          <img
            src={provider.scholarshipProviderDetails.documents.registrationCertificate}
            alt="Registration Certificate"
            className=""
          />
        </div>
      ) : (
        <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">Not Provided</span>
      )}
    </div>
  </div>

  <div className="">
    <label className="block text-sm font-medium text-slate-400">TIN</label>
    <div className="border p-2 border-gray-300 rounded-md">
      {provider.scholarshipProviderDetails.documents.tin ? (
        <div className="flex items-center justify-center overflow-hidden h-[600px]">
          <img
            src={provider.scholarshipProviderDetails.documents.tin}
            alt="TIN"
            className=""
          />
        </div>
      ) : (
        <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">Not Provided</span>
      )}
    </div>
  </div>

  <div className="">
    <label className="block text-sm font-medium text-slate-400">Proof of Address</label>
    <div className="border p-2 border-gray-300 rounded-md">
      {provider.scholarshipProviderDetails.documents.proofOfAddress ? (
        <div className="flex items-center justify-center overflow-hidden h-[600px]">
          <img
            src={provider.scholarshipProviderDetails.documents.proofOfAddress}
            alt="Proof of Address"
            className=""
          />
        </div>
      ) : (
        <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">Not Provided</span>
      )}
    </div>
  </div>

  <div className="">
    <label className="block text-sm font-medium text-slate-400">Authorization Letter</label>
    <div className="border p-2 border-gray-300 rounded-md">
      {provider.scholarshipProviderDetails.documents.authorizationLetter ? (
        <div className="flex items-center justify-center overflow-hidden h-[600px]">
          <img
            src={provider.scholarshipProviderDetails.documents.authorizationLetter}
            alt="Authorization Letter"
            className=""
          />
        </div>
      ) : (
        <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">Not Provided</span>
      )}
    </div>
  </div>

  <div className="">
    <label className="block text-sm font-medium text-slate-400">ID Proof of Contact Person</label>
    <div className="border p-2 border-gray-300 rounded-md">
      {provider.scholarshipProviderDetails.documents.idProofContactPerson ? (
        <div className="flex items-center justify-center overflow-hidden h-[600px]">
          <img
            src={provider.scholarshipProviderDetails.documents.idProofContactPerson}
            alt="ID Proof of Contact Person"
            className=""
          />
        </div>
      ) : (
        <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">Not Provided</span>
      )}
    </div>
  </div>
</div>

                        <div className="flex justify-end gap-4 mt-6">
                            {provider.status === 'Pending Verification' && (
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
                                        onConfirm={() => handleApprove(provider._id)}
                                        message="Are you sure you want to approve this provider?"
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
                                        onConfirm={() => handleReject(provider._id)}
                                        message="Are you sure you want to reject this provider?"
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