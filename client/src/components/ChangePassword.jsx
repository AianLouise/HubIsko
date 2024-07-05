import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changePasswordStart, changePasswordSuccess, changePasswordFail } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom'; // Import Link

export default function ChangePassword() {
    const { currentUser, loading, error } = useSelector((state) => state.user);
    const navigate = useNavigate(); // Initialize useNavigate

    const dispatch = useDispatch();
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [updateSuccess, setUpdateSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmNewPassword) {
            alert("New passwords do not match.");
            return;
        }
        const formData = { oldPassword, newPassword };
        try {
            dispatch(changePasswordStart());
            const response = await fetch(`/api/user/change-password/${currentUser._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "An error occurred while changing the password.");
            }
            dispatch(changePasswordSuccess());
            setUpdateSuccess(true);
        } catch (error) {
            dispatch(changePasswordFail(error.message));
            setUpdateSuccess(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <button onClick={() => navigate('/password-and-security')} className="self-start mb-4 ml-4 p-2 text-blue-500 hover:text-blue-700">
                ← Back to Password and Security
            </button>
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded shadow">
                <h2 className="text-2xl font-semibold text-center">Change Password</h2>
                {updateSuccess && <div className="text-sm text-green-500">Password successfully updated.</div>}
                {error && <div className="text-sm text-red-500">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700">Old Password</label>
                        <input type="password" id="oldPassword" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3" required />
                    </div>
                    <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
                        <input type="password" id="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3" required />
                    </div>
                    <div>
                        <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                        <input type="password" id="confirmNewPassword" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3" required />
                    </div>
                    <button type="submit" className="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700">Change Password</button>
                </form>
            </div>
        </div>
    );
}