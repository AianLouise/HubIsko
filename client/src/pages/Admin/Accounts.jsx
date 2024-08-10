import React, {useState} from "react";
import AdminHeader from "../../components/AdminHeader";

export default function Accounts() {

    return (
        <div className="flex flex-col min-h-screen">
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
                        <span className="text-6xl font-bold text-left">100</span>
                    </div>
                    
                    <div className="grid grid-rows-3 gap-10 w-full">
                            <button className="flex justify-between items-center bg-white p-6 rounded-md shadow-md transition-all hover:-translate-y-2 hover:bg-slate-200 group ease-in-out">
                                <div>
                                    <h2 className="text-xl font-semibold text-slate-700">Total Unverified Users</h2>
                                    <p className="text-2xl font-bold text-left">50</p>
                                </div>
                            </button>

                            <button className="flex justify-between items-center bg-white p-6 rounded-md shadow-md transition-all hover:-translate-y-2 hover:bg-slate-200 group ease-in-out">
                                <div>
                                    <h2 className="text-xl font-semibold text-slate-700">Total Students</h2>
                                    <p className="text-2xl font-bold text-left">40</p>
                                </div>
                            </button>

                            <button className="flex justify-between items-center bg-white p-6 rounded-md shadow-md transition-all hover:-translate-y-2 hover:bg-slate-200 group ease-in-out">
                                <div>
                                    <h2 className="text-xl font-semibold text-slate-700">Total Scholarship Providers</h2>
                                    <p className="text-2xl font-bold text-left">10</p>
                                </div>
                            </button>
                
                    </div>
                </div>
            </div>
        </main>
        </div>
    );
}