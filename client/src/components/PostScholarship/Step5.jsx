import React, { useEffect } from 'react';

const Step5 = ({ formData, setFormData }) => {
    useEffect(() => {
        // Scroll to the top of the page when the component is mounted
        window.scrollTo(0, 0);
    }, []);

    return (
        <div>
            {/* <h3>Review your details</h3>
      <p>Scholarship Name: {formData.scholarshipName}</p>
      <p>Provider Name: {formData.providerName}</p>
      <p>Required Documents: {formData.requiredDocuments}</p>
      <p>Applicant View Customization: {formData.applicantViewCustomization}</p>
      <p>Make sure all the information is correct before submitting.</p> */}
        </div>
    );
};

export default Step5;