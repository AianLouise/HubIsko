import React from 'react';
import { NavLink } from 'react-router-dom';
import { IoDocumentAttachOutline } from "react-icons/io5";
import { MdHome, MdVerifiedUser } from "react-icons/md";
import useTokenExpiry from '../hooks/useTokenExpiry'; // Adjust the import path

export default function VerifyOrReturnHome() {
    useTokenExpiry();

    return (
        <main className='bg-gradient-to-r from-blue-400 to-blue-700 flex justify-center md:flex-row items-center text-left p-4 gap-10 min-h-screen mx-auto'>
            <div className='flex flex-col gap-4 items-center justify-center bg-white p-20 border shadow-md rounded-md'>
                <MdVerifiedUser className='text-blue-600 w-16 h-16 mb-4' />
                <h1 className='text-3xl font-bold text-slate-800'>Account Verification Needed</h1>
                <p className='text-lg text-slate-600 font-medium mt-6'>
                    To fully access your account and all features, please verify your account.
                </p>
                <p className='text-lg text-slate-600 font-medium'>
                    You can verify your account now or continue to explore the home page with limited access.
                </p>
                <div className='flex gap-4 mt-4 font-medium w-full justify-center'>
                    <NavLink
                        to='/verify-profile'
                        className='bg-blue-600 w-full flex flex-row gap-2 items-center justify-center text-center text-white px-4 py-2 rounded-md hover:bg-blue-800 transition ease-in-out'
                    >
                        <IoDocumentAttachOutline className='w-5 h-5' />
                        Verify Account
                    </NavLink>

                    <NavLink
                        to='/'
                        className='bg-white border-2 px-4 py-2 w-full flex flex-row gap-2 items-center justify-center rounded-md hover:bg-slate-200 transition ease-in-out'
                    >
                        <MdHome />
                        Go to Home
                    </NavLink>
                </div>
            </div>
        </main>
    );
}