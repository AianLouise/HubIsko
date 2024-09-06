import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Step5 = ({ formData, setFormData, errors, scholarship, requiredDocuments }) => {
  const [fileErrors, setFileErrors] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState({});

  useEffect(() => {
    if (formData.documents) {
      setUploadedFiles(formData.documents);
    }
  }, [formData.documents]);

  const validateFileSize = (file) => {
    const maxSizeInMB = 5;
    return file.size / (1024 * 1024) <= maxSizeInMB;
  };

  const handleFileChange = (e, docType) => {
    const file = e.target.files[0];
    if (file && validateFileSize(file)) {
      setFormData(prevState => {
        const updatedFormData = {
          ...prevState,
          documents: {
            ...prevState.documents,
            [docType]: {file}
          }
        };
        console.log('Updated formData:', updatedFormData); // Log the updated formData
        return updatedFormData;
      });
      setUploadedFiles(prevState => ({
        ...prevState,
        [docType]: file
      }));
      setFileErrors(prevState => ({
        ...prevState,
        [docType]: null
      }));
    } else {
      setFileErrors(prevState => ({
        ...prevState,
        [docType]: 'File size should be 5 MB or less'
      }));
    }
  };

  const handleViewFile = (docType) => {
    const file = uploadedFiles[docType];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL, '_blank');
    }
  };

  return (
    <div>
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
                <div key={doc.id} className='mb-4'>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>{doc.name}</label>
                  <div className='flex items-center'>
                    <input
                      type="file"
                      accept=".jpeg,.jpg,.png,.pdf"
                      className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                      onChange={(e) => handleFileChange(e, doc.id)}
                    />
                    {uploadedFiles[doc.id] && (
                      <button
                        className='hidden lg:inline ml-2 bg-blue-600 text-white text-sm py-1 px-2 rounded hover:bg-blue-700 transition duration-200'
                        type='button'
                        onClick={() => handleViewFile(doc.id)}
                      >
                        View Uploaded
                      </button>
                    )}
                  </div>
                  {uploadedFiles[doc.id] && (
                                        <p className='text-xs mt-1'>Uploaded: {uploadedFiles[doc.id]?.file?.name}</p>
                  )}
                  {fileErrors[doc.id] && (
                    <p className='text-sm text-red-600 mt-1'>{fileErrors[doc.id]}</p>
                  )}
                  {doc.guidelines && (
                    <p className='text-xs text-gray-500 mt-1'>{doc.guidelines}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Step5;