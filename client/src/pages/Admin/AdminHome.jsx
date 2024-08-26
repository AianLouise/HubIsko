import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { Link } from "react-router-dom";
import { BiDotsHorizontal } from "react-icons/bi";
import { BsInboxFill } from "react-icons/bs";

export default function AdminHome() {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [totalAccounts, setTotalAccounts] = useState(0);
    const [totalScholarships, setTotalScholarships] = useState(0);
    const [totalScholars, setTotalScholars] = useState(0);
    const [pendingProviders, setPendingProviders] = useState(0);
    const [pendingPrograms, setPendingPrograms] = useState(0); // New State for Pending Programs
    const [activities, setActivities] = useState([]); // State for Activities
    const [loading, setLoading] = useState(true);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch total number of accounts
                const accountsResponse = await fetch('/api/admin/total-accounts');
                const accountsData = await accountsResponse.json();
                setTotalAccounts(accountsData.totalAccounts);

                // Fetch total number of scholarships
                const scholarshipsResponse = await fetch('/api/admin/total-scholarships');
                const scholarshipsData = await scholarshipsResponse.json();
                setTotalScholarships(scholarshipsData.totalScholarships);

                // Fetch total number of approved scholars
                const scholarsResponse = await fetch('/api/admin/count-approved-scholars');
                const scholarsData = await scholarsResponse.json();
                setTotalScholars(scholarsData.count);

                // Fetch total number of pending providers
                const pendingProvidersResponse = await fetch('/api/admin/search-pending-verification-providers');
                const pendingProvidersData = await pendingProvidersResponse.json();
                setPendingProviders(pendingProvidersData.length);

                // Fetch total number of pending programs
                const pendingProgramsResponse = await fetch('/api/admin/search-pending-approval-programs');
                const pendingProgramsData = await pendingProgramsResponse.json();
                setPendingPrograms(pendingProgramsData.length);

                // Fetch recent activities
                // const activitiesResponse = await fetch('/api/admin/recent-activities');
                // const activitiesData = await activitiesResponse.json();
                // setActivities(activitiesData.activities);

                // Dummy data for activities
                setActivities([
                    { id: 1, actor: "DepEd", action: "Posted a Scholarship", time: "1 hour ago" },
                    { id: 2, actor: "John Doe", action: "Sent an Application to DepEd", time: "2 hours ago" },
                    { id: 3, actor: "TESDA", action: "Approved an Application", time: "3 hours ago" },
                    { id: 4, actor: "CHED", action: "Posted a Scholarship", time: "4 hours ago" },
                ]);

                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <svg className="animate-spin h-10 w-10 text-blue-600" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Layout />
            <main className="flex-grow bg-[#f8f8fb] font-medium text-slate-700">
                <div className='border-b mb-8'>
                    <div className={'flex items-center mx-auto justify-between px-24'}>
                        <div className='flex flex-col gap-2 w-1/2'>
                            <h1 className='text-4xl font-bold text-slate-800'>Welcome Admin!</h1>
                            <p className='text-lg text-slate-500 font-medium'>Here is your dashboard!</p>
                        </div>
                        <div className='bg-blue-600 w-36 h-36 my-8 rounded-md'></div>
                    </div>
                </div>
                <div className='max-w-8xl mx-auto px-24 py-12 gap-10 flex-col flex'>
                    <div className="grid grid-cols-3 gap-10">
                        <Link to={'/accounts'} className="bg-white flex flex-col gap-2 p-4 shadow border rounded-md h-[200px] justify-center items-center hover:bg-slate-200 hover:-translate-y-2 transition ease-in-out">
                            <h1 className="text-2xl font-semibold text-slate-600">Total Accounts</h1>
                            <span className="text-6xl font-bold text-left text-blue-600">{totalAccounts}</span>
                        </Link>

                        <Link to={'/scholarships-data'} className="bg-white flex flex-col gap-2 p-4 shadow border rounded-md h-[200px] justify-center items-center hover:bg-slate-200 hover:-translate-y-2 transition ease-in-out">
                            <h1 className="text-2xl font-semibold text-slate-600">Total Scholarships</h1>
                            <span className="text-6xl font-bold text-left text-blue-600">{totalScholarships}</span>
                        </Link>

                        <Link to={'/scholars'} className="bg-white flex flex-col gap-2 p-4 shadow border rounded-md h-[200px] justify-center items-center hover:bg-slate-200 hover:-translate-y-2 transition ease-in-out">
                            <h1 className="text-2xl font-semibold text-slate-600">Total Scholars</h1>
                            <span className="text-6xl font-bold text-left text-blue-600">{totalScholars}</span>
                        </Link>

                        <Link to={'/pending-providers'} className="bg-white flex flex-col gap-2 p-4 shadow border rounded-md h-[200px] justify-center items-center hover:bg-slate-200 hover:-translate-y-2 transition ease-in-out">
                            <h1 className="text-2xl font-semibold text-slate-600 text-center">Pending Scholarship Provider Applications</h1>
                            <span className="text-6xl font-bold text-blue-600 text-center">{pendingProviders}</span>
                        </Link>

                        <Link to={'/pending-programs'} className="bg-white flex flex-col gap-2 p-4 shadow border rounded-md h-[200px] justify-center items-center hover:bg-slate-200 hover:-translate-y-2 transition ease-in-out">
                            <h1 className="text-2xl font-semibold text-slate-600 text-center">Pending Scholarship Program Applications</h1>
                            <span className="text-6xl font-bold text-blue-600 text-center">{pendingPrograms}</span>
                        </Link>

                        <Link to={'/inbox'} className="bg-white flex flex-col gap-2 p-4 shadow border rounded-md h-[200px] justify-center items-center hover:bg-slate-200 hover:-translate-y-2 transition ease-in-out">
                            <h1 className="text-2xl font-semibold text-slate-600">Inbox Received</h1>
                            <span className="text-6xl font-bold text-left text-blue-600">10</span>
                        </Link>
                    </div>

                    <span className="border-b pb-2">Activities</span>

                    <div className="">
                        <div className="bg-white shadow border rounded-md group">
                            <div className="border-b flex justify-between px-6 items-center py-4 relative">
                                <span className="">History</span>
                                <button onClick={toggleDropdown} className="hover:bg-slate-200 rounded-md">
                                    <BiDotsHorizontal className="w-8 h-8 text-blue-600 group-hover:text-blue-800" />
                                </button>
                                {dropdownOpen && (
                                    <div className="absolute right-0 bottom-full mb-2 w-30 bg-white border border-gray-300 rounded-md shadow-lg">
                                        <Link to={'/inbox'} className="w-full text-left px-4 py-2 text-sm flex gap-2 items-center text-blue-600 hover:bg-gray-100">
                                            <BsInboxFill className="w-6 h-6" />
                                            Inbox
                                        </Link>
                                    </div>
                                )}
                            </div>

                            <div className="divide-y">
                                {activities.map((activity) => (
                                    <div key={activity.id} className="flex justify-between items-center p-4">
                                        <div className="flex gap-2 items-center">
                                            <div className="bg-blue-600 w-10 h-10 rounded-full"></div>
                                            <div className="flex flex-col">
                                                <h1 className="text-lg font-semibold">{activity.actor}</h1>
                                                <p className="text-slate-500">{activity.action}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-blue-600">{activity.time}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}