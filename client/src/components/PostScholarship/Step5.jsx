import React from 'react';

const Step5 = ({ formData }) => {
  return (
    <div>
      <h3>Review your details</h3>
      <p>Scholarship Name: {formData.scholarshipName}</p>
      <p>Provider Name: {formData.providerName}</p>
      <p>Required Documents: {formData.requiredDocuments}</p>
      <p>Applicant View Customization: {formData.applicantViewCustomization}</p>
      <p>Make sure all the information is correct before submitting.</p>
    </div>
  );
};

export default Step5;