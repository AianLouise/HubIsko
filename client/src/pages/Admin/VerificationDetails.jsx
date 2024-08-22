import React, { useEffect, useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { Link, useParams } from "react-router-dom";
import Layout from "../../components/Layout";
import { FaFilePdf, FaFileWord, FaFileAlt } from 'react-icons/fa';

const getIconComponent = (fileName) => {
  const extension = fileName.split('.').pop().toLowerCase();
  switch (extension) {
    case 'pdf':
      return <FaFilePdf className="inline-block mr-2 text-red-500" />;
    case 'doc':
    case 'docx':
      return <FaFileWord className="inline-block mr-2 text-blue-500" />;
    default:
      return <FaFileAlt className="inline-block mr-2 text-gray-500" />;
  }
};

export default function VerificationDetails({ formData }) {
  const { id } = useParams(); // Extract the id parameter from the URL
  const [providerDetails, setProviderDetails] = useState(null);
  const [status, setStatus] = useState(providerDetails?.scholarshipProviderDetails.status);
  const [isVerified, setIsVerified] = useState(providerDetails?.scholarshipProviderDetails.status === 'verified');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProviderDetails = async () => {
      try {
        const response = await fetch(`/api/admin/scholarship-provider/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch provider details');
        }
        const data = await response.json();
        setProviderDetails(data.provider);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProviderDetails();
  }, [id]);

  const handleVerify = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/verify-scholarship-provider-status/${providerDetails._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setStatus(data.user.scholarshipProviderDetails.status);
      alert('Scholarship provider status verified successfully');
    } catch (error) {
      console.error('Error verifying scholarship provider status:', error);
      setError('Error verifying scholarship provider status');
    } finally {
      setLoading(false);
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [declineReason, setDeclineReason] = useState('');

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

  const handleSubmit = () => {
    // Handle the submit logic here
    console.log('Decline reason:', declineReason);
    handleModalClose();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-col min-h-screen font-medium text-slate-700">
      <Layout />
      <main className="flex-grow bg-[#f8f8fb] pb-24">

        <div className='max-w-8xl mx-auto px-24 gap-10 flex-col flex mt-16'>

          <div className="flex gap-2 items-center">
            <Link to={'/accounts'} className="border shadow px-6 py-2 bg-white rounded-md hover:bg-slate-200">
              <span>Accounts</span>
            </Link>
            <IoMdArrowDropdown className='-rotate-90 w-8 h-8 text-blue-600' />

            <div className="border shadow px-6 py-2 bg-white rounded-md">
              <span className="text-blue-600">{providerDetails ? `${providerDetails.scholarshipProviderDetails.organizationName}'s Details` : 'Loading...'}</span>
            </div>
          </div>

          <div className="mt-8 bg-white p-8 rounded-md shadow-md w-full">

            <div className="text-lg font-bold bg-slate-200 border-2 px-4 py-2 rounded-md">Scholarship Provider Information</div>

            <div className="mt-4">
              <div className="text-md font-semibold bg-slate-100 border px-4 py-2 rounded-md">Organization Details</div>
              <div className="grid grid-cols-2 gap-8 my-4 border-b pb-4">
                <div className="">
                  <label className="block text-sm font-medium text-slate-400">Organization Name</label>
                  <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">{providerDetails?.scholarshipProviderDetails.organizationName || 'N/A'}</span>
                </div>
                <div className="">
                  <label className="block text-sm font-medium text-slate-400">Organization Type</label>
                  <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">{providerDetails?.scholarshipProviderDetails.organizationType || 'N/A'}</span>
                </div>
                <div className="">
                  <label className="block text-sm font-medium text-slate-400">Registration Number</label>
                  <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">{providerDetails?.scholarshipProviderDetails.registrationNumber || 'N/A'}</span>
                </div>
                <div className="">
                  <label className="block text-sm font-medium text-slate-400">Website</label>
                  <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">{providerDetails?.scholarshipProviderDetails.website || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <div className="text-md font-semibold bg-slate-100 border px-4 py-2 rounded-md">Contact Details</div>
              <div className="grid grid-cols-2 gap-8 my-4 border-b pb-4">
                <div className="">
                  <label className="block text-sm font-medium text-slate-400">Contact Person Name</label>
                  <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">{providerDetails?.scholarshipProviderDetails.contactPersonName || 'N/A'}</span>
                </div>
                <div className="">
                  <label className="block text-sm font-medium text-slate-400">Contact Person Position</label>
                  <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">{providerDetails?.scholarshipProviderDetails.contactPersonPosition || 'N/A'}</span>
                </div>
                <div className="">
                  <label className="block text-sm font-medium text-slate-400">Contact Person Number</label>
                  <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">{providerDetails?.scholarshipProviderDetails.contactPersonNumber || 'N/A'}</span>
                </div>
                <div className="">
                  <label className="block text-sm font-medium text-slate-400">Email</label>
                  <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">{providerDetails?.email || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <div className="text-md font-semibold bg-slate-100 border px-4 py-2 rounded-md">Address Details</div>
              <div className="grid grid-cols-2 gap-8 my-4 border-b pb-4">
                <div className="">
                  <label className="block text-sm font-medium text-slate-400">Street Address</label>
                  <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">{providerDetails?.scholarshipProviderDetails.streetAddress || 'N/A'}</span>
                </div>
                <div className="">
                  <label className="block text-sm font-medium text-slate-400">City</label>
                  <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">{providerDetails?.scholarshipProviderDetails.city || 'N/A'}</span>
                </div>
                <div className="">
                  <label className="block text-sm font-medium text-slate-400">State</label>
                  <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">{providerDetails?.scholarshipProviderDetails.state || 'N/A'}</span>
                </div>
                <div className="">
                  <label className="block text-sm font-medium text-slate-400">Postal Code</label>
                  <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">{providerDetails?.scholarshipProviderDetails.postalCode || 'N/A'}</span>
                </div>
                <div className="">
                  <label className="block text-sm font-medium text-slate-400">Country</label>
                  <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">{providerDetails?.scholarshipProviderDetails.country || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <div className="text-md font-semibold bg-slate-100 border px-4 py-2 rounded-md">Requirements Uploaded</div>
              <div className="grid grid-cols-2 gap-8 my-4 border-b pb-4">
                <div className="flex flex-col items-center">
                  <label className="block text-sm font-medium text-slate-400">Tax Identification Number (TIN)</label>
                  {providerDetails?.scholarshipProviderDetails.tin ? (
                    /\.(jpg|jpeg|png|gif)(\?.*)?$/i.test(providerDetails.scholarshipProviderDetails.tin) ? (
                      <a href={providerDetails.scholarshipProviderDetails.tin} target="_blank" rel="noopener noreferrer">
                        <img
                          src={providerDetails.scholarshipProviderDetails.tin}
                          alt="Tax Identification Number (TIN)"
                          className="mt-1 block border border-gray-300 rounded-md"
                          style={{ width: '250px', height: '250px', objectFit: 'cover' }}
                        />
                      </a>
                    ) : (
                      <a
                        href={providerDetails.scholarshipProviderDetails.tin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 border border-gray-300 rounded-md flex flex-col items-center justify-center"
                        style={{ width: '250px', height: '250px' }}
                      >
                        {getIconComponent(providerDetails.scholarshipProviderDetails.tin)}
                        <span className="text-blue-500 underline">View Document</span>
                      </a>
                    )
                  ) : (
                    <span className="mt-1 block text-gray-500">No document uploaded</span>
                  )}
                </div>
                <div className="flex flex-col items-center">
                  <label className="block text-sm font-medium text-slate-400">Proof of Address</label>
                  {providerDetails?.scholarshipProviderDetails.proofOfAddress ? (
                    /\.(jpg|jpeg|png|gif)(\?.*)?$/i.test(providerDetails.scholarshipProviderDetails.proofOfAddress) ? (
                      <a href={providerDetails.scholarshipProviderDetails.proofOfAddress} target="_blank" rel="noopener noreferrer">
                        <img
                          src={providerDetails.scholarshipProviderDetails.proofOfAddress}
                          alt="Proof of Address"
                          className="mt-1 block border border-gray-300 rounded-md"
                          style={{ width: '250px', height: '250px', objectFit: 'cover' }}
                        />
                      </a>
                    ) : (
                      <a
                        href={providerDetails.scholarshipProviderDetails.proofOfAddress}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 border border-gray-300 rounded-md flex flex-col items-center justify-center"
                        style={{ width: '250px', height: '250px' }}
                      >
                        {getIconComponent(providerDetails.scholarshipProviderDetails.proofOfAddress)}
                        <span className="text-blue-500 underline">View Document</span>
                      </a>
                    )
                  ) : (
                    <span className="mt-1 block text-gray-500">No document uploaded</span>
                  )}
                </div>
                <div className="flex flex-col items-center">
                  <label className="block text-sm font-medium text-slate-400">Authorization Letter</label>
                  {providerDetails?.scholarshipProviderDetails.authorizationLetter ? (
                    /\.(jpg|jpeg|png|gif)(\?.*)?$/i.test(providerDetails.scholarshipProviderDetails.authorizationLetter) ? (
                      <a href={providerDetails.scholarshipProviderDetails.authorizationLetter} target="_blank" rel="noopener noreferrer">
                        <img
                          src={providerDetails.scholarshipProviderDetails.authorizationLetter}
                          alt="Authorization Letter"
                          className="mt-1 block border border-gray-300 rounded-md"
                          style={{ width: '250px', height: '250px', objectFit: 'cover' }}
                        />
                      </a>
                    ) : (
                      <a
                        href={providerDetails.scholarshipProviderDetails.authorizationLetter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 border border-gray-300 rounded-md flex flex-col items-center justify-center"
                        style={{ width: '250px', height: '250px' }}
                      >
                        {getIconComponent(providerDetails.scholarshipProviderDetails.authorizationLetter)}
                        <span className="text-blue-500 underline">View Document</span>
                      </a>
                    )
                  ) : (
                    <span className="mt-1 block text-gray-500">No document uploaded</span>
                  )}
                </div>
                <div className="flex flex-col items-center">
                  <label className="block text-sm font-medium text-slate-400">ID Proof of Contact Person</label>
                  {providerDetails?.scholarshipProviderDetails.idProofContactPerson ? (
                    /\.(jpg|jpeg|png|gif)(\?.*)?$/i.test(providerDetails.scholarshipProviderDetails.idProofContactPerson) ? (
                      <a href={providerDetails.scholarshipProviderDetails.idProofContactPerson} target="_blank" rel="noopener noreferrer">
                        <img
                          src={providerDetails.scholarshipProviderDetails.idProofContactPerson}
                          alt="ID Proof of Contact Person"
                          className="mt-1 block border border-gray-300 rounded-md"
                          style={{ width: '250px', height: '250px', objectFit: 'cover' }}
                        />
                      </a>
                    ) : (
                      <a
                        href={providerDetails.scholarshipProviderDetails.idProofContactPerson}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 border border-gray-300 rounded-md flex flex-col items-center justify-center"
                        style={{ width: '250px', height: '250px' }}
                      >
                        {getIconComponent(providerDetails.scholarshipProviderDetails.idProofContactPerson)}
                        <span className="text-blue-500 underline">View Document</span>
                      </a>
                    )
                  ) : (
                    <span className="mt-1 block text-gray-500">No document uploaded</span>
                  )}
                </div>
                <div className="flex flex-col items-center">
                  <label className="block text-sm font-medium text-slate-400">Registration Certificate</label>
                  {providerDetails?.scholarshipProviderDetails.registrationCertificate ? (
                    /\.(jpg|jpeg|png|gif)(\?.*)?$/i.test(providerDetails.scholarshipProviderDetails.registrationCertificate) ? (
                      <a href={providerDetails.scholarshipProviderDetails.registrationCertificate} target="_blank" rel="noopener noreferrer">
                        <img
                          src={providerDetails.scholarshipProviderDetails.registrationCertificate}
                          alt="Registration Certificate"
                          className="mt-1 block border border-gray-300 rounded-md"
                          style={{ width: '250px', height: '250px', objectFit: 'cover' }}
                        />
                      </a>
                    ) : (
                      <a
                        href={providerDetails.scholarshipProviderDetails.registrationCertificate}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1  border border-gray-300 rounded-md flex flex-col items-center justify-center"
                        style={{ width: '250px', height: '250px' }}
                      >
                        {getIconComponent(providerDetails.scholarshipProviderDetails.registrationCertificate)}
                        <span className="text-blue-500 underline">View Document</span>
                      </a>
                    )
                  ) : (
                    <span className="mt-1 block text-gray-500">No document uploaded</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              {isVerified && (
                <>
                  <button
                    type="button"
                    className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-800"
                    onClick={handleVerify}
                  >
                    Verify
                  </button>
                  <button
                    type="button"
                    className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-700"
                    onClick={handleDeclineClick}
                  >
                    Decline
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </main >

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">Reason for Decline</h2>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md"
              rows="4"
              value={declineReason}
              onChange={handleReasonChange}
              placeholder="What is the reason for declining this verification?"
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
      )
      }

    </div >
  );
}