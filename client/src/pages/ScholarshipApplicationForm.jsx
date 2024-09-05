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

    if (error) {
        return <div>Error: {error}</div>;
    }

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
                // Add validation logic for Step 1
                return errors;
            },
        },
        {
            title: 'Custodian',
            description: 'Provide custodian details',
            content: <Step2 formData={formData} setFormData={setFormData} />,
            validate: (formData) => {
                const errors = {};
                // Add validation logic for Step 2
                return errors;
            },
        },
        {
            title: 'Education',
            description: 'Provide your educational background',
            content: <Step3 formData={formData} setFormData={setFormData} />,
            validate: (formData) => {
                const errors = {};
                // Add validation logic for Step 3
                return errors;
            },
        },
        {
            title: 'Others',
            description: 'Provide other relevant information',
            content: <Step4 formData={formData} setFormData={setFormData} setNotification={setNotification} />,
            validate: (formData) => {
                const errors = {};
                // Add validation logic for Step 4
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
