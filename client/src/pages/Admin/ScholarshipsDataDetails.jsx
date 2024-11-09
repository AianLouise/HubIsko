import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { IoMdArrowDropdown } from "react-icons/io";
import ImageModal from "../../components/AdminImageModal";

export default function ScholarshipsDataDetails() {
    const { id } = useParams();
    const [scholarshipDetails, setScholarshipDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImageUrl, setSelectedImageUrl] = useState('');
    const [selectedDocumentName, setSelectedDocumentName] = useState('');

    const handleViewDocument = (url, name) => {
        setSelectedImageUrl(url);
        setSelectedDocumentName(name);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedImageUrl('');
        setSelectedDocumentName('');
    };

    useEffect(() => {
        // Scroll to the top of the page when the component is mounted
        window.scrollTo(0, 0);
    }, []);

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

    const fieldsOfStudy = [
        "Open for All Courses",
        "BA in Anthropology",
        "BA in Art Studies",
        "BA in Communication",
        "BA in Development Communication",
        "BA in Economics",
        "BA in Fine Arts",
        "BA in Geography",
        "BA in History",
        "BA in International Relations",
        "BA in Journalism",
        "BA in Law",
        "BA in Linguistics",
        "BA in Media Studies",
        "BA in Religious Studies",
        "BA in Social Work",
        "BS in Accounting",
        "BS in Accounting Information Systems",
        "BS in Accounting Technology",
        "BS in Aerospace Engineering",
        "BS in Agribusiness Management",
        "BS in Agricultural Engineering",
        "BS in Agriculture",
        "BS in Animal Science",
        "BS in Applied Mathematics",
        "BS in Applied Physics",
        "BS in Architecture",
        "BS in Astronomy",
        "BS in Biochemistry",
        "BS in Biology",
        "BS in Biomedical Engineering",
        "BS in Biosystems Engineering",
        "BS in Business Administration",
        "BS in Business Administration major in Financial Management",
        "BS in Business Analytics",
        "BS in Business Management",
        "BS in Chemical Engineering",
        "BS in Chemistry",
        "BS in Civil Engineering",
        "BS in Communication",
        "BS in Computer Engineering",
        "BS in Computer Science",
        "BS in Criminology",
        "BS in Cyber Security",
        "BS in Data Analytics",
        "BS in Data Science",
        "BS in Dentistry",
        "BS in Digital Media Arts",
        "BS in Education",
        "BS in Electrical Engineering",
        "BS in Elementary Education",
        "BS in Electronics and Communications Engineering",
        "BS in Electronics Engineering",
        "BS in Environmental Engineering",
        "BS in Environmental Science",
        "BS in Fashion Design",
        "BS in Finance",
        "BS in Food Science",
        "BS in Food Technology",
        "BS in Forensic Science",
        "BS in Forestry",
        "BS in Geodetic Engineering",
        "BS in Geology",
        "BS in Graphic Design",
        "BS in Health Sciences",
        "BS in Horticulture",
        "BS in Hospitality Management",
        "BS in Hotel and Restaurant Management",
        "BS in Human Resource Development",
        "BS in Industrial Design",
        "BS in Industrial Engineering",
        "BS in Information Systems",
        "BS in Information Technology",
        "BS in Internal Auditing",
        "BS in Landscape Architecture",
        "BS in Library and Information Science",
        "BS in Management Accounting",
        "BS in Marine Biology",
        "BS in Marine Engineering",
        "BS in Marine Transportation",
        "BS in Marketing",
        "BS in Materials Science",
        "BS in Mathematics",
        "BS in Mechanical Engineering",
        "BS in Medical Laboratory Science",
        "BS in Medical Technology",
        "BS in Medicine",
        "BS in Metallurgical Engineering",
        "BS in Microbiology",
        "BS in Midwifery",
        "BS in Mining Engineering",
        "BS in Molecular Biology",
        "BS in Multimedia Arts",
        "BS in Music",
        "BS in Nanotechnology",
        "BS in Nursing",
        "BS in Nutrition",
        "BS in Occupational Therapy",
        "BS in Oceanography",
        "BS in Pharmacy",
        "BS in Physical Therapy",
        "BS in Physics",
        "BS in Political Science",
        "BS in Psychology",
        "BS in Public Health",
        "BS in Radiologic Technology",
        "BS in Real Estate Management",
        "BS in Renewable/Sustainable Energy Engineering",
        "BS in Robotics Engineering",
        "BS in Secondary Education major in Biology",
        "BS in Secondary Education major in Chemistry",
        "BS in Secondary Education major in English",
        "BS in Secondary Education major in General Sciences",
        "BS in Secondary Education major in Mathematics",
        "BS in Secondary Education major in Physics",
        "BS in Social Work",
        "BS in Sociology",
        "BS in Software Engineering",
        "BS in Statistics",
        "BS in Tourism Management",
        "BS in Veterinary Medicine",
        "BS in Zoology"
    ];

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
        <div className="flex flex-col min-h-screen text-slate-700">
            <main className="flex-grow bg-[#f8f8fb] pb-5">
                <div className='max-w-8xl mx-auto px-24 gap-10 flex-col flex'>
                    <div className="flex flex-col gap-8">
                        <div className="text-lg font-bold bg-slate-200 border-2 px-4 py-2 rounded-md">Scholarship Program Information</div>
                        <div className='bg-white p-8 py-12 flex flex-col rounded-md border shadow'>
                            <h2 className="text-2xl font-bold mb-4 border-b-2 pb-4">Scholarship Details</h2>
                            <div className='flex flex-col gap-4 px-4 space-y-1 mt-4'>
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">Title of Scholarship</label>
                                    <p className="text-sm text-gray-500 mb-2">Review the official title of the scholarship program.</p>
                                    <input
                                        type="text"
                                        name="title"
                                        value={scholarshipDetails.title}
                                        placeholder="Enter the title of the scholarship"
                                        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        readOnly
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">Scholarship Description</label>
                                    <p className="text-sm text-gray-500 mb-2">Review the detailed description of the scholarship program.</p>
                                    <textarea
                                        name="description"
                                        value={scholarshipDetails.description}
                                        placeholder="Enter the scholarship description"
                                        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        readOnly
                                    ></textarea>
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">Number of Scholarships Available</label>
                                    <p className="text-sm text-gray-500 mb-2">Review the total number of scholarship slots available.</p>
                                    <input
                                        type="number"
                                        name="numberOfScholarships"
                                        value={scholarshipDetails.numberOfScholarships}
                                        placeholder="Enter the number of available slots"
                                        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        min="0"
                                        readOnly
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">Scholarship Amount</label>
                                    <p className="text-sm text-gray-500 mb-2">Review the scholarship amount in PHP. Example: Up to PHP 10,000.</p>
                                    <input
                                        type="text"
                                        name="amount"
                                        value={scholarshipDetails.amount}
                                        placeholder="Enter the amount (in PHP or USD)"
                                        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        readOnly
                                    />
                                </div>
                            </div>
                        </div>


                        <div className='bg-white p-8 py-12 flex flex-col rounded-md border shadow'>
                            <h2 className="text-2xl font-bold mb-4 border-b-2 pb-4"> Eligibility Criteria</h2>
                            <div className='flex flex-col gap-4 px-4 space-y-1 mt-4'>
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">Education Level</label>
                                    <p className="text-sm text-gray-500 mb-2">Review the appropriate education level for the scholarship program.</p>
                                    <select
                                        name="educationLevel"
                                        value={scholarshipDetails.educationLevel}
                                        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        disabled
                                    >
                                        <option value="">Select Education Level</option>
                                        <option value="Undergraduate">Undergraduate</option>
                                        {/* Add more options as needed */}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">Location</label>
                                    <p className="text-sm text-gray-500 mb-2">Review the location provided for the scholarship program.</p>
                                    <select
                                        name="location"
                                        value={scholarshipDetails.location}
                                        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        disabled
                                    >
                                        <option value="" disabled>Select Location</option>
                                        <option value="Open for Any Location">Open for Any Location</option>
                                        <option value="Floridablanca">Floridablanca</option>
                                        <option value="Guagua">Guagua</option>
                                        <option value="Lubao">Lubao</option>
                                        <option value="Porac">Porac</option>
                                        <option value="Santa Rita">Santa Rita</option>
                                        <option value="Sasmuan">Sasmuan</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">Field of Study</label>
                                    <p className="text-sm text-gray-500 mb-2">Review the field of study relevant to the scholarship program.</p>
                                    <select
                                        name="fieldOfStudy"
                                        value={scholarshipDetails.fieldOfStudy}
                                        className="w-full p-2 border border-gray-300 rounded"
                                        disabled
                                    >
                                        <option value="" disabled>Select the Field of Study</option>
                                        {fieldsOfStudy.map((field) => (
                                            <option key={field} value={field}>{field}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className='bg-white p-8 py-12 flex flex-col rounded-md border shadow'>
                            <h2 className="text-2xl font-bold mb-4 border-b-2 pb-4">Scholarship Duration</h2>
                            <div className='flex flex-col gap-4 px-4 space-y-1 mt-4'>
                                <div>
                                    <label className="block text-gray-700">Duration</label>
                                    <p className="text-sm text-gray-500 mb-2">Please select the duration for the scholarship.</p>
                                    <select
                                        name="duration"
                                        value={formData.duration || ''}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded"
                                        required
                                    >
                                        <option value="" disabled>Select duration</option>
                                        <option value="up-to-1-year">Up to 1 year</option>
                                        <option value="up-to-2-years">Up to 2 years</option>
                                        <option value="up-to-3-years">Up to 3 years</option>
                                        <option value="up-to-4-years">Up to 4 years (or until graduation, depending on the course)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className='bg-white p-8 py-12 flex flex-col rounded-md border shadow'>
                            <h2 className="text-2xl font-bold mb-4">Selection Criteria (Optional)</h2>
                            <div className='flex flex-col gap-4 px-4 space-y-1 mt-4'>

                                <div>
                                    <label className="block text-gray-700">Selection Process</label>
                                    <p className="text-sm text-gray-500 mb-2">Review the selection process for the scholarship program.</p>
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
                                    <p className="text-sm text-gray-500 mb-2">Review the evaluation criteria for the scholarship program.</p>
                                    <textarea
                                        name="selectionCriteria"
                                        value={scholarshipDetails.selectionCriteria}
                                        readOnly
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
                                    <p className="text-sm text-gray-500 mb-2">Review the renewal conditions for the scholarship program.</p>
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
                                    <p className="text-sm text-gray-500 mb-2">Review the renewal duration for the scholarship program.</p>
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
                                    <p className="text-sm text-gray-500 mb-2">Review the disbursement schedule for the scholarship program.</p>
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
                                    <p className="text-sm text-gray-500 mb-2">Review the disbursement method for the scholarship program.</p>
                                    <select
                                        name="disbursementMethod"
                                        value={scholarshipDetails.disbursementMethod}
                                        disabled
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
                            <h2 className="text-2xl font-bold mb-4">Contact Information (Admin Review)</h2>
                            <div className='flex flex-col gap-4 px-4 space-y-1 mt-4'>

                                <div>
                                    <label className="block text-gray-700">Contact Email</label>
                                    <p className="text-sm text-gray-500 mb-2">Review the contact email address for the scholarship program.</p>
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
                                    <p className="text-sm text-gray-500 mb-2">Review the contact phone number for the scholarship program.</p>
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
                            <p className="text-sm text-gray-500 mb-2">Review the documents that applicants need to submit for the scholarship program.</p>
                            {scholarshipDetails.requiredDocuments && scholarshipDetails.requiredDocuments.map((doc) => (
                                <div className="flex items-center mt-4 p-4 bg-gray-100 rounded-lg shadow-md hover:bg-gray-200 transition-colors duration-200" key={doc._id}>
                                    <span className="text-sm font-medium text-gray-700">{doc.name}</span>
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
                                        <button onClick={() => handleViewDocument(doc.url, doc.name)} className="ml-auto text-indigo-600 hover:underline">View Document</button>
                                    </div>
                                ))}
                            <ImageModal isOpen={isModalOpen} onClose={handleCloseModal} imageUrl={selectedImageUrl} documentName={selectedDocumentName} />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}