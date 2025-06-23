import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GoDotFill } from "react-icons/go";
import { BiFilter } from "react-icons/bi";
import Layout from "../../components/Layout";
import { FaFileAlt, FaUsers, FaClipboardCheck } from "react-icons/fa";
import { PiArrowRightFill } from "react-icons/pi";
import { MdPendingActions } from "react-icons/md";

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

const toSentenceCase = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export default function StudentApplications() {
    useEffect(() => {
        document.title = "Student Applications | HubIsko";
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
    });    const [students, setStudents] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [sortOrder, setSortOrder] = useState('recent');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [loading, setLoading] = useState(true);

    const fetchPendingApprovalStudents = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${apiUrl}/api/adminApp/search-pending-verification-students`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setStudents(data);
            setFilteredStudents(data);
        } catch (error) {
            console.error("Error fetching pending approval students:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingApprovalStudents();
    }, []);    const handleSort = (order) => {
        setSortOrder(order);
        setCurrentPage(1);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };    useEffect(() => {
        // Filter students based on search query
        const lowercasedQuery = searchQuery.toLowerCase();
        const filtered = students.filter(student =>
        (student.applicantDetails.firstName.toLowerCase().includes(lowercasedQuery) ||
            student.applicantDetails.lastName.toLowerCase().includes(lowercasedQuery) ||
            student.email.toLowerCase().includes(lowercasedQuery))
        );

        // Sort filtered students based on sortOrder
        const sorted = filtered.sort((a, b) => {
            if (sortOrder === 'oldest') {
                return new Date(b.createdAt) - new Date(a.createdAt);
            } else {
                return new Date(a.createdAt) - new Date(b.createdAt);
            }
        });

        setFilteredStudents(sorted);
    }, [searchQuery, students, sortOrder]);

    // Pagination logic
    const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentStudents = filteredStudents.slice(startIndex, endIndex);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex justify-center items-center">
                <div className="text-center">
                    <div className="bg-white p-8 rounded-2xl shadow-lg border border-blue-100">
                        <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                        </svg>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Loading Applications</h3>
                        <p className="text-gray-500">Please wait while we fetch the data...</p>
                    </div>
                </div>
            </div>
        );
    }    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
            <main className="flex-grow">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
                    <div className="max-w-7xl mx-auto px-6 py-8">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <h1 className="text-3xl font-bold mb-2">Student Applications</h1>
                                <p className="text-blue-100 text-base font-medium">
                                    Review and verify pending student applications
                                </p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                                <MdPendingActions className="text-white text-4xl" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Statistics Card */}
                <div className="max-w-7xl mx-auto px-6 -mt-6 relative z-10">
                    <div className="bg-white rounded-xl shadow-md border border-blue-100 p-4 hover:shadow-lg transition-all duration-300 hover:scale-102 max-w-xs">
                        <div className="flex items-center justify-between mb-3">
                            <div className="bg-yellow-100 p-2 rounded-lg">
                                <FaClipboardCheck className="w-5 h-5 text-yellow-600" />
                            </div>
                            <div className="text-right">
                                <p className="text-yellow-600 font-medium text-xs uppercase tracking-wide">Pending Applications</p>
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-gray-800 mb-2">{students.length}</div>
                        <div className="flex items-center text-yellow-600 text-xs">
                            <span className="bg-yellow-100 px-2 py-1 rounded-full">Awaiting Review</span>
                        </div>
                    </div>
                </div>

                {/* Applications Management Section */}
                <div className="max-w-7xl mx-auto px-6 py-8">
                    {/* Filter and Search Controls */}
                    <div className="bg-white rounded-xl shadow-md border border-blue-100 p-4 mb-6">
                        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                            <div className="flex items-center gap-4">
                                <h2 className="text-lg font-semibold text-gray-800">Application Queue</h2>
                            </div>

                            <div className="flex gap-3">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search applications..."
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
                                    onClick={() => handleSort(sortOrder === 'recent' ? 'oldest' : 'recent')}
                                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 hover:shadow-md"
                                >
                                    <BiFilter className="w-4 h-4" />
                                    <span>{sortOrder === 'recent' ? 'Oldest' : 'Recent'}</span>
                                </button>
                            </div>
                        </div>
                    </div>                    {/* Applications Table */}
                    <div className="bg-white rounded-xl shadow-md border border-blue-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                                    <tr>
                                        <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider">Student</th>
                                        <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider">Email</th>
                                        <th className="py-3 px-4 text-center text-xs font-semibold uppercase tracking-wider">Contact</th>
                                        <th className="py-3 px-4 text-center text-xs font-semibold uppercase tracking-wider">Status</th>
                                        <th className="py-3 px-4 text-center text-xs font-semibold uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {currentStudents && currentStudents.length > 0 ? (
                                        currentStudents.map((student, index) => (
                                            <tr key={student._id} className={`hover:bg-blue-50 transition-all duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center">
                                                        <div className="relative">
                                                            <img
                                                                src={student.profilePicture}
                                                                alt="Profile"
                                                                className="w-9 h-9 rounded-full object-cover border-2 border-blue-200 shadow-sm"
                                                            />
                                                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-yellow-500 border-2 border-white rounded-full"></div>
                                                        </div>
                                                        <div className="ml-3">
                                                            <div className="text-sm font-semibold text-gray-900">
                                                                {student.applicantDetails.firstName} {student.applicantDetails.lastName}
                                                            </div>
                                                            <div className="text-xs text-gray-500">Pending Verification</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="text-sm text-gray-900">{student.email}</div>
                                                    <div className="text-xs text-gray-500">Primary Contact</div>
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    <div className="text-sm text-gray-900">{student.applicantDetails.contactNumber}</div>
                                                    <div className="text-xs text-gray-500">Mobile</div>
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    <div className="flex items-center justify-center">
                                                        <span className={`inline-block w-2.5 h-2.5 mr-2 rounded-full ${getStatusColor(student.status)}`}></span>
                                                        <span className="text-sm font-medium text-gray-700">
                                                            {toSentenceCase(student.status)}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    <div className="flex justify-center">
                                                        <Link
                                                            to={`/student-applications/${student._id}`}
                                                            className="inline-flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-all duration-300 hover:shadow-md hover:scale-105"
                                                        >
                                                            Verify
                                                            <PiArrowRightFill className="ml-1 w-3 h-3" />
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="py-8 text-center">
                                                <div className="flex flex-col items-center">
                                                    <div className="bg-gray-100 p-6 rounded-full mb-3">
                                                        <FaClipboardCheck className="w-8 h-8 text-gray-400" />
                                                    </div>
                                                    <h3 className="text-base font-semibold text-gray-600 mb-2">No applications found</h3>
                                                    <p className="text-sm text-gray-500">All applications have been processed or try adjusting your search</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>                        </div>

                        {/* Pagination Controls */}
                        {filteredStudents.length > 0 && (
                            <div className="bg-white px-6 py-4 border-t border-gray-100">
                                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <span>Showing {startIndex + 1} to {Math.min(endIndex, filteredStudents.length)} of {filteredStudents.length} applications</span>
                                    </div>
                                    
                                    {totalPages > 1 && (
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                disabled={currentPage === 1}
                                                className="px-3 py-1.5 text-sm border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                            >
                                                Previous
                                            </button>
                                            
                                            <div className="flex gap-1">
                                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                                    let pageNum;
                                                    if (totalPages <= 5) {
                                                        pageNum = i + 1;
                                                    } else if (currentPage <= 3) {
                                                        pageNum = i + 1;
                                                    } else if (currentPage >= totalPages - 2) {
                                                        pageNum = totalPages - 4 + i;
                                                    } else {
                                                        pageNum = currentPage - 2 + i;
                                                    }
                                                    
                                                    return (
                                                        <button
                                                            key={pageNum}
                                                            onClick={() => handlePageChange(pageNum)}
                                                            className={`px-3 py-1.5 text-sm border rounded-md transition-all duration-200 ${
                                                                currentPage === pageNum
                                                                    ? 'bg-blue-600 text-white border-blue-600'
                                                                    : 'border-gray-200 hover:bg-gray-50'
                                                            }`}
                                                        >
                                                            {pageNum}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                            
                                            <button
                                                onClick={() => handlePageChange(currentPage + 1)}
                                                disabled={currentPage === totalPages}
                                                className="px-3 py-1.5 text-sm border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                            >
                                                Next
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}