import React, {useState} from "react";
import { Link } from "react-router-dom";
import { BiFilter } from "react-icons/bi";

export default function Inbox (){

    return(
        <div className="flex flex-col min-h-screen font-medium text-slate-700">
        <main className="flex-grow bg-[#f8f8fb]">
           <div className='border-b mb-8'>
                   <div className={'flex items-center mx-auto justify-between px-24'}>
                       <div className='flex flex-col gap-2 w-1/2'>
                       <h1 className='text-4xl font-bold text-gray-800'>Inbox</h1>
                       <p className='text-lg text-slate-500 font-medium'>This will be the inbox for the admin</p>
                       </div>
                       <div className='bg-blue-600 w-36 h-36 my-8 rounded-md'></div>
                   </div>
                   </div>
               <div className='max-w-8xl mx-auto px-24 gap-10 flex-col flex'>

                <div className="grid grid-cols-3 gap-8">
                    <button className="bg-white rounded-md shadow p-4 flex flex-col justify-center items-center hover:bg-slate-200 hover:-translate-y-2 transition ease-in-out">
                        <span className="text-slate-500">Scholarships</span>
                        <span className="text-4xl">20</span>
                    </button>
                    <button className="bg-white rounded-md shadow p-4 flex flex-col justify-center items-center hover:bg-slate-200 hover:-translate-y-2 transition ease-in-out">
                        <span className="text-slate-500">Applications</span>
                        <span className="text-4xl">20</span>
                    </button>
                    <button className="bg-white rounded-md shadow p-4 flex flex-col justify-center items-center hover:bg-slate-200 hover:-translate-y-2 transition ease-in-out">
                        <span className="text-slate-500">Requests</span>
                        <span className="text-4xl">20</span>
                    </button>
                </div>

                {/* Activity */}

                <div className="flex flex-col mt-10">
                    
                    <span className="font-bold text-xl border-b w-full pb-2">Activity</span>

                    <div className="flex justify-end mt-4 gap-4">
                        <input 
                        type="text"
                        placeholder="Search in the inbox..."
                        className="border border-gray-300 rounded-md p-2 pr-8"
                        />

                        <button className="bg-blue-600 px-4 py-2 rounded-md flex gap-2 text-white">
                            <BiFilter className="w-6 h-6" />
                            <span>Filter</span>
                        </button>
                    </div>

                    <div className="bg-white border rounded-md mt-4 divide-y">
                        <div className="flex justify-between items-center p-4">
                            <div className="flex items-center gap-4">
                                <div className="bg-blue-600 w-14 h-14 rounded-full"></div>
                                <div className="gap-2 flex">
                                    <span className="font-bold">DepEd</span>
                                    <span className="text-slate-500">Posted a Scholarship</span>
                                </div>
                            </div>
                            <span className="text-slate-500">2 hours ago</span>
                        </div>

                        <div className="flex justify-between items-center p-4">
                            <div className="flex items-center gap-4">
                                <div className="bg-blue-600 w-14 h-14 rounded-full"></div>
                                <div className="gap-2 flex">
                                    <span className="font-bold">John Doe</span>
                                    <span className="text-slate-500">Requested Verification</span>
                                </div>
                            </div>
                            <span className="text-slate-500">2 hours ago</span>
                        </div>

                        <div className="flex justify-between items-center p-4">
                            <div className="flex items-center gap-4">
                                <div className="bg-blue-600 w-14 h-14 rounded-full"></div>
                                <div className="gap-2 flex">
                                    <span className="font-bold">John Doe</span>
                                    <span className="text-slate-500">Sent a Scholarship Application to <span className="text-blue-600">DepEd</span></span>
                                </div>
                            </div>
                            <span className="text-slate-500">2 hours ago</span>
                        </div>

                    </div>

                </div>
                
            </div>
        </main>
        </div>
    );
}