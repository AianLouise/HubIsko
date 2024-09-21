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
    };

    return (
        <div className='bg-white shadow w-full border flex flex-col p-10 h-auto rounded-md text-slate-700'>
            <h1 className='font-bold text-xl mb-8'>Change Password</h1>
            <form className='flex flex-col gap-8' onSubmit={handleSubmit}>
                <div className='flex flex-col gap-1'>
                    <span className='font-medium text-slate-500'>Current Password</span>
                    <input
                        type={showPasswords ? 'text' : 'password'}
                        id='currentPassword'
                        name='currentPassword'
                        placeholder='Current Password'
                        value={formData.currentPassword}
                        onChange={handleChange}
                        className='bg-slate-100 rounded-lg p-3'
                        required
                    />
                </div>
                <div className='flex flex-col gap-1'>
                    <span className='font-medium text-slate-500'>New Password</span>
                    <input
                        type={showPasswords ? 'text' : 'password'}
                        id='newPassword'
                        name='newPassword'
                        placeholder='New Password'
                        value={formData.newPassword}
                        onChange={handleChange}
                        className='bg-slate-100 rounded-lg p-3'
                        required
                    />
                    {newPasswordError && (
                        <div className='text-red-500 text-sm mt-1'>{newPasswordError}</div>
                    )}
                    <div className='text-sm text-slate-500 mt-1'>
                        Password Strength: <span className={`font-bold ${passwordStrength === 'Strong' ? 'text-green-500' : passwordStrength === 'Medium' ? 'text-yellow-500' : 'text-red-500'}`}>{passwordStrength}</span>
                    </div>
                </div>
                <div className='flex flex-col gap-1'>
                    <span className='font-medium text-slate-500'>Confirm New Password</span>
                    <input
                        type={showPasswords ? 'text' : 'password'}
                        id='confirmNewPassword'
                        name='confirmNewPassword'
                        placeholder='Confirm New Password'
                        value={formData.confirmNewPassword}
                        onChange={handleChange}
                        className='bg-slate-100 rounded-lg p-3'
                        required
                    />
                </div>
                <div className='text-sm text-slate-500 mt-1'>
                    Password Requirements:
                    <ul className='list-disc list-inside'>
                        <li>Minimum 6 characters</li>
                        <li>At least one uppercase letter</li>
                        <li>At least one special character (!@#$%^&*)</li>
                    </ul>
                </div>
                <div className='w-full flex flex-col lg:flex-row gap-4 justify-end my-4 mt-8'>
                    <button
                        type='button'
                        className='flex flex-row items-center gap-2 border px-6 rounded-md p-3 font-medium hover:text-white hover:bg-blue-600 transition ease-in-out'
                        onClick={toggleShowPasswords}
                    >
                        {showPasswords ? <FaEyeSlash /> : <FaEye />}
                        {showPasswords ? 'Hide Passwords' : 'Show Passwords'}
                    </button>
                    <button type='submit' className='bg-blue-600 px-10 font-medium text-white p-3 rounded-lg hover:bg-blue-800 transition ease-in-out'>
                        Change Password
                    </button>
                </div>
            </form>
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