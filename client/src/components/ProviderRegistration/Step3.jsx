import React, { useEffect, useState } from 'react';

const Step3 = ({ formData, setFormData }) => {
  const [fileErrors, setFileErrors] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState({});

  useEffect(() => {
    // Scroll to the top of the page when the component is mounted
    window.scrollTo(0, 0);
  }, []); // Empty dependency array ensures this runs only once


  useEffect(() => {
    // Initialize the uploaded files from formData, if available
    if (formData.documents) {
      setUploadedFiles(formData.documents);
    }
  }, [formData.documents]);

  const validateFileSize = (file) => {
    const maxSizeInMB = 10; // Set max file size to 5MB
    return file.size / (1024 * 1024) <= maxSizeInMB;
  };

  const handleFileChange = (event, docType) => {
    const file = event.target.files[0];
    if (file && validateFileSize(file)) {
      setFormData((prevState) => ({
        ...prevState,
        documents: {
          ...prevState.documents,
          [docType]: file,
        },
      }));
      setUploadedFiles((prevState) => ({
        ...prevState,
        [docType]: file,
      }));
      setFileErrors((prevState) => ({
        ...prevState,
        [docType]: null,
      }));
    } else {
      setFileErrors((prevState) => ({
        ...prevState,
        [docType]: 'File size should be 10 MB or less',
      }));
    }
  };

  const handleViewFile = (docType) => {
    const file = uploadedFiles[docType];
    if (file instanceof Blob) {
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL, '_blank');
    } else {
      console.error('Invalid file object:', file);
    }
  };

  return (
    <div className="bg-white p-8 shadow rounded-md border max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Upload Required Documents</h2>
      <div className="grid grid-cols-2 gap-4">
        {[
          { name: 'Registration Certificate', id: 'registrationCertificate' },
          { name: 'TIN', id: 'tin' },
          { name: 'Proof of Address', id: 'proofOfAddress' },
          { name: 'Authorization Letter', id: 'authorizationLetter' },
          { name: 'ID Proof of Contact Person', id: 'idProofContactPerson' },
        ].map((doc) => (
          <div key={doc.id} className="mb-4">
            <label htmlFor={doc.id} className="block text-sm font-medium text-gray-700">
              {doc.name}
            </label>
            <div className="flex items-center">
              <input
                type="file"
                accept=".jpeg,.jpg,.png,.pdf"
                id={doc.id}
                className="mt-1 p-2 w-full border rounded-md"
                onChange={(e) => handleFileChange(e, doc.id)}
              />
              {uploadedFiles[doc.id] && (
                <button
                  className="hidden lg:inline ml-2 bg-blue-600 text-white text-sm py-1 px-2 rounded hover:bg-blue-700 transition duration-200"
                  type="button"
                  onClick={() => handleViewFile(doc.id)}
                >
                  View Uploaded
                </button>
              )}
            </div>
            {uploadedFiles[doc.id] && (
              <p className="text-xs mt-1">Uploaded: {uploadedFiles[doc.id]?.name}</p>
            )}
            {fileErrors[doc.id] && (
              <p className="text-sm text-red-600 mt-1">{fileErrors[doc.id]}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Step3;