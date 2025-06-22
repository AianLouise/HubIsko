import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import AccountManagement from './AccountManagement';
import ChangePassword from '../components/AccountSettings/ChangePassword';
import ChangeEmail from '../components/AccountSettings/ChangeEmail';
import UpdateProfile from '../components/AccountSettings/UpdateProfile';
import useTokenExpiry from '../hooks/useTokenExpiry';

export default function AccountSettings() {
    useTokenExpiry();
    const [activeTab, setActiveTab] = useState('profile');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        document.title = "Account Settings | HubIsko";
    }, []);

    const tabs = [        {
            id: 'profile',
            name: 'Profile Settings',
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
            ),
            component: <UpdateProfile />
        },
        {
            id: 'password',
            name: 'Change Password',
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
                </svg>
            ),
            component: <ChangePassword />
        },
        {
            id: 'email',
            name: 'Change Email',
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
            ),
            component: <ChangeEmail />
        }
    ];

    const renderTabContent = () => {
        const activeTabData = tabs.find(tab => tab.id === activeTab);
        return activeTabData ? activeTabData.component : null;
    };

    return (
        <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50'>
            <Header />
            <AccountManagement />
              {/* Main Content Container */}
            <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
                {/* Header Section */}
                <div className="bg-white rounded-lg shadow-md border border-gray-100 mb-6 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 sm:px-6 py-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-xl sm:text-2xl font-bold text-white">Account Settings</h1>
                                <p className="text-blue-100 text-sm mt-1">Manage your profile, security, and preferences</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">                    {/* Desktop Sidebar */}
                    <div className="hidden lg:block lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-md border border-gray-100 p-4 sticky top-8">
                            <h3 className="text-base font-semibold text-gray-900 mb-3">Settings Menu</h3>
                            <nav className="space-y-1">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-md text-left transition-all duration-200 text-sm ${
                                            activeTab === tab.id
                                                ? 'bg-blue-50 text-blue-600 border border-blue-200 shadow-sm'
                                                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                    >
                                        <span className={`${activeTab === tab.id ? 'text-blue-600' : 'text-gray-400'} w-4 h-4`}>
                                            {tab.icon}
                                        </span>
                                        <span className="font-medium">{tab.name}</span>
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>                    {/* Mobile Tab Selector */}
                    <div className="lg:hidden col-span-1">
                        <div className="bg-white rounded-lg shadow-md border border-gray-100 mb-4">
                            <div className="p-3">
                                <button
                                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                    className="w-full flex items-center justify-between px-3 py-2.5 bg-gray-50 rounded-md"
                                >
                                    <div className="flex items-center space-x-3">
                                        <span className="text-blue-600 w-4 h-4">
                                            {tabs.find(tab => tab.id === activeTab)?.icon}
                                        </span>
                                        <span className="font-medium text-gray-900 text-sm">
                                            {tabs.find(tab => tab.id === activeTab)?.name}
                                        </span>
                                    </div>
                                    <svg 
                                        className={`w-4 h-4 text-gray-400 transition-transform ${isMobileMenuOpen ? 'rotate-180' : ''}`} 
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </button>
                                
                                {isMobileMenuOpen && (
                                    <div className="mt-2 space-y-1">
                                        {tabs.map((tab) => (
                                            <button
                                                key={tab.id}
                                                onClick={() => {
                                                    setActiveTab(tab.id);
                                                    setIsMobileMenuOpen(false);
                                                }}
                                                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-md text-left transition-all duration-200 text-sm ${
                                                    activeTab === tab.id
                                                        ? 'bg-blue-50 text-blue-600 border border-blue-200'
                                                        : 'text-gray-700 hover:bg-gray-50'
                                                }`}
                                            >
                                                <span className={`${activeTab === tab.id ? 'text-blue-600' : 'text-gray-400'} w-4 h-4`}>
                                                    {tab.icon}
                                                </span>
                                                <span className="font-medium">{tab.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>                    {/* Main Content Area */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-lg shadow-md border border-gray-100 min-h-[500px]">
                            <div className="p-4 sm:p-6">
                                {/* Content Header */}
                                <div className="mb-6">
                                    <div className="flex items-center space-x-3 mb-3">
                                        <span className="text-blue-600 w-5 h-5">
                                            {tabs.find(tab => tab.id === activeTab)?.icon}
                                        </span>
                                        <h2 className="text-xl font-bold text-gray-900">
                                            {tabs.find(tab => tab.id === activeTab)?.name}
                                        </h2>
                                    </div>
                                    <p className="text-gray-600 leading-relaxed text-sm">
                                        {activeTab === 'profile' && 'Update your personal information and profile details. Keep your information current for the best experience.'}
                                        {activeTab === 'password' && 'Enhance your account security by updating your password. Choose a strong, unique password.'}
                                        {activeTab === 'email' && 'Change your email address associated with your account. Verify your new email to complete the process.'}
                                    </p>
                                </div>

                                {/* Dynamic Content */}
                                <div className="space-y-4">
                                    {renderTabContent()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}