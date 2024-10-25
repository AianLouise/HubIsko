import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IoAddCircleOutline } from "react-icons/io5";
import { IoDocumentTextOutline, IoHourglassOutline, IoCheckmarkCircleOutline, IoCloseCircleOutline } from 'react-icons/io5';
import { LuArchive } from "react-icons/lu";
import { MdOutlinePlayLesson, MdOutlinePendingActions } from "react-icons/md";
import { FaExclamationCircle } from "react-icons/fa";

export default function ScholarshipPrograms() {
    useEffect(() => {
        document.title = "Scholarship Programs | HubIsko";
    }, []);

    const [totalScholarships, setTotalScholarships] = useState(0);
    const [pendingPrograms, setPendingPrograms] = useState(0);
    const [approvedPrograms, setApprovedPrograms] = useState(0);
    const [loading, setLoading] = useState(true);
    const [scholarshipPrograms, setScholarshipPrograms] = useState([]);
    const [filter, setFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

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
        <div className={`flex flex-col min-h-screen`}>
            <main className={`flex-grow bg-[#f8f8fb]`}>
                <div className='h-[250px]'>
                    <div className='bg-blue-600 text-white'>
                        <div className={'flex gap-2 mx-auto px-24 h-44'}>
                            <div className='flex items-center justify-between w-full h-28'>
                                <h1 className='text-2xl font-bold '>Scholarship Programs</h1>
                                {/* <Link to={'/add-scholarship-program'}>
                                    <button className='bg-white text-blue-600 px-4 py-2 shadow rounded-md font-medium flex items-center gap-2 hover:bg-slate-200'>
                                        <IoAddCircleOutline className='w-6 h-6' />
                                        Add Program
                                    </button>
                                </Link> */}
                            </div>
                        </div>
                    </div>

                    <div className='px-24 grid grid-cols-4 gap-5 -translate-y-20'>
                        <div className='flex flex-col gap-3 bg-white border shadow p-8 py-6 rounded-md'>
                            <div className='flex justify-between items-center'>
                                <h1 className='text-base font-medium'>All Programs</h1>
                                <div className='bg-blue-200 px-3 py-2 rounded-md'>
                                    <LuArchive className='text-2xl text-blue-600' />
                                </div>
                            </div>
                            <span className='text-4xl font-bold tracking-wide'>{totalScholarships}</span>
                        </div>

                        <div className='flex flex-col gap-3 bg-white border shadow p-8 py-6 rounded-md'>
                            <div className='flex justify-between items-center gap-1'>
                                <h1 className='text-base font-medium'>Ongoing Programs</h1>
                                <div className='bg-teal-200 px-3 py-2 rounded-md'>
                                    <MdOutlinePendingActions className='text-2xl text-teal-600' />
                                </div>
                            </div>
                            <span className='text-4xl font-bold tracking-wide'>{pendingPrograms}</span>
                        </div>

                        <div className='flex flex-col gap-3 bg-white border shadow p-8 py-6 rounded-md'>
                            <div className='flex justify-between items-center'>
                                <h1 className='text-base font-medium'>Published Programs</h1>
                                <div className='bg-indigo-200 px-3 py-2 rounded-md'>
                                    <MdOutlinePlayLesson className='text-2xl text-indigo-600' />
                                </div>
                            </div>
                            <span className='text-4xl font-bold tracking-wide'>{approvedPrograms}</span>
                        </div>

                        <div className='flex flex-col gap-3 bg-white border shadow p-8 py-6 rounded-md'>
                            <div className='flex justify-between items-center'>
                                <h1 className='text-base font-medium'>Awaiting Publication</h1>
                                <div className='bg-yellow-200 px-3 py-2 rounded-md'>
                                    <FaExclamationCircle className='text-2xl text-yellow-600' />
                                </div>
                            </div>
                            <span className='text-4xl font-bold tracking-wide'>{scholarshipPrograms.filter(program => program.status === 'Awaiting Publication').length}</span>
                        </div>
                    </div>
                </div>

                <div className='max-w-8xl mx-auto px-24 mt-4 flex-col flex'>
                    <div className="flex justify-between p-6 border-b items-center gap-2 bg-white shadow rounded-md mb-4">
                        <div className='flex gap-2 font-medium text-sm'>
                            <button
                                className={`border shadow rounded-md hover:bg-slate-200 px-4 py-2 ${filter === 'All' ? 'bg-slate-200' : ''}`}
                                onClick={() => setFilter('All')}
                            >
                                All <span className={`${filter === 'All' ? 'text-blue-600' : 'text-blue-600'}`}>({scholarshipPrograms.length})</span>
                            </button>

                            <button
                                className={`border shadow rounded-md hover:bg-slate-200 px-4 py-2 ${filter === 'Ongoing' ? 'bg-teal-500 text-white' : ''}`}
                                onClick={() => setFilter('Ongoing')}
                            >
                                Ongoing <span className={`${filter === 'Ongoing' ? 'text-white' : 'text-teal-600'}`}>({scholarshipPrograms.filter(program => program.status === 'Ongoing').length})</span>
                            </button>

                            <button
                                className={`border shadow rounded-md hover:bg-slate-200 px-4 py-2 ${filter === 'Published' ? 'bg-indigo-500 text-white' : ''}`}
                                onClick={() => setFilter('Published')}
                            >
                                Published <span className={`${filter === 'Published' ? 'text-white' : 'text-indigo-600'}`}>({scholarshipPrograms.filter(program => program.status === 'Published').length})</span>
                            </button>

                            <button
                                className={`border shadow rounded-md hover:bg-slate-200 px-4 py-2 ${filter === 'Awaiting Publication' ? 'bg-yellow-500 text-white' : ''}`}
                                onClick={() => setFilter('Awaiting Publication')}
                            >
                                Awaiting Publication <span className={`${filter === 'Awaiting Publication' ? 'text-white' : 'text-yellow-600'}`}>({scholarshipPrograms.filter(program => program.status === 'Awaiting Publication').length})</span>
                            </button>

                            <button
                                className={`border shadow rounded-md hover:bg-slate-200 px-4 py-2 ${filter === 'Completed' ? 'bg-green-500 text-white' : ''}`}
                                onClick={() => setFilter('Completed')}
                            >
                                Completed <span className={`${filter === 'Completed' ? 'text-white' : 'text-green-600'}`}>({scholarshipPrograms.filter(program => program.status === 'Completed').length})</span>
                            </button>

                            <button
                                className={`border shadow rounded-md hover:bg-slate-200 px-4 py-2 ${filter === 'Rejected' ? 'bg-red-500 text-white' : ''}`}
                                onClick={() => setFilter('Rejected')}
                            >
                                Rejected <span className={`${filter === 'Rejected' ? 'text-white' : 'text-red-600'}`}>({scholarshipPrograms.filter(program => program.status === 'Rejected').length})</span>
                            </button>
                        </div>

                        <input
                            type="text"
                            placeholder='Search Scholarships'
                            className='p-2 border rounded-md'
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="overflow-x-auto border shadow rounded-md bg-white w-full mb-10">
                        <div className="">
                            {filteredPrograms.length === 0 ? (
                                <div className="flex justify-center items-center h-full py-4">
                                    <p className="text-gray-600 font-medium">No scholarships available for the selected filter.</p>
                                </div>
                            ) : (
                                <table className="divide-y w-full divide-gray-200">
                                    <thead className="bg-slate-50 text-slate-700 border-b font-bold sticky top-0">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs uppercase tracking-wider">
                                                Title
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs uppercase tracking-wider">
                                                Slots
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredPrograms.map((scholarship) => (
                                            <tr key={scholarship._id}>
                                                <td className="px-6 flex gap-4 items-center py-4 whitespace-nowrap">
                                                    <div
                                                        className='w-16 h-16 rounded-md'
                                                        style={{
                                                            backgroundImage: `url(${scholarship.bannerImage})`,
                                                            backgroundSize: 'cover',
                                                            backgroundPosition: 'center'
                                                        }}
                                                    ></div>

                                                    <h1 className='text-base font-medium text-gray-800 break-words'>{scholarship.title}</h1>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`text-base font-medium 
                                                              ${scholarship.status === 'Published' ? 'bg-indigo-500 text-white font-semibold text-sm px-4 py-2 rounded-md' : ''} 
                                                              ${scholarship.status === 'Ongoing' ? 'bg-teal-500 text-white font-semibold text-sm px-4 py-2 rounded-md' : ''} 
                                                              ${scholarship.status === 'Rejected' ? 'bg-red-500 text-white font-semibold text-sm px-4 py-2 rounded-md' : ''} 
                                                              ${scholarship.status === 'Archived' ? 'bg-gray-500 text-white font-semibold text-sm px-4 py-2 rounded-md' : ''} 
                                                              ${scholarship.status === 'Cancelled' ? 'bg-orange-500 text-white font-semibold text-sm px-4 py-2 rounded-md' : ''} 
                                                              ${scholarship.status === 'Completed' ? 'bg-green-500 text-white font-semibold text-sm px-4 py-2 rounded-md' : ''} 
                                                              ${scholarship.status === 'Awaiting Publication' ? 'bg-yellow-500 text-white font-semibold text-sm px-4 py-2 rounded-md' : ''}`}>
                                                        {scholarship.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className='text-slate-600'>{scholarship.approvedScholars}/{scholarship.numberOfScholarships}</span>
                                                </td>

                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <Link
                                                        to={scholarship.status === 'Pending Approval'
                                                            ? `/scholarship-program-applications/${scholarship._id}`
                                                            : `/scholarship-program/${scholarship._id}`}
                                                        className="bg-blue-600 text-white px-4 ml-2 py-1 rounded-md hover:bg-blue-800 whitespace-nowrap"
                                                    >
                                                        {scholarship.status === 'Pending Approval' ? 'Verify' : 'View Details'}
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}