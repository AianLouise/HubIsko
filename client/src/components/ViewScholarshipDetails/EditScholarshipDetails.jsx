import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CustomNotification from '../../components/CustomNotification';
import { FaArrowLeft } from 'react-icons/fa6';

export default function EditScholarshipDetails() {
    const id = useParams();
    const scholarshipId = id.id;
    const navigate = useNavigate();
    const [programDetails, setProgramDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notification, setNotification] = useState({ message: '', type: '' });

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        numberOfScholarships: '',
        amount: '',
        educationLevel: '',
        location: '',
        fieldOfStudy: '',
        duration: '',
        selectionProcess: '',
        selectionCriteria: '',
        renewalPolicy: '',
        renewalDuration: '',
        disbursementSchedule: '',
        disbursementMethod: '',
        bankName: '',
        contactEmail: '',
        contactPhone: '',
    });

    const fetchProgramDetails = async () => {
        try {
            const response = await fetch(`/api/scholarshipProgram/scholarship-programs/${scholarshipId}`);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setProgramDetails(data);
        } catch (error) {
            console.error('Error fetching program details:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProgramDetails();
    }, [id]);

    useEffect(() => {
        if (programDetails) {
            setFormData({
                title: programDetails.title || '',
                description: programDetails.description || '',
                numberOfScholarships: programDetails.numberOfScholarships || '',
                amount: programDetails.amount || '',
                educationLevel: programDetails.educationLevel || '',
                location: programDetails.location || '',
                fieldOfStudy: programDetails.fieldOfStudy || '',
                duration: programDetails.duration || '',
                selectionProcess: programDetails.selectionProcess || '',
                selectionCriteria: programDetails.selectionCriteria || '',
                renewalPolicy: programDetails.renewalPolicy || '',
                renewalDuration: programDetails.renewalDuration || '',
                disbursementSchedule: programDetails.disbursementSchedule || '',
                disbursementMethod: programDetails.disbursementMethod || '',
                contactEmail: programDetails.contactEmail || '',
                contactPhone: programDetails.contactPhone || '',
            });
        }
    }, [programDetails]);

    const [title, setTitle] = useState(formData.title || '');
    const maxTitleLength = 50;

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'title' && value.length <= maxTitleLength) {
            setTitle(value);
        }
        if (name === 'numberOfScholarships' && (value <= 0 || isNaN(value))) {
            return; // Prevent negative values 
        }
        setFormData({ ...formData, [name]: value });
    };

    const handleSaveChanges = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`/api/scholarshipProgram/scholarship-programs/${scholarshipId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (!response.ok) throw new Error('Failed to update scholarship details');
            const data = await response.json();
            setProgramDetails(data);
            setNotification({ message: 'Scholarship details updated successfully', type: 'success' });
            setTimeout(() => {
                navigate(-1); // Redirect to the desired page
            }, 2000); // Adjust the delay as needed
        } catch (error) {
            console.error('Error updating scholarship details:', error);
            setError(error.message);
            setNotification({ message: error.message, type: 'error' });
        }
    };

    const getTodayDate = () => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const dd = String(today.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };

    const handleFieldOfStudyChange = (e) => {
        const { value, checked } = e.target;
        setFormData((prevState) => {
            let newFieldOfStudy;
            if (value === "Open for All Courses") {
                newFieldOfStudy = checked ? [value] : [];
            } else {
                newFieldOfStudy = checked
                    ? [...prevState.fieldOfStudy, value]
                    : prevState.fieldOfStudy.filter((field) => field !== value);
            }
            return {
                ...prevState,
                fieldOfStudy: newFieldOfStudy,
            };
        });
    };

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

    useEffect(() => {
        // Scroll to the top of the page when the component is mounted
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="flex flex-col">
            {notification.message && (
                <CustomNotification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification({ message: '', type: '' })}
                />
            )}
            <div className="my-8 text-center relative">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="absolute left-10 flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    <FaArrowLeft className="mr-2" />
                    <span>Back</span>
                </button>
                <div className="inline-block">
                    <h2 className="text-3xl font-extrabold text-blue-600">
                        Edit Scholarship Details
                    </h2>
                    <p className="text-sm font-normal text-gray-500 mt-2">
                        Update the scholarship information below to ensure all details are accurate and up-to-date.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSaveChanges}>
                <div className='bg-white p-8 py-12 flex flex-col rounded-md border shadow'>
                    <h2 className="text-2xl font-bold mb-4 border-b-2 pb-4">Scholarship Details</h2>
                    <div className='flex flex-col gap-4 px-4 space-y-1 mt-4'>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Title of Scholarship</label>
                            <p className="text-sm text-gray-500 mb-2">Please provide the official title of the scholarship program.</p>
                            <input
                                type="text"
                                name="title"
                                value={formData.title || ''}
                                onChange={handleChange}
                                placeholder="Enter the title of the scholarship"
                                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                maxLength={maxTitleLength}
                                required
                            />
                            <p className="text-sm text-gray-500 mt-1">{title.length}/{maxTitleLength} characters</p>
                        </div>

                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Scholarship Description</label>
                            <p className="text-sm text-gray-500 mb-2">Please provide a detailed description of the scholarship program.</p>
                            <textarea
                                name="description"
                                value={formData.description || ''}
                                onChange={handleChange}
                                placeholder="Enter the scholarship description"
                                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            ></textarea>
                        </div>

                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Number of Scholarships Available</label>
                            <p className="text-sm text-gray-500 mb-2">Please enter the total number of scholarship slots available.</p>
                            <input
                                type="number"
                                name="numberOfScholarships"
                                value={formData.numberOfScholarships || ''}
                                onChange={handleChange}
                                placeholder="Enter the number of available slots"
                                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                min="0"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Scholarship Amount</label>
                            <p className="text-sm text-gray-500 mb-2">Please enter the scholarship amount in PHP. Example: Up to PHP 10,000.</p>
                            <input
                                type="text"
                                name="amount"
                                value={formData.amount || ''}
                                onChange={handleChange}
                                placeholder="Enter the amount (in PHP or USD)"
                                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className='bg-white p-8 py-12 flex flex-col rounded-md border shadow'>
                    <h2 className="text-2xl font-bold mb-4 border-b-2 pb-4">Eligibility Criteria</h2>
                    <div className='flex flex-col gap-4 px-4 space-y-1 mt-4'>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Education Level</label>
                            <p className="text-sm text-gray-500 mb-2">Please select the appropriate education level for the scholarship program.</p>
                            <select
                                name="educationLevel"
                                value={formData.educationLevel || ''}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="">Select Education Level</option>
                                <option value="Undergraduate">Undergraduate</option>
                                {/* Add more options as needed */}
                            </select>
                        </div>

                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Location</label>
                            <p className="text-sm text-gray-500 mb-2">Select the location you want to provide.</p>
                            <select
                                name="location"
                                value={formData.location || ''}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
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
                            <p className="text-sm text-gray-500 mb-2">Please select the field of study relevant to the scholarship program.</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                {fieldsOfStudy.map((field) => (
                                    <div key={field} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            name="fieldOfStudy"
                                            value={field}
                                            checked={formData.fieldOfStudy.includes(field)}
                                            onChange={handleFieldOfStudyChange}
                                            className="mr-2"
                                            disabled={
                                                formData.fieldOfStudy.includes("Open for All Courses") &&
                                                field !== "Open for All Courses"
                                            }
                                        />
                                        <label className="text-gray-700">{field}</label>
                                    </div>
                                ))}
                            </div>
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
                    <h2 className="text-2xl font-bold mb-4 border-b-2 pb-4">Selection Criteria (Optional)</h2>
                    <div className='flex flex-col gap-4 px-4 space-y-1 mt-4'>
                        <div>
                            <label className="block text-gray-700">Selection Process</label>
                            <p className="text-sm text-gray-500 mb-2">Please describe the process used to select scholarship recipients.</p>
                            <textarea
                                name="selectionProcess"
                                value={formData.selectionProcess || ''}
                                onChange={handleChange}
                                placeholder="Describe the selection process"
                                className="w-full p-2 border border-gray-300 rounded"
                            ></textarea>
                        </div>

                        <div>
                            <label className="block text-gray-700">Selection Criteria</label>
                            <p className="text-sm text-gray-500 mb-2">Please detail the criteria used to evaluate applicants.</p>
                            <textarea
                                name="selectionCriteria"
                                value={formData.selectionCriteria || ''}
                                onChange={handleChange}
                                placeholder="Detail the evaluation criteria"
                                className="w-full p-2 border border-gray-300 rounded"
                            ></textarea>
                        </div>
                    </div>
                </div>

                <div className='bg-white p-8 py-12 flex flex-col rounded-md border shadow'>
                    <h2 className="text-2xl font-bold mb-4 border-b-2 pb-4">Renewal Policy (Optional)</h2>
                    <div className='flex flex-col gap-4 px-4 space-y-1 mt-4'>
                        <div>
                            <label className="block text-gray-700">Renewal Policy</label>
                            <p className="text-sm text-gray-500 mb-2">Please specify the conditions under which the scholarship can be renewed.</p>
                            <textarea
                                name="renewalPolicy"
                                value={formData.renewalPolicy || ''}
                                onChange={handleChange}
                                placeholder="Specify the renewal conditions"
                                className="w-full p-2 border border-gray-300 rounded"
                            ></textarea>
                        </div>

                        <div>
                            <label className="block text-gray-700">Renewal Duration</label>
                            <p className="text-sm text-gray-500 mb-2">Please enter the duration for which the scholarship can be renewed.</p>
                            <input
                                type="text"
                                name="renewalDuration"
                                value={formData.renewalDuration || ''}
                                onChange={handleChange}
                                placeholder="Enter the renewal duration"
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                        </div>
                    </div>
                </div>

                <div className='bg-white p-8 py-12 flex flex-col rounded-md border shadow'>
                    <h2 className="text-2xl font-bold mb-4 border-b-2 pb-4">Disbursement Details (Optional)</h2>
                    <div className='flex flex-col gap-4 px-4 space-y-1 mt-4'>

                        <div>
                            <label className="block text-gray-700">Disbursement Schedule</label>
                            <p className="text-sm text-gray-500 mb-2">Please describe the schedule for disbursing the scholarship funds.</p>
                            <textarea
                                name="disbursementSchedule"
                                value={formData.disbursementSchedule || ''}
                                onChange={handleChange}
                                placeholder="Describe the disbursement schedule"
                                className="w-full p-2 border border-gray-300 rounded"
                            ></textarea>
                        </div>

                        <div>
                            <label className="block text-gray-700">Disbursement Method</label>
                            <p className="text-sm text-gray-500 mb-2">Please select the method by which the scholarship funds will be disbursed.</p>
                            <select
                                name="disbursementMethod"
                                value={formData.disbursementMethod || ''}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded"
                            >
                                <option value="">Select method</option>
                                <option value="Bank Transfer">Bank Transfer</option>
                                <option value="Check">Check</option>
                                <option value="Tuition Payment to Institution">Tuition Payment to Institution</option>
                            </select>
                        </div>

                        {formData.disbursementMethod === 'Bank Transfer' && (
                            <div>
                                <label className="block text-gray-700">Bank Name</label>
                                <p className="text-sm text-gray-500 mb-2">Please specify the bank name for the transfer.</p>
                                <input
                                    type="text"
                                    name="bankName"
                                    value={formData.bankName}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded"
                                    placeholder="Enter bank name"
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div className='bg-white p-8 py-12 flex flex-col rounded-md border shadow'>
                    <h2 className="text-2xl font-bold mb-4 border-b-2 pb-4">Contact Information</h2>
                    <div className='flex flex-col gap-4 px-4 space-y-1 mt-4'>
                        <div>
                            <label className="block text-gray-700">Contact Email</label>
                            <p className="text-sm text-gray-500 mb-2">Please enter a valid email address for contact purposes.</p>
                            <input
                                type="text"
                                name="contactEmail"
                                value={formData.contactEmail || ''}
                                onChange={handleChange}
                                placeholder="Enter a contact email address"
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700">Contact Phone Number</label>
                            <p className="text-sm text-gray-500 mb-2">Please enter a valid phone number for contact purposes.</p>
                            <input
                                type="tel"
                                name="contactPhone"
                                value={formData.contactPhone || ''}
                                onChange={handleChange}
                                placeholder="Enter a contact phone number"
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                        </div>
                    </div>
                </div>

                <div className='flex justify-end p-4'>
                    <button
                        type="submit"
                        className='px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300'
                    >
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}