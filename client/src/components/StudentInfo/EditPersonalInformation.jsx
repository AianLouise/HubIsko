import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { RiEditFill, RiSaveFill, RiCloseFill } from "react-icons/ri";
import CustomNotification from '../CustomNotification';

export default function EditPersonalInformation() {
    const { currentUser } = useSelector((state) => state.user);
    const userId = currentUser._id;

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [isEditing, setIsEditing] = useState(false);
    const [originalFormData, setOriginalFormData] = useState(null);
    const [formData, setFormData] = useState({
        applicantDetails: {
            firstName: '',
            middleName: '',
            lastName: '',
            nameExtension: '',
            birthdate: '',
            gender: '',
            bloodType: '',
            civilStatus: '',
            maidenName: '',
            spouseName: '',
            spouseOccupation: '',
            religion: '',
            height: '',
            weight: '',
            birthplace: '',
            contactNumber: '',
        },
    });

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await fetch(`/api/auth/user/${userId}`);
                if (!response.ok) {
                    throw new Error('Error fetching user details');
                }

                const user = await response.json();

                // Corrected syntax for setFormData
                setFormData({
                    applicantDetails: {
                        firstName: user.applicantDetails.firstName,
                        middleName: user.applicantDetails.middleName,
                        lastName: user.applicantDetails.lastName,
                        nameExtension: user.applicantDetails.nameExtension,
                        birthdate: formatDate(user.applicantDetails.birthdate), // If needed, format the date
                        gender: user.applicantDetails.gender,
                        bloodType: user.applicantDetails.bloodType,
                        civilStatus: user.applicantDetails.civilStatus,
                        maidenName: user.applicantDetails.maidenName,
                        spouseName: user.applicantDetails.spouseName,
                        spouseOccupation: user.applicantDetails.spouseOccupation,
                        religion: user.applicantDetails.religion,
                        height: user.applicantDetails.height,
                        weight: user.applicantDetails.weight,
                        birthplace: user.applicantDetails.birthplace,
                        contactNumber: user.applicantDetails.contactNumber,
                    },
                });
                setOriginalFormData({
                    applicantDetails: {
                        firstName: user.applicantDetails.firstName,
                        middleName: user.applicantDetails.middleName,
                        lastName: user.applicantDetails.lastName,
                        nameExtension: user.applicantDetails.nameExtension,
                        birthdate: formatDate(user.applicantDetails.birthdate), // If needed, format the date
                        gender: user.applicantDetails.gender,
                        bloodType: user.applicantDetails.bloodType,
                        civilStatus: user.applicantDetails.civilStatus,
                        maidenName: user.applicantDetails.maidenName,
                        spouseName: user.applicantDetails.spouseName,
                        spouseOccupation: user.applicantDetails.spouseOccupation,
                        religion: user.applicantDetails.religion,
                        height: user.applicantDetails.height,
                        weight: user.applicantDetails.weight,
                        birthplace: user.applicantDetails.birthplace,
                        contactNumber: user.applicantDetails.contactNumber,
                    },
                });
            } catch (error) {
                console.error('Error fetching user details:', error);
                setErrors({ general: 'Error fetching user details' });
            }
        };

        fetchUserDetails();
    }, [userId]);

    const [notification, setNotification] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            applicantDetails: {
                ...prevFormData.applicantDetails,
                [name]: value,
            },
        }));
    };

    const handleSave = async () => {
        const formattedData = {
            ...formData,
            birthdate: formatDate(formData.birthdate)
        };

        console.log('Saving data:', formattedData);

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

    const inputBaseClasses = "block w-full p-2 rounded-lg border transition duration-200";

    const inputClasses = isEditing
        ? `${inputBaseClasses} border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 shadow-sm`
        : `${inputBaseClasses} bg-gray-100 border-gray-200 cursor-not-allowed`;

    const selectClasses = isEditing
        ? `${inputBaseClasses} border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 shadow-sm`
        : `${inputBaseClasses} bg-gray-100 border-gray-200 cursor-not-allowed`;

    return (
        <div className="bg-white lg:gap-8 w-full border shadow rounded-md">
            <div className="flex justify-between items-center p-4 lg:px-12 lg:py-4 rounded-t-md border-b">
                <span className="text-base lg:text-xl font-bold">Your Personal Information</span>
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
            <div className="grid lg:grid-cols-4 gap-4 pt-2 lg:px-12 p-4 lg:py-8">
                {/* First Row: First Name, Last Name, Middle Name, Name Extension */}
                <div className="flex flex-col gap-2">
                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                    <input
                        type="text"
                        name="firstName"
                        className={inputClasses}
                        value={formData.applicantDetails.firstName}
                        onChange={handleChange}
                        disabled={!isEditing}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                    <input
                        type="text"
                        name="lastName"
                        className={inputClasses}
                        value={formData.applicantDetails.lastName}
                        onChange={handleChange}
                        disabled={!isEditing}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="block text-sm font-medium text-gray-700">Middle Name</label>
                    <input
                        type="text"
                        name="middleName"
                        className={inputClasses}
                        value={formData.applicantDetails.middleName}
                        onChange={handleChange}
                        disabled={!isEditing}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="block text-sm font-medium text-gray-700">Name Extension</label>
                    <select
                        name="nameExtension"
                        className={inputClasses}
                        value={formData.applicantDetails.nameExtension}
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
                    <label className="block text-sm font-medium text-gray-700">Birthdate</label>
                    <input
                        type="date"
                        name="birthdate"
                        className={inputClasses}
                        value={formData.applicantDetails.birthdate}
                        onChange={handleChange}
                        disabled={!isEditing}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="block text-sm font-medium text-gray-700">Gender</label>
                    <select
                        name="gender"
                        className={inputClasses}
                        value={formData.applicantDetails.gender}
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
                    <label className="block text-sm font-medium text-gray-700">Blood Type</label>
                    <select
                        name="bloodType"
                        className={inputClasses}
                        value={formData.applicantDetails.bloodType}
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
                    <label className="block text-sm font-medium text-gray-700">Religion</label>
                    <select
                        name="religion"
                        className={inputClasses}
                        value={formData.applicantDetails.religion}
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
                    <label className="block text-sm font-medium text-gray-700">Civil Status</label>
                    <select
                        name="civilStatus"
                        className={inputClasses}
                        value={formData.applicantDetails.civilStatus}
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
                    <label className="block text-sm font-medium text-gray-700">Maiden Name</label>
                    <input
                        type="text"
                        name="maidenName"
                        className={inputClasses}
                        value={formData.applicantDetails.maidenName}
                        onChange={handleChange}
                        disabled={!isEditing || formData.civilStatus !== 'Married'}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="block text-sm font-medium text-gray-700">Spouse Name</label>
                    <input
                        type="text"
                        name="spouseName"
                        className={inputClasses}
                        value={formData.applicantDetails.spouseName}
                        onChange={handleChange}
                        disabled={!isEditing || formData.civilStatus !== 'Married'}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="block text-sm font-medium text-gray-700">Spouse Occupation</label>
                    <input
                        type="text"
                        name="spouseOccupation"
                        className={inputClasses}
                        value={formData.applicantDetails.spouseOccupation}
                        onChange={handleChange}
                        disabled={!isEditing || formData.civilStatus !== 'Married'}
                    />
                </div>

                {/* Fourth Row: Height, Weight, Birthplace, Contact Number */}
                <div className="flex flex-col gap-2">
                    <label className="block text-sm font-medium text-gray-700">Height (cm)</label>
                    <input
                        type="number"
                        name="height"
                        className={inputClasses}
                        value={formData.applicantDetails.height}
                        onChange={handleChange}
                        disabled={!isEditing}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
                    <input
                        type="number"
                        name="weight"
                        className={inputClasses}
                        value={formData.applicantDetails.weight}
                        onChange={handleChange}
                        disabled={!isEditing}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="block text-sm font-medium text-gray-700">Birthplace</label>
                    <input
                        type="text"
                        name="birthplace"
                        className={inputClasses}
                        value={formData.applicantDetails.birthplace}
                        onChange={handleChange}
                        disabled={!isEditing}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                    <input
                        type="text"
                        name="contactNumber"
                        className={inputClasses}
                        value={formData.applicantDetails.contactNumber}
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
