import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BiFilter } from 'react-icons/bi';
import { FaCheckCircle } from 'react-icons/fa';
import { FaUsers } from 'react-icons/fa6';

const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
        case 'pending':
            return 'bg-yellow-500';
        case 'approved':
            return 'bg-green-500';
        case 'rejected':
            return 'bg-red-500';
        case 'completed':
            return 'bg-blue-500';
        default:
            return 'bg-gray-500';
    }
};

const toSentenceCase = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export default function ScholarApplication({ applications, error }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState('oldest'); // Default to 'oldest'

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const toggleSortOrder = () => {
        setSortOrder((prevOrder) => (prevOrder === 'recent' ? 'oldest' : 'recent'));
    };

    const filteredApplications = applications
        .filter(application =>
            `${application.applicant.applicantDetails.firstName} ${application.applicant.applicantDetails.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => {
            if (sortOrder === 'recent') {
                return new Date(b.submissionDate) - new Date(a.submissionDate);
            } else {
                return new Date(a.submissionDate) - new Date(b.submissionDate);
            }
        });

    const totalApplications = applications.length;
    const approvedApplications = applications.filter(application => application.applicationStatus.toLowerCase() === 'approved').length;

    return (
        <div className='h-screen'>
            <div className="p-6 bg-white rounded-lg shadow-md space-y-4 relative">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className="text-2xl font-bold mb-4 text-blue-600">Scholar Applications</h2>
                        <p className="text-gray-700 mb-5">
                            Manage and review applications from scholars here.
                        </p>
                    </div>
                    <div className="flex flex-col items-end text-gray-700 bg-white p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <FaCheckCircle className="text-blue-600 w-5 h-5" />
                            <strong className="text-gray-900">Approved Applications:</strong>
                            <span className="text-lg font-semibold text-blue-600">{approvedApplications}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FaUsers className="text-blue-600 w-5 h-5" />
                            <strong className="text-gray-900">Total Applications:</strong>
                            <span className="text-lg font-semibold text-blue-600">{totalApplications}</span>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between mb-4">
                    <input
                        type="text"
                        placeholder="Search by name..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="border p-2 rounded-md w-full lg:w-1/2"
                    />
                    <div className=''>
                        <button
                            className='flex gap-2 bg-white hover:bg-slate-200 px-6 py-2 border shadow rounded-md'
                            onClick={toggleSortOrder}
                        >
                            <BiFilter className='w-6 h-6 text-blue-600' />
                            <span>{sortOrder === 'recent' ? 'Sort by Oldest' : 'Sort by Recent'}</span>
                        </button>
                    </div>
                </div>

                <div className='bg-white rounded-lg shadow-md border'>
                    <table className="min-w-full">
                        <thead>
                            <tr className='text-blue-600'>
                                <th className="py-2 px-4 border-b text-center">Name</th>
                                <th className="py-2 px-4 border-b text-center">Status</th>
                                <th className="py-2 px-4 border-b text-center">Submission Date</th>
                                {/* <th className="py-2 px-4 border-b text-center">Actions</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {error ? (
                                <tr>
                                    <td colSpan="4" className="py-2 px-4 border-b text-center text-red-600">
                                        {error}
                                    </td>
                                </tr>
                            ) : filteredApplications.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="py-2 px-4 border-b text-center">
                                        No applications found for this scholarship program.
                                    </td>
                                </tr>
                            ) : (
                                filteredApplications.map(application => (
                                    <tr key={application._id} className="hover:bg-gray-100">
                                        <td className="py-2 px-4 border-b text-center">
                                            {`${application.applicant.applicantDetails.lastName}, ${application.applicant.applicantDetails.firstName} ${application.applicant.applicantDetails.middleName ? application.applicant.applicantDetails.middleName.charAt(0) + '.' : ''}`}
                                        </td>
                                        <td className="py-2 px-4 border-b text-center">
                                            <span className={`inline-block w-3 h-3 mr-2 rounded-full ${getStatusColor(application.applicationStatus)}`}></span>
                                            {toSentenceCase(application.applicationStatus)}
                                        </td>
                                        <td className="py-2 px-4 border-b text-center">{new Date(application.submissionDate).toLocaleDateString()}</td>
                                        {/* <td className="py-2 px-4 border-b text-center">
                                            <Link to={`/applications/${application._id}`} className="text-white bg-blue-600 px-4 py-1 rounded-md hover:bg-blue-800">
                                                View Application
                                            </Link>
                                        </td> */}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}