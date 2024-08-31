import React, { useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { RiEditFill, RiSaveFill, RiCloseFill } from "react-icons/ri";
import CustomNotification from '../CustomNotification';
import { updateUser } from '../../redux/user/userSlice'; // Import your action

export default function EditPersonalInformation() {
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state) => state.user);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: currentUser.applicantDetails.firstName || '',
        middleName: currentUser.applicantDetails.middleName || '',
        lastName: currentUser.applicantDetails.lastName || '',
        nameExtension: currentUser.applicantDetails.nameExtension || '',
        birthdate: formatDate(currentUser.applicantDetails.birthdate) || '',
        gender: currentUser.applicantDetails.gender || '',
        bloodType: currentUser.applicantDetails.bloodType || '',
        civilStatus: currentUser.applicantDetails.civilStatus || '',
        maidenName: currentUser.applicantDetails.maidenName || '',
        spouseName: currentUser.applicantDetails.spouseName || '',
        spouseOccupation: currentUser.applicantDetails.spouseOccupation || '',
        religion: currentUser.applicantDetails.religion || '',
        height: currentUser.applicantDetails.height || '',
        weight: currentUser.applicantDetails.weight || '',
        birthplace: currentUser.applicantDetails.birthplace || '',
        contactNumber: currentUser.applicantDetails.contactNumber || '',
    });

    const [originalFormData, setOriginalFormData] = useState(formData);
    const [notification, setNotification] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSave = async () => {
        const formattedData = {
            ...formData,
            birthdate: formatDate(formData.birthdate)
        };

        try {
            const response = await fetch(`/api/profile/user/${currentUser._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formattedData),
            });

            if (response.ok) {
                const updatedUser = await response.json(); // Assuming the updated user data is returned
                dispatch(updateUser(updatedUser)); // Update the Redux store
                alert('Information updated successfully');
                setIsEditing(false); // Exit editing mode after successful save
                setNotification({ type: 'success', message: 'User information updated successfully' });
            } else {
                throw new Error('Failed to update information');
            }
        } catch (error) {
            console.error('Error updating information:', error);
            setNotification({ type: 'error', message: 'Server error' });
        }
    };

    const toggleEdit = () => {
        setIsEditing(!isEditing);
    };

    const handleCancel = () => {
        // Logic to reset the form data to its original state
        setFormData(originalFormData);
        toggleEdit();
    };

    const handleCloseNotification = () => {
        setNotification(null);
    };

    const inputClasses = isEditing
        ? "w-full p-2 rounded-md border-2 border-blue-600 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
        : "w-full bg-slate-200 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600";

    return (
        <div className="bg-white p-6 rounded-md shadow-md">
            <div className="flex justify-between items-center px-4 pb-4 rounded-t-md border-b">
                <span className="text-base lg:text-xl font-bold">Student Information</span>
                <div className="flex gap-2">
                    <button
                        onClick={isEditing ? handleSave : toggleEdit}
                        className="flex gap-2 items-center bg-blue-600 text-white lg:px-6 px-4 py-2 rounded-md font-bold hover:bg-blue-800"
                    >
                        {isEditing ? <RiSaveFill /> : <RiEditFill />}
                        {isEditing ? 'Save' : 'Edit'}
                    </button>
                    {isEditing && (
                        <button
                            onClick={handleCancel}
                            className="flex gap-2 items-center bg-red-600 text-white lg:px-6 px-4 py-2 rounded-md font-bold hover:bg-red-800"
                        >
                            <RiCloseFill />
                            Cancel
                        </button>
                    )}
                </div>
            </div>
            <div className="grid grid-cols-4 gap-4 pt-2">
                {/* First Row: First Name, Last Name, Middle Name, Name Extension */}
                <div className="flex flex-col gap-2">
                    <label className="text-slate-400">First Name</label>
                    <input
                        type="text"
                        name="firstName"
                        className={inputClasses}
                        value={formData.firstName}
                        onChange={handleChange}
                        disabled={!isEditing}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-slate-400">Last Name</label>
                    <input
                        type="text"
                        name="lastName"
                        className={inputClasses}
                        value={formData.lastName}
                        onChange={handleChange}
                        disabled={!isEditing}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-slate-400">Middle Name</label>
                    <input
                        type="text"
                        name="middleName"
                        className={inputClasses}
                        value={formData.middleName}
                        onChange={handleChange}
                        disabled={!isEditing}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-slate-400">Name Extension</label>
                    <select
                        name="nameExtension"
                        className={inputClasses}
                        value={formData.nameExtension}
                        onChange={handleChange}
                        disabled={!isEditing}
                    >
                        <option value="">Select Name Ext. (if applicable)</option>
                        <option value="Jr.">Jr.</option>
                        <option value="Sr.">Sr.</option>
                        <option value="II">II</option>
                        <option value="III">III</option>
                        <option value="IV">IV</option>
                        <option value="V">V</option>
                    </select>
                </div>

                {/* Second Row: Birthdate, Gender, Blood Type, Religion */}
                <div className="flex flex-col gap-2">
                    <label className="text-slate-400">Birthdate</label>
                    <input
                        type="date"
                        name="birthdate"
                        className={inputClasses}
                        value={formData.birthdate}
                        onChange={handleChange}
                        disabled={!isEditing}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-slate-400">Gender</label>
                    <select
                        name="gender"
                        className={inputClasses}
                        value={formData.gender}
                        onChange={handleChange}
                        disabled={!isEditing}
                    >
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-slate-400">Blood Type</label>
                    <select
                        name="bloodType"
                        className={inputClasses}
                        value={formData.bloodType}
                        onChange={handleChange}
                        disabled={!isEditing}
                    >
                        <option value="">Select</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                    </select>
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-slate-400">Religion</label>
                    <select
                        name="religion"
                        className={inputClasses}
                        value={formData.religion}
                        onChange={handleChange}
                        disabled={!isEditing}
                    >
                        <option value="Roman Catholic">Roman Catholic</option>
                        <option value="Iglesia ni Cristo">Iglesia ni Cristo</option>
                        <option value="Islam">Islam</option>
                        <option value="Born Again Christian">Born Again Christian</option>
                        <option value="Others">Others</option>
                    </select>
                </div>

                {/* Third Row: Civil Status, Maiden Name, Spouse Name, Spouse Occupation */}
                <div className="flex flex-col gap-2">
                    <label className="text-slate-400">Civil Status</label>
                    <select
                        name="civilStatus"
                        className={inputClasses}
                        value={formData.civilStatus}
                        onChange={handleChange}
                        disabled={!isEditing}
                    >
                        <option value="">Select</option>
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Divorced">Divorced</option>
                        <option value="Widowed">Widowed</option>
                    </select>
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-slate-400">Maiden Name</label>
                    <input
                        type="text"
                        name="maidenName"
                        className={inputClasses}
                        value={formData.maidenName}
                        onChange={handleChange}
                        disabled={!isEditing || formData.civilStatus !== 'Married'}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-slate-400">Spouse Name</label>
                    <input
                        type="text"
                        name="spouseName"
                        className={inputClasses}
                        value={formData.spouseName}
                        onChange={handleChange}
                        disabled={!isEditing || formData.civilStatus !== 'Married'}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-slate-400">Spouse Occupation</label>
                    <input
                        type="text"
                        name="spouseOccupation"
                        className={inputClasses}
                        value={formData.spouseOccupation}
                        onChange={handleChange}
                        disabled={!isEditing || formData.civilStatus !== 'Married'}
                    />
                </div>

                {/* Fourth Row: Height, Weight, Birthplace, Contact Number */}
                <div className="flex flex-col gap-2">
                    <label className="text-slate-400">Height (cm)</label>
                    <input
                        type="number"
                        name="height"
                        className={inputClasses}
                        value={formData.height}
                        onChange={handleChange}
                        disabled={!isEditing}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-slate-400">Weight (kg)</label>
                    <input
                        type="number"
                        name="weight"
                        className={inputClasses}
                        value={formData.weight}
                        onChange={handleChange}
                        disabled={!isEditing}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-slate-400">Birthplace</label>
                    <input
                        type="text"
                        name="birthplace"
                        className={inputClasses}
                        value={formData.birthplace}
                        onChange={handleChange}
                        disabled={!isEditing}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-slate-400">Contact Number</label>
                    <input
                        type="text"
                        name="contactNumber"
                        className={inputClasses}
                        value={formData.contactNumber}
                        onChange={handleChange}
                        disabled={!isEditing}
                    />
                </div>
            </div>
            {notification && (
                <CustomNotification
                    type={notification.type}
                    message={notification.message}
                    onClose={handleCloseNotification}
                />
            )}
        </div>
    );
}
