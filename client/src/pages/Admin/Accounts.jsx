import React, { useEffect, useState } from "react";
import AdminHeader from "../../components/AdminHeader";
import { BiFilter } from "react-icons/bi";
import { Link } from "react-router-dom";
import { PiArrowRightFill } from "react-icons/pi";
import { GoDotFill } from "react-icons/go";
import Layout from "../../components/Layout";
import { FaUsers } from "react-icons/fa";
import { FaUser, FaUserClock } from "react-icons/fa6";
import { RiGraduationCapFill } from "react-icons/ri";
import { FaBuildingCircleCheck } from "react-icons/fa6";
import { IoAddCircleOutline } from 'react-icons/io5';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

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

const getRoleColor = (role) => {
    switch (role.toLowerCase()) {
        case 'applicant':
            return 'bg-blue-600';
        case 'scholarship_provider':
            return 'bg-green-600';
        default:
            return 'bg-gray-500';
    }
};

const toSentenceCase = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const getAccountLink = (account) => {
    const buttonText = account.status === 'Pending Verification' ? 'Verify' : 'View Details';

    if (account.status === 'Verify Account') {
        return null; // Do not show any button if the status is "Verify Account"
    }

    if (account.role === 'applicant') {
        const route = account.status === 'Pending Verification' ? `/student-applications/${account._id}` : `/student-details/${account._id}`;
        return (
            <Link
                to={route}
                className="inline-flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-all duration-300 hover:shadow-md hover:scale-105"
            >
                {buttonText}
                <PiArrowRightFill className="ml-1 w-3 h-3" />
            </Link>
        );
    } else if (account.role === 'scholarship_provider') {
        const route = account.status === 'Pending Verification' ? `/scholarship-provider-applications/${account._id}` : `/provider-details/${account._id}`;
        return (
            <Link
                to={route}
                className="inline-flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-all duration-300 hover:shadow-md hover:scale-105"
            >
                {buttonText}
                <PiArrowRightFill className="ml-1 w-3 h-3" />
            </Link>
        );
    } else {
        return null;
    }
};

