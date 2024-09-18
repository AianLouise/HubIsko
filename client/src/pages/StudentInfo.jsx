import React from "react";
import { useSelector } from 'react-redux';
import Header from "../components/Header";
import Footer from "../components/Footer";
import AccountManagement from "./AccountManagement";
import { Link } from "react-router-dom";
import PersonalInformation from "../components/StudentInfo/EditPersonalInformation";
import AddressInformation from "../components/StudentInfo/AddressInformation"; // Import the new component
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
              {/* Use the new AddressInformation component */}
              <AddressInformation />
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
