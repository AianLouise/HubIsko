import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FaArrowRightLong } from "react-icons/fa6";
import { FaInfoCircle, FaUsers, FaGraduationCap, FaEllipsisH, FaFileContract, FaUpload } from "react-icons/fa";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';

export default function ApplyingStages() {

    const [selectedTab, setSelectedTab] = useState('About');

    const handleTabClick = (tab) => {
        setSelectedTab(tab);
    };

    const navigate = useNavigate();
    const storage = getStorage();
    const currentUser = useSelector((state) => state.user.currentUser);

    const [activeStep, setActiveStep] = useState(1);
    const maxStep = 6;

    const handleNext = () => {
        if (validateCurrentStep()) {
            setActiveStep((prevStep) => (prevStep < maxStep ? prevStep + 1 : prevStep));
            window.scrollTo({ top: 240, behavior: 'smooth' });
        } else {
            // Optional: Display an error message or highlight missing fields
            console.log('Please complete all required fields before proceeding.');
        }
    };

    const validateCurrentStep = () => {
        if (activeStep === 1) {
            return (
                formData.firstName.trim() !== '' &&
                formData.lastName.trim() !== '' &&
                formData.birthdate.trim() !== '' &&
                formData.gender.trim() !== '' &&
                formData.bloodType.trim() !== '' &&
                formData.civilStatus.trim() !== '' &&
                formData.contactNumber.trim() !== ''
            );
        } else if (activeStep === 2) {
            return (
                formData.father.firstName.trim() !== '' &&
                formData.father.lastName.trim() !== '' &&
                formData.father.middleName.trim() !== '' &&
                formData.father.birthdate.trim() !== '' &&
                formData.father.occupation.trim() !== '' &&
                formData.father.yearlyIncome.trim() !== '' &&
                formData.father.contactNo.trim() !== '' &&
                formData.mother.firstName.trim() !== '' &&
                formData.mother.lastName.trim() !== '' &&
                formData.mother.middleName.trim() !== '' &&
                formData.mother.birthdate.trim() !== '' &&
                formData.mother.occupation.trim() !== '' &&
                formData.mother.yearlyIncome.trim() !== '' &&
                formData.mother.contactNo.trim() !== ''
            );
        } else if (activeStep === 3) {
            return (
                formData.education.elementary.school.trim() !== '' &&
                formData.education.elementary.award.trim() !== '' &&
                formData.education.elementary.yearGraduated.trim() !== '' &&
                formData.education.juniorHighSchool.school.trim() !== '' &&
                formData.education.juniorHighSchool.award.trim() !== '' &&
                formData.education.juniorHighSchool.yearGraduated.trim() !== '' &&
                formData.education.seniorHighSchool.school.trim() !== '' &&
                formData.education.seniorHighSchool.award.trim() !== '' &&
                formData.education.seniorHighSchool.yearGraduated.trim() !== '' &&
                formData.education.college.school.trim() !== '' &&
                formData.education.college.course.trim() !== ''
            );
        }
        // Add similar checks for other steps if necessary
        return true;
    };

    const handlePrevious = () => {
        setActiveStep((prevStep) => Math.max(1, prevStep - 1));
    };

    const getHideorActive = (step) => {
        if (step === activeStep) {
            return 'flex flex-col gap-2 border shadow bg-white w-full h-[auto] rounded-md';
        } else {
            return 'hidden flex flex-col gap-2 border shadow bg-white w-full h-[auto] rounded-md';
        }
    };

    const { scholarshipId } = useParams();

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
        contactNumber: '',
        addressDetails: '',
        town: '',
        barangay: '',
        province: '',
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
        termsAndConditions: {
            agreed: true
        },
        scholarshipProgram: '',
        applicant: currentUser._id,
    });

    const [scholarship, setScholarship] = useState(null);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (scholarshipId) {
            setFormData((prevFormData) => ({
                ...prevFormData,
                scholarshipProgram: scholarshipId, // Set the scholarshipProgram field with the id from the URL
            }));
        }
        const fetchScholarship = async () => {
            try {
                const response = await fetch(`/api/scholarshipProgram/scholarship-programs/${scholarshipId}`);
                const data = await response.json();
                console.log('Fetched Scholarship:', data); // Add this line
                setScholarship(data);
            } catch (error) {
                console.error('Error fetching scholarship:', error);
            }
        };

        fetchScholarship();
    }, [scholarshipId]);


    // useEffect(() => {
    //     const fetchScholarship = async () => {
    //         try {
    //             const response = await fetch(`/api/scholarshipProgram/scholarship-programs/${scholarshipId}`);
    //             const data = await response.json();
    //             console.log('Fetched Scholarship:', data); // Add this line
    //             setScholarship(data);
    //         } catch (error) {
    //             console.error('Error fetching scholarship:', error);
    //         }
    //     };

    //     fetchScholarship();
    // }, [scholarshipId]);

    const [sameAsParents, setSameAsParents] = useState(false);

    const handleChange = (e, parentKey = null) => {
        const { name, value } = e.target;
        setFormData(prevState => {
            if (parentKey) {
                return {
                    ...prevState,
                    [parentKey]: {
                        ...prevState[parentKey],
                        [name]: value
                    }
                };
            } else {
                return {
                    ...prevState,
                    [name]: value
                };
            }
        });
    };

    const handleEducationChange = (e, level) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            education: {
                ...prevState.education,
                [level]: {
                    ...prevState.education[level],
                    [name]: value
                }
            }
        }));
    };

    const handleFileChange = (e, docType) => {
        const file = e.target.files[0];
        setFormData(prevState => ({
            ...prevState,
            documents: {
                ...prevState.documents,
                [docType]: { file }
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

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
        }
    };

    // Boolean to check if the selected civil status is 'Married'
    const isMarried = formData.civilStatus === 'Married';

    useEffect(() => {
        if (!isMarried) {
            setFormData(prevState => ({
                ...prevState,
                maidenName: '',
                spouseName: '',
                spouseOccupation: ''
            }));
        }
    }, [formData.civilStatus]);

    const handleCheckboxChange = (e) => {
        const isChecked = e.target.checked;
        setSameAsParents(isChecked);
        if (isChecked) {
            setFormData(prevState => ({
                ...prevState,
                guardian: {
                    firstName: '',
                    lastName: '',
                    middleName: '',
                    birthdate: '',
                    occupation: '',
                    yearlyIncome: '',
                    contactNo: ''
                }
            }));
        }
    };

    const [relativeErrorMessage, setRelativeErrorMessage] = useState('');
    const [workExperienceErrorMessage, setWorkExperienceErrorMessage] = useState('');
    const [skillErrorMessage, setSkillErrorMessage] = useState('');

    const [visibleRelativeIndex, setVisibleRelativeIndex] = useState(0);
    const [visibleSkillIndex, setVisibleSkillIndex] = useState(0);

    const handleRelativeChange = (index, event) => {
        const { name, value } = event.target;
        const updatedRelatives = [...formData.relatives];
        updatedRelatives[index] = {
            ...updatedRelatives[index],
            [name]: value,
        };
        setFormData({
            ...formData,
            relatives: updatedRelatives,
        });
    };

    const addRelative = () => {
        if (visibleRelativeIndex < formData.relatives.length - 1) {
            setVisibleRelativeIndex(visibleRelativeIndex + 1);
            setRelativeErrorMessage(''); // Clear any previous error message
        } else if (formData.relatives.length < 6) {
            // Add a new relative object if the current number of relatives is less than 6
            setFormData({
                ...formData,
                relatives: [...formData.relatives, { name: '', birthdate: '', relationship: '' }],
            });
            setVisibleRelativeIndex(visibleRelativeIndex + 1);
            setRelativeErrorMessage(''); // Clear any previous error message
        } else {
            // Show an error message
            setRelativeErrorMessage("Maximum of 6 relatives can be added.");
        }
    };

    const handleWorkChange = (index, event, type) => {
        const { name, value } = event.target;
        const updatedWorkExperience = [...formData.workExperience];
        updatedWorkExperience[index] = {
            ...updatedWorkExperience[index],
            [name]: value,
        };
        setFormData({
            ...formData,
            workExperience: updatedWorkExperience,
        });
    };

    const [visibleWorkExperienceIndex, setVisibleWorkExperienceIndex] = useState(0);

    const addWorkExperience = () => {
        if (visibleWorkExperienceIndex < formData.workExperience.length - 1) {
            setVisibleWorkExperienceIndex(visibleWorkExperienceIndex + 1);
            setWorkExperienceErrorMessage(''); // Clear any previous error message
        } else if (formData.workExperience.length < 2) {
            // Add a new work experience object if the current number of work experiences is less than 2
            setFormData({
                ...formData,
                workExperience: [...formData.workExperience, { companyName: '', dateStarted: '', position: '', monthlySalary: '', appointmentStatus: '' }],
            });
            setVisibleWorkExperienceIndex(visibleWorkExperienceIndex + 1);
            setWorkExperienceErrorMessage(''); // Clear any previous error message
        } else {
            // Show an error message
            setWorkExperienceErrorMessage("Maximum of 2 work experiences can be added.");
        }
    };

    const handleSkillChange = (index, event) => {
        const { name, value } = event.target;
        const updatedSkillsAndQualifications = [...formData.skillsAndQualifications];
        updatedSkillsAndQualifications[index] = {
            ...updatedSkillsAndQualifications[index],
            [name]: value,
        };
        setFormData({
            ...formData,
            skillsAndQualifications: updatedSkillsAndQualifications,
        });
    };

    const addSkill = () => {
        if (visibleSkillIndex < formData.skillsAndQualifications.length - 1) {
            setVisibleSkillIndex(visibleSkillIndex + 1);
            setSkillErrorMessage(''); // Clear any previous error message
        } else if (formData.skillsAndQualifications.length < 6) { // Change 6 to the desired maximum number of skills
            // Add a new skill and qualification object if the current number is less than the maximum
            setFormData({
                ...formData,
                skillsAndQualifications: [...formData.skillsAndQualifications, { skills: '', qualifications: '' }],
            });
            setVisibleSkillIndex(visibleSkillIndex + 1);
            setSkillErrorMessage(''); // Clear any previous error message
        } else {
            // Show an error message
            setSkillErrorMessage("Maximum of 6 skills and qualifications can be added."); // Change 6 to the desired maximum number of skills
        }
    };

    const [requiredDocuments, setRequiredDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
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

        fetchRequiredDocuments();
    }, [scholarshipId]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className='flex flex-col min-h-screen'>
            <main className='flex-grow font-medium text-slate-700 min-h-screen'>
                <div className='flex flex-col mx-auto max-w-7xl px-24 my-10'>
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
                    <div>
                        <div className='flex justify-center gap-5 mt-4 mb-8'>
                            {[1, 2, 3, 4, 5, 6].map((step) => (
                                <React.Fragment key={step}>
                                    <div className='flex flex-col gap-1 items-center text-center'>
                                        <span className={`text-xl font-bold ${activeStep === step ? 'text-blue-600' : 'text-gray-400'}`}>{step}</span>
                                        <button
                                            className={`w-12 h-12 shadow rounded-md flex items-center justify-center ${activeStep === step ? 'bg-blue-600' : 'border'}`}
                                            onClick={() => setActiveStep(step)}
                                        >
                                            {step === 1 && <FaInfoCircle className={activeStep === step ? 'text-white' : 'text-blue-600'} />}
                                            {step === 2 && <FaUsers className={activeStep === step ? 'text-white' : 'text-blue-600'} />}
                                            {step === 3 && <FaGraduationCap className={activeStep === step ? 'text-white' : 'text-blue-600'} />}
                                            {step === 4 && <FaEllipsisH className={activeStep === step ? 'text-white' : 'text-blue-600'} />}
                                            {step === 5 && <FaUpload className={activeStep === step ? 'text-white' : 'text-blue-600'} />}
                                            {step === 6 && <FaFileContract className={activeStep === step ? 'text-white' : 'text-blue-600'} />}
                                        </button>
                                        <span className='text-sm text-slate-600'>
                                            {step === 1 && (
                                                <>
                                                    Personal <br /> Information
                                                </>
                                            )}
                                            {step === 2 && "Custodian"}
                                            {step === 3 && "Education"}
                                            {step === 4 && "Others"}
                                            {step === 5 && (
                                                <>
                                                    Upload <br /> Requirements
                                                </>
                                            )}
                                            {step === 6 && (
                                                <>
                                                    Terms and <br /> Condition
                                                </>
                                            )}
                                        </span>
                                    </div>
                                    {step < 6 && <FaArrowRightLong className='text-4xl text-blue-600 mt-10' />}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className={`${getHideorActive(1)} max-w-8xl mx-auto bg-white shadow-lg rounded-lg`}>
                            <div className="bg-blue-600 text-white p-4 rounded-t-lg">
                                <span className='text-lg font-bold'>Basic Information</span>
                            </div>

                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>First Name</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        placeholder="Enter your first name"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        required
                                        className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                    />
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>Last Name</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        placeholder="Enter your last name"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        required
                                        className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                    />
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>Middle Name</label>
                                    <input
                                        type="text"
                                        name="middleName"
                                        placeholder="Enter your middle name"
                                        value={formData.middleName}
                                        onChange={handleChange}
                                        required
                                        className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                    />
                                </div>
                            </div>

                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>Birthdate</label>
                                    <input
                                        type="date"
                                        name="birthdate"
                                        value={formData.birthdate}
                                        onChange={handleChange}
                                        required
                                        className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                    />
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>Birthplace</label>
                                    <input
                                        type="text"
                                        name="birthplace"
                                        value={formData.birthplace}
                                        onChange={handleChange}
                                        required
                                        className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                        placeholder="Enter birthplace"
                                    />
                                </div>


                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>Gender</label>
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        required
                                        className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Female">Female</option>
                                        <option value="Male">Male</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>Blood Type</label>
                                    <select
                                        name="bloodType"
                                        value={formData.bloodType}
                                        onChange={handleChange}
                                        required
                                        className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                    >
                                        <option value="">Select Blood Type</option>
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

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>Civil Status</label>
                                    <select
                                        name="civilStatus"
                                        className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                        value={formData.civilStatus}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Civil Status</option>
                                        <option value="Single">Single</option>
                                        <option value="Married">Married</option>
                                        <option value="Divorced">Divorced</option>
                                        <option value="Widowed">Widowed</option>
                                    </select>
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>Maiden Name</label>
                                    <input
                                        type="text"
                                        name="maidenName"
                                        value={formData.maidenName}
                                        onChange={handleChange}
                                        disabled={!isMarried}
                                        placeholder="Enter maiden name"
                                        className={`standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full ${!isMarried ? 'text-gray-400' : ''}`}
                                    />
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>Name of Spouse</label>
                                    <input
                                        type="text"
                                        name="spouseName"
                                        value={formData.spouseName}
                                        onChange={handleChange}
                                        disabled={!isMarried}
                                        placeholder="Enter name of spouse"
                                        className={`standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full ${!isMarried ? 'text-gray-400' : ''}`}
                                    />
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>Occupation of Spouse</label>
                                    <input
                                        type="text"
                                        name="spouseOccupation"
                                        value={formData.spouseOccupation}
                                        onChange={handleChange}
                                        disabled={!isMarried}
                                        placeholder="Enter occupation of spouse"
                                        className={`standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full ${!isMarried ? 'text-gray-400' : ''}`}
                                    />
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>Religion</label>
                                    <select
                                        name="religion"
                                        value={formData.religion}
                                        onChange={handleChange}
                                        required
                                        className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                    >
                                        <option value="Roman Catholic">Roman Catholic</option>
                                        <option value="Iglesia ni Cristo">Iglesia ni Cristo</option>
                                        <option value="Islam">Islam</option>
                                        <option value="Born Again Christian">Born Again Christian</option>
                                        <option value="Others">Others</option>
                                    </select>
                                </div>

                                <div className='flex flex-col'>
                                    <label className='block text-sm font-medium text-slate-700 mb-2'>Height and Weight</label>
                                    <div className='flex gap-2'>
                                        <input
                                            type="number"
                                            name="height"
                                            value={formData.height}
                                            onChange={handleChange}
                                            required
                                            className='text-sm standard-input border border-gray-300 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                            placeholder="Height in cm"
                                        />

                                        <input
                                            type="number"
                                            name="weight"
                                            value={formData.weight}
                                            onChange={handleChange}
                                            required
                                            className='text-sm standard-input border border-gray-300 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                            placeholder="Weight in kg"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>Email</label>
                                    <input
                                        type="eml"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                        placeholder="Enter email"
                                    />
                                </div>


                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>Contact Number</label>
                                    <input
                                        type="tel"
                                        name="contactNumber"
                                        value={formData.contactNumber}
                                        onChange={handleChange}
                                        required
                                        className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                        placeholder="Enter contact number"
                                    />
                                </div>
                            </div>

                            <div className='grid grid-cols-2 gap-4 p-4'>
                                <div className='col-span-1'>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                                        House No./Unit No./Bldg/Floor, Street, Subdivision
                                    </label>
                                    <input
                                        type="text"
                                        name="addressDetails"
                                        value={formData.addressDetails}
                                        onChange={handleChange}
                                        required
                                        className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                        placeholder="Enter address details"
                                    />
                                </div>
                                <div className='col-span-1'>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                                        Town
                                    </label>
                                    <input
                                        type="text"
                                        name="town"
                                        value={formData.town}
                                        onChange={handleChange}
                                        required
                                        className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                        placeholder="Enter town"
                                    />
                                </div>
                                <div className='col-span-1'>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                                        Barangay
                                    </label>
                                    <input
                                        type="text"
                                        name="barangay"
                                        value={formData.barangay}
                                        onChange={handleChange}
                                        required
                                        className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                        placeholder="Enter barangay"
                                    />
                                </div>
                                <div className='col-span-1'>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                                        Province
                                    </label>
                                    <input
                                        type="text"
                                        name="province"
                                        value={formData.province}
                                        onChange={handleChange}
                                        required
                                        className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                        placeholder="Enter province"
                                    />
                                </div>
                            </div>


                            <div className='flex  justify-end p-4'>
                                <button className='bg-blue-600 text-white px-8 py-2 rounded-md hover:bg-blue-800' onClick={handleNext}>Next</button>
                            </div>
                        </div>

                        <div className={`${getHideorActive(2)} max-w-8xl mx-auto bg-white shadow-lg rounded-lg`}>
                            <div className="bg-blue-600 text-white p-4 rounded-t-lg">
                                <span className='text-lg font-bold'>Custodians' Information</span>
                            </div>

                            <div className='mt-2'>

                                <div className='flex flex-col items-center gap-4 border-b pb-4'>
                                    <span className='text-xl font-bold'>Please Select:</span>

                                    <div className='flex gap-5'>
                                        <button
                                            className={`border text-center rounded-xl px-16 py-4 ${selectedTab === 'Parents' ? 'bg-white text-blue-600 shadow-md' : 'bg-slate-200 hover:bg-slate-300'}`}
                                            onClick={() => handleTabClick('Parents')}
                                        >
                                            I am guided by my Parents
                                        </button>

                                        <button
                                            className={`border text-center rounded-xl px-16 py-4 ${selectedTab === 'Guardians' ? 'bg-white text-blue-600 shadow-md' : 'bg-slate-200 hover:bg-slate-300'}`}
                                            onClick={() => handleTabClick('Guardians')}
                                        >
                                            I am guided by my Guardian(s)
                                        </button>
                                    </div>
                                </div>



                            </div>

                            {selectedTab === 'Parents' && (
                                <div className='p-4'>
                                    <span className='text-lg font-bold'>Father's Information</span>
                                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4'>
                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-2'>First Name</label>
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={formData.father.firstName}
                                                onChange={(e) => handleChange(e, 'father')}
                                                required
                                                className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                                placeholder="Enter first name"
                                            />
                                        </div>
                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-2'>Last Name</label>
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={formData.father.lastName}
                                                onChange={(e) => handleChange(e, 'father')}
                                                required
                                                className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                                placeholder="Enter last name"
                                            />
                                        </div>
                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-2'>Middle Name</label>
                                            <input
                                                type="text"
                                                name="middleName"
                                                value={formData.father.middleName}
                                                onChange={(e) => handleChange(e, 'father')}
                                                required
                                                className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                                placeholder="Enter middle name"
                                            />
                                        </div>
                                    </div>

                                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4'>
                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-2'>Birthdate</label>
                                            <input
                                                type="date"
                                                name="birthdate"
                                                value={formData.father.birthdate}
                                                onChange={(e) => handleChange(e, 'father')}
                                                required
                                                className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                                placeholder="Enter birthdate"
                                            />
                                        </div>
                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-2'>Occupation</label>
                                            <input
                                                type="text"
                                                name="occupation"
                                                value={formData.father.occupation}
                                                onChange={(e) => handleChange(e, 'father')}
                                                required
                                                className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                                placeholder="Enter occupation"
                                            />
                                        </div>
                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-2'>Yearly Income</label>
                                            <select
                                                name="yearlyIncome"
                                                value={formData.father.yearlyIncome}
                                                onChange={(e) => handleChange(e, 'father')}
                                                required
                                                className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                            >
                                                <option value="" disabled>Select yearly income</option>
                                                <option value="100000">Below ₱100,000</option>
                                                <option value="200000">₱100,000 - ₱200,000</option>
                                                <option value="300000">₱200,000 - ₱300,000</option>
                                                <option value="400000">₱300,000 - ₱400,000</option>
                                                <option value="500000">₱400,000 - ₱500,000</option>
                                                <option value="600000">₱500,000 - ₱600,000</option>
                                                <option value="700000">₱600,000 - ₱700,000</option>
                                                <option value="800000">₱700,000 - ₱800,000</option>
                                                <option value="900000">₱800,000 - ₱900,000</option>
                                                <option value="1000000">₱900,000 - ₱1,000,000</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-2'>Contact No.</label>
                                            <input
                                                type="text"
                                                name="contactNo"
                                                value={formData.father.contactNo}
                                                onChange={(e) => handleChange(e, 'father')}
                                                required
                                                className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                                placeholder="Enter contact number"
                                            />
                                        </div>
                                    </div>





                                    <span className='text-lg font-bold mt-8 block'>Mother's Information</span>
                                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4'>
                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-2'>First Name</label>
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={formData.mother.firstName}
                                                onChange={(e) => handleChange(e, 'mother')}
                                                required
                                                className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                                placeholder="Enter first name"
                                            />
                                        </div>
                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-2'>Last Name</label>
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={formData.mother.lastName}
                                                onChange={(e) => handleChange(e, 'mother')}
                                                required
                                                className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                                placeholder="Enter last name"
                                            />
                                        </div>
                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-2'>Middle Name</label>
                                            <input
                                                type="text"
                                                name="middleName"
                                                value={formData.mother.middleName}
                                                onChange={(e) => handleChange(e, 'mother')}
                                                required
                                                className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                                placeholder="Enter middle name"
                                            />
                                        </div>
                                    </div>

                                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4'>
                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-2'>Birthdate</label>
                                            <input
                                                type="date"
                                                name="birthdate"
                                                value={formData.mother.birthdate}
                                                onChange={(e) => handleChange(e, 'mother')}
                                                required
                                                className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                                placeholder="Enter birthdate"
                                            />
                                        </div>
                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-2'>Occupation</label>
                                            <input
                                                type="text"
                                                name="occupation"
                                                value={formData.mother.occupation}
                                                onChange={(e) => handleChange(e, 'mother')}
                                                required
                                                className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                                placeholder="Enter occupation"
                                            />
                                        </div>
                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-2'>Yearly Income</label>
                                            <select
                                                name="yearlyIncome"
                                                value={formData.mother.yearlyIncome}
                                                onChange={(e) => handleChange(e, 'mother')}
                                                required
                                                className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                            >
                                                <option value="" disabled>Select yearly income</option>
                                                <option value="100000">Below ₱100,000</option>
                                                <option value="200000">₱100,000 - ₱200,000</option>
                                                <option value="300000">₱200,000 - ₱300,000</option>
                                                <option value="400000">₱300,000 - ₱400,000</option>
                                                <option value="500000">₱400,000 - ₱500,000</option>
                                                <option value="600000">₱500,000 - ₱600,000</option>
                                                <option value="700000">₱600,000 - ₱700,000</option>
                                                <option value="800000">₱700,000 - ₱800,000</option>
                                                <option value="900000">₱800,000 - ₱900,000</option>
                                                <option value="1000000">₱900,000 - ₱1,000,000</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-2'>Contact No.</label>
                                            <input
                                                type="text"
                                                name="contactNo"
                                                value={formData.mother.contactNo}
                                                onChange={(e) => handleChange(e, 'mother')}
                                                required
                                                className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                                placeholder="Enter contact number"
                                            />
                                        </div>
                                    </div>


                                </div>
                            )}



                            {selectedTab === 'Guardians' && (
                                <div className='p-4'>

                                    <span className='text-lg font-bold mt-8 block'>Guardian's Information</span>
                                    <div className='mt-4'>
                                        {/* <label className='block text-sm font-medium text-gray-700 mb-2'>
                                        <input
                                            type="checkbox"
                                            name="sameAsParents"
                                            checked={sameAsParents}
                                            onChange={handleCheckboxChange}
                                            className='mr-2'
                                        />
                                        Same as parents
                                    </label> */}
                                    </div>
                                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4'>
                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-2'>First Name</label>
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={formData.guardian.firstName}
                                                onChange={(e) => handleChange(e, 'guardian')}
                                                className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                                disabled={sameAsParents}
                                                placeholder="Enter first name"
                                            />
                                        </div>
                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-2'>Last Name</label>
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={formData.guardian.lastName}
                                                onChange={(e) => handleChange(e, 'guardian')}
                                                className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                                disabled={sameAsParents}
                                                placeholder="Enter last name"
                                            />
                                        </div>
                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-2'>Middle Name</label>
                                            <input
                                                type="text"
                                                name="middleName"
                                                value={formData.guardian.middleName}
                                                onChange={(e) => handleChange(e, 'guardian')}
                                                className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                                disabled={sameAsParents}
                                                placeholder="Enter middle name"
                                            />
                                        </div>
                                    </div>
                                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4'>
                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-2'>Birthdate</label>
                                            <input
                                                type="date"
                                                name="birthdate"
                                                value={formData.guardian.birthdate}
                                                onChange={(e) => handleChange(e, 'guardian')}
                                                className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                                disabled={sameAsParents}
                                                placeholder="Enter birthdate"
                                            />
                                        </div>
                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-2'>Occupation</label>
                                            <input
                                                type="text"
                                                name="occupation"
                                                value={formData.guardian.occupation}
                                                onChange={(e) => handleChange(e, 'guardian')}
                                                className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                                disabled={sameAsParents}
                                                placeholder="Enter occupation"
                                            />
                                        </div>
                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-2'>Yearly Income</label>
                                            <select
                                                name="yearlyIncome"
                                                value={formData.guardian.yearlyIncome}
                                                onChange={(e) => handleChange(e, 'guardian')}
                                                className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                                disabled={sameAsParents}
                                            >
                                                <option value="" disabled>Select yearly income</option>
                                                <option value="100000">Below ₱100,000</option>
                                                <option value="200000">₱100,000 - ₱200,000</option>
                                                <option value="300000">₱200,000 - ₱300,000</option>
                                                <option value="400000">₱300,000 - ₱400,000</option>
                                                <option value="500000">₱400,000 - ₱500,000</option>
                                                <option value="600000">₱500,000 - ₱600,000</option>
                                                <option value="700000">₱600,000 - ₱700,000</option>
                                                <option value="800000">₱700,000 - ₱800,000</option>
                                                <option value="900000">₱800,000 - ₱900,000</option>
                                                <option value="1000000">₱900,000 - ₱1,000,000</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-2'>Contact No.</label>
                                            <input
                                                type="text"
                                                name="contactNo"
                                                value={formData.guardian.contactNo}
                                                onChange={(e) => handleChange(e, 'guardian')}
                                                className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                                disabled={sameAsParents}
                                                placeholder="Enter contact number"
                                            />
                                        </div>
                                    </div>

                                </div>
                            )}

                            <div className='flex mt-10 justify-end space-x-4 p-4'>
                                {activeStep > 1 && (
                                    <button className='bg-white border px-8 py-2 rounded-md hover:bg-slate-200' onClick={handlePrevious}>Previous</button>
                                )}
                                <button className='bg-blue-600 text-white px-8 py-2 rounded-md hover:bg-blue-800' onClick={handleNext}>Next</button>
                            </div>
                        </div>

                        <div className={`${getHideorActive(3)} max-w-8xl mx-auto bg-white shadow-lg rounded-lg`}>
                            <div className="bg-blue-600 text-white p-4 rounded-t-lg">
                                <span className='text-lg font-bold'>Education Information</span>
                            </div>

                            <div className='px-4'>
                                <div className='px-4'>
                                    {/* Elementary */}
                                    <span className='text-lg font-bold mt-8 block'>Elementary</span>
                                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-2'>School</label>
                                            <input
                                                type="text"
                                                name="school"
                                                value={formData.education.elementary.school}
                                                onChange={(e) => handleEducationChange(e, 'elementary')}
                                                required
                                                placeholder="Enter elementary school name"
                                                className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                            />
                                        </div>
                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-2'>Award</label>
                                            <input
                                                type="text"
                                                name="award"
                                                value={formData.education.elementary.award}
                                                onChange={(e) => handleEducationChange(e, 'elementary')}
                                                required
                                                placeholder="Enter elementary award"
                                                className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                            />
                                        </div>
                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-2'>Year Graduated</label>
                                            <select
                                                name="yearGraduated"
                                                value={formData.education.elementary.yearGraduated}
                                                onChange={(e) => handleEducationChange(e, 'elementary')}
                                                required
                                                className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                            >
                                                <option value="">Select year</option>
                                                {Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i).map(year => (
                                                    <option key={year} value={year}>{year}</option>
                                                ))}
                                            </select>
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
                                                value={formData.education.juniorHighSchool.school}
                                                onChange={(e) => handleEducationChange(e, 'juniorHighSchool')}
                                                required
                                                placeholder="Enter junior high school name"
                                                className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                            />
                                        </div>
                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-2'>Award</label>
                                            <input
                                                type="text"
                                                name="award"
                                                value={formData.education.juniorHighSchool.award}
                                                onChange={(e) => handleEducationChange(e, 'juniorHighSchool')}
                                                required
                                                placeholder="Enter junior high school award"
                                                className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                            />
                                        </div>
                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-2'>Year Graduated</label>
                                            <select
                                                name="yearGraduated"
                                                value={formData.education.juniorHighSchool.yearGraduated}
                                                onChange={(e) => handleEducationChange(e, 'juniorHighSchool')}
                                                required
                                                className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                            >
                                                <option value="">Select year</option>
                                                {Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i).map(year => (
                                                    <option key={year} value={year}>{year}</option>
                                                ))}
                                            </select>
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
                                                value={formData.education.seniorHighSchool.school}
                                                onChange={(e) => handleEducationChange(e, 'seniorHighSchool')}
                                                required
                                                placeholder="Enter senior high school name"
                                                className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                            />
                                        </div>
                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-2'>Award</label>
                                            <input
                                                type="text"
                                                name="award"
                                                value={formData.education.seniorHighSchool.award}
                                                onChange={(e) => handleEducationChange(e, 'seniorHighSchool')}
                                                required
                                                placeholder="Enter senior high school award"
                                                className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                            />
                                        </div>
                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-2'>Year Graduated</label>
                                            <select
                                                name="yearGraduated"
                                                value={formData.education.seniorHighSchool.yearGraduated}
                                                onChange={(e) => handleEducationChange(e, 'seniorHighSchool')}
                                                required
                                                className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                            >
                                                <option value="">Select year</option>
                                                {Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i).map(year => (
                                                    <option key={year} value={year}>{year}</option>
                                                ))}
                                            </select>
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
                                                value={formData.education.college.school}
                                                onChange={(e) => handleEducationChange(e, 'college')}
                                                required
                                                placeholder="Enter college name"
                                                className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                            />
                                        </div>
                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-2'>College Course</label>
                                            <input
                                                type="text"
                                                name="course"
                                                value={formData.education.college.course}
                                                onChange={(e) => handleEducationChange(e, 'college')}
                                                required
                                                placeholder="Enter college course"
                                                className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                            />
                                        </div>
                                        {/* <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-2'>College Year Graduated</label>
                                            <select
                                                name="yearGraduated"
                                                value={formData.education.college.yearGraduated}
                                                onChange={(e) => handleEducationChange(e, 'college')}
                                                className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                            >
                                                <option value="">Select year</option>
                                                {Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i).map(year => (
                                                    <option key={year} value={year}>{year}</option>
                                                ))}
                                            </select>
                                        </div> */}
                                    </div>

                                    <div className='flex mt-10 justify-end space-x-4 p-4'>
                                        {activeStep > 1 && (
                                            <button className='bg-white border px-8 py-2 rounded-md hover:bg-slate-200' onClick={handlePrevious}>Previous</button>
                                        )}
                                        <button className='bg-blue-600 text-white px-8 py-2 rounded-md hover:bg-blue-800' onClick={handleNext}>Next</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={`${getHideorActive(4)} max-w-8xl mx-auto bg-white shadow-lg rounded-lg`}>
                            <div className="bg-blue-600 text-white p-4 rounded-t-lg">
                                <span className='text-lg font-bold'>Other Information</span>
                            </div>

                            <div className='p-4'>
                                <span className='text-lg font-bold block'>Relatives</span>
                                <span className='text-base font-bold block my-3'>Provide relative's information (Maximum of 6)</span>
                                {formData.relatives.map((relative, index) => (
                                    <div key={index} className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4 ${index > visibleRelativeIndex ? 'hidden' : ''}`}>
                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-2'>Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                placeholder="Enter relative's name"
                                                className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                                value={relative.name}
                                                onChange={(event) => handleRelativeChange(index, event)}
                                            />
                                        </div>

                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-2'>Birthdate</label>
                                            <input
                                                type="date"
                                                name="birthdate"
                                                className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                                value={relative.birthdate}
                                                onChange={(event) => handleRelativeChange(index, event)}
                                            />
                                        </div>

                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-2'>Relationship</label>
                                            <select
                                                name="relationship"
                                                className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                                value={relative.relationship}
                                                onChange={(event) => handleRelativeChange(index, event)}
                                            >
                                                <option value="">Select relationship</option>
                                                <option value="Parent">Parent</option>
                                                <option value="Sibling">Sibling</option>
                                                <option value="Spouse">Spouse</option>
                                                <option value="Child">Child</option>
                                                <option value="Uncle">Uncle</option>
                                                <option value="Aunt">Aunt</option>
                                                <option value="Cousin">Cousin</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                    </div>
                                ))}
                                <button
                                    className='bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-800'
                                    onClick={addRelative}
                                >
                                    Add Relative
                                </button>
                                {relativeErrorMessage && <p className='text-red-600 mt-2'>{relativeErrorMessage}</p>}

                                <span className='text-lg font-bold mt-8 block'>Work Experience</span>
                                <span className='text-base font-bold block my-3'>Are you a working student? Leave blank if not. (Maximum of 2)</span>
                                {formData.workExperience.map((workExperience, index) => (
                                    <div key={index} className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4 ${index > visibleWorkExperienceIndex ? 'hidden' : ''}`}>
                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-2'>Company Name</label>
                                            <input
                                                type="text"
                                                name="companyName"
                                                placeholder="Enter company name"
                                                className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                                value={workExperience.companyName}
                                                onChange={(event) => handleWorkChange(index, event, 'workExperience')}
                                            />
                                        </div>

                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-2'>Date Started</label>
                                            <input
                                                type="date"
                                                name="dateStarted"
                                                className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                                value={workExperience.dateStarted}
                                                onChange={(event) => handleWorkChange(index, event, 'workExperience')}
                                            />
                                        </div>

                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-2'>Position</label>
                                            <input
                                                type="text"
                                                name="position"
                                                placeholder="Enter position"
                                                className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                                value={workExperience.position}
                                                onChange={(event) => handleWorkChange(index, event, 'workExperience')}
                                            />
                                        </div>

                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-2'>Monthly Salary</label>
                                            <input
                                                type="text"
                                                name="monthlySalary"
                                                placeholder="Enter monthly salary"
                                                className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                                value={workExperience.monthlySalary}
                                                onChange={(event) => handleWorkChange(index, event, 'workExperience')}
                                            />
                                        </div>

                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-2'>Status of Appointment</label>
                                            <select
                                                name="statusOfAppointment"
                                                className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                                value={workExperience.appointmentStatus}
                                                onChange={(event) => handleWorkChange(index, event, 'workExperience')}
                                            >
                                                <option value="">Select appointment status</option>
                                                <option value="Permanent">Permanent</option>
                                                <option value="Temporary">Temporary</option>
                                                <option value="Contractual">Contractual</option>
                                                <option value="Casual">Casual</option>
                                            </select>
                                        </div>
                                    </div>
                                ))}
                                <button
                                    className='bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-800'
                                    onClick={addWorkExperience}
                                >
                                    Add Work Experience
                                </button>
                                {workExperienceErrorMessage && <p className='text-red-600 mt-2'>{workExperienceErrorMessage}</p>}

                                <span className='text-lg font-bold mt-8 block'>Skills & Qualifications</span>
                                <span className='text-base font-bold block my-3'>Skills (Maximum of 6), Qualifications (Includes membership in related associations, hobbies, etc.)</span>
                                {formData.skillsAndQualifications.map((skill, index) => (
                                    <div key={index} className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-4 ${index > visibleSkillIndex ? 'hidden' : ''}`}>
                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-2'>Skill</label>
                                            <input
                                                type="text"
                                                name="skills"
                                                placeholder="Enter skill name"
                                                className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                                value={index > visibleSkillIndex ? '' : skill.skills}
                                                onChange={(event) => handleSkillChange(index, event)}
                                            />
                                        </div>

                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-2'>Qualification</label>
                                            <input
                                                type="text"
                                                name="qualifications"
                                                placeholder="Enter qualification"
                                                className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                                value={index > visibleSkillIndex ? '' : skill.qualifications}
                                                onChange={(event) => handleSkillChange(index, event)}
                                            />
                                        </div>
                                    </div>
                                ))}
                                <button
                                    className='bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-800'
                                    onClick={addSkill}
                                >
                                    Add Skill & Qualification
                                </button>
                                {skillErrorMessage && <p className='text-red-600 mt-2'>{skillErrorMessage}</p>}

                                <div className='flex mt-4 justify-end space-x-4'>
                                    {activeStep > 1 && (
                                        <button className='bg-white border px-8 py-2 rounded-md hover:bg-slate-200' onClick={handlePrevious}>Previous</button>
                                    )}
                                    <button className='bg-blue-600 text-white px-8 py-2 rounded-md hover:bg-blue-800' onClick={handleNext}>Next</button>
                                </div>
                            </div>
                        </div>

                        <div className={`${getHideorActive(5)} max-w-8xl mx-auto bg-white shadow-lg rounded-lg`}>
                            {scholarship && (
                                <div className="scholarship-info mb-4 p-6 bg-white rounded-lg shadow-md">
                                    <div className="bg-blue-600 text-white p-4 rounded-t-lg">
                                        <span className='text-lg font-bold'>Upload Requirements</span>
                                    </div>

                                    <div className='p-4'>
                                        <p className='text-sm text-gray-700'>
                                            Please upload the following documents:
                                        </p>
                                        <ul className='list-disc list-inside mt-2 text-sm text-gray-700'>
                                            {requiredDocuments.map(doc => (
                                                <li key={doc.id}>{doc.name}</li>
                                            ))}
                                        </ul>

                                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4'>
                                            {requiredDocuments.map(doc => (
                                                <div key={doc.id}>
                                                    <label className='block text-sm font-medium text-gray-700 mb-2'>{doc.name}</label>
                                                    <input
                                                        type="file"
                                                        className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                                        onChange={(e) => handleFileChange(e, doc.name)}
                                                    />
                                                </div>
                                            ))}
                                        </div>

                                        <div className='flex mt-4 justify-end space-x-4'>
                                            {activeStep > 1 && (
                                                <button className='bg-white border px-8 py-2 rounded-md hover:bg-slate-200' onClick={handlePrevious}>Previous</button>
                                            )}
                                            <button className='bg-blue-600 text-white px-8 py-2 rounded-md hover:bg-blue-800' onClick={handleNext}>Next</button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className={`${getHideorActive(6)} max-w-8xl mx-auto bg-white shadow-lg rounded-lg`}>
                            <div className="bg-blue-600 text-white p-4 rounded-t-lg">
                                <span className='text-lg font-bold'>Terms and Conditions</span>
                            </div>

                            <div className='p-4'>
                                <div className='mb-4'>
                                    <p className='text-sm text-gray-700'>
                                        Please read the following terms and conditions carefully before applying for the scholarship program:
                                    </p>
                                    <ul className='list-disc list-inside mt-2 text-sm text-gray-700'>
                                        <li>The scholarship is open to all eligible applicants who meet the specified academic and financial criteria.</li>
                                        <li>Applicants must provide accurate and complete information in the application form. Any falsification of information may result in disqualification.</li>
                                        <li>Scholarship recipients are required to maintain the academic performance as stipulated in the scholarship guidelines to continue receiving funding.</li>
                                        <li>Recipients may be required to participate in specific events or activities related to the scholarship program, such as mentorship sessions or community service.</li>
                                        <li>The scholarship is non-transferable and must be used solely for the purpose of funding the recipient's education-related expenses.</li>
                                    </ul>
                                </div>

                                <div className='flex items-center mb-4'>
                                    <input
                                        type="checkbox"
                                        id="agree"
                                        name="agree"
                                        className='mr-2'
                                        required
                                    />
                                    <label htmlFor="agree" className='text-sm text-gray-700'>
                                        I have read and agree to the terms and conditions.
                                    </label>
                                </div>

                                <div className='flex mt-4 justify-end space-x-4'>
                                    <button className='bg-white border px-8 py-2 rounded-md hover:bg-slate-200' onClick={handlePrevious}>Previous</button>
                                    <button className='bg-blue-600 text-white px-8 py-2 rounded-md hover:bg-blue-800' onClick={handleSubmit}>Submit</button>
                                </div>
                            </div>
                        </div>

                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
}