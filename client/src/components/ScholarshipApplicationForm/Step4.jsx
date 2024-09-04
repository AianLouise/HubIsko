import React from 'react';

const Step4 = ({ formData, setFormData, errors }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div>
      <h2>Other Information</h2>
      <div>
        <label>Field of Study</label>
        <input
          type="text"
          name="fieldOfStudy"
          value={formData.fieldOfStudy}
          onChange={handleChange}
        />
        {errors.fieldOfStudy && <p className="text-red-500">{errors.fieldOfStudy}</p>}
      </div>
      <div>
        <label>Essay</label>
        <textarea
          name="essay"
          value={formData.essay}
          onChange={handleChange}
        />
        {errors.essay && <p className="text-red-500">{errors.essay}</p>}
      </div>
      {/* Add more fields as needed */}
    </div>
  );
};

export default Step4;