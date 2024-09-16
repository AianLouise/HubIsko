import React, { useEffect, useState } from "react";
import { BsPencilFill } from "react-icons/bs";

export default function AdminSettings() {
    const [activityLogs, setActivityLogs] = useState([]);
    const [filteredLogs, setFilteredLogs] = useState([]);
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const logsPerPage = 10;

    useEffect(() => {
        const fetchActivityLogs = async () => {
            try {
                const response = await fetch('/api/activity/activity-logs'); // Adjust the endpoint as necessary
                const data = await response.json();
                setActivityLogs(Array.isArray(data) ? data : []); // Ensure data is an array
            } catch (error) {
                console.error('Error fetching activity logs:', error);
            }
        };

        fetchActivityLogs();
    }, []);

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
        <div className="flex flex-col min-h-screen">
            <main className="flex-grow bg-[#f8f8fb] font-medium text-slate-700">
                <div className="max-w-8xl flex flex-col gap-10 px-20 mt-10">
                    <div className="flex gap-10">
                        <div className="bg-white shadow border rounded-md p-8 w-1/2">
                            <div className="flex justify-between">
                                <span className="text-xl font-bold">Profile Information</span>
                                <button className="flex gap-2 bg-blue-600 hover:bg-blue-800 text-white items-center px-4 py-2 rounded-md">
                                    <BsPencilFill className="text-xl" />
                                    Edit
                                </button>
                            </div>

                            <div className="flex items-center gap-10 py-10 w-full border-b mb-10">
                                <div className="bg-blue-600 w-40 h-40 rounded-full"></div>

                                <div className="flex flex-col items-left gap-2">
                                    <span className="text-slate-500">Admin</span>
                                    <span className="text-3xl font-bold">Admin Name</span>
                                    <span className="text-2xl">Followers:</span>
                                    <span className="text-slate-500">Admin Email</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-8 w-full">
                                <div className="flex flex-col">
                                    <label className="px-2">Admin Name</label>
                                    <input
                                        value={"Admin Name"}
                                        type="text"
                                        disabled
                                        className="border rounded-md bg-slate-200 p-2 text-slate-500"
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="px-2">Admin Contact No.</label>
                                    <input
                                        value={"09123456789"}
                                        type="text"
                                        disabled
                                        className="border rounded-md bg-slate-200 p-2 text-slate-500"
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="px-2">Admin Email</label>
                                    <input
                                        value={"admin@example.com"}
                                        type="text"
                                        disabled
                                        className="border rounded-md bg-slate-200 p-2 text-slate-500"
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="px-2">Admin Address</label>
                                    <input
                                        value={"Admin Address"}
                                        type="text"
                                        disabled
                                        className="border rounded-md bg-slate-200 p-2 text-slate-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col bg-white shadow border rounded-md p-8 w-1/2">
                            <span className="text-xl font-bold">Time Spent</span>
                            <div className="border rounded-md items-center justify-center flex h-full my-10">
                                <span>Container for Time graph</span>
                            </div>
                        </div>
                    </div>

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
                </div>
            </main>
        </div>
    );
}