import React, { useEffect, useState } from 'react';
import { FaEdit, FaEye } from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const EditProgram = () => {
    const { id } = useParams();
    console.log('id:', id);
    const scholarshipId = id;
    const { currentUser } = useSelector((state) => state.user);

    const [programDetails, setProgramDetails] = useState({});

    const fetchProgramDetails = async () => {
        try {
            const response = await fetch(`/api/scholarshipProgram/scholarship-programs/${id}`);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setProgramDetails(data);
        } catch (error) {
            console.error('Error fetching program details:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProgramDetails();
    }, [id]);

    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleCompleteProgram = async () => {
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
            window.location.reload();
        } catch (error) {
            setErrorMessage('Error marking scholarship program as complete');
            console.error('Error marking scholarship program as complete:', error);
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-3xl font-bold mb-6 text-blue-600">Edit Program</h2>
            <p className="text-gray-700 mb-6">
                Make changes to the scholarship program settings below.
            </p>
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
                {currentUser.role === 'admin' && programDetails.status !== 'Completed' && (
                    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                        <div className="flex items-center mb-4">
                            <FaEdit className="w-6 h-6 text-blue-600 mr-2" />
                            <h3 className="text-2xl font-semibold text-gray-800">Complete Scholarship Program</h3>
                        </div>
                        <p className="text-gray-600 mb-4">Mark the scholarship program as complete when all tasks are finished.</p>
                        <button
                            onClick={handleCompleteProgram}
                            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition ease-in-out"
                        >
                            Mark as Complete
                        </button>
                        {successMessage && <p className="text-green-600 mt-4">{successMessage}</p>}
                        {errorMessage && <p className="text-red-600 mt-4">{errorMessage}</p>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EditProgram;