import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FaSearch, FaRedo, FaHandHolding, FaGraduationCap, FaInfoCircle, FaMapMarkerAlt } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { BiFilter } from 'react-icons/bi';
import ListingIcon from '../assets/ListingIconwTexture.png'
import useTokenExpiry from '../hooks/useTokenExpiry'; // Adjust the import path
import { useSelector } from 'react-redux';
import { FaBook } from 'react-icons/fa6';
import { MdOutlineKeyboardArrowRight } from "react-icons/md";


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

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 2;
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNextPage = () => {
    if ((currentPage + 1) * itemsPerPage < filteredProviders.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const filteredProviders = providers.filter((provider) => provider.status === 'Verified');
  const paginatedProviders = filteredProviders.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  const allProviders = providers.filter((provider) => provider.status === 'Verified');

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
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedEducationLevel, setSelectedEducationLevel] = useState('');

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleCourseChange = (e) => {
    setSelectedCourse(e.target.value);
  };

  const handleLocationChange = (e) => {
    setSelectedLocation(e.target.value);
  };

  const handleEducationLevelChange = (e) => {
    setSelectedEducationLevel(e.target.value);
  };

  const filteredScholarships = scholarships
    .filter(scholarship =>
      scholarship.status === 'Published' &&
      scholarship.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedCourse === '' || scholarship.fieldOfStudy === selectedCourse) &&
      (selectedLocation === '' || scholarship.location === selectedLocation) &&
      (selectedEducationLevel === '' || scholarship.educationLevel === selectedEducationLevel)
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
              <p className='w-full lg:w-full p-4 px-6 lg:p-0 lg:px-0 lg:text-lg text-slate-500 font-medium lg:text-left lg:pb-0'>
                Discover various scholarship options to support your educational journey. Browse now to find the best fit for your needs!
              </p>
            </div>

            <img src={ListingIcon} alt='Listing Icon' className='hidden lg:block rounded-md items-center justify-center w-[400px] h-auto' />
          </div>
        </div>

      <div className='flex flex-col gap-4 justify-center items-left px-10 lg:mx-auto lg:max-w-6xl lg:px-24 lg:my-8'>
      <div className='flex gap-2 items-center justify-between'>
        <span className='text-xl font-bold text-slate-600'>Organizations</span>
      </div>
      <div className='flex items-center justify-center p-4'>
      {!isLargeScreen && (
          <button
            onClick={handlePreviousPage}
            className='absolute left-8 bg-blue-600 text-white p-2 rounded-full z-10'
            disabled={currentPage === 0}
          >
            <MdOutlineKeyboardArrowRight className='transform rotate-180' />
          </button>
        )}
        <div className={`flex space-x-6 ${isLargeScreen ? 'overflow-x-hidden' : 'overflow-x-auto'} overflow-y-hidden lg:h-32 w-full mx-4`}>
          {(isLargeScreen ? allProviders : paginatedProviders).map((provider) => (
            <Link to={`/profile/${provider._id}`} key={provider._id} className='flex flex-col items-center group flex-shrink-0 relative'>
              <button className='flex flex-col items-center group space-y-2 relative ml-4 lg:ml-0'>
                <div className='w-12 h-12 lg:w-20 lg:h-20 rounded-full overflow-hidden group-hover:bg-blue-800'>
                  <img
                    src={provider.profilePicture}
                    alt={`${provider.scholarshipProviderDetails.organizationName}'s profile`}
                    className='w-full h-full object-cover'
                  />
                </div>
                <span
                  className='font-medium max-w-[100px] text-sm lg:text-ellipsis overflow-hidden whitespace-nowrap group-hover:tooltip'
                  title={provider.scholarshipProviderDetails.organizationName}
                >
                  {provider.scholarshipProviderDetails.organizationName.length > 15
                    ? `${provider.scholarshipProviderDetails.organizationName.slice(0, 12)}...`
                    : provider.scholarshipProviderDetails.organizationName}
                </span>
              </button>
              <div className='absolute w-40 p-2 z-20 bg-white border-2 border-blue-500 shadow-lg text-center text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden sm:block'>
                {provider.scholarshipProviderDetails.organizationName}
              </div>
            </Link>
          ))}
        </div>
        {!isLargeScreen && (
          <button
            onClick={handleNextPage}
            className='absolute right-8 bg-blue-600 text-white p-2 rounded-full z-10'
            disabled={(currentPage + 1) * itemsPerPage >= providers.length}
          >
            <MdOutlineKeyboardArrowRight />
          </button>
        )}
      </div>
    </div>

        <div className='flex flex-col mx-auto max-w-6xl justify-center items-center px-10 lg:px-24'>
          <div className='flex flex-col w-full gap-4'>
            <div className='flex flex-col lg:flex-row items-center justify-between gap-4'>
              <div className='relative w-full lg:w-auto'>
                <FaSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500' />
                <input
                  type="text"
                  placeholder='Search scholarship'
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className='border border-gray-300 p-2 px-4 pl-12 lg:px-9 lg:text-base lg:font-sm w-full lg:w-[500px] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition ease-in-out duration-150'
                />
              </div>

              <div className='relative w-full lg:w-auto'>
                <FaBook className='absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500' />
                <select
                  value={selectedCourse}
                  onChange={handleCourseChange}
                  className='border border-gray-300 p-2 px-4 pl-12 lg:px-8 lg:text-base lg:font-sm w-full lg:w-[500px] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition ease-in-out duration-150'
                >
                  <option value="">Select a course to filter scholarships</option>
                  <option value="Open for All Courses">Open for All Courses</option>
                  <option value="BS in Accounting">BS in Accounting</option>
                  <option value="BS in Aerospace Engineering">BS in Aerospace Engineering</option>
                  <option value="BS in Agricultural Engineering">BS in Agricultural Engineering</option>
                  <option value="BS in Agriculture">BS in Agriculture</option>
                  <option value="BA in Anthropology">BA in Anthropology</option>
                  <option value="BS in Applied Mathematics">BS in Applied Mathematics</option>
                  <option value="BS in Architecture">BS in Architecture</option>
                  <option value="BA in Art Studies">BA in Art Studies</option>
                  <option value="BS in Astronomy">BS in Astronomy</option>
                  <option value="BS in Biochemistry">BS in Biochemistry</option>
                  <option value="BS in Biology">BS in Biology</option>
                  <option value="BS in Biomedical Engineering">BS in Biomedical Engineering</option>
                  <option value="BS in Business Administration">BS in Business Administration</option>
                  <option value="BS in Business Management">BS in Business Management</option>
                  <option value="BS in Chemical Engineering">BS in Chemical Engineering</option>
                  <option value="BS in Chemistry">BS in Chemistry</option>
                  <option value="BS in Civil Engineering">BS in Civil Engineering</option>
                  <option value="BA in Communication">BA in Communication</option>
                  <option value="BS in Computer Engineering">BS in Computer Engineering</option>
                  <option value="BS in Computer Science">BS in Computer Science</option>
                  <option value="BS in Criminology">BS in Criminology</option>
                  <option value="BS in Dentistry">BS in Dentistry</option>
                  <option value="BA in Development Communication">BA in Development Communication</option>
                  <option value="BS in Digital Media Arts">BS in Digital Media Arts</option>
                  <option value="BA in Economics">BA in Economics</option>
                  <option value="BS in Education">BS in Education</option>
                  <option value="BS in Electrical Engineering">BS in Electrical Engineering</option>
                  <option value="BS in Electronics Engineering">BS in Electronics Engineering</option>
                  <option value="BS in Elementary Education">BS in Elementary Education</option>
                  <option value="BS in Environmental Engineering">BS in Environmental Engineering</option>
                  <option value="BS in Environmental Science">BS in Environmental Science</option>
                  <option value="BS in Fashion Design">BS in Fashion Design</option>
                  <option value="BS in Finance">BS in Finance</option>
                  <option value="BA in Fine Arts">BA in Fine Arts</option>
                  <option value="BS in Food Science">BS in Food Science</option>
                  <option value="BS in Forestry">BS in Forestry</option>
                  <option value="BS in Forensic Science">BS in Forensic Science</option>
                  <option value="BS in Geodetic Engineering">BS in Geodetic Engineering</option>
                  <option value="BA in Geography">BA in Geography</option>
                  <option value="BS in Geology">BS in Geology</option>
                  <option value="BS in Graphic Design">BS in Graphic Design</option>
                  <option value="BS in Health Sciences">BS in Health Sciences</option>
                  <option value="BA in History">BA in History</option>
                  <option value="BS in Hospitality Management">BS in Hospitality Management</option>
                  <option value="BS in Hotel and Restaurant Management">BS in Hotel and Restaurant Management</option>
                  <option value="BS in Human Resource Development">BS in Human Resource Development</option>
                  <option value="BS in Industrial Design">BS in Industrial Design</option>
                  <option value="BS in Industrial Engineering">BS in Industrial Engineering</option>
                  <option value="BS in Information Systems">BS in Information Systems</option>
                  <option value="BS in Information Technology">BS in Information Technology</option>
                  <option value="BS in Interior Design">BS in Interior Design</option>
                  <option value="BA in International Relations">BA in International Relations</option>
                  <option value="BA in Journalism">BA in Journalism</option>
                  <option value="BS in Landscape Architecture">BS in Landscape Architecture</option>
                  <option value="BA in Law">BA in Law</option>
                  <option value="BA in Linguistics">BA in Linguistics</option>
                  <option value="BS in Management Accounting">BS in Management Accounting</option>
                  <option value="BS in Marine Biology">BS in Marine Biology</option>
                  <option value="BS in Marine Engineering">BS in Marine Engineering</option>
                  <option value="BS in Marine Transportation">BS in Marine Transportation</option>
                  <option value="BS in Marketing">BS in Marketing</option>
                  <option value="BS in Materials Science">BS in Materials Science</option>
                  <option value="BS in Mathematics">BS in Mathematics</option>
                  <option value="BS in Mechanical Engineering">BS in Mechanical Engineering</option>
                  <option value="BA in Media Studies">BA in Media Studies</option>
                  <option value="BS in Medical Laboratory Science">BS in Medical Laboratory Science</option>
                  <option value="BS in Medicine">BS in Medicine</option>
                  <option value="BS in Metallurgical Engineering">BS in Metallurgical Engineering</option>
                  <option value="BS in Microbiology">BS in Microbiology</option>
                  <option value="BS in Midwifery">BS in Midwifery</option>
                  <option value="BS in Mining Engineering">BS in Mining Engineering</option>
                  <option value="BS in Molecular Biology">BS in Molecular Biology</option>
                  <option value="BS in Multimedia Arts">BS in Multimedia Arts</option>
                  <option value="BS in Music">BS in Music</option>
                  <option value="BS in Nanotechnology">BS in Nanotechnology</option>
                  <option value="BS in Nursing">BS in Nursing</option>
                  <option value="BS in Nutrition">BS in Nutrition</option>
                  <option value="BS in Occupational Therapy">BS in Occupational Therapy</option>
                  <option value="BS in Oceanography">BS in Oceanography</option>
                  <option value="BS in Pharmacy">BS in Pharmacy</option>
                  <option value="BS in Physical Therapy">BS in Physical Therapy</option>
                  <option value="BS in Physics">BS in Physics</option>
                  <option value="BS in Political Science">BS in Political Science</option>
                  <option value="BS in Psychology">BS in Psychology</option>
                  <option value="BS in Public Health">BS in Public Health</option>
                  <option value="BS in Radiologic Technology">BS in Radiologic Technology</option>
                  <option value="BS in Real Estate Management">BS in Real Estate Management</option>
                  <option value="BA in Religious Studies">BA in Religious Studies</option>
                  <option value="BA in Social Work">BA in Social Work</option>
                  <option value="BS in Sociology">BS in Sociology</option>
                  <option value="BS in Software Engineering">BS in Software Engineering</option>
                  <option value="BS in Statistics">BS in Statistics</option>
                  <option value="BS in Tourism Management">BS in Tourism Management</option>
                  <option value="BS in Veterinary Medicine">BS in Veterinary Medicine</option>
                  <option value="BS in Zoology">BS in Zoology</option>
                  {/* Add more courses as needed */}
                </select>
              </div>
            </div>

            <div className='flex flex-col lg:flex-row items-center justify-between gap-4'>
              <div className='relative w-full lg:w-auto'>
                <FaMapMarkerAlt className='absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500' />
                <select
                  value={selectedLocation}
                  onChange={handleLocationChange}
                  className='border border-gray-300 p-2 pl-12 px-4 lg:px-8 lg:text-base lg:font-sm w-full lg:w-[500px] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition ease-in-out duration-150'
                >
                  <option value="">Select a location to filter scholarships</option>
                  <option value="Open for Any Location">Open for Any Location</option>
                  <option value="Floridablanca">Floridablanca</option>
                  <option value="Guagua">Guagua</option>
                  <option value="Lubao">Lubao</option>
                  <option value="Porac">Porac</option>
                  <option value="Santa Rita">Santa Rita</option>
                  <option value="Sasmuan">Sasmuan</option>
                </select>
              </div>

              <div className='relative w-full lg:w-auto'>
                <FaGraduationCap className='absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500' />
                <select
                  value={selectedEducationLevel}
                  onChange={handleEducationLevelChange}
                  className='border border-gray-300 p-2 pl-12 px-4 lg:px-8 lg:text-base lg:font-sm w-full lg:w-[500px] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition ease-in-out duration-150'
                >
                  <option value="Undergraduate">Undergraduate</option>
                  <option value="Graduate">Graduate</option>
                  <option value="PhD">PhD</option>
                </select>
              </div>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 w-full gap-4 text-slate-700 mt-10'>
            {filteredScholarships.length === 0 ? (
              <div className='col-span-full text-center text-gray-500 py-20'>
                No scholarships available at the moment.
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
                        <span className='font-medium bg-blue-600 text-white px-2 py-1 rounded-full'>{scholarship.approvedScholars}/{scholarship.numberOfScholarships}</span>
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
                          <p className='text-sm lg:hidden'>{truncateText(scholarship.location, 50)}</p>
                          <p className='text-sm lg:hidden'>{truncateText(scholarship.educationLevel, 50)}</p>
                        </div>
                        <p className='w-full text-sm hidden lg:block'>
                          {truncateText(scholarship.fieldOfStudy, 50)}, {truncateText(scholarship.location, 50)}, {truncateText(scholarship.educationLevel, 50)}
                        </p>
                      </div>
                      <div className='flex lg:flex-row lg:gap-4'>
                        <div className='flex flex-col lg:flex-row gap-2 w-full lg:gap-0 lg:w-40'>
                          <div className='flex lg:gap-0 gap-2'>
                            <FaInfoCircle className='text-2xl text-blue-600 w-4 lg:w-10' />
                            <p className='font-medium'>Deadline: </p>
                          </div>
                          <p className='text-sm lg:hidden'>{formatDate(scholarship.applicationDeadline)}</p>
                        </div>
                        <p className='w-full text-sm hidden lg:block'>{formatDate(scholarship.applicationDeadline)}</p>
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