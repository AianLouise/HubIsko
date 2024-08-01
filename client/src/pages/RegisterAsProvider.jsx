import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowRightLong } from "react-icons/fa6";
import { Link } from 'react-router-dom';

export default function RegisterAsProvider() {
  const [formData, setFormData] = useState({
    organizationName: '',
    email: '',
    contactPerson: '',
    username: '',
    password: '',
  });

  const [showModal, setShowModal] = useState(false);
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    let intervalId;
    if (showModal && countdown > 0) {
      intervalId = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      window.location.href = '/';
    }
    return () => clearInterval(intervalId);
  }, [showModal, countdown]);

  const navigate = useNavigate();
  const handleHome = () => {
    navigate('/');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const [isConfirmationVisible, setIsConfirmationVisible] = useState(true);
  const handleSubmit = (e) => {
    e.preventDefault();
    // Add form submission logic here
    // Ensure email uniqueness and password strength requirements
    console.log(formData);
    setIsConfirmationVisible(false);
    setShowModal(true);
    setTimeout(() => {
      navigate('/')
    }, 10000);
  };


  const [activeButtonId, setActiveButtonId] = useState(1);
  const maxButtonId = 5;

  const handleButtonClick = (buttonId) => {
    setActiveButtonId(buttonId);
  };

  const handleNext = () => {
    setActiveButtonId((prevId) => prevId < maxButtonId ? prevId + 1 : prevId);
  };

  const handlePrevious = () => {
    setActiveButtonId((prevId) => Math.max(1, prevId - 1));
  };

  const getButtonClass = (buttonId) => {
    if (buttonId === activeButtonId) {
      return 'bg-blue-600 w-12 h-12 shadow rounded-md';
    } else {
      return 'w-12 h-12 shadow border rounded-md';
    }
  };

  const getHideorActive = (buttonId) => {
    if (buttonId === activeButtonId) {
      return 'bg-white p-8 shadow rounded-md border';
    } else {
      return 'hidden';
    }
  };

  const handleHideButton = (buttonId) => {
    if (buttonId === activeButtonId) {
      return 'hidden';
    } else {
      return 'mt-4 bg-white hover:bg-slate-200 border shadow font-bold py-2 px-12 rounded';
    }
  };


  const getConfirmation = (buttonId) => {
    if (buttonId === activeButtonId) {
      return 'fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto bg-gray-900 bg-opacity-50';
    } else {
      return 'hidden bg-white p-8 shadow rounded-md border';
    }
  };

  const getPrevorHome = (buttonId) => {
    if (buttonId === activeButtonId) {
      return "mt-4 bg-white hover:bg-slate-200 border shadow font-bold py-2 px-12 rounded";
    } else {
      return 'hidden mt-4 bg-white hover:bg-slate-200 border shadow font-bold py-2 px-12 rounded';
    }
  };



  return (
    <main className='bg-[#f8f8fb] font-medium flex flex-col items-center min-h-screen'>

      <span className='mt-28 text-2xl text-slate-500'>Let's get your organization setup!</span>
      <span className='text-sm mt-2 text-slate-500'>We'll guide you step by step!</span>
      <div className='flex justify-center items-center gap-4 mt-4 mb-8'>
        <div className='flex flex-col gap-1 items-center text-center'>
          <span className='text-xl font-bold text-blue-600'>1</span>

          <button className={getButtonClass(1)} onClick={() => handleButtonClick(1)}></button>
          <span className='text-sm text-slate-600'>Organization <br /> Information</span>
        </div>

        <FaArrowRightLong className='text-4xl text-blue-600' />

        <div className='flex flex-col gap-1 items-center text-center'>
          <span className='text-xl font-bold text-blue-600'>2</span>

          <button className={getButtonClass(2)} onClick={() => handleButtonClick(2)}></button>
          <span className='text-sm text-slate-600'>Personal <br /> Information</span>
        </div>

        <FaArrowRightLong className='text-4xl text-blue-600' />


        <div className='flex flex-col gap-1 items-center text-center'>
          <span className='text-xl font-bold text-blue-600'>3</span>

          <button className={getButtonClass(3)} onClick={() => handleButtonClick(3)}></button>
          <span className='text-sm text-slate-600'>Documents <br /> Information</span>
        </div>

        <FaArrowRightLong className='text-4xl text-blue-600' />


        <div className='flex flex-col gap-1 items-center text-center'>
          <span className='text-xl font-bold text-blue-600'>4</span>

          <button className={getButtonClass(4)} onClick={() => handleButtonClick(4)}></button>
          <span className='text-sm text-slate-600'>Terms and <br /> Conditions</span>
        </div>

      </div>

      <div className='max-w-10xl mx-auto px-24'>

        <div className={getHideorActive(1)}>
          <h2 className="text-2xl font-bold mb-6">Enter Organization Information</h2>
          <form onSubmit={handleSubmit} className='grid grid-cols-2 gap-4'>
            {/* Organization Name */}
            <div className="mb-4">
              <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700">Organization Name</label>
              <input type="text" name="organizationName" id="organizationName" value={formData.organizationName} onChange={handleChange} className="mt-1 p-2 w-full border rounded-md" placeholder="Full legal name of the organization" />
            </div>

            {/* Organization Type */}
            <div className="mb-4">
              <label htmlFor="organizationType" className="block text-sm font-medium text-gray-700">Organization Type</label>
              <input type="text" name="organizationType" id="organizationType" value={formData.organizationType} onChange={handleChange} className="mt-1 p-2 w-full border rounded-md" placeholder="Type of organization (e.g., Non-profit, Educational Institution, Corporate, Government)" />
            </div>

            {/* Registration Number */}
            <div className="mb-4">
              <label htmlFor="registrationNumber" className="block text-sm font-medium text-gray-700">Registration Number</label>
              <input type="text" name="registrationNumber" id="registrationNumber" value={formData.registrationNumber} onChange={handleChange} className="mt-1 p-2 w-full border rounded-md" placeholder="Official registration or incorporation number" />
            </div>

            {/* Email Address */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
              <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className="mt-1 p-2 w-full border rounded-md" placeholder="Official email address for communication" />
            </div>

            {/* Contact Person Details */}
            <div className="mb-4 col-span-2">
              <label className="block text-sm font-medium text-gray-700">Contact Person Details</label>
              <div className="grid grid-cols-2 gap-4">
                {/* Name */}
                <div className="mb-4">
                  <label htmlFor="contactPersonName" className="block text-sm font-medium text-gray-700">Name</label>
                  <input type="text" name="contactPersonName" id="contactPersonName" value={formData.contactPersonName} onChange={handleChange} className="mt-1 p-2 w-full border rounded-md" placeholder="Full name of the individual responsible for the registration" />
                </div>
                {/* Position */}
                <div className="mb-4">
                  <label htmlFor="contactPersonPosition" className="block text-sm font-medium text-gray-700">Position</label>
                  <input type="text" name="contactPersonPosition" id="contactPersonPosition" value={formData.contactPersonPosition} onChange={handleChange} className="mt-1 p-2 w-full border rounded-md" placeholder="Job title or position within the organization" />
                </div>
                {/* Contact Number */}
                <div className="mb-4">
                  <label htmlFor="contactPersonNumber" className="block text-sm font-medium text-gray-700">Contact Number</label>
                  <input type="text" name="contactPersonNumber" id="contactPersonNumber" value={formData.contactPersonNumber} onChange={handleChange} className="mt-1 p-2 w-full border rounded-md" placeholder="Direct contact number for the contact person" />
                </div>
              </div>
            </div>

            {/* Physical Address */}
            <div className="mb-4 col-span-2">
              <label className="block text-sm font-medium text-gray-700">Physical Address</label>
              <div className="grid grid-cols-2 gap-4">
                {/* Street Address */}
                <div className="mb-4">
                  <label htmlFor="streetAddress" className="block text-sm font-medium text-gray-700">Street Address</label>
                  <input type="text" name="streetAddress" id="streetAddress" value={formData.streetAddress} onChange={handleChange} className="mt-1 p-2 w-full border rounded-md" placeholder="Full street address of the organization" />
                </div>
                {/* City */}
                <div className="mb-4">
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                  <input type="text" name="city" id="city" value={formData.city} onChange={handleChange} className="mt-1 p-2 w-full border rounded-md" placeholder="City where the organization is located" />
                </div>
                {/* State/Province */}
                <div className="mb-4">
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700">State/Province</label>
                  <input type="text" name="state" id="state" value={formData.state} onChange={handleChange} className="mt-1 p-2 w-full border rounded-md" placeholder="State or province" />
                </div>
                {/* Postal Code */}
                <div className="mb-4">
                  <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">Postal Code</label>
                  <input type="text" name="postalCode" id="postalCode" value={formData.postalCode} onChange={handleChange} className="mt-1 p-2 w-full border rounded-md" placeholder="Postal or ZIP code" />
                </div>
                {/* Country */}
                <div className="mb-4">
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
                  <input type="text" name="country" id="country" value={formData.country} onChange={handleChange} className="mt-1 p-2 w-full border rounded-md" placeholder="Country of the organization" />
                </div>
              </div>
            </div>

            {/* Website */}
            <div className="mb-4 col-span-2">
              <label htmlFor="website" className="block text-sm font-medium text-gray-700">Website</label>
              <input type="text" name="website" id="website" value={formData.website} onChange={handleChange} className="mt-1 p-2 w-full border rounded-md" placeholder="Organization's official website (optional)" />
            </div>
          </form>
        </div>

        <div className={getHideorActive(2)}>
          <h2 className="text-2xl font-bold mb-6">Account Details</h2>
          <form onSubmit={handleSubmit} className='grid grid-cols-2 gap-4'>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
              <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className="mt-1 p-2 w-full border rounded-md" />
            </div>
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">Choose a Username</label>
              <input type="text" name="username" id="username" value={formData.username} onChange={handleChange} className="mt-1 p-2 w-full border rounded-md" />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Choose a Password</label>
              <input type="password" name="password" id="password" value={formData.password} onChange={handleChange} className="mt-1 p-2 w-full border rounded-md" />
            </div>
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input type="password" name="confirmPassword" id="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="mt-1 p-2 w-full border rounded-md" />
            </div>
          </form>
        </div>

        <div className={`w-full ${getHideorActive(3)}`}>
          <h2 className="text-2xl font-bold mb-6">Upload Required Documents</h2>
          <p className="mb-4">Upload necessary documents for verification.</p>

          <div className="mb-4">
            <label htmlFor="registrationCertificate" className="block text-sm font-medium text-gray-700">Registration Certificate</label>
            <input type="file" name="registrationCertificate" id="registrationCertificate" className="mt-1 p-2 w-full border rounded-md" />
          </div>

          <div className="mb-4">
            <label htmlFor="tin" className="block text-sm font-medium text-gray-700">Tax Identification Number (TIN)</label>
            <input type="file" name="tin" id="tin" className="mt-1 p-2 w-full border rounded-md" />
          </div>

          <div className="mb-4">
            <label htmlFor="proofOfAddress" className="block text-sm font-medium text-gray-700">Proof of Address</label>
            <input type="file" name="proofOfAddress" id="proofOfAddress" className="mt-1 p-2 w-full border rounded-md" />
          </div>

          <div className="mb-4">
            <label htmlFor="authorizationLetter" className="block text-sm font-medium text-gray-700">Authorization Letter</label>
            <input type="file" name="authorizationLetter" id="authorizationLetter" className="mt-1 p-2 w-full border rounded-md" />
          </div>

          <div className="mb-4">
            <label htmlFor="idProofContactPerson" className="block text-sm font-medium text-gray-700">ID Proof of Contact Person</label>
            <input type="file" name="idProofContactPerson" id="idProofContactPerson" className="mt-1 p-2 w-full border rounded-md" />
          </div>

          <div className="mb-4">
            <label htmlFor="additionalDocuments" className="block text-sm font-medium text-gray-700">Additional Documents</label>
            <input type="file" name="additionalDocuments" id="additionalDocuments" className="mt-1 p-2 w-full border rounded-md" />
          </div>
        </div>

        <div className={`w-full ${getHideorActive(4)}`}>
          <h2 className="text-2xl font-bold mb-6">Terms and Conditions</h2>
          <p className="mb-4">
            Please read the following terms and conditions carefully before proceeding with the registration:
          </p>
          <ul className="list-disc list-inside mb-4">
            <li>You agree to provide accurate and truthful information during the registration process.</li>
            <li>You agree to upload all necessary documents for verification purposes.</li>
            <li>You acknowledge that the provided information and documents will be used for verification and registration purposes only.</li>
            <li>You agree to comply with all applicable laws and regulations.</li>
            <li>You understand that failure to comply with these terms may result in the rejection of your registration.</li>
          </ul>
          <div className="mb-4">
            <input type="checkbox" name="agreeTerms" id="agreeTerms" className="mr-2" />
            <label htmlFor="agreeTerms" className="text-sm font-medium text-gray-700">I agree to the terms and conditions</label>
          </div>
        </div>

        <div className={isConfirmationVisible ? getConfirmation(5) : 'hidden'}>
          <div className='bg-white w-1/2 h-1/2 rounded-md p-4 font-medium'>
            <span className='text-xl'>Please confirm the details</span>

            <div className='grid grid-cols-2'>

            </div>

            <div className='flex justify-between mt-10'>
              <button onClick={handlePrevious} className='bg-white py-2 px-12 border rounded-md hover:bg-slate-200'>Go back</button>
              <button onClick={handleSubmit} className='bg-blue-600 text-white py-2 px-12 rounded-md hover:bg-blue-800'>Submit</button>
            </div>
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto bg-gray-900 bg-opacity-50">
            <div className="bg-white flex-col gap-2 flex text-left p-8 w-1/4 shadow rounded-md border">
              <h1 className='text-4xl font-bold text-blue-600'>Congratulations!</h1>
              <span className='text-xl'>your request has been sent for approval! <br /></span>
              <span className='mt-2 text-slate-500'>We'll be redirecting you to the home page in <span className='text-blue-600 font-bold'>{countdown}</span> seconds.</span>
            </div>
          </div>
        )}

        <div className='flex justify-between'>
          <button onClick={handleHome} className={getPrevorHome(1)}>Home</button>
          <button onClick={handlePrevious} className={handleHideButton(1)}>Previous</button>
          <button onClick={handleNext} className="mt-4 bg-blue-500 hover:bg-blue-700 shadow text-white font-bold py-2 px-12 rounded">Next</button>
        </div>
      </div>
    </main>
  );
}