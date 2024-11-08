import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BiFilter } from "react-icons/bi";
import { PiArrowRightFill } from "react-icons/pi";
import { GoDotFill } from "react-icons/go";
import { BsInboxFill } from "react-icons/bs";
import { FaUserGraduate, FaUniversity } from "react-icons/fa";

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

  const [activityLogs, setActivityLogs] = useState([]);

  useEffect(() => {
    const fetchActivityLogs = async () => {
      try {
        const response = await fetch('/api/activity/activity-logs'); // Adjust the endpoint as necessary
        const data = await response.json();
        const filteredLogs = Array.isArray(data) ? data.filter(log =>
          log.action === 'APPROVE_SCHOLARSHIP_PROVIDER' ||
          log.action === 'APPROVE_STUDENT' ||
          log.action === 'SIGNUP_PROVIDER' ||
          log.action === 'CREATE'
        ) : [];
        setActivityLogs(filteredLogs); // Ensure data is an array
      } catch (error) {
        console.error('Error fetching activity logs:', error);
      }
    };

    fetchActivityLogs();
  }, []);

  const getUserDisplayName = (user) => {
    if (!user) return 'N/A';
    if (user.applicantDetails?.firstName || user.applicantDetails?.lastName || user.applicantDetails?.middleName) {
      const middleInitial = user.applicantDetails.middleName ? `${user.applicantDetails.middleName.charAt(0)}.` : '';
      return `${user.applicantDetails.lastName || ''}, ${user.applicantDetails.firstName || ''} ${middleInitial}`.trim();
    }
    if (user.scholarshipProviderDetails?.organizationName) return user.scholarshipProviderDetails.organizationName;
    return user.username || 'N/A';
  };

  const formatDetails = (log) => {
    switch (log.action) {
      case 'APPROVE_SCHOLARSHIP_PROVIDER':
        return `Scholarship provider successfully verified by admin: ${getUserDisplayName(log.userId)}`;
      case 'APPROVE_STUDENT':
        return `Student successfully verified by admin: ${getUserDisplayName(log.userId)}`;
      case 'SIGNUP_PROVIDER':
        return `New provider created an account and applied for verification: ${getUserDisplayName(log.userId)}`;
      case 'CREATE':
        return `Student passed an application to be verified: ${getUserDisplayName(log.userId)}`;
      default:
        return log.action;
    }
  };

  const isNewLog = (timestamp) => {
    const logDate = new Date(timestamp);
    const currentDate = new Date();
    const timeDifference = currentDate - logDate;
    const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
    return timeDifference < oneDayInMilliseconds;
  };

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

  // Sort activity logs to show new notifications on top
  const sortedActivityLogs = [...activityLogs].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return (
    <div className="flex flex-col min-h-screen font-medium text-slate-700">
      <main className="flex-grow bg-[#f8f8fb]">
        <div className="border-b mb-8 bg-white">
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
              {/* <div className="flex gap-1">
                <span className="bg-blue-600 p-3 rounded-full w-4 h-4 text-white flex justify-center items-center">
                  {sortedActivityLogs.length}
                </span>{" "}
                unread notification
              </div> */}
              {/* <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Search in the inbox..."
                  className="border border-gray-300 rounded-md p-2 pr-8"
                />
                <button className="bg-blue-600 px-4 py-2 rounded-md flex gap-2 text-white">
                  <BiFilter className="w-6 h-6" />
                  <span>Filter</span>
                </button>
              </div> */}
            </div>
            <div className="bg-white border rounded-md mt-4 divide-y">
              {sortedActivityLogs.map((log) => (
                <div className="flex justify-between items-center p-4 hover:bg-slate-200 group transition ease-in-out">
                  <div className="flex items-center gap-4">
                    <img
                      src={log.userId?.profilePicture}
                      alt="Profile"
                      className="bg-white w-14 h-14 rounded-full object-cover"
                    />
                    <div className="gap-2 flex flex-col">
                      <span className="font-bold">{getUserDisplayName(log.userId)}</span>
                      <span className="text-slate-500">{formatDetails(log)}</span>
                      <span className="text-slate-500 text-sm flex items-center gap-2">
                        {isNewLog(log.timestamp) && (
                          <>
                            <span className="text-blue-600"> New </span>{" "}
                            <GoDotFill className="text-blue-600" />
                          </>
                        )}
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}