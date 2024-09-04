import React from 'react';

const Step5 = ({ formData, setFormData, errors }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      documents: e.target.files,
    });
  };

  return (
    <div>
      <h2>Upload Requirements</h2>
      <div>
        <label>Upload Documents</label>
        <input
          type="file"
          name="documents"
          multiple
          onChange={handleFileChange}
        />
        {errors.documents && <p className="text-red-500">{errors.documents}</p>}
      </div>
      {/* Add more fields as needed */}
    </div>
  );
};

export default Step5;