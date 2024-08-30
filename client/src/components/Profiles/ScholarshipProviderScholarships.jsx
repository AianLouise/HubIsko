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
              <div key={scholarship._id} className='border bg-white rounded-lg p-4 shadow-sm gap-2 hover:-translate-y-1 transition ease-in-out'>
                <div className='flex flex-row mt-4 gap-4'>
                  <img src={scholarship.scholarshipImage} alt="Scholarship Image" className='rounded-full w-16 h-16 object-cover' />
                  <div className='flex flex-col'>
                    <div className='font-bold'>{scholarship.organizationName}</div>
                    <h2 className='text-xl font-semibold'>{scholarship.title}</h2>
                  </div>
                </div>

                <div className='p-4 flex flex-col gap-2'>
                  <div className='mt-4'>
                    <div className='border-b-2'></div>
                    <div className='-translate-y-4'>
                      <div className='flex text-blue-600 text-center justify-center font-bold'>
                        <div className='flex flex-row bg-white gap-2 px-2'>
                          <FaHandHolding className='text-xl' />
                          {scholarship.amount}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='flex flex-col gap-4'>
                    <div className='flex flex-row gap-4'>
                      <div className='flex flex-row w-40'>
                        <FaInfoCircle className='text-2xl text-blue-600 w-10' />
                        <p className='font-medium'>Info: </p>
                      </div>
                      <p className='w-full text-sm'>{scholarship.description}</p>
                    </div>

                    <div className='flex flex-row gap-4'>
                      <div className='flex flex-row w-40'>
                        <FaInfoCircle className='text-2xl text-blue-600 w-10' />
                        <p className='font-medium'>Eligibility: </p>
                      </div>
                      <p className='w-full text-sm'>{scholarship.otherEligibility}</p>
                    </div>

                    <div className='flex flex-row gap-4'>
                      <div className='flex flex-row w-40'>
                        <FaInfoCircle className='text-2xl text-blue-600 w-10' />
                        <p className='font-medium'>Deadline: </p>
                      </div>
                      <p className='w-full text-md'>
                        {new Date(scholarship.applicationDeadline).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  <Link to={`/scholarship-details/${scholarship._id}`} className='bg-blue-600 text-white p-2 flex justify-center items-center rounded-md my-4 font-medium hover:bg-blue-800 transition ease-in-out'>
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