import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { IoMdArrowDropdown } from "react-icons/io";

export default function ScholarshipsDataDetails() {
    const { id } = useParams();
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
        return (
            <div className="flex justify-center items-center h-screen">
                <svg className="animate-spin h-10 w-10 text-blue-600" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
            </div>
        );
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="flex flex-col min-h-screen font-medium text-slate-700">
            <main className="flex-grow bg-[#f8f8fb] pb-5">
                <div className='max-w-8xl mx-auto px-24 gap-10 flex-col flex'>
                    <div className="flex flex-col gap-8">
                        <div className="text-lg font-bold bg-slate-200 border-2 px-4 py-2 rounded-md">Scholarship Program Information</div>
                        <div className='bg-white p-8 py-12 flex flex-col rounded-md border shadow'>
                            <h2 className="text-2xl font-bold mb-4 border-b-2 pb-4">Scholarship Details</h2>
                            <div className='flex flex-col gap-4 px-4 space-y-1 mt-4'>
                                <div>
                                    <label className="block text-gray-700">Title of Scholarship</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={scholarshipDetails.title}
                                        readOnly
                                        placeholder="Enter the title of the scholarship"
                                        className="w-full p-2 border border-gray-300 rounded"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700">Scholarship Category</label>
                                    <select
                                        name="category"
                                        value={scholarshipDetails.category}
                                        readOnly
                                        className="w-full p-2 border border-gray-300 rounded"
                                        required
                                    >
                                        <option value="">Select category</option>
                                        <option value="Undergraduate">Undergraduate</option>
                                        <option value="Graduate">Graduate</option>
                                        <option value="PhD">PhD</option>
                                        {/* Add more options as needed */}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-gray-700">Field of Study</label>
                                    <select
                                        name="fieldOfStudy"
                                        value={scholarshipDetails.fieldOfStudy}
                                        readOnly
                                        className="w-full p-2 border border-gray-300 rounded"
                                        required
                                    >
                                        <option value="" disabled>Select the field of study</option>
                                        <option value="Open for All Courses">Open for All Courses</option>
                                        <option value="Bachelor of Science in Accounting">Bachelor of Science in Accounting</option>
                                        <option value="Bachelor of Science in Aerospace Engineering">Bachelor of Science in Aerospace Engineering</option>
                                        <option value="Bachelor of Science in Agribusiness Management">Bachelor of Science in Agribusiness Management</option>
                                        <option value="Bachelor of Science in Agricultural Engineering">Bachelor of Science in Agricultural Engineering</option>
                                        <option value="Bachelor of Science in Agriculture">Bachelor of Science in Agriculture</option>
                                        <option value="Bachelor of Science in Animation">Bachelor of Science in Animation</option>
                                        <option value="Bachelor of Science in Applied Physics">Bachelor of Science in Applied Physics</option>
                                        <option value="Bachelor of Science in Architecture">Bachelor of Science in Architecture</option>
                                        <option value="Bachelor of Science in Astronomy">Bachelor of Science in Astronomy</option>
                                        <option value="Bachelor of Science in Automotive Engineering">Bachelor of Science in Automotive Engineering</option>
                                        <option value="Bachelor of Science in Aviation">Bachelor of Science in Aviation</option>
                                        <option value="Bachelor of Science in Behavioral Science">Bachelor of Science in Behavioral Science</option>
                                        <option value="Bachelor of Science in Biochemistry">Bachelor of Science in Biochemistry</option>
                                        <option value="Bachelor of Science in Biology">Bachelor of Science in Biology</option>
                                        <option value="Bachelor of Science in Biomedical Engineering">Bachelor of Science in Biomedical Engineering</option>
                                        <option value="Bachelor of Science in Biotechnology">Bachelor of Science in Biotechnology</option>
                                        <option value="Bachelor of Science in Business Administration">Bachelor of Science in Business Administration</option>
                                        <option value="Bachelor of Science in Chemical Engineering">Bachelor of Science in Chemical Engineering</option>
                                        <option value="Bachelor of Science in Chemistry">Bachelor of Science in Chemistry</option>
                                        <option value="Bachelor of Science in Civil Engineering">Bachelor of Science in Civil Engineering</option>
                                        <option value="Bachelor of Science in Communications">Bachelor of Science in Communications</option>
                                        <option value="Bachelor of Science in Community Development">Bachelor of Science in Community Development</option>
                                        <option value="Bachelor of Science in Computer Engineering">Bachelor of Science in Computer Engineering</option>
                                        <option value="Bachelor of Science in Computer Science">Bachelor of Science in Computer Science</option>
                                        <option value="Bachelor of Science in Criminology">Bachelor of Science in Criminology</option>
                                        <option value="Bachelor of Science in Dentistry">Bachelor of Science in Dentistry</option>
                                        <option value="Bachelor of Science in Digital Marketing">Bachelor of Science in Digital Marketing</option>
                                        <option value="Bachelor of Science in Economics">Bachelor of Science in Economics</option>
                                        <option value="Bachelor of Science in Education">Bachelor of Science in Education</option>
                                        <option value="Bachelor of Science in Electrical Engineering">Bachelor of Science in Electrical Engineering</option>
                                        <option value="Bachelor of Science in Electronics Engineering">Bachelor of Science in Electronics Engineering</option>
                                        <option value="Bachelor of Science in Emergency Management">Bachelor of Science in Emergency Management</option>
                                        <option value="Bachelor of Science in Environmental Science">Bachelor of Science in Environmental Science</option>
                                        <option value="Bachelor of Science in Fashion Design">Bachelor of Science in Fashion Design</option>
                                        <option value="Bachelor of Science in Finance">Bachelor of Science in Finance</option>
                                        <option value="Bachelor of Science in Fisheries">Bachelor of Science in Fisheries</option>
                                        <option value="Bachelor of Science in Food Technology">Bachelor of Science in Food Technology</option>
                                        <option value="Bachelor of Science in Forestry">Bachelor of Science in Forestry</option>
                                        <option value="Bachelor of Science in Geodetic Engineering">Bachelor of Science in Geodetic Engineering</option>
                                        <option value="Bachelor of Science in Geology">Bachelor of Science in Geology</option>
                                        <option value="Bachelor of Science in Hotel and Restaurant Management">Bachelor of Science in Hotel and Restaurant Management</option>
                                        <option value="Bachelor of Science in Information Systems">Bachelor of Science in Information Systems</option>
                                        <option value="Bachelor of Science in Information Technology">Bachelor of Science in Information Technology</option>
                                        <option value="Bachelor of Science in Interior Design">Bachelor of Science in Interior Design</option>
                                        <option value="Bachelor of Science in International Relations">Bachelor of Science in International Relations</option>
                                        <option value="Bachelor of Science in Journalism">Bachelor of Science in Journalism</option>
                                        <option value="Bachelor of Science in Law">Bachelor of Science in Law</option>
                                        <option value="Bachelor of Science in Library Science">Bachelor of Science in Library Science</option>
                                        <option value="Bachelor of Science in Management">Bachelor of Science in Management</option>
                                        <option value="Bachelor of Science in Marine Biology">Bachelor of Science in Marine Biology</option>
                                        <option value="Bachelor of Science in Marine Engineering">Bachelor of Science in Marine Engineering</option>
                                        <option value="Bachelor of Science in Marketing">Bachelor of Science in Marketing</option>
                                        <option value="Bachelor of Science in Mass Communication">Bachelor of Science in Mass Communication</option>
                                        <option value="Bachelor of Science in Mathematics">Bachelor of Science in Mathematics</option>
                                        <option value="Bachelor of Science in Mechanical Engineering">Bachelor of Science in Mechanical Engineering</option>
                                        <option value="Bachelor of Science in Medical Technology">Bachelor of Science in Medical Technology</option>
                                        <option value="Bachelor of Science in Medicine">Bachelor of Science in Medicine</option>
                                        <option value="Bachelor of Science in Metallurgical Engineering">Bachelor of Science in Metallurgical Engineering</option>
                                        <option value="Bachelor of Science in Microbiology">Bachelor of Science in Microbiology</option>
                                        <option value="Bachelor of Science in Midwifery">Bachelor of Science in Midwifery</option>
                                        <option value="Bachelor of Science in Mining Engineering">Bachelor of Science in Mining Engineering</option>
                                        <option value="Bachelor of Science in Music">Bachelor of Science in Music</option>
                                        <option value="Bachelor of Science in Nursing">Bachelor of Science in Nursing</option>
                                        <option value="Bachelor of Science in Nutrition and Dietetics">Bachelor of Science in Nutrition and Dietetics</option>
                                        <option value="Bachelor of Science in Occupational Therapy">Bachelor of Science in Occupational Therapy</option>
                                        <option value="Bachelor of Science in Oceanography">Bachelor of Science in Oceanography</option>
                                        <option value="Bachelor of Science in Optometry">Bachelor of Science in Optometry</option>
                                        <option value="Bachelor of Science in Pharmacy">Bachelor of Science in Pharmacy</option>
                                        <option value="Bachelor of Science in Philosophy">Bachelor of Science in Philosophy</option>
                                        <option value="Bachelor of Science in Physical Therapy">Bachelor of Science in Physical Therapy</option>
                                        <option value="Bachelor of Science in Physics">Bachelor of Science in Physics</option>
                                        <option value="Bachelor of Science in Political Science">Bachelor of Science in Political Science</option>
                                        <option value="Bachelor of Science in Psychology">Bachelor of Science in Psychology</option>
                                        <option value="Bachelor of Science in Public Administration">Bachelor of Science in Public Administration</option>
                                        <option value="Bachelor of Science in Public Health">Bachelor of Science in Public Health</option>
                                        <option value="Bachelor of Science in Real Estate Management">Bachelor of Science in Real Estate Management</option>
                                        <option value="Bachelor of Science in Respiratory Therapy">Bachelor of Science in Respiratory Therapy</option>
                                        <option value="Bachelor of Science in Social Work">Bachelor of Science in Social Work</option>
                                        <option value="Bachelor of Science in Sociology">Bachelor of Science in Sociology</option>
                                        <option value="Bachelor of Science in Software Engineering">Bachelor of Science in Software Engineering</option>
                                        <option value="Bachelor of Science in Speech Pathology">Bachelor of Science in Speech Pathology</option>
                                        <option value="Bachelor of Science in Sports Science">Bachelor of Science in Sports Science</option>
                                        <option value="Bachelor of Science in Statistics">Bachelor of Science in Statistics</option>
                                        <option value="Bachelor of Science in Tourism Management">Bachelor of Science in Tourism Management</option>
                                        <option value="Bachelor of Science in Veterinary Medicine">Bachelor of Science in Veterinary Medicine</option>
                                        <option value="Bachelor of Science in Zoology">Bachelor of Science in Zoology</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>


                                <div>
                                    <label className="block text-gray-700">Number of Scholarships Available</label>
                                    <input
                                        type="number"
                                        name="numberOfScholarships"
                                        value={scholarshipDetails.numberOfScholarships}
                                        readOnly
                                        placeholder="Enter the number of available slots"
                                        className="w-full p-2 border border-gray-300 rounded"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700">Scholarship Amount</label>
                                    <input
                                        type="text"
                                        name="amount"
                                        value={scholarshipDetails.amount}
                                        readOnly
                                        placeholder="Enter the amount (in PHP or USD)"
                                        className="w-full p-2 border border-gray-300 rounded"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700">Application Deadline</label>
                                    <input
                                        type="date"
                                        name="applicationDeadline"
                                        value={scholarshipDetails.applicationDeadline}
                                        readOnly
                                        className="w-full p-2 border border-gray-300 rounded"
                                        required
                                    />
                                </div>
                            </div>
                        </div>


                        <div className='bg-white p-8 py-12 flex flex-col rounded-md border shadow'>
                            <h2 className="text-2xl font-bold mb-4 border-b-2 pb-4"> Eligibility Criteria</h2>
                            <div className='flex flex-col gap-4 px-4 space-y-1 mt-4'>
                                <div>
                                    <label className="block text-gray-700">Minimum GPA/Grade Requirement</label>
                                    <input
                                        type="text"
                                        name="minGPA"
                                        value={scholarshipDetails.minGPA}
                                        readOnly
                                        placeholder="Enter the minimum GPA required"
                                        className="w-full p-2 border border-gray-300 rounded"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700">Nationality Requirements</label>
                                    <select
                                        name="nationality"
                                        value={scholarshipDetails.nationality}
                                        readOnly
                                        className="w-full p-2 border border-gray-300 rounded"
                                        required
                                    >
                                        <option value="">Select nationality</option>
                                        <option value="All nationalities">All nationalities</option>
                                        {/* Add more options as needed */}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-gray-700">Other Eligibility Requirements</label>
                                    <textarea
                                        name="otherEligibility"
                                        value={scholarshipDetails.otherEligibility}
                                        readOnly
                                        placeholder="Specify any other eligibility criteria"
                                        className="w-full p-2 border border-gray-300 rounded"
                                        required
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        <div className='bg-white p-8 py-12 flex flex-col rounded-md border shadow'>
                            <h2 className="text-2xl font-bold mb-4">Scholarship Duration</h2>
                            <div className='flex flex-col gap-4 px-4 space-y-1 mt-4'>

                                <div>
                                    <label className="block text-gray-700">Start Date</label>
                                    <input
                                        type="text"
                                        name="startDate"
                                        value={new Date(scholarshipDetails.startDate).toLocaleDateString()}
                                        readOnly
                                        className="w-full p-2 border border-gray-300 rounded"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700">End Date</label>
                                    <input
                                        type="text"
                                        name="endDate"
                                        value={new Date(scholarshipDetails.endDate).toLocaleDateString()}
                                        readOnly
                                        className="w-full p-2 border border-gray-300 rounded"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='bg-white p-8 py-12 flex flex-col rounded-md border shadow'>
                            <h2 className="text-2xl font-bold mb-4">Selection Criteria (Optional)</h2>
                            <div className='flex flex-col gap-4 px-4 space-y-1 mt-4'>

                                <div>
                                    <label className="block text-gray-700">Selection Process</label>
                                    <textarea
                                        name="selectionProcess"
                                        value={scholarshipDetails.selectionProcess}
                                        readOnly
                                        placeholder="Describe the selection process"
                                        className="w-full p-2 border border-gray-300 rounded"
                                    ></textarea>
                                </div>

                                <div>
                                    <label className="block text-gray-700">Selection Criteria</label>
                                    <textarea
                                        name="selectionCriteria"
                                        value={scholarshipDetails.selectionCriteria}

                                        placeholder="Detail the evaluation criteria"
                                        className="w-full p-2 border border-gray-300 rounded"
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        <div className='bg-white p-8 py-12 flex flex-col rounded-md border shadow'>
                            <h2 className="text-2xl font-bold mb-4">Renewal Policy (Optional)</h2>
                            <div className='flex flex-col gap-4 px-4 space-y-1 mt-4'>

                                <div>
                                    <label className="block text-gray-700">Renewal Policy</label>
                                    <textarea
                                        name="renewalPolicy"
                                        value={scholarshipDetails.renewalPolicy}
                                        readOnly
                                        placeholder="Specify the renewal conditions"
                                        className="w-full p-2 border border-gray-300 rounded"
                                    ></textarea>
                                </div>

                                <div>
                                    <label className="block text-gray-700">Renewal Duration</label>
                                    <input
                                        type="text"
                                        name="renewalDuration"
                                        value={scholarshipDetails.renewalDuration}
                                        readOnly
                                        placeholder="Enter the renewal duration"
                                        className="w-full p-2 border border-gray-300 rounded"
                                    />
                                </div>
                            </div>
                        </div>


                        <div className='bg-white p-8 py-12 flex flex-col rounded-md border shadow'>
                            <h2 className="text-2xl font-bold mb-4">Disbursement Details (Optional)</h2>
                            <div className='flex flex-col gap-4 px-4 space-y-1 mt-4'>

                                <div>
                                    <label className="block text-gray-700">Disbursement Schedule</label>
                                    <textarea
                                        name="disbursementSchedule"
                                        value={scholarshipDetails.disbursementSchedule}
                                        readOnly
                                        placeholder="Describe the disbursement schedule"
                                        className="w-full p-2 border border-gray-300 rounded"
                                    ></textarea>
                                </div>

                                <div>
                                    <label className="block text-gray-700">Disbursement Method</label>
                                    <select
                                        name="disbursementMethod"
                                        value={scholarshipDetails.disbursementMethod}
                                        readOnly
                                        className="w-full p-2 border border-gray-300 rounded"
                                    >
                                        <option value="">Select method</option>
                                        <option value="Bank Transfer">Bank Transfer</option>
                                        <option value="Check">Check</option>
                                        <option value="Tuition Payment to Institution">Tuition Payment to Institution</option>
                                    </select>
                                </div>
                            </div>
                        </div>


                        <div className='bg-white p-8 py-12 flex flex-col rounded-md border shadow'>
                            <h2 className="text-2xl font-bold mb-4">Contact Information (Optional)</h2>
                            <div className='flex flex-col gap-4 px-4 space-y-1 mt-4'>

                                <div>
                                    <label className="block text-gray-700">Contact Email</label>
                                    <input
                                        type="email"
                                        name="contactEmail"
                                        value={scholarshipDetails.contactEmail}
                                        readOnly
                                        placeholder="Enter a contact email address"
                                        className="w-full p-2 border border-gray-300 rounded"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700">Contact Phone Number</label>
                                    <input
                                        type="tel"
                                        name="contactPhone"
                                        value={scholarshipDetails.contactPhone}
                                        readOnly
                                        placeholder="Enter a contact phone number"
                                        className="w-full p-2 border border-gray-300 rounded"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-8 py-12 flex flex-col rounded-md border shadow">
                            <h2 className="text-2xl font-bold mb-4">Requirements</h2>
                            {scholarshipDetails.requiredDocuments && scholarshipDetails.requiredDocuments.map((doc) => (
                                <div className="flex items-center mt-4 p-4 bg-gray-100 rounded-lg shadow-md hover:bg-gray-200 transition-colors duration-200" key={doc._id}>
                                    <input
                                        type="checkbox"
                                        id={doc.id}
                                        name="requirement"
                                        value={doc.id}
                                        checked={doc.required}
                                        readOnly
                                        disabled={!doc.editable}
                                        className="mr-3 h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                    />
                                    <label htmlFor={doc.id} className="text-sm font-medium text-gray-700">{doc.name}</label>
                                </div>
                            ))}
                        </div>

                        <div className="bg-white p-8 py-12 flex flex-col rounded-md border shadow">
                            <h2 className="text-2xl font-bold mb-4">Document Guidelines</h2>
                            <p className="text-sm font-medium text-slate-700">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Suscipit autem, est amet obcaecati possimus a quidem, ipsa consequatur impedit pariatur sunt quasi vel hic. Culpa nulla doloremque ipsam voluptas consequuntur?</p>
                        </div>

                        <div className="bg-white p-8 py-12 flex flex-col rounded-md border shadow">
                            <h2 className="text-2xl font-bold mb-4">Uploaded Provider Requirements</h2>
                            {scholarshipDetails.providerRequirements && scholarshipDetails.providerRequirements
                                .filter(doc => doc.url) // Filter documents that have a URL
                                .map((doc) => (
                                    <div className="flex items-center mt-4 p-4 bg-gray-100 rounded-lg shadow-md hover:bg-gray-200 transition-colors duration-200" key={doc._id}>
                                        <span className="text-sm font-medium text-gray-700">{doc.name}</span>
                                        <a href={doc.url} target="_blank" rel="noopener noreferrer" className="ml-auto text-indigo-600 hover:underline">View Document</a>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}