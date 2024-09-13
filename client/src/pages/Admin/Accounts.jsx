import React, { useEffect, useState } from "react";
import AdminHeader from "../../components/AdminHeader";
import { BiFilter } from "react-icons/bi";
import { Link } from "react-router-dom";
import { PiArrowRightFill } from "react-icons/pi";
import { GoDotFill } from "react-icons/go";
import Layout from "../../components/Layout";
import { FaUsers } from "react-icons/fa";
import { FaUserClock } from "react-icons/fa6";
import { RiGraduationCapFill } from "react-icons/ri";
import { FaBuildingCircleCheck } from "react-icons/fa6";
import { IoAddCircleOutline } from 'react-icons/io5';



const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
        case 'pending verification':
            return 'bg-yellow-500';
        case 'verified':
            return 'bg-green-600';
        case 'rejected':
            return 'bg-red-500';
        default:
            return 'bg-gray-500';
    }
};

const getRoleColor = (role) => {
    switch (role.toLowerCase()) {
        case 'applicant':
            return 'bg-blue-600';
        case 'scholarship_provider':
            return 'bg-green-600';
        default:
            return 'bg-gray-500';
    }
};


const toSentenceCase = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const getAccountLink = (account) => {
    if (account.role === 'applicant') {
        return <Link to={`/student-details/${account._id}`} className="bg-blue-600 hover:bg-blue-800 px-4 py-1 rounded-md text-white">View Details</Link>;
    } else if (account.role === 'scholarship_provider') {
        return <Link to={`/provider-details/${account._id}`} className="bg-blue-600 hover:bg-blue-800 px-4 py-1 rounded-md text-white">View Details</Link>;
    } else {
        return null;
    }
};

