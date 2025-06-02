import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {
  FaSearch,
  FaHandHolding,
  FaGraduationCap,
  FaInfoCircle,
  FaMapMarkerAlt,
  FaSortAmountDown,
  FaFilter,
  FaChevronRight,
  FaChevronLeft,
  FaCalendarAlt,
  FaBuilding
} from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import ListingIcon from '../assets/ListingIconwTexture.png'
import useTokenExpiry from '../hooks/useTokenExpiry';
import { useSelector } from 'react-redux';
import { FaBook } from 'react-icons/fa6';

export default function ScholarshipListing() {
  useTokenExpiry();

  useEffect(() => {
    window.scrollTo(0, 0);
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
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);
  const [providerPage, setProviderPage] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [sortOption, setSortOption] = useState('deadline-asc'); // Default sort by deadline ascending

  // Constants for provider carousel
  const providersPerPage = isLargeScreen ? 6 : 3;

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const allProviders = providers.filter((provider) => provider.status === 'Verified');
  const totalProviderPages = Math.ceil(allProviders.length / providersPerPage);

  const handleNextProvider = () => {
    setProviderPage((prev) => (prev + 1) % totalProviderPages);
  };

  const handlePrevProvider = () => {
    setProviderPage((prev) => (prev === 0 ? totalProviderPages - 1 : prev - 1));
  };

  useEffect(() => {
      const fetchScholarships = async () => {
        try {
          const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
          const response = await fetch(`${apiUrl}/api/scholarshipProgram/scholarshipPrograms`);
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
          const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
          const response = await fetch(`${apiUrl}/api/scholarshipProgram/getScholarshipProvider`);
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
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getDaysRemaining = (deadlineDate) => {
    const today = new Date();
    const deadline = new Date(deadlineDate);
    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Expired';
    if (diffDays === 0) return 'Last day to apply!';
    if (diffDays === 1) return '1 day remaining';
    return `${diffDays} days remaining`;
  };

  const getDeadlineColor = (deadlineDate) => {
    const daysRemaining = getDaysRemaining(deadlineDate);
    if (daysRemaining === 'Expired') return 'text-red-600';
    if (daysRemaining === 'Last day to apply!' || parseInt(daysRemaining) <= 7) return 'text-orange-600';
    return 'text-green-600';
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

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const sortScholarships = (scholarships, option) => {
    const scholarshipsCopy = [...scholarships];

    switch (option) {
      case 'deadline-asc': // Earliest deadline first
        return scholarshipsCopy.sort((a, b) => new Date(a.applicationDeadline) - new Date(b.applicationDeadline));
      case 'deadline-desc': // Latest deadline first
        return scholarshipsCopy.sort((a, b) => new Date(b.applicationDeadline) - new Date(a.applicationDeadline));
      case 'alphabetical-asc': // A-Z
        return scholarshipsCopy.sort((a, b) => a.title.localeCompare(b.title));
      case 'alphabetical-desc': // Z-A
        return scholarshipsCopy.sort((a, b) => b.title.localeCompare(a.title));
      case 'organization-asc': // Organization A-Z
        return scholarshipsCopy.sort((a, b) => a.organizationName.localeCompare(b.organizationName));
      default:
        return scholarshipsCopy;
    }
  };

  const filteredScholarships = sortScholarships(
    scholarships.filter(scholarship =>
      scholarship.status === 'Published' &&
      (scholarship.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scholarship.organizationName.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (selectedCourse === '' || scholarship.fieldOfStudy.includes(selectedCourse) || scholarship.fieldOfStudy.includes('Open for All Courses')) &&
      (selectedLocation === '' || scholarship.location === selectedLocation || scholarship.location.includes('Open for Any Location')) &&
      (selectedEducationLevel === '' || scholarship.educationLevel === selectedEducationLevel)
    ),
    sortOption
  );

  const courses = [
    "Open for All Courses",
    "BA in Anthropology",
    "BA in Art Studies",
    "BA in Communication",
    "BA in Development Communication",
    "BA in Economics",
    "BA in Fine Arts",
    "BA in Geography",
    "BA in History",
    "BA in International Relations",
    "BA in Journalism",
    "BA in Law",
    "BA in Linguistics",
    "BA in Media Studies",
    "BA in Religious Studies",
    "BA in Social Work",
    "BS in Accounting",
    "BS in Accounting Information Systems",
    "BS in Accounting Technology",
    "BS in Aerospace Engineering",
    "BS in Agribusiness Management",
    "BS in Agricultural Engineering",
    "BS in Agriculture",
    "BS in Animal Science",
    "BS in Applied Mathematics",
    "BS in Applied Physics",
    "BS in Architecture",
    "BS in Astronomy",
    "BS in Biochemistry",
    "BS in Biology",
    "BS in Biomedical Engineering",
    "BS in Biosystems Engineering",
    "BS in Business Administration",
    "BS in Business Administration major in Financial Management",
    "BS in Business Analytics",
    "BS in Business Management",
    "BS in Chemical Engineering",
    "BS in Chemistry",
    "BS in Civil Engineering",
    "BS in Communication",
    "BS in Computer Engineering",
    "BS in Computer Science",
    "BS in Criminology",
    "BS in Cyber Security",
    "BS in Data Analytics",
    "BS in Data Science",
    "BS in Dentistry",
    "BS in Digital Media Arts",
    "BS in Education",
    "BS in Electrical Engineering",
    "BS in Elementary Education",
    "BS in Electronics and Communications Engineering",
    "BS in Electronics Engineering",
    "BS in Environmental Engineering",
    "BS in Environmental Science",
    "BS in Fashion Design",
    "BS in Finance",
    "BS in Food Science",
    "BS in Food Technology",
    "BS in Forensic Science",
    "BS in Forestry",
    "BS in Geodetic Engineering",
    "BS in Geology",
    "BS in Graphic Design",
    "BS in Health Sciences",
    "BS in Horticulture",
    "BS in Hospitality Management",
    "BS in Hotel and Restaurant Management",
    "BS in Human Resource Development",
    "BS in Industrial Design",
    "BS in Industrial Engineering",
    "BS in Information Systems",
    "BS in Information Technology",
    "BS in Internal Auditing",
    "BS in Landscape Architecture",
    "BS in Library and Information Science",
    "BS in Management Accounting",
    "BS in Marine Biology",
    "BS in Marine Engineering",
    "BS in Marine Transportation",
    "BS in Marketing",
    "BS in Materials Science",
    "BS in Mathematics",
    "BS in Mechanical Engineering",
    "BS in Medical Laboratory Science",
    "BS in Medical Technology",
    "BS in Medicine",
    "BS in Metallurgical Engineering",
    "BS in Microbiology",
    "BS in Midwifery",
    "BS in Mining Engineering",
    "BS in Molecular Biology",
    "BS in Multimedia Arts",
    "BS in Music",
    "BS in Nanotechnology",
    "BS in Nursing",
    "BS in Nutrition",
    "BS in Occupational Therapy",
    "BS in Oceanography",
    "BS in Pharmacy",
    "BS in Physical Therapy",
    "BS in Physics",
    "BS in Political Science",
    "BS in Psychology",
    "BS in Public Health",
    "BS in Radiologic Technology",
    "BS in Real Estate Management",
    "BS in Renewable/Sustainable Energy Engineering",
    "BS in Robotics Engineering",
    "BS in Secondary Education major in Biology",
    "BS in Secondary Education major in Chemistry",
    "BS in Secondary Education major in English",
    "BS in Secondary Education major in General Sciences",
    "BS in Secondary Education major in Mathematics",
    "BS in Secondary Education major in Physics",
    "BS in Social Work",
    "BS in Sociology",
    "BS in Software Engineering",
    "BS in Statistics",
    "BS in Tourism Management",
    "BS in Veterinary Medicine",
    "BS in Zoology"
  ];

  useEffect(() => {
    if (allProviders.length > 0) {
      setLoading(false);
    }
  }, [allProviders]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-12 w-12 text-blue-600 mb-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          <p className="text-gray-600 font-medium">Loading scholarships...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-gray-50">
        {/* Hero Section */}        <div className="bg-gradient-to-r from-blue-700 to-blue-500 py-12 mb-8">
          <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="text-white lg:w-1/2 text-center lg:text-left">
                <h1 className="text-3xl lg:text-4xl font-bold mb-4">Find Your Perfect Scholarship</h1>
                <p className="text-blue-100 text-lg mb-6 max-w-xl">
                  Discover various scholarship options to support your educational journey. Browse through our curated list of opportunities to find the best fit for your academic goals and financial needs.
                </p>
              </div>
              <div className="lg:w-1/2 flex justify-center">
                <img
                  src={ListingIcon}
                  alt="Scholarship Listing"
                  className="w-64 h-64 lg:w-96 lg:h-auto object-cover transform hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          {/* Organizations Section */}
          <section className="mb-12 bg-white rounded-xl shadow-md p-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Scholarship Providers</h2>
                <p className="text-gray-600">Connect with trusted organizations offering scholarships</p>
              </div>
              <div className="flex items-center space-x-2 mt-4 md:mt-0">
                <button
                  onClick={handlePrevProvider}
                  className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 rounded-full transition"
                  aria-label="Previous providers"
                >
                  <FaChevronLeft />
                </button>
                <span className="text-gray-500 text-sm">
                  {providerPage + 1} of {totalProviderPages}
                </span>
                <button
                  onClick={handleNextProvider}
                  className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 rounded-full transition"
                  aria-label="Next providers"
                >
                  <FaChevronRight />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {allProviders
                .sort((a, b) => a.scholarshipProviderDetails.organizationName.localeCompare(b.scholarshipProviderDetails.organizationName))
                .slice(providerPage * providersPerPage, (providerPage * providersPerPage) + providersPerPage)
                .map((provider) => (
                  <Link
                    to={`/profile/${provider._id}`}
                    key={provider._id}
                    className="group"
                  >
                    <div className="flex flex-col items-center p-4 rounded-lg hover:bg-blue-50 transition-all duration-300 h-full">
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-blue-500 mb-3 group-hover:border-blue-700 transition-all">
                        <img
                          src={provider.profilePicture}
                          alt={`${provider.scholarshipProviderDetails.organizationName}'s profile`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-center font-medium text-gray-800 group-hover:text-blue-700 transition-colors">
                        {provider.scholarshipProviderDetails.organizationName.length > 15
                          ? `${provider.scholarshipProviderDetails.organizationName.slice(0, 15)}...`
                          : provider.scholarshipProviderDetails.organizationName}
                      </span>
                    </div>
                  </Link>
                ))}
            </div>
          </section>

          {/* Filters Section */}
          <section className="mb-8">
            <div className="bg-white rounded-xl shadow-md p-6">              <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Find Scholarships</h2>
              <button
                onClick={toggleFilters}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 md:hidden transition"
              >
                <FaFilter />
                <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
              </button>
            </div>

              <div className="mb-6">
                <label htmlFor="search-filter" className="block text-sm font-medium text-gray-700 mb-1">Search Scholarships</label>
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
                  <input
                    id="search-filter"
                    type="text"
                    placeholder="Search scholarships by title or organization"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full border border-gray-300 rounded-lg py-3 pl-10 pr-4 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                  />
                </div>
              </div>

              <div className={`md:flex flex-wrap gap-4 ${showFilters ? 'flex flex-col' : 'hidden'}`}>
                <div className="flex-1 min-w-[250px]">
                  <label htmlFor="course-filter" className="block text-sm font-medium text-gray-700 mb-1">Field of Study</label>
                  <div className="relative">
                    <FaBook className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
                    <select
                      id="course-filter"
                      value={selectedCourse}
                      onChange={handleCourseChange}
                      className="w-full border border-gray-300 rounded-lg py-2 pl-10 pr-3 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">All Courses</option>
                      {courses.map((course) => (
                        <option key={course} value={course}>{course}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex-1 min-w-[250px]">
                  <label htmlFor="location-filter" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <div className="relative">
                    <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
                    <select
                      id="location-filter"
                      value={selectedLocation}
                      onChange={handleLocationChange}
                      className="w-full border border-gray-300 rounded-lg py-2 pl-10 pr-3 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">All Locations</option>
                      <option value="Open for Any Location">Open for Any Location</option>
                      <option value="Floridablanca">Floridablanca</option>
                      <option value="Guagua">Guagua</option>
                      <option value="Lubao">Lubao</option>
                      <option value="Porac">Porac</option>
                      <option value="Santa Rita">Santa Rita</option>
                      <option value="Sasmuan">Sasmuan</option>
                    </select>
                  </div>
                </div>

                <div className="flex-1 min-w-[250px]">
                  <label htmlFor="education-filter" className="block text-sm font-medium text-gray-700 mb-1">Education Level</label>
                  <div className="relative">
                    <FaGraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
                    <select
                      id="education-filter"
                      value={selectedEducationLevel}
                      onChange={handleEducationLevelChange}
                      className="w-full border border-gray-300 rounded-lg py-2 pl-10 pr-3 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">All Levels</option>
                      <option value="Undergraduate">Undergraduate</option>
                      <option value="Graduate">Graduate</option>
                      <option value="Postgraduate">Postgraduate</option>
                    </select>
                  </div>
                </div>

                <div className="flex-1 min-w-[250px]">
                  <label htmlFor="sort-options" className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                  <div className="relative">
                    <FaSortAmountDown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
                    <select
                      id="sort-options"
                      value={sortOption}
                      onChange={handleSortChange}
                      className="w-full border border-gray-300 rounded-lg py-2 pl-10 pr-3 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="deadline-asc">Deadline (Earliest First)</option>
                      <option value="deadline-desc">Deadline (Latest First)</option>
                      <option value="alphabetical-asc">Name (A-Z)</option>
                      <option value="alphabetical-desc">Name (Z-A)</option>
                      <option value="organization-asc">Organization (A-Z)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-between items-center">
                <p className="text-gray-600">
                  Showing <span className="font-semibold">{filteredScholarships.length}</span> scholarships
                </p>
                {filteredScholarships.length > 0 && (
                  <p className="text-sm text-gray-500">
                    {selectedCourse || selectedLocation || selectedEducationLevel ?
                      'Filtered results' : 'Showing all available scholarships'}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Scholarships Section */}
          <section className="mb-12">
            {filteredScholarships.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <FaInfoCircle className="text-4xl text-blue-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Scholarships Found</h3>
                <p className="text-gray-600 mb-6">
                  We couldn't find any scholarships matching your current filters. Try adjusting your search criteria.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCourse('');
                    setSelectedLocation('');
                    setSelectedEducationLevel('');
                  }}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredScholarships.map((scholarship) => (
                  <div
                    key={scholarship.id}
                    className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col"
                  >
                    <div className="relative">
                      <div className="h-40 w-full bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center p-4">
                        <div className="rounded-full bg-white p-2 w-24 h-24 flex items-center justify-center">
                          <img
                            src={scholarship.scholarshipImage}
                            alt={scholarship.title}
                            className="w-20 h-20 object-cover rounded-full"
                          />
                        </div>
                      </div>
                      <div className="absolute top-4 right-4 bg-white text-blue-700 px-3 py-1 rounded-full font-semibold text-sm shadow-md">
                        {scholarship.approvedScholars}/{scholarship.numberOfScholarships} Slots
                      </div>
                    </div>

                    <div className="p-5 flex-grow">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors">
                          {truncateText(scholarship.title, 40)}
                        </h3>
                      </div>

                      <div className="flex items-center mb-3 text-gray-600">
                        <FaBuilding className="mr-2 text-blue-500" />
                        <span>{truncateText(scholarship.organizationName, 40)}</span>
                      </div>

                      <div className="bg-blue-50 p-3 rounded-lg mb-3 flex items-center justify-center">
                        <span className="font-semibold text-blue-800">{scholarship.amount}</span>
                      </div>

                      <div className="mb-4">
                        <p className="text-gray-600 mb-3">{truncateText(scholarship.description, 100)}</p>

                        <div className="flex items-center mb-2 text-sm">
                          <FaGraduationCap className="text-blue-500 mr-2" />
                          <span className="text-gray-700">
                            {scholarship.fieldOfStudy.includes('Open for All Courses')
                              ? 'Open for All Courses'
                              : truncateText(scholarship.fieldOfStudy.join(', '), 40)}
                          </span>
                        </div>

                        <div className="flex items-center mb-2 text-sm">
                          <FaMapMarkerAlt className="text-blue-500 mr-2" />
                          <span className="text-gray-700">{scholarship.location}</span>
                        </div>

                        <div className="flex items-center text-sm">
                          <FaCalendarAlt className="text-blue-500 mr-2" />
                          <span className={`${getDeadlineColor(scholarship.applicationDeadline)} font-medium`}>
                            Deadline: {formatDate(scholarship.applicationDeadline)}
                            <span className="block text-xs mt-1">{getDaysRemaining(scholarship.applicationDeadline)}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="px-5 pb-5 mt-auto">
                      <Link
                        to={`/scholarship-details/${scholarship.id}`}
                        className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-3 rounded-lg transition-colors font-medium"
                      >
                        View Details & Apply
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}