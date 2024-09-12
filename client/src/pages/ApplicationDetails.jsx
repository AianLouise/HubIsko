import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FaHandHolding, FaRegCalendarXmark, FaArrowRightLong } from "react-icons/fa6";
import { MdOutlineRefresh } from "react-icons/md";
import { BsGlobe2 } from "react-icons/bs";
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaPhone, FaUser } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { CgClose } from 'react-icons/cg';
import NewLogo from '../assets/NewLogoClean.png';
import useTokenExpiry from '../hooks/useTokenExpiry'; // Adjust the import path

export default function Forums() {
    useTokenExpiry();

    const { id } = useParams();
    const [scholarship, setScholarship] = useState(null);

    const { currentUser } = useSelector(state => state.user);
    const isLoggedIn = Boolean(currentUser);
    const [notification, setNotification] = useState('');
    const [notification2, setNotification2] = useState('');
    const navigate = useNavigate();

    const handleApplyClick = async () => {
        if (!isLoggedIn) {
            setNotification('You must be logged in to apply for scholarships.');
        } else if (currentUser?.status === 'Pending Verification') {
            setNotification('Your account is currently under verification. You cannot apply for scholarships until your account is fully verified.');
        } else if (currentUser?.status === 'Verify Account') {
            setNotification('You need to verify your account before applying for scholarships. Please visit the verification page.');
        } else {
            try {
                const response = await fetch(`/api/scholarshipProgram/${scholarship.id}/has-applied/${currentUser._id}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                if (data.hasApplied) {
                    setNotification2('You have already applied for this scholarship.');
                } else {
                    navigate(`/scholarship-application/${scholarship.id}`);
                }
            } catch (error) {
                console.error('Error checking application status:', error);
                setNotification2('An error occurred while checking your application status. Please try again later.');
            }
        }
    };

    useEffect(() => {
        const fetchScholarship = async () => {
            try {
                const response = await fetch(`/api/scholarshipProgram/scholarship-programs/${id}`);
                const data = await response.json();
                console.log('Fetched Scholarship:', data); // Add this line
                setScholarship(data);
            } catch (error) {
                console.error('Error fetching scholarship:', error);
            }
        };

        fetchScholarship();
    }, [id]);

    // const [organizationName, setOrganizationName] = useState('');

    // const fetchOrganizationName = async () => {
    //     try {
    //         const response = await fetch(`/api/scholarshipProgram/organization/${scholarship.providerId}`);
    //         const data = await response.json();
    //         if (response.ok) {
    //             setOrganizationName(data.organizationName);
    //         } else {
    //             console.error(data.message);
    //         }
    //     } catch (error) {
    //         console.error('Error fetching organization name:', error);
    //     }
    // };

    // useEffect(() => {
    //     if (scholarship) {
    //         fetchOrganizationName();
    //     }
    // }, [scholarship]);

    if (!scholarship) {
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
        <div className='min-h-screen flex flex-col'>
            <Header />
            <main className='flex-grow bg-[#f8f8fb] font-medium'>
                <div key={scholarship._id} className='border-b mb-8 py-8'>
                    <div className='flex flex-col lg:flex-row items-center mx-auto max-w-6xl gap-2 lg:gap-10 lg:px-24 p-4'>
                        <div className='bg-blue-600 w-36 h-36 my-8 rounded-md'>
                            {scholarship.scholarshipImage && (
                                <img
                                    src={scholarship.scholarshipImage}
                                    alt={scholarship.title}
                                    className='w-full h-full object-cover rounded-md'
                                />
                            )}

                        </div>
                        <h1 className='text-4xl block lg:hidden font-bold text-gray-800 mb-8'>{scholarship.title}</h1>
                        <div className='flex flex-col lg:gap-2 lg:w-1/2'>
                            <div className='flex flex-row divide-x-2 divide-blue-200 mb-2'>
                                <span className='text-lg lg:text-xl font-bold text-gray-600 pr-4'>{scholarship.organizationName}</span>
                                {/* need date posted */}
                                <span className='text-lg lg:text-xl font-medium text-gray-400 pl-4'>{new Date(scholarship.startDate).toLocaleDateString()}</span>
                            </div>
                            <h1 className='text-4xl hidden lg:block font-bold text-gray-800'>{scholarship.title}</h1>

                            <div className='flex text-blue-600 font-bold items-center justify-center lg:justify-start'>
                                <div className='flex flex-row gap-2 px-10 py-2 lg:py-0 lg:px-2 text-xl bg-slate-200 rounded-md lg:bg-[#f8f8fb]'>
                                    <FaHandHolding className='w-6 h-6 flex-shrink-0' />
                                    {scholarship.amount}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='max-w-6xl lg:px-24 p-4 mx-auto mb-20'>
                        <div className='flex gap-2'>
                            {/* need to add the last update date */}
                            <span className='flex gap-1 bg-white border px-4 py-2 rounded-md shadow'>
                                <MdOutlineRefresh className='w-6 h-6 text-blue-600' />
                                Last update: {new Date(scholarship.applicationEndDate).toLocaleDateString()}
                            </span>
                            <span className='flex gap-2 bg-white border px-4 py-2 rounded-md shadow items-center'>
                                <FaRegCalendarXmark className='text-red-500' />
                                Deadline: {new Date(scholarship.endDate).toLocaleDateString()}
                            </span>
                        </div>
                        <div className='flex justify-center items-center w-full h-52 rounded-md my-4 shadow border'>
                            {scholarship.bannerImage ? (
                                <img src={scholarship.bannerImage} alt="Scholarship Banner" className='w-full h-full object-cover' />
                            ) : 'Scholarship Banner'}
                        </div>

                        <div>
                            {scholarship.sections && scholarship.sections.length > 0 ? (
                                scholarship.sections.map((section, index) => (
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
                            <span className='font-bold text-xl text-white bg-blue-600 p-4 rounded-t-md'>{scholarship.faqTitle}</span>
                            <span className='text-sm p-4'>{scholarship.faqDescription}</span>

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
                                        <span className=''>{scholarship.contactEmail}</span>
                                    </div>
                                </button>

                                <button className='bg-white border flex flex-row p-4 gap-2 rounded-md hover:bg-slate-200 hover:-translate-y-2 transition ease-in-out'>
                                    <div className='bg-blue-600 w-12 h-12 rounded-md flex items-center justify-center'>
                                        <FaPhone className='text-white' />
                                    </div>
                                    <div className='flex flex-col justify-center'>
                                        <span className='text-slate-600 text-left'>Call us!</span>
                                        <span className=''>{scholarship.contactPhone}</span>
                                    </div>
                                </button>

                                <button className='bg-white border flex flex-row p-4 gap-2 rounded-md hover:bg-slate-200 hover:-translate-y-2 transition ease-in-out'>
                                    <div className='bg-blue-600 w-12 h-12 rounded-md flex items-center justify-center'>
                                        <FaUser className='text-white' />
                                    </div>
                                    <Link to={'/profile-preview/:id'} className='flex flex-col justify-center text-left'>
                                        <span className='text-slate-600 '>Visit our profile!</span>
                                        <span className=''>{scholarship.organizationName}</span>
                                    </Link>
                                </button>
                            </div>
                        </div>

                        {/* Ready to Apply Section */}
                        <div className='flex flex-col items-center justify-center border-t my-10'>
                            <span className='font-bold text-slate-700 py-8 text-2xl'>Ready to Apply?</span>
                            <div className='grid grid-rows-1 lg:flex gap-4 w-full justify-center'>
                                {/* <button className='bg-white flex border justify-between items-center shadow rounded-md p-4 lg:w-1/2 h-22 hover:-translate-y-2 hover:bg-slate-200 transition ease-in-out group'>
                                    <div className='flex flex-row gap-4 '>
                                        <div className='bg-blue-600 hidden lg:block w-14 h-14 rounded-md'></div>
                                        <div className='flex flex-col text-left'>
                                            <span className='text-lg text-left'>Apply in Organization's website!</span>
                                            <span className='text-slate-600'>They'll offer more information!</span>
                                        </div>
                                    </div>
                                    <BsGlobe2 className='w-8 h-8 ml-4 lg:group-hover:w-12 lg:group-hover:h-12 group-hover:text-blue-600 transition-all ease-in-out' />
                                </button> */}

                                <div onClick={handleApplyClick} className='cursor-pointer bg-white flex items-center border justify-between shadow rounded-md p-4 lg:w-1/2 h-22 hover:-translate-y-2 hover:bg-slate-200 transition ease-in-out group'>
                                    <div className='flex flex-row gap-4 items-center'>
                                        <div className='hidden lg:flex justify-center items-center w-14 h-14 rounded-md'>
                                            <img src={NewLogo} alt="New Logo" className='w-full h-full object-cover rounded-md' />
                                        </div>
                                        <div className='flex flex-col text-left'>
                                            <span className='text-lg'>Apply now in Hubisko!</span>
                                            <span className='text-slate-600'>We'll guide you step by step!</span>
                                        </div>
                                    </div>
                                    <FaArrowRightLong className='w-8 h-8 mr-4 group-hover:translate-x-2 group-hover:text-blue-600 transition ease-in-out' />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />

            {notification && (
                <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
                    <div className='p-6 pb-10 bg-white rounded-md text-center shadow-lg font-medium'>
                        <button onClick={() => setNotification('')} className='flex w-full justify-end items-end'>
                            <div className='border rounded-full p-1 hover:bg-slate-200'>
                                <CgClose className='w-4 h-4' />
                            </div>
                        </button>
                        {notification === 'You must be logged in to apply for scholarships.' && (
                            <>
                                <strong className='font-bold text-red-500 text-lg'>Not Logged In!</strong>
                                <div className='text-slate-400' role='alert'>
                                    <span className='block sm:inline font-medium'>{notification}</span>
                                </div>
                                <div className='flex flex-col justify-center w-full gap-2 mt-4'>
                                    <Link to='/login' className='bg-blue-600 text-white text-center rounded-md w-full hover:bg-blue-800 py-2'>Login</Link>
                                    <div className=''>
                                        <div className='border mt-5'></div>
                                        <div className='w-full -translate-y-4 text-center'>
                                            <span className='bg-white px-5 text-slate-500 font-medium'>or</span>
                                        </div>
                                    </div>
                                    <div className='w-full flex gap-2 justify-between'>
                                        <Link to='/register' className='bg-blue-600 text-white text-center rounded-md w-full hover:bg-blue-800 py-2'>Register as Student</Link>
                                        <Link to='/register-provider' className='bg-blue-800 text-white text-center rounded-md w-full hover:bg-blue-900 py-2'>Register as Provider</Link>
                                    </div>
                                </div>
                            </>
                        )}
                        {notification === 'Your account is currently under verification. You cannot apply for scholarships until your account is fully verified.' && (
                            <>
                                <div className="flex items-center justify-center mb-4">
                                    <svg className="h-6 w-6 text-yellow-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
                                    </svg>
                                    <strong className="font-bold text-yellow-500 text-lg">Pending Verification!</strong>
                                </div>
                                <div className="text-slate-400" role="alert">
                                    <span className="block sm:inline font-medium">{notification}</span>
                                </div>
                            </>
                        )}
                        {notification === 'You need to verify your account before applying for scholarships. Please visit the verification page.' && (
                            <>
                                <div className="flex items-center justify-center mb-4">
                                    <svg className="h-6 w-6 text-yellow-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
                                    </svg>
                                    <strong className="font-bold text-yellow-500 text-lg">Verify Account!</strong>
                                </div>
                                <div className="text-slate-400" role="alert">
                                    <span className="block sm:inline font-medium">{notification}</span>
                                </div>
                                <button
                                    onClick={() => navigate('/verify-profile')}
                                    className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
                                >
                                    Verify Profile
                                </button>
                            </>
                        )}
                        {notification !== 'You must be logged in to apply for scholarships.' && notification !== 'Your account is currently under verification. You cannot apply for scholarships until your account is fully verified.' && notification !== 'You need to verify your account before applying for scholarships. Please visit the verification page.' && (
                            <>
                                <strong className='font-bold text-red-500 text-lg'>Notification</strong>
                                <div className='text-slate-400' role='alert'>
                                    <span className='block sm:inline font-medium'>{notification}</span>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {notification2 && (
                <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
                    <div className='p-6 pb-10 bg-white rounded-md text-center shadow-lg font-medium'>
                        <button onClick={() => setNotification2('')} className='flex w-full justify-end items-end'>
                            <div className='border rounded-full p-1 hover:bg-slate-200'>
                                <CgClose className='w-4 h-4' />
                            </div>
                        </button>
                        <strong className='font-bold text-red-500 text-lg'>Already Applied!</strong>
                        <div className='text-slate-400 ' role='alert'>
                            <span className='block sm:inline font-medium'>{notification2}</span>
                        </div>
                        <Link to='/scholar-dashboard' className='mt-4 inline-block bg-blue-600 text-white text-center rounded-md w-full hover:bg-blue-800 py-2'>
                            Go to Scholar Dashboard
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}