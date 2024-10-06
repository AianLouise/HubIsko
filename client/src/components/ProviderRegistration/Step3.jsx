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
    const maxSizeInMB = 10; // Set max file size to 10MB
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
      <h2 className="text-2xl font-bold mb-4 text-center">
        Upload Required Documents
      </h2>
      <p className="text-sm text-gray-600 mb-6 text-center">
        Please upload the necessary documents to complete your registration. Each document should be in JPEG, JPG, PNG, or PDF format and should not exceed 10 MB.
      </p>
      <div className="space-y-6">
        {[
          { name: 'Certificate of Incorporation or Registration', id: 'registrationCertificate' },
          { name: 'TIN', id: 'tin' },
          { name: 'Proof of Address', id: 'proofOfAddress' },
          { name: 'Authorization Letter', id: 'authorizationLetter' },
          { name: 'ID Proof of Contact Person', id: 'idProofContactPerson' },
        ].map((doc) => (
          <div key={doc.id} className="mb-4">
            <label htmlFor={doc.id} className="block text-sm font-medium text-gray-700 mb-1">
              {doc.name} <span className="text-red-500">*</span>
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
                  className="ml-2 bg-blue-600 text-white text-sm py-1 px-2 rounded hover:bg-blue-700 transition duration-200"
                  type="button"
                  onClick={() => handleViewFile(doc.id)}
                  title={`View uploaded ${doc.name}`}
                >
                  View Uploaded
                </button>
              )}
            </div>
            {uploadedFiles[doc.id] && (
              <p className="text-xs mt-1 text-gray-600">Uploaded: {uploadedFiles[doc.id]?.name}</p>
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