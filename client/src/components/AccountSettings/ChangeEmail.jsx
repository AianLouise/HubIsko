import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CustomNotification from '../CustomNotification';

export default function ChangeEmail() {
    const navigate = useNavigate();
    const currentUser = useSelector((state) => state.user.currentUser);
    const userId = currentUser._id;

    const [formData, setFormData] = useState({
        currentEmail: '',
        newEmail: '',
        confirmNewEmail: ''
    });
    const [notification, setNotification] = useState({ message: '', type: '' });
    const [actualCurrentEmail, setActualCurrentEmail] = useState('');

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await fetch(`/api/auth/user/${userId}`);
                if (!response.ok) {
                    throw new Error('Error fetching user details');
                }
                const user = await response.json();
                // Set the current email in the form data
                setFormData({
                    currentEmail: user.email,
                    newEmail: '',
                    confirmNewEmail: ''
                });
                setActualCurrentEmail(user.email);
            } catch (error) {
                console.error('Error fetching user details:', error);
                setNotification({ message: 'Error fetching user details', type: 'error' });
            }
        };

        fetchUserDetails();
    }, [userId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.currentEmail !== actualCurrentEmail) {
            setNotification({ message: 'Current email does not match', type: 'error' });
            return;
        }

        if (formData.newEmail !== formData.confirmNewEmail) {
            setNotification({ message: 'New emails do not match', type: 'error' });
            return;
        }

        try {
            const payload = {
                newEmail: formData.newEmail
            };

            const response = await fetch(`/api/profile/change-email/${userId}`, { // Update the path to match your endpoint
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            setNotification({ message: 'Verification email sent. Please check your inbox.', type: 'success' });

            // Navigate after a delay to allow the user to see the notification
            setTimeout(() => navigate('/profile'), 2000);
        } catch (error) {
            setNotification({ message: `Failed to request email update: ${error.message}`, type: 'error' });
        }
    };

    return (
        <div className='bg-white shadow w-full border flex flex-col p-10 h-auto rounded-md text-slate-700'>
            <h1 className='font-bold text-xl mb-8'>Change Email</h1>
            <form className='flex flex-col gap-8' onSubmit={handleSubmit}>
                <div className='flex flex-col gap-1'>
                    <span className='font-medium text-slate-500'>Current Email <span className="text-red-500">*</span></span>
                    <input
                        type='email'
                        id='currentEmail'
                        name='currentEmail'
                        placeholder='Current Email'
                        value={formData.currentEmail}
                        onChange={handleChange}
                        className='bg-slate-100 rounded-lg p-3'
                        required
                        disabled // Disable the input as it's being shown for reference
                    />
                </div>
                <div className='flex flex-col gap-1'>
                    <span className='font-medium text-slate-500'>New Email <span className="text-red-500">*</span></span>
                    <input
                        type='email'
                        id='newEmail'
                        name='newEmail'
                        placeholder='New Email'
                        value={formData.newEmail}
                        onChange={handleChange}
                        className='bg-slate-100 rounded-lg p-3'
                        required
                    />
                </div>
                <div className='flex flex-col gap-1'>
                    <span className='font-medium text-slate-500'>Confirm New Email <span className="text-red-500">*</span></span>
                    <input
                        type='email'
                        id='confirmNewEmail'
                        name='confirmNewEmail'
                        placeholder='Confirm New Email'
                        value={formData.confirmNewEmail}
                        onChange={handleChange}
                        className='bg-slate-100 rounded-lg p-3'
                        required
                    />
                </div>
                <div className='w-full flex flex-row justify-end my-4 mt-8'>
                    <button type='submit' className='bg-blue-600 px-10 font-medium text-white p-3 rounded-lg hover:bg-blue-800 transition ease-in-out'>
                        Change Email
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
