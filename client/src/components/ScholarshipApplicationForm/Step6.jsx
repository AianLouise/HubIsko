import React, { useState } from 'react';

const Step6 = ({ formData, setFormData, errors }) => {
  const [agree, setAgree] = useState(false);

  return (
    <div>
      <div className='max-w-8xl mx-auto bg-white shadow-lg rounded-lg'>
        <div className="bg-blue-600 text-white p-4 rounded-t-lg">
          <span className='text-lg font-bold'>Terms and Conditions</span>
        </div>

        <div className='p-8 tracking-wider  text-sm lg:text-base lg:tracking-normal lg:p-12'>
          <div className="mb-4 p-6 bg-gray-100 shadow-md rounded-lg max-h-96 overflow-y-scroll">
            <p className="text-gray-900 font-medium mb-4">
              Please read the following terms and conditions carefully before applying for the scholarship program:
            </p>
            <ul className="list-disc list-inside mt-2 text-gray-700 space-y-3">
              <li>The scholarship is open to all eligible applicants who meet the specified academic and financial criteria.</li>
              <li>Applicants must provide accurate and complete information in the application form. Any falsification of information may result in disqualification.</li>
              <li>Scholarship recipients are required to maintain the academic performance as stipulated in the scholarship guidelines to continue receiving funding.</li>
              <li>Recipients may be required to participate in specific events or activities related to the scholarship program, such as mentorship sessions or community service.</li>
              <li>The scholarship is non-transferable and must be used solely for the purpose of funding the recipient's education-related expenses.</li>
              <li>Recipients must adhere to the code of conduct and ethical guidelines set forth by the scholarship committee.</li>
              <li>Any changes in the recipient's academic status or personal information must be reported to the scholarship office immediately.</li>
              <li>Recipients are expected to act as ambassadors for the scholarship program and may be asked to share their experiences with prospective applicants.</li>
              <li>The scholarship committee reserves the right to modify or terminate the scholarship program at any time, with appropriate notice to the recipients.</li>
              <li>Recipients must provide periodic updates on their academic progress and participation in scholarship-related activities.</li>
              <li>Failure to comply with the terms and conditions may result in the suspension or revocation of the scholarship.</li>
              <li>Recipients are encouraged to seek additional funding opportunities to supplement the scholarship, but must inform the scholarship office of any other awards received.</li>
              <li>The scholarship is intended to cover tuition fees, books, and other educational expenses. Any misuse of funds will result in disciplinary action.</li>
              <li>Recipients must maintain full-time enrollment status throughout the duration of the scholarship, unless otherwise approved by the scholarship committee.</li>
              <li>Recipients are required to submit a thank-you letter to the scholarship donors, expressing their gratitude and outlining their academic goals.</li>
              <li>Recipients may be required to attend an annual scholarship award ceremony or other related events.</li>
              <li>The scholarship committee may request additional documentation or information from recipients as needed to verify eligibility and compliance with the terms.</li>
              <li>Recipients must notify the scholarship office of any plans to transfer to another institution or change their field of study.</li>
              <li>The scholarship is awarded based on merit and financial need, and recipients are expected to uphold the highest standards of academic excellence and integrity.</li>
            </ul>
          </div>

          <div className='flex items-center mb-4 mt-6'>
            <input
              type="checkbox"
              id="agree"
              name="agree"
              className='mr-2 h-5 w-5 lg:w-4 lg:h-4'
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              required
            />
            <label htmlFor="agree" className='text-gray-700'>
              I have read and agree to the terms and conditions.
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step6;