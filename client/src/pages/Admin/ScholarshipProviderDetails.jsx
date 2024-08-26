import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { IoMdArrowDropdown } from "react-icons/io";
import Layout from "../../components/Layout";
import ProviderDetails from "./ProviderDetails";

export default function ScholarshipsProviderDetails() {
    const { id } = useParams(); // Get the ID from the route parameters
    const [provider, setProvider] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [snackbar, setSnackbar] = useState({ visible: false, message: '' });

    useEffect(() => {
        const fetchProviderDetails = async () => {
            try {
                const response = await fetch(`/api/admin/scholarship-provider/${id}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setProvider(data.provider);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

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
            setSnackbar({ visible: true, message: 'Scholarship provider approved successfully' });
            setTimeout(() => {
                setSnackbar({ visible: false, message: '' });
                window.scrollTo(0, 0); // Scroll to the top of the page
                window.location.reload(); // Refresh the page
            }, 3000);
            // Handle successful approval (e.g., show a success message, update state, etc.)
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
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            // Handle successful rejection (e.g., show a success message, update state, etc.)
        } catch (error) {
            console.error("Error rejecting scholarship provider:", error);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!provider) return <p>No provider data available</p>;

    return (
        <div className="flex flex-col min-h-screen font-medium text-slate-700">
            <Layout />
            <main className="flex-grow bg-[#f8f8fb] pb-24">
                <div className='max-w-8xl mx-auto px-24 gap-10 flex-col flex mt-16'>
                    <div className="flex gap-2 items-center">
                        <Link to={'/accounts'} className="border shadow px-6 py-2 bg-white rounded-md hover:bg-slate-200">
                            <span>Scholarships</span>
                        </Link>
                        <IoMdArrowDropdown className='-rotate-90 w-8 h-8 text-blue-600' />
                        <div className="border shadow px-6 py-2 bg-white rounded-md">
                            <span className="text-blue-600">{provider.scholarshipProviderDetails.organizationName}'s</span>
                        </div>
                    </div>

                    {provider.status === 'Pending Verification' ? (
                        <div className=" bg-white p-8 rounded-md shadow-md w-full">
                            <div className="text-lg font-bold bg-slate-200 border-2 px-4 py-2 rounded-md">Scholarship Provider Details</div>

                            <div className="grid grid-cols-3 gap-8 my-4 border-b pb-4">
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

                            <div className="text-lg font-bold bg-slate-200 border-2 px-4 py-2 rounded-md">Contact Information</div>

                            <div className="grid grid-cols-3 gap-8 my-4 border-b pb-4">
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

                            <div className="text-lg font-bold bg-slate-200 border-2 px-4 py-2 rounded-md">Documents</div>

                            <div className="grid grid-cols-3 gap-8 my-4 border-b pb-4">
                                <div className="">
                                    <label className="block text-sm font-medium text-slate-400">Registration Certificate</label>
                                    <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">{provider.registrationCertificate || 'Not Provided'}</span>
                                </div>
                                <div className="">
                                    <label className="block text-sm font-medium text-slate-400">TIN</label>
                                    <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">{provider.tin || 'Not Provided'}</span>
                                </div>
                                <div className="">
                                    <label className="block text-sm font-medium text-slate-400">Proof of Address</label>
                                    <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">{provider.proofOfAddress || 'Not Provided'}</span>
                                </div>
                                <div className="">
                                    <label className="block text-sm font-medium text-slate-400">Authorization Letter</label>
                                    <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">{provider.authorizationLetter || 'Not Provided'}</span>
                                </div>
                                <div className="">
                                    <label className="block text-sm font-medium text-slate-400">ID Proof of Contact Person</label>
                                    <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">{provider.idProofOfContactPerson || 'Not Provided'}</span>
                                </div>
                            </div>

                            <div className="flex justify-end gap-4 mt-6">
                                <button
                                    className="border shadow px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                    onClick={() => handleApprove(provider._id)}
                                >
                                    Approve
                                </button>
                                <button
                                    className="border shadow px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                    onClick={() => handleReject(provider._id)}
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    ) : (
                       <ProviderDetails />
                    )}
                </div>
            </main>
            {snackbar.visible && (
                <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-md shadow-md">
                    {snackbar.message}
                </div>
            )}
        </div>
    );
}