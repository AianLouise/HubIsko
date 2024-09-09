import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { Link } from "react-router-dom";
import { BiDotsHorizontal } from "react-icons/bi";
import { FaGraduationCap } from "react-icons/fa";

export default function ScholarshipPrograms() {
    useEffect(() => {
        document.title = "Scholarship Programs | HubIsko";
    }, []);

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [totalScholarships, setTotalScholarships] = useState(0);
    const [pendingPrograms, setPendingPrograms] = useState(0);
    const [approvedPrograms, setApprovedPrograms] = useState(0);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [scholarshipPrograms, setScholarshipPrograms] = useState([]);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch total number of scholarships
                const scholarshipsResponse = await fetch('/api/admin/total-scholarships');
                const scholarshipsData = await scholarshipsResponse.json();
                setTotalScholarships(scholarshipsData.totalScholarships);

                // Fetch total number of pending programs
                const pendingProgramsResponse = await fetch('/api/admin/search-pending-approval-programs');
                const pendingProgramsData = await pendingProgramsResponse.json();
                setPendingPrograms(pendingProgramsData.length);

                // Fetch total number of approved programs
                const approvedProgramsResponse = await fetch('/api/admin/total-approved-programs');
                const approvedProgramsData = await approvedProgramsResponse.json();
                setApprovedPrograms(approvedProgramsData.totalApprovedPrograms);

                // Fetch scholarship programs
                const scholarshipProgramsResponse = await fetch('/api/admin/scholarship-programs');
                const scholarshipProgramsData = await scholarshipProgramsResponse.json();
                setScholarshipPrograms(scholarshipProgramsData.data);

                // Fetch recent activities
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

            <main className="flex-grow bg-[#f8f8fb] font-medium text-slate-700">
                <div className='border-b mb-8'>
                    <div className={'flex items-center mx-auto justify-between px-24'}>
                        <div className='flex flex-col gap-2 w-1/2'>
                            <h1 className='text-4xl font-bold text-slate-800'>Scholarship Programs</h1>
                            <p className='text-lg text-slate-500 font-medium'>Manage and review scholarship programs here.</p>
                        </div>
                        <div className='bg-blue-600 w-36 h-36 my-8 rounded-md flex justify-center items-center'>
                            <FaGraduationCap className="text-white w-20 h-20" />
                        </div>
                    </div>
                </div>
                <div className='max-w-8xl mx-auto px-24 py-12 gap-10 flex-col flex'>
                    <div className="grid grid-cols-3 gap-10">
                        <Link to={'/scholarships-data'} className="bg-white flex flex-col gap-2 p-4 shadow border rounded-md h-[200px] justify-center items-center hover:bg-slate-200 hover:-translate-y-2 transition ease-in-out">
                            <h1 className="text-2xl font-semibold text-slate-600">Total Scholarships</h1>
                            <span className="text-6xl font-bold text-left text-blue-600">{totalScholarships}</span>
                        </Link>

                        <Link to={'/scholarship-program-applications'} className="bg-white flex flex-col gap-2 p-4 shadow border rounded-md h-[200px] justify-center items-center hover:bg-slate-200 hover:-translate-y-2 transition ease-in-out">
                            <h1 className="text-2xl font-semibold text-slate-600 text-center">Pending Scholarship Programs</h1>
                            <span className="text-6xl font-bold text-blue-600 text-center">{pendingPrograms}</span>
                        </Link>

                        <Link to={'/approved-scholarship-programs'} className="bg-white flex flex-col gap-2 p-4 shadow border rounded-md h-[200px] justify-center items-center hover:bg-slate-200 hover:-translate-y-2 transition ease-in-out">
                            <h1 className="text-2xl font-semibold text-slate-600 text-center">Approved Scholarship Programs</h1>
                            <span className="text-6xl font-bold text-blue-600 text-center">{approvedPrograms}</span>
                        </Link>
                    </div>

                    <span className="border-b pb-2 mt-8">Scholarship Programs</span>

                    <div>
                        {/* Searchbar */}
                        <div className="flex justify-between items-center">
                            <div className="flex gap-2 items-center">
                            <button className="px-4 py-2 rounded-md bg-white shadow border">
                                All <span className="text-blue-600">(0)</span>
                            </button>
                            <button className="px-4 py-2 rounded-md bg-white shadow border">
                                Pending <span className="text-yellow-500">(0)</span>
                            </button>
                            <button className="px-4 py-2 rounded-md bg-white shadow border">
                                Approved <span className="text-green-600">(0)</span>
                            </button>
                           
                            </div>
                            <input type="text" 
                            placeholder="Search for a scholarship program" 
                            className="w-96 px-4 py-2 border rounded-md" />
                        </div>
                    </div>
                    <div className="overflow-x-auto border-2 rounded-md">
                        <table className="min-w-full shadow-md rounded-lg">
                            <thead className="bg-blue-600">
                            <tr className="text-white">
                                <th className="py-3 px-6 text-left">Program Name</th>
                                <th className="py-3 px-6 text-left">Provider</th>
                                <th className="py-3 px-6 text-left">Status</th>
                                <th className="py-3 px-6 text-left">Applications</th>
                                <th className="py-3 px-6 text-left">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td colSpan="5" className="p-0">
                                <div className="max-h-[400px] overflow-y-auto">
                                    <table className="min-w-full">
                                    <tbody>
                                        {scholarshipPrograms.map((program, index) => (
                                        <tr
                                            key={program.id}
                                            className={`border-b ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100 transition-colors`}
                                        >
                                            <td className="py-3 px-6">{program.title}</td>
                                            <td className="py-3 px-6">{program.organizationName}</td>
                                            <td className="py-3 px-6">{program.status}</td>
                                            <td className="py-3 px-6">{program.applications}</td>
                                            <td className="py-3 px-6">
                                            <Link to={`/scholarship-program/${program._id}`} className="text-blue-600 hover:underline">
                                                View
                                            </Link>
                                            </td>
                                        </tr>
                                        ))}
                                    </tbody>
                                    </table>
                                </div>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        </div>

                    <span className="border-b pb-2">Recent Activities</span>

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
                                            <FaGraduationCap className="w-6 h-6" />
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