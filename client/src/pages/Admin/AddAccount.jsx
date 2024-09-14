import React, { useState } from 'react';

export default function AddAccount() {
  const [role, setRole] = useState('applicant'); // Default to applicant
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    applicantDetails: {
        firstName: '',
        middleName: '',
        lastName: '',
        nameExtension: '',
        birthdate: '',
        gender: '',
        bloodType: '',
        civilStatus: '',
        contactNumber: '',
        address: {
          region: '',
          province: '',
          city: '',
          barangay: '',
          addressDetails: '',
        },
        education: {
          elementary: {
            school: '',
            award: '',
            yearGraduated: '',
          },
          juniorHighSchool: {
            school: '',
            award: '',
            yearGraduated: '',
          },
          seniorHighSchool: {
            school: '',
            award: '',
            yearGraduated: '',
          },
          college: {
            school: '',
            course: '',
            yearGraduated: '',
          },
        },
    },
    scholarshipProviderDetails: {
      organizationName: '',
      contactPersonName: '',
      email: '',
      registrationNumber: '',
    },
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle role-based inputs
  const handleRoleInputChange = (e, section) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [name]: value,
      },
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Do something with formData, e.g., send to backend
    console.log(formData);
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
            value={role}
            onChange={(e) => setRole(e.target.value)}
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

        {/* Conditional Fields based on role */}
        {role === 'applicant' && (
          <>
            <div>
              <label className="block mb-2 font-medium">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.applicantDetails.firstName}
                onChange={(e) => handleRoleInputChange(e, 'applicantDetails')}
                className="p-2 border rounded w-full"
                required
              />
            </div>
            <div>
              <label className="block mb-2 font-medium">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.applicantDetails.lastName}
                onChange={(e) => handleRoleInputChange(e, 'applicantDetails')}
                className="p-2 border rounded w-full"
                required
              />
            </div>
          </>
        )}

        {role === 'scholarship_provider' && (
          <>
            <div>
              <label className="block mb-2 font-medium">Organization Name</label>
              <input
                type="text"
                name="organizationName"
                value={formData.scholarshipProviderDetails.organizationName}
                onChange={(e) => handleRoleInputChange(e, 'scholarshipProviderDetails')}
                className="p-2 border rounded w-full"
                required
              />
            </div>
            <div>
              <label className="block mb-2 font-medium">Contact Person Name</label>
              <input
                type="text"
                name="contactPersonName"
                value={formData.scholarshipProviderDetails.contactPersonName}
                onChange={(e) => handleRoleInputChange(e, 'scholarshipProviderDetails')}
                className="p-2 border rounded w-full"
                required
              />
            </div>
            <div>
              <label className="block mb-2 font-medium">Registration Number</label>
              <input
                type="text"
                name="registrationNumber"
                value={formData.scholarshipProviderDetails.registrationNumber}
                onChange={(e) => handleRoleInputChange(e, 'scholarshipProviderDetails')}
                className="p-2 border rounded w-full"
                required
              />
            </div>
          </>
        )}

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
