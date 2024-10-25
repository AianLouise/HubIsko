import React, { useState } from 'react';

const Step4 = ({ formData, setFormData, errors, visibleRelativeIndex, setVisibleRelativeIndex, visibleSkillIndex, setVisibleSkillIndex, visibleWorkExperienceIndex, setVisibleWorkExperienceIndex }) => {
  const [relativeErrorMessage, setRelativeErrorMessage] = useState('');
  const [workExperienceErrorMessage, setWorkExperienceErrorMessage] = useState('');
  const [skillErrorMessage, setSkillErrorMessage] = useState('');



  const handleRelativeChange = (index, event) => {
    const { name, value } = event.target;
    const updatedRelatives = [...formData.relatives];
    updatedRelatives[index] = {
      ...updatedRelatives[index],
      [name]: value,
    };
    setFormData({
      ...formData,
      relatives: updatedRelatives,
    });
  }; 

  const addRelative = () => {
    if (visibleRelativeIndex < formData.relatives.length - 1) {
      setVisibleRelativeIndex(visibleRelativeIndex + 1);
      setRelativeErrorMessage(''); // Clear any previous error message
    } else if (formData.relatives.length < 6) {
      // Add a new relative object if the current number of relatives is less than 6
      setFormData({
        ...formData,
        relatives: [...formData.relatives, { name: '', birthdate: '', relationship: '' }],
      });
      setVisibleRelativeIndex(visibleRelativeIndex + 1);
      setRelativeErrorMessage(''); // Clear any previous error message
    } else {
      // Show an error message
      setRelativeErrorMessage("Maximum of 6 relatives can be added.");
    }
    console.log(formData.relatives.length);
  };

  const handleWorkChange = (index, event, type) => {
    const { name, value } = event.target;
    const updatedWorkExperience = [...formData.workExperience];
    updatedWorkExperience[index] = {
      ...updatedWorkExperience[index],
      [name]: value,
    };
    setFormData({
      ...formData,
      workExperience: updatedWorkExperience,
    });
  };

  const addWorkExperience = () => {
    if (visibleWorkExperienceIndex < formData.workExperience.length - 1) {
      setVisibleWorkExperienceIndex(visibleWorkExperienceIndex + 1);
      setWorkExperienceErrorMessage(''); // Clear any previous error message
    } else if (formData.workExperience.length < 2) {
      // Add a new work experience object if the current number of work experiences is less than 2
      setFormData({
        ...formData,
        workExperience: [...formData.workExperience, { companyName: '', dateStarted: '', position: '', monthlySalary: '', appointmentStatus: '' }],
      });
      setVisibleWorkExperienceIndex(visibleWorkExperienceIndex + 1);
      setWorkExperienceErrorMessage(''); // Clear any previous error message
    } else {
      // Show an error message
      setWorkExperienceErrorMessage("Maximum of 2 work experiences can be added.");
    }
  };

  const handleSkillChange = (index, event) => {
    const { name, value } = event.target;
    const updatedSkillsAndQualifications = [...formData.skillsAndQualifications];
    updatedSkillsAndQualifications[index] = {
      ...updatedSkillsAndQualifications[index],
      [name]: value,
    };
    setFormData({
      ...formData,
      skillsAndQualifications: updatedSkillsAndQualifications,
    });
  };

  const addSkill = () => {
    if (visibleSkillIndex < formData.skillsAndQualifications.length - 1) {
      setVisibleSkillIndex(visibleSkillIndex + 1);
      setSkillErrorMessage(''); // Clear any previous error message
    } else if (formData.skillsAndQualifications.length < 6) { // Change 6 to the desired maximum number of skills
      // Add a new skill and qualification object if the current number is less than the maximum
      setFormData({
        ...formData,
        skillsAndQualifications: [...formData.skillsAndQualifications, { skills: '', qualifications: '' }],
      });
      setVisibleSkillIndex(visibleSkillIndex + 1);
      setSkillErrorMessage(''); // Clear any previous error message
    } else {
      // Show an error message
      setSkillErrorMessage("Maximum of 6 skills and qualifications can be added."); // Change 6 to the desired maximum number of skills
    }
  };

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  return (
    <div>
      <div className='max-w-8xl mx-auto bg-white shadow-lg rounded-lg'>
        <div className="bg-blue-600 text-white p-4 rounded-t-lg">
          <span className='text-lg font-bold'>Other Information</span>
        </div>

        <div className='p-4'>
          <span className='text-lg font-bold block'>Relatives</span>
          <span className='text-base font-bold block my-3'>Provide relative's information (Maximum of 6)</span>
          {formData.relatives.map((relative, index) => (
            <div
              key={index}
              className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4 ${(index > visibleRelativeIndex && !relative.name && !relative.birthdate && !relative.relationship) ? 'hidden' : ''
                }`}
            >
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter relative's name"
                  className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                  value={relative.name}
                  onChange={(event) => handleRelativeChange(index, event)}
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Birthdate</label>
                <input
                  type="date"
                  name="birthdate"
                  className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                  value={relative.birthdate}
                  max={today} // Set the max attribute to today's date
                  onChange={(event) => handleRelativeChange(index, event)}
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Relationship</label>
                <select
                  name="relationship"
                  className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                  value={relative.relationship}
                  onChange={(event) => handleRelativeChange(index, event)}
                >
                  <option value="">Select relationship</option>
                  <option value="Parent">Parent</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Child">Child</option>
                  <option value="Uncle">Uncle</option>
                  <option value="Aunt">Aunt</option>
                  <option value="Cousin">Cousin</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          ))}
          <button
            className='bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-800' type='button'
            onClick={addRelative}
          >
            Add Relative
          </button>
          {relativeErrorMessage && <p className='text-red-600 mt-2'>{relativeErrorMessage}</p>}

          <span className='text-lg font-bold mt-8 block'>Work Experience</span>
          <span className='text-base font-bold block my-3'>Are you a working student? Leave blank if not. (Maximum of 2)</span>
          {formData.workExperience.map((workExperience, index) => (
            <div key={index} className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4 ${index > visibleWorkExperienceIndex ? 'hidden' : ''}`}>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  placeholder="Enter company name"
                  className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                  value={workExperience.companyName}
                  onChange={(event) => handleWorkChange(index, event, 'workExperience')}
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Date Started</label>
                <input
                  type="date"
                  name="startDate"
                  className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                  value={workExperience.startDate}
                  onChange={(event) => handleWorkChange(index, event, 'workExperience')}
                  max={today} // Set the max attribute to today's date
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Position</label>
                <input
                  type="text"
                  name="position"
                  placeholder="Enter position"
                  className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                  value={workExperience.position}
                  onChange={(event) => handleWorkChange(index, event, 'workExperience')}
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Monthly Salary</label>
                <input
                  type="text"
                  name="monthlySalary"
                  placeholder="Enter monthly salary"
                  className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                  value={workExperience.monthlySalary}
                  onChange={(event) => handleWorkChange(index, event, 'workExperience')}
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Status of Appointment</label>
                <select
                  name="statusOfAppointment"
                  className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                  value={workExperience.appointmentStatus}
                  onChange={(event) => handleWorkChange(index, event, 'workExperience')}
                >
                  <option value="">Select appointment status</option>
                  <option value="Permanent">Permanent</option>
                  <option value="Temporary">Temporary</option>
                  <option value="Contractual">Contractual</option>
                  <option value="Casual">Casual</option>
                </select>
              </div>
            </div>
          ))}
          <button
            className='bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-800' type='button'
            onClick={addWorkExperience}
          >
            Add Work Experience
          </button>
          {workExperienceErrorMessage && <p className='text-red-600 mt-2'>{workExperienceErrorMessage}</p>}

          <span className='text-lg font-bold mt-8 block'>Skills & Qualifications</span>
          <span className='text-base font-bold block my-3'>Skills (Maximum of 6), Qualifications (Includes membership in related associations, hobbies, etc.)</span>
          {formData.skillsAndQualifications.map((skill, index) => (
            <div key={index} className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-4 ${index > visibleSkillIndex ? 'hidden' : ''}`}>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Skill</label>
                <input
                  type="text"
                  name="skills"
                  placeholder="Enter skill name"
                  className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                  value={index > visibleSkillIndex ? '' : skill.skills}
                  onChange={(event) => handleSkillChange(index, event)}
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Qualification</label>
                <input
                  type="text"
                  name="qualifications"
                  placeholder="Enter qualification"
                  className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                  value={index > visibleSkillIndex ? '' : skill.qualifications}
                  onChange={(event) => handleSkillChange(index, event)}
                />
              </div>
            </div>
          ))}
          <button
            className='bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-800' type='button'
            onClick={addSkill}
          >
            Add Skill & Qualification
          </button>
          {skillErrorMessage && <p className='text-red-600 mt-2'>{skillErrorMessage}</p>}
        </div>
      </div>
    </div>
  );
};

export default Step4;