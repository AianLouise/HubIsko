import React, { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { RiEditFill, RiSaveFill, RiCloseFill } from "react-icons/ri";
import CustomNotification from '../CustomNotification';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

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

    useEffect(() => {        const fetchUserDetails = async () => {
            try {
                const response = await fetch(`${apiUrl}/api/auth/user/${userId}`);
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

        // Validation for contact number
        if (name === 'contactNumber') {
            const isValid = /^09\d{9}$/.test(value);
            setErrors((prevErrors) => ({
                ...prevErrors,
                contactNumber: isValid ? '' : 'Please enter a valid 11-digit phone number starting with 09',
            }));
        }
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

        const isContactNumberValid = /^09\d{9}$/.test(formData.applicantDetails.contactNumber);

        if (!isContactNumberValid) {
            setNotification({ type: 'error', message: 'Please enter a valid 11-digit phone number starting with 09' });
            return;
        }

        const formattedData = {
            ...formData,
            birthdate: formatDate(formData.birthdate)
        };

        console.log('Saving data:', formattedData);        try {
            const response = await fetch(`${apiUrl}/api/profile/user/${currentUser._id}`, {
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
        setErrors({}); // Clear the errors
        toggleEdit();
    };

    const handleCloseNotification = () => {
        setNotification(null);
    };

    const today = new Date();
    const maxDate = new Date(today.setFullYear(today.getFullYear() - 15)).toISOString().split('T')[0];   
     const inputBaseClasses = "block w-full px-3 py-2.5 rounded-md border transition-all duration-200 text-sm";

    const inputClasses = isEditing
        ? `${inputBaseClasses} border-gray-300 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none shadow-sm hover:border-gray-400`
        : `${inputBaseClasses} bg-gray-50 border-gray-200 cursor-not-allowed text-gray-700`;

    const selectClasses = isEditing
        ? `${inputBaseClasses} border-gray-300 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none shadow-sm hover:border-gray-400`
        : `${inputBaseClasses} bg-gray-50 border-gray-200 cursor-not-allowed text-gray-700`;

    return (
        <div className="bg-white w-full rounded-lg shadow-md border border-gray-100 overflow-hidden">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 sm:px-6 py-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">Personal Information</h3>
                            <p className="text-blue-100 text-sm">Manage your personal details and information</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={isEditing ? handleSave : toggleEdit}
                            className="inline-flex items-center space-x-2 bg-white text-blue-600 font-medium px-4 py-2 rounded-md transition-all duration-200 hover:bg-blue-50 shadow-sm text-sm"
                        >
                            {isEditing ? <RiSaveFill className="w-4 h-4" /> : <RiEditFill className="w-4 h-4" />}
                            <span>{isEditing ? 'Save Changes' : 'Edit Information'}</span>
                        </button>
                        {isEditing && (
                            <button
                                onClick={handleCancel}
                                className="inline-flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-md transition-all duration-200 shadow-sm text-sm"
                            >
                                <RiCloseFill className="w-4 h-4" />
                                <span>Cancel</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Form Content */}
            <div className="p-4 sm:p-6">            
                    {/* Form Description */}
                <div className="mb-6 p-3 bg-blue-50 rounded-md border border-blue-200">
                    <div className="flex items-start space-x-3">
                        <div className="w-4 h-4 text-blue-600 mt-0.5">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-blue-800 mb-1">Personal Information Form</h4>
                            <p className="text-xs text-blue-700">Please ensure all information is accurate and up-to-date. Fields marked with <span className="text-red-500">*</span> are required.</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* First Row: First Name, Last Name, Middle Name, Name Extension */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">First Name <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            name="firstName"
                            className={inputClasses}
                            value={formData.applicantDetails.firstName}
                            onChange={handleChange}
                            disabled={!isEditing}
                            required
                            placeholder="Enter your first name"
                        />
                        {errors.firstName && <p className="text-red-500 text-xs mt-1 flex items-center space-x-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                            </svg>
                            <span>{errors.firstName}</span>
                        </p>}
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Last Name <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            name="lastName"
                            className={inputClasses}
                            value={formData.applicantDetails.lastName}
                            onChange={handleChange}
                            disabled={!isEditing}
                            required
                            placeholder="Enter your last name"
                        />
                        {errors.lastName && <p className="text-red-500 text-xs mt-1 flex items-center space-x-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                            </svg>
                            <span>{errors.lastName}</span>
                        </p>}
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Middle Name</label>
                        <input
                            type="text"
                            name="middleName"
                            className={inputClasses}
                            value={formData.applicantDetails.middleName}
                            onChange={handleChange}
                            disabled={!isEditing}
                            placeholder="Enter your middle name"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Name Extension</label>
                        <select
                            name="nameExtension"
                            className={selectClasses}
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
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Birthdate <span className="text-red-500">*</span></label>
                        <input
                            type="date"
                            name="birthdate"
                            className={inputClasses}
                            value={formData.applicantDetails.birthdate}
                            onChange={handleChange}
                            disabled={!isEditing}
                            required
                            max={maxDate}
                        />
                        {errors.birthdate && <p className="text-red-500 text-xs mt-1 flex items-center space-x-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                            </svg>
                            <span>{errors.birthdate}</span>
                        </p>}
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Gender <span className="text-red-500">*</span></label>
                        <select
                            name="gender"
                            className={selectClasses}
                            value={formData.applicantDetails.gender}
                            onChange={handleChange}
                            disabled={!isEditing}
                            required
                        >
                            <option value="" disabled>Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                        {errors.gender && <p className="text-red-500 text-xs mt-1 flex items-center space-x-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                            </svg>
                            <span>{errors.gender}</span>
                        </p>}
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Blood Type</label>
                        <select
                            name="bloodType"
                            className={selectClasses}
                            value={formData.applicantDetails.bloodType}
                            onChange={handleChange}
                            disabled={!isEditing}
                        >
                            <option value="" disabled>Select Blood Type</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                            <option value="unknown">I don't know</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Religion</label>
                        <input
                            type="text"
                            name="religion"
                            className={inputClasses}
                            value={formData.applicantDetails.religion}
                            onChange={handleChange}
                            placeholder="Enter your religion"
                            disabled={!isEditing}
                        />
                    </div>

                    {/* Third Row: Civil Status, Maiden Name, Spouse Name, Spouse Occupation */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Civil Status <span className="text-red-500">*</span></label>
                        <select
                            name="civilStatus"
                            className={selectClasses}
                            value={formData.applicantDetails.civilStatus}
                            onChange={handleChange}
                            disabled={!isEditing}
                            required
                        >
                            <option value="" disabled>Select Civil Status</option>
                            <option value="Single">Single</option>
                            <option value="Married">Married</option>
                            <option value="Divorced">Divorced</option>
                            <option value="Widowed">Widowed</option>
                        </select>
                    </div>

                    {formData.applicantDetails.civilStatus === 'Married' && (
                        <>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">Maiden Name <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    name="maidenName"
                                    className={inputClasses}
                                    value={formData.applicantDetails.maidenName}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    required={formData.applicantDetails.civilStatus === 'Married'}
                                    placeholder="Enter maiden name"
                                />
                                {errors.maidenName && <p className="text-red-500 text-xs mt-1 flex items-center space-x-1">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                                    </svg>
                                    <span>{errors.maidenName}</span>
                                </p>}
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">Spouse Name <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    name="spouseName"
                                    className={inputClasses}
                                    value={formData.applicantDetails.spouseName}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    required={formData.applicantDetails.civilStatus === 'Married'}
                                    placeholder="Enter spouse name"
                                />
                                {errors.spouseName && <p className="text-red-500 text-xs mt-1 flex items-center space-x-1">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                                    </svg>
                                    <span>{errors.spouseName}</span>
                                </p>}
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">Spouse Occupation <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    name="spouseOccupation"
                                    className={inputClasses}
                                    value={formData.applicantDetails.spouseOccupation}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    required={formData.applicantDetails.civilStatus === 'Married'}
                                    placeholder="Enter spouse occupation"
                                />
                                {errors.spouseOccupation && <p className="text-red-500 text-xs mt-1 flex items-center space-x-1">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                                    </svg>
                                    <span>{errors.spouseOccupation}</span>
                                </p>}
                            </div>
                        </>
                    )}

                    {/* Fourth Row: Height, Weight, Birthplace, Contact Number */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Height (cm) <span className="text-red-500">*</span></label>
                        <input
                            type="number"
                            name="height"
                            className={inputClasses}
                            value={formData.applicantDetails.height}
                            onChange={handleChange}
                            disabled={!isEditing}
                            required
                            placeholder="Enter height in cm"
                            min="1"
                        />
                        {errors.height && <p className="text-red-500 text-xs mt-1 flex items-center space-x-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                            </svg>
                            <span>{errors.height}</span>
                        </p>}
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Weight (kg) <span className="text-red-500">*</span></label>
                        <input
                            type="number"
                            name="weight"
                            className={inputClasses}
                            value={formData.applicantDetails.weight}
                            onChange={handleChange}
                            disabled={!isEditing}
                            required
                            placeholder="Enter weight in kg"
                            min="1"
                        />
                        {errors.weight && <p className="text-red-500 text-xs mt-1 flex items-center space-x-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                            </svg>
                            <span>{errors.weight}</span>
                        </p>}
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Birthplace <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            name="birthplace"
                            className={inputClasses}
                            value={formData.applicantDetails.birthplace}
                            onChange={handleChange}
                            disabled={!isEditing}
                            required
                            placeholder="Enter your birthplace"
                        />
                        {errors.birthplace && <p className="text-red-500 text-xs mt-1 flex items-center space-x-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                            </svg>
                            <span>{errors.birthplace}</span>
                        </p>}
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Contact Number <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            name="contactNumber"
                            className={inputClasses}
                            value={formData.applicantDetails.contactNumber}
                            onChange={handleChange}
                            onInput={(e) => {
                                e.target.value = e.target.value.replace(/[^0-9]/g, '');
                            }}
                            disabled={!isEditing}
                            maxLength="11"
                            pattern="09\d{9}"
                            title="Please enter a valid 11-digit phone number starting with 09"
                            required
                            inputMode="numeric"
                            placeholder="09XXXXXXXXX"
                        />
                        {errors.contactNumber && <p className="text-red-500 text-xs mt-1 flex items-center space-x-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                            </svg>
                            <span>{errors.contactNumber}</span>
                        </p>}
                    </div>
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