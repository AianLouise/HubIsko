import React from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { Link } from "react-router-dom";
import { FaHandHolding, FaMapMarkerAlt } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { MdOutlineRefresh } from "react-icons/md";
import { FaEnvelope, FaPhone, FaUser } from 'react-icons/fa';
import { FaBook, FaGraduationCap, FaPersonCirclePlus, FaRegCalendarXmark } from "react-icons/fa6";
import { BsGlobe2 } from "react-icons/bs";
import { FaArrowRight } from "react-icons/fa";

export default function ScholarshipsDataDisplay() {
    const [loading, setLoading] = useState(true);

    const { id } = useParams();
    const [scholarshipDetails, setScholarshipDetails] = useState(null);

    useEffect(() => {
        // Scroll to the top of the page when the component is mounted
        window.scrollTo(0, 0);
    }, []);

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
        <div className="flex flex-col min-h-screen font-medium text-slate-700">
            <main className='flex-grow bg-[#f8f8fb] font-medium'>
                <div key={scholarshipDetails._id} className='border-b mb-8 py-8'>
                    <div className='flex flex-col lg:flex-row items-center mx-auto max-w-6xl gap-2 lg:gap-10 lg:px-24 p-4'>
                        <div className='bg-white w-36 h-36 my-8 rounded-md'>
                            {scholarshipDetails.scholarshipImage && (
                                <img
                                    src={scholarshipDetails.scholarshipImage}
                                    alt={scholarshipDetails.title}
                                    className='w-full h-full object-cover rounded-md'
                                />
                            )}

                        </div>
                        <h1 className='text-4xl block lg:hidden font-bold text-gray-800 mb-8'>{scholarshipDetails.title}</h1>
                        <div className='flex flex-col lg:gap-2 lg:w-1/2'>
                            <div className='flex flex-row divide-x-2 divide-blue-200 mb-2'>
                                <span className='text-lg lg:text-xl font-bold text-gray-600 pr-4'>{scholarshipDetails.organizationName}</span>
                                {/* need date posted */}
                                <span className='text-lg lg:text-xl font-medium text-gray-400 pl-4'>{new Date(scholarshipDetails.applicationStartDate).toLocaleDateString()}</span>
                            </div>
                            <h1 className='text-4xl hidden lg:block font-bold text-gray-800'>{scholarshipDetails.title}</h1>

                            <div className='flex text-blue-600 font-bold items-center justify-center lg:justify-start'>
                                <div className='flex flex-row gap-2 px-10 py-2 lg:py-0 lg:px-2 text-xl bg-slate-200 rounded-md lg:bg-[#f8f8fb]'>
                                    <FaHandHolding className='w-6 h-6 flex-shrink-0' />
                                    {scholarshipDetails.amount}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='flex flex-col items-center justify-center mx-auto max-w-6xl px-24 lg:flex-row gap-2'>
                        <div className='flex gap-4'>
                            <div className='flex items-center gap-4 bg-white border shadow-md rounded-md p-4 hover:bg-gray-200 hover:shadow-lg transition duration-300'>
                                <FaBook className='text-blue-500 w-6 h-6' />
                                <p className='text-base'>{scholarshipDetails.fieldOfStudy}</p>
                            </div>
                            <div className='flex items-center gap-4 bg-white border shadow-md rounded-md p-4 hover:bg-gray-200 hover:shadow-lg transition duration-300'>
                                <FaMapMarkerAlt className='text-blue-500 w-6 h-6' />
                                <p className='text-base'>{scholarshipDetails.location}</p>
                            </div>
                            <div className='flex items-center gap-4 bg-white border shadow-md rounded-md p-4 hover:bg-gray-200 hover:shadow-lg transition duration-300'>
                                <FaGraduationCap className='text-blue-500 w-6 h-6' />
                                <p className='text-base'>{scholarshipDetails.educationLevel}</p>
                            </div>
                        </div>
                    </div>

                    <div className='max-w-6xl lg:px-24 p-4 mx-auto mb-20'>
                        <div className='flex items-center justify-between gap-2'>
                            {/* need to add the last update date */}

                            <div className='flex gap-2 items-center'>
                                <span className='flex gap-1 bg-white border px-4 py-2 rounded-md shadow'>
                                    <MdOutlineRefresh className='w-6 h-6 text-blue-600' />
                                    Last update: {new Date(scholarshipDetails.dateUpdated).toLocaleDateString()}
                                </span>
                                <span className='flex gap-2 bg-white border px-4 py-2 rounded-md shadow items-center'>
                                    <FaRegCalendarXmark className='text-red-500' />
                                    Deadline: No deadline set
                                </span>
                            </div>

                            <div className='flex gap-2 border shadow bg-white rounded-md px-4 py-2'>
                                <div className='flex gap-2'>
                                    <FaPersonCirclePlus className='w-6 h-6 text-blue-600' />
                                    <span>Slots Available:</span>
                                    <span className='text-blue-500'>0/{scholarshipDetails.numberOfScholarships}</span>
                                </div>
                            </div>
                        </div>
                        <div className='flex justify-center items-center w-full h-52 rounded-md my-4 shadow border'>
                            {scholarshipDetails.bannerImage ? (
                                <img src={scholarshipDetails.bannerImage} alt="Scholarship Banner" className='w-full h-full object-cover' />
                            ) : 'Scholarship Banner'}
                        </div>

                        <div>
                            {scholarshipDetails.sections && scholarshipDetails.sections.length > 0 ? (
                                scholarshipDetails.sections.map((section, index) => (
                                    <div key={index} className='flex flex-col gap-2 mt-8 border rounded-md bg-white'>
                                        <span className='font-bold text-xl text-white bg-blue-600 p-4 rounded-t-md'>{section.title}</span>
                                        <span className='text-sm px-4 pb-4 whitespace-pre-line'>{section.content}</span>
                                    </div>
                                ))
                            ) : (
                                <div>No details available</div>
                            )}
                        </div>

                        {/* FAQ Section */}
                        <div className='flex flex-col gap-2 mt-8 border rounded-md bg-white'>
                            <span className='font-bold text-xl text-white bg-blue-600 p-4 rounded-t-md'>{scholarshipDetails.faqTitle}</span>
                            <span className='text-sm p-4 whitespace-pre-line'>{scholarshipDetails.faqDescription}</span>

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
                    </div>
                </div>
            </main>
        </div>
    );

}