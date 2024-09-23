import React, { useEffect, useState } from 'react';

const Step1 = ({ formData, setFormData }) => {
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
                            value={title}
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
                <h2 className="text-2xl font-bold mb-4 border-b-2 pb-4"> Eligibility Criteria</h2>
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
                        <select
                            name="fieldOfStudy"
                            value={formData.fieldOfStudy || ''}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        >
                            <option value="" disabled>Select the Field of Study</option>
                            <option value="Open for All Courses">Open for All Courses</option>
                            <option value="BS in Accounting">BS in Accounting</option>
                            <option value="BS in Aerospace Engineering">BS in Aerospace Engineering</option>
                            <option value="BS in Agricultural Engineering">BS in Agricultural Engineering</option>
                            <option value="BS in Agriculture">BS in Agriculture</option>
                            <option value="BA in Anthropology">BA in Anthropology</option>
                            <option value="BS in Applied Mathematics">BS in Applied Mathematics</option>
                            <option value="BS in Architecture">BS in Architecture</option>
                            <option value="BA in Art Studies">BA in Art Studies</option>
                            <option value="BS in Astronomy">BS in Astronomy</option>
                            <option value="BS in Biochemistry">BS in Biochemistry</option>
                            <option value="BS in Biology">BS in Biology</option>
                            <option value="BS in Biomedical Engineering">BS in Biomedical Engineering</option>
                            <option value="BS in Business Administration">BS in Business Administration</option>
                            <option value="BS in Business Management">BS in Business Management</option>
                            <option value="BS in Chemical Engineering">BS in Chemical Engineering</option>
                            <option value="BS in Chemistry">BS in Chemistry</option>
                            <option value="BS in Civil Engineering">BS in Civil Engineering</option>
                            <option value="BA in Communication">BA in Communication</option>
                            <option value="BS in Computer Engineering">BS in Computer Engineering</option>
                            <option value="BS in Computer Science">BS in Computer Science</option>
                            <option value="BS in Criminology">BS in Criminology</option>
                            <option value="BS in Dentistry">BS in Dentistry</option>
                            <option value="BA in Development Communication">BA in Development Communication</option>
                            <option value="BS in Digital Media Arts">BS in Digital Media Arts</option>
                            <option value="BA in Economics">BA in Economics</option>
                            <option value="BS in Education">BS in Education</option>
                            <option value="BS in Electrical Engineering">BS in Electrical Engineering</option>
                            <option value="BS in Electronics Engineering">BS in Electronics Engineering</option>
                            <option value="BS in Elementary Education">BS in Elementary Education</option>
                            <option value="BS in Environmental Engineering">BS in Environmental Engineering</option>
                            <option value="BS in Environmental Science">BS in Environmental Science</option>
                            <option value="BS in Fashion Design">BS in Fashion Design</option>
                            <option value="BS in Finance">BS in Finance</option>
                            <option value="BA in Fine Arts">BA in Fine Arts</option>
                            <option value="BS in Food Science">BS in Food Science</option>
                            <option value="BS in Forestry">BS in Forestry</option>
                            <option value="BS in Forensic Science">BS in Forensic Science</option>
                            <option value="BS in Geodetic Engineering">BS in Geodetic Engineering</option>
                            <option value="BA in Geography">BA in Geography</option>
                            <option value="BS in Geology">BS in Geology</option>
                            <option value="BS in Graphic Design">BS in Graphic Design</option>
                            <option value="BS in Health Sciences">BS in Health Sciences</option>
                            <option value="BA in History">BA in History</option>
                            <option value="BS in Hospitality Management">BS in Hospitality Management</option>
                            <option value="BS in Hotel and Restaurant Management">BS in Hotel and Restaurant Management</option>
                            <option value="BS in Human Resource Development">BS in Human Resource Development</option>
                            <option value="BS in Industrial Design">BS in Industrial Design</option>
                            <option value="BS in Industrial Engineering">BS in Industrial Engineering</option>
                            <option value="BS in Information Systems">BS in Information Systems</option>
                            <option value="BS in Information Technology">BS in Information Technology</option>
                            <option value="BS in Interior Design">BS in Interior Design</option>
                            <option value="BA in International Relations">BA in International Relations</option>
                            <option value="BA in Journalism">BA in Journalism</option>
                            <option value="BS in Landscape Architecture">BS in Landscape Architecture</option>
                            <option value="BA in Law">BA in Law</option>
                            <option value="BA in Linguistics">BA in Linguistics</option>
                            <option value="BS in Management Accounting">BS in Management Accounting</option>
                            <option value="BS in Marine Biology">BS in Marine Biology</option>
                            <option value="BS in Marine Engineering">BS in Marine Engineering</option>
                            <option value="BS in Marine Transportation">BS in Marine Transportation</option>
                            <option value="BS in Marketing">BS in Marketing</option>
                            <option value="BS in Materials Science">BS in Materials Science</option>
                            <option value="BS in Mathematics">BS in Mathematics</option>
                            <option value="BS in Mechanical Engineering">BS in Mechanical Engineering</option>
                            <option value="BA in Media Studies">BA in Media Studies</option>
                            <option value="BS in Medical Laboratory Science">BS in Medical Laboratory Science</option>
                            <option value="BS in Medicine">BS in Medicine</option>
                            <option value="BS in Metallurgical Engineering">BS in Metallurgical Engineering</option>
                            <option value="BS in Microbiology">BS in Microbiology</option>
                            <option value="BS in Midwifery">BS in Midwifery</option>
                            <option value="BS in Mining Engineering">BS in Mining Engineering</option>
                            <option value="BS in Molecular Biology">BS in Molecular Biology</option>
                            <option value="BS in Multimedia Arts">BS in Multimedia Arts</option>
                            <option value="BS in Music">BS in Music</option>
                            <option value="BS in Nanotechnology">BS in Nanotechnology</option>
                            <option value="BS in Nursing">BS in Nursing</option>
                            <option value="BS in Nutrition">BS in Nutrition</option>
                            <option value="BS in Occupational Therapy">BS in Occupational Therapy</option>
                            <option value="BS in Oceanography">BS in Oceanography</option>
                            <option value="BS in Pharmacy">BS in Pharmacy</option>
                            <option value="BS in Physical Therapy">BS in Physical Therapy</option>
                            <option value="BS in Physics">BS in Physics</option>
                            <option value="BS in Political Science">BS in Political Science</option>
                            <option value="BS in Psychology">BS in Psychology</option>
                            <option value="BS in Public Health">BS in Public Health</option>
                            <option value="BS in Radiologic Technology">BS in Radiologic Technology</option>
                            <option value="BS in Real Estate Management">BS in Real Estate Management</option>
                            <option value="BA in Religious Studies">BA in Religious Studies</option>
                            <option value="BA in Social Work">BA in Social Work</option>
                            <option value="BS in Sociology">BS in Sociology</option>
                            <option value="BS in Software Engineering">BS in Software Engineering</option>
                            <option value="BS in Statistics">BS in Statistics</option>
                            <option value="BS in Tourism Management">BS in Tourism Management</option>
                            <option value="BS in Veterinary Medicine">BS in Veterinary Medicine</option>
                            <option value="BS in Zoology">BS in Zoology</option>
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
        </div>
    );
};

export default Step1;