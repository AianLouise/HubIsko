import React from 'react';
import { FaCheckCircle, FaTimesCircle, FaExclamationCircle } from 'react-icons/fa';

const statusConfig = {
    'Published': { color: 'bg-indigo-500', icon: <FaCheckCircle className="mr-2" /> },
    'Ongoing': { color: 'bg-teal-500', icon: <FaCheckCircle className="mr-2" /> },
    'Rejected': { color: 'bg-red-500', icon: <FaTimesCircle className="mr-2" /> },
    'Archived': { color: 'bg-gray-500', icon: <FaExclamationCircle className="mr-2" /> },
    'Cancelled': { color: 'bg-orange-500', icon: <FaTimesCircle className="mr-2" /> },
    'Completed': { color: 'bg-purple-500', icon: <FaCheckCircle className="mr-2" /> },
    'Awaiting Publication': { color: 'bg-yellow-500', icon: <FaExclamationCircle className="mr-2" /> },
};

const StatusBadge = ({ status }) => {
    const { color, icon } = statusConfig[status] || statusConfig['Pending Approval'];
    return (
        <span className={`flex items-center px-3 py-1 rounded-full text-white font-semibold ${color}`}>
            {icon}
            {status}
        </span>
    );
};

const DetailItem = ({ label, children }) => (
    <div className="border border-gray-300 p-4 rounded-lg shadow-sm">
        <strong className="block text-gray-700 mb-2">{label}:</strong>
        <div className="text-gray-900">{children}</div>
    </div>
);

const DisbursementMethod = ({ method, bankName }) => (
    <div>
        {method}
        {method === 'Bank Transfer' && (
            <div className="mt-2">
                <strong className="block text-gray-700 mb-2">Bank Name:</strong> {bankName}
            </div>
        )}
    </div>
);

export default function ProgamDetails({ scholarshipProgram }) {
    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <div className="flex items-center mb-4">
                <StatusBadge status={scholarshipProgram.status} />
            </div>
                 <h2 className="text-2xl font-bold mb-4 text-blue-600">Program Details</h2>
            <div className="grid grid-cols-1 gap-4">
                <DetailItem label="Scholarship Title">{scholarshipProgram.title}</DetailItem>
                <DetailItem label="Scholarship Description">{scholarshipProgram.description}</DetailItem>
                <DetailItem label="Amount">{scholarshipProgram.amount}</DetailItem>
                <DetailItem label="Total Slots">{scholarshipProgram.numberOfScholarships}</DetailItem>
                <DetailItem label="Level of Education">{scholarshipProgram.educationLevel}</DetailItem>
                <DetailItem label="Duration">{scholarshipProgram.duration}</DetailItem>
                <DetailItem label="Location">{scholarshipProgram.location}</DetailItem>
                <DetailItem label="Field of Study">
                    <ul className="grid grid-cols-1 md:grid-cols-2 list-disc list-inside gap-2 ml-4">
                        {scholarshipProgram.fieldOfStudy.map((field, index) => (
                            <li key={index}>{field}</li>
                        ))}
                    </ul>
                </DetailItem>
                <DetailItem label="Selection Process">{scholarshipProgram.selectionProcess}</DetailItem>
                <DetailItem label="Selection Criteria">
                    <ol>
                        {scholarshipProgram.selectionCriteria.split('\n').map((criteria, index) => (
                            <li key={index}>{criteria}</li>
                        ))}
                    </ol>
                </DetailItem>
                <DetailItem label="Renewal Policy">{scholarshipProgram.renewalPolicy}</DetailItem>
                <DetailItem label="Renewal Duration">{scholarshipProgram.renewalDuration}</DetailItem>
                <DetailItem label="Disbursement Schedule">{scholarshipProgram.disbursementSchedule}</DetailItem>
                <DetailItem label="Disbursement Method">
                    <DisbursementMethod 
                        method={scholarshipProgram.disbursementMethod} 
                        bankName={scholarshipProgram.bankName} 
                    />
                </DetailItem>
                <DetailItem label="Contact Email">{scholarshipProgram.contactEmail}</DetailItem>
                <DetailItem label="Contact Phone">{scholarshipProgram.contactPhone}</DetailItem>
            </div>
        </div>
    );
}