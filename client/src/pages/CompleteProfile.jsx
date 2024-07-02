import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Step 1

export default function CompleteProfile() {
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    nameExtension: 'None',
    sex: 'FEMALE',
    dateOfBirth: '',
    mobileNumber: '',
  });

  const navigate = useNavigate(); // Step 2

  useEffect(() => {
    fetch('/api/user/details')
      .then((response) => response.json())
      .then((data) => {
        setFormData(prevFormData => ({
          ...prevFormData,
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth).toISOString().split('T')[0] : '',
        }));
      })
      .catch((error) => console.error('Error fetching user details:', error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('/api/user/complete-profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Network response was not ok.');
      })
      .then(data => {
        console.log('Success:', data);
        navigate('/'); // Step 3: Navigate to home page
      })
      .catch((error) => {
        console.error('Error:', error);
      });
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
      <div className="flex flex-col">
        <label className="mb-1 text-gray-700 font-semibold">Date of Birth *</label>
        <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required className="p-2 border border-gray-300 rounded-md" />
      </div>
      <div className="flex flex-col">
        <label className="mb-1 text-gray-700 font-semibold">Mobile Number *</label>
        <input type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} required className="p-2 border border-gray-300 rounded-md" />
      </div>

      <button type="submit" className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600">Submit</button>
    </form>
  );
}