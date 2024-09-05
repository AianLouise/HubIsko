import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const Step5 = ({ formData, setFormData, errors, scholarship, requiredDocuments }) => {

  const handleFileChange = (e, docType) => {
    const file = e.target.files[0];
    setFormData(prevState => ({
      ...prevState,
      documents: {
        ...prevState.documents,
        [docType]: { file }
      }
    }));
  };

  return (
    <div>
      <div className='max-w-8xl mx-auto bg-white shadow-lg rounded-lg'>
        {scholarship && (
          <div className="scholarship-info bg-white rounded-lg shadow-md">
            <div className="bg-blue-600 text-white p-4 rounded-t-lg">
              <span className='text-lg font-bold'>Upload Requirements</span>
            </div>

            <div className='p-4'>
              <p className='text-sm text-gray-700'>
                Please upload the following documents:
              </p>
              <ul className='list-disc list-inside mt-2 text-sm text-gray-700'>
                {requiredDocuments.map(doc => (
                  <li key={doc.id}>{doc.name}</li>
                ))}
              </ul>

              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4'>
                {requiredDocuments.map(doc => (
                  <div key={doc.id}>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>{doc.name}</label>
                    <input
                      type="file"
                      className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                      onChange={(e) => handleFileChange(e, doc.name)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Step5;