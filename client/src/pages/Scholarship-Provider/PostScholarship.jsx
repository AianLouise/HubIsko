import React, { useState } from 'react';
import ProviderHeaderSidebar from '../../components/ProviderHeaderAndSidebar';
import { useSelector } from 'react-redux';

export default function PostScholarship() {
  const { currentUser } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    amount: '',
    deadline: '',
    email: '',
    website: '',
    phone: '',
    address: '',
    eligibility: '',
    applicationProcess: '',
    numScholarships: '',
    duration: '',
    documents: '',
    category: '',
    typeOfScholarship: '',
    academicRequirements: '',
    fieldOfStudy: '',
    levelOfEducation: '',
    location: '',
    otherCriteria: '',
    applicationStartDate: '',
    applicationEndDate: '',
    notificationDate: '',
    coverage: '',
    contactPerson: '',
    provider: currentUser._id,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.name || !formData.description || !formData.amount || !formData.deadline || !formData.email) {
      console.error('Validation failed: Missing required fields');
      return;
    }

    try {
      const response = await fetch('/api/scholarshipProgram/create-scholarship', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Scholarship posted successfully:', result);
        // Handle successful submission (e.g., redirect, show message, etc.)
      } else {
        const errorText = await response.text();
        console.error('Failed to post scholarship:', response.statusText, errorText);
        // Handle error response (e.g., show error message)
      }
    } catch (error) {
      console.error('Error submitting scholarship:', error);
      // Handle request error (e.g., show error message)
    }
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className={`flex flex-col min-h-screen`}>
      <main className={`flex-grow bg-[#f8f8fb] transition-all duration-200 ease-in-out ${sidebarOpen ? 'ml-64' : ''}`}>
        <ProviderHeaderSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col gap-8">
            <div className="flex gap-4 items-center">
              <h1 className="text-3xl font-bold text-gray-800">Post a Scholarship</h1>
              <div className="bg-blue-600 w-36 h-36 rounded-md"></div>
            </div>
            <p className="text-lg text-gray-600">Fill out the form below to post a scholarship</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Basic Information */}
            <div className="flex flex-col gap-4">
              <label htmlFor="name" className="text-lg font-medium text-gray-800">Scholarship Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded-md"
                placeholder="Enter scholarship name"
                required
              />
            </div>

            <div className="flex flex-col gap-4">
              <label htmlFor="description" className="text-lg font-medium text-gray-800">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                cols="30"
                rows="5"
                className="border border-gray-300 p-2 rounded-md"
                placeholder="Enter scholarship description"
                required
              ></textarea>
            </div>

            <div className="flex flex-col gap-4">
              <label htmlFor="amount" className="text-lg font-medium text-gray-800">Amount</label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded-md"
                placeholder="Enter scholarship amount"
                required
              />
            </div>

            <div className="flex flex-col gap-4">
              <label htmlFor="deadline" className="text-lg font-medium text-gray-800">Deadline</label>
              <input
                type="date"
                id="deadline"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded-md"
                required
              />
            </div>

            <div className="flex flex-col gap-4">
              <label htmlFor="email" className="text-lg font-medium text-gray-800">Contact Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded-md"
                placeholder="Enter contact email"
                required
              />
            </div>

            {/* Additional Fields */}
            <div className="flex flex-col gap-4">
              <label htmlFor="website" className="text-lg font-medium text-gray-800">Website</label>
              <input
                type="text"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded-md"
                placeholder="Enter scholarship website"
              />
            </div>

            <div className="flex flex-col gap-4">
              <label htmlFor="phone" className="text-lg font-medium text-gray-800">Phone</label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded-md"
                placeholder="Enter contact phone number"
              />
            </div>

            <div className="flex flex-col gap-4">
              <label htmlFor="address" className="text-lg font-medium text-gray-800">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded-md"
                placeholder="Enter address"
              />
            </div>

            <div className="flex flex-col gap-4">
              <label htmlFor="eligibility" className="text-lg font-medium text-gray-800">Eligibility</label>
              <input
                type="text"
                id="eligibility"
                name="eligibility"
                value={formData.eligibility}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded-md"
                placeholder="Enter eligibility criteria"
              />
            </div>

            <div className="flex flex-col gap-4">
              <label htmlFor="applicationProcess" className="text-lg font-medium text-gray-800">Application Process</label>
              <input
                type="text"
                id="applicationProcess"
                name="applicationProcess"
                value={formData.applicationProcess}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded-md"
                placeholder="Enter application process"
              />
            </div>

            <div className="flex flex-col gap-4">
              <label htmlFor="numScholarships" className="text-lg font-medium text-gray-800">Number of Scholarships</label>
              <input
                type="number"
                id="numScholarships"
                name="numScholarships"
                value={formData.numScholarships}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded-md"
                placeholder="Enter number of scholarships"
              />
            </div>

            <div className="flex flex-col gap-4">
              <label htmlFor="duration" className="text-lg font-medium text-gray-800">Duration</label>
              <input
                type="text"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded-md"
                placeholder="Enter duration"
              />
            </div>

            <div className="flex flex-col gap-4">
              <label htmlFor="documents" className="text-lg font-medium text-gray-800">Required Documents</label>
              <input
                type="text"
                id="documents"
                name="documents"
                value={formData.documents}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded-md"
                placeholder="Enter required documents"
              />
            </div>

            <div className="flex flex-col gap-4">
              <label htmlFor="category" className="text-lg font-medium text-gray-800">Category</label>
              <input
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded-md"
                placeholder="Enter scholarship category"
                required
              />
            </div>

            <div className="flex flex-col gap-4">
              <label htmlFor="typeOfScholarship" className="text-lg font-medium text-gray-800">Type of Scholarship</label>
              <input
                type="text"
                id="typeOfScholarship"
                name="typeOfScholarship"
                value={formData.typeOfScholarship}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded-md"
                placeholder="Enter type of scholarship"
              />
            </div>

            <div className="flex flex-col gap-4">
              <label htmlFor="academicRequirements" className="text-lg font-medium text-gray-800">Academic Requirements</label>
              <input
                type="text"
                id="academicRequirements"
                name="academicRequirements"
                value={formData.academicRequirements}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded-md"
                placeholder="Enter academic requirements"
              />
            </div>

            <div className="flex flex-col gap-4">
              <label htmlFor="fieldOfStudy" className="text-lg font-medium text-gray-800">Field of Study</label>
              <input
                type="text"
                id="fieldOfStudy"
                name="fieldOfStudy"
                value={formData.fieldOfStudy}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded-md"
                placeholder="Enter field of study"
              />
            </div>

            <div className="flex flex-col gap-4">
              <label htmlFor="levelOfEducation" className="text-lg font-medium text-gray-800">Level of Education</label>
              <input
                type="text"
                id="levelOfEducation"
                name="levelOfEducation"
                value={formData.levelOfEducation}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded-md"
                placeholder="Enter level of education"
              />
            </div>

            <div className="flex flex-col gap-4">
              <label htmlFor="location" className="text-lg font-medium text-gray-800">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded-md"
                placeholder="Enter location"
              />
            </div>

            <div className="flex flex-col gap-4">
              <label htmlFor="otherCriteria" className="text-lg font-medium text-gray-800">Other Criteria</label>
              <input
                type="text"
                id="otherCriteria"
                name="otherCriteria"
                value={formData.otherCriteria}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded-md"
                placeholder="Enter other criteria"
              />
            </div>

            <div className="flex flex-col gap-4">
              <label htmlFor="applicationStartDate" className="text-lg font-medium text-gray-800">Application Start Date</label>
              <input
                type="date"
                id="applicationStartDate"
                name="applicationStartDate"
                value={formData.applicationStartDate}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded-md"
              />
            </div>

            <div className="flex flex-col gap-4">
              <label htmlFor="applicationEndDate" className="text-lg font-medium text-gray-800">Application End Date</label>
              <input
                type="date"
                id="applicationEndDate"
                name="applicationEndDate"
                value={formData.applicationEndDate}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded-md"
              />
            </div>

            <div className="flex flex-col gap-4">
              <label htmlFor="notificationDate" className="text-lg font-medium text-gray-800">Notification Date</label>
              <input
                type="date"
                id="notificationDate"
                name="notificationDate"
                value={formData.notificationDate}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded-md"
              />
            </div>

            <div className="flex flex-col gap-4">
              <label htmlFor="coverage" className="text-lg font-medium text-gray-800">Coverage</label>
              <input
                type="text"
                id="coverage"
                name="coverage"
                value={formData.coverage}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded-md"
                placeholder="Enter coverage"
              />
            </div>

            <div className="flex flex-col gap-4">
              <label htmlFor="contactPerson" className="text-lg font-medium text-gray-800">Contact Person</label>
              <input
                type="text"
                id="contactPerson"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded-md"
                placeholder="Enter contact person"
              />
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded-md"
            >
              Submit
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
