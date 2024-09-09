import React, { useState, useEffect } from "react";
import { BiFilter } from "react-icons/bi";
import { Link } from "react-router-dom";
import Layout from "../../components/Layout";
import { MdPreview } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { IoAddCircleOutline } from "react-icons/io5";

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
      setApplicants(data.applicants);
    } catch (error) {
      console.error('Error fetching all applicants:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllApplicants();
  }, []);

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
        {/* <div className='border-b mb-8'>
          <div className={'flex items-center mx-auto justify-between px-24'}>
            <div className='flex flex-col gap-2 w-1/2'>
              <h1 className='text-4xl font-bold text-gray-800'>Students' Info</h1>
              <p className='text-lg text-slate-500 font-medium'>This will serve as a storage for student's info</p>
            </div>
            <div className='bg-blue-600 w-36 h-36 my-8 rounded-md'></div>
          </div>
        </div> */}

        <div className='max-w-8xl mx-auto px-24 gap-4 flex-col flex mt-12'>
        
        <div className="flex items-center justify-between border-b pb-2">
          <h1 className='text-2xl font-bold text-slate-600'>Students' Info</h1>
          <h1 className='text-xl text-slate-600'>Recently Added</h1>
        </div>

        <div className='flex gap-4'>
          <div className='overflow-x-auto rounded-md bg-white shadow border w-full'>
          <div className='flex justify-between items-center gap-4 p-4 py-0 rounded-md'>

            <button className="flex gap-2 items-center bg-blue-600 rounded-md px-6 py-2 shadow text-white font-medium">
              <IoAddCircleOutline className='w-6 h-6' />
              Add Student
            </button>
            <div className="flex items-center gap-4 p-4">
            <input
              type="text"
              className=' border-gray-300 rounded-md p-2 border pr-8'
              placeholder='Search for students...'
            />
            <button className='bg-blue-600 px-4 py-2 rounded-md flex gap-2 text-white'>
              <BiFilter className='w-6 h-6' />
              <span>Filter</span>
            </button>
            </div>
          </div>
            <table className='w-full border-t text-left'>
              <thead>
                <tr className='bg-slate-100'>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">#No</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Name</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Email</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Date Applied</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applicants.map((applicant, index) => (
                  <tr key={applicant._id} className="font-normal tracking-wide hover:bg-slate-200">
                    <td className='py-2 px-4 border-b border-gray-200'>{index + 1}</td>
                    <td className='py-2 px-4 border-b border-gray-200'>
                      <div className="flex gap-2 items-center">
                      <div className="bg-blue-600 rounded-full h-6 w-6"></div>
                      {`${applicant.applicantDetails.firstName} ${applicant.applicantDetails.middleName} ${applicant.applicantDetails.lastName}`}
                      </div>
                    </td>
                    <td className='py-2 px-4 border-b border-gray-200'>{applicant.email}</td>
                    <td className='py-2 px-4 border-b border-gray-200'>{new Date(applicant.createdAt).toLocaleDateString()}</td>
                    <td className='py-2 px-4 border-b border-gray-200'>
                      <div className="flex items-center gap-2">
                      <Link to={`/student-details/${applicant._id}`} className=''>
                        <MdPreview className='w-6 h-6 text-blue-600 hover:text-blue-800' />
                      </Link>
                      <MdDelete className='w-6 h-6 text-red-500' />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className='flex justify-between items-center font-normal gap-4 p-4 py-6 text-gray-600 rounded-md'>
              <span>Showing items 1 out of 000</span>

              <div className="flex items-center px-8">
                <button className="border px-4 py-1 rounded-md">
                  Previous
                </button>
                <div className="flex gap-2 px-4">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-md">1</span>
                <span className="border px-3 py-1 rounded-md">2</span>
                <span className="border px-3 py-1 rounded-md">3</span>
                </div>
                <button className="bg-blue-600 text-white px-4 py-1 rounded-md">
                  Next
                </button>
              </div>

            </div>
          </div>

          <div className="divide-y bg-white shadow border rounded-md flex flex-col w-1/4">
                <div className="flex items-center gap-2 p-4">
                <div className="bg-blue-600 w-16 h-16 rounded-full"></div>
                <div className="flex flex-col gap-1">
                  <span className="text-lg font-bold text-slate-800">John Doe</span>
                  <span className="text-sm font-normal text-slate-600">University of Mang Tomas</span>
                </div>
                </div>

                
                <ul className="p-4 divide-y font-normal text-slate-600">
                  {[
                    { label: 'Email:', value: 'sample@sample.com' },
                    { label: 'Contact No:', value: '09123456789' },
                    { label: 'Region:', value: 'Mang Tomas' },
                    { label: 'Birthday:', value: 'August 13, 2024' },
                  ].map((item, index) => (
                    <li
                      key={index}
                      className={`flex items-center justify-between py-2 px-2 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-slate-50'
                      }`}
                    >
                      {item.label}
                      <span className="pr-2">{item.value}</span>
                    </li>
                  ))}
                </ul>
                              
                <div className="flex justify-end p-4">
                <button className="flex px-3 py-1 bg-blue-600 text-white rounded-md">
                  See full Details
                </button>
                </div>
          
            
          </div>
          



        </div>
        </div>
      </main>
    </div>
  );
}