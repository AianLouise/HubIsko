import React, { useState, useEffect } from 'react';
import { FaHandHolding, FaInfoCircle } from "react-icons/fa";
import { Link } from 'react-router-dom';

const ScholarshipProviderScholarships = ({ userId }) => {
  const [scholarships, setScholarships] = useState([]);

  console.log(userId);

  // Function to fetch scholarship programs
  const fetchScholarships = async () => {
    try {
      const response = await fetch(`/api/profile/${userId}/scholarship-programs`);
      const data = await response.json();
      setScholarships(Array.isArray(data) ? data : []); // Ensure data is an array
    } catch (error) {
      console.error('Error fetching scholarships:', error);
      setScholarships([]); // Set to empty array on error
    }
  };

  function truncateText(text, maxLength) {
    if (typeof text !== 'string') {
      return '';
    }
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + '...';
  }

  const formatDate = (dateString) => {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  useEffect(() => {
    fetchScholarships();
  }, [userId]);

  return (
    <div className='p-4'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-700 pb-12'>
        {scholarships.length === 0 ? (
          <p>No scholarship programs available.</p>
        ) : (
          scholarships
            .filter(scholarship => scholarship.status === 'Active' || scholarship.status === 'Approved')
            .map((scholarship) => (
              <div key={scholarship.id} className='border bg-white rounded-lg pt-4 px-4 shadow-sm gap-2 mb-10 hover:-translate-y-1 transition ease-in-out'>
              <div className='flex flex-row items-center justify-start px-5 mt-5'>
                <div className='lg:hidden'>
                  <div className='rounded-full w-14 h-14 overflow-hidden border-2 border-blue-500'>
                    <img
                      src={scholarship.scholarshipImage}
                      alt={scholarship.title}
                      className='w-full h-full object-cover'
                    />
                  </div>
                </div>
                <div className='rounded-full w-14 h-14 lg:block hidden overflow-hidden border-2 border-blue-500'>
                  <img
                    src={scholarship.scholarshipImage}
                    alt={scholarship.title}
                    className='w-full h-full object-cover'
                  />
                </div>
                <div className='flex flex-col ml-6'>
                  <h2 className='lg:text-xl font-semibold'>{scholarship.title}</h2>
                  <p className='text-sm lg:text-base'>{truncateText(scholarship.organizationName, 50)}</p>
                </div>
              </div>
              <div className='p-4 flex flex-col gap-2'>
                <div className='mt-4'>
                  <div className='border-b-2'></div>
                  <div className='-translate-y-4'>
                    <div className='flex text-blue-600 text-left justify-center font-bold'>
                      <div className='flex flex-row bg-white gap-2 px-2 items-center'>
                        <FaHandHolding className='text-xl flex-shrink-0' />
                        {scholarship.amount}
                      </div>
                    </div>
                  </div>
                </div>
                <div className='flex flex-col gap-4'>
                  <div className='flex lg:flex-row lg:gap-4'>
                    <div className='flex flex-col lg:flex-row gap-2 w-full lg:gap-0 lg:w-40'>
                      <div className='flex lg:gap-0 gap-2'>
                        <FaInfoCircle className='text-2xl text-blue-600 w-4 lg:w-10' />
                        <p className='font-medium'>Info: </p>
                      </div>
                      <p className='text-sm lg:hidden'>{truncateText(scholarship.description, 50)}</p>
                    </div>
                    <p className='w-full text-sm hidden lg:block'>{truncateText(scholarship.description, 50)}</p>
                  </div>
                  <div className='flex lg:flex-row lg:gap-4'>
                    <div className='flex flex-col lg:flex-row gap-2 w-full lg:gap-0 lg:w-40'>
                      <div className='flex lg:gap-0 gap-2'>
                        <FaInfoCircle className='text-2xl text-blue-600 w-4 lg:w-10' />
                        <p className='font-medium'>Eligibility: </p>
                      </div>
                      <p className='text-sm lg:hidden'>{truncateText(scholarship.fieldOfStudy, 50)}</p>
                      <p className='text-sm lg:hidden'>{truncateText(scholarship.otherEligibility, 50)}</p>
                    </div>
                    <p className='w-full text-sm hidden lg:block'>
                      {truncateText(scholarship.fieldOfStudy, 50)}, {truncateText(scholarship.otherEligibility, 50)}
                    </p>
                  </div>
                  <div className='flex lg:flex-row lg:gap-4'>
                    <div className='flex flex-col lg:flex-row gap-2 w-full lg:gap-0 lg:w-40'>
                      <div className='flex lg:gap-0 gap-2'>
                        <FaInfoCircle className='text-2xl text-blue-600 w-4 lg:w-10' />
                        <p className='font-medium'>Deadline: </p>
                      </div>
                      <p className='text-sm lg:hidden'>{formatDate(scholarship.endDate)}</p>
                    </div>
                    <p className='w-full text-sm hidden lg:block'>{formatDate(scholarship.endDate)}</p>
                  </div>
                </div>
                <Link
                  to={`/scholarship-details/${scholarship.id}`}
                  key={scholarship._id}
                  className='bg-blue-600 text-white p-2 flex justify-center items-center rounded-md my-4 text-sm lg:text-base font-medium hover:bg-blue-800 transition ease-in-out'
                >
                  More Details for Application
                </Link>
              </div>
            </div>
            ))
        )}
      </div>
    </div>
  );
};

export default ScholarshipProviderScholarships;