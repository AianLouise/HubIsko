import React, { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
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
    const [errors, setErrors] = useState({}); // Initialize errors state

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await fetch(`/api/auth/user/${userId}`);
                if (!response.ok) {
                    throw new Error('Error fetching user details');
                }

                const user = await response.json();

                setFormData({
                    applicantDetails: {
                        firstName: user.applicantDetails.firstName,
                        middleName: user.applicantDetails.middleName,
                        lastName: user.applicantDetails.lastName,
                        nameExtension: user.applicantDetails.nameExtension,
                        birthdate: formatDate(user.applicantDetails.birthdate),
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
                        birthdate: formatDate(user.applicantDetails.birthdate),
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
        // Prevent negative numbers for height and weight
        if ((name === 'height' || name === 'weight') && value < 0) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                [name]: 'Value cannot be negative',
            }));
            return;
        } else {
            setErrors((prevErrors) => ({
                ...prevErrors,
                [name]: '',
            }));
        }

        setFormData((prevFormData) => {
            const updatedFormData = {
                ...prevFormData,
                applicantDetails: {
                    ...prevFormData.applicantDetails,
                    [name]: value,
                },
            };

            if (name === 'civilStatus' && value !== 'Married') {
                updatedFormData.applicantDetails.maidenName = '';
                updatedFormData.applicantDetails.spouseName = '';
                updatedFormData.applicantDetails.spouseOccupation = '';
            }

            return updatedFormData;
        });
    };

    const validateForm = () => {
        const newErrors = {};
        const requiredFields = ['firstName', 'lastName', 'birthdate', 'height', 'weight', 'birthplace', 'contactNumber'];

        requiredFields.forEach(field => {
            if (!formData.applicantDetails[field]) {
                newErrors[field] = 'This field is required';
            }
        });

        if (formData.applicantDetails.civilStatus === 'Married') {
            const marriedFields = ['maidenName', 'spouseName', 'spouseOccupation'];
            marriedFields.forEach(field => {
                if (!formData.applicantDetails[field]) {
                    newErrors[field] = 'This field is required';
                }
            });
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) {
            setNotification({ type: 'error', message: 'Please fill out all required fields' });
            return;
        }

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
                const updatedUser = await response.json();
                setIsEditing(false);
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
                        required
                    />
                    {errors.firstName && <span className="text-red-500 text-sm">{errors.firstName}</span>}
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
                        required
                    />
                    {errors.lastName && <span className="text-red-500 text-sm">{errors.lastName}</span>}
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
                        required
                    />
                    {errors.birthdate && <span className="text-red-500 text-sm">{errors.birthdate}</span>}
                </div>
                <div className="flex flex-col gap-2">
                    <label className="block text-sm font-medium text-gray-700">Gender</label>
                    <select
                        name="gender"
                        className={inputClasses}
                        value={formData.applicantDetails.gender}
                        onChange={handleChange}
                        disabled={!isEditing}
                        required
                    >
                        <option value="" disabled>Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                    {errors.gender && <span className="text-red-500 text-sm">{errors.gender}</span>}
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
                        <option value="" disabled>Select</option>
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
                        required
                    >
                        <option value="" disabled>Select</option>
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Divorced">Divorced</option>
                        <option value="Widowed">Widowed</option>
                    </select>
                </div>

                {formData.applicantDetails.civilStatus === 'Married' && (
                    <>
                        <div className="flex flex-col gap-2">
                            <label className="block text-sm font-medium text-gray-700">Maiden Name</label>
                            <input
                                type="text"
                                name="maidenName"
                                className={inputClasses}
                                value={formData.applicantDetails.maidenName}
                                onChange={handleChange}
                                disabled={!isEditing}
                                required={formData.applicantDetails.civilStatus === 'Married'}
                            />
                            {errors.maidenName && <span className="text-red-500 text-sm">{errors.maidenName}</span>}
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="block text-sm font-medium text-gray-700">Spouse Name</label>
                            <input
                                type="text"
                                name="spouseName"
                                className={inputClasses}
                                value={formData.applicantDetails.spouseName}
                                onChange={handleChange}
                                disabled={!isEditing}
                                required={formData.applicantDetails.civilStatus === 'Married'}
                            />
                            {errors.spouseName && <span className="text-red-500 text-sm">{errors.spouseName}</span>}
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="block text-sm font-medium text-gray-700">Spouse Occupation</label>
                            <input
                                type="text"
                                name="spouseOccupation"
                                className={inputClasses}
                                value={formData.applicantDetails.spouseOccupation}
                                onChange={handleChange}
                                disabled={!isEditing}
                                required={formData.applicantDetails.civilStatus === 'Married'}
                            />
                            {errors.spouseOccupation && <span className="text-red-500 text-sm">{errors.spouseOccupation}</span>}
                        </div>
                    </>
                )}

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
                        required
                    />
                    {errors.height && <span className="text-red-500 text-sm">{errors.height}</span>}
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
                        required
                    />
                    {errors.weight && <span className="text-red-500 text-sm">{errors.weight}</span>}
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
                        required
                    />
                    {errors.birthplace && <span className="text-red-500 text-sm">{errors.birthplace}</span>}
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
                        required
                    />
                    {errors.contactNumber && <span className="text-red-500 text-sm">{errors.contactNumber}</span>}
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