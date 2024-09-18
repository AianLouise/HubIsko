import React, { useEffect, useState } from "react";
import { BsPencilFill } from "react-icons/bs";
import LogHistory from "../../components/AdminSettings/LogHistory";

export default function AdminSettings() {
    const [activityLogs, setActivityLogs] = useState([]);

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
                                    <span className="text-xl font-bold">Aileen Valencia</span>
                                    <span className="text-slate-500">aileen.valencia@example.com</span>
                                </div>
                            </div>

                            <div className="flex gap-6">
                                <div className="w-1/2 flex flex-col gap-6">
                                    <span className="text-slate-500">Phone</span>
                                    <span className="text-lg font-semibold">09123456789</span>
                                </div>
                                <div className="w-1/2 flex flex-col gap-6">
                                    <span className="text-slate-500">Address</span>
                                    <span className="text-lg font-semibold">1234 Main Street, Anytown</span>
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

                    <LogHistory activityLogs={activityLogs} />
                </div>
            </main>
        </div>
    );
}
