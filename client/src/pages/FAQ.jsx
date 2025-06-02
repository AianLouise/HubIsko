import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FaQuestionCircle, FaChevronDown, FaChevronUp, FaSearch, FaGraduationCap, FaUsers, FaShieldAlt, FaComments, FaCog } from 'react-icons/fa';
import { MdEmail, MdPhone, MdHelpOutline } from 'react-icons/md';
import { Link } from 'react-router-dom';
import logo from '../assets/NewLogo.png';
import useTokenExpiry from '../hooks/useTokenExpiry';

export default function FAQ() {
    useTokenExpiry();

    const [activeQuestion, setActiveQuestion] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = "FAQ | HubIsko";
    }, []);

    const faqData = [
        {
            category: 'general',
            icon: <FaQuestionCircle />,
            question: 'What is HubIsko?',
            answer: 'HubIsko is a comprehensive scholarship management platform that connects students with scholarship opportunities and helps scholarship providers manage their programs efficiently. Our platform streamlines the application process, provides real-time notifications, and offers a community forum for discussions.'
        },
        {
            category: 'general',
            icon: <FaQuestionCircle />,
            question: 'How do I create an account on HubIsko?',
            answer: 'To create an account, click the "Register" button on our homepage. You can register as either a student (applicant) or scholarship provider. Fill in your basic information, verify your email address, and complete your profile to get started.'
        },
        {
            category: 'general',
            icon: <FaQuestionCircle />,
            question: 'Is HubIsko free to use?',
            answer: 'Yes, HubIsko is completely free for students to use. We believe education should be accessible to everyone. Scholarship providers may have different pricing tiers depending on their needs, but basic features are available at no cost.'
        },
        {
            category: 'applications',
            icon: <FaGraduationCap />,
            question: 'How do I apply for scholarships?',
            answer: 'Browse available scholarships in our scholarship listing page. Use filters to find opportunities that match your criteria. Click on a scholarship to view details, then click "Apply Now" to start your application. Make sure to complete all required fields and upload necessary documents.'
        },
        {
            category: 'applications',
            icon: <FaGraduationCap />,
            question: 'What documents do I need to apply?',
            answer: 'Common documents include: academic transcripts, recommendation letters, personal statement/essay, proof of enrollment, identification documents, and financial information. Specific requirements vary by scholarship, so always check the individual scholarship details.'
        },
        {
            category: 'applications',
            icon: <FaGraduationCap />,
            question: 'Can I apply for multiple scholarships?',
            answer: 'Yes! You can apply for as many scholarships as you qualify for. Our platform helps you track all your applications in one dashboard. However, make sure you meet the eligibility criteria for each scholarship before applying.'
        },
        {
            category: 'applications',
            icon: <FaGraduationCap />,
            question: 'How do I track my application status?',
            answer: 'Log into your dashboard to view all your applications and their current status. You\'ll receive email notifications and in-app alerts when there are updates to your applications. Status updates include: submitted, under review, approved, or declined.'
        },
        {
            category: 'eligibility',
            icon: <FaUsers />,
            question: 'Who can apply for scholarships on HubIsko?',
            answer: 'Students of all levels can apply - from high school seniors to graduate students. Eligibility varies by scholarship, including factors like academic performance, field of study, financial need, location, and demographic criteria. Check each scholarship\'s specific requirements.'
        },
        {
            category: 'eligibility',
            icon: <FaUsers />,
            question: 'Do I need to be a Filipino citizen to apply?',
            answer: 'While many scholarships are for Filipino citizens or residents, some international scholarships are also available. Check the citizenship and residency requirements for each scholarship opportunity.'
        },
        {
            category: 'eligibility',
            icon: <FaUsers />,
            question: 'What GPA do I need to qualify for scholarships?',
            answer: 'GPA requirements vary by scholarship. Some are merit-based requiring high academic performance (3.5+ GPA), while others focus on financial need or specific criteria. Always check the individual scholarship requirements before applying.'
        },
        {
            category: 'providers',
            icon: <FaShieldAlt />,
            question: 'How can organizations become scholarship providers?',
            answer: 'Organizations can register as scholarship providers by clicking "Apply as Provider" on our homepage. Complete the verification process, including providing organization details and documentation. Once approved, you can create and manage scholarship programs.'
        },
        {
            category: 'providers',
            icon: <FaShieldAlt />,
            question: 'How do I create a scholarship program?',
            answer: 'After registering as a provider, log into your dashboard and click "Post Scholarship." Fill in the scholarship details, eligibility criteria, required documents, deadlines, and award amounts. Your scholarship will be reviewed before going live.'
        },
        {
            category: 'providers',
            icon: <FaShieldAlt />,
            question: 'How do I manage applications?',
            answer: 'Use your provider dashboard to view all applications for your scholarships. You can filter applications, review documents, communicate with applicants, and update application statuses. The platform provides tools to streamline the selection process.'
        },
        {
            category: 'technical',
            icon: <FaCog />,
            question: 'I forgot my password. How can I reset it?',
            answer: 'Click "Forgot Password?" on the login page. Enter your registered email address, and we\'ll send you a password reset link. Follow the instructions in the email to create a new password.'
        },
        {
            category: 'technical',
            icon: <FaCog />,
            question: 'Why am I not receiving email notifications?',
            answer: 'Check your spam/junk folder first. Ensure your email address is correct in your profile settings. Add notifications@hubisko.com to your safe sender list. If issues persist, contact our support team.'
        },
        {
            category: 'technical',
            icon: <FaCog />,
            question: 'Is my personal information secure?',
            answer: 'Yes, we use industry-standard security measures including SSL encryption, secure data storage, and regular security audits. We never share your personal information without your consent. Read our Privacy Policy for detailed information.'
        },
        {
            category: 'forums',
            icon: <FaComments />,
            question: 'How do I use the community forums?',
            answer: 'Access the forums from the main navigation menu. You can browse existing discussions, post questions, share experiences, and connect with other students and scholarship providers. Follow community guidelines for respectful interactions.'
        },
        {
            category: 'forums',
            icon: <FaComments />,
            question: 'Can I get help with my scholarship applications in the forums?',
            answer: 'Absolutely! The forums are a great place to ask for advice, share experiences, and get tips from other students and mentors. However, avoid sharing personal information publicly and always verify advice with official sources.'
        }
    ];

    const categories = [
        { id: 'all', name: 'All Questions', icon: <FaQuestionCircle /> },
        { id: 'general', name: 'General', icon: <FaQuestionCircle /> },
        { id: 'applications', name: 'Applications', icon: <FaGraduationCap /> },
        { id: 'eligibility', name: 'Eligibility', icon: <FaUsers /> },
        { id: 'providers', name: 'For Providers', icon: <FaShieldAlt /> },
        { id: 'technical', name: 'Technical', icon: <FaCog /> },
        { id: 'forums', name: 'Forums', icon: <FaComments /> }
    ];

    const filteredFAQs = faqData.filter(faq => {
        const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const toggleQuestion = (index) => {
        setActiveQuestion(activeQuestion === index ? null : index);
    };

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <Header />
            <main className="flex-grow py-8 md:py-12">
                <div className="container mx-auto px-4 max-w-6xl">
                    {/* Hero Section */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl shadow-lg p-8 md:p-12 mb-12 text-white text-center">
                        <div className="flex justify-center mb-6">
                            <div className="bg-white p-4 rounded-full shadow-lg">
                                <img src={logo} alt="HubIsko Logo" className="w-16 h-16" />
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h1>
                        <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-8">
                            Find answers to common questions about HubIsko's scholarship platform,
                            application process, and how to make the most of our services.
                        </p>

                        {/* Search Bar - Moved here */}
                        <div className="max-w-md mx-auto">
                            <div className="relative">
                                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search questions..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 text-gray-800 bg-white rounded-full focus:ring-2 focus:ring-blue-300 focus:outline-none shadow-lg"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Search and Filter Section */}
                    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                        <div className="flex flex-col lg:flex-row gap-4 items-center">
                            {/* Category Filter */}
                            <div className="flex flex-wrap gap-2">
                                {categories.map(category => (
                                    <button
                                        key={category.id}
                                        onClick={() => setSelectedCategory(category.id)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${selectedCategory === category.id
                                            ? 'bg-blue-600 text-white shadow-md'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        {category.icon}
                                        <span className="hidden sm:inline">{category.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* FAQ Results Count */}
                    <div className="mb-6">
                        <p className="text-gray-600">
                            Showing {filteredFAQs.length} question{filteredFAQs.length !== 1 ? 's' : ''}
                            {searchTerm && ` for "${searchTerm}"`}
                            {selectedCategory !== 'all' && ` in ${categories.find(c => c.id === selectedCategory)?.name}`}
                        </p>
                    </div>

                    {/* FAQ Accordion */}
                    <div className="space-y-4 mb-12">
                        {filteredFAQs.length > 0 ? (
                            filteredFAQs.map((faq, index) => (
                                <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden">
                                    <button
                                        onClick={() => toggleQuestion(index)}
                                        className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:bg-gray-50"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="text-blue-600 text-lg">
                                                    {faq.icon}
                                                </div>
                                                <h3 className="text-lg font-semibold text-gray-800">{faq.question}</h3>
                                            </div>
                                            <div className="text-blue-600">
                                                {activeQuestion === index ? <FaChevronUp /> : <FaChevronDown />}
                                            </div>
                                        </div>
                                    </button>

                                    {activeQuestion === index && (
                                        <div className="px-6 pb-6">
                                            <div className="border-l-4 border-blue-500 pl-4 bg-blue-50 p-4 rounded-r-lg">
                                                <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="bg-white rounded-xl shadow-md p-8 text-center">
                                <FaQuestionCircle className="text-gray-400 text-4xl mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">No questions found</h3>
                                <p className="text-gray-500">Try adjusting your search terms or category filter.</p>
                            </div>
                        )}
                    </div>

                    {/* Contact Support Section */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl shadow-lg p-8 text-white">
                        <div className="text-center mb-8">
                            <MdHelpOutline className="text-4xl mx-auto mb-4" />
                            <h2 className="text-2xl font-bold mb-2">Still Have Questions?</h2>
                            <p className="text-blue-100">
                                Can't find what you're looking for? Our support team is here to help!
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Email Support */}
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
                                <MdEmail className="text-3xl mx-auto mb-3" />
                                <h3 className="font-semibold mb-2">Email Support</h3>
                                <p className="text-blue-100 text-sm mb-3">Get detailed help via email</p>
                                <a
                                    href="mailto:connectwithhubisko@gmail.com"
                                    className="bg-white text-blue-700 px-4 py-2 rounded-lg font-medium hover:bg-blue-100 transition duration-300 inline-block"
                                >
                                    Send Email
                                </a>
                            </div>

                            {/* Community Forums */}
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
                                <FaComments className="text-3xl mx-auto mb-3" />
                                <h3 className="font-semibold mb-2">Community Forums</h3>
                                <p className="text-blue-100 text-sm mb-3">Ask the community</p>
                                <Link
                                    to="/forums"
                                    className="bg-white text-blue-700 px-4 py-2 rounded-lg font-medium hover:bg-blue-100 transition duration-300 inline-block"
                                >
                                    Visit Forums
                                </Link>
                            </div>

                            {/* Help Center */}
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
                                <FaQuestionCircle className="text-3xl mx-auto mb-3" />
                                <h3 className="font-semibold mb-2">Help Center</h3>
                                <p className="text-blue-100 text-sm mb-3">Browse more resources</p>
                                <Link
                                    to="/about"
                                    className="bg-white text-blue-700 px-4 py-2 rounded-lg font-medium hover:bg-blue-100 transition duration-300 inline-block"
                                >
                                    Learn More
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-lg shadow-md p-6 text-center">
                            <FaGraduationCap className="text-blue-600 text-3xl mx-auto mb-3" />
                            <h3 className="font-semibold mb-2">Browse Scholarships</h3>
                            <p className="text-gray-600 text-sm mb-4">Explore available scholarship opportunities</p>
                            <Link
                                to="/scholarship-listing"
                                className="text-blue-600 font-medium hover:text-blue-800 transition duration-300"
                            >
                                View Scholarships →
                            </Link>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-6 text-center">
                            <FaUsers className="text-blue-600 text-3xl mx-auto mb-3" />
                            <h3 className="font-semibold mb-2">Join Community</h3>
                            <p className="text-gray-600 text-sm mb-4">Connect with other students and providers</p>
                            <Link
                                to="/forums"
                                className="text-blue-600 font-medium hover:text-blue-800 transition duration-300"
                            >
                                Join Forums →
                            </Link>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-6 text-center">
                            <FaShieldAlt className="text-blue-600 text-3xl mx-auto mb-3" />
                            <h3 className="font-semibold mb-2">For Providers</h3>
                            <p className="text-gray-600 text-sm mb-4">Learn about becoming a scholarship provider</p>
                            <Link
                                to="/apply-as-provider"
                                className="text-blue-600 font-medium hover:text-blue-800 transition duration-300"
                            >
                                Apply as Provider →
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
