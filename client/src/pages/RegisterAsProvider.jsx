import React, { useState } from 'react';

export default function RegisterAsProvider() {
  const [formData, setFormData] = useState({
    organizationName: '',
    email: '',
    contactPerson: '',
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add form submission logic here
    // Ensure email uniqueness and password strength requirements
    console.log(formData);
  };

  return (
    <div className="max-w-md mx-auto my-10 bg-white p-8 rounded-lg shadow">
      <h2 className="text-2xl font-bold text-center mb-6">Enter Organization Information</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700">Organization Name</label>
          <input type="text" name="organizationName" id="organizationName" value={formData.organizationName} onChange={handleChange} className="mt-1 p-2 w-full border rounded-md" />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
          <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className="mt-1 p-2 w-full border rounded-md" />
        </div>
        <div className="mb-4">
          <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700">Contact Person Details</label>
          <input type="text" name="contactPerson" id="contactPerson" value={formData.contactPerson} onChange={handleChange} className="mt-1 p-2 w-full border rounded-md" />
        </div>
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">Choose a Username</label>
          <input type="text" name="username" id="username" value={formData.username} onChange={handleChange} className="mt-1 p-2 w-full border rounded-md" />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Choose a Password</label>
          <input type="password" name="password" id="password" value={formData.password} onChange={handleChange} className="mt-1 p-2 w-full border rounded-md" />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">Register</button>
      </form>
    </div>
  );
}