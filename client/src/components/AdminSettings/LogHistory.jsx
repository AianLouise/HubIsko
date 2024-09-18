import React, { useState, useEffect } from "react";
import { IoMdArrowRoundForward } from "react-icons/io";

const LogHistory = ({ activityLogs }) => {
    const [filteredLogs, setFilteredLogs] = useState([]);
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const logsPerPage = 10;

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
                (log.userId && log.userId.username.toLowerCase().includes(searchQuery.toLowerCase())) ||
                log._id.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredLogs(logs);
    }, [filter, searchQuery, activityLogs]);

    // Pagination logic
    const indexOfLastLog = currentPage * logsPerPage;
    const indexOfFirstLog = indexOfLastLog - logsPerPage;
    const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);
    const totalPages = Math.ceil(filteredLogs.length / logsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div className="flex flex-col gap-4 mb-10">
            <div className="border-t-2 mt-4">
                <div className="flex items-center w-full justify-center">
                    <span className="bg-[#f8f8fb] px-8 -translate-y-3 text-xl text-slate-500">Log History</span>
                </div>
            </div>

            <div className="flex justify-between">
                <div className="flex gap-4">
                    <button
                        className="px-4 py-2 rounded-md bg-white border shadow"
                        onClick={() => setFilter('all')}
                    >
                        All Activity ({activityLogs.length})
                    </button>
                    <button
                        className="px-4 py-2 rounded-md bg-white border shadow"
                        onClick={() => setFilter('account')}
                    >
                        Accounts ({activityLogs.filter(log => log.type === 'account').length})
                    </button>
                    <button
                        className="px-4 py-2 rounded-md bg-white border shadow"
                        onClick={() => setFilter('scholarship')}
                    >
                        Scholarships ({activityLogs.filter(log => log.type === 'scholarship').length})
                    </button>
                </div>

                <input
                    placeholder="Search"
                    type="text"
                    className="border-2 rounded-md bg-slate-100 p-2 w-[300px] text-slate-700"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="flex bg-white p-4 border shadow rounded-md mt-4">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Activity
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Type
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Details
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                User
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                ID
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {Array.isArray(currentLogs) && currentLogs.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                    No activity logs available.
                                </td>
                            </tr>
                        ) : (
                            currentLogs.map((log) => (
                                <tr key={log._id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{log.action}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{log.type}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">{new Date(log.timestamp).toLocaleDateString()}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{log.details}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{log.userId ? log.userId.username : 'N/A'}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{log._id}</div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-between mt-4 mb-20">
                <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-md bg-white border shadow"
                >
                    Previous
                </button>
                <span className="text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-md bg-white border shadow"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default LogHistory;
