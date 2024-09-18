import React, { useState } from 'react';
import { FaUser, FaLock, FaUserEdit } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import ProviderHeaderSidebar from '../../components/ProviderHeaderAndSidebar';
import UpdateInformation from '../../components/ProviderSettings/UpdateInformation';
import UpdateAccountDetails from '../../components/ProviderSettings/UpdateAccountDetails';
import { updateUserDetails } from '../../redux/user/userSlice';

export default function Settings() {
    const { currentUser } = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedTab, setSelectedTab] = useState('Update Information');

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const handleTabClick = (tab) => setSelectedTab(tab);

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const [passwordErrors, setPasswordErrors] = useState({});

    const validatePassword = () => {
        const errors = {};
        const { newPassword, confirmNewPassword } = passwordData;

        if (newPassword.length < 6) {
            errors.newPassword = 'Password must be at least 6 characters long.';
        }
        if (!/[A-Z]/.test(newPassword)) {
            errors.newPassword = 'Password must contain at least one uppercase letter.';
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
            errors.newPassword = 'Password must contain at least one special character.';
        }
        if (newPassword !== confirmNewPassword) {
            errors.confirmNewPassword = 'Passwords do not match.';
        }

        setPasswordErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (!validatePassword()) {
            return;
        }

        const passwordData = {
            currentPassword: passwordErrors.currentPassword,
            newPassword: passwordErrors.newPassword,
            confirmNewPassword: passwordErrors.confirmNewPassword,
        };

        console.log('Password Data:', passwordData);

        try {
            const response = await fetch(`/api/users/${currentUser._id}/change-password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(passwordData),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('Response:', data);
            // Handle success (e.g., show a success message)
        } catch (error) {
            console.error('Error changing password:', error);
            // Handle error (e.g., show an error message)
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <main className={`flex-grow bg-[#f8f8fb] transition-all duration-200 ease-in-out ${sidebarOpen ? 'ml-64' : ''}`}>
                <ProviderHeaderSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} currentPath={`${currentUser.scholarshipProviderDetails.organizationName} / Settings`} />

                <div className="max-w-8xl mx-24 mt-12">
                    <div className="bg-white border shadow rounded-md px-6 py-8">
                        <h1 className="text-4xl font-bold mb-4">Settings</h1>
                        <nav className="mb-8">
                            <ul className="flex items-center gap-8 font-medium border-b-2 border-gray-200">
                                <li>
                                    <button
                                        onClick={() => handleTabClick('Update Information')}
                                        className={`relative flex items-center py-3 px-4 group hover:text-blue-600 transition-colors duration-200 ease-in-out ${selectedTab === 'Update Information' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
                                    >
                                        <FaUser className="mr-2" />
                                        <span>Update Information</span>
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => handleTabClick('Update Account Details')}
                                        className={`relative flex items-center py-3 px-4 group hover:text-blue-600 transition-colors duration-200 ease-in-out ${selectedTab === 'Update Account Details' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
                                    >
                                        <FaUserEdit className="mr-2" />
                                        <span>Update Account Details</span>
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => handleTabClick('Change Password')}
                                        className={`relative flex items-center py-3 px-4 group hover:text-blue-600 transition-colors duration-200 ease-in-out ${selectedTab === 'Change Password' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
                                    >
                                        <FaLock className="mr-2" />
                                        <span>Change Password</span>
                                    </button>
                                </li>
                            </ul>
                        </nav>

                        {selectedTab === 'Update Information' && (
                            <UpdateInformation
                                currentUser={currentUser}
                                dispatch={dispatch}
                                updateUserDetails={updateUserDetails}
                            />
                        )}

                        {selectedTab === 'Update Account Details' && (
                            <UpdateAccountDetails
                                currentUser={currentUser}
                            />
                        )}

                        {selectedTab === 'Change Password' && (
                            <div className='bg-white border shadow rounded-md p-4'>
                                <h2 className='text-2xl font-bold mb-4'>Change Password</h2>
                                <form onSubmit={handleChangePassword}>
                                    <div className='mb-4'>
                                        <label className='block text-sm font-medium text-gray-700'>Current Password</label>
                                        <input
                                            type='password'
                                            name='currentPassword'
                                            className='mt-1 p-2 border rounded-md w-full'
                                            value={passwordData.currentPassword}
                                            onChange={handlePasswordChange}
                                        />
                                    </div>
                                    <div className='mb-4'>
                                        <label className='block text-sm font-medium text-gray-700'>New Password</label>
                                        <input
                                            type='password'
                                            name='newPassword'
                                            className='mt-1 p-2 border rounded-md w-full'
                                            value={passwordData.newPassword}
                                            onChange={handlePasswordChange}
                                        />
                                        {passwordErrors.newPassword && (
                                            <p className='text-red-500 text-xs mt-1'>{passwordErrors.newPassword}</p>
                                        )}
                                    </div>
                                    <div className='mb-4'>
                                        <label className='block text-sm font-medium text-gray-700'>Confirm New Password</label>
                                        <input
                                            type='password'
                                            name='confirmNewPassword'
                                            className='mt-1 p-2 border rounded-md w-full'
                                            value={passwordData.confirmNewPassword}
                                            onChange={handlePasswordChange}
                                        />
                                        {passwordErrors.confirmNewPassword && (
                                            <p className='text-red-500 text-xs mt-1'>{passwordErrors.confirmNewPassword}</p>
                                        )}
                                    </div>
                                    <button type='submit' className='bg-blue-600 text-white px-4 py-2 rounded-md'>Change Password</button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}