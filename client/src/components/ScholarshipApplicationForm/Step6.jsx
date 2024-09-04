import React from 'react';

const Step6 = ({ formData, setFormData, errors }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (e) => {
    setFormData({
      ...formData,
      agree: e.target.checked,
    });
  };

  return (
    <div>
      <h2>Terms and Conditions</h2>
      <div>
        <label>
          <input
            type="checkbox"
            name="agree"
            checked={formData.agree}
            onChange={handleCheckboxChange}
          />
          I agree to the terms and conditions
        </label>
        {errors.agree && <p className="text-red-500">{errors.agree}</p>}
      </div>
    </div>
  );
};

export default Step6;