import React, { useState } from 'react';
import ProviderHeaderSidebar from '../../components/ProviderHeaderAndSidebar';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function PostScholarship() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    applicationInstructions: '',
    totalSlots: '',
    duration: '',
    documents: '',
    category: '',
    type: '',
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
    providerId: currentUser._id,
    purpose: '',
    benefits: '',
    qualifications: '',
    eligibility: '',
    additionalInformation: '',
    highlight: '',
    targetAudience: '',
    url: ''
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
  
    if (!formData.title || !formData.description || !formData.totalSlots || !formData.applicationStartDate || !formData.applicationEndDate) {
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
        navigate('/scholarships'); // Redirect to /scholarships
      } else {
        const errorText = await response.text();
        console.error('Failed to post scholarship:', response.statusText, errorText);
      }
    } catch (error) {
      console.error('Error submitting scholarship:', error);
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
              <label htmlFor="title" className="text-lg font-medium text-gray-800">Scholarship Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded-md"
                placeholder="Enter scholarship title"
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
              <label htmlFor="applicationInstructions" className="text-lg font-medium text-gray-800">Application Instructions</label>
              <input
                type="text"
                id="applicationInstructions"
                name="applicationInstructions"
                value={formData.applicationInstructions}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded-md"
                placeholder="Enter application instructions"
                required
              />
            </div>

            <div className="flex flex-col gap-4">
              <label htmlFor="totalSlots" className="text-lg font-medium text-gray-800">Number of Scholarship Slots</label>
              <input
                type="number"
                id="totalSlots"
                name="totalSlots"
                value={formData.totalSlots}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded-md"
                placeholder="Enter number of scholarships"
                required
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
                required
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
                placeholder="Enter required documents (comma-separated)"
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
              <label htmlFor="type" className="text-lg font-medium text-gray-800">Type of Scholarship</label>
              <input
                type="text"
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded-md"
                placeholder="Enter type of scholarship"
                required
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
                required
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
                required
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
                required
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
                required
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
                required
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
                required
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

            {/* New Fields */}
          

            <div className="flex flex-col gap-4">
              <label htmlFor="purpose" className="text-lg font-medium text-gray-800">Purpose</label>
              <input
                type="text"
                id="purpose"
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded-md"
                placeholder="Enter purpose"
              />
            </div>

            <div className="flex flex-col gap-4">
              <label htmlFor="benefits" className="text-lg font-medium text-gray-800">Benefits</label>
              <input
                type="text"
                id="benefits"
                name="benefits"
                value={formData.benefits}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded-md"
                placeholder="Enter benefits"
              />
            </div>

            <div className="flex flex-col gap-4">
              <label htmlFor="qualifications" className="text-lg font-medium text-gray-800">Qualifications</label>
              <input
                type="text"
                id="qualifications"
                name="qualifications"
                value={formData.qualifications}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded-md"
                placeholder="Enter qualifications"
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
              <label htmlFor="additionalInformation" className="text-lg font-medium text-gray-800">Additional Information</label>
              <input
                type="text"
                id="additionalInformation"
                name="additionalInformation"
                value={formData.additionalInformation}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded-md"
                placeholder="Enter additional information"
              />
            </div>

            <div className="flex flex-col gap-4">
              <label htmlFor="highlight" className="text-lg font-medium text-gray-800">Highlight</label>
              <input
                type="text"
                id="highlight"
                name="highlight"
                value={formData.highlight}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded-md"
                placeholder="Enter highlight"
              />
            </div>

            <div className="flex flex-col gap-4">
              <label htmlFor="targetAudience" className="text-lg font-medium text-gray-800">Target Audience</label>
              <input
                type="text"
                id="targetAudience"
                name="targetAudience"
                value={formData.targetAudience}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded-md"
                placeholder="Enter target audience"
              />
            </div>

            <div className="flex flex-col gap-4">
              <label htmlFor="url" className="text-lg font-medium text-gray-800">URL</label>
              <input
                type="text"
                id="url"
                name="url"
                value={formData.url}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded-md"
                placeholder="Enter scholarship URL"
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
