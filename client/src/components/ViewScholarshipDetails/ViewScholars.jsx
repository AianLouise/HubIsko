import React, { useState } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { FaUsers } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import { BiFilter } from 'react-icons/bi';

export default function ViewScholars({ scholars, numberOfScholarships, numberOfScholarshipsSlotFilled, approvedScholars }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState('A-Z');

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const toggleSortOrder = () => {
        setSortOrder((prevSortOrder) => (prevSortOrder === 'A-Z' ? 'Z-A' : 'A-Z'));
    };

    const filteredScholars = scholars
        .filter((scholar) => {
            const fullName = `${scholar.applicationDetails.applicant.applicantDetails.lastName}, ${scholar.applicationDetails.applicant.applicantDetails.firstName} ${scholar.applicationDetails.applicant.applicantDetails.middleName ? scholar.applicationDetails.applicant.applicantDetails.middleName.charAt(0) + '.' : ''}`.toLowerCase();
            return fullName.includes(searchQuery.toLowerCase());
        })
        .sort((a, b) => {
            const nameA = `${a.applicationDetails.applicant.applicantDetails.lastName}, ${a.applicationDetails.applicant.applicantDetails.firstName} ${a.applicationDetails.applicant.applicantDetails.middleName ? a.applicationDetails.applicant.applicantDetails.middleName.charAt(0) + '.' : ''}`.toLowerCase();
            const nameB = `${b.applicationDetails.applicant.applicantDetails.lastName}, ${b.applicationDetails.applicant.applicantDetails.firstName} ${b.applicationDetails.applicant.applicantDetails.middleName ? b.applicationDetails.applicant.applicantDetails.middleName.charAt(0) + '.' : ''}`.toLowerCase();
            if (sortOrder === 'A-Z') {
                return nameA.localeCompare(nameB);
            } else {
                return nameB.localeCompare(nameA);
            }
        });

    return (
        <div className='h-screen'>
            <div className="p-6 bg-white rounded-lg shadow-md space-y-4 relative">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-blue-600">View Scholars</h2>
                        <p className="text-gray-700">
                            Here is the list of scholars enrolled in the program.
                        </p>
                    </div>
                    <div className="flex flex-col items-end text-gray-700 bg-white p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <FaCheckCircle className="text-blue-600 w-5 h-5" />
                            <strong className="text-gray-900">Slots Filled:</strong>
                            <span className="text-lg font-semibold text-blue-600">{approvedScholars}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FaUsers className="text-blue-600 w-5 h-5" />
                            <strong className="text-gray-900">Total Scholarship Slot:</strong>
                            <span className="text-lg font-semibold text-blue-600">{numberOfScholarships}</span>
                        </div>
                    </div>
                </div>

                <div className="mb-4 flex justify-between items-center">
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
                            <span>{sortOrder === 'A-Z' ? 'Sort Z-A' : 'Sort A-Z'}</span>
                        </button>
                    </div>
                </div>

                <div className='rounded-lg shadow-md border'>
                    <table className="min-w-full">
                        <thead>
                            <tr className='text-blue-600'>
                                <th className="py-2 px-4 border-b">Name</th>
                                <th className="py-2 px-4 border-b">Course</th>
                                <th className="py-2 px-4 border-b">Actions</th>
                            </tr>
                        </thead>
                        <tbody className='text-center'>
                            {filteredScholars.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="py-2 px-4 border-b text-gray-500">No scholars found.</td>
                                </tr>
                            ) : (
                                filteredScholars.map((scholar) => (
                                    <tr key={scholar._id} className="hover:bg-gray-100">
                                        <td className="py-2 px-4 border-b">
                                            {`${scholar.applicationDetails.applicant.applicantDetails.lastName}, ${scholar.applicationDetails.applicant.applicantDetails.firstName} ${scholar.applicationDetails.applicant.applicantDetails.middleName ? scholar.applicationDetails.applicant.applicantDetails.middleName.charAt(0) + '.' : ''}`}
                                        </td>
                                        <td className="py-2 px-4 border-b">{scholar.applicationDetails.applicant.applicantDetails.education.college.course}</td>
                                        <td className="py-2 px-4 border-b">
                                            <Link to={`/scholar-view/${scholar.applicationDetails._id}`} className="text-white bg-blue-600 px-4 py-1 rounded-md hover:bg-blue-800">
                                                View Details
                                            </Link>
                                        </td>
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