import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IoAddCircleOutline } from "react-icons/io5";
import { IoDocumentTextOutline, IoHourglassOutline, IoCheckmarkCircleOutline, IoCloseCircleOutline } from 'react-icons/io5';
import { LuArchive } from "react-icons/lu";
import { MdOutlinePlayLesson, MdOutlinePendingActions, MdSchool } from "react-icons/md";
import { FaExclamationCircle, FaGraduationCap, FaAward } from "react-icons/fa";
import { PiArrowRightFill } from "react-icons/pi";

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function ScholarshipPrograms() {
    useEffect(() => {
        document.title = "Scholarship Programs | HubIsko";
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const [totalScholarships, setTotalScholarships] = useState(0);
    const [loading, setLoading] = useState(true);
    const [scholarshipPrograms, setScholarshipPrograms] = useState([]);
    const [filter, setFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Fetch total number of scholarships
                const scholarshipsResponse = await fetch(`${apiUrl}/api/admin/total-scholarships`);
                const scholarshipsData = await scholarshipsResponse.json();
                setTotalScholarships(scholarshipsData.totalScholarships);

                // Fetch scholarship programs
                const scholarshipProgramsResponse = await fetch(`${apiUrl}/api/admin/scholarship-programs`);
                const scholarshipProgramsData = await scholarshipProgramsResponse.json();
                setScholarshipPrograms(scholarshipProgramsData.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);    const filteredPrograms = scholarshipPrograms
        .filter(program => {
            if (filter !== 'All' && program.status !== filter) {
                return false;
            }
            if (searchQuery && !program.title.toLowerCase().includes(searchQuery.toLowerCase()) && !program.organizationName.toLowerCase().includes(searchQuery.toLowerCase())) {
                return false;
            }
            return true;
        })
        .sort((a, b) => a.title.localeCompare(b.title));

    // Pagination logic
    const totalPages = Math.ceil(filteredPrograms.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentPrograms = filteredPrograms.slice(startIndex, endIndex);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
        setCurrentPage(1);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    const truncate = (text, maxLength) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
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
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Loading Scholarship Programs</h3>
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
                                <h1 className="text-3xl font-bold mb-2">Scholarship Programs</h1>
                                <p className="text-blue-100 text-base font-medium">
                                    Manage and oversee all scholarship programs in the system
                                </p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                                <MdSchool className="text-white text-4xl" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="max-w-7xl mx-auto px-6 -mt-6 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <div className="bg-white rounded-xl shadow-md border border-blue-100 p-4 hover:shadow-lg transition-all duration-300">
                            <div className="flex items-center justify-between mb-3">
                                <div className="bg-blue-100 p-2 rounded-lg">
                                    <LuArchive className="w-5 h-5 text-blue-600" />
                                </div>
                                <div className="text-right">
                                    <p className="text-blue-600 font-medium text-xs uppercase tracking-wide">All Programs</p>
                                </div>
                            </div>
                            <div className="text-2xl font-bold text-gray-800">{totalScholarships}</div>
                        </div>

                        <div className="bg-white rounded-xl shadow-md border border-blue-100 p-4 hover:shadow-lg transition-all duration-300">
                            <div className="flex items-center justify-between mb-3">
                                <div className="bg-teal-100 p-2 rounded-lg">
                                    <MdOutlinePendingActions className="w-5 h-5 text-teal-600" />
                                </div>
                                <div className="text-right">
                                    <p className="text-teal-600 font-medium text-xs uppercase tracking-wide">Ongoing</p>
                                </div>
                            </div>
                            <div className="text-2xl font-bold text-gray-800">{scholarshipPrograms.filter(program => program.status === 'Ongoing').length}</div>
                        </div>

                        <div className="bg-white rounded-xl shadow-md border border-blue-100 p-4 hover:shadow-lg transition-all duration-300">
                            <div className="flex items-center justify-between mb-3">
                                <div className="bg-indigo-100 p-2 rounded-lg">
                                    <MdOutlinePlayLesson className="w-5 h-5 text-indigo-600" />
                                </div>
                                <div className="text-right">
                                    <p className="text-indigo-600 font-medium text-xs uppercase tracking-wide">Published</p>
                                </div>
                            </div>
                            <div className="text-2xl font-bold text-gray-800">{scholarshipPrograms.filter(program => program.status === 'Published').length}</div>
                        </div>

                        <div className="bg-white rounded-xl shadow-md border border-blue-100 p-4 hover:shadow-lg transition-all duration-300">
                            <div className="flex items-center justify-between mb-3">
                                <div className="bg-yellow-100 p-2 rounded-lg">
                                    <FaExclamationCircle className="w-5 h-5 text-yellow-600" />
                                </div>
                                <div className="text-right">
                                    <p className="text-yellow-600 font-medium text-xs uppercase tracking-wide">Awaiting Publication</p>
                                </div>
                            </div>
                            <div className="text-2xl font-bold text-gray-800">{scholarshipPrograms.filter(program => program.status === 'Awaiting Publication').length}</div>
                        </div>
                    </div>
                </div>

                {/* Programs Management Section */}
                <div className="max-w-7xl mx-auto px-6 py-8">
                    {/* Filter Controls */}
                    <div className="bg-white rounded-xl shadow-md border border-blue-100 p-4 mb-6">
                        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                            <div className="flex flex-wrap gap-2">
                                <button
                                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all duration-300 ${
                                        filter === 'All' 
                                            ? 'bg-blue-600 text-white border-blue-600' 
                                            : 'bg-white text-gray-700 border-gray-200 hover:bg-blue-50'
                                    }`}
                                    onClick={() => handleFilterChange('All')}
                                >
                                    All ({scholarshipPrograms.length})
                                </button>
                                <button
                                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all duration-300 ${
                                        filter === 'Awaiting Publication' 
                                            ? 'bg-yellow-500 text-white border-yellow-500' 
                                            : 'bg-white text-gray-700 border-gray-200 hover:bg-yellow-50'
                                    }`}
                                    onClick={() => handleFilterChange('Awaiting Publication')}
                                >
                                    Awaiting Publication ({scholarshipPrograms.filter(program => program.status === 'Awaiting Publication').length})
                                </button>
                                <button
                                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all duration-300 ${
                                        filter === 'Published' 
                                            ? 'bg-indigo-500 text-white border-indigo-500' 
                                            : 'bg-white text-gray-700 border-gray-200 hover:bg-indigo-50'
                                    }`}
                                    onClick={() => handleFilterChange('Published')}
                                >
                                    Published ({scholarshipPrograms.filter(program => program.status === 'Published').length})
                                </button>
                                <button
                                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all duration-300 ${
                                        filter === 'Ongoing' 
                                            ? 'bg-teal-500 text-white border-teal-500' 
                                            : 'bg-white text-gray-700 border-gray-200 hover:bg-teal-50'
                                    }`}
                                    onClick={() => handleFilterChange('Ongoing')}
                                >
                                    Ongoing ({scholarshipPrograms.filter(program => program.status === 'Ongoing').length})
                                </button>
                                <button
                                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all duration-300 ${
                                        filter === 'Completed' 
                                            ? 'bg-green-500 text-white border-green-500' 
                                            : 'bg-white text-gray-700 border-gray-200 hover:bg-green-50'
                                    }`}
                                    onClick={() => handleFilterChange('Completed')}
                                >
                                    Completed ({scholarshipPrograms.filter(program => program.status === 'Completed').length})
                                </button>
                            </div>

                            <div className="flex gap-3">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search programs..."
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
                            </div>
                        </div>
                    </div>

                    {/* Programs Table */}
                    <div className="bg-white rounded-xl shadow-md border border-blue-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                                    <tr>
                                        <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider">Program</th>
                                        <th className="py-3 px-4 text-center text-xs font-semibold uppercase tracking-wider">Organization</th>
                                        <th className="py-3 px-4 text-center text-xs font-semibold uppercase tracking-wider">Status</th>
                                        <th className="py-3 px-4 text-center text-xs font-semibold uppercase tracking-wider">Slots</th>
                                        <th className="py-3 px-4 text-center text-xs font-semibold uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {currentPrograms && currentPrograms.length > 0 ? (
                                        currentPrograms.map((scholarship, index) => (
                                            <tr key={scholarship._id} className={`hover:bg-blue-50 transition-all duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center">
                                                        <div className="relative">
                                                            <div
                                                                className="w-12 h-12 rounded-lg bg-cover bg-center border-2 border-blue-200 shadow-sm"
                                                                style={{
                                                                    backgroundImage: `url(${scholarship.bannerImage})`,
                                                                }}
                                                            ></div>
                                                        </div>
                                                        <div className="ml-3">
                                                            <div className="text-sm font-semibold text-gray-900 max-w-xs" title={scholarship.title}>
                                                                {truncate(scholarship.title, 40)}
                                                            </div>
                                                            <div className="text-xs text-gray-500">Scholarship Program</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    <div className="text-sm text-gray-900">{truncate(scholarship.organizationName, 25)}</div>
                                                    <div className="text-xs text-gray-500">Provider</div>
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        scholarship.status === 'Published' ? 'bg-indigo-100 text-indigo-800' :
                                                        scholarship.status === 'Ongoing' ? 'bg-teal-100 text-teal-800' :
                                                        scholarship.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                                        scholarship.status === 'Awaiting Publication' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {scholarship.status}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    <div className="text-sm text-gray-900">
                                                        {scholarship.approvedScholars.length}/{scholarship.numberOfScholarships}
                                                    </div>
                                                    <div className="text-xs text-gray-500">Filled/Total</div>
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    <div className="flex justify-center">
                                                        <Link
                                                            to={`/scholarship-program/${scholarship._id}`}
                                                            className="inline-flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-all duration-300 hover:shadow-md hover:scale-105"
                                                        >
                                                            View Details
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
                                                        <FaGraduationCap className="w-8 h-8 text-gray-400" />
                                                    </div>
                                                    <h3 className="text-base font-semibold text-gray-600 mb-2">No programs found</h3>
                                                    <p className="text-sm text-gray-500">No scholarship programs match your current filter or search criteria</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Controls */}
                        {filteredPrograms.length > 0 && (
                            <div className="bg-white px-6 py-4 border-t border-gray-100">
                                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <span>Showing {startIndex + 1} to {Math.min(endIndex, filteredPrograms.length)} of {filteredPrograms.length} programs</span>
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