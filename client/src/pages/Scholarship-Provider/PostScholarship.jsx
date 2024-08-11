import React, { useState, useRef } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ProviderHeaderSidebar from '../../components/ProviderHeaderAndSidebar';
import { FaHandHolding, FaRegCalendarXmark, FaArrowRightLong } from "react-icons/fa6";
import { MdOutlineRefresh } from "react-icons/md";
import { BsGlobe2 } from "react-icons/bs";

export default function PostScholarship() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [scholarshipImage, setScholarshipImage] = useState('https://via.placeholder.com/150');
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: '',
    totalSlots: '',
    duration: '',
    category: '',
    type: '',
    academicRequirements: [],
    fieldOfStudy: '',
    levelOfEducation: '',
    location: '',
    applicationStartDate: '',
    applicationEndDate: '',
    notificationDate: '',
    coverage: '',
    contactPerson: '',
    providerId: currentUser ? currentUser._id : '',
    scholarshipImage: '',
    scholarshipBanner: '',
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedBanner, setSelectedBanner] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle image selection for scholarship image
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setScholarshipImage(imageUrl);
      setSelectedImage(file); // Set the selected image file here
    }
  };


  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const [bannerImage, setBannerImage] = useState('https://via.placeholder.com/600x200');
  const bannerFileInputRef = useRef(null);

  // Handle image selection for scholarship banner
  const handleBannerImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setBannerImage(imageUrl);
      setSelectedBanner(file); // Set the selected banner file here
    }
  };

  const handleBannerImageClick = () => {
    bannerFileInputRef.current.click();
  };

  const handleNextPage = (event) => {
    event.preventDefault();
    setCurrentPage(2);
  };

  const handlePreviousPage = () => {
    setCurrentPage(1);
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const storage = getStorage();
    let scholarshipImageUrl = '';
    let scholarshipBannerUrl = '';

    // Upload scholarship image to Firebase Storage
    if (selectedImage) {
      const imageRef = ref(storage, `/scholarship-program-documents/scholarship_images/${formData.title}/${selectedImage.name}`);
      await uploadBytes(imageRef, selectedImage);
      scholarshipImageUrl = await getDownloadURL(imageRef);
    }

    // Upload scholarship banner to Firebase Storage
    if (selectedBanner) {
      const bannerRef = ref(storage, `/scholarship-program-documents/scholarship_banners/${formData.title}/${selectedBanner.name}`);
      await uploadBytes(bannerRef, selectedBanner);
      scholarshipBannerUrl = await getDownloadURL(bannerRef);
    }

    // Prepare data to be sent to the backend
    const postData = {
      ...formData,
      scholarshipImage: scholarshipImageUrl,
      scholarshipBanner: scholarshipBannerUrl,
      details: sections.map(section => ({
        title: section.title,
        content: section.content
      }))
    };

    try {
      // Send data to the backend
      const response = await fetch('/api/scholarshipProgram/create-scholarship', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Scholarship posted successfully:', result);
        navigate('/scholarships');
      } else {
        const errorText = await response.text();
        console.error('Failed to post scholarship:', response.statusText, errorText);
      }
    } catch (error) {
      console.error('Error submitting scholarship:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Information Section
  const [sections, setSections] = useState([
    { id: 1, title: 'What is this scholarship for?', content: 'To support students in their academic journey.' },
    { id: 2, title: 'What are the benefits?', content: 'Tuition, Books, Living Expenses' },
    { id: 3, title: 'What are the qualifications?', content: 'High School Diploma' },
    { id: 4, title: 'How can I apply?', content: 'Submit your application online.' },
    { id: 5, title: 'What documents should I prepare?', content: 'Transcript of Records, Birth Certificate' },
  ]);

  const handleEdit = (id, field, value) => {
    setSections(sections.map(section => section.id === id ? { ...section, [field]: value } : section));
  };

  const handleAdd = () => {
    const newSection = { id: Date.now(), title: 'New Section', content: 'New Content' };
    setSections([...sections, newSection]);
  };

  const handleDelete = (id) => {
    setSections(sections.filter(section => section.id !== id));
  };

  //Custom requirements
  const [customRequirement, setCustomRequirement] = useState("");

const handleCheckboxChange = (e) => {
  const { value, checked } = e.target;
  setFormData((prevFormData) => {
    if (checked) {
      return {
        ...prevFormData,
        academicRequirements: [...prevFormData.academicRequirements, value],
      };
    } else {
      return {
        ...prevFormData,
        academicRequirements: prevFormData.academicRequirements.filter(
          (requirement) => requirement !== value
        ),
      };
    }
  });
};

const handleCustomRequirementChange = (e) => {
  setCustomRequirement(e.target.value);
};

const addCustomRequirement = () => {
  if (customRequirement.trim() !== "") {
    setFormData((prevFormData) => ({
      ...prevFormData,
      academicRequirements: [...prevFormData.academicRequirements, customRequirement.trim()],
    }));
    setCustomRequirement("");
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
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-800">
                {currentPage === 1 ? 'Basic Information' : 'Additional Details'}
              </h1>
            </div>
            <p className="text-lg text-gray-600">
              {currentPage === 1 ? 'Fill out the basic information below' : 'Provide additional details'}
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {currentPage === 1 ? (
            <form onSubmit={handleNextPage} className="flex flex-col gap-4">
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

                <label htmlFor="amount" className="text-lg font-medium text-gray-800">Amount</label>
                <input
                  type="text"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded-md"
                  placeholder="Enter possible amount to be given"
                  required
                />
              </div>

              <div className="flex flex-col gap-4">
                <label htmlFor="totalSlots" className="text-lg font-medium text-gray-800">Total Slots</label>
                <input
                  type="number"
                  id="totalSlots"
                  name="totalSlots"
                  value={formData.totalSlots}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded-md"
                  placeholder="Enter total slots"
                  required
                />
              </div>

              <div className="flex flex-col gap-4">
                <label htmlFor="duration" className="text-lg font-medium text-gray-800">Duration</label>
                <select
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded-md"
                  required
                >
                  <option value="" disabled>Select duration</option>
                  <option value="1 semester">1 semester</option>
                  <option value="2 semesters">2 semesters</option>
                  <option value="1 year">1 year</option>
                  <option value="2 years">2 years</option>
                  <option value="3 years">3 years</option>
                  <option value="4 years">4 years</option>
                  <option value="Until graduation">Until graduation</option>
                </select>
              </div>

              <div className="flex flex-col gap-4">
                <label htmlFor="category" className="text-lg font-medium text-gray-800">Category</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded-md"
                  required
                >
                  <option value="" disabled>Select category</option>
                  <option value="Undergraduate">Undergraduate</option>
                  <option value="Postgraduate">Postgraduate</option>
                  <option value="PhD">PhD</option>
                  <option value="Research">Research</option>
                  <option value="Vocational">Vocational</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="flex flex-col gap-4">
                <label htmlFor="type" className="text-lg font-medium text-gray-800">Type</label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded-md"
                  required
                >
                  <option value="" disabled>Select type</option>
                  <option value="Full Scholarship">Full Scholarship</option>
                  <option value="Partial Scholarship">Partial Scholarship</option>
                  <option value="Merit-based">Merit-based</option>
                  <option value="Need-based">Need-based</option>
                  <option value="Athletic">Athletic</option>
                  <option value="Minority">Minority</option>
                  <option value="International">International</option>
                </select>
              </div>

              <div className="flex flex-col gap-4">
                <label htmlFor="academicRequirements" className="text-lg font-medium text-gray-800">Academic Requirements</label>

                <div className="flex flex-col gap-2">
                  <label>
                    <input
                      type="checkbox"
                      name="academicRequirements"
                      value="High School Diploma"
                      onChange={handleCheckboxChange}
                      checked={formData.academicRequirements.includes("High School Diploma")}
                    />
                    High School Diploma
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      name="academicRequirements"
                      value="Undergraduate Degree"
                      onChange={handleCheckboxChange}
                      checked={formData.academicRequirements.includes("Undergraduate Degree")}
                    />
                    Undergraduate Degree
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      name="academicRequirements"
                      value="Postgraduate Degree"
                      onChange={handleCheckboxChange}
                      checked={formData.academicRequirements.includes("Postgraduate Degree")}
                    />
                    Postgraduate Degree
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      name="academicRequirements"
                      value="PhD"
                      onChange={handleCheckboxChange}
                      checked={formData.academicRequirements.includes("PhD")}
                    />
                    PhD
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      name="academicRequirements"
                      value="Minimum GPA 3.0"
                      onChange={handleCheckboxChange}
                      checked={formData.academicRequirements.includes("Minimum GPA 3.0")}
                    />
                    Minimum GPA 3.0
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      name="academicRequirements"
                      value="Minimum GPA 3.5"
                      onChange={handleCheckboxChange}
                      checked={formData.academicRequirements.includes("Minimum GPA 3.5")}
                    />
                    Minimum GPA 3.5
                  </label>
                </div>

                <div className="flex flex-col gap-2 mt-4">
                  <label htmlFor="customAcademicRequirement" className="text-lg font-medium text-gray-800">Add Custom Requirement</label>
                  <input
                    type="text"
                    id="customAcademicRequirement"
                    name="customAcademicRequirement"
                    value={customRequirement}
                    onChange={handleCustomRequirementChange}
                    className="border border-gray-300 p-2 rounded-md"
                    placeholder="Enter custom requirement"
                  />
                  <button
                    type="button"
                    onClick={addCustomRequirement}
                    className="bg-blue-500 text-white p-2 rounded-md mt-2"
                  >
                    Add Requirement
                  </button>
                </div>
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
                  required
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
                  required
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
                  required
                />
              </div>

              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded-md"
              >
                Next
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <main className='flex-grow bg-[#f8f8fb] font-medium'>
                <div className='border-b mb-8 py-8'>
                  <div className='flex flex-row items-center mx-auto max-w-6xl gap-10 px-24'>
                    <div className='bg-blue-600 w-36 h-36 my-8 rounded-md'>
                      <img
                        src={scholarshipImage}
                        alt='DOST Scholarship'
                        className='w-full h-full object-cover rounded-md'
                        onClick={handleImageClick}
                        style={{ cursor: 'pointer' }}
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                      />
                    </div>
                    <div className='flex flex-col gap-2 w-1/2'>
                      <div className='flex flex-row divide-x-2 divide-blue-200 mb-2'>
                        <span className='text-2xl font-bold text-gray-600 pr-4'>
                          {currentUser ? currentUser.scholarshipProviderDetails.organizationName : 'Scholarship Provider'}
                        </span>
                        <span className='text-2xl font-medium text-gray-400 pl-4'>{new Date().toLocaleDateString('en-US')}</span>
                      </div>
                      <h1 className='text-4xl font-bold text-gray-800'>{formData.title}</h1>

                      <div className='flex text-blue-600 font-bold'>
                        <div className='flex flex-row gap-2 px-2 text-xl'>
                          <FaHandHolding className='' />
                          {formData.amount}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='max-w-6xl px-24 mx-auto mb-20'>
                    <div className='flex gap-2'>
                      <span className='flex gap-1 bg-white border px-4 py-2 rounded-md shadow'>
                        <MdOutlineRefresh className='w-6 h-6 text-blue-600' />
                        Last update: {new Date().toLocaleDateString('en-US')}
                      </span>
                      <span className='flex gap-2 bg-white border px-4 py-2 rounded-md shadow items-center'>
                        <FaRegCalendarXmark className='text-red-500' />
                        Deadline: {new Date(formData.applicationEndDate).toLocaleDateString('en-US')}
                      </span>
                    </div>
                    <div className='flex justify-center items-center w-full h-52 rounded-md my-4 shadow border'>
                      <img
                        src={bannerImage}
                        alt='Scholarship Banner'
                        className='w-full h-full object-cover rounded-md'
                        onClick={handleBannerImageClick}
                        style={{ cursor: 'pointer' }}
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleBannerImageChange}
                        ref={bannerFileInputRef}
                        style={{ display: 'none' }}
                      />
                    </div>

                    <div>
                      {sections.map(section => (
                        <div key={section.id} className='flex flex-col gap-2 mt-8 border rounded-md bg-white'>
                          <div className='flex justify-between items-center bg-blue-600 p-4 rounded-t-md'>
                            <input
                              type='text'
                              value={section.title}
                              onChange={(e) => handleEdit(section.id, 'title', e.target.value)}
                              className='font-bold text-xl text-white bg-blue-600 flex-grow'
                            />
                            <button onClick={() => handleDelete(section.id)} className='text-white bg-red-500 ml-4 p-2 rounded-md'>Delete</button>
                          </div>
                          <textarea
                            value={section.content}
                            onChange={(e) => handleEdit(section.id, 'content', e.target.value)}
                            className='text-sm p-4'
                          />
                        </div>
                      ))}
                      <button type="button" onClick={handleAdd} className='mt-4 p-2 bg-green-500 text-white rounded-md'>Add Section</button>
                    </div>

                    {/* FAQ Section */}
                    <div className='flex flex-col gap-2 mt-8 border rounded-md bg-white'>
                      <span className='font-bold text-xl text-white bg-blue-600 p-4 rounded-t-md'>Frequently Asked Questions</span>
                      <span className='text-sm p-4'>For more details, visit our website.</span>

                      <div className='border mx-8'></div>
                      <div className='items-center justify-center flex -translate-y-5'>
                        <span className='bg-white px-8 text-slate-500'>Do you have more questions?</span>
                      </div>

                      {/* Contact Section */}
                      <div className='flex gap-6 justify-center mb-8'>
                        <button className='bg-white border flex flex-row p-4 gap-2 rounded-md hover:bg-slate-200 hover:-translate-y-2 transition ease-in-out'>
                          <div className='bg-blue-600 w-12 h-12 rounded-md'></div>
                          <div className='flex flex-col justify-center'>
                            <span className='text-slate-600 text-left'>Email Us!</span>
                            <span className=''>contact@scholarship.org</span>
                          </div>
                        </button>

                        <button className='bg-white border flex flex-row p-4 gap-2 rounded-md hover:bg-slate-200 hover:-translate-y-2 transition ease-in-out'>
                          <div className='bg-blue-600 w-12 h-12 rounded-md'></div>
                          <div className='flex flex-col justify-center'>
                            <span className='text-slate-600 text-left'>Call us!</span>
                            <span className=''>123-456-7890</span>
                          </div>
                        </button>

                        <button className='bg-white border flex flex-row p-4 gap-2 rounded-md hover:bg-slate-200 hover:-translate-y-2 transition ease-in-out'>
                          <div className='bg-blue-600 w-12 h-12 rounded-md'></div>
                          <div className='flex flex-col justify-center text-left'>
                            <span className='text-slate-600 '>Visit our profile!</span>
                            <span className=''>Provider123</span>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Ready to Apply Section */}
                    <div className='flex flex-col items-center justify-center border-t my-10'>
                      <span className='font-bold text-slate-700 py-8 text-2xl'>Ready to Apply?</span>
                      <div className='flex gap-4 w-full'>
                        <button className='bg-white flex border justify-between items-center shadow rounded-md p-4 w-1/2 hover:shadow-xl hover:bg-slate-200 transition ease-in-out'>
                          <span>Apply Online</span>
                          <FaArrowRightLong />
                        </button>
                        <button className='bg-blue-600 text-white border justify-between flex items-center shadow rounded-md p-4 w-1/2 hover:shadow-xl hover:bg-blue-700 transition ease-in-out'>
                          <span>Visit Website</span>
                          <BsGlobe2 />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </main>
              {/* Add other fields as needed */}

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handlePreviousPage}
                  className="bg-gray-500 text-white py-2 px-4 rounded-md"
                >
                  Back
                </button>

                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded-md"
                  disabled={isLoading}
                >
                  {isLoading ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}