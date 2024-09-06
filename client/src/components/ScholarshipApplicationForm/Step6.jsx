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
          <div className='mb-4'>
            <p className=' text-gray-900 font-medium mb-4'>
              Please read the following terms and conditions carefully before applying for the scholarship program:
            </p>
            <ul className='list-disc list-inside mt-2 text-gray-700 space-y-3'>
              <li>The scholarship is open to all eligible applicants who meet the specified academic and financial criteria.</li>
              <li>Applicants must provide accurate and complete information in the application form. Any falsification of information may result in disqualification.</li>
              <li>Scholarship recipients are required to maintain the academic performance as stipulated in the scholarship guidelines to continue receiving funding.</li>
              <li>Recipients may be required to participate in specific events or activities related to the scholarship program, such as mentorship sessions or community service.</li>
              <li>The scholarship is non-transferable and must be used solely for the purpose of funding the recipient's education-related expenses.</li>
            </ul>
          </div>

          <div className='flex items-center mb-4 mt-6'>
            <input
              type="checkbox"
              id="agree"
              name="agree"
              className='mr-2 h-12 w-12 lg:w-8 lg:h-8'
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