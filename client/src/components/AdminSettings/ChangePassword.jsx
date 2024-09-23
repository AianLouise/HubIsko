import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const ChangePassword = () => {
    const { currentUser } = useSelector((state) => state.user);
    const userId = currentUser._id;

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });

    const [passwordErrors, setPasswordErrors] = useState({});
    const [notification, setNotification] = useState('');
    const [showPasswords, setShowPasswords] = useState({
        currentPassword: false,
        newPassword: false,
        confirmNewPassword: false,
    });

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await fetch(`/api/auth/user/${userId}`);
                if (!response.ok) {
                    throw new Error('Error fetching user details');
                }
                const user = await response.json();
            } catch (error) {
                console.error('Error fetching user details:', error);
                setNotification('Error fetching user details.');
            }
        };

        fetchUserDetails();
    }, [userId]);

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const validatePassword = () => {
        const errors = {};
        const { newPassword, confirmNewPassword, currentPassword } = passwordData;

        // Current password validation
        if (!currentPassword) {
            errors.currentPassword = 'Current password is required.';
        }

        // New password validation
        if (newPassword.length < 6) {
            errors.newPassword = 'Password must be at least 6 characters long.';
        }
        if (!/[A-Z]/.test(newPassword)) {
            errors.newPassword = 'Password must contain at least one uppercase letter.';
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
            errors.newPassword = 'Password must contain at least one special character.';
        }

        // Check if new passwords match
        if (newPassword !== confirmNewPassword) {
            errors.confirmNewPassword = 'New passwords do not match.';
        }

        // Check if new password is the same as the current password
        if (newPassword === currentPassword) {
            errors.newPassword = 'New password cannot be the same as the current password.';
        }

        setPasswordErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();

        // Reset previous notification and errors
        setNotification('');
        setPasswordErrors({});

        // Run validation
        if (!validatePassword()) {
            return;
        }

        // Proceed with password change request if validation passed
        const passwordDataToSend = {
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword,
            confirmNewPassword: passwordData.confirmNewPassword, // Include this
        };

        try {
            const response = await fetch(`/api/provider/users/${userId}/change-password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(passwordDataToSend),
            });

            if (!response.ok) {
                // Handle incorrect current password case
                if (response.status === 400) {
                    const data = await response.json();
                    setPasswordErrors((prevErrors) => ({
                        ...prevErrors,
                        currentPassword: data.error || 'Current password is incorrect.',
                    }));
                    return;
                } else {
                    throw new Error('Network response was not ok');
                }
            }

            setNotification('Password changed successfully.');
            // Clear the input fields
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmNewPassword: '',
            });
        } catch (error) {
            console.error('Error changing password:', error);
            setNotification('Error changing password.');
        }

        // Clear notification after a short period
        setTimeout(() => {
            setNotification('');
        }, 3000);
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords((prevShowPasswords) => ({
            ...prevShowPasswords,
            [field]: !prevShowPasswords[field],
        }));
    };

    return (
        <div className='bg-white border shadow rounded-md p-4'>
            {notification && (
                <div className='fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-md'>
                    {notification}
                </div>
            )}
            <h2 className='text-2xl font-bold mb-4'>Change Password</h2>
            <form onSubmit={handleChangePassword}>
                <div className='mb-4'>
                    <label className='block text-sm font-medium text-gray-700'>Current Password</label>
                    <div className='relative'>
                        <input
                            type={showPasswords.currentPassword ? 'text' : 'password'}
                            name='currentPassword'
                            className='mt-1 p-2 border rounded-md w-full'
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                        />
                        <span
                            className='absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer'
                            onClick={() => togglePasswordVisibility('currentPassword')}
                        >
                            {showPasswords.currentPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                    {passwordErrors.currentPassword && (
                        <p className='text-red-500 text-xs mt-1'>{passwordErrors.currentPassword}</p>
                    )}
                </div>
                <div className='mb-4'>
                    <label className='block text-sm font-medium text-gray-700'>New Password</label>
                    <div className='relative'>
                        <input
                            type={showPasswords.newPassword ? 'text' : 'password'}
                            name='newPassword'
                            className='mt-1 p-2 border rounded-md w-full'
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                        />
                        <span
                            className='absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer'
                            onClick={() => togglePasswordVisibility('newPassword')}
                        >
                            {showPasswords.newPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                    {passwordErrors.newPassword && (
                        <p className='text-red-500 text-xs mt-1'>{passwordErrors.newPassword}</p>
                    )}
                </div>
                <div className='mb-4'>
                    <label className='block text-sm font-medium text-gray-700'>Confirm New Password</label>
                    <div className='relative'>
                        <input
                            type={showPasswords.confirmNewPassword ? 'text' : 'password'}
                            name='confirmNewPassword'
                            className='mt-1 p-2 border rounded-md w-full'
                            value={passwordData.confirmNewPassword}
                            onChange={handlePasswordChange}
                        />
                        <span
                            className='absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer'
                            onClick={() => togglePasswordVisibility('confirmNewPassword')}
                        >
                            {showPasswords.confirmNewPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                    {passwordErrors.confirmNewPassword && (
                        <p className='text-red-500 text-xs mt-1'>{passwordErrors.confirmNewPassword}</p>
                    )}
                </div>
                <button type='submit' className='bg-blue-600 text-white px-4 py-2 rounded-md'>Change Password</button>
            </form>
        </div>
    );
};

export default ChangePassword;