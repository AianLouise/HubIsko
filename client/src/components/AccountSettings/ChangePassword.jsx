import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changePasswordStart, changePasswordSuccess, changePasswordFail } from '../../redux/user/userSlice';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import CustomNotification from '../CustomNotification';
import { useNavigate } from 'react-router-dom';

export default function ChangePassword() {
    const currentUser = useSelector((state) => state.user.currentUser);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [showPasswords, setShowPasswords] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState('');
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });
    const [notification, setNotification] = useState({ message: '', type: '' });
    const [newPasswordError, setNewPasswordError] = useState('');

    const toggleShowPasswords = () => {
        setShowPasswords(!showPasswords);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));

        if (name === 'newPassword') {
            evaluatePasswordStrength(value);
            if (value === formData.currentPassword) {
                setNewPasswordError('New password cannot be the same as the current password');
            } else {
                setNewPasswordError('');
            }
        }
    };

    const evaluatePasswordStrength = (password) => {
        let strength = 'Weak';
        if (password.length >= 8) {
            strength = 'Medium';
        }
        if (password.length >= 12 && /[A-Z]/.test(password) && /[!@#$%^&*]/.test(password)) {
            strength = 'Strong';
        }
        setPasswordStrength(strength);
    };

    const validatePassword = (password) => {
        const minLength = 6;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasSpecialChar = /[!@#$%^&*]/.test(password);

        if (password.length < minLength) {
            return 'Password must be at least 6 characters long';
        }
        if (!hasUpperCase) {
            return 'Password must contain at least one uppercase letter';
        }
        if (!hasSpecialChar) {
            return 'Password must contain at least one special character (!@#$%^&*)';
        }
        return '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationError = validatePassword(formData.newPassword);
        if (validationError) {
            setNotification({ message: validationError, type: 'error' });
            return;
        }
        if (formData.newPassword === formData.currentPassword) {
            setNotification({ message: 'New password cannot be the same as the current password', type: 'error' });
            return;
        }
        if (formData.newPassword !== formData.confirmNewPassword) {
            setNotification({ message: 'New passwords do not match', type: 'error' });
            return;
        }

        dispatch(changePasswordStart());

        try {
            const payload = {
                oldPassword: formData.currentPassword,
                newPassword: formData.newPassword
            };

            console.log('Request Payload:', payload); // Debugging log

            const response = await fetch(`/api/user/change-password/${currentUser._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Response Error Text:', errorText); // Debugging log
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const contentType = response.headers.get('Content-Type');
            let result;
            if (contentType && contentType.includes('application/json')) {
                result = await response.json();
            } else {
                result = await response.text();
            }

            console.log('API Response:', result); // Debugging log
            dispatch(changePasswordSuccess(result));
            setNotification({ message: 'Password successfully changed', type: 'success' });

            // Navigate after a delay to allow the user to see the notification
            setTimeout(() => navigate('/profile'), 2000);
        } catch (error) {
            console.error('Error:', error); // Debugging log
            dispatch(changePasswordFail(error.message));
            setNotification({ message: 'Failed to change password', type: 'error' });
        }
    }; return (
        <div className='space-y-6'>
            {/* Password Form Section */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
                    {/* Current Password */}
                    <div className='space-y-2'>
                        <label className='flex items-center text-sm font-semibold text-gray-700'>
                            <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                            </svg>
                            Current Password
                            <span className="text-red-500 ml-1">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type={showPasswords ? 'text' : 'password'}
                                id='currentPassword'
                                name='currentPassword'
                                placeholder='Enter your current password'
                                value={formData.currentPassword}
                                onChange={handleChange}
                                className='w-full bg-gray-50 border border-gray-300 rounded-lg p-3 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200'
                                required
                            />
                            <button
                                type="button"
                                onClick={toggleShowPasswords}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPasswords ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {/* New Password */}
                    <div className='space-y-2'>
                        <label className='flex items-center text-sm font-semibold text-gray-700'>
                            <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            New Password
                            <span className="text-red-500 ml-1">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type={showPasswords ? 'text' : 'password'}
                                id='newPassword'
                                name='newPassword'
                                placeholder='Enter your new password'
                                value={formData.newPassword}
                                onChange={handleChange}
                                className='w-full bg-gray-50 border border-gray-300 rounded-lg p-3 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200'
                                required
                            />
                            <button
                                type="button"
                                onClick={toggleShowPasswords}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPasswords ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                            </button>
                        </div>

                        {/* Password Strength Indicator */}
                        {formData.newPassword && (
                            <div className="flex items-center space-x-2 mt-2">
                                <div className="flex space-x-1 flex-1">
                                    <div className={`h-2 rounded-full flex-1 ${passwordStrength === 'Weak' ? 'bg-red-300' : passwordStrength === 'Medium' ? 'bg-yellow-300' : 'bg-green-300'}`}></div>
                                    <div className={`h-2 rounded-full flex-1 ${passwordStrength === 'Medium' || passwordStrength === 'Strong' ? passwordStrength === 'Medium' ? 'bg-yellow-300' : 'bg-green-300' : 'bg-gray-200'}`}></div>
                                    <div className={`h-2 rounded-full flex-1 ${passwordStrength === 'Strong' ? 'bg-green-300' : 'bg-gray-200'}`}></div>
                                </div>
                                <span className={`text-xs font-medium ${passwordStrength === 'Strong' ? 'text-green-600' : passwordStrength === 'Medium' ? 'text-yellow-600' : 'text-red-600'}`}>
                                    {passwordStrength}
                                </span>
                            </div>
                        )}

                        {newPasswordError && (
                            <div className='flex items-center text-red-600 text-sm mt-2'>
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                                </svg>
                                {newPasswordError}
                            </div>
                        )}
                    </div>

                    {/* Confirm New Password */}
                    <div className='space-y-2'>
                        <label className='flex items-center text-sm font-semibold text-gray-700'>
                            <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            Confirm New Password
                            <span className="text-red-500 ml-1">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type={showPasswords ? 'text' : 'password'}
                                id='confirmNewPassword'
                                name='confirmNewPassword'
                                placeholder='Confirm your new password'
                                value={formData.confirmNewPassword}
                                onChange={handleChange}
                                className='w-full bg-gray-50 border border-gray-300 rounded-lg p-3 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200'
                                required
                            />
                            <button
                                type="button"
                                onClick={toggleShowPasswords}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPasswords ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                            </button>
                        </div>

                        {/* Password Match Indicator */}
                        {formData.confirmNewPassword && (
                            <div className={`flex items-center text-sm mt-2 ${formData.newPassword === formData.confirmNewPassword ? 'text-green-600' : 'text-red-600'}`}>
                                {formData.newPassword === formData.confirmNewPassword ? (
                                    <>
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                        Passwords match
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                        </svg>
                                        Passwords do not match
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                    {/* Action Buttons */}
                    <div className="pt-4 border-t border-gray-200">
                        <div className="flex justify-end items-center">
                            <button
                                type="submit"
                                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                                    ></path>
                                </svg>
                                <span>Change Password</span>
                            </button>
                        </div>
                    </div>

                </form>
            </div>

            {/* Password Requirements Section */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-4">
                <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                        <svg className="w-6 h-6 text-amber-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-amber-800 mb-2">Password Requirements</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div className="flex items-center space-x-2">
                                <div className={`w-2 h-2 rounded-full ${formData.newPassword.length >= 6 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                <span className={`text-sm ${formData.newPassword.length >= 6 ? 'text-green-700' : 'text-gray-600'}`}>
                                    Minimum 6 characters
                                </span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className={`w-2 h-2 rounded-full ${/[A-Z]/.test(formData.newPassword) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                <span className={`text-sm ${/[A-Z]/.test(formData.newPassword) ? 'text-green-700' : 'text-gray-600'}`}>
                                    At least one uppercase letter
                                </span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className={`w-2 h-2 rounded-full ${/[!@#$%^&*]/.test(formData.newPassword) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                <span className={`text-sm ${/[!@#$%^&*]/.test(formData.newPassword) ? 'text-green-700' : 'text-gray-600'}`}>
                                    At least one special character (!@#$%^&*)
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Notification */}
            {notification.message && (
                <CustomNotification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification({ message: '', type: '' })}
                />
            )}
        </div>
    );
}