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
    };    return (
        <div className='space-y-6'>
            {/* Profile Picture Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 sm:p-6 border border-blue-100">
                <div className="flex flex-col items-center space-y-4">
                    <div className="relative group">
                        <div
                            className='relative cursor-pointer transition-all duration-300 group-hover:scale-105'
                            onClick={handleFileInputClick}
                        >
                            {profilePicturePreview ? (
                                <div className="relative">
                                    <img
                                        src={profilePicturePreview}
                                        alt='Profile Preview'
                                        className='w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-full border-3 border-white shadow-lg'
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-full transition-all duration-300 flex items-center justify-center">
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className='w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center border-3 border-white shadow-lg group-hover:from-gray-300 group-hover:to-gray-400 transition-all duration-300'>
                                    <svg className="w-12 h-12 text-gray-500 group-hover:text-gray-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                    </svg>
                                </div>
                            )}

                            {/* Camera Icon Overlay */}
                            <div className="absolute bottom-1 right-1 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-md border-2 border-white group-hover:bg-blue-700 transition-colors duration-300">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                </svg>
                            </div>

                            <input
                                type='file'
                                id='profilePicture'
                                name='profilePicture'
                                onChange={handleFileChange}
                                className='hidden'
                                ref={profilePictureInputRef}
                                accept="image/*"
                            />
                        </div>
                    </div>                    <div className="text-center space-y-1">
                        <h3 className="text-base font-semibold text-gray-800">Profile Picture</h3>
                        <p className='text-sm text-gray-600'>Click on the image to change your profile picture</p>
                        <p className='text-xs text-gray-500'>Supported formats: JPG, PNG, GIF (Max 5MB)</p>
                    </div>
                </div>
            </div>

            {/* Action Section */}
            <form onSubmit={handleSubmit}>
                <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                        <div className="space-y-1">
                            <h4 className="text-base font-semibold text-gray-800">Save Changes</h4>
                            <p className="text-sm text-gray-600">Update your profile picture to reflect your current appearance</p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                type='submit'
                                disabled={isLoading}
                                className='px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-md font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 text-sm'
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Updating...</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                        <span>Update Profile</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </form>

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
};

export default UpdateProfile;