import React, { useState, useEffect } from "react";
import { BiFilter } from "react-icons/bi";
import { Link } from "react-router-dom";
import Layout from "../../components/Layout";
import { MdPreview } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { IoAddCircleOutline } from "react-icons/io5";

const statusColors = {
  'Verify Account': 'bg-gray-400',
  'Pending Verification': 'bg-yellow-500',
  'Verified': 'bg-green-500',
  'Rejected': 'bg-red-500',
  'Active': 'bg-blue-500',
  'Inactive': 'bg-gray-600',
  'Suspended': 'bg-orange-500',
  'Pending Approval': 'bg-purple-500',
};

const getAccountLink = (account) => {
  const buttonText = account.status === 'Pending Verification' ? 'Verify' : 'View Details';

  if (account.status === 'Verify Account') {
    return null; // Do not show any button if the status is "Verify Account"
  }

  if (account.role === 'applicant') {
    const route = account.status === 'Pending Verification' ? `/student-applications/${account._id}` : `/student-details/${account._id}`;
    return <Link to={route} className="bg-blue-600 hover:bg-blue-800 px-4 py-1 rounded-md text-white">{buttonText}</Link>;
  } else if (account.role === 'scholarship_provider') {
    const route = account.status === 'Pending Verification' ? `/scholarship-provider-applications/${account._id}` : `/provider-details/${account._id}`;
    return <Link to={route} className="bg-blue-600 hover:bg-blue-800 px-4 py-1 rounded-md text-white">{buttonText}</Link>;
  } else {
    return null;
  }
};

export default function Students() {
  useEffect(() => {
    document.title = "Students | HubIsko";
  }, []);

  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllApplicants = async () => {
    try {
      const response = await fetch('/api/admin/all-applicants');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      const applicantsArray = data.applicants;

      // Load all profile pictures before setting applicants
      await Promise.all(
        applicantsArray.map(applicant => {
          return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = applicant.profilePicture;
            img.onload = resolve;
            img.onerror = reject;
          });
        })
      );

      setApplicants(applicantsArray);
    } catch (error) {
      console.error('Error fetching all applicants:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllApplicants();
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('A - Z');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (e) => {
    setSelectedFilter(e.target.value);
  };

  const filteredApplicants = applicants.filter(applicant => {
    const { applicantDetails, email } = applicant;
    if (!applicantDetails) return false;

    const matchesSearchQuery = applicantDetails.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      applicantDetails.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearchQuery;
  }).sort((a, b) => {
    if (selectedFilter === 'A - Z') {
      return a.applicantDetails.lastName.localeCompare(b.applicantDetails.lastName);
    } else if (selectedFilter === 'Z - A') {
      return b.applicantDetails.lastName.localeCompare(a.applicantDetails.lastName);
    } else if (selectedFilter === 'Recent') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (selectedFilter === 'Oldest') {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }
    return 0;
  });

  const totalPages = Math.ceil(filteredApplicants.length / itemsPerPage);
  const currentApplicants = filteredApplicants.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

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
      <main className="flex-grow bg-[#f8f8fb] font-medium text-slate-700">
        <div className='max-w-8xl mx-auto px-24 gap-4 flex-col flex mt-12 pb-10'>
          <div className="flex items-center justify-between border-b pb-2">
            <h1 className='text-2xl font-bold text-slate-600'>Students' Info</h1>
            {/* <h1 className='text-xl text-slate-600'>Recently Added</h1> */}
          </div>

          <div className='flex gap-4'>
            <div className='overflow-x-auto rounded-md bg-white shadow border w-full'>
              <div className='flex justify-between items-center gap-4 p-4 py-0 rounded-md'>
                {/* <button className="flex gap-2 items-center bg-blue-600 rounded-md px-6 py-2 shadow text-white font-medium">
                  <IoAddCircleOutline className='w-6 h-6' />
                  Add Student
                </button> */}
                <div></div>
                <div className="flex items-center gap-4 p-4">
                  <input
                    type="text"
                    className='border-gray-300 rounded-md p-2 border pr-8'
                    placeholder='Search for students...'
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                  <select
                    value={selectedFilter}
                    onChange={handleFilterChange}
                    className='border-gray-300 rounded-md p-2 border pr-8 bg-blue-600 text-white'
                  >
                    <option value="A - Z">A - Z</option>
                    <option value="Z - A">Z - A</option>
                    <option value="Recent">Recent</option>
                    <option value="Oldest">Oldest</option>
                  </select>
                </div>
              </div>
              <table className='w-full border-t text-center'>
                <thead>
                  <tr className='bg-slate-100'>
                    <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">No.</th>
                    <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Name</th>
                    <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Email</th>
                    <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Date Applied</th>
                    <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Status</th>
                    <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplicants.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-4 text-center text-gray-500">
                        No applicants found.
                      </td>
                    </tr>
                  ) : (
                    currentApplicants.map((applicant, index) => (
                      <tr key={applicant._id} className="font-normal tracking-wide hover:bg-slate-200 border-b">
                        <td className='py-2 px-4 border-gray-200'>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td className='py-2 px-4 border-gray-200'>
                          <div className="flex gap-2 items-center">
                            <img src={applicant.profilePicture} alt="Profile" className="rounded-full h-6 w-6 object-cover" />
                            {`${applicant.applicantDetails.lastName}, ${applicant.applicantDetails.firstName} ${applicant.applicantDetails.middleName.charAt(0)}.`}
                          </div>
                        </td>
                        <td className='py-2 px-4 border-gray-200'>{applicant.email}</td>
                        <td className='py-2 px-4 border-gray-200'>{new Date(applicant.createdAt).toLocaleDateString()}</td>
                        <td className='py-2 px-4 border-gray-200'>
                          <div className="flex items-center justify-center">
                            <span className={`w-3 h-3 rounded-full ${statusColors[applicant.status]} mr-2`}></span>
                            {applicant.status}
                          </div>
                        </td>
                        <td className='py-2 px-4 border-gray-200'>
                          <div className="flex justify-center items-center gap-2">
                            {getAccountLink(applicant)}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              <div className='flex justify-between items-center font-normal gap-4 p-4 py-6 text-gray-600 rounded-md'>
                <span>Showing items {currentPage} out of {totalPages}</span>
                <div className="flex items-center px-8">
                  <button onClick={handlePreviousPage} className="border px-4 py-1 rounded-md" disabled={currentPage === 1}>
                    Previous
                  </button>
                  <div className="flex gap-2 px-4">
                    {[...Array(totalPages)].map((_, index) => (
                      <button
                        key={index}
                        onClick={() => handlePageClick(index + 1)}
                        className={`px-3 py-1 rounded-md ${currentPage === index + 1 ? 'bg-blue-600 text-white' : 'border'}`}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                  <button onClick={handleNextPage} className="bg-blue-600 text-white px-4 py-1 rounded-md" disabled={currentPage === totalPages}>
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}