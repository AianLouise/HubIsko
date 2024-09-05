import React from "react";
import { BsPencilFill } from "react-icons/bs";



export default function AdminSettings() {
    return (
    <div className="flex flex-col min-h-screen">
         <main className="flex-grow bg-[#f8f8fb] font-medium text-slate-700">


        <div className="max-w-8xl flex flex-col gap-10 px-20 mt-10">
            <div className="flex gap-10">
                <div className="bg-white shadow border rounded-md p-8 w-1/2">
                    <div className="flex justify-between">
                    <span className="text-xl font-bold">Profile Information</span>
                    <button className="flex gap-2 bg-blue-600 hover:bg-blue-800 text-white items-center px-4 py-2 rounded-md">
                        <BsPencilFill className="text-xl"/>
                        Edit</button>
                    </div>
                   
                    <div className="flex items-center gap-10 py-10 w-full border-b mb-10">
                        <div className="bg-blue-600 w-40 h-40 rounded-full"></div>

                        <div className="flex flex-col items-left gap-2">
                        <span className="text-slate-500">Admin</span>
                        <span className="text-3xl font-bold">Admin Name</span>
                        <span className="text-2xl">Followers:</span>
                        <span className="text-slate-500">Admin Email</span>
                        </div>
                                      
                    </div>

                    <div className="grid grid-cols-2 gap-8 w-full">

                         <div className="flex flex-col">
                        <label className="px-2">Admin Name</label>
                        <input 

                        value={"Admin Name"}
                        type="text" 
                        disabled
                        className="border rounded-md bg-slate-200 p-2 text-slate-500"
                        />
                        </div>

                        <div className="flex flex-col">
                        <label className="px-2">Admin Contact No.</label>
                        <input 

                        value={"09123456789"}
                        type="text" 
                        disabled
                        className="border rounded-md bg-slate-200 p-2 text-slate-500"
                        />
                        </div>

                        <div className="flex flex-col">
                        <label className="px-2">Admin Email</label>
                        <input 

                        value={"09123456789"}
                        type="text" 
                        disabled
                        className="border rounded-md bg-slate-200 p-2 text-slate-500"
                        />
                        </div>

                        
                        <div className="flex flex-col">
                        <label className="px-2">Admin Address</label>
                        <input 

                        value={"Admin Address"}
                        type="text" 
                        disabled
                        className="border rounded-md bg-slate-200 p-2 text-slate-500"
                        />
                        </div>
                        </div>
                    </div>


                    <div className="flex flex-col bg-white shadow border rounded-md p-8 w-1/2">
                    <span className="text-xl font-bold">Time Spent</span>
                    <div className="border rounded-md items-center justify-center flex h-full my-10">
                        <span>Container for Time graph</span>
                    </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4">

                <div className="border-t-2 mt-4">
                    <div className="flex items-center w-full justify-center">
                     <span className="bg-[#f8f8fb] px-8 -translate-y-3 text-xl text-slate-500">Log History</span>
                    </div>       
                </div>

                <div className="flex justify-between">
                    <div  className="flex gap-4">
                    <button className="px-4 py-2 rounded-md bg-white border shadow">All Activity (0)</button>
                    <button className="px-4 py-2 rounded-md bg-white border shadow">Accounts (0)</button>
                    <button className="px-4 py-2 rounded-md bg-white border shadow">Scholarships (0)</button>
                    </div>

                    <input 
                    
                    placeholder="Search"
                    type="text" 
                    className="border-2 rounded-md bg-slate-100 p-2 w-[300px] text-slate-700"
                    />

                </div>
                <div className="flex bg-white p-4 border shadow rounded-md">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Activity
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    User
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    ID
                                </th>
                            </tr>
                        </thead>

                        <tbody className="bg-white divide-y divide-gray-200">
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">Name Change</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">2023-10-01</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">User A</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    Activity ID
                                </td>
                            </tr>
                          
                        </tbody>
                    </table>
                </div>

                </div>
                

            </div>

        </main>
    </div>
    );
    }
