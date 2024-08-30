import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ProviderHeaderSidebar from '../../components/ProviderHeaderAndSidebar';
import { FaHandHolding, FaRegCalendarXmark, FaArrowRightLong } from "react-icons/fa6";
import { MdOutlineRefresh } from "react-icons/md";
import { BsGlobe2 } from "react-icons/bs";
import { FaEnvelope, FaPhone, FaUser } from 'react-icons/fa';
import { BsEyeFill } from 'react-icons/bs';

import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function PostScholarship() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Firebase storage reference
  const storage = getStorage();

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    fieldOfStudy: '',
    numberOfScholarships: '',
    amount: '',
    applicationDeadline: '',
    minGPA: '',
    nationality: '',
    otherEligibility: '',
    startDate: '',
    endDate: '',
    selectionProcess: '',
    selectionCriteria: '',
    renewalPolicy: '',
    renewalDuration: '',
    disbursementSchedule: '',
    disbursementMethod: '',
    contactEmail: '',
    contactPhone: '',
    providerId: currentUser ? currentUser._id : '',
    organizationName: currentUser ? currentUser.scholarshipProviderDetails.organizationName : '',
    requiredDocuments: [],
    documentGuidelines: '',
    scholarshipImage: '',
    bannerImage: '',
    sections: [], // This will be updated automatically
    faqTitle: 'Frequently Asked Questions', // Add this field
    faqDescription: 'For more details, visit our website.', // Add this field
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const [errorMessage, setErrorMessage] = useState('');
  const [scholarshipImage, setScholarshipImage] = useState('https://via.placeholder.com/150');
  const fileInputRef = useRef(null);

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setScholarshipImage(reader.result);
        setErrorMessage(''); // Clear error message on successful image upload
      };
      reader.readAsDataURL(file);

      // Create a reference for the image in Firebase Storage
      const imageRef = ref(storage, `images/${file.name}`);
      try {
        // Upload the file
        await uploadBytes(imageRef, file);
        // Get the download URL
        const imageUrl = await getDownloadURL(imageRef);
        setScholarshipImage(imageUrl); // Use the URL from Firebase Storage

        // Update the form data
        setFormData((prevData) => ({
          ...prevData,
          scholarshipImage: imageUrl,
        }));
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const [bannerImage, setBannerImage] = useState('https://via.placeholder.com/600x200');
  const bannerFileInputRef = useRef(null);
  const [errorMessage2, setErrorMessage2] = useState('');

  const handleBannerImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerImage(reader.result);
        setErrorMessage2(''); // Clear error message on successful image upload
      };
      reader.readAsDataURL(file);

      // Create a reference for the banner image in Firebase Storage
      const bannerRef = ref(storage, `banners/${file.name}`);
      try {
        // Upload the file
        await uploadBytes(bannerRef, file);
        // Get the download URL
        const bannerUrl = await getDownloadURL(bannerRef);
        setBannerImage(bannerUrl); // Use the URL from Firebase Storage

        // Update the form data
        setFormData((prevData) => ({
          ...prevData,
          bannerImage: bannerUrl,
        }));
      } catch (error) {
        console.error("Error uploading banner image:", error);
      }
    }
  };

  const handleBannerImageClick = () => {
    bannerFileInputRef.current.click();
  };

  const handleNextPage = () => {
    const form = document.querySelector('form');
    if (form.reportValidity()) {
      setCurrentPage((prevPage) => prevPage + 1);
    }

    if (!validateDocuments()) {
      return; // Prevent moving to the next page if validation fails
    }

    // if (formData.scholarshipImage === '') {
    //   setImageError(true);
    //   return;
    // }
  };

  const handleNextPageImage = () => {
    const form = document.querySelector('form');

    if (formData.scholarshipImage === '') {
      setErrorMessage('Please upload an image.');
    } else if (formData.bannerImage === '') {
      setErrorMessage2('Please upload an image.');
    } else {
      if (form.reportValidity()) {
        setCurrentPage((prevPage) => prevPage + 1);
      }

      if (!validateDocuments()) {
        return; // Prevent moving to the next page if validation fails
      }
    }
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  console.log('Form data:', formData);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const providerRequirements = requirements
        .filter(req => req.url !== '')
        .map(req => ({ id: req.id, name: req.name, url: req.url }));

    const updatedFormData = {
      ...formData,
      scholarshipImage,
      bannerImage,
      providerRequirements,
    };

    try {
      const response = await fetch('/api/scholarshipProgram/create-scholarship', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFormData),
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


  const [sections, setSections] = useState([
    { id: 1, title: 'What is this scholarship for?', content: 'To support students in their academic journey.' },
    { id: 2, title: 'What are the benefits?', content: 'Tuition, Books, Living Expenses' },
    { id: 3, title: 'What are the qualifications?', content: 'High School Diploma' },
    { id: 4, title: 'How can I apply?', content: 'Submit your application online.' },
    { id: 5, title: 'What documents should I prepare?', content: 'Transcript of Records, Birth Certificate' },
  ]);

  // Sync sections with formData.sections
  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      sections: sections,
    }));
  }, [sections]);

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

  const handleFormDataChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const [documents, setDocuments] = useState([
    { id: 'transcript', name: 'Transcript of Records', required: false, editable: false },
    { id: 'recommendation', name: 'Recommendation Letters', required: false, editable: false },
    { id: 'essay', name: 'Personal Statement/Essay', required: false, editable: false },
    { id: 'enrollment', name: 'Proof of Enrollment', required: false, editable: false },
  ]);

  const [documentError, setDocumentError] = useState(false);

  const handleDocumentChange = (index, field, value) => {
    const updatedDocuments = [...documents];
    updatedDocuments[index] = { ...updatedDocuments[index], [field]: value };
    setDocuments(updatedDocuments);

    if (field === 'required') {
      const updatedRequiredDocuments = value
        ? [...formData.requiredDocuments, updatedDocuments[index]]
        : formData.requiredDocuments.filter(doc => doc.id !== updatedDocuments[index].id);
      setFormData({ ...formData, requiredDocuments: updatedRequiredDocuments });
    }
  };

  const handleAddDocument = () => {
    const newDocument = { id: Date.now(), name: '', required: false, editable: true };
    setDocuments([...documents, newDocument]);
  };

  const validateDocuments = () => {
    const isAnyDocumentSelected = documents.some(doc => doc.required);
    if (!isAnyDocumentSelected) {
      setDocumentError(true);
      return false;
    }
    setDocumentError(false);
    return true;
  };

  const [requirements, setRequirements] = useState([
    { id: 'accreditation', name: 'Accreditation Certificate', required: true, editable: false, url: '' },
    { id: 'funding', name: 'Proof of Funding', required: true, editable: false, url: '' },
    { id: 'programDescription', name: 'Program Description', required: true, editable: false, url: '' },
    { id: 'legalCompliance', name: 'Legal Compliance Documents', required: true, editable: false, url: '' },
    { id: 'taxClearance', name: 'Tax Clearance Certificate', required: true, editable: false, url: '' },
    { id: 'bankStatements', name: 'Recent Bank Statements', required: true, editable: false, url: '' },
    { id: 'partnershipAgreements', name: 'Partnership Agreements', required: false, editable: false, url: '' },
    { id: 'promotionalMaterial', name: 'Promotional Materials', required: false, editable: false, url: '' },
    { id: 'budgetProposal', name: 'Budget Proposal', required: true, editable: false, url: '' },
  ]);

  const handleFileChange = async (event, id) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const filePath = `requiredDocuments/${id}/${file.name}`;
        const fileRef = ref(storage, filePath);
        await uploadBytes(fileRef, file);
        const fileUrl = await getDownloadURL(fileRef);

        setRequirements((prevRequirements) =>
          prevRequirements.map((req) =>
            req.id === id
              ? { ...req, url: fileUrl }
              : req
          )
        );
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };



  return (
    <div className={`flex flex-col min-h-screen`}>
      <main className={`flex-grow bg-[#f8f8fb] transition-all duration-200 ease-in-out ${sidebarOpen ? 'ml-64' : ''}`}>
        <ProviderHeaderSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 mt-10">
          <div className="flex flex-col gap-2 border-b-4 pb-4">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-blue-600">
                {currentPage === 1 && 'Scholarship Information'}
                {currentPage === 2 && 'Documents Needed'}
                {currentPage === 3 && 'Customize Applicant View'}
                {currentPage === 4 && 'Upload Documents for Review'}
                {currentPage === 5 && 'Confirmation'}
                {/* Add more pages as needed */}
              </h1>
            </div>
            <p className="text-lg text-slate-500">
              {currentPage === 1 && 'Fill out the basic information below'}
              {currentPage === 2 && 'Specify the documents that applicants need to submit'}
              {currentPage === 3 && 'Customize the page that applicants will see'}
              {currentPage === 4 && 'Upload documents so that the HubIsko can review and decide if the provider can offer this scholarship program'}
              {currentPage === 5 && 'Confirm your submission and finish the process'}
              {/* Add more pages as needed */}
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            {currentPage === 1 && (
              <>
                <div className='bg-white p-8 py-12 flex flex-col rounded-md border shadow'>
                  <h2 className="text-2xl font-bold mb-4 border-b-2 pb-4">Scholarship Details</h2>
                  <div className='flex flex-col gap-4 px-4 space-y-1 mt-4'>
                    <div>
                      <label className="block text-gray-700">Title of Scholarship</label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Enter the title of the scholarship"
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700">Scholarship Category</label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                      >
                        <option value="">Select category</option>
                        <option value="Undergraduate">Undergraduate</option>
                        <option value="Graduate">Graduate</option>
                        <option value="PhD">PhD</option>
                        {/* Add more options as needed */}
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-700">Field of Study</label>
                      <select
                        name="fieldOfStudy"
                        value={formData.fieldOfStudy}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                      >
                        <option value="" disabled>Select the field of study</option>
                        <option value="Open for All Courses">Open for All Courses</option>
                        <option value="Bachelor of Science in Accounting">Bachelor of Science in Accounting</option>
                        <option value="Bachelor of Science in Aerospace Engineering">Bachelor of Science in Aerospace Engineering</option>
                        <option value="Bachelor of Science in Agribusiness Management">Bachelor of Science in Agribusiness Management</option>
                        <option value="Bachelor of Science in Agricultural Engineering">Bachelor of Science in Agricultural Engineering</option>
                        <option value="Bachelor of Science in Agriculture">Bachelor of Science in Agriculture</option>
                        <option value="Bachelor of Science in Animation">Bachelor of Science in Animation</option>
                        <option value="Bachelor of Science in Applied Physics">Bachelor of Science in Applied Physics</option>
                        <option value="Bachelor of Science in Architecture">Bachelor of Science in Architecture</option>
                        <option value="Bachelor of Science in Astronomy">Bachelor of Science in Astronomy</option>
                        <option value="Bachelor of Science in Automotive Engineering">Bachelor of Science in Automotive Engineering</option>
                        <option value="Bachelor of Science in Aviation">Bachelor of Science in Aviation</option>
                        <option value="Bachelor of Science in Behavioral Science">Bachelor of Science in Behavioral Science</option>
                        <option value="Bachelor of Science in Biochemistry">Bachelor of Science in Biochemistry</option>
                        <option value="Bachelor of Science in Biology">Bachelor of Science in Biology</option>
                        <option value="Bachelor of Science in Biomedical Engineering">Bachelor of Science in Biomedical Engineering</option>
                        <option value="Bachelor of Science in Biotechnology">Bachelor of Science in Biotechnology</option>
                        <option value="Bachelor of Science in Business Administration">Bachelor of Science in Business Administration</option>
                        <option value="Bachelor of Science in Chemical Engineering">Bachelor of Science in Chemical Engineering</option>
                        <option value="Bachelor of Science in Chemistry">Bachelor of Science in Chemistry</option>
                        <option value="Bachelor of Science in Civil Engineering">Bachelor of Science in Civil Engineering</option>
                        <option value="Bachelor of Science in Communications">Bachelor of Science in Communications</option>
                        <option value="Bachelor of Science in Community Development">Bachelor of Science in Community Development</option>
                        <option value="Bachelor of Science in Computer Engineering">Bachelor of Science in Computer Engineering</option>
                        <option value="Bachelor of Science in Computer Science">Bachelor of Science in Computer Science</option>
                        <option value="Bachelor of Science in Criminology">Bachelor of Science in Criminology</option>
                        <option value="Bachelor of Science in Dentistry">Bachelor of Science in Dentistry</option>
                        <option value="Bachelor of Science in Digital Marketing">Bachelor of Science in Digital Marketing</option>
                        <option value="Bachelor of Science in Economics">Bachelor of Science in Economics</option>
                        <option value="Bachelor of Science in Education">Bachelor of Science in Education</option>
                        <option value="Bachelor of Science in Electrical Engineering">Bachelor of Science in Electrical Engineering</option>
                        <option value="Bachelor of Science in Electronics Engineering">Bachelor of Science in Electronics Engineering</option>
                        <option value="Bachelor of Science in Emergency Management">Bachelor of Science in Emergency Management</option>
                        <option value="Bachelor of Science in Environmental Science">Bachelor of Science in Environmental Science</option>
                        <option value="Bachelor of Science in Fashion Design">Bachelor of Science in Fashion Design</option>
                        <option value="Bachelor of Science in Finance">Bachelor of Science in Finance</option>
                        <option value="Bachelor of Science in Fisheries">Bachelor of Science in Fisheries</option>
                        <option value="Bachelor of Science in Food Technology">Bachelor of Science in Food Technology</option>
                        <option value="Bachelor of Science in Forestry">Bachelor of Science in Forestry</option>
                        <option value="Bachelor of Science in Geodetic Engineering">Bachelor of Science in Geodetic Engineering</option>
                        <option value="Bachelor of Science in Geology">Bachelor of Science in Geology</option>
                        <option value="Bachelor of Science in Hotel and Restaurant Management">Bachelor of Science in Hotel and Restaurant Management</option>
                        <option value="Bachelor of Science in Information Systems">Bachelor of Science in Information Systems</option>
                        <option value="Bachelor of Science in Information Technology">Bachelor of Science in Information Technology</option>
                        <option value="Bachelor of Science in Interior Design">Bachelor of Science in Interior Design</option>
                        <option value="Bachelor of Science in International Relations">Bachelor of Science in International Relations</option>
                        <option value="Bachelor of Science in Journalism">Bachelor of Science in Journalism</option>
                        <option value="Bachelor of Science in Law">Bachelor of Science in Law</option>
                        <option value="Bachelor of Science in Library Science">Bachelor of Science in Library Science</option>
                        <option value="Bachelor of Science in Management">Bachelor of Science in Management</option>
                        <option value="Bachelor of Science in Marine Biology">Bachelor of Science in Marine Biology</option>
                        <option value="Bachelor of Science in Marine Engineering">Bachelor of Science in Marine Engineering</option>
                        <option value="Bachelor of Science in Marketing">Bachelor of Science in Marketing</option>
                        <option value="Bachelor of Science in Mass Communication">Bachelor of Science in Mass Communication</option>
                        <option value="Bachelor of Science in Mathematics">Bachelor of Science in Mathematics</option>
                        <option value="Bachelor of Science in Mechanical Engineering">Bachelor of Science in Mechanical Engineering</option>
                        <option value="Bachelor of Science in Medical Technology">Bachelor of Science in Medical Technology</option>
                        <option value="Bachelor of Science in Medicine">Bachelor of Science in Medicine</option>
                        <option value="Bachelor of Science in Metallurgical Engineering">Bachelor of Science in Metallurgical Engineering</option>
                        <option value="Bachelor of Science in Microbiology">Bachelor of Science in Microbiology</option>
                        <option value="Bachelor of Science in Midwifery">Bachelor of Science in Midwifery</option>
                        <option value="Bachelor of Science in Mining Engineering">Bachelor of Science in Mining Engineering</option>
                        <option value="Bachelor of Science in Music">Bachelor of Science in Music</option>
                        <option value="Bachelor of Science in Nursing">Bachelor of Science in Nursing</option>
                        <option value="Bachelor of Science in Nutrition and Dietetics">Bachelor of Science in Nutrition and Dietetics</option>
                        <option value="Bachelor of Science in Occupational Therapy">Bachelor of Science in Occupational Therapy</option>
                        <option value="Bachelor of Science in Oceanography">Bachelor of Science in Oceanography</option>
                        <option value="Bachelor of Science in Optometry">Bachelor of Science in Optometry</option>
                        <option value="Bachelor of Science in Pharmacy">Bachelor of Science in Pharmacy</option>
                        <option value="Bachelor of Science in Philosophy">Bachelor of Science in Philosophy</option>
                        <option value="Bachelor of Science in Physical Therapy">Bachelor of Science in Physical Therapy</option>
                        <option value="Bachelor of Science in Physics">Bachelor of Science in Physics</option>
                        <option value="Bachelor of Science in Political Science">Bachelor of Science in Political Science</option>
                        <option value="Bachelor of Science in Psychology">Bachelor of Science in Psychology</option>
                        <option value="Bachelor of Science in Public Administration">Bachelor of Science in Public Administration</option>
                        <option value="Bachelor of Science in Public Health">Bachelor of Science in Public Health</option>
                        <option value="Bachelor of Science in Real Estate Management">Bachelor of Science in Real Estate Management</option>
                        <option value="Bachelor of Science in Respiratory Therapy">Bachelor of Science in Respiratory Therapy</option>
                        <option value="Bachelor of Science in Social Work">Bachelor of Science in Social Work</option>
                        <option value="Bachelor of Science in Sociology">Bachelor of Science in Sociology</option>
                        <option value="Bachelor of Science in Software Engineering">Bachelor of Science in Software Engineering</option>
                        <option value="Bachelor of Science in Speech Pathology">Bachelor of Science in Speech Pathology</option>
                        <option value="Bachelor of Science in Sports Science">Bachelor of Science in Sports Science</option>
                        <option value="Bachelor of Science in Statistics">Bachelor of Science in Statistics</option>
                        <option value="Bachelor of Science in Tourism Management">Bachelor of Science in Tourism Management</option>
                        <option value="Bachelor of Science in Veterinary Medicine">Bachelor of Science in Veterinary Medicine</option>
                        <option value="Bachelor of Science in Zoology">Bachelor of Science in Zoology</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>


                    <div>
                      <label className="block text-gray-700">Number of Scholarships Available</label>
                      <input
                        type="number"
                        name="numberOfScholarships"
                        value={formData.numberOfScholarships}
                        onChange={handleChange}
                        placeholder="Enter the number of available slots"
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700">Scholarship Amount</label>
                      <input
                        type="text"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        placeholder="Enter the amount (in PHP or USD)"
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700">Application Deadline</label>
                      <input
                        type="date"
                        name="applicationDeadline"
                        value={formData.applicationDeadline}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                      />
                    </div>
                  </div>
                </div>


                <div className='bg-white p-8 py-12 flex flex-col rounded-md border shadow'>
                  <h2 className="text-2xl font-bold mb-4 border-b-2 pb-4"> Eligibility Criteria</h2>
                  <div className='flex flex-col gap-4 px-4 space-y-1 mt-4'>
                    <div>
                      <label className="block text-gray-700">Minimum GPA/Grade Requirement</label>
                      <input
                        type="text"
                        name="minGPA"
                        value={formData.minGPA}
                        onChange={handleChange}
                        placeholder="Enter the minimum GPA required"
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700">Nationality Requirements</label>
                      <select
                        name="nationality"
                        value={formData.nationality}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                      >
                        <option value="">Select nationality</option>
                        <option value="All nationalities">All nationalities</option>
                        {/* Add more options as needed */}
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-700">Other Eligibility Requirements</label>
                      <textarea
                        name="otherEligibility"
                        value={formData.otherEligibility}
                        onChange={handleChange}
                        placeholder="Specify any other eligibility criteria"
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className='bg-white p-8 py-12 flex flex-col rounded-md border shadow'>
                  <h2 className="text-2xl font-bold mb-4">Scholarship Duration</h2>
                  <div className='flex flex-col gap-4 px-4 space-y-1 mt-4'>

                    <div>
                      <label className="block text-gray-700">Start Date</label>
                      <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700">End Date</label>
                      <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className='bg-white p-8 py-12 flex flex-col rounded-md border shadow'>
                  <h2 className="text-2xl font-bold mb-4">Selection Criteria (Optional)</h2>
                  <div className='flex flex-col gap-4 px-4 space-y-1 mt-4'>

                    <div>
                      <label className="block text-gray-700">Selection Process</label>
                      <textarea
                        name="selectionProcess"
                        value={formData.selectionProcess}
                        onChange={handleChange}
                        placeholder="Describe the selection process"
                        className="w-full p-2 border border-gray-300 rounded"
                      ></textarea>
                    </div>

                    <div>
                      <label className="block text-gray-700">Selection Criteria</label>
                      <textarea
                        name="selectionCriteria"
                        value={formData.selectionCriteria}
                        onChange={handleChange}
                        placeholder="Detail the evaluation criteria"
                        className="w-full p-2 border border-gray-300 rounded"
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className='bg-white p-8 py-12 flex flex-col rounded-md border shadow'>
                  <h2 className="text-2xl font-bold mb-4">Renewal Policy (Optional)</h2>
                  <div className='flex flex-col gap-4 px-4 space-y-1 mt-4'>

                    <div>
                      <label className="block text-gray-700">Renewal Policy</label>
                      <textarea
                        name="renewalPolicy"
                        value={formData.renewalPolicy}
                        onChange={handleChange}
                        placeholder="Specify the renewal conditions"
                        className="w-full p-2 border border-gray-300 rounded"
                      ></textarea>
                    </div>

                    <div>
                      <label className="block text-gray-700">Renewal Duration</label>
                      <input
                        type="text"
                        name="renewalDuration"
                        value={formData.renewalDuration}
                        onChange={handleChange}
                        placeholder="Enter the renewal duration"
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    </div>
                  </div>
                </div>


                <div className='bg-white p-8 py-12 flex flex-col rounded-md border shadow'>
                  <h2 className="text-2xl font-bold mb-4">Disbursement Details (Optional)</h2>
                  <div className='flex flex-col gap-4 px-4 space-y-1 mt-4'>

                    <div>
                      <label className="block text-gray-700">Disbursement Schedule</label>
                      <textarea
                        name="disbursementSchedule"
                        value={formData.disbursementSchedule}
                        onChange={handleChange}
                        placeholder="Describe the disbursement schedule"
                        className="w-full p-2 border border-gray-300 rounded"
                      ></textarea>
                    </div>

                    <div>
                      <label className="block text-gray-700">Disbursement Method</label>
                      <select
                        name="disbursementMethod"
                        value={formData.disbursementMethod}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                      >
                        <option value="">Select method</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                        <option value="Check">Check</option>
                        <option value="Tuition Payment to Institution">Tuition Payment to Institution</option>
                      </select>
                    </div>
                  </div>
                </div>


                <div className='bg-white p-8 py-12 flex flex-col rounded-md border shadow'>
                  <h2 className="text-2xl font-bold mb-4">Contact Information (Optional)</h2>
                  <div className='flex flex-col gap-4 px-4 space-y-1 mt-4'>

                    <div>
                      <label className="block text-gray-700">Contact Email</label>
                      <input
                        type="email"
                        name="contactEmail"
                        value={formData.contactEmail}
                        onChange={handleChange}
                        placeholder="Enter a contact email address"
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700">Contact Phone Number</label>
                      <input
                        type="tel"
                        name="contactPhone"
                        value={formData.contactPhone}
                        onChange={handleChange}
                        placeholder="Enter a contact phone number"
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 justify-end font-medium items-center">
                  <button
                    type="button"
                    className="bg-blue-500 hover:bg-blue-800 text-white py-2 px-4 rounded-md w-32"
                    onClick={handleNextPage}
                  >
                    Next
                  </button>
                </div>
              </>
            )}


            {currentPage === 2 && (
              <>
                <div className="bg-white p-8 rounded-md shadow border flex flex-col gap-4">
                  <div className='flex justify-between items-center'>
                    <h2 className="text-2xl font-bold text-gray-800">Required Documents</h2>
                    {documentError && <p className="bg-red-600 text-white font-medium py-2 px-4 rounded-md mt-2">At least one document must be selected.</p>}
                  </div>

                  <p className="text-lg text-slate-600">Specify the documents that applicants need to submit.</p>

                  {documents.map((doc, index) => (
                    <div key={doc.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={doc.id}
                        name={doc.id}
                        checked={doc.required}
                        onChange={(e) => handleDocumentChange(index, 'required', e.target.checked)}
                        className="mr-2"
                      />
                      <input
                        type="text"
                        value={doc.name}
                        onChange={(e) => handleDocumentChange(index, 'name', e.target.value)}
                        placeholder="Document Name"
                        className="border border-gray-300 rounded-md p-2 flex-grow"
                        readOnly={!doc.editable}
                        required
                      />
                    </div>
                  ))}

                  <div className='flex w-full justify-center'>
                    <button
                      type="button"
                      onClick={handleAddDocument}
                      className="bg-blue-600 hover:bg-blue-800 text-white py-2 px-4 rounded-md mt-2 hover:w-full w-[300px] transition-all ease-in-out duration-500 font-medium"
                    >
                      Add Requirement
                    </button>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-md shadow border flex flex-col gap-4">
                  <h2 className="text-xl font-bold text-gray-800">Document Instructions</h2>
                  <textarea
                    id="documentGuidelines"
                    name="documentGuidelines"
                    className="border border-gray-300 rounded-md p-2"
                    placeholder="Provide any additional instructions or guidelines for document submission"
                    rows="4"
                    value={formData.documentGuidelines}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <div className="flex gap-4 justify-center items-center mt-4">
                  <button
                    type="button"
                    className="bg-gray-500 hover:bg-slate-700 text-white py-2 px-4 rounded-md w-32"
                    onClick={handlePreviousPage}
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-md w-32"
                    onClick={handleNextPage}
                  >
                    Next
                  </button>
                </div>
              </>
            )}

            {currentPage === 3 && (
              <>
                <main className='flex-grow bg-[#f8f8fb] font-medium'>
                  <div className='border-b mb-8 py-8'>
                    <div className='flex flex-row items-center mx-auto max-w-6xl gap-10 px-24'>
                      <div className='flex flex-col items-center'>
                        <span className='text-sm bg-blue-600 text-white px-6 rounded-md py-2'>Click to Upload an Image</span>
                        <div className='bg-blue-600 w-36 h-36 my-2 rounded-md flex justify-center items-center relative overflow-hidden'>
                          <img
                            src={scholarshipImage || 'placeholder-image-url'}
                            alt='Scholarship Logo'
                            className='w-full h-full border-blue-500 hover:border-blue-800 border-4 object-cover rounded-md'
                            onClick={handleImageClick}
                            style={{ cursor: 'pointer', opacity: scholarshipImage ? 1 : 0.3 }}
                          />

                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                          />

                        </div>
                        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
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

                    <div className='max-w-6xl px-24 mx-auto mb-20 mt-3'>
                      <div className='flex gap-2'>
                        <span className='flex gap-1 bg-white border px-4 py-2 rounded-md shadow'>
                          <MdOutlineRefresh className='w-6 h-6 text-blue-600' />
                          Last update: {new Date().toLocaleDateString('en-US')}
                        </span>
                        <span className='flex gap-2 bg-white border px-4 py-2 rounded-md shadow items-center'>
                          <FaRegCalendarXmark className='text-red-500' />
                          Deadline: {new Date(formData.endDate).toLocaleDateString('en-US')}
                        </span>
                      </div>

                      <div className='flex flex-col mt-8 border-b-2'>
                        <span className='text-sm bg-blue-600 text-white px-6 rounded-md py-2 w-[300px] text-center'>Click to Upload an Image</span>
                        <div className='flex justify-center items-center w-full h-52 rounded-md my-4 shadow border relative overflow-hidden'>
                          <img
                            src={bannerImage || 'placeholder-image-url'}
                            alt='Scholarship Banner'
                            className='w-full h-full border-blue-500 hover:border-blue-800 border-4 object-cover rounded-md'
                            onClick={handleBannerImageClick}
                            style={{ cursor: 'pointer', opacity: bannerImage ? 1 : 0.3 }}
                          />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleBannerImageChange}
                            ref={bannerFileInputRef}
                            style={{ display: 'none' }}
                          />
                        </div>
                        {errorMessage2 && <p className="text-red-500 text-center">{errorMessage2}</p>}
                      </div>

                      <div className='mt-12 flex flex-col justify-center items-center gap-2'>
                        <h2 className='font-bold text-xl text-slate-700'>Description or Frequently Asked Questions!</h2>
                        <span className='text-slate-500'>You can freely edit the title and description of the sections by just clicking!</span>
                      </div>

                      <div className='mb-20'>

                        {sections.map(section => (
                          <div key={section.id} className='flex flex-col gap-2 mt-8 border rounded-md bg-white'>
                            <div className='flex justify-between items-center bg-blue-600 p-4 rounded-t-md'>
                              <input
                                type='text'
                                value={section.title}
                                onChange={(e) => handleEdit(section.id, 'title', e.target.value)}
                                className='font-bold text-xl text-white bg-blue-600 focus:bg-white focus:text-blue-600 flex-grow'
                                required
                              />
                              <button onClick={() => handleDelete(section.id)} className='text-white bg-red-500 hover:bg-red-700 border-2 ml-4 px-6 py-2 rounded-md'>
                                Delete
                              </button>
                            </div>

                            <textarea
                              value={section.content}
                              onChange={(e) => handleEdit(section.id, 'content', e.target.value)}
                              className='text-sm p-4'
                              required
                            />
                          </div>
                        ))}

                        <div className='flex justify-center'>
                          <button type="button" onClick={handleAdd} className='mt-4 px-6 py-2 w-[200px] hover:w-full hover:bg-blue-800 transition-all ease-in-out duration-500  bg-blue-600 text-white rounded-md'>
                            Add Section
                          </button>
                        </div>
                      </div>

                      {/* FAQ Section */}
                      <div className="flex flex-col gap-2 mt-8 border rounded-md bg-white">
                        <input
                          type="text"
                          value={formData.faqTitle}
                          onChange={(e) => handleFormDataChange('faqTitle', e.target.value)}
                          className="font-bold text-xl text-white bg-blue-600 p-4 rounded-t-md"
                          required
                        />
                        <textarea
                          value={formData.faqDescription}
                          onChange={(e) => handleFormDataChange('faqDescription', e.target.value)}
                          className="text-sm p-4"
                          required
                        />

                        <div className='border mx-8'></div>
                        <div className='items-center justify-center flex -translate-y-5'>
                          <span className='bg-white px-8 text-slate-500'>Do you have more questions?</span>
                        </div>

                        {/* Contact Section */}
                        <div className='flex gap-6 justify-center mb-8'>
                          <button type='button' className='bg-white border flex flex-row p-4 gap-2 rounded-md hover:bg-slate-200 hover:-translate-y-2 transition ease-in-out'>
                            <div className='bg-blue-600 w-12 h-12 rounded-md flex items-center justify-center'>
                              <FaEnvelope className='text-white' />
                            </div>
                            <div className='flex flex-col justify-center'>
                              <span className='text-slate-600 text-left'>Email Us!</span>
                              <span className=''>{formData.contactEmail}</span>
                            </div>
                          </button>

                          <button type='button' className='bg-white border flex flex-row p-4 gap-2 rounded-md hover:bg-slate-200 hover:-translate-y-2 transition ease-in-out'>
                            <div className='bg-blue-600 w-12 h-12 rounded-md flex items-center justify-center'>
                              <FaPhone className='text-white' />
                            </div>
                            <div className='flex flex-col justify-center'>
                              <span className='text-slate-600 text-left'>Call us!</span>
                              <span className=''>{formData.contactPhone}</span>
                            </div>
                          </button>

                          <button
                            type="button"
                            className='bg-white border flex flex-row p-4 gap-2 rounded-md hover:bg-slate-200 hover:-translate-y-2 transition ease-in-out'
                          >
                            <div className='bg-blue-600 w-12 h-12 rounded-md flex items-center justify-center'>
                              <FaUser className='text-white' />
                            </div>
                            <div className='flex flex-col justify-center text-left'>
                              <span className='text-slate-600'>Visit our profile!</span>
                              <span className=''>{currentUser ? currentUser.scholarshipProviderDetails.organizationName : 'Scholarship Provider'}</span>
                            </div>
                          </button>
                        </div>
                      </div>

                      {/* Ready to Apply Section */}
                      {/* <div className='flex flex-col items-center justify-center border-t my-10'>
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
                      </div> */}
                    </div>
                  </div>
                </main>

                <div className="flex gap-4 justify-center items-center">
                  <button
                    type="button"
                    className="bg-gray-500 text-white py-2 px-4 rounded-md w-32"
                    onClick={handlePreviousPage}
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    className="bg-blue-500 text-white py-2 px-4 rounded-md w-32"
                    onClick={handleNextPageImage}
                  >
                    Next
                  </button>
                </div>
              </>
            )}

            {currentPage === 4 && (
              <>

                <div className="bg-white p-8 rounded-md shadow border">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Required Documents</h2>
                  <p className="text-lg text-gray-600 mb-4">Specify the documents that prove you can offer this scholarship program.</p>
                  <div className="space-y-4 px-4 py-8">
                    {requirements.map((req) => (
                      <div key={req.id} className="flex items-center justify-between gap-4 border-b border-gray-200 pb-4">
                        <label htmlFor={req.id} className="text-lg font-medium text-gray-700 w-1/2">
                          {req.name}
                        </label>
                        <input
                          type="file"
                          id={req.id}
                          name={req.id}
                          className="border border-gray-300 rounded-md p-2 text-sm w-1/2"
                          onChange={(e) => handleFileChange(e, req.id)}
                        />
                        {req.url && (
                          <a href={req.url} className="flex gap-2 justify-center items-center text-white bg-blue-600 px-6 py-2 rounded-md w-[300px] hover:bg-blue-800" target="_blank" rel="noopener noreferrer">
                            <BsEyeFill className="inline-block" />
                            View Uploaded File
                          </a>
                        )}
                      </div>
                    ))}

                    <button className='bg-blue-600 rounded-md px-6 py-2 font-medium text-white w-[220px] hover:bg-blue-800 hover:w-full hover:text-center transition-all ease-in-out duration-500'>
                      Add another document
                    </button>

                  </div>



                </div>

                <div className="flex gap-4 justify-center items-center mt-8">
                  <button
                    type="button"
                    className="bg-gray-500 text-white py-2 px-4 rounded-md w-32 hover:bg-gray-600 transition duration-200"
                    onClick={handlePreviousPage}
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    className="bg-blue-500 text-white py-2 px-4 rounded-md w-32 hover:bg-blue-600 transition duration-200"
                    onClick={handleNextPage}
                  >
                    Next
                  </button>
                </div>
              </>
            )}

            {currentPage === 5 && (
              <>
                <div className="flex flex-col gap-2 text-center">
                  <h2 className="text-2xl font-bold">Terms and Conditions</h2>
                  <span className='text-slate-500'>Please read the terms and conditions with utmost consideration.</span>
                </div>

                <div className="bg-white shadow-md p-6 rounded-lg mb-6 border border-gray-200">
                  <h3 className="text-xl font-semibold mb-4">Agreement for Scholarship Providers</h3>
                  <p className="text-gray-700 mb-4">
                    By creating a scholarship program on our platform, you agree to the following terms and conditions:
                  </p>
                  <ul className="list-disc list-inside text-gray-700">
                    <li>You confirm that all information provided about the scholarship program is accurate and truthful.</li>
                    <li>You agree to allocate the advertised funds exclusively for the scholarship recipients.</li>
                    <li>You commit to maintaining regular communication with applicants and scholars throughout the scholarship duration.</li>
                    <li>You understand that any changes to the scholarship program must be promptly updated on the platform.</li>
                    <li>Failure to comply with these terms may result in the suspension or termination of your scholarship program.</li>
                  </ul>
                </div>

                <div className="flex gap-4 justify-center items-center">
                  <button
                    type="button"
                    className="bg-gray-500 text-white py-2 px-4 rounded-md w-32 hover:bg-gray-700 transition duration-300"
                    onClick={handlePreviousPage}
                  >
                    Previous
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`bg-blue-600 text-white py-2 px-4 rounded-md w-32 hover:bg-blue-700 transition duration-300 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isLoading ? 'Submitting...' : 'Submit'}
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      </main>
    </div >
  );
}