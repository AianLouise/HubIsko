import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FaHandHolding, FaRegCalendarXmark, FaArrowRightLong } from "react-icons/fa6";
import { MdOutlineRefresh } from "react-icons/md";
import { BsGlobe2 } from "react-icons/bs";
import { useParams } from 'react-router-dom';

export default function Forums() {
    const { id } = useParams();
    const [scholarship, setScholarship] = useState(null);

    console.log(id);

    useEffect(() => {
        const fetchScholarship = async () => {
            try {
                const response = await fetch(`/api/scholarshipProgram/scholarship-programs/${id}`);
                const data = await response.json();
                setScholarship(data);
            } catch (error) {
                console.error('Error fetching scholarship:', error);
            }
        };

        fetchScholarship();
    }, [id]);

    const [organizationName, setOrganizationName] = useState('');

    const fetchOrganizationName = async () => {
        try {
            const response = await fetch(`/api/scholarshipProgram/organization/${scholarship.providerId}`);
            const data = await response.json();
            if (response.ok) {
                setOrganizationName(data.organizationName);
            } else {
                console.error(data.message);
            }
        } catch (error) {
            console.error('Error fetching organization name:', error);
        }
    };

    useEffect(() => {
        fetchOrganizationName();
      }, [fetchOrganizationName]);

    if (!scholarship) {
        return <div>Loading...</div>;
    }

    return (
        <div className='min-h-screen flex flex-col'>
            <Header />
            <main className='flex-grow bg-[#f8f8fb] font-medium'>
                <div key={scholarship._id} className='border-b mb-8 py-8'>
                    <div className='flex flex-row items-center mx-auto max-w-6xl gap-10 px-24'>
                        <div className='bg-blue-600 w-36 h-36 my-8 rounded-md'>
                            {scholarship.scholarshipImage && (
                                <img
                                    src={scholarship.scholarshipImage}
                                    alt={scholarship.title}
                                    className='w-full h-full object-cover rounded-md'
                                />
                            )}
                        </div>
                        <div className='flex flex-col gap-2 w-1/2'>
                            <div className='flex flex-row divide-x-2 divide-blue-200 mb-2'>
                            <span className='text-2xl font-bold text-gray-600 pr-4'>{organizationName}</span>
                                <span className='text-2xl font-medium text-gray-400 pl-4'>{new Date(scholarship.applicationStartDate).toLocaleDateString()}</span>
                            </div>
                            <h1 className='text-4xl font-bold text-gray-800'>{scholarship.title}</h1>

                            <div className='flex text-blue-600 font-bold'>
                                <div className='flex flex-row gap-2 px-2 text-xl'>
                                    <FaHandHolding className='' />
                                    Php 80,000 - Php 100,000
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='max-w-6xl px-24 mx-auto mb-20'>
                        <div className='flex gap-2'>
                            <span className='flex gap-1 bg-white border px-4 py-2 rounded-md shadow'>
                                <MdOutlineRefresh className='w-6 h-6 text-blue-600' />
                                Last update: {new Date(scholarship.applicationEndDate).toLocaleDateString()}
                            </span>
                            <span className='flex gap-2 bg-white border px-4 py-2 rounded-md shadow items-center'>
                                <FaRegCalendarXmark className='text-red-500' />
                                Deadline: {new Date(scholarship.applicationEndDate).toLocaleDateString()}
                            </span>
                        </div>
                        <div className='flex justify-center items-center w-full h-52 rounded-md my-4 shadow border'>
                            {scholarship.scholarshipBanner ? (
                                <img src={scholarship.scholarshipBanner} alt="Scholarship Banner" className='w-full h-full object-cover' />
                            ) : 'Scholarship Banner'}
                        </div>

                        {/* Details Section */}
                        <div className='flex flex-col gap-2 mt-8 border rounded-md bg-white'>
                            <span className='font-bold text-xl text-white bg-blue-600 p-4 rounded-t-md'>What is this scholarship for?</span>
                            <span className='text-sm p-4'>{scholarship.purpose}</span>
                        </div>

                        {/* Benefits Section */}
                        <div className='flex flex-col gap-2 mt-8 border rounded-md bg-white'>
                            <span className='font-bold text-xl text-white bg-blue-600 p-4 rounded-t-md'>What are the benefits?</span>
                            <span className='text-sm p-4'>
                                {/* {scholarship.benefits.map((benefit, index) => (
                                    <div key={index}>{benefit}</div>
                                ))} */}
                            </span>
                        </div>

                        {/* Qualifications Section */}
                        <div className='flex flex-col gap-2 mt-8 border rounded-md bg-white'>
                            <span className='font-bold text-xl text-white bg-blue-600 p-4 rounded-t-md'>What are the qualifications?</span>
                            <span className='text-sm p-4'>
                                {/* {scholarship.qualifications.map((qualification, index) => (
                                    <div key={index}>{qualification}</div>
                                ))} */}
                            </span>
                        </div>

                        {/* Application Instructions Section */}
                        <div className='flex flex-col gap-2 mt-8 border rounded-md bg-white'>
                            <span className='font-bold text-xl text-white bg-blue-600 p-4 rounded-t-md'>How can I apply?</span>
                            <span className='text-sm p-4'>{scholarship.applicationInstructions}</span>
                        </div>

                        {/* Documents Section */}
                        <div className='flex flex-col gap-2 mt-8 border rounded-md bg-white'>
                            <span className='font-bold text-xl text-white bg-blue-600 p-4 rounded-t-md'>What documents should I prepare?</span>
                            <span className='text-sm p-4'>
                                {/* {scholarship.documents.map((doc, index) => (
                                    <div key={index}>{doc.category} - {doc.type}</div>
                                ))} */}
                            </span>
                        </div>

                        {/* FAQ Section */}
                        <div className='flex flex-col gap-2 mt-8 border rounded-md bg-white'>
                            <span className='font-bold text-xl text-white bg-blue-600 p-4 rounded-t-md'>Frequently Asked Questions</span>
                            <span className='text-sm p-4'>{scholarship.additionalInformation}</span>

                            <div className='border mx-8'></div>
                            <div className='items-center justify-center flex -translate-y-5'>
                                <span className='bg-white px-8 text-slate-500'>Do you have more questions?</span>
                            </div>

                            {/* Contact Section */}
                            <div className='flex gap-6 justify-center mb-8'>
                                <button className='bg-white border flex flex-row p-4 gap-2 rounded-md hover:bg-slate-200 hover:-translate-y-2 transition ease-in-out'>
                                    <div className='bg-blue-600 w-12 h-12 rounded-md'></div>
                                    <div className='flex flex-col justify-center'>
                                        <span className='text-slate-600 text-left'>Email Us!</span>
                                        <span className=''>{scholarship.contactPerson.email}</span>
                                    </div>
                                </button>

                                <button className='bg-white border flex flex-row p-4 gap-2 rounded-md hover:bg-slate-200 hover:-translate-y-2 transition ease-in-out'>
                                    <div className='bg-blue-600 w-12 h-12 rounded-md'></div>
                                    <div className='flex flex-col justify-center'>
                                        <span className='text-slate-600 text-left'>Call us!</span>
                                        <span className=''>{scholarship.contactPerson.phone}</span>
                                    </div>
                                </button>

                                <button className='bg-white border flex flex-row p-4 gap-2 rounded-md hover:bg-slate-200 hover:-translate-y-2 transition ease-in-out'>
                                    <div className='bg-blue-600 w-12 h-12 rounded-md'></div>
                                    <div className='flex flex-col justify-center text-left'>
                                        <span className='text-slate-600 '>Visit our profile!</span>
                                        <span className=''>{scholarship.providerId}</span>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Ready to Apply Section */}
                        <div className='flex flex-col items-center justify-center border-t my-10'>
                            <span className='font-bold text-slate-700 py-8 text-2xl'>Ready to Apply?</span>
                            <div className='flex gap-4 w-full'>
                                <button className='bg-white flex border justify-between items-center shadow rounded-md p-4 w-1/2 hover:shadow-xl hover:bg-slate-200 transition ease-in-out'>
                                    <span>Apply Online</span>
                                    <FaArrowRightLong />
                                </button>
                                <button className='bg-blue-600 text-white border justify-between flex items-center shadow rounded-md p-4 w-1/2 hover:shadow-xl hover:bg-blue-700 transition ease-in-out'>
                                    <span>Visit Website</span>
                                    <BsGlobe2 />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
