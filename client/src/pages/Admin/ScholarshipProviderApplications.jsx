import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GoDotFill } from "react-icons/go";
import { BiFilter } from "react-icons/bi";
import Layout from "../../components/Layout";
import { FaFileAlt, FaUniversity } from "react-icons/fa";

const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
        case 'pending verification':
            return 'bg-yellow-500';
        case 'verified':
            return 'bg-green-600';
        case 'rejected':
            return 'bg-red-500';
        default:
            return 'bg-gray-500';
    }
};

const toSentenceCase = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export default function ScholarshipProviderApplications() {
    useEffect(() => {
        document.title = "Scholarship Provider Applications | HubIsko";
    }, []);
    const [providers, setProviders] = useState([]);

    const fetchPendingApprovalProviders = async () => {
        try {
            const response = await fetch("/api/admin/search-pending-verification-providers");
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setProviders(data);
        } catch (error) {
            console.error("Error fetching pending approval providers:", error);
        }
    };

    useEffect(() => {
        fetchPendingApprovalProviders();
    }, []);

    return (
        <div className="flex flex-col min-h-screen font-medium text-slate-700">
            <main className="flex-grow bg-[#f8f8fb]">
                <div className="border-b mb-8">
                    <div className="flex items-center justify-between px-6 lg:px-24 mx-auto">
                        <div className="flex flex-col gap-2 w-full lg:w-1/2">
                            <h1 className="text-3xl lg:text-4xl font-bold text-gray-800">
                                Scholarship Provider Applications
                            </h1>
                            <p className="text-lg text-gray-600">
                                Review and manage scholarship provider applications.
                            </p>
                        </div>
                        <div className="bg-blue-600 w-24 h-24 lg:w-36 lg:h-36 my-8 rounded-md flex items-center justify-center">
                            <FaFileAlt className="text-white text-4xl lg:text-6xl" />
                        </div>
                    </div>
                </div>

                <div className="max-w-8xl mx-auto px-6 lg:px-24 flex flex-col gap-10">
                    <div className="flex flex-col lg:flex-row gap-10">
                        <div className="flex flex-col justify-center items-center w-full lg:w-1/3 h-[200px] lg:h-[300px] bg-white shadow rounded-md p-6">
                            <div className="flex flex-col justify-center items-center h-full text-center">
                                <h2 className="text-3xl lg:text-4xl font-semibold text-slate-600">
                                    Pending Applications
                                </h2>
                                <span className="text-5xl lg:text-6xl font-bold text-blue-600 mt-2">
                                    {providers.length}
                                </span>
                            </div>
                        </div>

                        <div className="w-full bg-white rounded-md shadow border">
                            <h1 className="p-4 border-b text-lg font-semibold">
                                Scholarship Provider Activities
                            </h1>
                            <div className="grid divide-y">
                                <div className="flex justify-between items-center p-4">
                                    <div className="flex">
                                        <div className="bg-blue-600 w-10 h-10 rounded-full"></div>
                                        <div className="flex flex-col ml-4">
                                            <h1 className="text-lg font-semibold">DepEd</h1>
                                            <p className="text-slate-500">Posted a Scholarship</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <GoDotFill className="text-blue-600" />
                                        <span className="text-blue-600">1 hour ago</span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center p-4">
                                    <div className="flex">
                                        <div className="bg-blue-600 w-10 h-10 rounded-full"></div>
                                        <div className="flex flex-col ml-4">
                                            <h1 className="text-lg font-semibold">DepEd</h1>
                                            <p className="text-slate-500">Received 3 new Applications</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <GoDotFill className="text-blue-600" />
                                        <span className="text-blue-600">1 hour ago</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 h-screen pt-5">
                        <h1 className="text-xl font-semibold border-b pb-4">Scholarship Providers</h1>
                        <div className="flex gap-4 mt-5">
                            <input
                                type="text"
                                placeholder="Search for a provider"
                                className="border rounded-md p-2 flex-grow"
                            />
                            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-800 text-white p-2 rounded-md">
                                <BiFilter className="w-6 h-6" />
                                <span>Filter</span>
                            </button>
                        </div>

                        <table className="w-full mt-4 border border-gray-200 bg-white rounded-lg">
                            <thead className="bg-slate-100 rounded-t-lg">
                                <tr>
                                    <th className="border border-gray-200 p-2">Organization Name</th>
                                    <th className="border border-gray-200 p-2">Organization Type</th>
                                    <th className="border border-gray-200 p-2">Email</th>
                                    <th className="border border-gray-200 p-2">Contact Person</th>
                                    <th className="border border-gray-200 p-2">Position</th>
                                    <th className="border border-gray-200 p-2">Contact Number</th>
                                    <th className="border border-gray-200 p-2">Status</th>
                                    <th className="border border-gray-200 p-2">Details</th>
                                </tr>
                            </thead>
                            <tbody className="text-center rounded-b-lg">
                                {providers.length === 0 ? (
                                    <tr>
                                        <td colSpan="10" className="p-4">
                                            <div className="flex justify-center items-center h-32">
                                                <span className="text-xl font-semibold">No scholarship provider application found.</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    providers.map((provider) => (
                                        <tr key={provider._id} className="divide-x hover:bg-gray-100">
                                            <td className="p-2">
                                                <div className="flex gap-2 items-center">
                                                    <img src={provider.profilePicture} alt="Profile" className="rounded-full h-6 w-6" />
                                                    {provider.scholarshipProviderDetails.organizationName}
                                                </div>
                                            </td>
                                            <td className="p-2">{provider.scholarshipProviderDetails.organizationType}</td>
                                            <td className="p-2">{provider.email}</td>
                                            <td className="p-2">{provider.scholarshipProviderDetails.contactPersonName}</td>
                                            <td className="p-2">{provider.scholarshipProviderDetails.contactPersonPosition}</td>
                                            <td className="p-2">{provider.scholarshipProviderDetails.contactPersonNumber}</td>
                                            <td className="p-4">
                                                <span className={`inline-block w-3 h-3 mr-2 rounded-full ${getStatusColor(provider.status)}`}></span>
                                                {toSentenceCase(provider.status)}
                                            </td>
                                            <td className="p-4">
                                                <Link
                                                    to={`/scholarship-provider-applications/${provider._id}`}
                                                    className="bg-blue-600 hover:bg-blue-800 px-4 py-2 rounded-md text-white"
                                                >
                                                    Verify
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                        <div className="mt-8"></div> {/* Added space after the table */}
                    </div>
                </div>
            </main>
        </div>
    );
}