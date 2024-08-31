import React, { useState } from 'react';
import StepTemplate from '../../components/PostScholarship/StepTemplate';
import Step1 from '../../components/PostScholarship/Step1';
import Step2 from '../../components/PostScholarship/Step2';
import Step3 from '../../components/PostScholarship/Step3';
import Step4 from '../../components/PostScholarship/Step4';
import Step5 from '../../components/PostScholarship/Step5';
import ProviderHeaderSidebar from '../../components/ProviderHeaderAndSidebar';

const PostScholarship = () => {
    const [formData, setFormData] = useState({});
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const steps = [
        {
            title: 'Scholarship Information',
            description: 'Fill out the basic information below',
            content: <Step1 />,
            validate: (formData) => {
                const errors = {};
                if (!formData.title) {
                    errors.title = 'Title is required';
                }

                if (!formData.category) {
                    errors.category = 'Category is required';
                }

                if (!formData.fieldOfStudy) {
                    errors.fieldOfStudy = 'Field of Study is required';
                }

                if (!formData.numberOfScholarships) {
                    errors.numberOfScholarships = 'Number of Scholarships is required';
                }

                if (!formData.amount) {
                    errors.amount = 'Amount is required';
                }

                if (!formData.applicationDeadline) {
                    errors.applicationDeadline = 'Application Deadline is required';
                }

                if (!formData.minGPA) {
                    errors.minGPA = 'Minimum GPA is required';
                }

                if (!formData.nationality) {
                    errors.nationality = 'Nationality is required';
                }

                if (!formData.otherEligibility) {
                    errors.otherEligibility = 'Other Eligibility is required';
                }

                if (!formData.startDate) {
                    errors.startDate = 'Start Date is required';
                }

                if (!formData.endDate) {
                    errors.endDate = 'End Date is required';
                }
                return errors;
            },
        },
        {
            title: 'Documents Needed',
            description: 'Specify the documents that applicants need to submit',
            content: <Step2 />,
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
            content: <Step3 />
        },
        {
            title: 'Upload Documents for Review',
            description: 'Upload documents so that the HubIsko can review and decide if the provider can offer this scholarship program',
            content: <Step4 />
        },
        {
            title: 'Confirmation',
            description: 'Confirm your submission and finish the process',
            content: <Step5 />
        }
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form Data:', formData);
        // Add your form submission logic here
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
                    <form onSubmit={handleSubmit}>
                        <StepTemplate
                            steps={steps}
                            formData={formData}
                            setFormData={setFormData}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                        />
                    </form>
                </div>
            </main>
        </div>
    );
};

export default PostScholarship;