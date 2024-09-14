import React, { useState } from 'react';

export default function AddAccount() {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    role: 'applicant',
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSubmit = {
      email: formData.email,
      username: formData.username,
      password: formData.password,
      role: formData.role, // Include the role in the data to submit
    };

    try {
      const response = await fetch('/api/admin/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSubmit),
      });

      if (!response.ok) {
        throw new Error('Failed to create account');
      }

      alert('Account created successfully!');
      setFormData({
        email: '',
        username: '',
        password: '',
        role: 'applicant', // Reset role to default
      });
    } catch (error) {
      alert('Failed to create account. Please try again.');
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add Account</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Role Selector */}
        <div>
          <label className="block mb-2 font-medium">Select Role</label>
          <select
            className="p-2 border rounded w-full"
            name="role"
            value={formData.role}
            onChange={handleInputChange}
          >
            <option value="applicant">Applicant</option>
            <option value="scholarship_provider">Scholarship Provider</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Common Fields */}
        <div>
          <label className="block mb-2 font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="p-2 border rounded w-full"
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            className="p-2 border rounded w-full"
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="p-2 border rounded w-full"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-md shadow"
        >
          Add Account
        </button>
      </form>
    </div>
  );
}