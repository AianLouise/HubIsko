import React from 'react';

const Step3 = ({ formData, setFormData, errors }) => {
  const handleEducationChange = (e, level) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      education: {
        ...prevState.education,
        [level]: {
          ...prevState.education[level],
          [name]: value
        }
      }
    }));
  };

  return (
    <div>
      <div className='max-w-8xl mx-auto bg-white shadow-lg rounded-lg'>
        <div className="bg-blue-600 text-white p-4 rounded-t-lg">
          <span className='text-lg font-bold'>Education Information</span>
        </div>

        <div className='p-4 education-form'>
          {/* Elementary */}
          <span className='text-lg font-bold block'>Elementary</span>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>School</label>
              <input
                type="text"
                name="school"
                value={formData.education.elementary.school}
                onChange={(e) => handleEducationChange(e, 'elementary')}
                required
                placeholder="Enter elementary school name"
                className='standard-input border border-gray-300 rounded-md p-2 w-full'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Award</label>
              <input
                type="text"
                name="award"
                value={formData.education.elementary.award}
                onChange={(e) => handleEducationChange(e, 'elementary')}
                required
                placeholder="Enter elementary award"
                className='standard-input border border-gray-300 rounded-md p-2 w-full'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Year Graduated</label>
              <select
                name="yearGraduated"
                value={formData.education.elementary.yearGraduated}
                onChange={(e) => handleEducationChange(e, 'elementary')}
                required
                className='standard-input border border-gray-300 rounded-md p-2 w-full'
              >
                <option value="">Select year</option>
                {Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Junior High School */}
          <span className='text-lg font-bold mt-8 block'>Junior High School</span>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>School</label>
              <input
                type="text"
                name="school"
                value={formData.education.juniorHighSchool.school}
                onChange={(e) => handleEducationChange(e, 'juniorHighSchool')}
                required
                placeholder="Enter junior high school name"
                className='standard-input border border-gray-300 rounded-md p-2 w-full'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Award</label>
              <input
                type="text"
                name="award"
                value={formData.education.juniorHighSchool.award}
                onChange={(e) => handleEducationChange(e, 'juniorHighSchool')}
                required
                placeholder="Enter junior high school award"
                className='standard-input border border-gray-300 rounded-md p-2 w-full'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Year Graduated</label>
              <select
                name="yearGraduated"
                value={formData.education.juniorHighSchool.yearGraduated}
                onChange={(e) => handleEducationChange(e, 'juniorHighSchool')}
                required
                className='standard-input border border-gray-300 rounded-md p-2 w-full'
              >
                <option value="">Select year</option>
                {Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Senior High School */}
          <span className='text-lg font-bold mt-8 block'>Senior High School</span>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>School</label>
              <input
                type="text"
                name="school"
                value={formData.education.seniorHighSchool.school}
                onChange={(e) => handleEducationChange(e, 'seniorHighSchool')}
                required
                placeholder="Enter senior high school name"
                className='standard-input border border-gray-300 rounded-md p-2 w-full'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Award</label>
              <input
                type="text"
                name="award"
                value={formData.education.seniorHighSchool.award}
                onChange={(e) => handleEducationChange(e, 'seniorHighSchool')}
                required
                placeholder="Enter senior high school award"
                className='standard-input border border-gray-300 rounded-md p-2 w-full'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Year Graduated</label>
              <select
                name="yearGraduated"
                value={formData.education.seniorHighSchool.yearGraduated}
                onChange={(e) => handleEducationChange(e, 'seniorHighSchool')}
                required
                className='standard-input border border-gray-300 rounded-md p-2 w-full'
              >
                <option value="">Select year</option>
                {Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>

          {/* College */}
          <span className='text-lg font-bold mt-8 block'>College</span>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>College</label>
              <input
                type="text"
                name="school"
                value={formData.education.college.school}
                onChange={(e) => handleEducationChange(e, 'college')}
                required
                placeholder="Enter college name"
                className='standard-input border border-gray-300 rounded-md p-2 w-full'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>College Course</label>
              <input
                type="text"
                name="course"
                value={formData.education.college.course}
                onChange={(e) => handleEducationChange(e, 'college')}
                required
                placeholder="Enter college course"
                className='standard-input border border-gray-300 rounded-md p-2 w-full'
              />
            </div>
            {/* <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-2'>College Year Graduated</label>
                                            <select
                                                name="yearGraduated"
                                                value={formData.education.college.yearGraduated}
                                                onChange={(e) => handleEducationChange(e, 'college')}
                                                className='standard-input border border-gray-300 rounded-md p-2 w-full'
                                            >
                                                <option value="">Select year</option>
                                                {Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i).map(year => (
                                                <option key={year} value={year}>{year}</option>
                                                ))}
                                            </select>
                                            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step3;