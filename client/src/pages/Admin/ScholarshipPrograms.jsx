import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { Link } from "react-router-dom";
import { BiDotsHorizontal } from "react-icons/bi";
import { FaGraduationCap } from "react-icons/fa";
import { IoDocumentTextOutline, IoHourglassOutline, IoCheckmarkCircleOutline, IoCloseCircleOutline } from 'react-icons/io5';
import { IoAddCircleOutline } from "react-icons/io5";

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
    const [filter, setFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const mostScholars = [
        { id: 1, name: 'Provider One', scholars: 120 },
        { id: 2, name: 'Provider Two', scholars: 95 },
        { id: 3, name: 'Provider Three', scholars: 80 },
        { id: 4, name: 'Provider Four', scholars: 75 },
        { id: 5, name: 'Provider Five', scholars: 60 },
    ];



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

    const filteredPrograms = scholarshipPrograms.filter(program => {
        if (filter !== 'All' && program.status !== filter) {
            return false;
        }
        if (searchQuery && !program.title.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false;
        }
        return true;
    });

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
                {/* <div className='border-b mb-8'>
                    <div className={'flex items-center mx-auto justify-between px-24'}>
                        <div className='flex flex-col gap-2 w-1/2'>
                            <h1 className='text-4xl font-bold text-slate-800'>Scholarship Programs</h1>
                            <p className='text-lg text-slate-500 font-medium'>Manage and review scholarship programs here.</p>
                        </div>
                        <div className='bg-blue-600 w-36 h-36 my-8 rounded-md flex justify-center items-center'>
                            <FaGraduationCap className="text-white w-20 h-20" />
                        </div>
                    </div>
                </div> */}

                <div className='max-w-8xl mx-auto px-24 pb-12 pt-8 flex-col flex'>

                    <div className="flex items-center justify-between pb-2">
                        <h1 className='text-2xl font-bold text-slate-600'>Scholarship Programs</h1>
                        {/* Add Program button */}
                        <Link to={'/add-scholarship-program'} className="flex gap-2 items-center bg-blue-600 rounded-md px-6 py-2 shadow text-white font-medium">
                            <IoAddCircleOutline className='w-6 h-6' />
                            Add Program
                        </Link>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex flex-col gap-4 w-full">
                            <div className="grid grid-cols-4 rounded-lg border">
                                <div to={'/scholarships-data'} className="bg-white flex justify-between items-center gap-2 p-4 shadow rounded-l-lg">
                                    <div className="flex flex-col gap-2 items-left">
                                        <h1 className="text-base font-semibold text-slate-600">Total Scholarships</h1>
                                        <span className="text-4xl font-bold text-left">{totalScholarships}</span>
                                    </div>
                                    <div className="bg-blue-200 p-1 rounded-lg">
                                        <IoDocumentTextOutline className="w-12 h-12 text-blue-800" />
                                    </div>
                                </div>

                                <div to={'/scholarship-program-applications'} className="bg-white flex justify-between items-center gap-2 p-4 shadow ">
                                    <div className="flex flex-col gap-2 items-left">
                                        <h1 className="text-base font-semibold text-slate-600">Pending Programs</h1>
                                        <span className="text-4xl font-bold text-left">{pendingPrograms}</span>
                                    </div>
                                    <div className="bg-yellow-200 p-1 rounded-lg">
                                        <IoHourglassOutline className="w-12 h-12 text-yellow-600" />
                                    </div>
                                </div>

                                <div to={'/approved-scholarship-programs'} className="bg-white flex justify-between items-center gap-2 p-4 shadow">
                                    <div className="flex flex-col gap-2 items-left">
                                        <h1 className="text-base font-semibold text-slate-600">Approved Programs</h1>
                                        <span className="text-4xl font-bold text-left">
                                            {approvedPrograms}
                                        </span>
                                    </div>
                                    <div className="bg-green-200 p-1 rounded-lg">
                                        <IoCheckmarkCircleOutline className="w-12 h-12 text-green-600" />
                                    </div>
                                </div>

                                <div to={'/rejected-scholarship-programs'} className="bg-white flex justify-between items-center gap-2 p-4 shadow rounded-r-lg">
                                    <div className="flex flex-col gap-2 items-left">
                                        <h1 className="text-base font-semibold text-slate-600">Rejected Programs</h1>
                                        <span className="text-4xl font-bold text-left">0</span>
                                    </div>
                                    <div className="bg-red-200 p-1 rounded-lg">
                                        <IoCloseCircleOutline className="w-12 h-12 text-red-600" />
                                    </div>
                                </div>
                            </div>

                            <div className='flex flex-col gap-10'>
                                <div className="overflow-x-auto rounded-lg shadow-md border">
                                    <div className="sticky top-0 bg-white z-10">
                                        <div className="flex justify-between items-center p-4 bg-white shadow-md">
                                            <div className="flex gap-2 items-center">
                                                <button
                                                    className={`px-4 py-2 rounded-md bg-white shadow border ${filter === 'All' ? 'bg-blue-200' : ''}`}
                                                    onClick={() => setFilter('All')}
                                                >
                                                    All <span className="text-blue-600">({scholarshipPrograms.length})</span>
                                                </button>
                                                <button
                                                    className={`px-4 py-2 rounded-md bg-white shadow border ${filter === 'Pending Approval' ? 'bg-yellow-200' : ''}`}
                                                    onClick={() => setFilter('Pending Approval')}
                                                >
                                                    Pending Approval <span className="text-yellow-500">({scholarshipPrograms.filter(program => program.status === 'Pending Approval').length})</span>
                                                </button>
                                                <button
                                                    className={`px-4 py-2 rounded-md bg-white shadow border ${filter === 'Rejected' ? 'bg-red-200' : ''}`}
                                                    onClick={() => setFilter('Rejected')}
                                                >
                                                    Rejected <span className="text-red-500">({scholarshipPrograms.filter(program => program.status === 'Rejected').length})</span>
                                                </button>
                                                <button
                                                    className={`px-4 py-2 rounded-md bg-white shadow border ${filter === 'Approved' ? 'bg-green-200' : ''}`}
                                                    onClick={() => setFilter('Approved')}
                                                >
                                                    Approved <span className="text-green-600">({scholarshipPrograms.filter(program => program.status === 'Approved').length})</span>
                                                </button>
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="Search for a scholarship program"
                                                className="w-96 px-4 py-2 border rounded-md"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                            />
                                        </div>
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-slate-100 sticky top-16 z-10">
                                                <tr className="border-y text-sm">
                                                    <th className="py-3 px-6 text-left w-1/5 uppercase tracking-wider">Program Name</th>
                                                    <th className="py-3 px-6 text-left w-1/5 uppercase tracking-wider">Provider</th>
                                                    <th className="py-3 px-6 text-left w-1/5 uppercase tracking-wider">Status</th>
                                                    <th className="py-3 px-6 text-left w-1/5 uppercase tracking-wider">Applications</th>
                                                    <th className="py-3 px-6 text-left w-1/5 uppercase tracking-wider">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white font-normal text-sm">
                                                {filteredPrograms.map((program, index) => (
                                                    <tr
                                                        key={program.id}
                                                        className={`border-b ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100 transition-colors`}
                                                    >
                                                        <td className="py-3 px-6 w-1/5">
                                                            <div className="flex items-center gap-4">
                                                                <img src={program.scholarshipImage} alt="Scholarship" className="h-10 w-10 rounded-full object-cover" />
                                                                {program.title}
                                                            </div>
                                                        </td>
                                                        <td className="py-3 px-6 w-1/5">{program.organizationName}</td>
                                                        <td className="py-3 px-6 w-1/5">
                                                            <span className={`px-4 ml-2 py-1 rounded-md whitespace-nowrap ${program.status === 'Approved' ? 'bg-green-600 text-white'
                                                                : program.status === 'Pending Approval' ? 'bg-yellow-500 text-white text-xs sm:text-sm md:text-base'
                                                                    : program.status === 'Rejected' ? 'bg-red-600 text-white' : ''}`}>
                                                                {program.status}
                                                            </span>
                                                        </td>
                                                        <td className="py-3 px-6 w-1/5">0</td>
                                                        <td className="py-3 px-6 w-1/5">
                                                                                                                       <Link 
                                                              to={program.status === 'Pending Approval' 
                                                                ? `/scholarship-program-applications/${program._id}` 
                                                                : `/scholarship-program/${program._id}`} 
                                                              className="bg-blue-600 text-white px-4 ml-2 py-1 rounded-md hover:bg-blue-800 whitespace-nowrap"
                                                            >
                                                              {program.status === 'Pending Approval' ? 'Verify' : 'View Details'}
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-md  w-1/3 border shadow divide-y">
                            <div className="flex items-center justify-between p-4">
                                <h1 className="">Scholarship Providers</h1>
                                <button className="px-2 py-1 bg-blue-600 rounded-md text-white text-sm">Most Scholars</button>
                            </div>
                            <div className="divide-y">
                                {mostScholars.map((provider) => (
                                    <div key={provider.id} className="flex justify-between items-center p-4 hover:bg-gray-100 transition-colors">
                                        <div className="flex gap-2 items-center">
                                            <div className="border border-blue-600 w-10 h-10 rounded-full"></div>
                                            <span className="font-medium text-gray-700">{provider.name}</span>
                                        </div>
                                        <span className="text-gray-500">{provider.scholars} Scholars</span>
                                    </div>
                                ))}
                            </div>
                        </div>


                    </div>

                    <span className="border-b pb-2 mt-10">Recent Activities</span>

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