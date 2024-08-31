import React, { useState } from 'react';

const StepTemplate = ({ steps, formData, setFormData, currentPage, setCurrentPage }) => {
  const [errors, setErrors] = useState({});

  const validateStep = () => {
    const currentStep = steps[currentPage];
    if (currentStep.validate) {
      const validationErrors = currentStep.validate(formData);
      setErrors(validationErrors);
      return Object.keys(validationErrors).length === 0;
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep() && currentPage < steps.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevStep = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="steps-container">
      <div className="step">
        <div className="step-content py-5">
          {React.cloneElement(steps[currentPage].content, { formData, setFormData, errors })}
        </div>
      </div>
      <div className="navigation-buttons flex justify-between pb-5">
        {currentPage > 0 && (
          <button
          type='button'
            className="btn-prev bg-gray-200 text-gray-700 px-6 py-2 rounded hover:bg-gray-300"
            onClick={prevStep}
          >
            Previous
          </button>
        )}
        {currentPage < steps.length - 1 && (
          <button
            type='button'
            className="btn-next bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 ml-auto"
            onClick={nextStep}
          >
            Next
          </button>
        )}
        {currentPage === steps.length - 1 && (
          <button
            className="btn-submit bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 ml-auto"
            type="submit"
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );
};

export default StepTemplate;