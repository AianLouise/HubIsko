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
                            <option value="BS in Accounting">BS in Accounting</option>
                            <option value="BS in Aerospace Engineering">BS in Aerospace Engineering</option>
                            <option value="BS in Agricultural Engineering">BS in Agricultural Engineering</option>
                            <option value="BS in Agriculture">BS in Agriculture</option>
                            <option value="BA in Anthropology">BA in Anthropology</option>
                            <option value="BS in Applied Mathematics">BS in Applied Mathematics</option>
                            <option value="BS in Architecture">BS in Architecture</option>
                            <option value="BA in Art Studies">BA in Art Studies</option>
                            <option value="BS in Astronomy">BS in Astronomy</option>
                            <option value="BS in Biochemistry">BS in Biochemistry</option>
                            <option value="BS in Biology">BS in Biology</option>
                            <option value="BS in Biomedical Engineering">BS in Biomedical Engineering</option>
                            <option value="BS in Business Administration">BS in Business Administration</option>
                            <option value="BS in Business Management">BS in Business Management</option>
                            <option value="BS in Chemical Engineering">BS in Chemical Engineering</option>
                            <option value="BS in Chemistry">BS in Chemistry</option>
                            <option value="BS in Civil Engineering">BS in Civil Engineering</option>
                            <option value="BA in Communication">BA in Communication</option>
                            <option value="BS in Computer Engineering">BS in Computer Engineering</option>
                            <option value="BS in Computer Science">BS in Computer Science</option>
                            <option value="BS in Criminology">BS in Criminology</option>
                            <option value="BS in Dentistry">BS in Dentistry</option>
                            <option value="BA in Development Communication">BA in Development Communication</option>
                            <option value="BS in Digital Media Arts">BS in Digital Media Arts</option>
                            <option value="BA in Economics">BA in Economics</option>
                            <option value="BS in Education">BS in Education</option>
                            <option value="BS in Electrical Engineering">BS in Electrical Engineering</option>
                            <option value="BS in Electronics Engineering">BS in Electronics Engineering</option>
                            <option value="BS in Elementary Education">BS in Elementary Education</option>
                            <option value="BS in Environmental Engineering">BS in Environmental Engineering</option>
                            <option value="BS in Environmental Science">BS in Environmental Science</option>
                            <option value="BS in Fashion Design">BS in Fashion Design</option>
                            <option value="BS in Finance">BS in Finance</option>
                            <option value="BA in Fine Arts">BA in Fine Arts</option>
                            <option value="BS in Food Science">BS in Food Science</option>
                            <option value="BS in Forestry">BS in Forestry</option>
                            <option value="BS in Forensic Science">BS in Forensic Science</option>
                            <option value="BS in Geodetic Engineering">BS in Geodetic Engineering</option>
                            <option value="BA in Geography">BA in Geography</option>
                            <option value="BS in Geology">BS in Geology</option>
                            <option value="BS in Graphic Design">BS in Graphic Design</option>
                            <option value="BS in Health Sciences">BS in Health Sciences</option>
                            <option value="BA in History">BA in History</option>
                            <option value="BS in Hospitality Management">BS in Hospitality Management</option>
                            <option value="BS in Hotel and Restaurant Management">BS in Hotel and Restaurant Management</option>
                            <option value="BS in Human Resource Development">BS in Human Resource Development</option>
                            <option value="BS in Industrial Design">BS in Industrial Design</option>
                            <option value="BS in Industrial Engineering">BS in Industrial Engineering</option>
                            <option value="BS in Information Systems">BS in Information Systems</option>
                            <option value="BS in Information Technology">BS in Information Technology</option>
                            <option value="BS in Interior Design">BS in Interior Design</option>
                            <option value="BA in International Relations">BA in International Relations</option>
                            <option value="BA in Journalism">BA in Journalism</option>
                            <option value="BS in Landscape Architecture">BS in Landscape Architecture</option>
                            <option value="BA in Law">BA in Law</option>
                            <option value="BA in Linguistics">BA in Linguistics</option>
                            <option value="BS in Management Accounting">BS in Management Accounting</option>
                            <option value="BS in Marine Biology">BS in Marine Biology</option>
                            <option value="BS in Marine Engineering">BS in Marine Engineering</option>
                            <option value="BS in Marine Transportation">BS in Marine Transportation</option>
                            <option value="BS in Marketing">BS in Marketing</option>
                            <option value="BS in Materials Science">BS in Materials Science</option>
                            <option value="BS in Mathematics">BS in Mathematics</option>
                            <option value="BS in Mechanical Engineering">BS in Mechanical Engineering</option>
                            <option value="BA in Media Studies">BA in Media Studies</option>
                            <option value="BS in Medical Laboratory Science">BS in Medical Laboratory Science</option>
                            <option value="BS in Medicine">BS in Medicine</option>
                            <option value="BS in Metallurgical Engineering">BS in Metallurgical Engineering</option>
                            <option value="BS in Microbiology">BS in Microbiology</option>
                            <option value="BS in Midwifery">BS in Midwifery</option>
                            <option value="BS in Mining Engineering">BS in Mining Engineering</option>
                            <option value="BS in Molecular Biology">BS in Molecular Biology</option>
                            <option value="BS in Multimedia Arts">BS in Multimedia Arts</option>
                            <option value="BS in Music">BS in Music</option>
                            <option value="BS in Nanotechnology">BS in Nanotechnology</option>
                            <option value="BS in Nursing">BS in Nursing</option>
                            <option value="BS in Nutrition">BS in Nutrition</option>
                            <option value="BS in Occupational Therapy">BS in Occupational Therapy</option>
                            <option value="BS in Oceanography">BS in Oceanography</option>
                            <option value="BS in Pharmacy">BS in Pharmacy</option>
                            <option value="BS in Physical Therapy">BS in Physical Therapy</option>
                            <option value="BS in Physics">BS in Physics</option>
                            <option value="BS in Political Science">BS in Political Science</option>
                            <option value="BS in Psychology">BS in Psychology</option>
                            <option value="BS in Public Health">BS in Public Health</option>
                            <option value="BS in Radiologic Technology">BS in Radiologic Technology</option>
                            <option value="BS in Real Estate Management">BS in Real Estate Management</option>
                            <option value="BA in Religious Studies">BA in Religious Studies</option>
                            <option value="BA in Social Work">BA in Social Work</option>
                            <option value="BS in Sociology">BS in Sociology</option>
                            <option value="BS in Software Engineering">BS in Software Engineering</option>
                            <option value="BS in Statistics">BS in Statistics</option>
                            <option value="BS in Tourism Management">BS in Tourism Management</option>
                            <option value="BS in Veterinary Medicine">BS in Veterinary Medicine</option>
                            <option value="BS in Zoology">BS in Zoology</option>
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