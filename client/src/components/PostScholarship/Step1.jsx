import React, { useEffect } from 'react';

const Step1 = ({ formData, setFormData }) => {
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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
                        <label className="block text-gray-700">Title of Scholarship</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title || ''}
                            onChange={handleChange}
                            placeholder="Enter the title of the scholarship"
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700">Scholarship Category</label>
                        <select
                            name="category"
                            value={formData.category || ''}
                            onChange={handleChange}
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
                            value={formData.fieldOfStudy || ''}
                            onChange={handleChange}
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
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-700">Number of Scholarships Available</label>
                        <input
                            type="number"
                            name="numberOfScholarships"
                            value={formData.numberOfScholarships || ''}
                            onChange={handleChange}
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
                            value={formData.amount || ''}
                            onChange={handleChange}
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
                            value={formData.applicationDeadline || ''}
                            onChange={handleChange}
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
                            value={formData.minGPA || ''}
                            onChange={handleChange}
                            placeholder="Enter the minimum GPA required"
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700">Nationality Requirements</label>
                        <select
                            name="nationality"
                            value={formData.nationality || ''}
                            onChange={handleChange}
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
                            value={formData.otherEligibility || ''}
                            onChange={handleChange}
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
                            type="date"
                            name="startDate"
                            value={formData.startDate || ''}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700">End Date</label>
                        <input
                            type="date"
                            name="endDate"
                            value={formData.endDate || ''}
                            onChange={handleChange}
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
                            value={formData.selectionProcess || ''}
                            onChange={handleChange}
                            placeholder="Describe the selection process"
                            className="w-full p-2 border border-gray-300 rounded"
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-gray-700">Selection Criteria</label>
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
                <h2 className="text-2xl font-bold mb-4">Renewal Policy (Optional)</h2>
                <div className='flex flex-col gap-4 px-4 space-y-1 mt-4'>

                    <div>
                        <label className="block text-gray-700">Renewal Policy</label>
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
                <h2 className="text-2xl font-bold mb-4">Disbursement Details (Optional)</h2>
                <div className='flex flex-col gap-4 px-4 space-y-1 mt-4'>

                    <div>
                        <label className="block text-gray-700">Disbursement Schedule</label>
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
                <h2 className="text-2xl font-bold mb-4">Contact Information (Optional)</h2>
                <div className='flex flex-col gap-4 px-4 space-y-1 mt-4'>

                    <div>
                        <label className="block text-gray-700">Contact Email</label>
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
        </div>
    );
};

export default Step1;