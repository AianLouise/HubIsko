import React from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { Link } from "react-router-dom";
import { FaHandHolding } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { MdOutlineRefresh } from "react-icons/md";
import { FaEnvelope, FaPhone, FaUser } from 'react-icons/fa';
import { FaRegCalendarXmark } from "react-icons/fa6";
import { BsGlobe2 } from "react-icons/bs";
import { FaArrowRight } from "react-icons/fa";

export default function ScholarshipsDataDisplay() {
    const [loading, setLoading] = useState(true);

    const { id } = useParams();
    const [scholarshipDetails, setScholarshipDetails] = useState(null);

    const fetchScholarshipDetails = async () => {
        try {
            const response = await fetch(`/api/admin/scholarship-program/${id}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setScholarshipDetails(data.scholarshipProgram);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchScholarshipDetails();
    }, [id]);

    if (!scholarshipDetails) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-col min-h-screen font-medium text-slate-700">
            <main className="flex-grow bg-[#f8f8fb]">
                <div className='flex flex-row items-center mx-auto max-w-8xl gap-10 px-24'>
                    <div className='bg-blue-600 w-36 h-36 my-8 rounded-md'>
                        {scholarshipDetails.scholarshipImage && (
                            <img
                                src={scholarshipDetails.scholarshipImage}
                                alt={scholarshipDetails.title}
                                className='w-full h-full object-cover rounded-md'
                            />
                        )}
                    </div>
                    <div className='flex flex-col gap-2 w-1/2'>
                        <div className='flex flex-row divide-x-2 divide-blue-200 mb-2'>
                            <span className='text-2xl font-bold text-gray-600 pr-4'>{scholarshipDetails.organizationName}</span>
                            <span className='text-2xl font-medium text-gray-400 pl-4'>{new Date(scholarshipDetails.applicationStartDate).toLocaleDateString()}</span>
                        </div>
                        <h1 className='text-4xl font-bold text-gray-800'>{scholarshipDetails.title}</h1>

                        <div className='flex text-blue-600 font-bold'>
                            <div className='flex flex-row gap-2 px-2 text-xl'>
                                <FaHandHolding className='' />
                                {scholarshipDetails.amount}
                            </div>
                        </div>
                    </div>
                </div>

                <div className='max-w-8xl mx-auto px-24 gap-10 flex-col flex'>
                    <div className='flex gap-2'>
                        <span className='flex gap-1 bg-white border px-4 py-2 rounded-md shadow'>
                            <MdOutlineRefresh className='w-6 h-6 text-blue-600' />
                            Last update: 1/11/11
                        </span>
                        <span className='flex gap-2 bg-white border px-4 py-2 rounded-md shadow items-center'>
                            <FaRegCalendarXmark className='w-5 h-5 text-red-600' />
                            Deadline: 1/11/11
                        </span>
                    </div>

                    <div className='flex justify-center bg-white items-center w-full h-52 rounded-md my-4 shadow border'>
                        {scholarshipDetails.bannerImage ? (
                            <img src={scholarshipDetails.bannerImage} alt="Scholarship Banner" className='w-full h-full object-cover' />
                        ) : 'Scholarship Banner'}
                    </div>

                    <div>
                        {scholarshipDetails.sections && scholarshipDetails.sections.length > 0 ? (
                            scholarshipDetails.sections.map((section, index) => (
                                <div key={index} className='flex flex-col gap-2 mt-8 border rounded-md bg-white'>
                                    <span className='font-bold text-xl text-white bg-blue-600 p-4 rounded-t-md'>{section.title}</span>
                                    <span className='text-sm p-4'>{section.content}</span>
                                </div>
                            ))
                        ) : (
                            <div>No details available</div>
                        )}
                    </div>

                    {/* FAQ Section */}
                    <div className='flex flex-col gap-2 mt-8 border rounded-md bg-white'>
                        <span className='font-bold text-xl text-white bg-blue-600 p-4 rounded-t-md'>{scholarshipDetails.faqTitle}</span>
                        <span className='text-sm p-4'>{scholarshipDetails.faqDescription}</span>

                        <div className='border mx-8'></div>
                        <div className='items-center justify-center flex -translate-y-5'>
                            <span className='bg-white px-8 text-slate-500'>Do you have more questions?</span>
                        </div>

                        {/* Contact Section */}
                        <div className='grid grid-rows-1 lg:flex gap-6 justify-center mb-8'>
                            <button className='bg-white border flex flex-row p-4 gap-2 rounded-md hover:bg-slate-200 hover:-translate-y-2 transition ease-in-out'>
                                <div className='bg-blue-600 w-12 h-12 rounded-md flex items-center justify-center'>
                                    <FaEnvelope className='text-white' />
                                </div>
                                <div className='flex flex-col justify-center'>
                                    <span className='text-slate-600 text-left'>Email Us!</span>
                                    <span className=''>{scholarshipDetails.contactEmail}</span>
                                </div>
                            </button>

                            <button className='bg-white border flex flex-row p-4 gap-2 rounded-md hover:bg-slate-200 hover:-translate-y-2 transition ease-in-out'>
                                <div className='bg-blue-600 w-12 h-12 rounded-md flex items-center justify-center'>
                                    <FaPhone className='text-white' />
                                </div>
                                <div className='flex flex-col justify-center'>
                                    <span className='text-slate-600 text-left'>Call us!</span>
                                    <span className=''>{scholarshipDetails.contactPhone}</span>
                                </div>
                            </button>

                            <button className='bg-white border flex flex-row p-4 gap-2 rounded-md hover:bg-slate-200 hover:-translate-y-2 transition ease-in-out'>
                                <div className='bg-blue-600 w-12 h-12 rounded-md flex items-center justify-center'>
                                    <FaUser className='text-white' />
                                </div>
                                <Link to={'/profile-preview/:id'} className='flex flex-col justify-center text-left'>
                                    <span className='text-slate-600 '>Visit our profile!</span>
                                    <span className=''>{scholarshipDetails.organizationName}</span>
                                </Link>
                            </button>
                        </div>
                    </div>

                    <div className='flex flex-col items-center justify-center border-t my-10'>
                        <span className='font-bold text-slate-700 py-8 text-2xl'>Ready to Apply?</span>
                        <div className='flex gap-4 w-full'>
                            <button className='bg-white flex border justify-between items-center shadow rounded-md p-4 w-1/2 h-22 hover:-translate-y-2 hover:bg-slate-200 transition ease-in-out group'>
                                <div className='flex flex-row gap-4 '>
                                    <div className='bg-blue-600 w-14 h-14 rounded-md'></div>
                                    <div className='flex flex-col text-left'>
                                        <span className='text-lg text-left'>Website Linked:</span>
                                        <span className='text-slate-600'>SampleWebsite.com</span>
                                    </div>
                                </div>
                                <BsGlobe2 className='w-8 h-8 ml-4 group-hover:w-12 group-hover:h-12 group-hover:text-blue-600 transition-all ease-in-out' />

                            </button>


                            <button className='bg-white flex items-center border justify-between shadow rounded-md p-4 w-1/2 h-22 hover:-translate-y-2 hover:bg-slate-200 transition ease-in-out group'>

                                <div className='flex flex-row gap-4 '>
                                    <div className='bg-blue-600 w-14 h-14 rounded-md'></div>
                                    <div className='flex flex-col text-left'>
                                        <span className='text-lg'>Apply now in Hubisko!</span>
                                        <span className='text-slate-600'>We'll guide you step by step!</span>
                                    </div>
                                </div>
                                <FaArrowRight className='w-8 h-8 mr-4 group-hover:translate-x-2 group-hover:text-blue-600 transition ease-in-out' />
                            </button>

                        </div>
                    </div>
                </div>
            </main>
        </div>
    );

}