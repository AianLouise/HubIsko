import React from "react";
import { useSelector } from 'react-redux';
import Header from "../components/Header";
import Footer from "../components/Footer";
import AccountManagement from "./AccountManagement";
import { MdModeEdit, MdLockOutline } from "react-icons/md";
import { IoDocumentAttachOutline } from "react-icons/io5";
import { HiDocumentText } from "react-icons/hi";
import { Link } from "react-router-dom";
import { RiEditFill } from "react-icons/ri";


export default function StudentInfo() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <AccountManagement />
      <main className="flex-grow bg-[#f8f8fb] font-medium text-slate-700">
        <div className="max-w-6xl lg:px-24 px-4 mx-auto my-4 lg:my-10">
          {currentUser.applicantDetails.profileComplete ? (
      
            <div className="flex flex-col gap-10">
              <div className="bg-white lg:gap-8 w-full border shadow rounded-md">
                <div className="flex justify-between items-center p-4 lg:px-12 lg:py-4 rounded-t-md border-b">
                <span className="text-base lg:text-xl font-bold">Your Personal Information</span>
                <button className="flex gap-2 items-center bg-blue-600 text-white lg:px-6 px-4 py-2 rounded-md font-bold hover:bg-blue-800"><RiEditFill/>Edit</button>
                </div>
                
                <div className="grid lg:grid-cols-4 gap-8 px-4 lg:px-12 py-8 text-sm">
                    <div className="flex flex-col gap-2">
                      <label className="text-slate-400">First Name</label>
                      <input
                        type="text"
                        className="w-full bg-slate-200 p-2 rounded-md"
                        value={currentUser.applicantDetails.firstName}
                        disabled
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-slate-400">Last Name</label>
                      <input
                        type="text"
                        className="w-full bg-slate-200 p-2 rounded-md"
                        value={currentUser.applicantDetails.lastName}
                        disabled
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-slate-400">Middle Name</label>
                      <input
                        type="text"
                        className="w-full bg-slate-200 p-2 rounded-md"
                        value={currentUser.applicantDetails.middleName}
                        disabled
                      />
                      </div>

                    <div className="flex flex-col gap-2">
                    <label className="text-slate-400">Name Extension</label>
                    <input
                      type="text"
                      className="w-full bg-slate-200 p-2 rounded-md"
                      value={currentUser.applicantDetails.nameExtension}
                      disabled
                    />
                    </div>

                    <div className="flex flex-col gap-2">
                    <label className="text-slate-400">BirthDate</label>
                    <input
                      type="Date"
                      className="w-full bg-slate-200 p-2 rounded-md"
                      value={currentUser.applicantDetails.birthDate}
                      disabled
                    />
                    </div>

                    <div className="flex flex-col gap-2">
                    <label className="text-slate-400">Birthplace</label>
                    <input
                      type="text"
                      className="w-full bg-slate-200 p-2 rounded-md"
                      value={currentUser.applicantDetails.birthPlace}
                      disabled
                    />
                    </div>

                    <div className="flex flex-col gap-2">
                    <label className="text-slate-400">Gender</label>
                    <input
                      type="text"
                      className="w-full bg-slate-200 p-2 rounded-md"
                      value={''}
                      disabled
                    />
                    </div>
                    
                    <div className="flex flex-col gap-2">
                    <label className="text-slate-400">Civil Status</label>
                    <input
                      type="text"
                      className="w-full bg-slate-200 p-2 rounded-md"
                      value={currentUser.applicantDetails.civilStatus}
                      disabled
                    />
                    </div>

                    <div className="flex flex-col gap-2">
                    <label className="text-slate-400">Maiden Name</label>
                    <input
                      type="text"
                      className="w-full bg-slate-200 p-2 rounded-md"
                      value={currentUser.applicantDetails.maidenName}
                      disabled
                    />
                    </div>

                    <div className="flex flex-col gap-2">
                    <label className="text-slate-400">Name of Spouse</label>
                    <input
                      type="text"
                      className="w-full bg-slate-200 p-2 rounded-md"
                      value={currentUser.applicantDetails.spouseName}
                      disabled
                    />
                    </div>

                    <div className="flex flex-col gap-2">
                    <label className="text-slate-400">Occupation of Spouse</label>
                    <input
                      type="text"
                      className="w-full bg-slate-200 p-2 rounded-md"
                      value={currentUser.applicantDetails.spouseOccupation}
                      disabled
                    />
                    </div>

                    <div className="flex flex-col gap-2">
                    <label className="text-slate-400">Religion</label>
                    <input
                      type="text"
                      className="w-full bg-slate-200 p-2 rounded-md"
                      value={currentUser.applicantDetails.religion}
                      disabled
                    />
                    </div>

                    <div className="flex flex-col gap-2">
                    <label className="text-slate-400">Height</label>
                    <input
                      type="text"
                      className="w-full bg-slate-200 p-2 rounded-md"
                      value={currentUser.applicantDetails.height}
                      disabled
                    />
                    </div>

                    <div className="flex flex-col gap-2">
                    <label className="text-slate-400">Weight</label>
                    <input
                      type="text"
                      className="w-full bg-slate-200 p-2 rounded-md"
                      value={currentUser.applicantDetails.weight}
                      disabled
                    />
                    </div>

                    <div className="flex flex-col gap-2">
                    <label className="text-slate-400">Blood Type</label>
                    <input
                      type="text"
                      className="w-full bg-slate-200 p-2 rounded-md"
                      value={currentUser.applicantDetails.bloodType}
                      disabled
                    />
                    </div>

                    <div className="flex flex-col gap-2">
                    <label className="text-slate-400">ContactNumber</label>
                    <input
                      type="text"
                      className="w-full bg-slate-200 p-2 rounded-md"
                      value={currentUser.applicantDetails.contactNumber}
                      disabled
                    />
                    </div>



                </div>
              </div>

              
              <div className="bg-white lg:gap-8 w-full border shadow rounded-md">
                <div className="flex justify-between items-center p-4 lg:px-12 lg:py-4 rounded-t-md border-b">
                <span className="text-base lg:text-xl font-bold">Your Address Information</span>
                <button className="flex gap-2 items-center bg-blue-600 text-white lg:px-6 px-4 py-2 rounded-md font-bold hover:bg-blue-800"><RiEditFill/>Edit</button>
                </div>

                  <div className="flex flex-col px-4 lg:px-12 py-8 font-normal">
                    <div className="grid lg:grid-cols-2 gap-10">
                      <div className="flex flex-col gap-2">
                      <label className="text-slate-400">Region</label>
                      <input
                        type="text"
                        className="w-full bg-slate-200 p-2 rounded-md"
                        value={currentUser.applicantDetails.region}
                        disabled
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-slate-400">Province</label>
                      <input
                        type="text"
                        className="w-full bg-slate-200 p-2 rounded-md"
                        value={currentUser.applicantDetails.province}
                        disabled
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-slate-400">City</label>
                      <input
                        type="text"
                        className="w-full bg-slate-200 p-2 rounded-md"
                        value={currentUser.applicantDetails.city}
                        disabled
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-slate-400">Barangay</label>
                      <input
                        type="text"
                        className="w-full bg-slate-200 p-2 rounded-md"
                        value={currentUser.applicantDetails.barangay}
                        disabled
                      />
                    </div>
                    </div>

                    <div className="flex flex-col gap-2 pt-8">
                      <label className="text-slate-400">Street</label>
                      <input
                        type="text"
                        className="w-full bg-slate-200 p-2 rounded-md"
                        value={currentUser.applicantDetails.street}
                        disabled
                      />
                    </div>
                  </div>

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