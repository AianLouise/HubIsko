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
                        <label className="block text-gray-700 font-semibold mb-2">Title of Scholarship</label>
                        <p className="text-sm text-gray-500 mb-2">Please provide the official title of the scholarship program.</p>
                        <input
                            type="text"
                            name="title"
                            value={formData.title || ''}
                            onChange={handleChange}
                            placeholder="Enter the title of the scholarship"
                            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
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
                        <label className="block text-gray-700 font-semibold mb-2">Scholarship Category</label>
                        <p className="text-sm text-gray-500 mb-2">Please select the appropriate category for the scholarship program.</p>
                        <select
                            name="category"
                            value={formData.category || ''}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        <label className="block text-gray-700 font-semibold mb-2">Number of Scholarships Available</label>
                        <p className="text-sm text-gray-500 mb-2">Please enter the total number of scholarship slots available.</p>
                        <input
                            type="number"
                            name="numberOfScholarships"
                            value={formData.numberOfScholarships || ''}
                            onChange={handleChange}
                            placeholder="Enter the number of available slots"
                            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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

                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Application Start Date</label>
                        <p className="text-sm text-gray-500 mb-2">Please select the start date for scholarship applications.</p>
                        <input
                            type="date"
                            name="applicationStart"
                            value={formData.applicationStartDate || ''}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Application Deadline</label>
                        <p className="text-sm text-gray-500 mb-2">Please select the deadline date for scholarship applications.</p>
                        <input
                            type="date"
                            name="applicationDeadline"
                            value={formData.applicationDeadline || ''}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                </div>
            </div>


            <div className='bg-white p-8 py-12 flex flex-col rounded-md border shadow'>
                <h2 className="text-2xl font-bold mb-4 border-b-2 pb-4"> Eligibility Criteria</h2>
                <div className='flex flex-col gap-4 px-4 space-y-1 mt-4'>
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
                            <option value="" disabled>Select the field of study</option>
                            <option value="Open for All Courses">Open for All Courses</option>

                            {/* Business & Management */}
                            <option value="Bachelor of Science in Accountancy">Bachelor of Science in Accountancy</option>
                            <option value="Bachelor of Science in Business Administration">Bachelor of Science in Business Administration</option>
                            <option value="Bachelor of Science in Hospitality Management">Bachelor of Science in Hospitality Management</option>
                            <option value="Bachelor of Science in Tourism Management">Bachelor of Science in Tourism Management</option>
                            <option value="Bachelor of Science in Marketing">Bachelor of Science in Marketing</option>
                            <option value="Bachelor of Science in Entrepreneurship">Bachelor of Science in Entrepreneurship</option>
                            <option value="Bachelor of Science in Human Resource Management">Bachelor of Science in Human Resource Management</option>

                            {/* Engineering & Technology */}
                            <option value="Bachelor of Science in Civil Engineering">Bachelor of Science in Civil Engineering</option>
                            <option value="Bachelor of Science in Mechanical Engineering">Bachelor of Science in Mechanical Engineering</option>
                            <option value="Bachelor of Science in Electrical Engineering">Bachelor of Science in Electrical Engineering</option>
                            <option value="Bachelor of Science in Electronics Engineering">Bachelor of Science in Electronics Engineering</option>
                            <option value="Bachelor of Science in Computer Engineering">Bachelor of Science in Computer Engineering</option>
                            <option value="Bachelor of Science in Industrial Engineering">Bachelor of Science in Industrial Engineering</option>
                            <option value="Bachelor of Science in Marine Engineering">Bachelor of Science in Marine Engineering</option>
                            <option value="Bachelor of Science in Aerospace Engineering">Bachelor of Science in Aerospace Engineering</option>
                            <option value="Bachelor of Science in Agricultural Engineering">Bachelor of Science in Agricultural Engineering</option>

                            {/* Information Technology */}
                            <option value="Bachelor of Science in Information Technology">Bachelor of Science in Information Technology</option>
                            <option value="Bachelor of Science in Computer Science">Bachelor of Science in Computer Science</option>
                            <option value="Bachelor of Science in Information Systems">Bachelor of Science in Information Systems</option>
                            <option value="Bachelor of Science in Data Science">Bachelor of Science in Data Science</option>

                            {/* Health & Medicine */}
                            <option value="Bachelor of Science in Nursing">Bachelor of Science in Nursing</option>
                            <option value="Bachelor of Science in Medical Technology">Bachelor of Science in Medical Technology</option>
                            <option value="Bachelor of Science in Pharmacy">Bachelor of Science in Pharmacy</option>
                            <option value="Bachelor of Science in Physical Therapy">Bachelor of Science in Physical Therapy</option>
                            <option value="Bachelor of Science in Nutrition and Dietetics">Bachelor of Science in Nutrition and Dietetics</option>
                            <option value="Bachelor of Science in Radiologic Technology">Bachelor of Science in Radiologic Technology</option>
                            <option value="Bachelor of Science in Dentistry">Bachelor of Science in Dentistry</option>
                            <option value="Bachelor of Science in Public Health">Bachelor of Science in Public Health</option>

                            {/* Natural Sciences */}
                            <option value="Bachelor of Science in Biology">Bachelor of Science in Biology</option>
                            <option value="Bachelor of Science in Chemistry">Bachelor of Science in Chemistry</option>
                            <option value="Bachelor of Science in Environmental Science">Bachelor of Science in Environmental Science</option>
                            <option value="Bachelor of Science in Marine Biology">Bachelor of Science in Marine Biology</option>
                            <option value="Bachelor of Science in Physics">Bachelor of Science in Physics</option>
                            <option value="Bachelor of Science in Geology">Bachelor of Science in Geology</option>
                            <option value="Bachelor of Science in Mathematics">Bachelor of Science in Mathematics</option>
                            <option value="Bachelor of Science in Applied Physics">Bachelor of Science in Applied Physics</option>
                            <option value="Bachelor of Science in Applied Mathematics">Bachelor of Science in Applied Mathematics</option>

                            {/* Social Sciences & Humanities */}
                            <option value="Bachelor of Science in Psychology">Bachelor of Science in Psychology</option>
                            <option value="Bachelor of Science in Social Work">Bachelor of Science in Social Work</option>
                            <option value="Bachelor of Science in Political Science">Bachelor of Science in Political Science</option>
                            <option value="Bachelor of Science in Sociology">Bachelor of Science in Sociology</option>
                            <option value="Bachelor of Science in Anthropology">Bachelor of Science in Anthropology</option>
                            <option value="Bachelor of Science in Development Studies">Bachelor of Science in Development Studies</option>
                            <option value="Bachelor of Arts in Philosophy">Bachelor of Arts in Philosophy</option>
                            <option value="Bachelor of Arts in History">Bachelor of Arts in History</option>
                            <option value="Bachelor of Arts in Literature">Bachelor of Arts in Literature</option>

                            {/* Education */}
                            <option value="Bachelor of Science in Education">Bachelor of Science in Education</option>
                            <option value="Bachelor of Science in Elementary Education">Bachelor of Science in Elementary Education</option>
                            <option value="Bachelor of Science in Secondary Education">Bachelor of Science in Secondary Education</option>
                            <option value="Bachelor of Science in Special Education">Bachelor of Science in Special Education</option>

                            {/* Arts & Design */}
                            <option value="Bachelor of Science in Architecture">Bachelor of Science in Architecture</option>
                            <option value="Bachelor of Science in Interior Design">Bachelor of Science in Interior Design</option>
                            <option value="Bachelor of Science in Fine Arts">Bachelor of Science in Fine Arts</option>
                            <option value="Bachelor of Science in Multimedia Arts">Bachelor of Science in Multimedia Arts</option>
                            <option value="Bachelor of Science in Fashion Design">Bachelor of Science in Fashion Design</option>

                            {/* Communication & Media */}
                            <option value="Bachelor of Science in Journalism">Bachelor of Science in Journalism</option>
                            <option value="Bachelor of Science in Communication">Bachelor of Science in Communication</option>
                            <option value="Bachelor of Science in Broadcasting">Bachelor of Science in Broadcasting</option>
                            <option value="Bachelor of Science in Film">Bachelor of Science in Film</option>

                            {/* Maritime */}
                            <option value="Bachelor of Science in Marine Transportation">Bachelor of Science in Marine Transportation</option>
                            <option value="Bachelor of Science in Naval Architecture and Marine Engineering">Bachelor of Science in Naval Architecture and Marine Engineering</option>

                            {/* Agriculture & Forestry */}
                            <option value="Bachelor of Science in Agriculture">Bachelor of Science in Agriculture</option>
                            <option value="Bachelor of Science in Agribusiness Management">Bachelor of Science in Agribusiness Management</option>
                            <option value="Bachelor of Science in Forestry">Bachelor of Science in Forestry</option>
                            <option value="Bachelor of Science in Fisheries">Bachelor of Science in Fisheries</option>

                            {/* Law & Public Affairs */}
                            <option value="Bachelor of Laws">Bachelor of Laws</option>
                            <option value="Bachelor of Science in Public Administration">Bachelor of Science in Public Administration</option>

                            {/* Other */}
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-700">Minimum GPA/Grade Requirement</label>
                        <p className="text-sm text-gray-500 mb-2">Please enter the minimum GPA or grade required to be eligible for the scholarship.</p>
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
                        <p className="text-sm text-gray-500 mb-2">Please select the nationality requirements for the scholarship.</p>
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
                        <p className="text-sm text-gray-500 mb-2">Please specify any other eligibility criteria for the scholarship.</p>
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
                <h2 className="text-2xl font-bold mb-4 border-b-2 pb-4">Scholarship Duration</h2>
                <div className='flex flex-col gap-4 px-4 space-y-1 mt-4'>

                    <div>
                        <label className="block text-gray-700">Start Date</label>
                        <p className="text-sm text-gray-500 mb-2">Please select the start date for the scholarship.</p>
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
                        <p className="text-sm text-gray-500 mb-2">Please select the end date for the scholarship.</p>
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
        </div>
    );
};

export default Step1;