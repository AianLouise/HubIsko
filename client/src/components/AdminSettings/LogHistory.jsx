import React, { useState, useEffect } from "react";

const LogHistory = ({ apiUrl = 'http://localhost:3000' }) => {
    const [activityLogs, setActivityLogs] = useState([]);
    const [filteredLogs, setFilteredLogs] = useState([]);
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');    const [currentPage, setCurrentPage] = useState(1);
    const [sortOption, setSortOption] = useState('latest');
    const [loading, setLoading] = useState(true);
    const [logsPerPage, setLogsPerPage] = useState(10);

    useEffect(() => {
        const fetchActivityLogs = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${apiUrl}/api/activity/activity-logs`);
                const data = await response.json();
                setActivityLogs(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error fetching activity logs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchActivityLogs();
    }, [apiUrl]);

    useEffect(() => {
        let logs = activityLogs;

        if (filter !== 'all') {
            logs = logs.filter(log => log.type === filter);
        }

        if (searchQuery) {
            logs = logs.filter(log =>
                log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
                log.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (log.userId && (
                    log.userId.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    log.userId.applicantDetails?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    log.userId.applicantDetails?.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    log.userId.applicantDetails?.middleName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    log.userId.scholarshipProviderDetails?.organizationName?.toLowerCase().includes(searchQuery.toLowerCase())
                )) ||
                log._id.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (sortOption === 'latest') {
            logs = logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        } else if (sortOption === 'oldest') {
            logs = logs.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        }

        setFilteredLogs(logs);
    }, [filter, searchQuery, activityLogs, sortOption]);

    useEffect(() => {
        setCurrentPage(1);
    }, [filter]);    // Pagination logic
    const indexOfLastLog = currentPage * logsPerPage;
    const indexOfFirstLog = indexOfLastLog - logsPerPage;
    const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);
    const totalPages = Math.ceil(filteredLogs.length / logsPerPage);

    const getUserDisplayName = (user) => {
        if (!user) return 'N/A';
        if (user.applicantDetails?.firstName || user.applicantDetails?.lastName || user.applicantDetails?.middleName) {
            const middleInitial = user.applicantDetails.middleName ? `${user.applicantDetails.middleName.charAt(0)}.` : '';
            return `${user.applicantDetails.lastName || ''}, ${user.applicantDetails.firstName || ''} ${middleInitial}`.trim();
        }
        if (user.scholarshipProviderDetails?.organizationName) return user.scholarshipProviderDetails.organizationName;
        return user.username || 'N/A';    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="text-center">
                    <svg className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    <p className="text-gray-500">Loading activity logs...</p>
                </div>
            </div>
        );
    }    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Header */}
            <div className="border-b border-gray-200 p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Activity Log</h2>
                        <p className="text-sm text-gray-600 mt-1">Track all system activities and user actions</p>
                    </div>
                    
                    {/* Controls */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <input
                            placeholder="Search logs..."
                            type="text"
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <select
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="latest">Latest First</option>
                            <option value="oldest">Oldest First</option>
                        </select>
                        
                        <select
                            value={logsPerPage}
                            onChange={(e) => {
                                setLogsPerPage(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value={5}>5 per page</option>
                            <option value={10}>10 per page</option>
                            <option value={25}>25 per page</option>
                            <option value={50}>50 per page</option>
                        </select>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap gap-2 mt-4">
                    <button
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            filter === 'all' 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        onClick={() => setFilter('all')}
                    >
                        All Activity ({activityLogs.length})
                    </button>
                    <button
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            filter === 'account' 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        onClick={() => setFilter('account')}
                    >
                        Accounts ({activityLogs.filter(log => log.type === 'account').length})
                    </button>
                    <button
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            filter === 'scholarship' 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        onClick={() => setFilter('scholarship')}
                    >
                        Scholarships ({activityLogs.filter(log => log.type === 'scholarship').length})
                    </button>
                    <button
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            filter === 'forum' 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        onClick={() => setFilter('forum')}
                    >
                        Forums ({activityLogs.filter(log => log.type === 'forum').length})
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                {filteredLogs.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Activity Logs</h3>
                        <p className="text-gray-600">No activity logs match your current filters.</p>
                    </div>
                ) : (
                    <>
                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Activity
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Type
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            User
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Details
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            ID
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {currentLogs.map((log) => (
                                        <tr key={log._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                                                        log.action?.toLowerCase().includes('create') ? 'bg-green-100 text-green-600' :
                                                        log.action?.toLowerCase().includes('update') ? 'bg-blue-100 text-blue-600' :
                                                        log.action?.toLowerCase().includes('delete') ? 'bg-red-100 text-red-600' :
                                                        'bg-gray-100 text-gray-600'
                                                    }`}>
                                                        {log.action?.toLowerCase().includes('create') ? (
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                            </svg>
                                                        ) : log.action?.toLowerCase().includes('update') ? (
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                            </svg>
                                                        ) : log.action?.toLowerCase().includes('delete') ? (
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        ) : (
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                    <div className="text-sm font-medium text-gray-900">{log.action}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                    log.type === 'account' ? 'bg-blue-100 text-blue-800' :
                                                    log.type === 'scholarship' ? 'bg-green-100 text-green-800' :
                                                    log.type === 'forum' ? 'bg-purple-100 text-purple-800' :
                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {log.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{getUserDisplayName(log.userId)}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500">{new Date(log.timestamp).toLocaleString()}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900 max-w-xs truncate" title={log.details}>
                                                    {log.details}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-xs text-gray-500 font-mono">{log._id}</div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Modern Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-8 border-t border-gray-200 pt-6">
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <div className="text-sm text-gray-700">
                                        Showing {indexOfFirstLog + 1} to {Math.min(indexOfLastLog, filteredLogs.length)} of {filteredLogs.length} entries
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                        {/* Previous Button */}
                                        <button
                                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                            disabled={currentPage === 1}
                                            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Previous
                                        </button>

                                        {/* Page Numbers */}
                                        <div className="flex items-center gap-1">
                                            {/* First page */}
                                            {currentPage > 3 && (
                                                <>
                                                    <button
                                                        onClick={() => setCurrentPage(1)}
                                                        className="w-10 h-10 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700"
                                                    >
                                                        1
                                                    </button>
                                                    {currentPage > 4 && (
                                                        <span className="px-2 text-gray-500">...</span>
                                                    )}
                                                </>
                                            )}

                                            {/* Current page range */}
                                            {Array.from({ length: totalPages }, (_, i) => i + 1)
                                                .filter(page => page >= Math.max(1, currentPage - 2) && page <= Math.min(totalPages, currentPage + 2))
                                                .map(page => (
                                                    <button
                                                        key={page}
                                                        onClick={() => setCurrentPage(page)}
                                                        className={`w-10 h-10 text-sm font-medium rounded-lg ${
                                                            page === currentPage
                                                                ? 'bg-blue-600 text-white border border-blue-600'
                                                                : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700'
                                                        }`}
                                                    >
                                                        {page}
                                                    </button>
                                                ))}

                                            {/* Last page */}
                                            {currentPage < totalPages - 2 && (
                                                <>
                                                    {currentPage < totalPages - 3 && (
                                                        <span className="px-2 text-gray-500">...</span>
                                                    )}
                                                    <button
                                                        onClick={() => setCurrentPage(totalPages)}
                                                        className="w-10 h-10 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700"
                                                    >
                                                        {totalPages}
                                                    </button>
                                                </>
                                            )}
                                        </div>

                                        {/* Next Button */}
                                        <button
                                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                            disabled={currentPage === totalPages}
                                            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Next
                                        </button>

                                        {/* Quick Jump */}
                                        <div className="flex items-center gap-2 ml-4">
                                            <span className="text-sm text-gray-500">Go to:</span>
                                            <input
                                                type="number"
                                                min="1"
                                                max={totalPages}
                                                value={currentPage}
                                                onChange={(e) => {
                                                    const page = parseInt(e.target.value);
                                                    if (page >= 1 && page <= totalPages) {
                                                        setCurrentPage(page);
                                                    }
                                                }}
                                                className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default LogHistory;