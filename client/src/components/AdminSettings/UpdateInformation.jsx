import React, { useState, useEffect } from 'react';

const UpdateInformation = ({ currentUser, dispatch, updateUserDetails }) => {
    const [formData, setFormData] = useState({
        adminDetails: {
            firstName: currentUser.adminDetails.firstName,
            lastName: currentUser.adminDetails.lastName,
            contactNumber: currentUser.adminDetails.contactNumber,
        },
    });

    const [notification, setNotification] = useState(null);

    const userId = currentUser._id;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            adminDetails: {
                ...prevData.adminDetails,
                [name]: value,
            },
        }));
    };

    const handleSaveChanges = async (e) => {
        e.preventDefault();
        const updatedFormData = {
            ...formData,
        };

        console.log('Form Data:', updatedFormData);

        try {
            const response = await fetch(`/api/provider/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedFormData),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('Response:', data);
            // Handle success (e.g., show a success message)
            // Dispatch the action to update the currentUser details in the Redux store
            dispatch(updateUserDetails(updatedFormData));
            setNotification('Information updated successfully!');
            setTimeout(() => setNotification(null), 3000); // Hide notification after 3 seconds
        } catch (error) {
            console.error('Error updating user information:', error);
            // Handle error (e.g., show an error message)
            setNotification('Error updating information.');
            setTimeout(() => setNotification(null), 3000); // Hide notification after 3 seconds
        }
    };

    return (
        <div className='bg-white border shadow rounded-md p-4'>
            {notification && (
                <div className='fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-md'>
                    {notification}
                </div>
            )}
            <h2 className='text-2xl font-bold mb-4'>Update Information</h2>
            <form onSubmit={handleSaveChanges}>
                <h2 className='text-xl font-semibold mb-4'>Admin Details</h2>
                <div className='mb-4'>
                    <label className='block text-xs font-medium text-gray-700'>First Name</label>
                    <input
                        type='text'
                        name='firstName'
                        className='mt-1 p-2 border rounded-md w-full text-sm'
                        value={formData.adminDetails.firstName}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className='mb-4'>
                    <label className='block text-xs font-medium text-gray-700'>Last Name</label>
                    <input
                        type='text'
                        name='lastName'
                        className='mt-1 p-2 border rounded-md w-full text-sm'
                        value={formData.adminDetails.lastName}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className='mb-4'>
                    <label className='block text-xs font-medium text-gray-700'>Contact Number</label>
                    <input
                        type='text'
                        name='contactNumber'
                        className='mt-1 p-2 border rounded-md w-full text-sm'
                        value={formData.adminDetails.contactNumber}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <button type='submit' className='bg-blue-600 text-white px-4 py-2 rounded-md text-sm'>Save Changes</button>
            </form>
        </div>
    );
};

export default UpdateInformation;