import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaInfoCircle, FaUsers, FaGraduationCap, FaEllipsisH, FaUpload, FaFileContract } from 'react-icons/fa';
import { FaArrowRightLong } from "react-icons/fa6";
import StepTemplate from '../components/ScholarshipApplicationForm/StepTemplate';
import Step1 from '../components/ScholarshipApplicationForm/Step1';
import Step2 from '../components/ScholarshipApplicationForm/Step2';
import Step3 from '../components/ScholarshipApplicationForm/Step3';
import Step4 from '../components/ScholarshipApplicationForm/Step4';
import Step5 from '../components/ScholarshipApplicationForm/Step5';
import Step6 from '../components/ScholarshipApplicationForm/Step6';
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const ScholarshipApplicationForm = () => {
    const { currentUser } = useSelector((state) => state.user);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        middleName: '',
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
        email: '',
        contactNumber: '',
        addressDetails: '',
        region: '',
        province: '',
        city: '',
        barangay: '',
        father: {
            firstName: '',
            lastName: '',
            middleName: '',
            birthdate: '',
            occupation: '',
            yearlyIncome: '',
            contactNo: ''
        },
        mother: {
            firstName: '',
            lastName: '',
            middleName: '',
            birthdate: '',
            occupation: '',
            yearlyIncome: '',
            contactNo: ''
        },
        guardian: {
            firstName: '',
            lastName: '',
            middleName: '',
            birthdate: '',
            occupation: '',
            yearlyIncome: '',
            contactNo: ''
        },
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
                course: '',
                yearGraduated: ''
            }
        },
        relatives: Array(6).fill({
            name: '',
            birthdate: '',
            relationship: ''
        }),
        workExperience: Array(2).fill({
            companyName: '',
            position: '',
            startDate: '',
            monthlySalary: '',
            statusOfAppointment: ''
        }),
        skillsAndQualifications: Array(6).fill({
            skills: '',
            qualifications: ''
        }),
        documents: {},
        scholarshipProgram: '',
        applicant: currentUser._id,
    });

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [notification, setNotification] = useState(null);
    const [activeStep, setActiveStep] = useState(1);
    const [visibleRelativeIndex, setVisibleRelativeIndex] = useState(0);
    const [visibleWorkExperienceIndex, setVisibleWorkExperienceIndex] = useState(0);
    const [visibleSkillIndex, setVisibleSkillIndex] = useState(0);
    const navigate = useNavigate();
    const storage = getStorage();

    useEffect(() => {
        if (scholarshipId) {
            setFormData((prevFormData) => ({
                ...prevFormData,
                scholarshipProgram: scholarshipId, // Set the scholarshipProgram field with the id from the URL
            }));
        }
        // Scroll to the top of the page when the component is mounted
        window.scrollTo(0, 0);
    }, []);

    const { scholarshipId } = useParams();
    const [scholarship, setScholarship] = useState(null);
    const [requiredDocuments, setRequiredDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchScholarshipDetails = async () => {
            try {
                const response = await fetch(`/api/scholarshipProgram/scholarship-programs/${scholarshipId}`);

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                setScholarship(data);
            } catch (err) {
                setError(err.message);
            }
        };

        const fetchRequiredDocuments = async () => {
            try {
                const response = await fetch(`/api/scholarshipProgram/${scholarshipId}/required-documents`);

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                setRequiredDocuments(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchScholarshipDetails();
        fetchRequiredDocuments();
    }, [scholarshipId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    // if (error) {
    //     return <div>Error: {error}</div>;
    // }

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const steps = [
        {
            title: 'Personal Information',
            description: 'Fill out your personal information below',
            content: <Step1 formData={formData} setFormData={setFormData} />,
            validate: (formData) => {
                const errors = {};

                // Validate first name
                if (!formData.firstName || formData.firstName.trim() === '') {
                    errors.firstName = 'First name is required';
                }

                // Validate last name
                if (!formData.lastName || formData.lastName.trim() === '') {
                    errors.lastName = 'Last name is required';
                }

                // Validate birthdate
                if (!formData.birthdate) {
                    errors.birthdate = 'Birthdate is required';
                } else {
                    const today = new Date().toISOString().split('T')[0];
                    if (formData.birthdate > today) {
                        errors.birthdate = 'Birthdate cannot be in the future';
                    }
                }

                // Validate gender
                if (!formData.gender || formData.gender.trim() === '') {
                    errors.gender = 'Gender is required';
                }

                // Validate blood type
                if (!formData.bloodType || formData.bloodType.trim() === '') {
                    errors.bloodType = 'Blood type is required';
                }

                // Validate civil status
                if (!formData.civilStatus || formData.civilStatus.trim() === '') {
                    errors.civilStatus = 'Civil status is required';
                }

                // Validate email
                if (!formData.email || formData.email.trim() === '') {
                    errors.email = 'Email is required';
                } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
                    errors.email = 'Email is invalid';
                }

                // Validate contact number
                if (!formData.contactNumber || formData.contactNumber.trim() === '') {
                    errors.contactNumber = 'Contact number is required';
                } else if (!/^\d+$/.test(formData.contactNumber)) {
                    errors.contactNumber = 'Contact number is invalid';
                }

                // Validate address details
                if (!formData.addressDetails || formData.addressDetails.trim() === '') {
                    errors.addressDetails = 'Address details are required';
                }

                // Validate region
                if (!formData.region || formData.region.trim() === '') {
                    errors.region = 'Region is required';
                }

                // Validate province
                if (!formData.province || formData.province.trim() === '') {
                    errors.province = 'Province is required';
                }

                // Validate city
                if (!formData.city || formData.city.trim() === '') {
                    errors.city = 'City is required';
                }

                // Validate barangay
                if (!formData.barangay || formData.barangay.trim() === '') {
                    errors.barangay = 'Barangay is required';
                }

                return errors;
            },
        },
        {
            title: 'Custodian',
            description: 'Provide custodian details',
            content: <Step2 formData={formData} setFormData={setFormData} />,
            validate: (formData) => {
                const errors = {};

                // Check if the user has provided input for guardian or parents
                const hasGuardianInput = formData.guardian.firstName.trim() !== '' || formData.guardian.lastName.trim() !== '';
                const hasParentInput = formData.father.firstName.trim() !== '' || formData.mother.firstName.trim() !== '';

                if (hasGuardianInput) {
                    // Validate guardian details
                    if (!formData.guardian.firstName || formData.guardian.firstName.trim() === '') {
                        errors.guardianFirstName = 'Guardian\'s first name is required';
                    }
                    if (!formData.guardian.lastName || formData.guardian.lastName.trim() === '') {
                        errors.guardianLastName = 'Guardian\'s last name is required';
                    }
                    if (!formData.guardian.birthdate) {
                        errors.guardianBirthdate = 'Guardian\'s birthdate is required';
                    } else {
                        const today = new Date().toISOString().split('T')[0];
                        if (formData.guardian.birthdate > today) {
                            errors.guardianBirthdate = 'Guardian\'s birthdate cannot be in the future';
                        }
                    }
                    if (!formData.guardian.occupation || formData.guardian.occupation.trim() === '') {
                        errors.guardianOccupation = 'Guardian\'s occupation is required';
                    }
                    if (!formData.guardian.yearlyIncome || formData.guardian.yearlyIncome.trim() === '') {
                        errors.guardianYearlyIncome = 'Guardian\'s yearly income is required';
                    }
                    if (!formData.guardian.contactNo || formData.guardian.contactNo.trim() === '') {
                        errors.guardianContactNo = 'Guardian\'s contact number is required';
                    } else if (!/^\d+$/.test(formData.guardian.contactNo)) {
                        errors.guardianContactNo = 'Guardian\'s contact number is invalid';
                    }
                } else if (hasParentInput) {
                    // Validate father details
                    if (!formData.father.firstName || formData.father.firstName.trim() === '') {
                        errors.fatherFirstName = 'Father\'s first name is required';
                    }
                    if (!formData.father.lastName || formData.father.lastName.trim() === '') {
                        errors.fatherLastName = 'Father\'s last name is required';
                    }
                    if (!formData.father.birthdate) {
                        errors.fatherBirthdate = 'Father\'s birthdate is required';
                    } else {
                        const today = new Date().toISOString().split('T')[0];
                        if (formData.father.birthdate > today) {
                            errors.fatherBirthdate = 'Father\'s birthdate cannot be in the future';
                        }
                    }
                    if (!formData.father.occupation || formData.father.occupation.trim() === '') {
                        errors.fatherOccupation = 'Father\'s occupation is required';
                    }
                    if (!formData.father.yearlyIncome || formData.father.yearlyIncome.trim() === '') {
                        errors.fatherYearlyIncome = 'Father\'s yearly income is required';
                    }
                    if (!formData.father.contactNo || formData.father.contactNo.trim() === '') {
                        errors.fatherContactNo = 'Father\'s contact number is required';
                    } else if (!/^\d+$/.test(formData.father.contactNo)) {
                        errors.fatherContactNo = 'Father\'s contact number is invalid';
                    }

                    // Validate mother details
                    if (!formData.mother.firstName || formData.mother.firstName.trim() === '') {
                        errors.motherFirstName = 'Mother\'s first name is required';
                    }
                    if (!formData.mother.lastName || formData.mother.lastName.trim() === '') {
                        errors.motherLastName = 'Mother\'s last name is required';
                    }
                    if (!formData.mother.birthdate) {
                        errors.motherBirthdate = 'Mother\'s birthdate is required';
                    } else {
                        const today = new Date().toISOString().split('T')[0];
                        if (formData.mother.birthdate > today) {
                            errors.motherBirthdate = 'Mother\'s birthdate cannot be in the future';
                        }
                    }
                    if (!formData.mother.occupation || formData.mother.occupation.trim() === '') {
                        errors.motherOccupation = 'Mother\'s occupation is required';
                    }
                    if (!formData.mother.yearlyIncome || formData.mother.yearlyIncome.trim() === '') {
                        errors.motherYearlyIncome = 'Mother\'s yearly income is required';
                    }
                    if (!formData.mother.contactNo || formData.mother.contactNo.trim() === '') {
                        errors.motherContactNo = 'Mother\'s contact number is required';
                    } else if (!/^\d+$/.test(formData.mother.contactNo)) {
                        errors.motherContactNo = 'Mother\'s contact number is invalid';
                    }
                } else {
                    errors.general = 'Please provide details for either parents or a guardian';
                }

                return errors;
            },
        },
        {
            title: 'Education',
            description: 'Provide your educational background',
            content: <Step3 formData={formData} setFormData={setFormData} />,
            validate: (formData) => {
                const errors = {};

                // Validate elementary education details
                if (!formData.education.elementary.school || formData.education.elementary.school.trim() === '') {
                    errors.elementarySchool = 'Elementary school name is required';
                }
                if (!formData.education.elementary.yearGraduated || formData.education.elementary.yearGraduated.trim() === '') {
                    errors.elementaryYearGraduated = 'Elementary year graduated is required';
                } else if (!/^\d{4}$/.test(formData.education.elementary.yearGraduated)) {
                    errors.elementaryYearGraduated = 'Elementary year graduated must be a valid year';
                }

                // Validate junior high school education details
                if (!formData.education.juniorHighSchool.school || formData.education.juniorHighSchool.school.trim() === '') {
                    errors.juniorHighSchool = 'Junior high school name is required';
                }
                if (!formData.education.juniorHighSchool.yearGraduated || formData.education.juniorHighSchool.yearGraduated.trim() === '') {
                    errors.juniorHighSchoolYearGraduated = 'Junior high school year graduated is required';
                } else if (!/^\d{4}$/.test(formData.education.juniorHighSchool.yearGraduated)) {
                    errors.juniorHighSchoolYearGraduated = 'Junior high school year graduated must be a valid year';
                }

                // Validate senior high school education details
                if (!formData.education.seniorHighSchool.school || formData.education.seniorHighSchool.school.trim() === '') {
                    errors.seniorHighSchool = 'Senior high school name is required';
                }
                if (!formData.education.seniorHighSchool.yearGraduated || formData.education.seniorHighSchool.yearGraduated.trim() === '') {
                    errors.seniorHighSchoolYearGraduated = 'Senior high school year graduated is required';
                } else if (!/^\d{4}$/.test(formData.education.seniorHighSchool.yearGraduated)) {
                    errors.seniorHighSchoolYearGraduated = 'Senior high school year graduated must be a valid year';
                }

                // Validate college education details
                if (!formData.education.college.school || formData.education.college.school.trim() === '') {
                    errors.collegeSchool = 'College school name is required';
                }
                if (!formData.education.college.course || formData.education.college.course.trim() === '') {
                    errors.collegeCourse = 'College course is required';
                }
                // if (!formData.education.college.yearGraduated || formData.education.college.yearGraduated.trim() === '') {
                //     errors.collegeYearGraduated = 'College year graduated is required';
                // } else if (!/^\d{4}$/.test(formData.education.college.yearGraduated)) {
                //     errors.collegeYearGraduated = 'College year graduated must be a valid year';
                // }

                return errors;
            },
        },
        {
            title: 'Others',
            description: 'Provide other relevant information',
            content: <Step4 formData={formData} setFormData={setFormData} setNotification={setNotification} visibleRelativeIndex={visibleRelativeIndex}
                setVisibleRelativeIndex={setVisibleRelativeIndex} visibleSkillIndex={visibleSkillIndex} setVisibleSkillIndex={setVisibleSkillIndex} visibleWorkExperienceIndex={visibleWorkExperienceIndex} setVisibleWorkExperienceIndex={setVisibleWorkExperienceIndex} />,
            validate: (formData) => {
                const errors = {};

                // Validate relatives
                formData.relatives.forEach((relative, index) => {
                    if (index === 0) {
                        // Validate the first relative's details
                        if (!relative.name || relative.name.trim() === '') {
                            errors[`relativeName${index}`] = `Relative ${index + 1}'s name is required`;
                        }
                        if (!relative.birthdate) {
                            errors[`relativeBirthdate${index}`] = `Relative ${index + 1}'s birthdate is required`;
                        } else {
                            const today = new Date().toISOString().split('T')[0];
                            if (relative.birthdate > today) {
                                errors[`relativeBirthdate${index}`] = `Relative ${index + 1}'s birthdate cannot be in the future`;
                            }
                        }
                        if (!relative.relationship || relative.relationship.trim() === '') {
                            errors[`relativeRelationship${index}`] = `Relative ${index + 1}'s relationship is required`;
                        }
                    } else {
                        // Validate the rest of the relatives' details only if they have been filled out
                        if (relative.name && relative.name.trim() !== '') {
                            if (!relative.birthdate) {
                                errors[`relativeBirthdate${index}`] = `Relative ${index + 1}'s birthdate is required`;
                            } else {
                                const today = new Date().toISOString().split('T')[0];
                                if (relative.birthdate > today) {
                                    errors[`relativeBirthdate${index}`] = `Relative ${index + 1}'s birthdate cannot be in the future`;
                                }
                            }
                            if (!relative.relationship || relative.relationship.trim() === '') {
                                errors[`relativeRelationship${index}`] = `Relative ${index + 1}'s relationship is required`;
                            }
                        }
                    }
                });

                // Validate work experience
                formData.workExperience.forEach((work, index) => {
                    if (index === 0) {
                        // Validate the first work experience's details
                        if (!work.companyName || work.companyName.trim() === '') {
                            errors[`workCompanyName${index}`] = `Work experience ${index + 1}'s company name is required`;
                        }
                        if (!work.position || work.position.trim() === '') {
                            errors[`workPosition${index}`] = `Work experience ${index + 1}'s position is required`;
                        }
                        if (!work.startDate) {
                            errors[`workStartDate${index}`] = `Work experience ${index + 1}'s start date is required`;
                        } else {
                            const today = new Date().toISOString().split('T')[0];
                            if (work.startDate > today) {
                                errors[`workStartDate${index}`] = `Work experience ${index + 1}'s start date cannot be in the future`;
                            }
                        }
                        if (!work.monthlySalary || work.monthlySalary.trim() === '') {
                            errors[`workMonthlySalary${index}`] = `Work experience ${index + 1}'s monthly salary is required`;
                        }
                        if (!work.statusOfAppointment || work.statusOfAppointment.trim() === '') {
                            errors[`workStatusOfAppointment${index}`] = `Work experience ${index + 1}'s status of appointment is required`;
                        }
                    } else {
                        // Validate the rest of the work experiences' details only if they have been filled out
                        if (work.companyName && work.companyName.trim() !== '') {
                            if (!work.position || work.position.trim() === '') {
                                errors[`workPosition${index}`] = `Work experience ${index + 1}'s position is required`;
                            }
                            if (!work.startDate) {
                                errors[`workStartDate${index}`] = `Work experience ${index + 1}'s start date is required`;
                            } else {
                                const today = new Date().toISOString().split('T')[0];
                                if (work.startDate > today) {
                                    errors[`workStartDate${index}`] = `Work experience ${index + 1}'s start date cannot be in the future`;
                                }
                            }
                            if (!work.monthlySalary || work.monthlySalary.trim() === '') {
                                errors[`workMonthlySalary${index}`] = `Work experience ${index + 1}'s monthly salary is required`;
                            }
                            if (!work.statusOfAppointment || work.statusOfAppointment.trim() === '') {
                                errors[`workStatusOfAppointment${index}`] = `Work experience ${index + 1}'s status of appointment is required`;
                            }
                        }
                    }
                });

                // Validate skills and qualifications
                formData.skillsAndQualifications.forEach((skill, index) => {
                    if (index === 0) {
                        // Validate the first skill and qualification's details
                        if (!skill.skills || skill.skills.trim() === '') {
                            errors[`skills${index}`] = `Skill ${index + 1} is required`;
                        }
                        if (!skill.qualifications || skill.qualifications.trim() === '') {
                            errors[`qualifications${index}`] = `Qualification ${index + 1} is required`;
                        }
                    } else {
                        // Validate the rest of the skills and qualifications' details only if they have been filled out
                        if (skill.skills && skill.skills.trim() !== '') {
                            if (!skill.qualifications || skill.qualifications.trim() === '') {
                                errors[`qualifications${index}`] = `Qualification ${index + 1} is required`;
                            }
                        } else if (skill.qualifications && skill.qualifications.trim() !== '') {
                            if (!skill.skills || skill.skills.trim() === '') {
                                errors[`skills${index}`] = `Skill ${index + 1} is required`;
                            }
                        }
                    }
                });

                return errors;
            },
        },
        {
            title: 'Upload Requirements',
            description: 'Upload necessary documents for review',
            content:
                <Step5
                    formData={{}}
                    setFormData={() => { }}
                    errors={{}}
                    scholarship={scholarship}
                    requiredDocuments={requiredDocuments}
                />,
            validate: (formData) => {
                const errors = {};
                // Add validation logic for Step 5
                return errors;
            },
        },
        {
            title: 'Terms and Conditions',
            description: 'Please read and agree to the terms and conditions before submitting your application',
            content: <Step6 formData={formData} setFormData={setFormData} />,
            validate: (formData) => {
                const errors = {};
                // Add validation logic for Step 6
                return errors;
            },
        }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        console.log('Form Data:', formData);

        // Upload files to Firebase and get the file URLs
        const uploadedFilePaths = await Promise.all(Object.entries(formData.documents).map(async ([docType, fileObj]) => {
            if (fileObj) {
                const file = fileObj.file;
                const fileExtension = file.name.split('.').pop(); // Extract the file extension
                const fileNameWithoutExtension = file.name.replace(/\.[^/.]+$/, ""); // Remove the extension from the original file name
                const fileName = `${currentUser.username}_${fileNameWithoutExtension.replace(/\s+/g, '_')}_${uuidv4()}.${fileExtension}`;
                const storageRef = ref(storage, `scholarship_application_documents/${fileName}`);
                await uploadBytes(storageRef, file);
                const downloadURL = await getDownloadURL(storageRef);
                return { [docType]: downloadURL }; // Save the download URL in the database
            }
            return { [docType]: null };
        }));

        // Combine the uploaded file URLs with the rest of the form data
        const updatedFormData = {
            ...formData,
            documents: Object.assign({}, ...uploadedFilePaths),
        };

        console.log('Updated Form Data:', updatedFormData);

        // Send scholarship application data to the backend
        try {
            const response = await fetch('/api/scholarshipApplication/create-application', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedFormData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Success:', result);
            // Handle success (e.g., show a success message, redirect, etc.)
            navigate('/scholar-dashboard'); // Redirect to the scholar dashboard
        } catch (error) {
            console.error('Error:', error);
            // Handle error (e.g., show an error message)
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`flex flex-col min-h-screen`}>
            <main className={`flex-grow bg-[#f8f8fb] transition-all duration-200 ease-in-out ${sidebarOpen ? 'ml-64' : ''}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 mt-10">
                    {scholarship && (
                        <div className="scholarship-info mb-4 p-6 bg-white rounded-lg shadow-md">
                            <div className="flex items-center">
                                {scholarship.scholarshipImage && (
                                    <img src={scholarship.scholarshipImage} alt={`${scholarship.title} logo`} className="w-32 h-32 object-contain mr-4" />
                                )}
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">You are applying to {scholarship.title}</h2>
                                    <p className="text-gray-600 mt-2">{scholarship.description}</p>
                                </div>
                            </div>
                        </div>
                    )}
                    {notification && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded fixed top-4 right-4 z-50" role="alert">
                            <span className="block sm:inline">{notification}</span>
                        </div>
                    )}
                    <div>
                        <div className='flex justify-center gap-5 mt-4 mb-8'>
                            {[0, 1, 2, 3, 4, 5].map((step) => (
                                <React.Fragment key={step}>
                                    <div className='flex flex-col gap-1 items-center text-center'>
                                        <span className={`text-xl font-bold ${currentPage === step ? 'text-blue-600' : 'text-gray-400'}`}>{step + 1}</span>
                                        <button
                                            className={`w-12 h-12 shadow rounded-md flex items-center justify-center ${currentPage === step ? 'bg-blue-600' : 'border'}`}
                                            onClick={() => setCurrentPage(step)}
                                            disabled={currentPage !== step}
                                        >
                                            {step === 0 && <FaInfoCircle className={currentPage === step ? 'text-white' : 'text-blue-600'} />}
                                            {step === 1 && <FaUsers className={currentPage === step ? 'text-white' : 'text-blue-600'} />}
                                            {step === 2 && <FaGraduationCap className={currentPage === step ? 'text-white' : 'text-blue-600'} />}
                                            {step === 3 && <FaEllipsisH className={currentPage === step ? 'text-white' : 'text-blue-600'} />}
                                            {step === 4 && <FaUpload className={currentPage === step ? 'text-white' : 'text-blue-600'} />}
                                            {step === 5 && <FaFileContract className={currentPage === step ? 'text-white' : 'text-blue-600'} />}
                                        </button>
                                        <span className='text-sm text-slate-600'>
                                            {step === 0 && <>Personal <br /> Information</>}
                                            {step === 1 && "Custodian"}
                                            {step === 2 && "Education"}
                                            {step === 3 && "Others"}
                                            {step === 4 && <>Upload <br /> Requirements</>}
                                            {step === 5 && <>Terms and <br /> Conditions</>}
                                        </span>
                                    </div>
                                    {step < 5 && <FaArrowRightLong className='text-4xl text-blue-600 mt-10' />}
                                </React.Fragment>
                            ))}
                        </div>

                    </div>
                    <form onSubmit={handleSubmit}>
                        <StepTemplate
                            steps={steps}
                            formData={formData}
                            setFormData={setFormData}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            setNotification={setNotification} // Pass setNotification to StepTemplate
                            activeStep={activeStep} // Pass activeStep to StepTemplate
                        />
                    </form>
                </div>
            </main>
        </div>
    );
};

export default ScholarshipApplicationForm;