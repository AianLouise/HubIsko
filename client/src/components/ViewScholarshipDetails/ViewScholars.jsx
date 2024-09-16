import React from 'react';
import { Link } from 'react-router-dom';

export default function ViewScholars({ scholars, numberOfScholarships, numberOfScholarshipsSlotFilled, approvedScholars }) {
    return (
        <div className="p-6 bg-white rounded-lg shadow-md space-y-4 relative h-screen">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-blue-600">View Scholars</h2>
                <div className="flex flex-col items-end text-gray-700">
                    <div>
                        <strong>Slots Filled:</strong> {approvedScholars}
                    </div>
                    <div>
                        <strong>Total Scholarship Slot:</strong> {numberOfScholarships}
                    </div>
                </div>
            </div>

            <p className="text-gray-700">
                Here is the list of scholars enrolled in the program.
            </p>

            <div className='rounded-lg shadow-md border'>
                <table className="min-w-full">
                    <thead>
                        <tr className='text-blue-600'>
                            <th className="py-2 px-4 border-b">Name</th>
                            <th className="py-2 px-4 border-b">Course</th>
                            <th className="py-2 px-4 border-b">Year</th>
                            <th className="py-2 px-4 border-b">Actions</th>
                        </tr>
                    </thead>
                    <tbody className='text-center'>
                        {scholars.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="py-2 px-4 border-b text-gray-500">No scholars found.</td>
                            </tr>
                        ) : (
                            scholars.map((scholar) => (
                                <tr key={scholar._id} className="hover:bg-gray-100">
                                    <td className="py-2 px-4 border-b"><strong>{scholar.applicationDetails.firstName} {scholar.applicationDetails.lastName}</strong></td>
                                    <td className="py-2 px-4 border-b">{scholar.applicationDetails.education.college.course}</td>
                                    <td className="py-2 px-4 border-b">{scholar.applicationDetails.education.college.yearGraduated || 'N/A'}</td>
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
    );
}