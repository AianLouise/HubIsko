import React from "react";
import { Link } from "react-router-dom";
import { GoDotFill } from "react-icons/go";
import { BiFilter } from "react-icons/bi";
import Layout from "../../components/Layout";


export default function ScholarshipsData() {

    return (
        <div className="flex flex-col min-h-screen font-medium text-slate-700">
            <Layout />
        <main className="flex-grow bg-[#f8f8fb]">
           <div className='border-b mb-8'>
                   <div className={'flex items-center mx-auto justify-between px-24'}>
                       <div className='flex flex-col gap-2 w-1/2'>
                       <h1 className='text-4xl font-bold text-gray-800'>Scholarship Programs</h1>
                       </div>
                       <div className='bg-blue-600 w-36 h-36 my-8 rounded-md'></div>
                   </div>
                   </div>
               <div className='max-w-8xl mx-auto px-24 gap-10 flex-col flex'>
                
               <div className="flex justify-between gap-10">
                    <div className="flex gap-10 w-1/3 h-[300px] flex-col justify-center items-center bg-white shadow rounded-md p-6">
                        <h2 className="text-4xl font-semibold text-slate-600">Total Scholarships</h2>
                        <span className="text-6xl font-bold text-left text-blue-600">100</span>
                    </div>

                <div className="w-full bg-white rounded-md shadow border">
                <h1 className="p-2 border-b">Scholarship Activities</h1>

                <div className="grid grid-rows-1 divide-y">
                     <div className="flex justify-between w-full items-center p-4">

                        <div className="flex">
                            <div className="bg-blue-600 w-10 h-10 rounded-full"></div>
                                <div className="flex flex-col ml-4">
                                <h1 className="text-lg font-semibold">Deped</h1>

                                    <div className="flex items-center gap-4">
                                    <p className="text-slate-500">Posted a Scholarship</p>
                                    </div>
                            </div>
                        </div>

                            <div className="flex items-center gap-2">
                                    <GoDotFill className="text-blue-600" /> 
                                    <span className="text-blue-600">1 hour ago</span>
                            </div>

                        </div>

                    <div className="flex justify-between w-full items-center p-4">

                    <div className="flex">
                        <div className="bg-blue-600 w-10 h-10 rounded-full"></div>
                            <div className="flex flex-col ml-4">
                            <h1 className="text-lg font-semibold">Deped</h1>

                                <div className="flex items-center gap-4">
                                <p className="text-slate-500">Received 3 new Applications</p>
                                </div>
                        </div>
                    </div>

                        <div className="flex items-center gap-2">
                                <GoDotFill className="text-blue-600" /> 
                                <span className="text-blue-600">1 hour ago</span>
                        </div>

                    </div>

                </div>
                </div>
                </div>

                <div className="flex flex-col gap-2">
                    <h1 className="border-b pb-4 text-xl">Scholarships</h1>

                    <div className="flex gap-4 mt-5">
                    <input 
                    type="text" 
                    placeholder="Search for a scholarship"
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
                            <th className='border border-gray-200 p-2'>Organization</th>
                            <th className='border border-gray-200 p-2'>Email</th>
                            <th className='border border-gray-200 p-2'>Status</th>
                            <th className='border border-gray-200 p-2'>Details</th>
                        
                        </tr>
                    </thead>
                    <tbody className="text-center">
                        <tr className="divide-x">
                            <td className='p-2'>DepEd</td>
                            <td className='p-2'>sample@email.com</td>
                            <td className='p-2 text-yellow-500'>Requesting for Posting</td>
                            <td className="p-4"> 
                                <Link to={'/scholarships-data-details'} className="bg-blue-600 hover:bg-blue-800 px-4 py-2 rounded-md text-white">View Details</Link>
                            </td>
                          
                        </tr>
                    </tbody>
                </table>


                </div>

        </div>
        </main>
        </div>

    );

}