import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { FaAngleRight } from "react-icons/fa6";


export default function ApplicationBox() {
    return(
        <div className='flex flex-col min-h-screen'>
            <Header />
                <main className="flex-grow bg-[#f8f8fb] font-medium">

                    <div className="max-w-6xl px-24 mx-auto">


                        

                            <div className="border bg-white flex flex-col gap-8 rounded-md p-4 shadow mt-20">
                               <span className="text-xl">Application Inbox</span>
                                
                           
                                <div className="flex flex-col">
                                    
                                    {/* IF WALA */}
                                    {/* <div className="text-center flex flex-col items-center gap-2">
                                        <span className="text-slate-600">You have no applications yet</span>
                                        <Link to={'/scholarship-listing'}>
                                        <button className='flex gap-2 items-center bg-blue-600 rounded-md px-4 py-2 text-white fond-medium hover:bg-blue-800 group transition ease-in-out'>
                                        Go to Scholarship List
                                        <FaAngleRight className='w-5 h-5  group-hover:translate-x-2 transition ease-in-out' />
                                        </button>
                                        </Link>
                                    </div> */}

                                    {/* IF MERON */}
                                    <Link to={`/inboxed-application-detail`}>
                                    <div className="flex justify-between items-center hover:bg-slate-200 p-2 rounded-md">
                                    <div className="flex gap-2">
                                    <div className="bg-blue-600 w-12 h-12 rounded-md"></div>
                                    <div className="flex flex-col">
                                        <span className="text-slate-600">DepEd</span>
                                        <span>This is a sample scholarship title</span>
                                    </div>
                                    </div>

                                    <span>Applied: July 28, 2024</span>
                                    </div>
                                    </Link>

                                </div>
                                
                            </div>
                    </div>
                </main>
            <Footer />
        </div>
    );
}