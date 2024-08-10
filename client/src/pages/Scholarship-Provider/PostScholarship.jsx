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
