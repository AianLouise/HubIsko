import React from 'react';

const Step4 = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <label>
        Upload Documents:
        <input type="file" name="uploadDocuments" onChange={handleChange} />
      </label>
    </div>
  );
};

export default Step4;