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
import useTokenExpiry from '../hooks/useTokenExpiry'; // Adjust the import path

const ScholarshipApplicationForm = () => {
    useTokenExpiry();
    const navigate = useNavigate();
    const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        if (currentUser) {
            if (currentUser.role === 'admin') {
                navigate('/admin-dashboard');
            } else if (currentUser.role === 'scholarship_provider') {
                if (!currentUser.emailVerified) {
                    navigate('/verify-your-email', { state: { email: currentUser.email } });
                } else {
                    navigate('/provider-dashboard');
                }
            }
        }
    }, [currentUser, navigate]);

    const userId = currentUser?._id;
    const [userDetails, setUserDetails] = useState(null);

    const [formData, setFormData] = useState({
        firstName: userDetails?.applicantDetails.firstName,
        lastName: '',
        middleName: '',
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

    // Load form data from localStorage when the component mounts
    useEffect(() => {
        const savedFormData = localStorage.getItem('scholarshipApplicationFormData');
        if (savedFormData) {
            const parsedFormData = JSON.parse(savedFormData);
            setFormData({
                ...parsedFormData,
                documents: [], // Clear the documents field
            });
        }
    }, []);

    // Save form data to localStorage whenever it changes
    useEffect(() => {
        const { documents, ...restFormData } = formData;
        localStorage.setItem('scholarshipApplicationFormData', JSON.stringify(restFormData));
    }, [formData]);

    // Clear form data from localStorage when navigating away from the page
    useEffect(() => {
        return () => {
            localStorage.removeItem('scholarshipApplicationFormData');
            setFormData({
                firstName: userDetails?.firstName || '',
                lastName: '',
                middleName: '',
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
        };
    }, []);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await fetch(`/api/auth/user/${userId}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setUserDetails(data);
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    firstName: data.applicantDetails?.firstName || '',
                    lastName: data.applicantDetails?.lastName || '',
                    middleName: data.applicantDetails?.middleName || '',
                    nameExtension: data.applicantDetails?.nameExtension || '',
                    birthdate: data.applicantDetails?.birthdate || '',
                    birthplace: data.applicantDetails?.birthplace || '',
                    gender: data.applicantDetails?.gender || '',
                    bloodType: data.applicantDetails?.bloodType || '',
                    civilStatus: data.applicantDetails?.civilStatus || '',
                    maidenName: data.applicantDetails?.maidenName || '',
                    spouseName: data.applicantDetails?.spouseName || '',
                    spouseOccupation: data.applicantDetails?.spouseOccupation || '',
                    religion: data.applicantDetails?.religion || '',
                    height: data.applicantDetails?.height || '',
                    weight: data.applicantDetails?.weight || '',
                    email: data.email || '',
                    contactNumber: data.applicantDetails?.contactNumber || '',
                    addressDetails: data.applicantDetails?.address.addressDetails || '',
                    region: data.applicantDetails?.address.region || '',
                    province: data.applicantDetails?.address.province || '',
                    city: data.applicantDetails?.address.city || '',
                    barangay: data.applicantDetails?.address.barangay || '',
                    education: {
                        elementary: {
                            school: data.applicantDetails?.education?.elementary?.school || '',
                            award: data.applicantDetails?.education?.elementary?.award || '',
                            yearGraduated: data.applicantDetails?.education?.elementary?.yearGraduated || '',
                        },
                        juniorHighSchool: {
                            school: data.applicantDetails?.education?.juniorHighSchool?.school || '',
                            award: data.applicantDetails?.education?.juniorHighSchool?.award || '',
                            yearGraduated: data.applicantDetails?.education?.juniorHighSchool?.yearGraduated || '',
                        },
                        seniorHighSchool: {
                            school: data.applicantDetails?.education?.seniorHighSchool?.school || '',
                            award: data.applicantDetails?.education?.seniorHighSchool?.award || '',
                            yearGraduated: data.applicantDetails?.education?.seniorHighSchool?.yearGraduated || '',
                        },
                        college: {
                            school: data.applicantDetails?.education?.college?.school || '',
                            course: data.applicantDetails?.education?.college?.course || '',
                        }
                    },
                    // Initialize other form fields as needed
                }));
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };

        if (userId) {
            fetchUserDetails();
        }
    }, [userId]);

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [notification, setNotification] = useState(null);
    const [activeStep, setActiveStep] = useState(1);
    const [visibleRelativeIndex, setVisibleRelativeIndex] = useState(0);
    const [visibleWorkExperienceIndex, setVisibleWorkExperienceIndex] = useState(0);
    const [visibleSkillIndex, setVisibleSkillIndex] = useState(0);
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
        return (
            <div className="flex justify-center items-center h-screen">
                <svg className="animate-spin h-10 w-10 text-blue-600" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
            </div>
        );
    }

    // if (error) {
    //     return <div>Error: {error}</div>;
    // }

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const steps = [
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
                        errors.guardianContactNo = "Guardian's contact number is required";
                    } else if (!/^09\d{9}$/.test(formData.guardian.contactNo)) {
                        errors.guardianContactNo = "Guardian's contact number is invalid. It should be an 11-digit number starting with 09";
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
                        errors.fatherContactNo = "Father's contact number is required";
                    } else if (!/^09\d{9}$/.test(formData.father.contactNo)) {
                        errors.fatherContactNo = "Father's contact number is invalid. It should be an 11-digit number starting with 09";
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
                        errors.motherContactNo = "Mother's contact number is required";
                    } else if (!/^09\d{9}$/.test(formData.mother.contactNo)) {
                        errors.motherContactNo = "Mother's contact number is invalid. It should be an 11-digit number starting with 09";
                    }
                } else {
                    errors.general = 'Please provide details for either parents or a guardian';
                }

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
                    // Validate the first work experience's details
                    if (index === 0) {
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
                    formData={formData}
                    setFormData={setFormData}
                    errors={{}}
                    scholarship={scholarship}
                    requiredDocuments={requiredDocuments}
                />,
            validate: (formData) => {
                const errors = {};
                const maxSizeInMB = 10;

                if (formData.documents) {
                    requiredDocuments.forEach(doc => {
                        const file = formData.documents[doc.name];
                        if (!file) {
                            errors[doc.name] = `${doc.name} is required.`;
                        } else if (file.size / (1024 * 1024) > maxSizeInMB) {
                            errors[doc.name] = `File size should be 10 MB or less for ${doc.name}`;
                        }
                    });
                }

                return errors;
            },
        },
        {
            title: 'Data Privacy',
            description: 'Please read and agree to the data privacy policy before submitting your application',
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

        // Check if any document file is null
        const missingDocuments = Object.entries(formData.documents).filter(([docType, fileObj]) => !fileObj || !fileObj.file);
        if (missingDocuments.length > 0) {
            setLoading(false);
            alert(`Please upload the following documents: ${missingDocuments.map(([docType]) => docType).join(', ')}`);
            return;
        }

        // Upload files to Firebase and get the file URLs
        const uploadedFilePaths = await Promise.all(Object.entries(formData.documents).map(async ([docType, fileObj]) => {
            console.log(`Processing document type: ${docType}`, fileObj); // Debugging log
            if (fileObj && fileObj.file) {
                const file = fileObj.file;
                console.log(`Processing file: ${file.name}`); // Debugging log
                const fileExtension = file.name.split('.').pop(); // Extract the file extension
                const fileNameWithoutExtension = file.name.replace(/\.[^/.]+$/, ""); // Remove the extension from the original file name
                const fileName = `${fileNameWithoutExtension.replace(/\s+/g, '_')}_${uuidv4()}.${fileExtension}`;
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
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 mt-10 min-h-screen">
                    {scholarship && (
                        <div className="scholarship-info mb-4 p-6 bg-white rounded-lg shadow-md">
                            <div className="flex items-center">
                                {scholarship.scholarshipImage && (
                                    <img src={scholarship.scholarshipImage} alt={`${scholarship.title} logo`} className="w-32 h-32 object-contain mr-4" />
                                )}
                                <div>
                                    <h2 className="lg:text-2xl font-normal text-slate-500 lg:text-gray-800">You are applying for
                                        <span className='font-bold text-xl tracking-wide text-blue-600 lg:inline block'> {scholarship.title}</span>
                                    </h2>
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

                    <div className='hidden lg:block'>
                        <div className='flex lg:justify-center lg:gap-5 lg:mt-4 mb-8'>
                            {[0, 1, 2, 3].map((step) => (
                                <React.Fragment key={step}>
                                    <div className='flex flex-col gap-1 items-center text-center'>
                                        <span className={`text-xl font-bold ${currentPage === step ? 'text-blue-600' : 'lg:block hidden text-gray-400'}`}>{step + 1}</span>
                                        <button
                                            className={`w-12 h-12 shadow rounded-md flex items-center justify-center ${currentPage === step ? 'bg-blue-600' : 'hidden lg:flex border'}`}
                                            onClick={() => setCurrentPage(step)}
                                            disabled={currentPage !== step}
                                        >
                                            {step === 0 && <FaUsers className={currentPage === step ? 'text-white' : 'text-blue-600'} />}
                                            {step === 1 && <FaEllipsisH className={currentPage === step ? 'text-white' : 'text-blue-600'} />}
                                            {step === 2 && <FaUpload className={currentPage === step ? 'text-white' : 'text-blue-600'} />}
                                            {step === 3 && <FaFileContract className={currentPage === step ? 'text-white' : 'text-blue-600'} />}
                                        </button>
                                        <span className='text-sm text-slate-600'>
                                            {step === 0 && <span className={currentPage === step ? 'block' : 'lg:flex hidden'}>Custodian</span>}
                                            {step === 1 && <span className={currentPage === step ? 'block' : 'lg:flex hidden'}>Others</span>}
                                            {step === 2 && <span className={currentPage === step ? 'block' : 'lg:flex hidden'}><>Upload <br /> Requirements</></span>}
                                            {step === 3 && <span className={currentPage === step ? 'block' : 'lg:flex hidden'}><>Data <br /> Privacy</></span>}
                                        </span>
                                    </div>
                                    {step < 3 && <FaArrowRightLong className='lg:block hidden text-4xl text-blue-600 mt-10' />}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>

                    <div className='lg:hidden flex flex-col lg:min-h-screen'>
                        <div className='flex justify-between items-center px-6 py-2 text-sm text-slate-500'>
                            <span>Requirement</span>
                            <span>Stages</span>
                        </div>

                        {[0, 1, 2, 3].map((step) => (
                            <React.Fragment key={step}>
                                <div className={`border-2 border-blue-600 rounded-md shadow w-full py-2 px-4 flex justify-between items-center ${currentPage === step ? 'flex' : 'hidden'} `}>
                                    <div className={`gap-2 items-center text-blue-600 ${step === 0 ? 'flex' : 'hidden'}`}>
                                        <FaUsers className='text-2xl' />
                                        <span className='font-bold'>Custodian</span>
                                    </div>

                                    <div className={`gap-2 items-center text-blue-600 ${step === 1 ? 'flex' : 'hidden'}`}>
                                        <FaEllipsisH className='text-2xl' />
                                        <span className='font-bold'>Others</span>
                                    </div>

                                    <div className={`gap-2 items-center text-blue-600 ${step === 2 ? 'flex' : 'hidden'}`}>
                                        <FaUpload className='text-2xl' />
                                        <span className='font-bold'>Upload Requirements</span>
                                    </div>

                                    <div className={`gap-2 items-center text-blue-600 ${step === 3 ? 'flex' : 'hidden'}`}>
                                        <FaFileContract className='text-2xl' />
                                        <span className='font-bold'>Terms and Conditions</span>
                                    </div>

                                    <div>
                                        <span className='text-blue-600 text-4xl font-bold'> {currentPage}<span className='text-slate-400'>/3</span></span>
                                    </div>
                                </div>
                            </React.Fragment>
                        ))}
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
