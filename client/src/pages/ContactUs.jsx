import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {
    FaEnvelope,
    FaPhone,
    FaMapMarkerAlt,
    FaClock,
    FaQuestionCircle,
    FaComments,
    FaGraduationCap,
    FaUsers,
    FaHeadset,
    FaPaperPlane,
    FaFacebook,
    FaTwitter,
    FaLinkedin,
    FaInstagram
} from 'react-icons/fa';
import { MdEmail, MdPhone, MdLocationOn, MdAccessTime, MdSend } from 'react-icons/md';
import { Link } from 'react-router-dom';
import useTokenExpiry from '../hooks/useTokenExpiry';

export default function ContactUs() {
    useTokenExpiry();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        category: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = "Contact Us | HubIsko";
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            setSubmitMessage('Thank you for your message! We will get back to you within 24-48 hours.');
            setFormData({
                name: '',
                email: '',
                subject: '',
                category: '',
                message: ''
            });
            setIsSubmitting(false);
        }, 2000);
    };

    const contactMethods = [
        {
            icon: <MdEmail className="text-2xl" />,
            title: "Email Support",
            description: "Send us a detailed message",
            contact: "connectwithhubisko@gmail.com",
            action: "mailto:connectwithhubisko@gmail.com",
            actionText: "Send Email",
            available: "24/7"
        },
        {
            icon: <MdPhone className="text-2xl" />,
            title: "Phone Support",
            description: "Speak with our support team",
            contact: "+63 (02) 8123-4567",
            action: "tel:+6302812334567",
            actionText: "Call Now",
            available: "Mon-Fri, 8AM-6PM PHT"
        },
        {
            icon: <MdLocationOn className="text-2xl" />,
            title: "Office Address",
            description: "Visit our headquarters",
            contact: "123 Education Drive, Makati City, Philippines 1200",
            action: "https://maps.google.com",
            actionText: "Get Directions",
            available: "Mon-Fri, 9AM-5PM PHT"
        }
    ];

    const supportCategories = [
        {
            icon: <FaGraduationCap className="text-xl" />,
            title: "Scholarship Applications",
            description: "Questions about applying for scholarships, application status, and requirements",
            color: "bg-blue-500"
        },
        {
            icon: <FaUsers className="text-xl" />,
            title: "Account Management",
            description: "Help with account creation, login issues, profile updates, and password reset",
            color: "bg-green-500"
        },
        {
            icon: <FaComments className="text-xl" />,
            title: "Community Forums",
            description: "Support for forum participation, posting guidelines, and community features",
            color: "bg-purple-500"
        },
        {
            icon: <FaHeadset className="text-xl" />,
            title: "Technical Support",
            description: "Website issues, bugs, performance problems, and browser compatibility",
            color: "bg-orange-500"
        }
    ];

    const faqs = [
        {
            question: "How quickly do you respond to inquiries?",
            answer: "We typically respond to email inquiries within 24-48 hours during business days. Phone support is available Monday through Friday from 8AM to 6PM PHT for immediate assistance."
        },
        {
            question: "What information should I include in my message?",
            answer: "Please include your full name, email address, account username (if applicable), and a detailed description of your issue or question. Screenshots or error messages are also helpful for technical issues."
        },
        {
            question: "Can I get help in languages other than English?",
            answer: "Our primary support language is English, but we also provide support in Filipino/Tagalog. Please specify your preferred language when contacting us."
        },
        {
            question: "Is there a knowledge base or self-help resources?",
            answer: "Yes! Check our FAQ page for common questions and answers. You can also find helpful guides and tutorials in our Help Center section."
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            {/* Hero Section */}
            <main className="pt-0">
                <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-16">
                    <div className="max-w-6xl mx-auto px-4 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
                        <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                            Have questions or need assistance? We're here to help! Get in touch with our support team
                            and we'll get back to you as soon as possible.
                        </p>
                    </div>
                </div>

                {/* Contact Methods */}
                <div className="max-w-6xl mx-auto px-4 py-16">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Get In Touch</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Choose the contact method that works best for you. Our team is ready to provide
                            the support and assistance you need.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                        {contactMethods.map((method, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition duration-300">
                                <div className="bg-blue-100 text-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    {method.icon}
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{method.title}</h3>
                                <p className="text-gray-600 mb-3">{method.description}</p>
                                <p className="font-medium text-gray-800 mb-3">{method.contact}</p>
                                <div className="flex items-center justify-center text-sm text-gray-500 mb-4">
                                    <FaClock className="mr-1" />
                                    {method.available}
                                </div>
                                <a
                                    href={method.action}
                                    className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                                    target={method.action.startsWith('http') ? '_blank' : '_self'}
                                    rel={method.action.startsWith('http') ? 'noopener noreferrer' : ''}
                                >
                                    {method.actionText}
                                </a>
                            </div>
                        ))}
                    </div>

                    {/* Contact Form */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Form */}
                        <div className="bg-white rounded-xl shadow-lg p-8">
                            <h3 className="text-2xl font-bold text-gray-800 mb-6">Send us a Message</h3>

                            {submitMessage && (
                                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                                    {submitMessage}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Full Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Enter your full name"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Address <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Enter your email address"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Category <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        >
                                            <option value="">Select a category</option>
                                            <option value="scholarship">Scholarship Applications</option>
                                            <option value="account">Account Management</option>
                                            <option value="technical">Technical Support</option>
                                            <option value="forums">Community Forums</option>
                                            <option value="provider">For Providers</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Subject <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Brief description of your inquiry"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Message <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        rows="5"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Please provide details about your question or issue..."
                                        required
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <FaPaperPlane className="mr-2" />
                                            Send Message
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* Support Information */}
                        <div className="space-y-8">
                            {/* Support Categories */}
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-4">Support Categories</h3>
                                <div className="space-y-4">
                                    {supportCategories.map((category, index) => (
                                        <div key={index} className="flex items-start space-x-3">
                                            <div className={`${category.color} text-white p-2 rounded-lg flex-shrink-0`}>
                                                {category.icon}
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-800">{category.title}</h4>
                                                <p className="text-sm text-gray-600">{category.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Business Hours */}
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-4">Business Hours</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Monday - Friday</span>
                                        <span className="font-medium">8:00 AM - 6:00 PM PHT</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Saturday</span>
                                        <span className="font-medium">9:00 AM - 2:00 PM PHT</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Sunday</span>
                                        <span className="font-medium">Closed</span>
                                    </div>
                                    <div className="border-t pt-3 mt-3">
                                        <p className="text-sm text-gray-600">
                                            <strong>Email Support:</strong> Available 24/7 with responses within 24-48 hours
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Social Media */}
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-4">Follow Us</h3>
                                <p className="text-gray-600 mb-4">Stay connected for updates and announcements</p>
                                <div className="flex space-x-4">
                                    <a href="#" className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-300">
                                        <FaFacebook className="text-xl" />
                                    </a>
                                    <a href="#" className="bg-blue-400 text-white p-3 rounded-lg hover:bg-blue-500 transition duration-300">
                                        <FaTwitter className="text-xl" />
                                    </a>
                                    <a href="#" className="bg-blue-800 text-white p-3 rounded-lg hover:bg-blue-900 transition duration-300">
                                        <FaLinkedin className="text-xl" />
                                    </a>
                                    <a href="#" className="bg-pink-600 text-white p-3 rounded-lg hover:bg-pink-700 transition duration-300">
                                        <FaInstagram className="text-xl" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* FAQ Section */}
                    <div className="mt-16">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                Quick answers to common questions about contacting our support team.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {faqs.map((faq, index) => (
                                <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                                    <div className="flex items-start space-x-3">
                                        <FaQuestionCircle className="text-blue-600 text-xl flex-shrink-0 mt-1" />
                                        <div>
                                            <h3 className="font-semibold text-gray-800 mb-2">{faq.question}</h3>
                                            <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-lg shadow-md p-6 text-center">
                            <FaQuestionCircle className="text-blue-600 text-3xl mx-auto mb-3" />
                            <h3 className="font-semibold mb-2">FAQ Page</h3>
                            <p className="text-gray-600 text-sm mb-4">Find answers to common questions</p>
                            <Link
                                to="/faq"
                                className="text-blue-600 font-medium hover:text-blue-800 transition duration-300"
                            >
                                View FAQ →
                            </Link>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-6 text-center">
                            <FaComments className="text-blue-600 text-3xl mx-auto mb-3" />
                            <h3 className="font-semibold mb-2">Community Forums</h3>
                            <p className="text-gray-600 text-sm mb-4">Ask the community for help</p>
                            <Link
                                to="/forums"
                                className="text-blue-600 font-medium hover:text-blue-800 transition duration-300"
                            >
                                Join Forums →
                            </Link>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-6 text-center">
                            <FaGraduationCap className="text-blue-600 text-3xl mx-auto mb-3" />
                            <h3 className="font-semibold mb-2">Scholarship Help</h3>
                            <p className="text-gray-600 text-sm mb-4">Get help with applications</p>
                            <Link
                                to="/scholarship-listing"
                                className="text-blue-600 font-medium hover:text-blue-800 transition duration-300"
                            >
                                Browse Scholarships →
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
