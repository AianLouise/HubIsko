import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StepTemplate from '../../components/PostScholarship/StepTemplate';
import Step1 from '../../components/PostScholarship/Step1';
import Step2 from '../../components/PostScholarship/Step2';
import Step3 from '../../components/PostScholarship/Step3';
import Step4 from '../../components/PostScholarship/Step4';
import Step5 from '../../components/PostScholarship/Step5';
import ProviderHeaderSidebar from '../../components/ProviderHeaderAndSidebar';
import { useSelector } from 'react-redux';

const PostScholarship = () => {
    const { currentUser } = useSelector((state) => state.user);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        educationLevel: '',
        location: '',
        fieldOfStudy: [],
        numberOfScholarships: '',
        amount: '',
        applicationStartDate: '',
        applicationDeadline: '',
        minGPA: '',
        duration: '',
        nationality: '',
        otherEligibility: '',
        startDate: '',
        endDate: '',
        selectionProcess: '',
        selectionCriteria: '',
        renewalPolicy: '',
        renewalDuration: '',
        disbursementSchedule: '',
        disbursementMethod: '',
        bankName: '',
        contactEmail: '',
        contactPhone: '',
        providerId: currentUser ? currentUser._id : '',
        organizationName: currentUser ? currentUser.scholarshipProviderDetails.organizationName : '',
        faqTitle: 'Frequently Asked Questions',
        faqDescription: 'For more details, visit our website.',
        scholarshipImage: '',
        bannerImage: '',
        providerRequirements: ''
    });
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Scroll to the top of the page when the component is mounted
        window.scrollTo(0, 0);
    }, []);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const steps = [
        {
            title: 'Scholarship Information',
            description: 'Fill out the basic information below',
            content: <Step1 formData={formData} setFormData={setFormData} />,
            validate: (formData) => {
                const errors = {};
                if (!formData.title) errors.title = 'Title of Scholarship is required';
                if (!formData.description) errors.description = 'Description is required';
                if (!formData.numberOfScholarships) errors.numberOfScholarships = 'Number of Scholarships Available is required';
                if (!formData.amount) errors.amount = 'Scholarship Amount is required';
                if (!formData.educationLevel) errors.educationLevel = 'Education Level is required';
                if (!formData.location) errors.location = 'Location is required';
                if (!formData.fieldOfStudy) errors.fieldOfStudy = 'Field of Study is required';
                if (!formData.duration) errors.duration = 'Duration Date is required';
                if (!formData.contactEmail) errors.selectionProcess = 'Contact Email is required';
                if (!formData.contactPhone) errors.contactPhone = 'Contact Phone is required';
                return errors;
            },
        },
        {
            title: 'Documents Needed',
            description: 'Specify the documents that applicants need to submit',
            content: <Step2 formData={formData} setFormData={setFormData} />,
            validate: (formData) => {
                const errors = {};
                if (!formData.requiredDocuments || formData.requiredDocuments.length === 0) {
                    errors.requiredDocuments = 'At least one required document must be specified';
                }
                if (!formData.documentGuidelines) {
                    errors.documentGuidelines = 'Document Guidelines is required';
                }
                return errors;
            },
        },
        {
            title: 'Customize Applicant View',
            description: 'Customize the page that applicants will see',
            content: <Step3 formData={formData} setFormData={setFormData} />,
            validate: (formData) => {
                const errors = {};
                if (!formData.scholarshipImage) {
                    errors.scholarshipImage = 'Scholarship Image is required';
                }
                if (!formData.bannerImage) {
                    errors.bannerImage = 'Banner Image is required';
                }
                if (formData.sections) {
                    formData.sections.forEach((section, index) => {
                        if (!section.title || section.title.trim() === '') {
                            errors[`sectionTitle${index}`] = `Title for section ${index + 1} is required`;
                        }
                        if (!section.content || section.content.trim() === '') {
                            errors[`sectionContent${index}`] = `Content for section ${index + 1} is required`;
                        }
                    });
                }
                return errors;
            },
        },
        {
            title: 'Upload Documents for Review',
            description: 'Upload documents so that the HubIsko can review and decide if the provider can offer this scholarship program',
            content: <Step4 formData={formData} setFormData={setFormData} setNotification={setNotification} />,
            validate: (formData) => {
                const errors = {};
                const hasUploadedDocument = formData.providerRequirements && formData.providerRequirements.some(req => req.url);
                if (!hasUploadedDocument) {
                    errors.providerRequirements = 'At least one document must be uploaded.';
                }
                return errors;
            },
        },
        {
            title: 'Terms and Conditions',
            description: 'Please read and agree to the terms and conditions before submitting your scholarship program.',
            content: <Step5 formData={formData} setFormData={setFormData} />,
            validate: (formData) => {
                const errors = {};
                if (!formData.agree) {
                    errors.agree = 'Agree is required';
                }
                return errors;
            },
        }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        console.log('Form Data:', formData);

        try {
            const response = await fetch('/api/scholarshipProgram/create-scholarship', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Scholarship posted successfully:', result);
                setNotification('Scholarship program application submitted successfully!');
                setTimeout(() => {
                    setNotification(null);
                    navigate('/scholarships');
                }, 3000);
            } else {
                const errorText = await response.text();
                console.error('Failed to post scholarship:', response.statusText, errorText);
                setNotification('Failed to submit scholarship program application.');
            }
        } catch (error) {
            console.error('Error submitting scholarship:', error);
            setNotification('Error submitting scholarship program application.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`flex flex-col min-h-screen`}>
            <main className={`flex-grow bg-[#f8f8fb] transition-all duration-200 ease-in-out ${sidebarOpen ? 'ml-64' : ''}`}>
                <ProviderHeaderSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 mt-10">
                    <div className="flex flex-col gap-2 border-b-4 pb-4">
                        <div className="flex justify-between items-center">
                            <h1 className="text-3xl font-bold text-blue-600">
                                {steps[currentPage].title}
                            </h1>
                        </div>
                        <p className="text-lg text-slate-500">
                            {steps[currentPage].description}
                        </p>
                    </div>
                    {notification && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded fixed top-4 right-4 z-50" role="alert">
                            <span className="block sm:inline">{notification}</span>
                        </div>
                    )}
                    <form onSubmit={handleSubmit}>
                        <StepTemplate
                            steps={steps}
                            formData={formData}
                            setFormData={setFormData}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            setNotification={setNotification} // Pass setNotification to StepTemplate
                        />
                    </form>
                </div>
            </main>
        </div>
    );
};

export default PostScholarship;