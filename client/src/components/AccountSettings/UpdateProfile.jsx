import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase'; // Adjust the import path as needed
import CustomNotification from '../CustomNotification';
import { updateUserSuccess } from '../../redux/user/userSlice'; // Adjust the import path as needed

const UpdateProfile = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state) => state.user);
    const userId = currentUser._id;

    const [formData, setFormData] = useState({
        profilePicture: currentUser.profilePicture,
    });
    const [notification, setNotification] = useState({ message: '', type: '' });
    const [profilePicturePreview, setProfilePicturePreview] = useState(currentUser.profilePicture);
    const [isLoading, setIsLoading] = useState(false);

    // Refs for file inputs
    const profilePictureInputRef = useRef(null);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await fetch(`/api/auth/user/${userId}`);
                if (!response.ok) {
                    throw new Error('Error fetching user details');
                }
                const user = await response.json();
                setFormData({
                    profilePicture: user.profilePicture
                });
                setProfilePicturePreview(user.profilePicture);
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

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prevData) => ({
                ...prevData,
                profilePicture: file
            }));

            // Update the preview with the selected image
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePicturePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFileInputClick = () => {
        if (profilePictureInputRef.current) {
            profilePictureInputRef.current.click();
        }
    };

    const handleConfirmSubmit = async () => {
        setIsLoading(true);

        let profilePictureUrl = formData.profilePicture;

        try {
            // Upload profile picture if a new file is selected
            if (formData.profilePicture && typeof formData.profilePicture === 'object') {
                const storageRef = ref(storage, `profilePictures/${userId}_${formData.profilePicture.name}`);
                await uploadBytes(storageRef, formData.profilePicture);
                profilePictureUrl = await getDownloadURL(storageRef);
            }

            const updatedFormData = {
                profilePicture: profilePictureUrl,
            };
            console.log('Updated form data:', updatedFormData);

            const response = await fetch(`/api/profile/update-profile/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedFormData),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }

            const data = await response.json();
            console.log('Success:', data);

            // Update the currentUser state in Redux
            dispatch(updateUserSuccess({
                ...currentUser,
                profilePicture: profilePictureUrl,
            }));

            // Show success notification
            setNotification({ message: 'Profile updated successfully!', type: 'success' });
        } catch (error) {
            console.error('Error:', error);
            setNotification({ message: `Error: ${error.message}`, type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleConfirmSubmit();
    };

    return (
        <div className='bg-white shadow w-full border flex flex-col p-10 h-auto rounded-md text-slate-700'>
            <h1 className='font-bold text-xl mb-8'>Update Profile</h1>
            <form className='flex flex-col gap-8' onSubmit={handleSubmit}>
                <div className='flex flex-col items-center'>
                    <span className='font-medium text-slate-500 mb-2'>Profile Picture <span className="text-red-500">*</span></span>
                    <div
                        className='relative cursor-pointer mb-2'
                        onClick={handleFileInputClick}
                    >
                        {profilePicturePreview ? (
                            <img
                                src={profilePicturePreview}
                                alt='Profile Preview'
                                className='w-32 h-32 object-cover rounded-full border'
                            />
                        ) : (
                            <div className='w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center'>
                                <span className='text-gray-500'>No Image</span>
                            </div>
                        )}
                        <input
                            type='file'
                            id='profilePicture'
                            name='profilePicture'
                            onChange={handleFileChange}
                            className='hidden'
                            ref={profilePictureInputRef}
                        />
                    </div>
                    <p className='text-sm text-gray-500'>Click to change profile picture</p>
                </div>
                <div className='w-full flex flex-row justify-end my-4 mt-8'>
                    <button type='submit' className='bg-blue-600 px-10 font-medium text-white p-3 rounded-lg hover:bg-blue-800 transition ease-in-out'>
                        {isLoading ? 'Updating...' : 'Update Profile'}
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
};

export default UpdateProfile;