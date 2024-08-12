import React from "react";
import { Link } from "react-router-dom";
import { IoMdArrowDropdown } from "react-icons/io";

export default function ScholarshipsDataDetails() {

    return (   
        <div className="flex flex-col min-h-screen font-medium text-slate-700">
        <main className="flex-grow bg-[#f8f8fb] pb-24">

        <div className='max-w-8xl mx-auto px-24 gap-10 flex-col flex mt-16'>

        <div className="flex gap-2 items-center">
                <Link to={'/scholarships-data'} className="border shadow px-6 py-2 bg-white rounded-md hover:bg-slate-200">
                    <span>Scholarships</span>
                </Link>
                <IoMdArrowDropdown className='-rotate-90 w-8 h-8 text-blue-600' />

                <div className="border shadow px-6 py-2 bg-white rounded-md">
                    <span className="text-blue-600">Deped Scholarship Verification</span>
                </div>
            </div>

            <div className="mt-8 bg-white p-8 rounded-md shadow-md w-full">
                
                <div className="text-lg font-bold bg-slate-200 border-2 px-4 py-2 rounded-md">Scholarship Container Information</div>    

                <div className="grid grid-cols-3 gap-8 my-4 border-b pb-4">
                    <div className="">
                        <label className="block text-sm font-medium text-slate-400">Scholarship Title</label>
                        <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">Sample</span>
                    </div>
                    <div className="">
                        <label className="block text-sm font-medium text-slate-400">Amount Offered</label>
                        <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">Php 50,000 ~ 100,000</span>
                    </div>
                    <div className="">
                        <label className="block text-sm font-medium text-slate-400">Total Slots</label>
                        <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">50</span>
                    </div>
                    <div className="">
                            <label className="block text-sm font-medium text-slate-400">GWA</label>
                            <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">1.25 ~ 1.50</span>
                        </div>
                    <div className="">
                        <label className="block text-sm font-medium text-slate-400">Duration</label>
                        <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">2 semester</span>
                    </div>
                    <div className="">
                        <label className="block text-sm font-medium text-slate-400">Category</label>
                        <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">Undergraduate</span>
                    </div>
                </div>

                <div className="text-lg font-bold bg-slate-200 border-2 px-4 py-2 rounded-md">Requirements</div>  
                
                <div className="grid grid-rows-2 grid-cols-3 items-center my-4 border-b pb-4">
                    <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="requirement1"
                        name="requirement"
                        value="requirement1"
                        checked
                        readOnly
                        disabled
                        className="mr-2"
                    />
                    <label htmlFor="requirement1" className="text-sm font-medium text-slate-700">Requirement 1</label>
                    </div>
                    <div className="flex items-center mt-2">
                        <input
                            type="checkbox"
                            id="requirement2"
                            name="requirement"
                            value="requirement2"
                            checked = {false}
                            readOnly
                            disabled
                            className="mr-2"
                        />
                        <label htmlFor="requirement2" className="text-sm font-medium text-slate-700">Requirement 2</label>
                    </div>

                    <div className="flex items-center mt-2">
                        <input
                            type="checkbox"
                            id="requirement3"
                            name="requirement"
                            value="requirement3"
                            checked
                            readOnly
                            disabled
                            className="mr-2"
                        />
                        <label htmlFor="requirement3" className="text-sm font-medium text-slate-700">Requirement 3</label>
                        </div>

                        <div className="flex items-center mt-2">
                        <input
                            type="checkbox"
                            id="requirement4"
                            name="requirement"
                            value="requirement4"
                            checked
                            readOnly
                            disabled
                            className="mr-2"
                        />
                        <label htmlFor="requirement4" className="text-sm font-medium text-slate-700">Requirement 4</label>
                        </div>

                        
                        <div className="flex items-center mt-2">
                        <input
                            type="checkbox"
                            id="requirement4"
                            name="requirement"
                            value="requirement4"
                            checked = {false}
                            readOnly
                            disabled
                            className="mr-2"
                        />
                        <label htmlFor="requirement4" className="text-sm font-medium text-slate-700">Requirement 5</label>
                        </div>

                        
                        <div className="flex items-center mt-2">
                        <input
                            type="checkbox"
                            id="requirement4"
                            name="requirement"
                            value="requirement4"
                            checked = {false}
                            readOnly
                            disabled
                            className="mr-2"
                        />
                        <label htmlFor="requirement4" className="text-sm font-medium text-slate-700">Requirement 6</label>
                        </div>
                    </div>

                    <div className="text-lg font-bold bg-slate-200 border-2 px-4 py-2 rounded-md">Other Specific Requirement</div>  

                    <div className="grid grid-cols gap-8 my-4 border-b pb-4">
                     
                        <div className="">
                            <label className="block text-sm font-medium text-slate-400">Document</label>
                            <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">Birth Certificate</span>
                        </div>
                    </div>

                    <div className="text-lg font-bold bg-slate-200 border-2 px-4 py-2 rounded-md">Contact Information</div>  

                    <div className="grid grid-cols-3 gap-8 my-4 border-b pb-4">
                        <div className="">
                            <label className="block text-sm font-medium text-slate-400">Contact Person</label>
                            <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">Sample</span>
                        </div>
                        <div className="">
                            <label className="block text-sm font-medium text-slate-400">Contact Number</label>
                            <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">09123456789</span>
                        </div>
                        <div className="">
                            <label className="block text-sm font-medium text-slate-400">Email Address</label>
                            <span className="mt-1 block px-3 py-2 border border-gray-300 rounded-md">sample@email.com </span>
                        </div>
                    
                    </div>

                    
                <div className="flex justify-end gap-4 mt-4">
          
                    <Link to={'/scholarships-data-display'} className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-800">
             
                       
                    
                        Next
                    </Link>
                </div>

                </div>

        </div>
        </main>
        </div>

  
        
    );
}