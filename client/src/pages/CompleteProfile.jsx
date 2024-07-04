import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CompleteProfile() {
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    nameExtension: '',
    sex: 'MALE',
    dateOfBirth: '',
    mobileNumber: '',
    permanentAddress: '',
    barangay: '',
    municipality: '',
    province: '',
    motherFirstName: '',
    motherMiddleName: '',
    motherLastName: '',
    motherDOB: '',
    fatherFirstName: '',
    fatherMiddleName: '',
    fatherLastName: '',
    fatherDOB: ''
  });

  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/user/details')
      .then((response) => response.json())
      .then((data) => {
        setFormData((prevFormData) => ({
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
    setShowModal(true); // Show modal when form is submitted
    document.body.classList.add('modal-open'); // Add class to body to prevent scrolling
  };

  const handleConfirmSubmit = () => {
    fetch('/api/user/complete-profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Network response was not ok.');
      })
      .then((data) => {
        console.log('Success:', data);
        navigate('/complete-profile-confirmation');
      })
      .catch((error) => {
        console.error('Error:', error);
      })
      .finally(() => {
        setShowModal(false); // Close modal regardless of success or failure
        document.body.classList.remove('modal-open'); // Remove class to enable scrolling
      });
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 space-y-6 bg-white rounded-lg shadow-lg mt-10 mb-10">
        <div className="bg-blue-600 text-white p-4 rounded-md">
          <h2 className="text-2xl font-bold">Complete Your Profile</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="mb-2 text-gray-700 font-semibold">First Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2 text-gray-700 font-semibold">Middle Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="middleName"
              value={formData.middleName}
              onChange={handleChange}
              required
              className="p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="mb-2 text-gray-700 font-semibold">Last Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2 text-gray-700 font-semibold">Name Extension (if applicable)</label>
            <select
              name="nameExtension"
              value={formData.nameExtension}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded-md"
            >
              <option value="">None</option>
              <option value="Jr.">Jr. (Junior)</option>
              <option value="Sr.">Sr. (Senior)</option>
              <option value="III">III (The Third)</option>
              <option value="IV">IV (The Fourth)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="mb-2 text-gray-700 font-semibold">Sex <span className="text-red-500">*</span></label>
            <select
              name="sex"
              value={formData.sex}
              onChange={handleChange}
              required
              className="p-2 border border-gray-300 rounded-md"
            >
              <option value="FEMALE">Female</option>
              <option value="MALE">Male</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="mb-2 text-gray-700 font-semibold">Date of Birth <span className="text-red-500">*</span></label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
              className="p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="flex flex-col">
          <label className="mb-2 text-gray-700 font-semibold">Mobile Number <span className="text-red-500">*</span></label>
          <input
            type="tel"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleChange}
            required
            className="p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="bg-blue-600 text-white p-4 rounded-md mt-6">
          <h2 className="text-xl font-bold">Permanent Address</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="mb-2 text-gray-700 font-semibold">House/Bldg. No., Street <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="permanentAddress"
              value={formData.permanentAddress}
              onChange={handleChange}
              required
              className="p-2 border border-gray-300 rounded-md"
              placeholder="#123 CAPITOL STREET"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2 text-gray-700 font-semibold">Barangay <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="barangay"
              value={formData.barangay}
              onChange={handleChange}
              required
              className="p-2 border border-gray-300 rounded-md"
              placeholder="SAN JOSE"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="mb-2 text-gray-700 font-semibold">Municipality <span className="text-red-500">*</span></label>
            <select
              name="municipality"
              value={formData.municipality}
              onChange={handleChange}
              required
              className="p-2 border border-gray-300 rounded-md"
            >
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
            <label className="mb-2 text-gray-700 font-semibold">Province <span className="text-red-500">*</span></label>
            <select
              name="province"
              value={formData.province}
              onChange={handleChange}
              required
              className="p-2 border border-gray-300 rounded-md"
            >
              <option value="">Select a province</option>
              <option value="Pampanga">Pampanga</option>
            </select>
          </div>
        </div>

        <div className="bg-blue-600 text-white p-4 rounded-md mt-6">
          <h2 className="text-xl font-bold">Parent Details</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="mb-2 text-gray-700 font-semibold">Mother's Maiden First Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="motherFirstName"
              value={formData.motherFirstName}
              onChange={handleChange}
              required
              className="p-2 border border-gray-300 rounded-md"
              placeholder="JUANA"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2 text-gray-700 font-semibold">Mother's Maiden Middle Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="motherMiddleName"
              value={formData.motherMiddleName}
              onChange={handleChange}
              required
              className="p-2 border border-gray-300 rounded-md"
              placeholder="DELA CRUZ"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2 text-gray-700 font-semibold">Mother's Maiden Last Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="motherLastName"
              value={formData.motherLastName}
              onChange={handleChange}
              required
              className="p-2 border border-gray-300 rounded-md"
              placeholder="SANTOS"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2 text-gray-700 font-semibold">Mother's Date of Birth <span className="text-red-500">*</span></label>
            <input
              type="date"
              name="motherDOB"
              value={formData.motherDOB}
              onChange={handleChange}
              required
              className="p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="mb-2 text-gray-700 font-semibold">Father's First Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="fatherFirstName"
              value={formData.fatherFirstName}
              onChange={handleChange}
              required
              className="p-2 border border-gray-300 rounded-md"
              placeholder="JUAN"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2 text-gray-700 font-semibold">Father's Middle Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="fatherMiddleName"
              value={formData.fatherMiddleName}
              onChange={handleChange}
              required
              className="p-2 border border-gray-300 rounded-md"
              placeholder="DELA CRUZ"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2 text-gray-700 font-semibold">Father's Last Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="fatherLastName"
              value={formData.fatherLastName}
              onChange={handleChange}
              required
              className="p-2 border border-gray-300 rounded-md"
              placeholder="SANTOS"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2 text-gray-700 font-semibold">Father's Date of Birth <span className="text-red-500">*</span></label>
            <input
              type="date"
              name="fatherDOB"
              value={formData.fatherDOB}
              onChange={handleChange}
              required
              className="p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="flex flex-col space-y-4 mt-6">
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-200"
          >
            Submit
          </button>
        </div>
      </form>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto bg-gray-900 bg-opacity-50">
          <div className="relative w-full max-w-lg mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Confirm Submission</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-600 hover:text-gray-800 focus:outline-none"
                >
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="space-y-4">
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Name:</span> {formData.firstName} {formData.middleName} {formData.lastName} {formData.nameExtension}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Sex:</span> {formData.sex === 'MALE' ? 'Male' : 'Female'}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Date of Birth:</span> {formData.dateOfBirth}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Mobile Number:</span> {formData.mobileNumber}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Permanent Address:</span> {formData.permanentAddress}, {formData.barangay}, {formData.municipality}, {formData.province}
                  </p>
                  <div className="mt-4">
                    <p className="text-sm font-semibold">Mother's Details:</p>
                    <p className="text-sm text-gray-600 ml-2">
                      <span className="font-semibold">First Name:</span> {formData.motherFirstName}
                    </p>
                    <p className="text-sm text-gray-600 ml-2">
                      <span className="font-semibold">Middle Name:</span> {formData.motherMiddleName}
                    </p>
                    <p className="text-sm text-gray-600 ml-2">
                      <span className="font-semibold">Last Name:</span> {formData.motherLastName}
                    </p>
                    <p className="text-sm text-gray-600 ml-2">
                      <span className="font-semibold">Date of Birth:</span> {formData.motherDOB}
                    </p>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm font-semibold">Father's Details:</p>
                    <p className="text-sm text-gray-600 ml-2">
                      <span className="font-semibold">First Name:</span> {formData.fatherFirstName}
                    </p>
                    <p className="text-sm text-gray-600 ml-2">
                      <span className="font-semibold">Middle Name:</span> {formData.fatherMiddleName}
                    </p>
                    <p className="text-sm text-gray-600 ml-2">
                      <span className="font-semibold">Last Name:</span> {formData.fatherLastName}
                    </p>
                    <p className="text-sm text-gray-600 ml-2">
                      <span className="font-semibold">Date of Birth:</span> {formData.fatherDOB}
                    </p>
                  </div>
                </div>
                <div className="flex justify-end mt-6">
                  <button
                    onClick={() => {
                      handleConfirmSubmit();
                      setShowModal(false);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition duration-200 focus:outline-none"
                  >
                    Confirm Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* End Modal */}


    </div>
  );
}
