import React, { useState, useEffect } from 'react';

const Step2 = ({ formData, setFormData, errors }) => {
  const handleChange = (e, parentKey = null) => {
    const { name, value } = e.target;
    setFormData(prevState => {
      if (parentKey) {
        return {
          ...prevState,
          [parentKey]: {
            ...prevState[parentKey],
            [name]: value
          }
        };
      } else {
        return {
          ...prevState,
          [name]: value
        };
      }
    });
  };

  const [selectedTab, setSelectedTab] = useState('');

  useEffect(() => {
    if (formData.father.firstName || formData.mother.firstName) {
      setSelectedTab('Parents');
    } else if (formData.guardian.firstName) {
      setSelectedTab('Guardians');
    }
  }, [formData]);

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
    if (tab === 'Parents') {
      setFormData(prevState => ({
        ...prevState,
        guardian: {
          firstName: '',
          lastName: '',
          middleName: '',
          birthdate: '',
          occupation: '',
          yearlyIncome: '',
          contactNo: ''
        }
      }));
    } else if (tab === 'Guardians') {
      setFormData(prevState => ({
        ...prevState,
        father: {
          firstName: '',
          lastName: '',
          middleName: '',
          birthdate: '',
          occupation: '',
          yearlyIncome: '',
          contactNo: ''
        },
        mother: {
          firstName: '',
          lastName: '',
          middleName: '',
          birthdate: '',
          occupation: '',
          yearlyIncome: '',
          contactNo: ''
        }
      }));
    }
  };

  const today = new Date().toISOString().split('T')[0]; // Get today's date

  return (
    <div>
      <div className='max-w-8xl mx-auto bg-white shadow-lg rounded-lg'>
        <div className="bg-blue-600 text-white p-4 rounded-t-lg">
          <span className='text-lg font-bold'>Custodians' Information</span>
        </div>

        <div className='mt-2'>

          <div className='flex flex-col items-center gap-4 border-b pb-4'>
            <span className='text-xl font-bold'>Please Select:</span>

            <div className='flex gap-5'>
              <button
                className={`border text-center rounded-xl px-16 py-4 ${selectedTab === 'Parents' ? 'bg-white text-blue-600 shadow-md' : 'bg-slate-200 hover:bg-slate-300'}`}
                onClick={() => handleTabClick('Parents')} type='button'
              >
                I am guided by my Parents
              </button>

              <button
                className={`border text-center rounded-xl px-16 py-4 ${selectedTab === 'Guardians' ? 'bg-white text-blue-600 shadow-md' : 'bg-slate-200 hover:bg-slate-300'}`}
                onClick={() => handleTabClick('Guardians')} type='button'
              >
                I am guided by my Guardian(s)
              </button>
            </div>
          </div>
        </div>

        {selectedTab === 'Parents' && (
          <div className='p-4'>
            <span className='text-lg font-bold'>Father's Information</span>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.father.firstName}
                  onChange={(e) => handleChange(e, 'father')}
                  required
                  className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                  placeholder="Enter first name"
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.father.lastName}
                  onChange={(e) => handleChange(e, 'father')}
                  required
                  className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                  placeholder="Enter last name"
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Middle Name</label>
                <input
                  type="text"
                  name="middleName"
                  value={formData.father.middleName}
                  onChange={(e) => handleChange(e, 'father')}
                  required
                  className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                  placeholder="Enter middle name"
                />
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Birthdate</label>
                <input
                  type="date"
                  name="birthdate"
                  value={formData.father.birthdate}
                  onChange={(e) => handleChange(e, 'father')}
                  required
                  max={today} // Set the max attribute to today's date
                  className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                  placeholder="Enter birthdate"
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Occupation</label>
                <input
                  type="text"
                  name="occupation"
                  value={formData.father.occupation}
                  onChange={(e) => handleChange(e, 'father')}
                  required
                  className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                  placeholder="Enter occupation"
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Yearly Income</label>
                <select
                  name="yearlyIncome"
                  value={formData.father.yearlyIncome}
                  onChange={(e) => handleChange(e, 'father')}
                  required
                  className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                >
                  <option value="" disabled>Select yearly income</option>
                  <option value="100000">Below ₱100,000</option>
                  <option value="200000">₱100,000 - ₱200,000</option>
                  <option value="300000">₱200,000 - ₱300,000</option>
                  <option value="400000">₱300,000 - ₱400,000</option>
                  <option value="500000">₱400,000 - ₱500,000</option>
                  <option value="600000">₱500,000 - ₱600,000</option>
                  <option value="700000">₱600,000 - ₱700,000</option>
                  <option value="800000">₱700,000 - ₱800,000</option>
                  <option value="900000">₱800,000 - ₱900,000</option>
                  <option value="1000000">₱900,000 - ₱1,000,000</option>
                </select>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Contact No.</label>
                <input
                  type="tel"
                  name="contactNo"
                  value={formData.father.contactNo}
                  onChange={(e) => handleChange(e, 'father')}
                  required
                  className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                  placeholder="Enter contact number"
                />
              </div>
            </div>





            <span className='text-lg font-bold mt-8 block'>Mother's Information</span>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.mother.firstName}
                  onChange={(e) => handleChange(e, 'mother')}
                  required
                  className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                  placeholder="Enter first name"
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.mother.lastName}
                  onChange={(e) => handleChange(e, 'mother')}
                  required
                  className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                  placeholder="Enter last name"
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Middle Name</label>
                <input
                  type="text"
                  name="middleName"
                  value={formData.mother.middleName}
                  onChange={(e) => handleChange(e, 'mother')}
                  required
                  className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                  placeholder="Enter middle name"
                />
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Birthdate</label>
                <input
                  type="date"
                  name="birthdate"
                  value={formData.mother.birthdate}
                  onChange={(e) => handleChange(e, 'mother')}
                  required
                  max={today}
                  className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                  placeholder="Enter birthdate"
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Occupation</label>
                <input
                  type="text"
                  name="occupation"
                  value={formData.mother.occupation}
                  onChange={(e) => handleChange(e, 'mother')}
                  required
                  className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                  placeholder="Enter occupation"
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Yearly Income</label>
                <select
                  name="yearlyIncome"
                  value={formData.mother.yearlyIncome}
                  onChange={(e) => handleChange(e, 'mother')}
                  required
                  className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                >
                  <option value="" disabled>Select yearly income</option>
                  <option value="100000">Below ₱100,000</option>
                  <option value="200000">₱100,000 - ₱200,000</option>
                  <option value="300000">₱200,000 - ₱300,000</option>
                  <option value="400000">₱300,000 - ₱400,000</option>
                  <option value="500000">₱400,000 - ₱500,000</option>
                  <option value="600000">₱500,000 - ₱600,000</option>
                  <option value="700000">₱600,000 - ₱700,000</option>
                  <option value="800000">₱700,000 - ₱800,000</option>
                  <option value="900000">₱800,000 - ₱900,000</option>
                  <option value="1000000">₱900,000 - ₱1,000,000</option>
                </select>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Contact No.</label>
                <input
                  type="tel"
                  name="contactNo"
                  value={formData.mother.contactNo}
                  onChange={(e) => handleChange(e, 'mother')}
                  required
                  className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                  placeholder="Enter contact number"
                />
              </div>
            </div>


          </div>
        )}



        {selectedTab === 'Guardians' && (
          <div className='p-4'>

            <span className='text-lg font-bold mt-8 block'>Guardian's Information</span>
            <div className='mt-4'>
              {/* <label className='block text-sm font-medium text-gray-700 mb-2'>
                                        <input
                                            type="checkbox"
                                            name="sameAsParents"
                                            checked={sameAsParents}
                                            onChange={handleCheckboxChange}
                                            className='mr-2'
                                        />
                                        Same as parents
                                    </label> */}
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.guardian.firstName}
                  onChange={(e) => handleChange(e, 'guardian')}
                  className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                  placeholder="Enter first name"
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.guardian.lastName}
                  onChange={(e) => handleChange(e, 'guardian')}
                  className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                  placeholder="Enter last name"
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Middle Name</label>
                <input
                  type="text"
                  name="middleName"
                  value={formData.guardian.middleName}
                  onChange={(e) => handleChange(e, 'guardian')}
                  className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                  placeholder="Enter middle name"
                />
              </div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Birthdate</label>
                <input
                  type="date"
                  name="birthdate"
                  value={formData.guardian.birthdate}
                  onChange={(e) => handleChange(e, 'guardian')}
                  max={today}
                  className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                  placeholder="Enter birthdate"
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Occupation</label>
                <input
                  type="text"
                  name="occupation"
                  value={formData.guardian.occupation}
                  onChange={(e) => handleChange(e, 'guardian')}
                  className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                  placeholder="Enter occupation"
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Yearly Income</label>
                <select
                  name="yearlyIncome"
                  value={formData.guardian.yearlyIncome}
                  onChange={(e) => handleChange(e, 'guardian')}
                  className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                >
                  <option value="" disabled>Select yearly income</option>
                  <option value="100000">Below ₱100,000</option>
                  <option value="200000">₱100,000 - ₱200,000</option>
                  <option value="300000">₱200,000 - ₱300,000</option>
                  <option value="400000">₱300,000 - ₱400,000</option>
                  <option value="500000">₱400,000 - ₱500,000</option>
                  <option value="600000">₱500,000 - ₱600,000</option>
                  <option value="700000">₱600,000 - ₱700,000</option>
                  <option value="800000">₱700,000 - ₱800,000</option>
                  <option value="900000">₱800,000 - ₱900,000</option>
                  <option value="1000000">₱900,000 - ₱1,000,000</option>
                </select>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Contact No.</label>
                <input
                  type="tel"
                  name="contactNo"
                  value={formData.guardian.contactNo}
                  onChange={(e) => handleChange(e, 'guardian')}
                  className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                  placeholder="Enter contact number"
                />
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default Step2;