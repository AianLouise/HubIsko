import React, { useEffect, useState } from 'react';

export default function CompleteProfile() {
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    nameExtension: 'None',
    sex: 'FEMALE',
  });

  useEffect(() => {
    fetch('/api/user/details')
      .then((response) => response.json())
      .then((data) => {
        setFormData(prevFormData => ({
          ...prevFormData,
          firstName: data.firstName || '',
          lastName: data.lastName || '',
        }));
      })
      .catch((error) => console.error('Error fetching user details:', error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split('.');
    if (keys.length === 2) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [keys[0]]: {
          ...prevFormData[keys[0]],
          [keys[1]]: value,
        },
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-4 space-y-4 bg-white rounded-lg shadow-md">
      <div className="bg-blue-500 text-white p-4 rounded-md mb-4">
        <h2 className="text-xl font-bold">Personal Information</h2>
      </div>
      <div className="flex flex-col">
        <label className="mb-1 text-gray-700 font-semibold">First Name *</label>
        <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required className="p-2 border border-gray-300 rounded-md" />
      </div>
      <div className="flex flex-col">
        <label className="mb-1 text-gray-700 font-semibold">Middle Name *</label>
        <input type="text" name="middleName" value={formData.middleName} onChange={handleChange} required className="p-2 border border-gray-300 rounded-md" />
      </div>
      <div className="flex flex-col">
        <label className="mb-1 text-gray-700 font-semibold">Last Name *</label>
        <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required className="p-2 border border-gray-300 rounded-md" />
      </div>
      <div className="flex flex-col">
        <label className="mb-1 text-gray-700 font-semibold">Name Extension *</label>
        <input type="text" name="nameExtension" value={formData.nameExtension} onChange={handleChange} required className="p-2 border border-gray-300 rounded-md" />
      </div>
      <div className="flex flex-col">
        <label className="mb-1 text-gray-700 font-semibold">Sex *</label>
        <select name="sex" value={formData.sex} onChange={handleChange} required className="p-2 border border-gray-300 rounded-md">
          <option value="FEMALE">Female</option>
          <option value="MALE">Male</option>
        </select>
      </div>

      <button type="submit" className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600">Submit</button>
    </form>
  );
}