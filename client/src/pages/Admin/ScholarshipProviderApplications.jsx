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
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredProviders, setFilteredProviders] = useState([]);

    const fetchPendingApprovalProviders = async () => {
        try {
            const response = await fetch("/api/admin/search-pending-verification-providers");
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setProviders(data);
            setFilteredProviders(data); // Initialize filteredProviders with fetched data
        } catch (error) {
            console.error("Error fetching pending approval providers:", error);
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchPendingApprovalProviders();
    }, []);

    const [sortOrder, setSortOrder] = useState('recent');

    const handleSort = (order) => {
        setSortOrder(order);
    };

    useEffect(() => {
        // Filter providers based on search query
        const lowercasedQuery = searchQuery.toLowerCase();
        const filtered = providers.filter(provider =>
            provider.scholarshipProviderDetails.organizationName.toLowerCase().includes(lowercasedQuery) ||
            provider.email.toLowerCase().includes(lowercasedQuery)
        );

        // Sort filtered providers based on sortOrder
        const sorted = filtered.sort((a, b) => {
            if (sortOrder === 'oldest') {
                return new Date(b.createdAt) - new Date(a.createdAt);
            } else {
                return new Date(a.createdAt) - new Date(b.createdAt);
            }
        });

        setFilteredProviders(sorted);
    }, [searchQuery, providers, sortOrder]);

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
                        <div className="bg-blue-600 w-44 h-44 lg:w-44 lg:h-44 my-8 rounded-md flex items-center justify-center">
                            <div className="flex flex-col lg:flex-row gap-10">
                                <div className="flex flex-col justify-center items-center h-full text-center">
                                    <h2 className="text-sm lg:text-2xl font-semibold text-white">
                                        Pending Applications
                                    </h2>
                                    <span className="text-xl lg:text-3xl font-bold text-white mt-2">
                                        {providers.length}
                                    </span>
                                    <p className="text-base text-white mt-2">
                                        Applications awaiting review
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-8xl mx-auto px-6 lg:px-24 flex flex-col gap-10">

                    <div className="flex flex-col gap-4 h-screen pt-5">
                        <h1 className="text-xl font-semibold border-b pb-4">Scholarship Providers</h1>
                        <div className="flex gap-4 mt-5">
                            <input
                                type="text"
                                placeholder="Search for a provider"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="border rounded-md p-2 flex-grow"
                            />
                            <button
                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-800 text-white p-2 rounded-md"
                                onClick={() => handleSort(sortOrder === 'recent' ? 'oldest' : 'recent')}
                            >
                                <BiFilter className="w-6 h-6" />
                                <span>{sortOrder === 'recent' ? 'Oldest' : 'Recent'}</span>
                            </button>
                        </div>

                        <table className="w-full mt-4 border border-gray-200 bg-white rounded-lg shadow-md text-center">
                            <thead className="bg-slate-100">
                                <tr>
                                    <th className="border border-gray-200 p-2">Organization Name</th>
                                    <th className="border border-gray-200 p-2">Organization Type</th>
                                    <th className="border border-gray-200 p-2">Email</th>
                                    <th className="border border-gray-200 p-2">Status</th>
                                    <th className="border border-gray-200 p-2">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProviders.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="p-4">
                                            <div className="flex justify-center items-center h-32">
                                                <span className="text-xl font-semibold">No scholarship provider application found.</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredProviders.map((provider) => (
                                        <tr key={provider._id} className="hover:bg-gray-100">
                                            <td className="p-2">
                                                <div className="flex gap-2 items-center justify-center">
                                                    <img src={provider.profilePicture} alt="Profile" className="rounded-full h-6 w-6" />
                                                    {provider.scholarshipProviderDetails.organizationName}
                                                </div>
                                            </td>
                                            <td className="p-2">{provider.scholarshipProviderDetails.organizationType}</td>
                                            <td className="p-2">{provider.email}</td>
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
