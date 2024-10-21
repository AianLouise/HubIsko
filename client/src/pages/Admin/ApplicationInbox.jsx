import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BiFilter } from "react-icons/bi";
import { PiArrowRightFill } from "react-icons/pi";
import { GoDotFill } from "react-icons/go";
import Layout from "../../components/Layout";
import { BiRightArrowAlt } from "react-icons/bi";
import { BsInboxFill } from "react-icons/bs";
import { FaGraduationCap, FaUserGraduate } from "react-icons/fa6";
import { FaUniversity } from "react-icons/fa";

export default function ApplicationInbox() {
  useEffect(() => {
    document.title = "Application Inbox | HubIsko";
  }, []);

  const [pendingProviders, setPendingProviders] = useState(0);
  const [pendingStudents, setPendingStudents] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {

        // Fetch total number of pending providers
        const pendingProvidersResponse = await fetch('/api/adminApp/search-pending-verification-providers');
        const pendingProvidersData = await pendingProvidersResponse.json();
        setPendingProviders(pendingProvidersData.length);

        // Fetch total number of pending students
        const pendingStudentsResponse = await fetch('/api/adminApp/search-pending-verification-students');
        const pendingStudentsData = await pendingStudentsResponse.json();
        setPendingStudents(pendingStudentsData.length);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <svg
          className="animate-spin h-10 w-10 text-blue-600"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          ></path>
        </svg>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen font-medium text-slate-700">

      <main className="flex-grow bg-[#f8f8fb]">
        <div className="border-b mb-8">
          <div className="flex items-center mx-auto justify-between px-24">
            <div className="flex flex-col gap-2 w-1/2">
              <h1 className="text-4xl font-bold text-gray-800">Application Inbox</h1>
              <p className="text-lg text-slate-500 font-medium">
                Manage student and scholarship provider applications.
              </p>
            </div>
            <div className="bg-blue-600 w-24 h-24 lg:w-36 lg:h-36 my-8 rounded-md flex items-center justify-center">
              <BsInboxFill className="text-white text-4xl lg:text-6xl" />
            </div>
          </div>
        </div>
        <div className="max-w-8xl mx-auto px-24 gap-10 flex-col flex">
          <div className="grid grid-cols-1 md:grid-cols-2 justify-items-center max-w-4xl mx-auto gap-10">
            <Link
              to="/student-applications"
              className="bg-white text-blue-600 rounded-md shadow-lg p-6 w-96 flex flex-col justify-center items-center hover:bg-blue-600 hover:text-white hover:-translate-y-2 transition ease-in-out"
            >
              <FaUserGraduate className="text-4xl mb-2" />
              <span className="text-lg font-semibold">Student Applications</span>
              <span className="text-4xl font-bold">{pendingStudents}</span>
              <span className="text-sm flex items-center mt-2 font-normal">
                Click to view the list of applications for students
              </span>
            </Link>

            <Link
              to="/scholarship-provider-applications"
              className="bg-white text-blue-600 rounded-md shadow-lg p-6 w-96 flex flex-col justify-center items-center hover:bg-blue-600 hover:text-white hover:-translate-y-2 transition ease-in-out"
            >
              <FaUniversity className="text-4xl mb-2" />
              <span className="text-lg font-semibold">Scholarship Provider Applications</span>
              <span className="text-4xl font-bold">{pendingProviders}</span>
              <span className="text-sm flex items-center mt-2 font-normal">
                Click to view the list of applications for scholarship provider
              </span>
            </Link>
          </div>

          {/* Activity Section */}
          <div className="flex flex-col mt-10 mb-10">
            <span className="font-bold text-xl border-b w-full pb-2">
              Recent Activity
            </span>
            <div className="flex items-center justify-between mt-4">
              <div className="flex gap-1">
                <span className="bg-blue-600 p-3 rounded-full w-4 h-4 text-white flex justify-center items-center">
                  1
                </span>{" "}
                unread notification
              </div>
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Search in the inbox..."
                  className="border border-gray-300 rounded-md p-2 pr-8"
                />
                <button className="bg-blue-600 px-4 py-2 rounded-md flex gap-2 text-white">
                  <BiFilter className="w-6 h-6" />
                  <span>Filter</span>
                </button>
              </div>
            </div>
            <div className="bg-white border rounded-md mt-4 divide-y">
              <Link
                to={"/scholarships-data-details"}
                className="flex justify-between items-center p-4 hover:bg-slate-200 group transition ease-in-out"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-blue-600 w-14 h-14 rounded-full"></div>
                  <div className="gap-2 flex flex-col">
                    <div className="flex gap-2">
                      <span className="font-bold">DepEd</span>
                      <span className="text-slate-500">
                        Posted a new Scholarship Program
                      </span>
                    </div>
                    <span className="text-slate-500 text-sm flex items-center gap-2">
                      <span className="text-blue-600"> New </span>{" "}
                      <GoDotFill className="text-blue-600" /> 2 hours ago
                    </span>
                  </div>
                </div>
                <div className="group-hover:flex justify-end items-center gap-2 text-blue-600 hidden">
                  <span className="text-xl">View</span>
                  <PiArrowRightFill className="w-6 h-6" />
                </div>
              </Link>
              <div className="flex justify-between items-center p-4 hover:bg-slate-200 group transition ease-in-out">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-600 w-14 h-14 rounded-full"></div>
                  <div className="gap-2 flex flex-col">
                    <div className="flex gap-2">
                      <span className="font-bold">John Doe</span>
                      <span className="text-slate-500">
                        Requested a Verification
                      </span>
                    </div>
                    <span className="text-slate-500 text-sm">2 hours ago</span>
                  </div>
                </div>
                <div className="group-hover:flex justify-end items-center gap-2 text-blue-600 hidden">
                  <span className="text-xl">View</span>
                  <PiArrowRightFill className="w-6 h-6" />
                </div>
              </div>
              <div className="flex justify-between items-center p-4 hover:bg-slate-200 group transition ease-in-out">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-600 w-14 h-14 rounded-full"></div>
                  <div className="gap-2 flex flex-col">
                    <div className="flex gap-2">
                      <span className="font-bold">Jane Smith</span>
                      <span className="text-slate-500">
                        Sent a scholarship application to{" "}
                        <span className="text-blue-600">DepEd</span>
                      </span>
                    </div>
                    <span className="text-slate-500 text-sm">3 hours ago</span>
                  </div>
                </div>
                <div className="group-hover:flex justify-end items-center gap-2 text-blue-600 hidden">
                  <span className="text-xl">View</span>
                  <PiArrowRightFill className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}