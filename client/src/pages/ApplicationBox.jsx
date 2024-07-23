import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";


export default function ApplicationBox() {
    return(
        <div className='flex flex-col min-h-screen'>
            <Header />
                <main className="flex-grow bg-[#f8f8fb] font-medium">

                    <div className="max-w-6xl px-24 mx-auto">
                            <div className="border bg-white flex flex-col gap-8 rounded-md p-4 shadow mt-20">
                               <span className="text-xl">Application Inbox</span>
                                
                           
                                <div className="flex flex-col">

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