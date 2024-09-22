import React from 'react'
import { FaCheckCircle, FaTimesCircle, FaExclamationCircle } from 'react-icons/fa';

export default function ProgamDetails({ scholarshipProgram }) {
    return (
        <div className="p-6 bg-white rounded-lg shadow-md">

            <div className="flex items-center mb-4">
                <span className={`flex items-center px-3 py-1 rounded-full text-white font-semibold ${scholarshipProgram.status === 'Pending Approval' ? 'bg-yellow-500' :
                    scholarshipProgram.status === 'Approved' ? 'bg-blue-500' :
                        scholarshipProgram.status === 'Published' ? 'bg-indigo-500' :
                            scholarshipProgram.status === 'Ongoing' ? 'bg-teal-500' :
                                scholarshipProgram.status === 'Rejected' ? 'bg-red-500' :
                                    scholarshipProgram.status === 'Archived' ? 'bg-gray-500' :
                                        scholarshipProgram.status === 'Cancelled' ? 'bg-orange-500' :
                                            scholarshipProgram.status === 'Completed' ? 'bg-purple-500' :
                                                'bg-yellow-500'
                    }`}>
                    {scholarshipProgram.status === 'Pending Approval' && <FaExclamationCircle className="mr-2" />}
                    {scholarshipProgram.status === 'Approved' && <FaCheckCircle className="mr-2" />}
                    {scholarshipProgram.status === 'Published' && <FaCheckCircle className="mr-2" />}
                    {scholarshipProgram.status === 'Ongoing' && <FaCheckCircle className="mr-2" />}
                    {scholarshipProgram.status === 'Rejected' && <FaTimesCircle className="mr-2" />}
                    {scholarshipProgram.status === 'Archived' && <FaExclamationCircle className="mr-2" />}
                    {scholarshipProgram.status === 'Cancelled' && <FaTimesCircle className="mr-2" />}
                    {scholarshipProgram.status === 'Completed' && <FaCheckCircle className="mr-2" />}
                    {scholarshipProgram.status}
                </span>
            </div>
            <h2 className="text-2xl font-bold mb-4">Program Details</h2>

            <div className="grid grid-cols-1 gap-4">
                <div className="bg-gray-100 p-4 rounded-lg">
                    <strong>Scholarship Title:</strong> {scholarshipProgram.title}
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                    <strong>Scholarship Description:</strong> {scholarshipProgram.description}
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                    <strong>Amount:</strong> {scholarshipProgram.amount}
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                    <strong>Total Slots:</strong> {scholarshipProgram.numberOfScholarships}
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                    <strong>Level of Education:</strong> {scholarshipProgram.educationLevel}
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                    <strong>Duration:</strong> {scholarshipProgram.duration}
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                    <strong>Location:</strong> {scholarshipProgram.location}
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                    <strong>Field of Study:</strong> {scholarshipProgram.fieldOfStudy}
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                    <strong>Selection Process:</strong> {scholarshipProgram.selectionProcess}
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                    <strong>Selection Criteria:</strong>
                    <ol>
                        {scholarshipProgram.selectionCriteria.split('\n').map((criteria, index) => (
                            <li key={index}>{criteria}</li>
                        ))}
                    </ol>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                    <strong>Renewal Policy:</strong> {scholarshipProgram.renewalPolicy}
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                    <strong>Renewal Duration:</strong> {scholarshipProgram.renewalDuration}
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                    <strong>Disbursement Schedule:</strong> {scholarshipProgram.disbursementSchedule}
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                    <strong>Disbursement Method:</strong> {scholarshipProgram.disbursementMethod}
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                    <strong>Contact Email:</strong> {scholarshipProgram.contactEmail}
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                    <strong>Contact Phone:</strong> {scholarshipProgram.contactPhone}
                </div>
            </div>
            {/* Additional details can be included here */}
        </div>
    )
}
