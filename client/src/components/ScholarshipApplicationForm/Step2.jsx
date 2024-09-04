import React from 'react';

const Step2 = ({ formData, setFormData, errors }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div>
      <h2>Custodian Information</h2>
      <div>
        <label>Custodian Name</label>
        <input
          type="text"
          name="custodianName"
          value={formData.custodianName}
          onChange={handleChange}
        />
        {errors.custodianName && <p className="text-red-500">{errors.custodianName}</p>}
      </div>
      <div>
        <label>Custodian Phone</label>
        <input
          type="text"
          name="custodianPhone"
          value={formData.custodianPhone}
          onChange={handleChange}
        />
        {errors.custodianPhone && <p className="text-red-500">{errors.custodianPhone}</p>}
      </div>
      {/* Add more fields as needed */}
    </div>
  );
};

export default Step2;