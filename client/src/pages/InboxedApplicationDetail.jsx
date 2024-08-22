import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from "../components/Header";
import Footer from "../components/Footer";
import { IoMdArrowDropdown } from 'react-icons/io';
import ApplicationForm from './ApplicationForm';

export default function InboxedApplicationDetail() {

    const currentUser = useSelector((state) => state.user.currentUser);
    const [application, setApplication] = useState(null);
    const { id: applicationId } = useParams(); 

    useEffect(() => {
        const fetchApplicationDetails = async () => {
            try {
                const response = await fetch(`/api/scholarshipApplication/get-applications-details/${applicationId}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setApplication(data);
            } catch (error) {
                console.error('Error fetching application details:', error);
            }
        };

        fetchApplicationDetails();
    }, [applicationId]);

    if (!application || !currentUser) {
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
        <div className='flex flex-col min-h-screen'>
            <Header />
            <main className="flex-grow bg-[#f8f8fb] font-medium">
                <div className="max-w-6xl px-24 mx-auto my-20">
                    
                    <div className='my-8 flex gap-2 items-center'>
                    <Link to={'/application-box'} className='bg-white border rounded-md px-6 py-2 shadow hover:bg-slate-200'>
                     <span>Inbox</span>
                    </Link>

                           <IoMdArrowDropdown className='-rotate-90 text-4xl text-blue-600' />

                    <div className='bg-white border rounded-md px-6 py-2 shadow'>
                    <span className='text-blue-600'>{application.scholarshipProgram.title}</span>
                    </div>
                    </div>

                    <ApplicationForm application={application} />

                </div>
            </main >
            <Footer />

            {/* {
                showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto bg-gray-900 bg-opacity-50">
                        <div className="bg-white flex-col gap-2 flex text-left p-8 w-1/4 shadow rounded-md border">
                            <h1 className='text-2xl text-center font-bold text-blue-600'>Request to Review?</h1>
                            <span className='text-md text-slate-600 text-center'>
                                After you request a review you'll have to <span className="text-blue-600">wait after 1 week</span> to request again.
                            </span>
                            <div className="justify-between w-full flex gap-2 font-medium mt-4">
                                <button onClick={closeModal} className="border rounded-md w-full py-2 hover:bg-slate-200">Cancel</button>
                                <button onClick={closeModal} className="bg-blue-600 text-white rounded-md w-full hover:bg-blue-800">Request</button>
                            </div>
                        </div>
                    </div>
                )
            } */}
        </div >
    )
}
