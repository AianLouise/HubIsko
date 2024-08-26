import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { IoMdArrowDropdown } from "react-icons/io";
import Layout from "../../components/Layout";

export default function ScholarshipsDataDetails() {
    const { id } = useParams(); // Get the scholarship ID from the URL parameters
    const [scholarshipDetails, setScholarshipDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    

    useEffect(() => {
        const fetchScholarshipDetails = async () => {
            try {
                const response = await fetch(`/api/admin/scholarship-program/${id}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setScholarshipDetails(data.scholarshipProgram);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchScholarshipDetails();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="flex flex-col min-h-screen font-medium text-slate-700">
            <Layout />
            <main className="flex-grow bg-[#f8f8fb] pb-24">
                <div className='max-w-8xl mx-auto px-24 gap-10 flex-col flex mt-16'>
                    <div className="flex gap-2 items-center">
                        <Link to={'/scholarships-data'} className="border shadow px-6 py-2 bg-white rounded-md hover:bg-slate-200">
                            <span>Scholarships</span>
                        </Link>
                        <IoMdArrowDropdown className='-rotate-90 w-8 h-8 text-blue-600' />
                        <div className="border shadow px-6 py-2 bg-white rounded-md">
                            <span className="text-blue-600">{scholarshipDetails.title}'s Application</span>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-md shadow-md w-full">
                        <div className="text-lg font-bold bg-slate-200 border-2 px-4 py-2 rounded-md">Scholarship Program Information</div>
                        <div className="grid grid-cols-3 gap-8 my-4 border-b pb-4">
                            <div className="">
                                <label className="block text-sm font-medium text-slate-400">Scholarship Title</label>
                                <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">{scholarshipDetails.title}</span>
                            </div>
                            <div className="">
                                <label className="block text-sm font-medium text-slate-400">Amount Offered</label>
                                <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">{scholarshipDetails.amount}</span>
                            </div>
                            <div className="">
                                <label className="block text-sm font-medium text-slate-400">Total Slots</label>
                                <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">{scholarshipDetails.numberOfScholarships}</span>
                            </div>
                            <div className="">
                                <label className="block text-sm font-medium text-slate-400">GWA</label>
                                <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">{scholarshipDetails.minGPA}</span>
                            </div>
                            <div className="">
                                <label className="block text-sm font-medium text-slate-400">Duration</label>
                                <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">{scholarshipDetails.duration}</span>
                            </div>
                            <div className="">
                                <label className="block text-sm font-medium text-slate-400">Category</label>
                                <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">{scholarshipDetails.category}</span>
                            </div>
                            <div className="">
                                <label className="block text-sm font-medium text-slate-400">Field of Study</label>
                                <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">{scholarshipDetails.fieldOfStudy}</span>
                            </div>
                            <div className="">
                                <label className="block text-sm font-medium text-slate-400">Number of Scholarships</label>
                                <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">{scholarshipDetails.numberOfScholarships}</span>
                            </div>
                            <div className="">
                                <label className="block text-sm font-medium text-slate-400">Application Deadline</label>
                                <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">{scholarshipDetails.applicationDeadline}</span>
                            </div>
                            <div className="">
                                <label className="block text-sm font-medium text-slate-400">Nationality</label>
                                <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">{scholarshipDetails.nationality}</span>
                            </div>
                            <div className="">
                                <label className="block text-sm font-medium text-slate-400">Other Eligibility</label>
                                <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">{scholarshipDetails.otherEligibility}</span>
                            </div>
                            <div className="">
                                <label className="block text-sm font-medium text-slate-400">Start Date</label>
                                <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">{scholarshipDetails.startDate}</span>
                            </div>
                            <div className="">
                                <label className="block text-sm font-medium text-slate-400">End Date</label>
                                <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">{scholarshipDetails.endDate}</span>
                            </div>
                            <div className="">
                                <label className="block text-sm font-medium text-slate-400">Selection Process</label>
                                <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">{scholarshipDetails.selectionProcess}</span>
                            </div>
                            <div className="">
                                <label className="block text-sm font-medium text-slate-400">Selection Criteria</label>
                                <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">{scholarshipDetails.selectionCriteria}</span>
                            </div>
                            <div className="">
                                <label className="block text-sm font-medium text-slate-400">Renewal Policy</label>
                                <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">{scholarshipDetails.renewalPolicy}</span>
                            </div>
                            <div className="">
                                <label className="block text-sm font-medium text-slate-400">Renewal Duration</label>
                                <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">{scholarshipDetails.renewalDuration}</span>
                            </div>
                            <div className="">
                                <label className="block text-sm font-medium text-slate-400">Disbursement Schedule</label>
                                <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">{scholarshipDetails.disbursementSchedule}</span>
                            </div>
                            <div className="">
                                <label className="block text-sm font-medium text-slate-400">Disbursement Method</label>
                                <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">{scholarshipDetails.disbursementMethod}</span>
                            </div>
                            <div className="">
                                <label className="block text-sm font-medium text-slate-400">Contact Email</label>
                                <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">{scholarshipDetails.contactEmail}</span>
                            </div>
                            <div className="">
                                <label className="block text-sm font-medium text-slate-400">Contact Phone</label>
                                <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">{scholarshipDetails.contactPhone}</span>
                            </div>
                        </div>

                        <div className="text-lg font-bold bg-slate-200 border-2 px-4 py-2 rounded-md">Requirements</div>
                        <div className="grid grid-rows-2 grid-cols-3 items-center my-4 border-b pb-4">
                            {scholarshipDetails.requiredDocuments && scholarshipDetails.requiredDocuments.map((doc) => (
                                <div className="flex items-center mt-2" key={doc._id}>
                                    <input
                                        type="checkbox"
                                        id={doc.id}
                                        name="requirement"
                                        value={doc.id}
                                        checked={doc.required}
                                        readOnly
                                        disabled={!doc.editable}
                                        className="mr-2"
                                    />
                                    <label htmlFor={doc.id} className="text-sm font-medium text-slate-700">{doc.name}</label>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols gap-8 my-4 border-b pb-4">
                            <div className="text-lg font-bold bg-slate-200 border-2 px-4 py-2 rounded-md">Document Guidelines</div>
                            <p className="text-sm font-medium text-slate-700">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Suscipit autem, est amet obcaecati possimus a quidem, ipsa consequatur impedit pariatur sunt quasi vel hic. Culpa nulla doloremque ipsam voluptas consequuntur?</p>
                        </div>

                        <div className="flex justify-end gap-4 mt-4">
                            <Link to={`/scholarships-data-display/${scholarshipDetails._id}`} className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-800">
                                Next
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}