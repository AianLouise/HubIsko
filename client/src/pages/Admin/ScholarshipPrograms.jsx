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

    const filteredPrograms = scholarshipPrograms
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

    const truncate = (text, maxLength) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

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
                            <span className='text-4xl font-bold tracking-wide'>{scholarshipPrograms.filter(program => program.status === 'Ongoing').length}</span>
                        </div>

                        <div className='flex flex-col gap-3 bg-white border shadow p-8 py-6 rounded-md'>
                            <div className='flex justify-between items-center'>
                                <h1 className='text-base font-medium'>Published Programs</h1>
                                <div className='bg-indigo-200 px-3 py-2 rounded-md'>
                                    <MdOutlinePlayLesson className='text-2xl text-indigo-600' />
                                </div>
                            </div>
                            <span className='text-4xl font-bold tracking-wide'>{scholarshipPrograms.filter(program => program.status === 'Published').length}</span>
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

                <div className="h-screen">
                    <div className='max-w-8xl mx-auto px-24 mt-4 flex-col flex'>
                        <div className="flex justify-between p-6 border-b items-center gap-2 bg-white shadow rounded-md mb-4">
                            <div className='flex gap-2 font-medium text-sm'>
                                <button
                                    className={`group border shadow rounded-md hover:bg-slate-200 hover:text-blue-900 px-4 py-2 ${filter === 'All' ? 'bg-blue-500 text-white' : ''}`}
                                    onClick={() => setFilter('All')}
                                >
                                    All <span className={`text-blue-600 ${filter === 'All' ? 'text-white' : ''} group-hover:text-blue-600`}>({scholarshipPrograms.length})</span>
                                </button>

                                <button
                                    className={`group border shadow rounded-md hover:bg-slate-200 hover:text-yellow-900 px-4 py-2 ${filter === 'Awaiting Publication' ? 'bg-yellow-500 text-white' : ''}`}
                                    onClick={() => setFilter('Awaiting Publication')}
                                >
                                    Awaiting Publication <span className={`${filter === 'Awaiting Publication' ? 'text-white' : 'text-yellow-600'} group-hover:text-yellow-600`}>({scholarshipPrograms.filter(program => program.status === 'Awaiting Publication').length})</span>
                                </button>

                                <button
                                    className={`group border shadow rounded-md hover:bg-slate-200 hover:text-indigo-900 px-4 py-2 ${filter === 'Published' ? 'bg-indigo-500 text-white' : ''}`}
                                    onClick={() => setFilter('Published')}
                                >
                                    Published <span className={`text-indigo-600 ${filter === 'Published' ? 'text-white' : ''} group-hover:text-indigo-600`}> ({scholarshipPrograms.filter(program => program.status === 'Published').length})</span>
                                </button>

                                <button
                                    className={`group border shadow rounded-md hover:bg-slate-200 hover:text-teal-900 px-4 py-2 ${filter === 'Ongoing' ? 'bg-teal-500 text-white' : ''}`}
                                    onClick={() => setFilter('Ongoing')}
                                >
                                    Ongoing <span className={`text-teal-600 ${filter === 'Ongoing' ? 'text-white' : ''} group-hover:text-teal-600`}> ({scholarshipPrograms.filter(program => program.status === 'Ongoing').length})</span>
                                </button>

                                <button
                                    className={`group border shadow rounded-md hover:bg-slate-200 hover:text-green-900 px-4 py-2 ${filter === 'Completed' ? 'bg-green-500 text-white' : ''}`}
                                    onClick={() => setFilter('Completed')}
                                >
                                    Completed <span className={`text-green-600 ${filter === 'Completed' ? 'text-white' : ''} group-hover:text-green-600`}>({scholarshipPrograms.filter(program => program.status === 'Completed').length})</span>
                                </button>
                            </div>

                            <input
                                type="text"
                                placeholder='Search Scholarship Program'
                                className='p-2 border rounded-md w-1/3'
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
                                                <th scope="col" className="px-3 py-3 text-left text-xs uppercase tracking-wider">
                                                    Title
                                                </th>
                                                <th scope="col" className="px-3 py-3 text-center text-xs uppercase tracking-wider">
                                                    Organization Name
                                                </th>
                                                <th scope="col" className="px-3 py-3 text-center text-xs uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th scope="col" className="px-3 py-3 text-center text-xs uppercase tracking-wider">
                                                    Slots
                                                </th>
                                                <th scope="col" className="px-3 py-3 text-center text-xs uppercase tracking-wider sticky right-0 bg-slate-50">
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
                                                        <h1 className='text-base font-medium text-gray-800 break-words'>{truncate(scholarship.title, 30)}</h1>
                                                    </td>
                                                    <td className="px-6 py-4 text-center whitespace-nowrap">
                                                        <span className='text-base font-medium text-gray-800'>{truncate(scholarship.organizationName, 30)}</span>
                                                    </td>
                                                    <td className="px-6 py-4 text-center whitespace-nowrap">
                                                        <span className={`text-base font-medium 
                                                                                    ${scholarship.status === 'Published' ? 'bg-indigo-500 text-white font-semibold text-sm px-4 py-2 rounded-md' : ''} 
                                                                                    ${scholarship.status === 'Ongoing' ? 'bg-teal-500 text-white font-semibold text-sm px-4 py-2 rounded-md' : ''} 
                                                                                    ${scholarship.status === 'Archived' ? 'bg-gray-500 text-white font-semibold text-sm px-4 py-2 rounded-md' : ''} 
                                                                                    ${scholarship.status === 'Cancelled' ? 'bg-orange-500 text-white font-semibold text-sm px-4 py-2 rounded-md' : ''} 
                                                                                    ${scholarship.status === 'Completed' ? 'bg-green-500 text-white font-semibold text-sm px-4 py-2 rounded-md' : ''} 
                                                                                    ${scholarship.status === 'Awaiting Publication' ? 'bg-yellow-500 text-white font-semibold text-sm px-4 py-2 rounded-md' : ''}`}>
                                                            {scholarship.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-center whitespace-nowrap">
                                                        <span className='text-slate-600'>{scholarship.approvedScholars.length}/{scholarship.numberOfScholarships}</span>
                                                    </td>
                                                    <td className="px-6 py-4 text-center whitespace-nowrap sticky right-0 bg-white">
                                                        <Link to={`/scholarship-program/${scholarship._id}`} className="bg-blue-600 text-white px-4 ml-2 py-1 rounded-md hover:bg-blue-800 whitespace-nowrap">
                                                            View Details
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
                </div>
            </main>
        </div>
    );
}