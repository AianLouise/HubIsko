import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaInfoCircle, FaUsers, FaGraduationCap, FaEllipsisH } from 'react-icons/fa';
import { FaArrowRightLong } from "react-icons/fa6";
import StepTemplate from '../components/ProviderRegistration/StepTemplate';
import Step1 from '../components/ProviderRegistration/Step1';
import Step2 from '../components/ProviderRegistration/Step2';
import Step3 from '../components/ProviderRegistration/Step3';
import Step4 from '../components/ProviderRegistration/Step4';
import { useSelector } from 'react-redux';
import { ref, uploadBytesResumable, getDownloadURL, uploadBytes } from "firebase/storage";
import { storage } from "../firebase";
import { Link } from 'react-router-dom';

const validateEmail = async (email) => {
    const apiEndpoint = '/api/user/check-email';
    try {
        const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });
        const data = await response.json();
        return data.exists;
    } catch (error) {
        console.error('Error checking email:', error);
        return false;
    }
};

const ProviderRegistration = () => {
    const { currentUser } = useSelector((state) => state.user);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [countdown, setCountdown] = useState(10);

    const [formData, setFormData] = useState({
        profilePicture: null,
        organizationName: '',
        organizationType: '',
        registrationNumber: '',
        contactPersonName: '',
        contactPersonPosition: '',
        contactPersonNumber: '',
        region: '',
        province: '',
        city: '',
        barangay: '',
        addressDetails: '',
        website: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        documents: {
            registrationCertificate: '',
            tin: '',
            proofOfAddress: '',
            authorizationLetter: '',
            idProofContactPerson: '',
        },
        agreeTerms: false,
    });

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [notification, setNotification] = useState(null);
    const [activeStep, setActiveStep] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        if (showModal) {
            const timer = setInterval(() => {
                setCountdown((prevCountdown) => {
                    if (prevCountdown === 1) {
                        clearInterval(timer);
                        handleLogin();
                    }
                    return prevCountdown - 1;
                });
            }, 1000);
        }
    }, [showModal]);

    const handleLogin = () => {
        navigate('/login');
    };

    useEffect(() => {
        // Scroll to the top of the page when the component is mounted
        window.scrollTo(0, 0);
    }, []);

    const [errors, setErrors] = useState({});
    const [isEmailValid, setIsEmailValid] = useState(true);

    useEffect(() => {
        const checkEmail = async () => {
            const emailValid = await validateEmail(formData.email);
            setIsEmailValid(emailValid);
        };

        if (formData.email) {
            checkEmail();
        }
    }, [formData.email]);

    const steps = [
        {
            title: 'Organization Information',
            description: 'Fill out your organization information below',
            content: <Step1 formData={formData} setFormData={setFormData} />,
            validate: () => {
                const errors = {};
                if (!formData.profilePicture) errors.profilePicture = 'Organization image is required';
                if (!formData.organizationName) errors.organizationName = 'Organization name is required';
                if (!formData.organizationType) errors.organizationType = 'Organization type is required';
                if (!formData.registrationNumber) errors.registrationNumber = 'Registration number is required';
                if (!formData.contactPersonName) errors.contactPersonName = 'Contact person name is required';
                if (!formData.contactPersonPosition) errors.contactPersonPosition = 'Contact person position is required';
                if (!formData.contactPersonNumber) errors.contactPersonNumber = 'Contact person number is required';
                if (!formData.region) errors.region = 'Region is required';
                if (!formData.province) errors.province = 'Province is required';
                if (!formData.city) errors.city = 'City is required';
                if (!formData.barangay) errors.barangay = 'Barangay is required';
                if (!formData.addressDetails) errors.addressDetails = 'Address details are required';
                if (!formData.website) errors.website = 'Website is required';
                return errors;
            }
        },
        {
            title: 'Account Information',
            description: 'Provide account details',
            content: <Step2 formData={formData} setFormData={setFormData} />,
            validate: () => {
                const errors = {};

                // Validate username
                if (!formData.username) {
                    errors.username = 'Username is required';
                }

                // Validate email
                if (!formData.email) {
                    errors.email = 'Email is required';
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                    errors.email = 'Invalid email format';
                } else if (isEmailValid) {
                    errors.email = 'Email is already taken';
                }

                // Validate password
                const password = formData.password;
                const confirmPassword = formData.confirmPassword;
                const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;

                if (!password) {
                    errors.password = 'Password is required';
                } else if (!passwordRegex.test(password)) {
                    errors.password = 'Password must be at least 6 characters long, contain one uppercase letter, and one special character';
                }

                // Validate confirm password
                if (!confirmPassword) {
                    errors.confirmPassword = 'Confirm Password is required';
                } else if (password !== confirmPassword) {
                    errors.confirmPassword = 'Passwords do not match';
                }

                return errors;
            }
        },
        {
            title: 'Documents Information',
            description: 'Provide your documents information',
            content: <Step3 formData={formData} setFormData={setFormData} />,
            validate: (data) => {
                const errors = {};
                const requiredDocuments = [
                    { id: 'registrationCertificate', name: 'Registration Certificate' },
                    { id: 'tin', name: 'TIN' },
                    { id: 'proofOfAddress', name: 'Proof of Address' },
                    { id: 'authorizationLetter', name: 'Authorization Letter' },
                    { id: 'idProofContactPerson', name: 'ID Proof of Contact Person' }
                ];
                const maxSizeInMB = 10;

                if (data.documents) {
                    requiredDocuments.forEach(doc => {
                        const file = data.documents[doc.id];
                        if (!file) {
                            errors[doc.id] = `${doc.name} is required.`;
                        } else if (file.size / (1024 * 1024) > maxSizeInMB) {
                            errors[doc.id] = `File size should be ${maxSizeInMB} MB or less for ${doc.name}`;
                        }
                    });
                }

                return errors;
            }
        },
        {
            title: 'Terms and Conditions',
            description: 'Please read and agree to the terms and conditions before submitting your application',
            content: <Step4 formData={formData} setFormData={setFormData} />,
            validate: () => {
                const errors = {};
                if (!formData.agreeTerms) {
                    errors.agreeTerms = 'You must agree to the terms and conditions.';
                }
                return errors;
            }
        }
    ];

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        // Perform form validation
        const newErrors = {};

        // Add validation for step 4
        if (!formData.agreeTerms) newErrors.agreeTerms = 'You must agree to the Terms and Conditions';

        // Other validation logic...

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setLoading(false);
            return; // Stop submission if there are validation errors
        }

        try {
            // Upload profile picture to Firebase Storage
            const profilePictureRef = ref(storage, `profilePictures/${formData.profilePicture.name}`);
            const profilePictureSnapshot = await uploadBytes(profilePictureRef, formData.profilePicture);
            const profilePictureURL = await getDownloadURL(profilePictureSnapshot.ref);

            // Upload documents to Firebase Storage
            const documentUploadPromises = Object.keys(formData.documents).map(async (docKey) => {
                const randomNum = Math.floor(Math.random() * 1000000); // Generate a random number
                const documentName = `${formData.organizationName}_${docKey}_${randomNum}`;
                const documentRef = ref(storage, `documents/${documentName}`);
                const documentSnapshot = await uploadBytes(documentRef, formData.documents[docKey]);
                const documentURL = await getDownloadURL(documentSnapshot.ref);
                return { [docKey]: documentURL };
            });

            const documentURLs = await Promise.all(documentUploadPromises);
            const documents = documentURLs.reduce((acc, doc) => ({ ...acc, ...doc }), {});

            // Update formData with the download URLs
            const updatedFormData = {
                ...formData,
                profilePicture: profilePictureURL,
                documents,
            };

            // Log all form data to the console
            console.log('Form Data:', updatedFormData);

            // Send form data to the API endpoint
            const response = await fetch('/api/provider/signupAsProvider', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedFormData),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            console.log('Success:', result);

            setLoading(false);
            setShowModal(true);
        } catch (error) {
            setLoading(false);
            console.error('Error:', error);
            // Handle error (e.g., show error message to the user)
        }
    };

    return (
        <div className="container bg-[#f8f8fb] font-medium flex flex-col items-center min-h-screen pb-14 pt-14">
            {/* Top section with step indicators */}
            <div className="flex flex-col items-center mt-8">
                <span className='text-2xl text-slate-500'>Let's get your organization setup!</span>
                <span className='text-sm mt-2 text-slate-500'>We'll guide you step by step!</span>

                <div className='flex justify-center items-center gap-4 mt-4 mb-8'>
                    {[0, 1, 2, 3].map((step, index) => (
                        <React.Fragment key={index}>
                            <div className='flex flex-col gap-1 items-center text-center'>
                                <span className={`text-xl font-bold ${currentPage === index ? 'text-blue-600' : 'text-gray-400'}`}>{step + 1}</span>
                                <button
                                    className={`w-12 h-12 shadow rounded-md flex items-center justify-center ${currentPage === index ? 'bg-blue-600' : 'border'}`}
                                    onClick={() => setCurrentPage(index)}
                                    disabled={index > currentPage} // Disable button if step is greater than current step
                                >
                                    {index === 0 && <FaInfoCircle className={currentPage === index ? 'text-white' : 'text-blue-600'} />}
                                    {index === 1 && <FaUsers className={currentPage === index ? 'text-white' : 'text-blue-600'} />}
                                    {index === 2 && <FaGraduationCap className={currentPage === index ? 'text-white' : 'text-blue-600'} />}
                                    {index === 3 && <FaEllipsisH className={currentPage === index ? 'text-white' : 'text-blue-600'} />}
                                </button>
                                <span className='text-sm text-slate-600'>
                                    {index === 0 && "Organization Information"}
                                    {index === 1 && "Account Information"}
                                    {index === 2 && "Documents Information"}
                                    {index === 3 && "Terms and Conditions"}
                                </span>
                            </div>
                            {index < 3 && <FaArrowRightLong className='text-4xl text-blue-600' />}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* Step forms */}
            <form onSubmit={handleSubmit} className='w-full'>
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

            {loading && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-8 rounded-md shadow-lg text-center">
                        <h2 className="text-2xl font-bold mb-4">Sending Email Verification</h2>
                        <p>Please wait while we send the verification link to your email address.</p>
                    </div>
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-8 rounded-md shadow-lg text-center">
                        <h2 className="text-2xl font-bold mb-4">Thank You!</h2>
                        <p className="mb-4">Your registration was successful.</p>
                        <p className="mb-4">A verification link has been sent to your email address. Please check your inbox and verify your email.</p>
                        <p>You will be redirected to the login page in {countdown} seconds.</p>
                        <button onClick={handleLogin} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md">Go to Login</button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default ProviderRegistration;