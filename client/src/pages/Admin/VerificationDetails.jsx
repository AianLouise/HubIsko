import React, { useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { Link } from "react-router-dom";
import Layout from "../../components/Layout";

export default function VerificationDetails({ formData }) {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [declineReason, setDeclineReason] = useState('');

  const handleDeclineClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setDeclineReason('');
  };

  const handleReasonChange = (e) => {
    setDeclineReason(e.target.value);
  };

  const handleSubmit = () => {
    // Handle the submit logic here
    console.log('Decline reason:', declineReason);
    handleModalClose();
  };

  return (
    <div className="flex flex-col min-h-screen font-medium text-slate-700">
      <Layout />
      <main className="flex-grow bg-[#f8f8fb] pb-24">

        <div className='max-w-8xl mx-auto px-24 gap-10 flex-col flex mt-16'>

          <div className="flex gap-2 items-center">
            <Link to={'/accounts'} className="border shadow px-6 py-2 bg-white rounded-md hover:bg-slate-200">
              <span>Accounts</span>
            </Link>
            <IoMdArrowDropdown className='-rotate-90 w-8 h-8 text-blue-600' />

            <div className="border shadow px-6 py-2 bg-white rounded-md">
              <span className="text-blue-600">John Doe's Details</span>
            </div>
          </div>

          <div className="mt-8 bg-white p-8 rounded-md shadow-md w-full">

            <div className="text-lg font-bold bg-slate-200 border-2 px-4 py-2 rounded-md">Student Information</div>

            <div className="grid grid-cols-9 gap-8 my-4 border-b pb-4">
              <div className="">
                <label className="block text-sm font-medium text-slate-400">Last Name</label>
                <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">Doe</span>
              </div>
              <div className="">
                <label className="block text-sm font-medium text-slate-400">First Name</label>
                <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">John</span>
              </div>
              <div className="">
                <label className="block text-sm font-medium text-slate-400">Middle Name</label>
                <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">John Doe</span>
              </div>
              <div className="">
                <label className="block text-sm font-medium text-slate-400">Age</label>
                <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">10</span>
              </div>
              <div className="">
                <label className="block text-sm font-medium text-slate-400">Sex</label>
                <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">Male</span>
              </div>
              <div className="">
                <label className="block text-sm font-medium text-slate-400">Date of Birth</label>
                <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">1/11/11</span>
              </div>
              <div className="">
                <label className="block text-sm font-medium text-slate-400">Contact Number</label>
                <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">N/A</span>
              </div>
              <div className="">
                <label className="block text-sm font-medium text-slate-400">Email</label>
                <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">N/A</span>
              </div>
              <div className="">
                <label className="block text-sm font-medium text-slate-400">Permanent Address</label>
                <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">123</span>
              </div>
            </div>

            <div className="text-lg font-bold bg-slate-200 border-2 px-4 py-2 rounded-md">School Information</div>

            <div className="grid grid-cols-2 gap-8 my-4 border-b pb-4">
              <div className="">
                <label className="block text-sm font-medium text-slate-400">School Name</label>
                <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">Don Honorio Ventura State University</span>
              </div>
              <div className="">
                <label className="block text-sm font-medium text-slate-400">School Address</label>
                <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">Bacolor, Pampanga</span>
              </div>
              <div className="">
                <label className="block text-sm font-medium text-slate-400">Student's Course</label>
                <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">Bachelor of Science in Computer Science</span>
              </div>
              <div className="">
                <label className="block text-sm font-medium text-slate-400">School Year</label>
                <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">4th Year</span>
              </div>

            </div>

            <div className="my-4 border-b pb-4 flex flex-col gap-4">
              <div className="text-lg font-bold bg-slate-200 border-2 px-4 py-2 rounded-md">Parent/Guardian Information</div>

              <div className="grid grid-cols-3 gap-8">
                <div className="">
                  <label className="block text-sm font-medium text-slate-400">Mother's Last Name</label>
                  <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">Dela Cruz</span>
                </div>
                <div className="">
                  <label className="block text-sm font-medium text-slate-400">Mother's First Name</label>
                  <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">Maria</span>
                </div>
                <div className="">
                  <label className="block text-sm font-medium text-slate-400">Mother's Middle Name</label>
                  <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">Juan</span>
                </div>

                <div className="">
                  <label className="block text-sm font-medium text-slate-400">Father's Last Name</label>
                  <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">Dela Cruz</span>
                </div>
                <div className="">
                  <label className="block text-sm font-medium text-slate-400">Father's First Name</label>
                  <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">Maria</span>
                </div>
                <div className="">
                  <label className="block text-sm font-medium text-slate-400">Father's Middle Name</label>
                  <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">Juan</span>
                </div>

                {/* IF GUARDIAN */}

                {/* <div className="">
                            <label className="block text-sm font-medium text-slate-400">Guardian's Last Name</label>
                            <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">Dela Cruz</span>
                    </div>
                    <div className="">
                            <label className="block text-sm font-medium text-slate-400">Guardian's First Name</label>
                            <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">Maria</span>
                    </div>
                    <div className="">
                            <label className="block text-sm font-medium text-slate-400">Guardian's Middle Name</label>
                            <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">Juan</span>
                    </div> */}

              </div>

              <div className="grid grid-cols-2 gap-8 ">
                <div className="">
                  <label className="block text-sm font-medium text-slate-400">Parent's Email</label>
                  <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">N/A</span>
                </div>
                <div className="">
                  <label className="block text-sm font-medium text-slate-400">Parent's Contact Number</label>
                  <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">Dela Cruz</span>
                </div>
              </div>

            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-800"
              >
                Verify
              </button>
              <button
                type="button"
                className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-700"
                onClick={handleDeclineClick}
              >
                Decline
              </button>
            </div>
          </div>
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">Reason for Decline</h2>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md"
              rows="4"
              value={declineReason}
              onChange={handleReasonChange}
              placeholder="What is the reason for declining this verification?"
            />
            <div className="flex justify-end gap-4 mt-4">
              <button
                type="button"
                className="border px-4 py-2 rounded-md hover:bg-slate-200"
                onClick={handleModalClose}
              >
                Cancel
              </button>
              <button
                type="button"
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}