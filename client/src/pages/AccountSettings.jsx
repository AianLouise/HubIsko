// pages/AccountSettings.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import AccountManagement from './AccountManagement';
import ChangePassword from '../components/AccountSettings/ChangePassword';
import ChangeEmail from '../components/AccountSettings/ChangeEmail';
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
            <div className='max-w-[950px] mx-auto flex flex-col gap-10 pt-10 text-sm lg:text-base py-10'>
                <ChangePassword />
                <ChangeEmail />
            </div>
        </div>
    );
}
