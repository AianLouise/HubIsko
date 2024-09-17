import React from 'react';
import { FaEdit } from 'react-icons/fa';
import { FaEye } from 'react-icons/fa6';
import { Link, useParams } from 'react-router-dom';

const EditProgram = () => {
    const id = useParams();
    const scholarshipId = id.id;
    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
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
            </div>
        </div>
    );
};

export default EditProgram;