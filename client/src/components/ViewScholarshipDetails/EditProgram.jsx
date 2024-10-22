import React, { useEffect, useState } from 'react';
import { FaEdit, FaEye, FaCheckCircle, FaUndo } from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const EditProgram = () => {
    const { id } = useParams();
    console.log('id:', id);
    const scholarshipId = id;
    const { currentUser } = useSelector((state) => state.user);

    const [programDetails, setProgramDetails] = useState({});
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isUndoModalOpen, setIsUndoModalOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(true); // Define the loading state

    const fetchProgramDetails = async () => {
        try {
            const response = await fetch(`/api/scholarshipProgram/scholarship-programs/${id}`);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setProgramDetails(data);
        } catch (error) {
            console.error('Error fetching program details:', error);
            setErrorMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProgramDetails();
    }, [id]);

    const handleCompleteProgram = () => {
        setIsConfirmModalOpen(true);
    };

    const confirmCompleteProgram = async () => {
        try {
            const userId = currentUser._id;
            const username = currentUser.username;

            const response = await fetch(`/api/scholarshipProgram/scholarship-programs/${id}/complete`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, username })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setSuccessMessage('Scholarship program marked as complete successfully!');
            console.log('Scholarship program marked as complete:', data);
            setIsConfirmModalOpen(false);
            window.location.reload(); // Refresh the page
        } catch (error) {
            setErrorMessage('Error marking scholarship program as complete');
            console.error('Error marking scholarship program as complete:', error);
            setIsConfirmModalOpen(false);
        }
    };

    const cancelCompleteProgram = () => {
        setIsConfirmModalOpen(false);
    };

    const handleUndoCompleteProgram = () => {
        setIsUndoModalOpen(true);
    };

    const confirmUndoCompleteProgram = async () => {
        try {
            const userId = currentUser._id;
            const username = currentUser.username;

            const response = await fetch(`/api/scholarshipProgram/scholarship-programs/${id}/undo-complete`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, username })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setSuccessMessage('Scholarship program marked as ongoing successfully!');
            console.log('Scholarship program marked as ongoing:', data);
            setIsUndoModalOpen(false);
            window.location.reload(); // Refresh the page
        } catch (error) {
            setErrorMessage('Error marking scholarship program as ongoing');
            console.error('Error marking scholarship program as ongoing:', error);
            setIsUndoModalOpen(false);
        }
    };

    const cancelUndoCompleteProgram = () => {
        setIsUndoModalOpen(false);
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-3xl font-bold mb-6 text-blue-600">Edit Program</h2>
            <p className="text-gray-700 mb-6">
                Make changes to the scholarship program settings below.
            </p>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="space-y-8">
                    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                        <div className="flex items-center mb-4">
                            <FaEdit className="w-6 h-6 text-blue-600 mr-2" />
                            <h3 className="text-2xl font-semibold text-gray-800">Edit Scholarship Details</h3>
                        </div>
                        <p className="text-gray-600 mb-4">Update the scholarship details, including title, description, eligibility criteria, and more.</p>
                        <Link to={`/view-scholarships/${scholarshipId}/edit-program-details`} className="text-blue-600 hover:underline">
                            Go to Edit Scholarship Details
                        </Link>
                    </div>
                    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                        <div className="flex items-center mb-4">
                            <FaEye className="w-6 h-6 text-blue-600 mr-2" />
                            <h3 className="text-2xl font-semibold text-gray-800">Scholarship Web View</h3>
                        </div>
                        <p className="text-gray-600 mb-4">View the scholarship program as it appears to students on the web.</p>
                        <Link to={`/view-scholarships/${scholarshipId}/scholarship-web-view`} className="text-blue-600 hover:underline">
                            Go to Scholarship Web View
                        </Link>
                    </div>
                    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                        <div className="flex items-center mb-4">
                            <FaCheckCircle className="w-6 h-6 text-blue-600 mr-2" />
                            <h3 className="text-2xl font-semibold text-gray-800">Complete Scholarship Program</h3>
                        </div>
                        <p className="text-gray-600 mb-4">Mark the scholarship program as complete when all tasks are finished.</p>
                        {programDetails.status !== 'Completed' && (
                            <button
                                onClick={handleCompleteProgram}
                                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition ease-in-out"
                            >
                                Mark as Complete
                            </button>
                        )}
                        {programDetails.status === 'Completed' && (
                            <button
                                onClick={handleUndoCompleteProgram}
                                className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition ease-in-out mt-4 flex items-center"
                            >
                                <FaUndo className="mr-2" />
                                <span>Undo Completion</span>
                            </button>
                        )}
                        {successMessage && <p className="text-green-600 mt-4">{successMessage}</p>}
                        {errorMessage && <p className="text-red-600 mt-4">{errorMessage}</p>}
                    </div>
                </div>
            )}

            {isConfirmModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-md shadow-md">
                        <h3 className="text-xl font-bold mb-4">Confirm Completion</h3>
                        <p>Are you sure you want to mark this program as complete?</p>
                        <div className="mt-6 flex justify-end space-x-4">
                            <button
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
                                onClick={cancelCompleteProgram}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                                onClick={confirmCompleteProgram}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isUndoModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-md shadow-md">
                        <h3 className="text-xl font-bold mb-4">Confirm Undo Completion</h3>
                        <p>Are you sure you want to mark this program as ongoing?</p>
                        <div className="mt-6 flex justify-end space-x-4">
                            <button
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
                                onClick={cancelUndoCompleteProgram}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700"
                                onClick={confirmUndoCompleteProgram}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditProgram;