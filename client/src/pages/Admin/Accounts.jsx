import React, { useEffect, useState } from "react";
import AdminHeader from "../../components/AdminHeader";
import { BiFilter } from "react-icons/bi";
import { Link } from "react-router-dom";
import { PiArrowRightFill } from "react-icons/pi";
import { GoDotFill } from "react-icons/go";
import Layout from "../../components/Layout";

export default function Accounts() {
    const [totalAccounts, setTotalAccounts] = useState(0);
    const [totalUnverifiedAccounts, setTotalUnverifiedAccounts] = useState(0);
    const [totalApplicants, setTotalApplicants] = useState(0);
    const [totalScholarshipProviders, setTotalScholarshipProviders] = useState(0);
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

        const fetchPendingProviders = async () => {
            try {
                const response = await fetch('/api/admin/pending-scholarship-providers');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setProviders(data.providers);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        const fetchPendingPrograms = async () => {
            try {
                const response = await fetch('/api/admin/pending-scholarship-programs');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setPrograms(data.programs);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };


        fetchTotalApplicants();
        fetchTotalUnverifiedAccounts();
        fetchTotalAccounts();
        fetchTotalScholarshipProviders();
        fetchPendingProviders();
        fetchPendingPrograms();
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

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="flex flex-col min-h-screen font-medium text-slate-700 pb-10">
            <Layout />
            <main className="flex-grow bg-[#f8f8fb]">
                <div className='border-b mb-8'>
                    <div className={'flex items-center mx-auto justify-between px-24'}>
                        <div className='flex flex-col gap-2 w-1/2'>
                            <h1 className='text-4xl font-bold text-gray-800'>Accounts</h1>
                        </div>
                        <div className='bg-blue-600 w-36 h-36 my-8 rounded-md'></div>
                    </div>
                </div>
                <div className='max-w-8xl mx-auto px-24 gap-10 flex-col flex'>


                    <div className="flex justify-between gap-10">
                        <div className="flex gap-10 w-1/3 flex-col justify-center items-center bg-white shadow rounded-md p-6">
                            <h2 className="text-4xl font-semibold text-slate-600">Total Accounts</h2>
                            <span className="text-6xl font-bold text-left text-blue-600">{totalAccounts}</span>
                        </div>

                        <div className="grid grid-rows-3 gap-10 w-full">
                            <div className="flex justify-between items-center bg-white p-6 rounded-md shadow-md">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-xl font-semibold text-slate-700">Total Unverified Users</h2>
                                        {/* <span className="flex gap-2 items-center text-blue-600"><GoDotFill /> 5 new users</span> */}
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
                            </Link>

                        </div>
                    </div>

                    <div className="flex flex-col">
                        <span className="font-bold text-xl border-b w-full pb-2">Request for Scholarship Provider Verification</span>

                        <div className="flex gap-4 mt-5">
                            <input
                                type="text"
                                placeholder="Search for a request"
                                className="border rounded-md p-2"
                            />
                            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-800 text-white p-2 rounded-md">
                                <BiFilter className="w-6 h-6" />
                                <span>Filter</span>
                            </button>
                        </div>

                        <table className='w-full mt-4 rounded-md border border-gray-200'>
                            <thead className="border-2 rounded-md">
                                <tr className='bg-slate-100'>
                                    <th className='border border-gray-200 p-2'>Name</th>
                                    <th className='border border-gray-200 p-2'>Email</th>
                                    <th className='border border-gray-200 p-2'>Role Request</th>
                                    <th className='border border-gray-200 p-2'>Details</th>
                                    <th className='border border-gray-200 p-2'>Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-center">
                                {providers && providers.length > 0 ? (
                                    providers.map(provider => (
                                        <tr key={provider._id} className="divide-x">
                                            <td className='p-2'>{provider.scholarshipProviderDetails.organizationName}</td>
                                            <td className='p-2'>{provider.email}</td>
                                            <td className='p-2'>Scholarship Provider</td>
                                            <td>
                                                <Link to={`/verification-details/${provider._id}`} className="bg-blue-600 hover:bg-blue-800 px-4 py-2 rounded-md text-white">View Details</Link>
                                            </td>
                                            <td className='p-2 flex gap-2 justify-center items-center'>
                                                <button className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-800">Verify</button>
                                                <button className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-700">Decline</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="p-4 text-gray-600">No pending scholarship verification requests for scholarship providers.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>


                    <div className="flex flex-col">
                        <span className="font-bold text-xl border-b w-full pb-2">Request for Scholarship Program Verification</span>

                        <div className="flex gap-4 mt-5">
                            <input
                                type="text"
                                placeholder="Search for a request"
                                className="border rounded-md p-2"
                            />

                            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-800 text-white p-2 rounded-md">
                                <BiFilter className="w-6 h-6" />
                                <span>Filter</span>
                            </button>
                        </div>

                        <table className='w-full mt-4 rounded-md border border-gray-200'>
                            <thead className="border-2 rounded-md">
                                <tr className='bg-slate-100'>
                                    <th className='border border-gray-200 p-2'>Program Name</th>
                                    <th className='border border-gray-200 p-2'>Provider</th>
                                    <th className='border border-gray-200 p-2'>Email</th>
                                    <th className='border border-gray-200 p-2'>Details</th>
                                    <th className='border border-gray-200 p-2'>Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-center">
                                {programs && programs.length > 0 ? (
                                    programs.map(program => (
                                        <tr key={program._id} className="divide-x">
                                            <td className='p-2'>{program.title}</td>
                                            <td className='p-2'>{program.organizationName}</td>
                                            <td className='p-2'>{program.contactEmail}</td>
                                            <td>
                                                <Link to={`/verification-details/${program._id}`} className="bg-blue-600 hover:bg-blue-800 px-4 py-2 rounded-md text-white">View Details</Link>
                                            </td>
                                            <td className='p-2 flex gap-2 justify-center items-center'>
                                                <button className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-800">Verify</button>
                                                <button className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-700">Decline</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="p-4 text-gray-600">No pending scholarship verification requests for scholarship programs.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>



                </div>
            </main>
        </div>
    );
}