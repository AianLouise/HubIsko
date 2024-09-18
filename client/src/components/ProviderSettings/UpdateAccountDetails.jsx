import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const UpdateAccountDetails = () => {
    const { currentUser } = useSelector((state) => state.user);
    const userId = currentUser._id;

    const [formData, setFormData] = useState({
        username: '',
        email: '',
    });

    const [errors, setErrors] = useState({});
    const [notification, setNotification] = useState('');

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await fetch(`/api/auth/user/${userId}`);
                if (!response.ok) {
                    throw new Error('Error fetching user details');
                }
                const user = await response.json();
                setFormData({
                    username: user.username,
                    email: user.email,
                });
            } catch (error) {
                console.error('Error fetching user details:', error);
                setErrors({ general: 'Error fetching user details' });
            }
        };

        fetchUserDetails();
    }, [userId]);

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSaveChanges = async (e) => {
        e.preventDefault();

        const newErrors = {};
        if (!validateEmail(formData.email)) {
            newErrors.email = 'Invalid email format';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            const response = await fetch(`/api/provider/users/${userId}/request-email-update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ newEmail: formData.email }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Network response was not ok');
            }

            const data = await response.json();
            console.log('Response:', data);
            setNotification('A verification email has been sent to your new email address. Please verify to complete the change.');
        } catch (error) {
            console.error('Error requesting email change:', error);
            setErrors({ general: error.message || 'Error requesting email change' });
            setNotification('Error requesting email change.');
        }

        // Clear the notification after a few seconds
        setTimeout(() => {
            setNotification('');
        }, 3000);
    };

    return (
        <div className='bg-white border shadow rounded-md p-4'>
            {notification && (
                <div className='fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-md'>
                    {notification}
                </div>
            )}
            <h2 className='text-2xl font-bold mb-4'>Update Account Details</h2>
            <form onSubmit={handleSaveChanges}>
                <div className='mb-4'>
                    <label className='block text-sm font-medium text-gray-700'>Username</label>
                    <input
                        type='text'
                        name='username'
                        className='mt-1 p-2 border rounded-md w-full'
                        value={formData.username}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className='mb-4'>
                    <label className='block text-sm font-medium text-gray-700'>Email</label>
                    <input
                        type='email'
                        name='email'
                        className='mt-1 p-2 border rounded-md w-full'
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                    />
                    {errors.email && <p className='text-red-500 text-xs mt-1'>{errors.email}</p>}
                    {errors.general && <p className='text-red-500 text-xs mt-1'>{errors.general}</p>}
                </div>
                <button type='submit' className='bg-blue-600 text-white px-4 py-2 rounded-md'>Save Changes</button>
            </form>
        </div>
    );
};

export default UpdateAccountDetails;