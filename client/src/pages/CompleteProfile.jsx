import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Step 1

export default function CompleteProfile() {
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    nameExtension: 'None',
    sex: 'MALE',
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
        <label className="mb-1 text-gray-700 font-semibold">Name Extension (if applicable)</label>
        <select name="nameExtension" value={formData.nameExtension} onChange={handleChange} className="p-2 border border-gray-300 rounded-md">
          <option value="">None</option>
          <option value="Jr.">Jr. (Junior)</option>
          <option value="Sr.">Sr. (Senior)</option>
          <option value="III">III (The Third)</option>
          <option value="IV">IV (The Fourth)</option>
        </select>
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

      <div className="bg-blue-500 text-white p-4 rounded-md mb-4">
        <h2 className="text-xl font-bold">Permanent Address</h2>
      </div>
      <div className="flex flex-col">
        <span className="mb-2 text-sm text-gray-600">Note: Your permanent address is based on the voter's id or certification of your parents.</span>
        <label className="mb-1 text-gray-700 font-semibold">House/Bldg. No., Street *</label>
        <input type="text" name="permanentAddress" value={formData.permanentAddress} onChange={handleChange} required className="p-2 border border-gray-300 rounded-md" placeholder="#123 CAPITOL STREET" />
      </div>
      <div className="flex flex-col">
        <label className="mb-1 text-gray-700 font-semibold">Barangay *</label>
        <input type="text" name="barangay" value={formData.barangay} onChange={handleChange} required className="p-2 border border-gray-300 rounded-md" placeholder="SAN JOSE" />
      </div>
      <div className="flex flex-col">
        <label className="mb-1 text-gray-700 font-semibold">Municipality *</label>
        <select name="municipality" value={formData.municipality} onChange={handleChange} required className="p-2 border border-gray-300 rounded-md">
          <option value="">Select a municipality</option>
          <option value="Angeles City">Angeles City</option>
          <option value="Apalit">Apalit</option>
          <option value="Aramina">Aramina</option>
          <option value="Bacolor">Bacolor</option>
          <option value="Candaba">Candaba</option>
          <option value="Floridablanca">Floridablanca</option>
          <option value="Guagua">Guagua</option>
          <option value="Lubao">Lubao</option>
          <option value="Mabalacat City">Mabalacat City</option>
          <option value="Macabebe">Macabebe</option>
          <option value="Magalang">Magalang</option>
          <option value="Masantol">Masantol</option>
          <option value="Mexico">Mexico</option>
          <option value="Minalin">Minalin</option>
          <option value="Porac">Porac</option>
          <option value="San Fernando">San Fernando</option>
          <option value="San Luis">San Luis</option>
          <option value="San Simon">San Simon</option>
          <option value="Santa Ana">Santa Ana</option>
          <option value="Santa Rita">Santa Rita</option>
          <option value="Santo Tomas">Santo Tomas</option>
          <option value="Sasmuan (Sexmoan)">Sasmuan (Sexmoan)</option>
        </select>
      </div>
      <div className="flex flex-col">
        <label className="mb-1 text-gray-700 font-semibold">Province *</label>
        <select name="province" value={formData.province} onChange={handleChange} required className="p-2 border border-gray-300 rounded-md">
          <option value="">Select a province</option>
          <option value="Pampanga">Pampanga</option>
        </select>
      </div>

      <div className="bg-blue-500 text-white p-4 rounded-md mb-4">
        <h2 className="text-xl font-bold">Mother's Maiden Name</h2>
      </div>
      <div className="flex flex-col space-y-4 mb-4">
        <div className="flex flex-col">
          <label className="mb-1 text-gray-700 font-semibold">First Name *</label>
          <input type="text" name="motherFirstName" value={formData.motherFirstName} onChange={handleChange} required className="p-2 border border-gray-300 rounded-md" placeholder="MARIA" />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 text-gray-700 font-semibold">Middle Name *</label>
          <input type="text" name="motherMiddleName" value={formData.motherMiddleName} onChange={handleChange} required className="p-2 border border-gray-300 rounded-md" placeholder="BAGTAS" />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 text-gray-700 font-semibold">Last Name *</label>
          <input type="text" name="motherLastName" value={formData.motherLastName} onChange={handleChange} required className="p-2 border border-gray-300 rounded-md" placeholder="SANTOS" />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 text-gray-700 font-semibold">Mother's Date of Birth (mm/dd/yyyy) *</label>
          <input type="date" name="motherDOB" value={formData.motherDOB} onChange={handleChange} required className="p-2 border border-gray-300 rounded-md" />
        </div>
      </div>

      <div className="bg-blue-500 text-white p-4 rounded-md mb-4">
        <h2 className="text-xl font-bold">Father's Name</h2>
      </div>
      <div className="flex flex-col space-y-4 mb-4">
        <div className="flex flex-col">
          <label className="mb-1 text-gray-700 font-semibold">First Name *</label>
          <input type="text" name="fatherFirstName" value={formData.fatherFirstName} onChange={handleChange} required className="p-2 border border-gray-300 rounded-md" placeholder="EDGARDO" />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 text-gray-700 font-semibold">Middle Name *</label>
          <input type="text" name="fatherMiddleName" value={formData.fatherMiddleName} onChange={handleChange} required className="p-2 border border-gray-300 rounded-md" placeholder="GUZMAN" />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 text-gray-700 font-semibold">Last Name *</label>
          <input type="text" name="fatherLastName" value={formData.fatherLastName} onChange={handleChange} required className="p-2 border border-gray-300 rounded-md" placeholder="DELA CRUZ" />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 text-gray-700 font-semibold">Father's Date of Birth (mm/dd/yyyy) *</label>
          <input type="date" name="fatherDOB" value={formData.fatherDOB} onChange={handleChange} required className="p-2 border border-gray-300 rounded-md" />
        </div>
      </div>

      <button type="submit" className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600">Submit</button>
    </form>
  );
}