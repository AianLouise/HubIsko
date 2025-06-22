import React, { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { RiEditFill, RiSaveFill, RiCloseFill } from "react-icons/ri";
import CustomNotification from '../CustomNotification';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const EducationInformation = () => {
    const { currentUser } = useSelector((state) => state.user);
    const userId = currentUser._id;

    const [isEditing, setIsEditing] = useState(false);
    const [originalFormData, setOriginalFormData] = useState(null);
    const [formData, setFormData] = useState({
        education: {
            elementary: {
                school: '',
                award: '',
                yearGraduated: '',
            },
            juniorHighSchool: {
                school: '',
                award: '',
                yearGraduated: '',
            },
            seniorHighSchool: {
                school: '',
                award: '',
                yearGraduated: '',
            },
            college: {
                school: '',
                course: ''
            }
        }
    });

    const [errors, setErrors] = useState({});
    const [notification, setNotification] = useState(null);

    useEffect(() => {        const fetchUserDetails = async () => {
            try {
                const response = await fetch(`${apiUrl}/api/auth/user/${userId}`);
                if (!response.ok) {
                    throw new Error('Error fetching user details');
                }

                const user = await response.json();
                console.log('User details:', user.applicantDetails.education);
                setFormData({
                    education: user.applicantDetails.education || {
                        elementary: {
                            school: '',
                            award: '',
                            yearGraduated: '',
                        },
                        juniorHighSchool: {
                            school: '',
                            award: '',
                            yearGraduated: '',
                        },
                        seniorHighSchool: {
                            school: '',
                            award: '',
                            yearGraduated: '',
                        },
                        college: {
                            school: '',
                            course: ''
                        }
                    }
                });
                setOriginalFormData({
                    education: user.applicantDetails.education || {
                        elementary: {
                            school: '',
                            award: '',
                            yearGraduated: '',
                        },
                        juniorHighSchool: {
                            school: '',
                            award: '',
                            yearGraduated: '',
                        },
                        seniorHighSchool: {
                            school: '',
                            award: '',
                            yearGraduated: '',
                        },
                        college: {
                            school: '',
                            course: ''
                        }
                    }
                });
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };

        fetchUserDetails();
    }, [userId]);

    const toggleEdit = () => {
        setIsEditing(!isEditing);
    };

    const handleCancel = () => {
        setFormData(originalFormData);
        setErrors({}); // Clear the errors
        setIsEditing(false);
    };

    const handleChange = (e, level) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            education: {
                ...formData.education,
                [level]: {
                    ...formData.education[level],
                    [name]: value,
                },
            },
        });
    };

    const handleSave = async () => {
        console.log('handleSave function called'); // Log function call

        const newErrors = {};
        const levels = ['elementary', 'juniorHighSchool', 'seniorHighSchool', 'college'];
        levels.forEach(level => {
            if (!formData.education[level].school) newErrors[`${level}School`] = 'School name is required';
            if (level !== 'college' && formData.education[level].award === '') newErrors[`${level}Award`] = 'Award is required';
            if (level !== 'college' && !formData.education[level].yearGraduated) newErrors[`${level}YearGraduated`] = 'Year graduated is required';
        });

        if (Object.keys(newErrors).length > 0) {
            console.log('Validation errors:', newErrors); // Log validation errors
            setErrors(newErrors);
            setNotification({ type: 'error', message: 'Please fill out all required fields' });
            return;
        }        console.log('Saving education details:', formData.education); // Log education details to be saved
        try {
            const response = await fetch(`${apiUrl}/api/profile/user/${userId}/education`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    education: formData.education,
                }),
            });

            if (!response.ok) {
                throw new Error('Error updating education details');
            }

            const result = await response.json();
            console.log('Save result:', result); // Log save result
            setOriginalFormData({
                education: formData.education,
            });
            setErrors({}); // Clear errors after successful save
            setIsEditing(false);

            // Show success notification
            setNotification({
                type: 'success',
                message: 'Education details updated successfully!'
            });
        } catch (error) {
            console.error('Error updating education details:', error); // Log error

            // Show error notification
            setNotification({
                type: 'error',
                message: 'Failed to update education details. Please try again.'
            });
        }
    };

    const handleCloseNotification = () => {
        setNotification(null);
    };

    const courses = [
        "BA in Anthropology",
        "BA in Art Studies",
        "BA in Communication",
        "BA in Development Communication",
        "BA in Economics",
        "BA in Fine Arts",
        "BA in Geography",
        "BA in History",
        "BA in International Relations",
        "BA in Journalism",
        "BA in Law",
        "BA in Linguistics",
        "BA in Media Studies",
        "BA in Religious Studies",
        "BA in Social Work",
        "BS in Accounting",
        "BS in Accounting Information Systems",
        "BS in Accounting Technology",
        "BS in Aerospace Engineering",
        "BS in Agribusiness Management",
        "BS in Agricultural Engineering",
        "BS in Agriculture",
        "BS in Animal Science",
        "BS in Applied Mathematics",
        "BS in Applied Physics",
        "BS in Architecture",
        "BS in Astronomy",
        "BS in Biochemistry",
        "BS in Biology",
        "BS in Biomedical Engineering",
        "BS in Biosystems Engineering",
        "BS in Business Administration",
        "BS in Business Administration major in Financial Management",
        "BS in Business Analytics",
        "BS in Business Management",
        "BS in Chemical Engineering",
        "BS in Chemistry",
        "BS in Civil Engineering",
        "BS in Communication",
        "BS in Computer Engineering",
        "BS in Computer Science",
        "BS in Criminology",
        "BS in Cyber Security",
        "BS in Data Analytics",
        "BS in Data Science",
        "BS in Dentistry",
        "BS in Digital Media Arts",
        "BS in Education",
        "BS in Electrical Engineering",
        "BS in Elementary Education",
        "BS in Electronics and Communications Engineering",
        "BS in Electronics Engineering",
        "BS in Environmental Engineering",
        "BS in Environmental Science",
        "BS in Fashion Design",
        "BS in Finance",
        "BS in Food Science",
        "BS in Food Technology",
        "BS in Forensic Science",
        "BS in Forestry",
        "BS in Geodetic Engineering",
        "BS in Geology",
        "BS in Graphic Design",
        "BS in Health Sciences",
        "BS in Horticulture",
        "BS in Hospitality Management",
        "BS in Hotel and Restaurant Management",
        "BS in Human Resource Development",
        "BS in Industrial Design",
        "BS in Industrial Engineering",
        "BS in Information Systems",
        "BS in Information Technology",
        "BS in Internal Auditing",
        "BS in Landscape Architecture",
        "BS in Library and Information Science",
        "BS in Management Accounting",
        "BS in Marine Biology",
        "BS in Marine Engineering",
        "BS in Marine Transportation",
        "BS in Marketing",
        "BS in Materials Science",
        "BS in Mathematics",
        "BS in Mechanical Engineering",
        "BS in Medical Laboratory Science",
        "BS in Medical Technology",
        "BS in Medicine",
        "BS in Metallurgical Engineering",
        "BS in Microbiology",
        "BS in Midwifery",
        "BS in Mining Engineering",
        "BS in Molecular Biology",
        "BS in Multimedia Arts",
        "BS in Music",
        "BS in Nanotechnology",
        "BS in Nursing",
        "BS in Nutrition",
        "BS in Occupational Therapy",
        "BS in Oceanography",
        "BS in Pharmacy",
        "BS in Physical Therapy",
        "BS in Physics",
        "BS in Political Science",
        "BS in Psychology",
        "BS in Public Health",
        "BS in Radiologic Technology",
        "BS in Real Estate Management",
        "BS in Renewable/Sustainable Energy Engineering",
        "BS in Robotics Engineering",
        "BS in Secondary Education major in Biology",
        "BS in Secondary Education major in Chemistry",
        "BS in Secondary Education major in English",
        "BS in Secondary Education major in General Sciences",
        "BS in Secondary Education major in Mathematics",
        "BS in Secondary Education major in Physics",
        "BS in Social Work",
        "BS in Sociology",
        "BS in Software Engineering",
        "BS in Statistics",
        "BS in Tourism Management",
        "BS in Veterinary Medicine",
        "BS in Zoology"
    ];    const inputBaseClasses = "block w-full px-3 py-2.5 rounded-md border transition-all duration-200 text-sm";
    const getInputClasses = (isEditing) => {
        return isEditing
            ? `${inputBaseClasses} border-gray-300 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none shadow-sm hover:border-gray-400`
            : `${inputBaseClasses} bg-gray-50 border-gray-200 cursor-not-allowed text-gray-700`;
    };

    return (
        <div className="bg-white w-full rounded-lg shadow-md border border-gray-100 overflow-hidden">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 sm:px-6 py-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"></path>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path>
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">Educational Background</h3>
                            <p className="text-blue-100 text-sm">Manage your academic history and achievements</p>
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
            <div className="p-4 sm:p-6">                {/* Form Description */}
                <div className="mb-6 p-3 bg-blue-50 rounded-md border border-blue-200">
                    <div className="flex items-start space-x-3">
                        <div className="w-4 h-4 text-blue-600 mt-0.5">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-blue-800 mb-1">Educational Background Form</h4>
                            <p className="text-xs text-blue-700">Please provide accurate information about your educational journey. Fields marked with <span className="text-red-500">*</span> are required.</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">                    {/* Elementary */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-7 h-7 bg-green-100 rounded-full flex items-center justify-center">
                                <span className="text-green-600 font-bold text-xs">1</span>
                            </div>
                            <h4 className="text-base font-bold text-gray-900">Elementary Education</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pl-10">
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">School Name <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    name="school"
                                    value={formData.education?.elementary?.school || ''}
                                    onChange={(e) => handleChange(e, 'elementary')}
                                    required
                                    placeholder="Enter elementary school name"
                                    className={getInputClasses(isEditing)}
                                    disabled={!isEditing}
                                />
                                {errors.elementarySchool && <p className="text-red-500 text-xs mt-1 flex items-center space-x-1">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                                    </svg>
                                    <span>{errors.elementarySchool}</span>
                                </p>}
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Award <span className="text-red-500">*</span> 
                                    <span className="text-gray-500 font-normal"> (Type N/A if not applicable)</span>
                                </label>
                                <input
                                    type="text"
                                    name="award"
                                    value={formData.education?.elementary?.award || ''}
                                    onChange={(e) => handleChange(e, 'elementary')}
                                    placeholder="Enter award or N/A"
                                    className={getInputClasses(isEditing)}
                                    disabled={!isEditing}
                                />
                                {errors.elementaryAward && <p className="text-red-500 text-xs mt-1 flex items-center space-x-1">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                                    </svg>
                                    <span>{errors.elementaryAward}</span>
                                </p>}
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">Year Graduated <span className="text-red-500">*</span></label>
                                <select
                                    name="yearGraduated"
                                    value={formData.education?.elementary?.yearGraduated || ''}
                                    onChange={(e) => handleChange(e, 'elementary')}
                                    required
                                    className={getInputClasses(isEditing)}
                                    disabled={!isEditing}
                                >
                                    <option value="">Select graduation year</option>
                                    {Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i).map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                                {errors.elementaryYearGraduated && <p className="text-red-500 text-xs mt-1 flex items-center space-x-1">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                                    </svg>
                                    <span>{errors.elementaryYearGraduated}</span>
                                </p>}
                            </div>
                        </div>
                    </div>                    {/* Junior High School */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 font-bold text-xs">2</span>
                            </div>
                            <h4 className="text-base font-bold text-gray-900">Junior High School</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pl-10">
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">School Name <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    name="school"
                                    value={formData.education?.juniorHighSchool?.school || ''}
                                    onChange={(e) => handleChange(e, 'juniorHighSchool')}
                                    required
                                    placeholder="Enter junior high school name"
                                    className={getInputClasses(isEditing)}
                                    disabled={!isEditing}
                                />
                                {errors.juniorHighSchoolSchool && <p className="text-red-500 text-xs mt-1 flex items-center space-x-1">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                                    </svg>
                                    <span>{errors.juniorHighSchoolSchool}</span>
                                </p>}
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Award <span className="text-red-500">*</span> 
                                    <span className="text-gray-500 font-normal"> (Type N/A if not applicable)</span>
                                </label>
                                <input
                                    type="text"
                                    name="award"
                                    value={formData.education?.juniorHighSchool?.award || ''}
                                    onChange={(e) => handleChange(e, 'juniorHighSchool')}
                                    placeholder="Enter award or N/A"
                                    className={getInputClasses(isEditing)}
                                    disabled={!isEditing}
                                />
                                {errors.juniorHighSchoolAward && <p className="text-red-500 text-xs mt-1 flex items-center space-x-1">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                                    </svg>
                                    <span>{errors.juniorHighSchoolAward}</span>
                                </p>}
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">Year Graduated <span className="text-red-500">*</span></label>
                                <select
                                    name="yearGraduated"
                                    value={formData.education?.juniorHighSchool?.yearGraduated || ''}
                                    onChange={(e) => handleChange(e, 'juniorHighSchool')}
                                    required
                                    className={getInputClasses(isEditing)}
                                    disabled={!isEditing}
                                >
                                    <option value="">Select graduation year</option>
                                    {Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i).map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                                {errors.juniorHighSchoolYearGraduated && <p className="text-red-500 text-xs mt-1 flex items-center space-x-1">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                                    </svg>
                                    <span>{errors.juniorHighSchoolYearGraduated}</span>
                                </p>}
                            </div>
                        </div>
                    </div>                    {/* Senior High School */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-7 h-7 bg-purple-100 rounded-full flex items-center justify-center">
                                <span className="text-purple-600 font-bold text-xs">3</span>
                            </div>
                            <h4 className="text-base font-bold text-gray-900">Senior High School</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pl-10">
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">School Name <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    name="school"
                                    value={formData.education?.seniorHighSchool?.school || ''}
                                    onChange={(e) => handleChange(e, 'seniorHighSchool')}
                                    required
                                    placeholder="Enter senior high school name"
                                    className={getInputClasses(isEditing)}
                                    disabled={!isEditing}
                                />
                                {errors.seniorHighSchoolSchool && <p className="text-red-500 text-xs mt-1 flex items-center space-x-1">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                                    </svg>
                                    <span>{errors.seniorHighSchoolSchool}</span>
                                </p>}
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Award <span className="text-red-500">*</span> 
                                    <span className="text-gray-500 font-normal"> (Type N/A if not applicable)</span>
                                </label>
                                <input
                                    type="text"
                                    name="award"
                                    value={formData.education?.seniorHighSchool?.award || ''}
                                    onChange={(e) => handleChange(e, 'seniorHighSchool')}
                                    placeholder="Enter award or N/A"
                                    className={getInputClasses(isEditing)}
                                    disabled={!isEditing}
                                />
                                {errors.seniorHighSchoolAward && <p className="text-red-500 text-xs mt-1 flex items-center space-x-1">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                                    </svg>
                                    <span>{errors.seniorHighSchoolAward}</span>
                                </p>}
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">Year Graduated <span className="text-red-500">*</span></label>
                                <select
                                    name="yearGraduated"
                                    value={formData.education?.seniorHighSchool?.yearGraduated || ''}
                                    onChange={(e) => handleChange(e, 'seniorHighSchool')}
                                    required
                                    className={getInputClasses(isEditing)}
                                    disabled={!isEditing}
                                >
                                    <option value="">Select graduation year</option>
                                    {Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i).map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                                {errors.seniorHighSchoolYearGraduated && <p className="text-red-500 text-xs mt-1 flex items-center space-x-1">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                                    </svg>
                                    <span>{errors.seniorHighSchoolYearGraduated}</span>
                                </p>}
                            </div>
                        </div>
                    </div>                    {/* College */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-7 h-7 bg-orange-100 rounded-full flex items-center justify-center">
                                <span className="text-orange-600 font-bold text-xs">4</span>
                            </div>
                            <h4 className="text-base font-bold text-gray-900">College Education</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pl-10">
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">College Name <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    name="school"
                                    value={formData.education?.college?.school || ''}
                                    onChange={(e) => handleChange(e, 'college')}
                                    required
                                    placeholder="Enter college/university name"
                                    className={getInputClasses(isEditing)}
                                    disabled={!isEditing}
                                />
                                {errors.collegeSchool && <p className="text-red-500 text-xs mt-1 flex items-center space-x-1">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                                    </svg>
                                    <span>{errors.collegeSchool}</span>
                                </p>}
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">Course <span className="text-red-500">*</span></label>
                                <select
                                    name="course"
                                    value={formData.education?.college?.course || ''}
                                    onChange={(e) => handleChange(e, 'college')}
                                    required
                                    className={getInputClasses(isEditing)}
                                    disabled={!isEditing}
                                >
                                    <option value="" disabled>Select your course</option>
                                    {courses.map((course) => (
                                        <option key={course} value={course}>{course}</option>
                                    ))}
                                </select>
                                {errors.collegeCourse && <p className="text-red-500 text-xs mt-1 flex items-center space-x-1">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                                    </svg>
                                    <span>{errors.collegeCourse}</span>
                                </p>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Notification */}
            {notification && (
                <CustomNotification
                    type={notification.type}
                    message={notification.message}
                    onClose={handleCloseNotification}
                />
            )}
        </div>
    );
};

export default EducationInformation;