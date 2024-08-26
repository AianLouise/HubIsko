import React from "react";
import { useSelector } from 'react-redux';
import Header from "../components/Header";
import Footer from "../components/Footer";
import AccountManagement from "./AccountManagement";
import { MdModeEdit, MdLockOutline } from "react-icons/md";
import { IoDocumentAttachOutline } from "react-icons/io5";
import { HiDocumentText } from "react-icons/hi";
import { Link } from "react-router-dom";


export default function StudentInfo() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <AccountManagement />
      <main className="flex-grow bg-[#f8f8fb]">
        <div className="max-w-6xl lg:px-24 px-4 mx-auto my-4 lg:mt-10">
          {currentUser.applicantDetails.profileComplete ? (
            <div className="bg-white shadow rounded-lg col-span-1 md:col-span-2">
              <h2 className="font-semibold text-xl w-full bg-blue-600 p-4 rounded-t-lg text-white">Profile Management</h2>
              <div className="space-y-4 p-4 text-slate-800">
                <button className='border-b flex flex-row w-full justify-between p-4 rounded-md hover:bg-slate-200'>
                  <span className='text-base lg:text-lg font-bold'>Edit Personal Details</span>
                  <MdModeEdit className='text-lg lg:text-2xl text-blue-600' />
                </button>
                <button className='border-b flex flex-row w-full justify-between p-4 rounded-md hover:bg-slate-200'>
                  <span className='text-base lg:text-lg font-bold'>Upload Documents</span>
                  <IoDocumentAttachOutline className='text-lg lg:text-2xl text-blue-600' />
                </button>
                <button className='border-b flex flex-row w-full justify-between p-4 rounded-md hover:bg-slate-200'>
                  <span className='text-base lg:text-lg font-bold'>Academic History and GPA</span>
                  <HiDocumentText className='text-lg lg:text-2xl text-blue-600' />
                </button>
                <button className='flex flex-row w-full justify-between p-4 rounded-md hover:bg-slate-200'>
                  <span className='text-base lg:text-lg font-bold'>Change Password and Security</span>
                  <MdLockOutline className='text-lg lg:text-2xl text-blue-600' />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center mt-20 lg:mt-40">
              <span className="text-2xl font-medium">Your account isn't verified yet.</span>
              <span className="text-slate-600">Complete your profile first to gain access to your student info.</span>
              <Link to={'/complete-profile'}>
                <button className="mt-10 bg-blue-600 rounded-md px-12 py-2 text-white hover:bg-blue-800 transition ease-in-out">Complete Profile Now</button>
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>

  );

}