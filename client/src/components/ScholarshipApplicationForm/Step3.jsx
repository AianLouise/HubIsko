import React from 'react';

const Step3 = ({ formData, setFormData, errors }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div>
      <h2>Education Information</h2>
      <div>
        <label>School Name</label>
        <input
          type="text"
          name="schoolName"
          value={formData.schoolName}
          onChange={handleChange}
        />
        {errors.schoolName && <p className="text-red-500">{errors.schoolName}</p>}
      </div>
      <div>
        <label>GPA</label>
        <input
          type="text"
          name="gpa"
          value={formData.gpa}
          onChange={handleChange}
        />
        {errors.gpa && <p className="text-red-500">{errors.gpa}</p>}
      </div>
      {/* Add more fields as needed */}
    </div>
  );
};

export default Step3;