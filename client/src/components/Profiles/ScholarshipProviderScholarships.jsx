import React, { useState, useEffect } from 'react';
import { 
  FaHandHolding, 
  FaInfoCircle, 
  FaBuilding, 
  FaGraduationCap, 
  FaMapMarkerAlt, 
  FaCalendarAlt 
} from "react-icons/fa";
import { Link } from 'react-router-dom';

const ScholarshipProviderScholarships = ({ userId }) => {
  const [scholarships, setScholarships] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedEducationLevel, setSelectedEducationLevel] = useState('');

  // Function to fetch scholarship programs
  const fetchScholarships = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/api/profile/${userId}/scholarship-programs`);
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

  const getDaysRemaining = (deadlineDate) => {
    const now = new Date();
    const deadline = new Date(deadlineDate);
    const diffTime = deadline - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return "Deadline passed";
    } else if (diffDays === 0) {
      return "Deadline is today!";
    } else if (diffDays === 1) {
      return "1 day remaining";
    } else {
      return `${diffDays} days remaining`;
    }
  };

  const getDeadlineColor = (deadlineDate) => {
    const now = new Date();
    const deadline = new Date(deadlineDate);
    const diffTime = deadline - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return "text-red-600";
    } else if (diffDays <= 7) {
      return "text-orange-600";
    } else {
      return "text-green-600";
    }
  };

  useEffect(() => {
    fetchScholarships();
  }, [userId]);

  const filteredScholarships = scholarships
    .filter(scholarship =>
      scholarship.status === 'Published' &&
      (searchQuery === '' || 
        scholarship.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scholarship.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scholarship.organizationName.toLowerCase().includes(searchQuery.toLowerCase())
      ) &&
      (selectedCourse === '' || 
        scholarship.fieldOfStudy.includes('Open for All Courses') || 
        scholarship.fieldOfStudy.some(field => field.toLowerCase().includes(selectedCourse.toLowerCase()))
      ) &&
      (selectedLocation === '' || 
        scholarship.location.toLowerCase().includes(selectedLocation.toLowerCase())
      ) &&
      (selectedEducationLevel === '' || 
        scholarship.educationLevel.toLowerCase().includes(selectedEducationLevel.toLowerCase())
      )
    );

  return (
    <div className='p-4'>
      <div className='mb-6'>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder='Search Scholarship Program'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='border border-gray-300 p-3 px-4 lg:px-6 lg:text-base w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 shadow-sm'
            />
            <FaInfoCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>

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
                key={scholarship._id}
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
                    {scholarship.approvedScholars.length}/{scholarship.numberOfScholarships} Slots
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
                    to={`/scholarship-details/${scholarship._id}`}
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
  );
};

export default ScholarshipProviderScholarships;