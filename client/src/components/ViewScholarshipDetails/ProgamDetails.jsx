import React from 'react'
import { FaCheckCircle, FaTimesCircle, FaExclamationCircle } from 'react-icons/fa';

export default function ProgamDetails( { scholarshipProgram } ) {
    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <div className="flex items-center mb-4">
                <span className={`flex items-center px-3 py-1 rounded-full text-white font-semibold ${scholarshipProgram.status === 'Active' ? 'bg-green-500' :
                    scholarshipProgram.status === 'Inactive' ? 'bg-red-500' :
                        scholarshipProgram.status === 'Pending Approval' ? 'bg-yellow-500' :
                            scholarshipProgram.status === 'Approved' ? 'bg-blue-500' :
                                scholarshipProgram.status === 'Declined' ? 'bg-gray-500' :
                                    scholarshipProgram.status === 'Closed' ? 'bg-purple-500' :
                                        scholarshipProgram.status === 'Archived' ? 'bg-brown-500' :
                                            scholarshipProgram.status === 'Cancelled' ? 'bg-orange-500' :
                                                scholarshipProgram.status === 'Completed' ? 'bg-teal-500' :
                                                    'bg-yellow-500'
                    }`}>
                    {scholarshipProgram.status === 'Active' && <FaCheckCircle className="mr-2" />}
                    {scholarshipProgram.status === 'Inactive' && <FaTimesCircle className="mr-2" />}
                    {scholarshipProgram.status === 'Pending Approval' && <FaExclamationCircle className="mr-2" />}
                    {scholarshipProgram.status === 'Approved' && <FaCheckCircle className="mr-2" />}
                    {scholarshipProgram.status === 'Declined' && <FaTimesCircle className="mr-2" />}
                    {scholarshipProgram.status === 'Closed' && <FaExclamationCircle className="mr-2" />}
                    {scholarshipProgram.status === 'Archived' && <FaExclamationCircle className="mr-2" />}
                    {scholarshipProgram.status === 'Cancelled' && <FaTimesCircle className="mr-2" />}
                    {scholarshipProgram.status === 'Completed' && <FaCheckCircle className="mr-2" />}
                    {scholarshipProgram.status}
                </span>
            </div>
            <h2 className="text-2xl font-bold mb-4">Program Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-100 p-4 rounded-lg">
                    <strong>Scholarship Title:</strong> {scholarshipProgram.title}
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                    <strong>Amount:</strong> {scholarshipProgram.amount}
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                    <strong>Slots Filled:</strong> {scholarshipProgram.numberOfScholarshipsSlotFilled}
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                    <strong>Total Slots:</strong> {scholarshipProgram.numberOfScholarships}
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                    <strong>Duration:</strong> {scholarshipProgram.renewalDuration}
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                    <strong>Category:</strong> {scholarshipProgram.category}
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                    <strong>Type:</strong> {scholarshipProgram.selectionProcess}
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                    <strong>Academic Requirements:</strong> {scholarshipProgram.minGPA}
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                    <strong>Field of Study:</strong> {scholarshipProgram.fieldOfStudy}
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                    <strong>Level of Education:</strong> {scholarshipProgram.selectionCriteria}
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                    <strong>Location:</strong> {scholarshipProgram.nationality}
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                    <strong>Application Start Date:</strong> {new Date(scholarshipProgram.startDate).toLocaleDateString()}
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                    <strong>Application End Date:</strong> {new Date(scholarshipProgram.endDate).toLocaleDateString()}
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                    <strong>Notification Date:</strong> {new Date(scholarshipProgram.applicationDeadline).toLocaleDateString()}
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                    <strong>Coverage:</strong> {scholarshipProgram.renewalPolicy}
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                    <strong>Contact Person:</strong> {scholarshipProgram.contactEmail}
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                    <strong>Status:</strong> {scholarshipProgram.status}
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                    <strong>Date Posted:</strong> {new Date(scholarshipProgram.startDate).toLocaleDateString()}
                </div>
            </div>
            {/* Additional details can be included here */}
        </div>
    )
}
