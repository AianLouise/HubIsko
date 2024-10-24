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

  const handleFileChange = (e, docName) => {
    const file = e.target.files[0];
    if (file && validateFileSize(file)) {
      setFormData(prevState => {
        const updatedFormData = {
          ...prevState,
          documents: {
            ...prevState.documents,
            [docName]: { file } // Wrap file in an object
          }
        };
        console.log('Updated formData:', updatedFormData); // Log the updated formData
        return updatedFormData;
      });
      setUploadedFiles(prevState => ({
        ...prevState,
        [docName]: { file } // Wrap file in an object
      }));
      setFileErrors(prevState => ({
        ...prevState,
        [docName]: null
      }));
    } else {
      setFileErrors(prevState => ({
        ...prevState,
        [docName]: 'File size should be 5 MB or less'
      }));
    }
  };

  const handleViewFile = (docName) => {
    const fileObject = uploadedFiles[docName];
    const file = fileObject?.file; // Access the file property
    if (file) {
      if (file instanceof Blob) {
        const fileURL = URL.createObjectURL(file);
        console.log('Opening file URL:', fileURL); // Log the file URL
        window.open(fileURL, '_blank');
      } else {
        console.error('Invalid file object:', file); // Log invalid file object
      }
    } else {
      console.log('No file found for:', docName); // Log if no file is found
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
            <p className='text-base font-medium text-gray-800 mb-2 whitespace-pre-wrap'>{scholarship.documentGuidelines}</p>
            <p className='text-sm text-gray-700 mb-4'>
              Please upload the following documents:
            </p>
            <ul className='list-disc list-inside mt-2 text-sm text-gray-700 space-y-1'>
              {requiredDocuments.map(doc => (
                <li key={doc.name} className='pl-2'>{doc.name}</li>
              ))}
            </ul>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4'>
              {requiredDocuments.map(doc => (
                <div key={doc.name} className='mb-4'>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>{doc.name}</label>
                  <div className='flex items-center'>
                    <input
                      type="file"
                      accept=".jpeg,.jpg,.png,.pdf"
                      className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                      onChange={(e) => handleFileChange(e, doc.name)}
                    />
                    {uploadedFiles[doc.name]?.file && (
                      <button
                        className='hidden lg:inline ml-2 bg-blue-600 text-white text-sm py-1 px-2 rounded hover:bg-blue-700 transition duration-200'
                        type='button'
                        onClick={() => handleViewFile(doc.name)}
                      >
                        View Uploaded
                      </button>
                    )}
                  </div>
                  {uploadedFiles[doc.name]?.file && (
                    <p className='text-xs mt-1'>Uploaded: {uploadedFiles[doc.name].file.name}</p>
                  )}
                  {fileErrors[doc.name] && (
                    <p className='text-sm text-red-600 mt-1'>{fileErrors[doc.name]}</p>
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