import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FaSearch, FaRedo, FaHandHolding, FaGraduationCap, FaInfoCircle } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { BiFilter } from 'react-icons/bi';

export default function ScholarshipListing() {
  const [scholarships, setScholarships] = useState([]);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        const response = await fetch('/api/scholarshipProgram/scholarshipPrograms');
        const data = await response.json();
        setScholarships(data);
      } catch (error) {
        console.error('Error fetching scholarships:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchScholarships();
  }, []);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await fetch('/api/scholarshipProgram/getScholarshipProvider');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setProviders(data);
      } catch (error) {
        console.error('Error fetching scholarship providers:', error.message);
      }
    };

    fetchProviders();
  }, []);

  function truncateText(text, maxLength) {
    if (typeof text !== 'string') {
      return '';
    }
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + '...';
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <svg className="animate-spin h-10 w-10 text-blue-600" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-[#f8f8fb]">
        <div className='sm:flex sm:flex-col lg:block border-b mb-8 py-8'>
          <div className='flex justify-center items-center w-full lg:mx-auto lg:max-w-6xl lg:justify-between lg:px-24'>
            <div className='flex flex-col gap-2 text-center lg:text-left lg:w-1/2'>
              <div className='w-full lg:w-1/2 text-3xl font-bold text-gray-800'>
                <span className='hidden lg:block'>Available <br /> Scholarships</span>
                <span className='block lg:hidden'>Available Scholarships</span>
              </div>
              <p className='w-full lg:w-1/2 text-lg text-slate-500 font-medium'>Browse them below!</p>
            </div>
            <div className='hidden lg:block bg-blue-600 w-36 h-36 my-8 rounded-md items-center justify-center'>
              <FaGraduationCap className='text-white text-8xl my-auto mx-auto mt-6' />
            </div>
          </div>
        </div>
        <div className='flex flex-col gap-4 justify-center items-left px-10 lg:mx-auto lg:max-w-6xl lg:px-24 my-8'>
          <div className='flex gap-2 items-center justify-between'>
            <span className='text-xl font-bold text-slate-600'>Organizations</span>
            <button className='bg-white px-4 py-2 border rounded-md shadow font-medium flex items-center gap-2'>
              <BiFilter className='text-xl text-blue-600' />Filter</button>
          </div>
          <div className='flex'>
            {providers.map((provider) => (
              <Link to='/profile-preview' key={provider._id} className='flex flex-col items-center group'>
                <button className='flex flex-col items-center group'>
                  <div className='w-16 h-16 lg:w-20 lg:h-20 rounded-full overflow-hidden group-hover:bg-blue-800'>
                    <img src={provider.profilePicture} alt={`${provider.scholarshipProviderDetails.organizationName}'s profile`} className='w-full h-full object-cover' />
                  </div>
                  <span className='font-medium'>{provider.scholarshipProviderDetails.organizationName}</span>
                  <div className='flex gap-2 items-center'>
                    <div className='bg-blue-600 w-2 h-2 rounded-full'></div>
                    <span className='text-sm'>1 new</span>
                  </div>
                </button>
              </Link>
            ))}
          </div>
        </div>
        <div className='flex flex-col mx-auto max-w-6xl justify-center items-center px-10 lg:px-24'>
          <div className='flex flex-row w-full items-center gap-4'>
            <input
              type="text"
              placeholder='Search application'
              name=""
              id=""
              className='border-2 mb-8 p-2 px-6 lg:text-lg  lg:font-medium w-[200px] lg:w-[400px] rounded-md focus:outline-blue-400' />
            <button className='flex items-center justify-center bg-white p-2 rounded-full mb-6 border-2 hover:bg-slate-200 group'>
              <FaRedo className='w-5 h-5 text-blue-600 group-hover:rotate-180 transition ease-in-out' />
            </button>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-700'>
            {scholarships.map((scholarship) => (
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
                    <p className='text-sm lg:text-base'>{truncateText(scholarship.title, 50)}</p>
                  </div>
                </div>

                <div className='p-4 flex flex-col gap-2'>
                  <div className='mt-4'>
                    <div className='border-b-2'></div>
                    <div className='-translate-y-4'>
                      <div className='flex text-blue-600 text-center justify-center font-bold'>
                        <div className='flex flex-row bg-white gap-2 px-2'>
                          <FaHandHolding className='text-xl' />
                          Php 80,000 - Php 100,000
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
                        <p className='text-sm lg:hidden'>{truncateText(scholarship.eligibility, 50)}</p>
                      </div>
                      <p className='w-full text-sm hidden lg:block'>{truncateText(scholarship.eligibility, 50)}</p>
                    </div>
                    <div className='flex lg:flex-row lg:gap-4'>
                      <div className='flex flex-col lg:flex-row gap-2 w-full lg:gap-0 lg:w-40'>
                        <div className='flex lg:gap-0 gap-2'>
                          <FaInfoCircle className='text-2xl text-blue-600 w-4 lg:w-10' />
                          <p className='font-medium'>Deadline: </p>
                        </div>
                        <p className='text-sm lg:hidden'>{scholarship.deadline}</p>
                      </div>
                      <p className='w-full text-sm hidden lg:block'>{scholarship.deadline}</p>
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
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}