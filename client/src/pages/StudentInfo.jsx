import React from "react";
import { useSelector } from 'react-redux';
import Header from "../components/Header";
import Footer from "../components/Footer";
import AccountManagement from "./AccountManagement";
import { Link } from "react-router-dom";
import PersonalInformation from "../components/StudentInfo/EditPersonalInformation";
import { RiEditFill } from "react-icons/ri";
import useTokenExpiry from '../hooks/useTokenExpiry'; // Adjust the import path

export default function StudentInfo() {
  useTokenExpiry();
  const { currentUser } = useSelector((state) => state.user);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <AccountManagement />
      <main className="flex-grow bg-[#f8f8fb] font-medium text-slate-700">
        <div className="max-w-6xl lg:px-24 mx-auto my-4 lg:my-10">
          {currentUser.applicantDetails.profileComplete ? (
            <div className="flex flex-col gap-10">
              <PersonalInformation />
              <div className="bg-white lg:gap-8 w-full border shadow rounded-md">
                <div className="flex justify-between items-center p-4 lg:px-12 lg:py-4 rounded-t-md border-b">
                  <span className="text-base lg:text-xl font-bold">Your Address Information</span>
                  <button className="flex gap-2 items-center bg-blue-600 text-white lg:px-6 px-4 py-2 rounded-md font-bold hover:bg-blue-800">
                    <RiEditFill />Edit
                  </button>
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
              <Link to={'/verify-profile'}>
                <button className="mt-10 bg-blue-600 rounded-md px-12 py-2 text-white hover:bg-blue-800 transition ease-in-out">Verify Profile Now</button>
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}