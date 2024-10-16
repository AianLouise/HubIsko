import React, { useState } from 'react';

const Step6 = ({ formData, setFormData, errors }) => {
  const [agree, setAgree] = useState(false);

  return (
    <div>
      <div className='max-w-8xl mx-auto bg-white shadow-lg rounded-lg'>
        <div className="bg-blue-600 text-white p-4 rounded-t-lg">
          <span className='text-lg font-bold'>Data Privacy</span>
        </div>

        <div className='p-8 tracking-wider text-sm lg:text-base lg:tracking-normal lg:p-12'>
          <div className="mb-4 p-6 bg-gray-100 shadow-md rounded-lg max-h-96 overflow-y-scroll">
            <p className="text-gray-900 font-medium mb-4">
              Please read the following data privacy policy carefully before applying for the scholarship program:
            </p>
            <ul className="list-disc list-inside mt-2 text-gray-700 space-y-3">
              <li>Your personal data will be collected and processed for the purpose of evaluating your scholarship application.</li>
              <li>We will take appropriate measures to ensure the security and confidentiality of your personal data.</li>
              <li>Your data may be shared with third parties involved in the scholarship selection process, such as academic institutions and scholarship committees.</li>
              <li>You have the right to access, correct, or delete your personal data at any time by contacting the scholarship office.</li>
              <li>Your data will be retained for as long as necessary to fulfill the purposes outlined in this policy, or as required by law.</li>
              <li>We may use your data to communicate with you about your application status and other scholarship-related matters.</li>
              <li>By submitting your application, you consent to the collection, use, and sharing of your personal data as described in this policy.</li>
              <li>We will not sell or rent your personal data to third parties for marketing purposes.</li>
              <li>You have the right to withdraw your consent to the processing of your personal data at any time, but this may affect your eligibility for the scholarship.</li>
              <li>We may update this data privacy policy from time to time, and any changes will be communicated to you.</li>
              <li>If you have any questions or concerns about our data privacy practices, please contact the scholarship office.</li>
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
              I have read and agree to the data privacy policy.
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step6;