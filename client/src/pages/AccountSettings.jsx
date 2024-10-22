import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import AccountManagement from './AccountManagement';
import ChangePassword from '../components/AccountSettings/ChangePassword';
import ChangeEmail from '../components/AccountSettings/ChangeEmail';
import UpdateProfile from '../components/AccountSettings/UpdateProfile';
import useTokenExpiry from '../hooks/useTokenExpiry';

export default function AccountSettings() {
    useTokenExpiry();
    useEffect(() => {
        document.title = "Account Settings | HubIsko";
    }, []);

    return (
        <div className='bg-[#f8f8fb]'>
            <Header />
            <AccountManagement />
            <div className='max-w-[950px] mx-auto flex flex-col gap-10 pt-10 text-sm lg:text-base py-10 px-4 lg:px-0'>
                <div className="flex flex-col gap-5">
                    <h2 className="text-lg lg:text-lg font-bold text-blue-700 text-center lg:text-left">
                        Welcome to your account settings
                    </h2>
                    <p className="text-base lg:text-base text-slate-600 mb-6 text-center lg:text-left">
                        Here you can view and update your profile details, change your password, and update your email address.
                        Please ensure all information is accurate and up-to-date.
                    </p>
                    <UpdateProfile />
                    <ChangePassword />
                    <ChangeEmail />
                </div>
            </div>
        </div>
    );
}