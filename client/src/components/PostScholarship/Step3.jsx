import React from 'react';

const Step3 = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <label>
        Applicant View Customization:
        <textarea name="applicantViewCustomization" value={formData.applicantViewCustomization || ''} onChange={handleChange}></textarea>
      </label>
    </div>
  );
};

export default Step3;