export default function Accounts() {
    useEffect(() => {
        document.title = "Accounts | HubIsko";
    }, []);

    const [totalAccounts, setTotalAccounts] = useState(0);
    const [totalUnverifiedAccounts, setTotalUnverifiedAccounts] = useState(0);
    const [totalApplicants, setTotalApplicants] = useState(0);
    const [totalScholarshipProviders, setTotalScholarshipProviders] = useState(0);
    const [accounts, setAccounts] = useState([]);
    const [providers, setProviders] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTotalAccounts = async () => {
            try {
                const response = await fetch('/api/admin/total-accounts');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setTotalAccounts(data.totalAccounts);
            } catch (error) {
                console.error('Error fetching total accounts:', error);
            }
        };

        const fetchTotalUnverifiedAccounts = async () => {
            try {
                const response = await fetch('/api/admin/total-unverified-accounts');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setTotalUnverifiedAccounts(data.totalUnverifiedAccounts);
            } catch (error) {
                console.error('Error fetching total unverified accounts:', error);
            }
        };

        const fetchTotalApplicants = async () => {
            try {
                const response = await fetch('/api/admin/total-applicants');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setTotalApplicants(data.totalApplicants);
            } catch (error) {
                console.error('Error fetching total applicants:', error);
            }
        };

        const fetchTotalScholarshipProviders = async () => {
            try {
                const response = await fetch('/api/admin/total-scholarship-providers');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setTotalScholarshipProviders(data.totalScholarshipProviders);
            } catch (error) {
                console.error('Error fetching total scholarship providers:', error);
            }
        };

        const fetchAccounts = async () => {
            try {
                const response = await fetch('/api/admin/all-users');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setAccounts(data.users); // Update to use data.users instead of data.accounts
                setLoading(false);
            } catch (error) {
                console.error('Error fetching accounts:', error);
                setError(error);
                setLoading(false);
            }
        };


        fetchTotalApplicants();
        fetchTotalUnverifiedAccounts();
        fetchTotalAccounts();
        fetchTotalScholarshipProviders();
        fetchAccounts();
    }, []);

    const totalVerifyAccount = accounts.filter(account => account.status === 'Verify Account').length;
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('All');

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleFilterClick = (filter) => {
        setSelectedFilter(filter);
    };

    const toggleFilter = () => {
        setSelectedFilter(prevFilter => (prevFilter === 'Latest' ? 'Old' : 'Latest'));
    };

    const filteredAccounts = accounts.filter(account => {
        const matchesSearchQuery = account.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            account.email.toLowerCase().includes(searchQuery.toLowerCase());

        if (!matchesSearchQuery) return false;

        switch (selectedFilter) {
            case 'Pending':
                return account.status === 'Pending Verification';
            case 'Verified Students':
                return account.role === 'Applicant' && account.status === 'Verified';
            case 'Verified Scholarship Providers':
                return account.role === 'scholarship_provider' && account.status === 'Verified';
            case 'Verify Account':
                return account.status === 'Verify Account';
            default:
                return true;
        }
    }).sort((a, b) => {
        if (selectedFilter === 'Latest') {
            return new Date(b.createdAt) - new Date(a.createdAt);
        } else if (selectedFilter === 'Old') {
            return new Date(a.createdAt) - new Date(b.createdAt);
        }
        return 0;
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

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="flex flex-col min-h-screen font-medium text-slate-700">

            <main className="flex-grow bg-[#f8f8fb]">
                {/* <div className='border-b mb-8'>
                    <div className={'flex items-center mx-auto justify-between px-24'}>
                        <div className='flex flex-col gap-2 w-1/2'>
                            <h1 className='text-4xl font-bold text-gray-800'>Accounts</h1>
                            <p className='text-lg text-slate-500 font-medium'>Manage all types of accounts here.</p>
                        </div>
                        <div className='bg-blue-600 w-36 h-36 my-8 rounded-md'></div>
                    </div>
                </div> */}

                <div className='max-w-8xl mx-auto px-24  gap-2 mt-4 flex-col flex'>
                    <div className="flex items-center justify-between pb-2">
                        <h1 className="text-xl font-bold">Accounts</h1>
                        <button className="flex items-center gap-2 px-6 py-2 rounded-md shadow bg-blue-600 text-white">
                            <IoAddCircleOutline className="w-6 h-6" />
                            Add an Account</button>
                    </div>

                    <div className="flex gap-2">
                        <div className="flex flex-col w-full bg-white border shadow gap-10 p-4 rounded-md">
                            <span>Filler Container</span>
                            <div className="border flex items-center justify-center h-full rounded-md">
                                Filler
                            </div>
                        </div>

                        <div className="grid grid-cols-2 w-[1000px] gap-2">
                            <div className="flex flex-col gap-4 justify-center bg-white shadow border rounded-md p-8">
                                <div className="flex items-center gap-4">
                                    <FaUsers className="w-8 h-8 text-blue-600" />
                                    <h2 className="text-lg font-semibold text-slate-500 tracking-wide">Total Accounts</h2>
                                </div>

                                <div className="flex flex-col gap-4">
                                    <span className="text-6xl font-bold text-left">{totalAccounts}</span>
                                    <span className="text-slate-400">+0 new accounts</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4 justify-center bg-white shadow border rounded-md p-8">

                                <div className="flex items-center gap-3">
                                    <FaUserClock className="w-8 h-8 text-blue-600" />
                                    <h2 className="text-lg font-semibold text-slate-500">Unverified Accounts</h2>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <span className="text-6xl font-bold text-left">{totalUnverifiedAccounts}</span>
                                    <span className="text-slate-400">+0 pending</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4 justify-center bg-white shadow border rounded-md p-8">

                                <div className="flex items-center gap-3">
                                    <RiGraduationCapFill className="w-8 h-8 text-blue-600" />
                                    <h2 className="text-lg font-semibold text-slate-500">Total Students</h2>
                                </div>

                                <div className="flex flex-col gap-4">
                                    <span className="text-6xl font-bold text-left">{totalApplicants}</span>
                                    <span className="text-slate-400">+0 new students</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4 justify-center bg-white shadow border rounded-md p-8">

                                <div className="flex items-center gap-3">
                                    <FaBuildingCircleCheck className="w-8 h-8 text-blue-600" />
                                    <h2 className="text-lg font-semibold text-slate-500">Scholarship Providers</h2>
                                </div>

                                <div className="flex flex-col gap-4">
                                    <span className="text-6xl font-bold text-left">{totalScholarshipProviders}</span>
                                    <span className="text-slate-400">+0 new providers</span>
                                </div>
                            </div>

                            {/* <div className="flex justify-between items-center bg-white p-6 rounded-md shadow-md">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-xl font-semibold text-slate-700">Total Unverified Users</h2>
                                    
                                    </div>
                                    <p className="text-2xl font-bold text-left">{totalUnverifiedAccounts}</p>
                                </div>
                            </div>

                            <Link to={'/students'} className="flex justify-between items-center bg-white p-6 rounded-md shadow-md transition-all hover:-translate-y-2 hover:bg-slate-200 group ease-in-out">
                                <div>
                                    <h2 className="text-xl font-semibold text-slate-700">Total Students</h2>
                                    <p className="text-2xl font-bold text-left">{totalApplicants}</p>
                                </div>
                                <div className="group-hover:flex items-center gap-2 text-blue-600 hidden">
                                    <span className="text-xl">View</span>
                                    <PiArrowRightFill className="w-6 h-6" />
                                </div>
                            </Link>
                            <Link to={'/provider-accounts'} className="flex justify-between items-center bg-white p-6 rounded-md shadow-md transition-all hover:-translate-y-2 hover:bg-slate-200 group ease-in-out">
                                <div>
                                    <h2 className="text-xl font-semibold text-slate-700">Total Scholarship Providers</h2>
                                    <p className="text-2xl font-bold text-left">{totalScholarshipProviders}</p>
                                </div>
                                <div className="group-hover:flex items-center gap-2 text-blue-600 hidden">
                                    <span className="text-xl">View</span>
                                    <PiArrowRightFill className="w-6 h-6" />
                                </div>
                            </Link> */}

                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="flex justify-between gap-4 mt-5">
                            <div className="flex gap-2 items-center">
                                <div className="flex gap-2">
                                    <button onClick={() => handleFilterClick('All')} className="px-4 py-2 rounded-md bg-white shadow border">
                                        All <span className="text-blue-600">({accounts.length})</span>
                                    </button>
                                    <button onClick={() => handleFilterClick('Verify Account')} className="px-4 py-2 rounded-md bg-white shadow border">
                                        Verify Account <span className="text-gray-600">({totalVerifyAccount})</span>
                                    </button>
                                    <button onClick={() => handleFilterClick('Pending')} className="px-4 py-2 rounded-md bg-white shadow border">
                                        Pending <span className="text-yellow-500">({accounts.filter(account => account.status === 'Pending Verification').length})</span>
                                    </button>
                                    <button onClick={() => handleFilterClick('Verified Students')} className="px-4 py-2 rounded-md bg-white shadow border">
                                        Verified Students <span className="text-green-600">({accounts.filter(account => account.role === 'Applicant' && account.status === 'Verified').length})</span>
                                    </button>
                                    <button onClick={() => handleFilterClick('Verified Scholarship Providers')} className="px-4 py-2 rounded-md bg-white shadow border">
                                        Verified Scholarship Providers <span className="text-green-600">({accounts.filter(account => account.role === 'scholarship_provider' && account.status === 'Verified').length})</span>
                                    </button>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <div className="flex flex-col w-full bg-white border shadow gap-10 p-4 rounded-md">
                                    <div className="flex justify-between items-center">
                                        <input
                                            type="text"
                                            placeholder="Search for a scholarship program"
                                            className="w-96 px-4 py-2 border rounded-md"
                                            value={searchQuery}
                                            onChange={handleSearchChange}
                                        />
                                        <button onClick={toggleFilter} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-800 text-white p-2 rounded-md">
                                            <BiFilter className="w-6 h-6" />
                                            <span>{selectedFilter === 'Latest' ? 'Latest' : 'Old'}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="border rounded-md">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr className='text-blue-600'>
                                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredAccounts && filteredAccounts.length > 0 ? (
                                        filteredAccounts.map(account => (
                                            <tr key={account._id} className="hover:bg-gray-100">
                                                <td className="p-4">{account.username}</td>
                                                <td className="p-4">{account.email}</td>
                                                <td className="p-4">
                                                    <span className={`px-4 py-1 text-white mr-2 rounded-full ${getRoleColor(account.role)}`}>
                                                        {account.role === 'applicant' ? 'Student' : account.role === 'scholarship_provider' ? 'Scholarship Provider' : toSentenceCase(account.role)}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    <span className={`inline-block w-3 h-3 mr-2 rounded-full ${getStatusColor(account.status)}`}></span>
                                                    {toSentenceCase(account.status)}
                                                </td>
                                                <td className="p-4">
                                                    {getAccountLink(account)}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="p-4 text-gray-600 text-center">No accounts found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-8"></div> {/* Added space after the table */}
                    </div>

                </div>
            </main>
        </div>
    );
}