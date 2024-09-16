import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FaSearch, FaRedo, FaHandHolding, FaGraduationCap, FaInfoCircle } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { BiFilter } from 'react-icons/bi';
import ListingIcon from '../assets/ListingIconwTexture.png'
import useTokenExpiry from '../hooks/useTokenExpiry'; // Adjust the import path
import { useSelector } from 'react-redux';

export default function ScholarshipListing() {
  useTokenExpiry();

  useEffect(() => {
    document.title = "Scholarship Listing | HubIsko";
  }, []);

  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'admin') {
        navigate('/admin-dashboard');
      } else if (currentUser.role === 'scholarship_provider') {
        if (!currentUser.emailVerified) {
          navigate('/verify-your-email', { state: { email: currentUser.email } });
        } else {
          navigate('/provider-dashboard');
        }
      }
    }
  }, [currentUser, navigate]);

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

  const formatDate = (dateString) => {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredScholarships = scholarships
    .filter((scholarship) => scholarship.status === 'Published')
    .filter((scholarship) =>
      scholarship.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
        <div className='sm:flex sm:flex-col lg:block border-b mb-8 pt-8'>
          <div className='flex justify-center items-center w-full lg:mx-auto lg:max-w-6xl lg:justify-between lg:px-24'>
            <div className='flex flex-col gap-2 text-center items-center lg:items-start lg:text-left lg:w-1/2'>
              <div className='block lg:hidden bg-blue-600 w-36 h-36 rounded-md items-center justify-center'>
                <FaGraduationCap className='text-white text-8xl my-auto mx-auto mt-6' />
              </div>
              <div className='w-full text-3xl font-bold text-gray-800'>
                <span className='hidden lg:block'>Available Scholarships</span>
                <span className='block lg:hidden'>Available Scholarships</span>
              </div>
              <p className='w-full lg:w-full text-lg text-slate-500 font-medium lg:text-left lg:pb-0'>
                Discover various scholarship options to support your educational journey. Browse now to find the best fit for your needs!
              </p>
            </div>

            <img src={ListingIcon} alt='Listing Icon' className='hidden lg:block rounded-md items-center justify-center w-[400px] h-auto' />
          </div>
        </div>

        <div className='flex flex-col gap-4 justify-center items-left px-10 lg:mx-auto lg:max-w-6xl lg:px-24 my-8'>
          <div className='flex gap-2 items-center justify-between'>
            <span className='text-xl font-bold text-slate-600'>Organizations</span>
          </div>
          <div className='flex space-x-6'>
            {providers
              .filter((provider) => provider.status === 'Verified')
              .map((provider) => (
                <Link to={`/profile/${provider._id}`} key={provider._id} className='flex flex-col items-center group'>
                  <button className='flex flex-col items-center group space-y-2 relative'>
                    <div className='w-16 h-16 lg:w-20 lg:h-20 rounded-full overflow-hidden group-hover:bg-blue-800'>
                      <img
                        src={provider.profilePicture}
                        alt={`${provider.scholarshipProviderDetails.organizationName}'s profile`}
                        className='w-full h-full object-cover'
                      />
                    </div>
                    <span
                      className='font-medium max-w-[100px] text-ellipsis overflow-hidden whitespace-nowrap group-hover:tooltip'
                      title={provider.scholarshipProviderDetails.organizationName}
                    >
                      {provider.scholarshipProviderDetails.organizationName.length > 15
                        ? `${provider.scholarshipProviderDetails.organizationName.slice(0, 12)}...`
                        : provider.scholarshipProviderDetails.organizationName}
                    </span>
                    {/* Tooltip for the organization name */}
                    <div className='absolute top-full w-40 p-2 bg-white border-2 border-blue-500 shadow-lg text-center text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none'>
                      {provider.scholarshipProviderDetails.organizationName}
                    </div>
                  </button>
                </Link>
              ))}
          </div>
        </div>

        <div className='flex flex-col mx-auto max-w-6xl justify-center items-center px-10 lg:px-24'>
          <div className='flex flex-row w-full items-center justify-between gap-4'>
            <input
              type="text"
              placeholder='Search scholarship'
              value={searchQuery}
              onChange={handleSearchChange}
              className='border border-gray-300 p-2 px-4 lg:px-6 lg:text-base lg:font-sm w-[200px] lg:w-[400px] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition ease-in-out duration-150'
            />
            <button className='bg-white px-4 py-2 border rounded-md shadow font-medium flex items-center gap-2'>
              <BiFilter className='text-xl text-blue-600' />
              Filter
            </button>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 w-full gap-4 text-slate-700 mt-10'>
            {scholarships.length === 0 ? (
              <div className='col-span-full text-center text-gray-500 py-20'>
                No scholarships available at the moment.
              </div>
            ) : filteredScholarships.length === 0 ? (
              <div className='col-span-full text-center text-gray-500 py-20'>
                No scholarships found for the query "{searchQuery}"
              </div>
            ) : (
              filteredScholarships.map((scholarship) => (
                <div key={scholarship.id} className='border bg-white rounded-lg pt-4 px-4 shadow-sm gap-2 mb-10 hover:-translate-y-1 transition ease-in-out'>
                  <div className='flex flex-row items-center justify-start px-5 mt-5'>
                    <div className='lg:hidden flex-shrink-0'>
                      <div className='rounded-full w-14 h-14 overflow-hidden border-2 border-blue-500'>
                        <img
                          src={scholarship.scholarshipImage}
                          alt={scholarship.title}
                          className='w-full h-full object-cover'
                        />
                      </div>
                    </div>
                    <div className='rounded-full w-14 h-14 lg:block hidden overflow-hidden border-2 border-blue-500 flex-shrink-0'>
                      <img
                        src={scholarship.scholarshipImage}
                        alt={scholarship.title}
                        className='w-full h-full object-cover'
                      /> 
                    </div>
                    <div className='flex flex-col ml-6 flex-grow'>
                    <div className='flex justify-between items-center'>
                    <h2 className='lg:text-lg font-semibold'>{truncateText(scholarship.title, 12)}</h2>
                    <span className='font-medium bg-blue-600 text-white px-2 py-1 rounded-full'>000/000</span>
                    </div>
                    <p className='text-sm lg:text-base lg:text-gray-500'>{truncateText(scholarship.organizationName, 50)}</p>
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
                      {/* Slots Info */}
                      {/* <div className='flex lg:flex-row lg:gap-4'>
                        <div className='flex flex-col lg:flex-row gap-2 w-full lg:gap-0 lg:w-40'>
                          <div className='flex lg:gap-0 gap-2'>
                            <FaInfoCircle className='text-2xl text-blue-600 w-4 lg:w-10' />
                            <p className='font-medium'>Slots:  </p>
                          </div>
                          <p className='text-sm lg:hidden'>{scholarship.slots}</p>
                        </div>
                        <p className='w-full text-sm hidden lg:block'>{scholarship.slots}</p>
                      </div> */}
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
      </main>
      <Footer />
    </div>
  );
}