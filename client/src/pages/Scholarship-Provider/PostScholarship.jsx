import React, { useState, useRef } from 'react';
import ProviderHeaderSidebar from '../../components/ProviderHeaderAndSidebar';

export default function PostScholarship() {
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    amount: '',
    requirements: '',
    deadline: '',
    website: '',
    email: '',
    phone: '',
    address: '',
    eligibility: '',
    applicationProcess: '',
    numScholarships: '',
    duration: '',
    category: 'academic', // default category
    provider: '', // this will be set to currentUser._id in useEffect
  });
  const dropdownRef = useRef(null);

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
    setFormData({
      ...formData,
      documents: [...e.target.files]
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const amountValue = parseFloat(formData.amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      console.error('Amount must be a positive number.');
      return;
    }
  
    const updatedFormData = {
      ...formData,
      amount: amountValue,
    };
  
    console.log('Form Data:', updatedFormData); // Log form data
    try {
      const response = await fetch('http://localhost:3000/api/scholarshipProgram/create-scholarship', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFormData),
      });
      const responseData = await response.json();
      if (!response.ok) {
        console.error('Server Response:', responseData);
        throw new Error('Failed to create scholarship program');
      }
      console.log('Scholarship program created successfully:', responseData);
      navigate('/scholarships'); // Navigate to the scholarships page
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
 
  return (
    <div className={`flex flex-col min-h-screen`}>

      <main className={`flex-grow bg-[#f8f8fb] transition-all duration-200 ease-in-out ${sidebarOpen ? 'ml-64' : ''} `}>
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
              <label htmlFor="description" className="text-lg font-medium text-gray-800">Scholarship Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                cols="30"
                rows="10"
                className="border border-gray-300 p-2 rounded-md"
                placeholder="Enter scholarship description"
                required
              ></textarea>
            </div>

            <div className="flex flex-col gap-4">
              <label htmlFor="amount" className="text-lg font-medium text-gray-800">Scholarship Amount</label>
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
              <label htmlFor="requirements" className="text-lg font-medium text-gray-800">Scholarship Requirements</label>
              <textarea
                id="requirements"
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                cols="30"
                rows="10"
                className="border border-gray-300 p-2 rounded-md"
                placeholder="Enter scholarship requirements"
                required
              ></textarea>
            </div>

            <div className="flex flex-col gap-4">
              <label htmlFor="deadline" className="text-lg font-medium text-gray-800">Scholarship Deadline</label>
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
              <label htmlFor="website" className="text-lg font-medium text-gray-800">Scholarship Website</label>
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
              <label htmlFor="email" className="text-lg font-medium text-gray-800">Scholarship Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded-md"
                placeholder="Enter scholarship email"
                required
              />
            </div>

            <div className="flex flex-col gap-4">
              <label htmlFor="phone" className="text-lg font-medium text-gray-800">Scholarship Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded-md"
                placeholder="Enter scholarship phone"
              />
            </div>

            <div className="flex flex-col gap-4">
              <label htmlFor="address" className="text-lg font-medium text-gray-800">Scholarship Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded-md"
                placeholder="Enter scholarship address"
              />
            </div>

            <div className="flex flex-col gap-4">
              <label htmlFor="eligibility" className="text-lg font-medium text-gray-800">Eligibility Criteria</label>
              <textarea
                id="eligibility"
                name="eligibility"
                value={formData.eligibility}
                onChange={handleChange}
                cols="30"
                rows="10"
                className="border border-gray-300 p-2 rounded-md"
                placeholder="Enter eligibility criteria"
                required
              ></textarea>
            </div>

            <div className="flex flex-col gap-4">
              <label htmlFor="applicationProcess" className="text-lg font-medium text-gray-800">Application Process</label>
              <textarea
                id="applicationProcess"
                name="applicationProcess"
                value={formData.applicationProcess}
                onChange={handleChange}
                cols="30"
                rows="10"
                className="border border-gray-300 p-2 rounded-md"
                placeholder="Enter application process"
                required
              ></textarea>
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
                required
              />
            </div>

            <div className="flex flex-col gap-4">
              <label htmlFor="duration" className="text-lg font-medium text-gray-800">Scholarship Duration</label>
              <input
                type="text"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded-md"
                placeholder="Enter scholarship duration"
                required
              />
            </div>

            <div className="flex flex-col gap-4">
              <label htmlFor="category" className="text-lg font-medium text-gray-800">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded-md"
              >
                <option value="academic">Academic</option>
                <option value="athletic">Athletic</option>
                <option value="arts">Arts</option>
                <option value="community">Community Service</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="flex flex-col gap-4">
              <button type="submit" className="bg-blue-600 text-white p-2 rounded-md">Post Scholarship</button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
