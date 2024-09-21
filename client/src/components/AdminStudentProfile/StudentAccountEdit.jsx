import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function StudentAccountEdit() {
    const { id } = useParams();

    const [applicant, setApplicant] = useState({
        email: '',
        username: '',
        password: '',
        emailVerified: false,
        role: '',
        status: '',
    });

    const [isEditing, setIsEditing] = useState(false);
    const [notification, setNotification] = useState(''); // State for notification message

    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        emailVerified: false,
        role: '',
        status: '',
    });

    useEffect(() => {
        const fetchApplicantDetails = async () => {
            try {
                const response = await fetch(`/api/admin/applicant/${id}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setApplicant(data.applicant);
                setFormData(data.applicant); // Initialize formData with fetched data
            } catch (error) {
                console.error('Error fetching applicant details:', error);
            }
        };

        fetchApplicantDetails();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSaveChanges = async () => {
        const { email, username, password, emailVerified, role, status } = formData;

        if (!email || !username || !role || !status) {
            setNotification('Please fill in all required fields.');
            setTimeout(() => {
                setNotification('');
            }, 3000);
            return;
        }

        try {
            const response = await fetch(`/api/admin/student/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const updatedData = await response.json();
            setApplicant(updatedData.user); // Update the applicant state with the updated data
            setIsEditing(false);
            setNotification('Profile updated successfully'); // Set success notification
        } catch (error) {
            console.error('Error updating profile:', error);
            setNotification('Error updating profile'); // Set error notification
        }

        setTimeout(() => {
            setNotification('');
        }, 3000);
    };

    const handleCancel = () => {
        setFormData(applicant); // Revert changes
        setIsEditing(false);
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    if (!applicant) {
        return <div>Loading...</div>;
    }

    return (
        <div className="bg-white p-8 rounded-md shadow-md w-full relative">
            <div className="text-lg font-bold bg-slate-200 border-2 px-4 py-2 rounded-md">Account Information</div>

            {notification && (
                <div className="fixed z-20 top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-md">
                    {notification}
                </div>
            )}

            <form className='flex flex-col justify-between h-full'>
                <div className='gap-4 p-4'>
                    <div className='grid grid-cols-2 gap-4 px-4 mt-4'>
                        {/* Email */}
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>Email:</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                required
                            />
                        </div>

                        {/* Username */}
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>Username:</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                required
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>Password:</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                            />
                        </div>

                        {/* Email Verified */}
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>Email Verified:</label>
                            <input
                                type="checkbox"
                                name="emailVerified"
                                checked={formData.emailVerified}
                                onChange={handleChange}
                                className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600'
                            />
                        </div>

                        {/* Role */}
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>Role:</label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                required
                            >
                                <option value="">Select Role</option>
                                <option value="student">Student</option>
                                <option value="admin">Admin</option>
                                <option value="superadmin">Super Admin</option>
                            </select>
                        </div>

                        {/* Status */}
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>Status:</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                required
                            >
                                <option value="">Select Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="suspended">Suspended</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end mt-4">
                    {isEditing ? (
                        <>
                            <button
                                type="button"
                                onClick={handleSaveChanges}
                                className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
                            >
                                Save Changes
                            </button>
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="bg-gray-500 text-white px-4 py-2 rounded-md"
                            >
                                Cancel
                            </button>
                        </>
                    ) : (
                        <button
                            type="button"
                            onClick={handleEditClick}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md"
                        >
                            Edit
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}