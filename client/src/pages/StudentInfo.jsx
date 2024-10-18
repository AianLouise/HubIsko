import React from "react";
import { useSelector } from 'react-redux';
import Header from "../components/Header";
import Footer from "../components/Footer";
import AccountManagement from "./AccountManagement";
import { Link } from "react-router-dom";
import PersonalInformation from "../components/StudentInfo/EditPersonalInformation";
import AddressInformation from "../components/StudentInfo/AddressInformation"; // Import the new component
import EducationInformation from "../components/StudentInfo/EducationInformation";
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
            <div className="flex flex-col gap-5">
              <h2 className="text-lg lg:text-lg font-bold text-blue-700">
                Welcome to your student information portal
              </h2>
              <p className="text-base lg:text-base text-slate-600 mb-6">
                Here you can view and update your personal details, address information, and educational background.
                Please ensure all information is accurate and up-to-date.
              </p>
              <PersonalInformation />
              {/* Use the new AddressInformation component */}
              <AddressInformation />
              <EducationInformation />
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