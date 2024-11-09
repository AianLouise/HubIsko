import React, { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { RiEditFill, RiSaveFill, RiCloseFill } from "react-icons/ri";
import CustomNotification from '../CustomNotification';

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

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await fetch(`/api/auth/user/${userId}`);
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
        }

        console.log('Saving education details:', formData.education); // Log education details to be saved
        try {
            const response = await fetch(`/api/profile/user/${userId}/education`, {
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
        "BS in Accounting",
        "BS in Accounting Information Systems",
        "BS in Aerospace Engineering",
        "BS in Agricultural Engineering",
        "BS in Agriculture",
        "BS in Accounting Technology",
        "BSBA in Financial Management",
        "BS in Secondary Education major in Biology",
        "BS in Secondary Education major in Chemistry",
        "BS in Secondary Education major in General Sciences",
        "BS in Secondary Education major in Physics",
        "BS in Secondary Education major in Mathematics",
        "BS in Secondary Education major in English",
        "BS in Food Technology",
        "BS in Internal Auditing",
        "BA in Anthropology",
        "BS in Applied Mathematics",
        "BS in Architecture",
        "BA in Art Studies",
        "BS in Astronomy",
        "BS in Biochemistry",
        "BS in Biology",
        "BS in Biomedical Engineering",
        "BS in Business Administration",
        "BS in Business Management",
        "BS in Chemical Engineering",
        "BS in Chemistry",
        "BS in Civil Engineering",
        "BA in Communication",
        "BS in Computer Engineering",
        "BS in Computer Science",
        "BS in Criminology",
        "BS in Dentistry",
        "BA in Development Communication",
        "BS in Digital Media Arts",
        "BA in Economics",
        "BS in Education",
        "BS in Electrical Engineering",
        "BS in Electronics Engineering",
        "BS in Electronics and Communications Engineering",
        "BS in Elementary Education",
        "BS in Environmental Engineering",
        "BS in Environmental Science",
        "BS in Fashion Design",
        "BS in Finance",
        "BA in Fine Arts",
        "BS in Food Science",
        "BS in Forestry",
        "BS in Forensic Science",
        "BS in Geodetic Engineering",
        "BA in Geography",
        "BS in Geology",
        "BS in Graphic Design",
        "BS in Health Sciences",
        "BA in History",
        "BS in Hospitality Management",
        "BS in Hotel and Restaurant Management",
        "BS in Human Resource Development",
        "BS in Industrial Design",
        "BS in Industrial Engineering",
        "BS in Information Systems",
        "BS in Information Technology",
        "BS in Interior Design",
        "BA in International Relations",
        "BA in Journalism",
        "BS in Landscape Architecture",
        "BA in Law",
        "BA in Linguistics",
        "BS in Management Accounting",
        "BS in Marine Biology",
        "BS in Marine Engineering",
        "BS in Marine Transportation",
        "BS in Marketing",
        "BS in Materials Science",
        "BS in Mathematics",
        "BS in Mechanical Engineering",
        "BA in Media Studies",
        "BS in Medical Laboratory Science",
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
        "BA in Religious Studies",
        "BA in Social Work",
        "BS in Sociology",
        "BS in Software Engineering",
        "BS in Statistics",
        "BS in Tourism Management",
        "BS in Veterinary Medicine",
        "BS in Zoology"
    ];

    const inputBaseClasses = "block w-full p-2 rounded-lg border transition duration-200";
    const getInputClasses = (isEditing) => {
        return isEditing
            ? `${inputBaseClasses} border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 shadow-sm`
            : `${inputBaseClasses} bg-gray-100 border-gray-200 cursor-not-allowed`;
    };

    return (
        <div className="bg-white lg:gap-8 w-full border shadow rounded-md">
            <div className="flex justify-between items-center p-4 lg:px-12 lg:py-4 rounded-t-md border-b">
                <span className="text-base lg:text-xl font-bold">Your Education Background</span>
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

            <div className="flex flex-col px-4 lg:px-12 py-8 font-normal gap-4">
                {/* Elementary */}
                <span className='text-lg font-bold block'>Elementary</span>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>School</label>
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
                        {errors.elementarySchool && <p className="text-red-500 text-sm">{errors.elementarySchool}</p>}
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>Award</label>
                        <input
                            type="text"
                            name="award"
                            value={formData.education?.elementary?.award || ''}
                            onChange={(e) => handleChange(e, 'elementary')}
                            placeholder="Enter elementary award"
                            className={getInputClasses(isEditing)}
                            disabled={!isEditing}
                        />
                        {errors.elementaryAward && <p className="text-red-500 text-sm">{errors.elementaryAward}</p>}
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>Year Graduated</label>
                        <select
                            name="yearGraduated"
                            value={formData.education?.elementary?.yearGraduated || ''}
                            onChange={(e) => handleChange(e, 'elementary')}
                            required
                            className={getInputClasses(isEditing)}
                            disabled={!isEditing}
                        >
                            <option value="">Select year</option>
                            {Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i).map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                        {errors.elementaryYearGraduated && <p className="text-red-500 text-sm">{errors.elementaryYearGraduated}</p>}
                    </div>
                </div>

                {/* Junior High School */}
                <span className='text-lg font-bold mt-8 block'>Junior High School</span>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>School</label>
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
                        {errors.juniorHighSchoolSchool && <p className="text-red-500 text-sm">{errors.juniorHighSchoolSchool}</p>}
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>Award</label>
                        <input
                            type="text"
                            name="award"
                            value={formData.education?.juniorHighSchool?.award || ''}
                            onChange={(e) => handleChange(e, 'juniorHighSchool')}
                            placeholder="Enter junior high school award"
                            className={getInputClasses(isEditing)}
                            disabled={!isEditing}
                        />
                        {errors.juniorHighSchoolAward && <p className="text-red-500 text-sm">{errors.juniorHighSchoolAward}</p>}
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>Year Graduated</label>
                        <select
                            name="yearGraduated"
                            value={formData.education?.juniorHighSchool?.yearGraduated || ''}
                            onChange={(e) => handleChange(e, 'juniorHighSchool')}
                            required
                            className={getInputClasses(isEditing)}
                            disabled={!isEditing}
                        >
                            <option value="">Select year</option>
                            {Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i).map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                        {errors.juniorHighSchoolYearGraduated && <p className="text-red-500 text-sm">{errors.juniorHighSchoolYearGraduated}</p>}
                    </div>
                </div>

                {/* Senior High School */}
                <span className='text-lg font-bold mt-8 block'>Senior High School</span>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>School</label>
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
                        {errors.seniorHighSchoolSchool && <p className="text-red-500 text-sm">{errors.seniorHighSchoolSchool}</p>}
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>Award</label>
                        <input
                            type="text"
                            name="award"
                            value={formData.education?.seniorHighSchool?.award || ''}
                            onChange={(e) => handleChange(e, 'seniorHighSchool')}
                            placeholder="Enter senior high school award"
                            className={getInputClasses(isEditing)}
                            disabled={!isEditing}
                        />
                        {errors.seniorHighSchoolAward && <p className="text-red-500 text-sm">{errors.seniorHighSchoolAward}</p>}
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>Year Graduated</label>
                        <select
                            name="yearGraduated"
                            value={formData.education?.seniorHighSchool?.yearGraduated || ''}
                            onChange={(e) => handleChange(e, 'seniorHighSchool')}
                            required
                            className={getInputClasses(isEditing)}
                            disabled={!isEditing}
                        >
                            <option value="">Select year</option>
                            {Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i).map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                        {errors.seniorHighSchoolYearGraduated && <p className="text-red-500 text-sm">{errors.seniorHighSchoolYearGraduated}</p>}
                    </div>
                </div>

                {/* College */}
                <span className='text-lg font-bold mt-8 block'>College</span>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>College</label>
                        <input
                            type="text"
                            name="school"
                            value={formData.education?.college?.school || ''}
                            onChange={(e) => handleChange(e, 'college')}
                            required
                            placeholder="Enter college name"
                            className={getInputClasses(isEditing)}
                            disabled={!isEditing}
                        />
                        {errors.collegeSchool && <p className="text-red-500 text-sm">{errors.collegeSchool}</p>}
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>College Course</label>
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
                        {errors.collegeCourse && <p className="text-red-500 text-sm">{errors.collegeCourse}</p>}
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
};

export default EducationInformation;