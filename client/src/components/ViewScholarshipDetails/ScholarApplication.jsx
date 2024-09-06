import React from 'react';
import { Link } from 'react-router-dom';

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

export default function ScholarApplication( { applications, error } ) {
    
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
    <h2 className="text-2xl font-bold mb-4 text-blue-600">Scholar Applications</h2>
    <p className="text-gray-700 mb-5">
        Manage and review applications from scholars here.
    </p>

    <div className='bg-white rounded-lg shadow-md border'>
        <table className="min-w-full">
            <thead>
                <tr className='text-blue-600'>
                    <th className="py-2 px-4 border-b text-center">Name</th>
                    <th className="py-2 px-4 border-b text-center">Status</th>
                    <th className="py-2 px-4 border-b text-center">Submission Date</th>
                    <th className="py-2 px-4 border-b text-center">Actions</th>
                </tr>
            </thead>
            <tbody>
                {error ? (
                    <tr>
                        <td colSpan="4" className="py-2 px-4 border-b text-center text-red-600">
                            {error}
                        </td>
                    </tr>
                ) : applications.length === 0 ? (
                    <tr>
                        <td colSpan="4" className="py-2 px-4 border-b text-center">
                            No applications found for this scholarship program.
                        </td>
                    </tr>
                ) : (
                    applications.map(application => (
                        <tr key={application._id} className="hover:bg-gray-100">
                            <td className="py-2 px-4 border-b text-center">{`${application.firstName} ${application.lastName}`}</td>
                            <td className="py-2 px-4 border-b text-center">
                                <span className={`inline-block w-3 h-3 mr-2 rounded-full ${getStatusColor(application.applicationStatus)}`}></span>
                                {toSentenceCase(application.applicationStatus)}
                            </td>
                            <td className="py-2 px-4 border-b text-center">{new Date(application.submissionDate).toLocaleDateString()}</td>
                            <td className="py-2 px-4 border-b text-center">
                                <Link to={`/applications/${application._id}`} className="text-white bg-blue-600 px-4 py-1 rounded-md hover:bg-blue-800">
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
  )
}
