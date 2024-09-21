import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import { BsArrowLeft } from 'react-icons/bs';

Modal.setAppElement('#root'); // Set the app element for accessibility

const ValidationResult = () => {
    const { id } = useParams(); // Get the validation ID from the URL
    const navigate = useNavigate();
    const [validation, setValidation] = useState(null);
    const [scholars, setScholars] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalAction, setModalAction] = useState(null);
    const [modalResultId, setModalResultId] = useState(null);
    const [feedback, setFeedback] = useState(""); // State for feedback input
    const [errorMessage, setErrorMessage] = useState(""); // State for error message

    // Fetch the validation results based on the validation ID from the URL
    const fetchValidationResults = async () => {
        try {
            const response = await fetch(`/api/validation/${id}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setValidation(data);
            setScholars(data.validationResults || []);
        } catch (error) {
            console.error('Error fetching validation results:', error);
        }
    };

    useEffect(() => {
        fetchValidationResults();
    }, [id]);

    const openModal = (action, resultId) => {
        setModalAction(action);
        setModalResultId(resultId);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalAction(null);
        setModalResultId(null);
    };

    const handleConfirmAction = async () => {
        if (modalAction === 'Mark as Done') {
            const hasPendingScholars = scholars.some(scholar => scholar.status === 'Pending');

            if (hasPendingScholars) {
                setErrorMessage("Cannot mark as done while there are pending scholars.");
                closeModal();
                return;
            } else {
                setErrorMessage(""); // Clear the message if there are no pending scholars
            }
        }

        let endpoint;
        if (modalAction === 'Mark as Done') {
            endpoint = `/api/validation/${id}/done`;
        } else {
            endpoint = `/api/validation/${id}/result/${modalResultId}/${modalAction.toLowerCase()}`;
        }

        const body = { feedback: modalAction === 'Reject' ? feedback : null };

        try {
            const response = await fetch(endpoint, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log(data.message);

            await fetchValidationResults();
        } catch (error) {
            console.error('Error updating validation result:', error);
        }

        closeModal();
    };


    const handleBackClick = () => {
        navigate(-1);
    };

    const handleMarkAsDone = async () => {
        try {
            const response = await fetch(`/api/validation/${id}/done`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('Validation marked as complete:', data.message);

            await fetchValidationResults();
        } catch (error) {
            console.error('Error marking validation as complete:', error);
        }
    };

    if (!validation) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-grow bg-[#f8f8fb] transition-all duration-200 ease-in-out">
                <div className="max-w-8xl mx-24 mt-6">
                    <div className='flex justify-between items-center font-medium mb-4'>
                        <div className='flex gap-2'>
                            <button
                                onClick={handleBackClick}
                                className='text-blue-600 flex gap-2 items-center hover:bg-slate-200 bg-white shadow rounded-md border px-6 py-2'
                            >
                                <BsArrowLeft className='w-6 h-6' /> Back to Scholarship
                            </button>
                        </div>
                        <button
                            onClick={() => openModal('Mark as Done')}
                            className='bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-800'
                        >
                            Mark as Done
                        </button>
                    </div>
                    <div className="flex justify-end">
                        {errorMessage && (
                            <div className="mb-4 text-red-600">
                                {errorMessage}
                            </div>
                        )}
                    </div>

                    <div key={validation._id} className='bg-white border-l-4 border-l-blue-500 text-black-700 p-6 rounded-md border shadow relative mb-6'>
                        <div className='flex justify-between items-center mb-4'>
                            <h3 className='text-xl font-semibold'>{validation.validationTitle}</h3>
                            <span className={`inline-block px-3 py-1 rounded-full text-white ${validation.status === 'posted' ? 'bg-green-600' : 'bg-blue-600'}`}>
                                Status: {validation.status}
                            </span>
                        </div>
                        <p className='mb-4 text-gray-700'>{validation.validationDescription}</p>
                        <div className='mb-4'>
                            <p className='font-medium text-gray-800'>Requirements Needed:</p>
                            <ul className='list-disc pl-5'>
                                {validation.requirements?.map((req, index) => (
                                    <li key={index} className='mb-2 text-gray-700'>
                                        {req.requirement}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className='mb-4'>
                            <p className='font-medium text-gray-800'>Validation Method: {validation.validationMethod}</p>
                            {validation.validationMethod === 'Face-to-Face' && validation.faceToFaceDetails && (
                                <div className='pl-5 mt-2'>
                                    <p className='text-gray-700'>Date & Time: {validation.faceToFaceDetails.sessionDate}</p>
                                    <p className='text-gray-700'>Location: {validation.faceToFaceDetails.location}</p>
                                </div>
                            )}
                            {validation.validationMethod === 'Courier-Based' && validation.courierDetails && (
                                <div className='pl-5 mt-2'>
                                    <p className='text-gray-700'>Mailing Address: {validation.courierDetails.mailingAddress}</p>
                                    <p className='text-gray-700'>Recipient Name: {validation.courierDetails.recipientName}</p>
                                    <p className='text-gray-700'>Recipient Contact: {validation.courierDetails.recipientContact}</p>
                                    <p className='text-gray-700'>Submission Deadline: {new Date(validation.courierDetails.submissionDeadline).toLocaleDateString()}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="w-full h-full min-h-screen">
                        <div className="flex flex-col justify-between h-full border rounded-md bg-white w-full">
                            <table className="min-w-full divide-y border-b divide-gray-200 text">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Scholar</th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Mark as</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {scholars.map((result) => (
                                        <tr key={result._id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <div className="flex items-center justify-center">
                                                    <img
                                                        src={result.scholar.profilePicture}
                                                        alt={`${result.scholar.applicantDetails.firstName} ${result.scholar.applicantDetails.lastName}`}
                                                        className="w-8 h-8 rounded-full mr-2"
                                                    />
                                                    <span>{`${result.scholar.applicantDetails.firstName} ${result.scholar.applicantDetails.lastName}`}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <div className="flex items-center justify-center">
                                                    <div className={`w-4 h-4 rounded-full inline-block
                                                        ${result.status === 'Pending' ? 'bg-yellow-500'
                                                            : result.status === 'Approved' ? 'bg-green-500'
                                                                : 'bg-red-500'}`}>
                                                    </div>
                                                    <span className="ml-2">{result.status}</span>
                                                </div>
                                            </td>
                                            <td className="flex gap-2 px-6 py-4 whitespace-nowrap justify-center">
                                                {result.status === 'Pending' ? (
                                                    <>
                                                        <button
                                                            className="bg-green-600 text-white px-4 py-1 rounded-full hover:bg-green-900"
                                                            onClick={() => openModal('Approve', result._id)}
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            className="bg-red-600 text-white px-4 py-1 rounded-full hover:bg-red-900"
                                                            onClick={() => openModal('Reject', result._id)}
                                                        >
                                                            Reject
                                                        </button>
                                                    </>
                                                ) : (
                                                    <span className="text-gray-500">
                                                        {result.status === 'Approved' ? 'Approved' : 'Rejected'}
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <Modal
                    isOpen={isModalOpen}
                    onRequestClose={closeModal}
                    className="fixed inset-0 flex items-center justify-center z-50"
                    overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-40"
                >
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md z-50">
                        <h2 className="text-xl font-semibold mb-4 text-gray-900">
                            {modalAction} Validation Result
                        </h2>
                        {modalAction === 'Reject' && (
                            <p className="text-gray-600">Are you sure you want to reject this scholar?</p>
                        )}
                        {modalAction === 'Approve' && (
                            <p className="text-gray-600">Are you sure you want to approve this scholar?</p>
                        )}
                        {modalAction === 'Mark as Done' && (
                            <p className="text-gray-600">Please confirm that you want to mark this validation result as done.</p>
                        )}
                        {modalAction === 'Reject' && (
                            <div className="mt-4">
                                <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-1">
                                    Feedback <span className="text-gray-500">(optional):</span>
                                </label>
                                <textarea
                                    id="feedback"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    rows="4"
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    placeholder="Provide feedback on the rejection here..."
                                />
                            </div>
                        )}
                        <div className="mt-6 flex justify-end space-x-2">
                            <button
                                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md transition duration-150 ease-in-out"
                                onClick={closeModal}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-150 ease-in-out"
                                onClick={handleConfirmAction}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </Modal>
            </main>
        </div>
    );
};

export default ValidationResult;