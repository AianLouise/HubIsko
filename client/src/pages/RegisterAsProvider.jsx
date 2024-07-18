import React, { useState } from 'react';
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add form submission logic here
    // Ensure email uniqueness and password strength requirements
    console.log(formData);
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
      }else {
          return 'hidden bg-white p-8 shadow rounded-md border';
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
    return "Home";
    } else {
        return 'Previous';
      }
    }

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
                            <span  className='text-sm text-slate-600'>Personal <br /> Information</span>
                        </div>

                        <FaArrowRightLong className='text-4xl text-blue-600' />

                        
                        <div className='flex flex-col gap-1 items-center text-center'>
                            <span className='text-xl font-bold text-blue-600'>3</span>
                     
                            <button className={getButtonClass(3)} onClick={() => handleButtonClick(3)}></button>
                            <span  className='text-sm text-slate-600'>Documents <br /> Information</span>
                        </div>

                        <FaArrowRightLong className='text-4xl text-blue-600' />

                        
                        <div className='flex flex-col gap-1 items-center text-center'>
                            <span className='text-xl font-bold text-blue-600'>4</span>
                     
                            <button className={getButtonClass(4)} onClick={() => handleButtonClick(4)}></button>
                            <span  className='text-sm text-slate-600'>Terms and <br /> Conditions</span>
                        </div>

                    </div>

      <div className='max-w-6xl mx-auto px-24'>
      
          <div className={getHideorActive(1)}>
          <h2 className="text-2xl font-bold mb-6">Enter Organization Information</h2>
              <form onSubmit={handleSubmit} className='grid grid-cols-2 gap-4'>
            <div className="mb-4">
              <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700">Organization Name</label>
              <input type="text" name="organizationName" id="organizationName" value={formData.organizationName} onChange={handleChange} className="mt-1 p-2 w-full border rounded-md" />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
              <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className="mt-1 p-2 w-full border rounded-md" />
            </div>
            <div className="mb-4">
              <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700">Contact Person Details</label>
              <input type="text" name="contactPerson" id="contactPerson" value={formData.contactPerson} onChange={handleChange} className="mt-1 p-2 w-full border rounded-md" />
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
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input type="password" name="password" id="password" value={formData.password} onChange={handleChange} className="mt-1 p-2 w-full border rounded-md" />
            </div>
          </form>
          </div>

          <div className={getHideorActive(2)}>
          <h2 className="text-2xl font-bold mb-6">Other Information</h2>
              <form onSubmit={handleSubmit} className='grid grid-cols-2 gap-4'>
            <div className="mb-4">
              <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700">Organization Name</label>
              <input type="text" name="organizationName" id="organizationName" value={formData.organizationName} onChange={handleChange} className="mt-1 p-2 w-full border rounded-md" />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
              <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className="mt-1 p-2 w-full border rounded-md" />
            </div>
            <div className="mb-4">
              <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700">Contact Person Details</label>
              <input type="text" name="contactPerson" id="contactPerson" value={formData.contactPerson} onChange={handleChange} className="mt-1 p-2 w-full border rounded-md" />
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
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input type="password" name="password" id="password" value={formData.password} onChange={handleChange} className="mt-1 p-2 w-full border rounded-md" />
            </div>
          </form>
          </div>

          <div className={getHideorActive(3)} >
              <span>Text</span>
          </div>

          <div className={getHideorActive(4)} >
              <span>Text</span>
          </div>

          <div className={getConfirmation(5)}>
              <div className='bg-white w-1/2 h-1/2 rounded-md p-4 font-medium'>
                  <span className='text-xl'>Please confirm the details</span>

                  <div className='grid grid-cols-2'>
                    
                  </div>

                  <div className='flex justify-between mt-10'>
                    <button onClick={handlePrevious} className='bg-white py-2 px-12 border rounded-md hover:bg-slate-200'>Go back</button>
                    <button className='bg-blue-600 text-white py-2 px-12 rounded-md hover:bg-blue-800'>Submit</button>
                  </div>
              </div>
          </div>
          
          <div className='flex justify-between'>
          <button onClick={handlePrevious} className="mt-4 bg-white hover:bg-slate-200 border shadow font-bold py-2 px-12 rounded">{getPrevorHome(1)}</button>
          <button onClick={handleNext} className="mt-4 bg-blue-500 hover:bg-blue-700 shadow text-white font-bold py-2 px-12 rounded">Next</button>
          </div>
      </div>
    </main>
  );
}