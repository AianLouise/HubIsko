import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function EditScholarshipDetails() {
    const id = useParams();
    const scholarshipId = id.id;
    const [programDetails, setProgramDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    const handleSaveChanges = async () => {
        console.log('Saving changes:', formData);
        try {
            const response = await fetch(`/api/scholarshipProgram/scholarship-programs/${scholarshipId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (!response.ok) throw new Error('Failed to save changes');
            const data = await response.json();
            setProgramDetails(data);
            alert('Changes saved successfully!');
        } catch (error) {
            console.error('Error saving changes:', error);
            alert('Failed to save changes');
        }
    };

    const getTodayDate = () => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const dd = String(today.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };

    useEffect(() => {
        // Scroll to the top of the page when the component is mounted
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="flex flex-col gap-8">
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
                            <option value="Graduate">Graduate</option>
                            <option value="PhD">PhD</option>
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
                        <select
                            name="fieldOfStudy"
                            value={formData.fieldOfStudy || ''}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        >
                            <option value="" disabled>Select the Field of Study</option>
                            <option value="Open for All Courses">Open for All Courses</option>
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
                            <option value="1 year">1 year</option>
                            <option value="2 years">2 years</option>
                            <option value="3 years">3 years</option>
                            <option value="4 years">4 years</option>
                            <option value="5 years">5 years</option>
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
                </div>
            </div>

            <div className='bg-white p-8 py-12 flex flex-col rounded-md border shadow'>
                <h2 className="text-2xl font-bold mb-4 border-b-2 pb-4">Contact Information</h2>
                <div className='flex flex-col gap-4 px-4 space-y-1 mt-4'>
                    <div>
                        <label className="block text-gray-700">Contact Email</label>
                        <p className="text-sm text-gray-500 mb-2">Please enter a valid email address for contact purposes.</p>
                        <input
                            type="email"
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
                    type="button"
                    onClick={handleSaveChanges}
                    className='px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300'
                >
                    Save Changes
                </button>
            </div>
        </div>
    );
}