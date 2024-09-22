import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const UpdateAccountDetails = () => {
    const { currentUser } = useSelector((state) => state.user);
    const userId = currentUser._id;

    const [profileFormData, setProfileFormData] = useState({
        username: '',
        profilePicture: '',
        currentEmail: '',
        newEmail: '',
        confirmNewEmail: ''
    });

    const [errors, setErrors] = useState({});
    const [notification, setNotification] = useState('');
    const [profilePicturePreview, setProfilePicturePreview] = useState('');

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await fetch(`/api/auth/user/${userId}`);
                if (!response.ok) {
                    throw new Error('Error fetching user details');
                }
                const user = await response.json();
                setProfileFormData({
                    username: user.username,
                    profilePicture: user.profilePicture || '',
                    currentEmail: user.email,
                    newEmail: '',
                    confirmNewEmail: ''
                });
                setProfilePicturePreview(user.profilePicture || '');
            } catch (error) {
                console.error('Error fetching user details:', error);
                setErrors({ general: 'Error fetching user details' });
            }
        };

        fetchUserDetails();
    }, [userId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleProfilePictureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePicturePreview(reader.result);
            };
            reader.readAsDataURL(file);
            setProfileFormData((prevData) => ({
                ...prevData,
                profilePicture: file,
            }));
        }
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();

        try {
            let profilePictureUrl = profileFormData.profilePicture;

            if (profileFormData.profilePicture instanceof File) {
                const storage = getStorage();
                const storageRef = ref(storage, `profilePictures/${userId}`);
                await uploadBytes(storageRef, profileFormData.profilePicture);
                profilePictureUrl = await getDownloadURL(storageRef);
            }

            const response = await fetch(`/api/provider/users/${userId}/update-profile`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: profileFormData.username,
                    profilePicture: profilePictureUrl
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Network response was not ok');
            }

            const data = await response.json();
            console.log('Response:', data);
            setNotification('Profile updated successfully.');
        } catch (error) {
            console.error('Error updating profile:', error);
            setErrors({ general: error.message || 'Error updating profile' });
            setNotification('Error updating profile.');
        }

        // Clear the notification after a few seconds
        setTimeout(() => {
            setNotification('');
        }, 3000);
    };

    const handleEmailSubmit = async (e) => {
        e.preventDefault();

        if (profileFormData.newEmail === profileFormData.currentEmail) {
            setNotification('New email cannot be the same as the current email');
            return;
        }

        if (profileFormData.newEmail !== profileFormData.confirmNewEmail) {
            setNotification('New emails do not match');
            return;
        }

        try {
            const response = await fetch(`/api/provider/users/${userId}/request-email-update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    newEmail: profileFormData.newEmail
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                if (response.status === 400 && errorText.includes('Email already exists')) {
                    setNotification('Email already exists');
                } else {
                    throw new Error(errorText || 'Network response was not ok');
                }
            } else {
                const data = await response.json();
                console.log('Response:', data);
                setNotification('Verification email sent successfully. Please check your new email to verify.');
            }
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
        <div>
            <div className='bg-white border shadow rounded-md p-6 mx-auto'>
                {notification && (
                    <div className={`fixed top-4 right-4 px-4 py-2 rounded-md shadow-md ${notification.includes('successfully') ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                        {notification}
                    </div>
                )}
                <h2 className='text-2xl font-bold mb-6 text-center'>Update Profile Details</h2>

                {/* Profile Update Form */}
                <form onSubmit={handleProfileSubmit} className='space-y-6'>
                    <div className='flex flex-col items-center'>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>Profile Picture</label>
                        <input
                            type='file'
                            name='profilePicture'
                            className='hidden'
                            id='profilePictureInput'
                            onChange={handleProfilePictureChange}
                        />
                        <label htmlFor='profilePictureInput' className='cursor-pointer'>
                            {profilePicturePreview ? (
                                <img
                                    src={profilePicturePreview}
                                    alt='Profile Preview'
                                    className='w-32 h-32 rounded-full object-cover border-2 border-gray-300'
                                />
                            ) : (
                                <div className='w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-500'>
                                    Upload
                                </div>
                            )}
                        </label>
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700'>Username</label>
                        <input
                            type='text'
                            name='username'
                            className='mt-1 p-2 border rounded-md w-full'
                            value={profileFormData.username}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <button type='submit' className='w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300'>
                        Update Profile
                    </button>
                </form>
            </div>
            <div className='bg-white border shadow rounded-md p-6 mt-8 mx-auto'>
                <h2 className='text-2xl font-bold mb-6 text-center'>Update Email</h2>
                {/* Email Update Form */}
                <form onSubmit={handleEmailSubmit} className='space-y-6'>
                    <div>
                        <label className='block text-sm font-medium text-gray-700'>Current Email</label>
                        <input
                            type='email'
                            name='currentEmail'
                            className='mt-1 p-2 border rounded-md w-full'
                            value={profileFormData.currentEmail}
                            onChange={handleInputChange}
                            disabled
                        />
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700'>New Email</label>
                        <input
                            type='email'
                            name='newEmail'
                            className='mt-1 p-2 border rounded-md w-full'
                            value={profileFormData.newEmail}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700'>Confirm New Email</label>
                        <input
                            type='email'
                            name='confirmNewEmail'
                            className='mt-1 p-2 border rounded-md w-full'
                            value={profileFormData.confirmNewEmail}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <button type='submit' className='w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300'>
                        Update Email
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UpdateAccountDetails;