export default function Accounts() {
    useEffect(() => {
        document.title = "Accounts | HubIsko";
        window.scrollTo(0, 0);
    }, []);

    const [totalAccounts, setTotalAccounts] = useState(0);
    const [totalUnverifiedAccounts, setTotalUnverifiedAccounts] = useState(0);
    const [totalApplicants, setTotalApplicants] = useState(0);
    const [totalScholarshipProviders, setTotalScholarshipProviders] = useState(0);
    const [accounts, setAccounts] = useState([]);
    const [providers, setProviders] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {        const fetchTotalAccounts = async () => {
            try {
                const response = await fetch(`${apiUrl}/api/admin/total-accounts`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setTotalAccounts(data.totalAccounts);
            } catch (error) {
                console.error('Error fetching total accounts:', error);
            }
        };

        const fetchTotalUnverifiedAccounts = async () => {
            try {
                const response = await fetch(`${apiUrl}/api/admin/total-unverified-accounts`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setTotalUnverifiedAccounts(data.totalUnverifiedAccounts);
            } catch (error) {
                console.error('Error fetching total unverified accounts:', error);
            }
        };

        const fetchTotalApplicants = async () => {
            try {
                const response = await fetch(`${apiUrl}/api/admin/total-applicants`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setTotalApplicants(data.totalApplicants);
            } catch (error) {
                console.error('Error fetching total applicants:', error);
            }
        };

        const fetchTotalScholarshipProviders = async () => {
            try {
                const response = await fetch(`${apiUrl}/api/admin/total-scholarship-providers`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setTotalScholarshipProviders(data.totalScholarshipProviders);
            } catch (error) {
                console.error('Error fetching total scholarship providers:', error);
            }
        };

        const fetchAccounts = async () => {
            try {
                const response = await fetch(`${apiUrl}/api/admin/all-users`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setAccounts(data.users); // Update to use data.users instead of data.accounts
                setLoading(false);
            } catch (error) {
                console.error('Error fetching accounts:', error);
                setError(error);
                setLoading(false);
            }
        };

        fetchTotalApplicants();
        fetchTotalUnverifiedAccounts();
        fetchTotalAccounts();
        fetchTotalScholarshipProviders();
        fetchAccounts();
    }, []);    const totalVerifyAccount = accounts.filter(account => account.status === 'Verify Account').length;
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);    const handleFilterClick = (filter) => {
        setSelectedFilter(filter);
        setCurrentPage(1); // Reset to first page when filter changes
    };

    const toggleFilter = () => {
        setSelectedFilter(prevFilter => (prevFilter === 'Recent' ? 'Oldest' : 'Recent'));
        setCurrentPage(1); // Reset to first page when sort changes
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); // Reset to first page when search changes
    };

    const filteredAccounts = accounts.filter(account => {
        let fullName = '';
        if (account.role === 'applicant' && account.applicantDetails) {
            fullName = `${account.applicantDetails.firstName} ${account.applicantDetails.lastName}`.toLowerCase();
        } else if (account.role === 'scholarship_provider' && account.scholarshipProviderDetails) {
            fullName = account.scholarshipProviderDetails.organizationName.toLowerCase();
        } else if (account.role === 'admin') {
            fullName = `${account.adminDetails.firstName} ${account.adminDetails.lastName}`.toLowerCase();
        }

        const matchesSearchQuery = fullName.includes(searchQuery.toLowerCase()) ||
            account.email.toLowerCase().includes(searchQuery.toLowerCase());

        if (!matchesSearchQuery) return false;

        switch (selectedFilter) {
            case 'Pending':
                return account.status === 'Pending Verification';
            case 'Verified Students':
                return account.role === 'applicant' && account.status === 'Verified';
            case 'Verified Scholarship Providers':
                return account.role === 'scholarship_provider' && account.status === 'Verified';
            case 'Verify Account':
                return account.status === 'Verify Account';
            default:
                return true;
        }
    }).sort((a, b) => {
        if (selectedFilter === 'Recent') {
            return new Date(b.createdAt) - new Date(a.createdAt);
        } else if (selectedFilter === 'Oldest') {
            return new Date(a.createdAt) - new Date(b.createdAt);
        }        return 0;
    });

    // Pagination logic
    const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentAccounts = filteredAccounts.slice(startIndex, endIndex);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex justify-center items-center">
                <div className="text-center">
                    <div className="bg-white p-8 rounded-2xl shadow-lg border border-blue-100">
                        <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                        </svg>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Loading Accounts</h3>
                        <p className="text-gray-500">Please wait while we fetch the data...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex justify-center items-center">
                <div className="text-center">
                    <div className="bg-white p-8 rounded-2xl shadow-lg border border-red-200">
                        <div className="bg-red-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-red-700 mb-2">Error Loading Data</h3>
                        <p className="text-red-600">Error: {error.message}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
            <main className="flex-grow">                {/* Header Section */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
                    <div className="max-w-7xl mx-auto px-6 py-8">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <h1 className="text-3xl font-bold mb-2">Account Management</h1>
                                <p className="text-blue-100 text-base font-medium">
                                    Comprehensive user account oversight and verification system
                                </p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                                <FaUser className="text-white text-4xl" />
                            </div>
                        </div>
                    </div>
                </div>                {/* Statistics Cards */}
                <div className="max-w-7xl mx-auto px-6 -mt-6 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white rounded-xl shadow-md border border-blue-100 p-4 hover:shadow-lg transition-all duration-300 hover:scale-102">
                            <div className="flex items-center justify-between mb-3">
                                <div className="bg-blue-100 p-2 rounded-lg">
                                    <FaUsers className="w-5 h-5 text-blue-600" />
                                </div>
                                <div className="text-right">
                                    <p className="text-blue-600 font-medium text-xs uppercase tracking-wide">Total Accounts</p>
                                </div>
                            </div>
                            <div className="text-2xl font-bold text-gray-800 mb-2">{totalAccounts}</div>
                            <div className="flex items-center text-green-600 text-xs">
                                <span className="bg-green-100 px-2 py-1 rounded-full">Active</span>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-md border border-blue-100 p-4 hover:shadow-lg transition-all duration-300 hover:scale-102">
                            <div className="flex items-center justify-between mb-3">
                                <div className="bg-yellow-100 p-2 rounded-lg">
                                    <FaUserClock className="w-5 h-5 text-yellow-600" />
                                </div>
                                <div className="text-right">
                                    <p className="text-yellow-600 font-medium text-xs uppercase tracking-wide">Pending Verification</p>
                                </div>
                            </div>
                            <div className="text-2xl font-bold text-gray-800 mb-2">{totalUnverifiedAccounts}</div>
                            <div className="flex items-center text-yellow-600 text-xs">
                                <span className="bg-yellow-100 px-2 py-1 rounded-full">Awaiting Review</span>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-md border border-blue-100 p-4 hover:shadow-lg transition-all duration-300 hover:scale-102">
                            <div className="flex items-center justify-between mb-3">
                                <div className="bg-green-100 p-2 rounded-lg">
                                    <RiGraduationCapFill className="w-5 h-5 text-green-600" />
                                </div>
                                <div className="text-right">
                                    <p className="text-green-600 font-medium text-xs uppercase tracking-wide">Students</p>
                                </div>
                            </div>
                            <div className="text-2xl font-bold text-gray-800 mb-2">{totalApplicants}</div>
                            <div className="flex items-center text-green-600 text-xs">
                                <span className="bg-green-100 px-2 py-1 rounded-full">Registered</span>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-md border border-blue-100 p-4 hover:shadow-lg transition-all duration-300 hover:scale-102">
                            <div className="flex items-center justify-between mb-3">
                                <div className="bg-purple-100 p-2 rounded-lg">
                                    <FaBuildingCircleCheck className="w-5 h-5 text-purple-600" />
                                </div>
                                <div className="text-right">
                                    <p className="text-purple-600 font-medium text-xs uppercase tracking-wide">Providers</p>
                                </div>
                            </div>
                            <div className="text-2xl font-bold text-gray-800 mb-2">{totalScholarshipProviders}</div>
                            <div className="flex items-center text-purple-600 text-xs">
                                <span className="bg-purple-100 px-2 py-1 rounded-full">Organizations</span>
                            </div>
                        </div>
                    </div>
                </div>                {/* Accounts Management Section */}
                <div className="max-w-7xl mx-auto px-6 py-8">
                    {/* Filter and Search Controls */}
                    <div className="bg-white rounded-xl shadow-md border border-blue-100 p-4 mb-6">
                        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => handleFilterClick('All')}
                                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${selectedFilter === 'All'
                                        ? 'bg-blue-600 text-white shadow-md transform scale-105'
                                        : 'bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200'
                                        }`}
                                >
                                    All Accounts <span className="ml-1 bg-white/20 px-2 py-0.5 rounded-full text-xs">({accounts.length})</span>
                                </button>
                                <button
                                    onClick={() => handleFilterClick('Verify Account')}
                                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${selectedFilter === 'Verify Account'
                                        ? 'bg-gray-600 text-white shadow-md transform scale-105'
                                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                                        }`}
                                >
                                    Verify Account <span className="ml-1 bg-white/20 px-2 py-0.5 rounded-full text-xs">({totalVerifyAccount})</span>
                                </button>
                                <button
                                    onClick={() => handleFilterClick('Pending')}
                                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${selectedFilter === 'Pending'
                                        ? 'bg-yellow-500 text-white shadow-md transform scale-105'
                                        : 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100 border border-yellow-200'
                                        }`}
                                >
                                    Pending <span className="ml-1 bg-white/20 px-2 py-0.5 rounded-full text-xs">({accounts.filter(account => account.status === 'Pending Verification').length})</span>
                                </button>
                                <button
                                    onClick={() => handleFilterClick('Verified Students')}
                                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${selectedFilter === 'Verified Students'
                                        ? 'bg-green-600 text-white shadow-md transform scale-105'
                                        : 'bg-green-50 text-green-600 hover:bg-green-100 border border-green-200'
                                        }`}
                                >
                                    Students <span className="ml-1 bg-white/20 px-2 py-0.5 rounded-full text-xs">({accounts.filter(account => account.role === 'applicant' && account.status === 'Verified').length})</span>
                                </button>
                                <button
                                    onClick={() => handleFilterClick('Verified Scholarship Providers')}
                                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${selectedFilter === 'Verified Scholarship Providers'
                                        ? 'bg-purple-600 text-white shadow-md transform scale-105'
                                        : 'bg-purple-50 text-purple-600 hover:bg-purple-100 border border-purple-200'
                                        }`}
                                >
                                    Providers <span className="ml-1 bg-white/20 px-2 py-0.5 rounded-full text-xs">({accounts.filter(account => account.role === 'scholarship_provider' && account.status === 'Verified').length})</span>
                                </button>
                            </div>                            <div className="flex gap-3">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search accounts..."
                                        className="w-64 pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm"
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                    />
                                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <select
                                    value={itemsPerPage}
                                    onChange={handleItemsPerPageChange}
                                    className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm bg-white"
                                >
                                    <option value={5}>5 per page</option>
                                    <option value={10}>10 per page</option>
                                    <option value={25}>25 per page</option>
                                    <option value={50}>50 per page</option>
                                </select>
                                <button
                                    onClick={toggleFilter}
                                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 hover:shadow-md"
                                >
                                    <BiFilter className="w-4 h-4" />
                                    <span>{selectedFilter === 'Recent' ? 'Recent' : 'Oldest'}</span>
                                </button>
                            </div>
                        </div>
                    </div>                    {/* Accounts Table */}
                    <div className="bg-white rounded-xl shadow-md border border-blue-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                                    <tr>
                                        <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider">User</th>
                                        <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider">Email</th>
                                        <th className="py-3 px-4 text-center text-xs font-semibold uppercase tracking-wider">Role</th>
                                        <th className="py-3 px-4 text-center text-xs font-semibold uppercase tracking-wider">Status</th>
                                        <th className="py-3 px-4 text-center text-xs font-semibold uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>                                <tbody className="divide-y divide-gray-100">
                                    {currentAccounts && currentAccounts.length > 0 ? (
                                        currentAccounts.map((account, index) => {
                                            let fullName = 'N/A';
                                            if (account.role === 'applicant' && account.applicantDetails) {
                                                fullName = `${account.applicantDetails.firstName} ${account.applicantDetails.lastName}`;
                                            } else if (account.role === 'scholarship_provider' && account.scholarshipProviderDetails) {
                                                fullName = account.scholarshipProviderDetails.organizationName;
                                            } else if (account.role === 'admin') {
                                                fullName = `${account.adminDetails.firstName} ${account.adminDetails.lastName}`;
                                            }

                                            return (
                                                <tr key={account._id} className={`hover:bg-blue-50 transition-all duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                                                    <td className="py-3 px-4">
                                                        <div className="flex items-center">
                                                            <div className="relative">
                                                                <img
                                                                    src={account.profilePicture}
                                                                    alt={fullName}
                                                                    className="w-9 h-9 rounded-full object-cover border-2 border-blue-200 shadow-sm"
                                                                />
                                                                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                                                            </div>
                                                            <div className="ml-3">
                                                                <div className="text-sm font-semibold text-gray-900">{fullName}</div>
                                                                <div className="text-xs text-gray-500">
                                                                    {account.role === 'applicant' ? 'Student' :
                                                                        account.role === 'scholarship_provider' ? 'Organization' :
                                                                            toSentenceCase(account.role)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <div className="text-sm text-gray-900">{account.email}</div>
                                                        <div className="text-xs text-gray-500">
                                                            Joined {new Date(account.createdAt).toLocaleDateString()}
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4 text-center">
                                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getRoleColor(account.role)} text-white`}>
                                                            {account.role === 'applicant' ? 'Student' :
                                                                account.role === 'scholarship_provider' ? 'Provider' :
                                                                    toSentenceCase(account.role)}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4 text-center">
                                                        <div className="flex items-center justify-center">
                                                            <span className={`inline-block w-2.5 h-2.5 mr-2 rounded-full ${getStatusColor(account.status)}`}></span>
                                                            <span className="text-sm font-medium text-gray-700">
                                                                {toSentenceCase(account.status)}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4 text-center">
                                                        <div className="flex justify-center">
                                                            {getAccountLink(account)}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="py-8 text-center">
                                                <div className="flex flex-col items-center">
                                                    <div className="bg-gray-100 p-6 rounded-full mb-3">
                                                        <FaUsers className="w-8 h-8 text-gray-400" />
                                                    </div>
                                                    <h3 className="text-base font-semibold text-gray-600 mb-2">No accounts found</h3>
                                                    <p className="text-sm text-gray-500">Try adjusting your search or filter criteria</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>                            </table>
                        </div>
                    </div>

                    {/* Pagination Controls */}
                    {filteredAccounts.length > 0 && (
                        <div className="bg-white rounded-xl shadow-md border border-blue-100 p-4 mt-4">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                {/* Results info */}
                                <div className="text-sm text-gray-600">
                                    Showing {startIndex + 1} to {Math.min(endIndex, filteredAccounts.length)} of {filteredAccounts.length} accounts
                                </div>

                                {/* Pagination buttons */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                                            currentPage === 1
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200'
                                        }`}
                                    >
                                        Previous
                                    </button>

                                    {/* Page numbers */}
                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                            let pageNumber;
                                            if (totalPages <= 5) {
                                                pageNumber = i + 1;
                                            } else if (currentPage <= 3) {
                                                pageNumber = i + 1;
                                            } else if (currentPage >= totalPages - 2) {
                                                pageNumber = totalPages - 4 + i;
                                            } else {
                                                pageNumber = currentPage - 2 + i;
                                            }

                                            return (
                                                <button
                                                    key={pageNumber}
                                                    onClick={() => handlePageChange(pageNumber)}
                                                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-all duration-300 ${
                                                        currentPage === pageNumber
                                                            ? 'bg-blue-600 text-white shadow-md'
                                                            : 'bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200'
                                                    }`}
                                                >
                                                    {pageNumber}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                                            currentPage === totalPages
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200'
                                        }`}
                                    >
                                        Next
                                    </button>
                                </div>

                                {/* Quick jump to page */}
                                {totalPages > 5 && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="text-gray-600">Go to page:</span>
                                        <input
                                            type="number"
                                            min="1"
                                            max={totalPages}
                                            value={currentPage}
                                            onChange={(e) => {
                                                const page = parseInt(e.target.value);
                                                if (page >= 1 && page <= totalPages) {
                                                    handlePageChange(page);
                                                }
                                            }}
                                            className="w-16 px-2 py-1 border border-gray-200 rounded text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                        <span className="text-gray-600">of {totalPages}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}