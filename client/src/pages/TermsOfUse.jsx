import React, { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import logo from '../assets/NewLogo.png';
import useTokenExpiry from '../hooks/useTokenExpiry';
import { FaGavel, FaUserShield, FaExclamationTriangle, FaUserAlt, FaFileContract, FaCopyright } from 'react-icons/fa';

export default function TermsOfUse() {
    useTokenExpiry();
    
    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = "Terms of Use | HubIsko";
    }, []);
    
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />
            <main className="flex-grow py-8 md:py-12">
                <div className="container mx-auto px-4 max-w-4xl">
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-blue-700 to-blue-900 rounded-lg shadow-md p-6 md:p-8 mb-8 text-white text-center">
                        <div className="flex justify-center mb-4">
                            <div className="bg-white p-4 rounded-full">
                                <img src={logo} alt="HubIsko Logo" className="w-16 h-16" />
                            </div>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">Terms of Use</h1>
                        <p className="text-blue-100">Effective Date: June 1, 2025</p>
                    </div>
                    
                    {/* Introduction */}
                    <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-8">
                        <h2 className="text-2xl font-bold text-blue-800 mb-4">Welcome to HubIsko</h2>
                        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                            <p className="text-slate-700 italic">
                                By accessing or using the HubIsko platform and services, you agree to be bound by these Terms of Use. 
                                Please read them carefully before using our platform.
                            </p>
                        </div>
                        <p className="text-slate-700 mb-4 leading-relaxed">
                            HubIsko is a scholarship management platform designed to connect students with scholarship 
                            opportunities and help providers manage their scholarship programs effectively. These Terms 
                            of Use constitute a legally binding agreement between you and HubIsko governing your access 
                            to and use of our website, mobile applications, and services (collectively, the "Platform").
                        </p>
                        <p className="text-slate-700 leading-relaxed">
                            If you do not agree with these terms, please do not use our Platform. By using HubIsko, 
                            you represent that you are at least 16 years of age or that you have the consent of a 
                            legal guardian to use our services.
                        </p>
                    </div>
                    
                    {/* User Accounts */}
                    <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-8">
                        <div className="flex items-center mb-4">
                            <FaUserAlt className="text-blue-600 text-xl mr-3" />
                            <h2 className="text-2xl font-bold text-blue-800">User Accounts</h2>
                        </div>
                        <h3 className="text-lg font-semibold text-slate-800 mb-2">Account Creation and Responsibility</h3>
                        <p className="text-slate-700 mb-4 leading-relaxed">
                            When you create an account on HubIsko, you agree to:
                        </p>
                        <ul className="list-disc list-inside text-slate-700 mb-6 space-y-2">
                            <li>Provide accurate, current, and complete information</li>
                            <li>Maintain and promptly update your account information</li>
                            <li>Keep your password secure and confidential</li>
                            <li>Accept responsibility for all activities that occur under your account</li>
                            <li>Notify us immediately of any unauthorized use of your account</li>
                        </ul>
                        
                        <h3 className="text-lg font-semibold text-slate-800 mb-2">Account Types</h3>
                        <p className="text-slate-700 mb-4 leading-relaxed">
                            HubIsko offers different account types based on user roles:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <h4 className="font-semibold text-slate-800 mb-2">Student Accounts</h4>
                                <p className="text-sm text-slate-700">
                                    Designed for scholarship seekers. Students can create profiles, search for scholarships, 
                                    submit applications, manage documents, and interact with the community.
                                </p>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <h4 className="font-semibold text-slate-800 mb-2">Provider Accounts</h4>
                                <p className="text-sm text-slate-700">
                                    For organizations offering scholarships. Providers can create scholarship listings, 
                                    review applications, communicate with applicants, and manage their programs.
                                </p>
                            </div>
                        </div>
                        <p className="text-slate-700 mb-4 leading-relaxed">
                            We reserve the right to refuse service, terminate accounts, remove content, or cancel 
                            applications at our sole discretion, particularly if we believe you are violating these Terms.
                        </p>
                    </div>
                    
                    {/* Acceptable Use */}
                    <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-8">
                        <div className="flex items-center mb-4">
                            <FaUserShield className="text-blue-600 text-xl mr-3" />
                            <h2 className="text-2xl font-bold text-blue-800">Acceptable Use</h2>
                        </div>
                        <p className="text-slate-700 mb-4 leading-relaxed">
                            When using our Platform, you agree to:
                        </p>
                        <div className="pl-8 border-l-2 border-blue-100 mb-6">
                            <h3 className="text-lg font-semibold text-slate-800 mb-2">Prohibited Activities</h3>
                            <p className="text-slate-700 mb-2">You agree NOT to:</p>
                            <ul className="list-disc list-inside text-slate-700 space-y-2 mb-4">
                                <li>Use the Platform for any illegal or unauthorized purpose</li>
                                <li>Violate any applicable laws or regulations</li>
                                <li>Impersonate another person or entity</li>
                                <li>Provide false or misleading information</li>
                                <li>Submit fraudulent scholarship applications</li>
                                <li>Post or share content that is defamatory, abusive, harassing, or offensive</li>
                                <li>Distribute malware or attempt to breach our security measures</li>
                                <li>Interfere with the proper functioning of the Platform</li>
                                <li>Scrape, data-mine, or otherwise extract data from our Platform in an automated manner</li>
                            </ul>
                        </div>
                        <div className="pl-8 border-l-2 border-blue-100">
                            <h3 className="text-lg font-semibold text-slate-800 mb-2">User Content</h3>
                            <p className="text-slate-700 mb-4 leading-relaxed">
                                When you post content to our Platform (including forum posts, comments, scholarship applications, etc.), you:
                            </p>
                            <ul className="list-disc list-inside text-slate-700 space-y-2">
                                <li>Retain ownership of your content, but grant us a worldwide, non-exclusive license to use, reproduce, and display it</li>
                                <li>Are responsible for ensuring you have the rights to share such content</li>
                                <li>Understand that we may moderate, remove, or restrict access to content that violates these Terms</li>
                            </ul>
                        </div>
                    </div>
                    
                    {/* Intellectual Property */}
                    <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-8">
                        <div className="flex items-center mb-4">
                            <FaCopyright className="text-blue-600 text-xl mr-3" />
                            <h2 className="text-2xl font-bold text-blue-800">Intellectual Property</h2>
                        </div>
                        <p className="text-slate-700 mb-4 leading-relaxed">
                            The HubIsko Platform, including its design, text, graphics, logos, icons, images, audio, 
                            videos, and software, is owned by us and is protected by copyright, trademark, and other 
                            intellectual property laws.
                        </p>
                        <div className="bg-blue-50 rounded-lg p-5 mb-4">
                            <h3 className="text-lg font-semibold text-slate-800 mb-2">Limited License</h3>
                            <p className="text-slate-700 leading-relaxed">
                                We grant you a limited, non-exclusive, non-transferable, and revocable license to 
                                access and use our Platform solely for its intended purposes. This license does not 
                                allow you to:
                            </p>
                            <ul className="list-disc list-inside text-slate-700 mt-2 space-y-1">
                                <li>Modify, copy, or create derivative works based on our Platform</li>
                                <li>Use any data mining, robots, or similar data gathering methods</li>
                                <li>Remove any copyright, trademark, or other proprietary notices</li>
                                <li>Use our Platform for commercial purposes without our consent</li>
                            </ul>
                        </div>
                        <p className="text-slate-700 leading-relaxed">
                            All trademarks, service marks, and trade names used on the Platform are the property of 
                            their respective owners. The use of any such marks without the owner's permission is strictly prohibited.
                        </p>
                    </div>
                    
                    {/* Disclaimers and Limitations */}
                    <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-8">
                        <div className="flex items-center mb-4">
                            <FaExclamationTriangle className="text-blue-600 text-xl mr-3" />
                            <h2 className="text-2xl font-bold text-blue-800">Disclaimers and Limitations</h2>
                        </div>
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                            <h3 className="text-lg font-semibold text-slate-800 mb-2">Warranty Disclaimer</h3>
                            <p className="text-slate-700 leading-relaxed text-sm">
                                THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, 
                                EITHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF 
                                MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT. WE DO NOT 
                                GUARANTEE THAT THE PLATFORM WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE.
                            </p>
                        </div>
                        <h3 className="text-lg font-semibold text-slate-800 mb-2">Limitation of Liability</h3>
                        <p className="text-slate-700 mb-4 leading-relaxed">
                            To the maximum extent permitted by law, HubIsko and its officers, directors, employees, and 
                            agents shall not be liable for any indirect, incidental, special, consequential, or punitive 
                            damages, including loss of profits, data, or goodwill, resulting from your access to or use 
                            of the Platform.
                        </p>
                        <h3 className="text-lg font-semibold text-slate-800 mb-2">Indemnification</h3>
                        <p className="text-slate-700 leading-relaxed">
                            You agree to indemnify, defend, and hold harmless HubIsko and its officers, directors, 
                            employees, and agents from and against any claims, liabilities, damages, losses, and expenses, 
                            including reasonable attorney fees, arising out of or in any way connected with your access to 
                            or use of the Platform or your violation of these Terms.
                        </p>
                    </div>
                    
                    {/* Modifications and Termination */}
                    <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-8">
                        <div className="flex items-center mb-4">
                            <FaFileContract className="text-blue-600 text-xl mr-3" />
                            <h2 className="text-2xl font-bold text-blue-800">Modifications and Termination</h2>
                        </div>
                        <h3 className="text-lg font-semibold text-slate-800 mb-2">Changes to Terms</h3>
                        <p className="text-slate-700 mb-4 leading-relaxed">
                            We reserve the right to modify these Terms at any time at our sole discretion. If we make 
                            material changes, we will notify you through the Platform or by email. Your continued use of 
                            the Platform after such modifications constitutes your acceptance of the updated Terms.
                        </p>
                        <h3 className="text-lg font-semibold text-slate-800 mb-2">Changes to the Platform</h3>
                        <p className="text-slate-700 mb-4 leading-relaxed">
                            We reserve the right to modify, suspend, or discontinue any part of the Platform at any time 
                            without prior notice. We will not be liable to you or any third party for any modification, 
                            suspension, or discontinuation of the Platform.
                        </p>
                        <h3 className="text-lg font-semibold text-slate-800 mb-2">Account Termination</h3>
                        <p className="text-slate-700 leading-relaxed">
                            We may terminate or suspend your account and access to the Platform at any time, without prior 
                            notice or liability, for any reason, including if you violate these Terms. Upon termination, 
                            your right to use the Platform will immediately cease, but provisions of these Terms that, by 
                            their nature, should survive termination shall remain in effect.
                        </p>
                    </div>
                    
                    {/* Governing Law and Dispute Resolution */}
                    <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-8">
                        <div className="flex items-center mb-4">
                            <FaGavel className="text-blue-600 text-xl mr-3" />
                            <h2 className="text-2xl font-bold text-blue-800">Governing Law and Dispute Resolution</h2>
                        </div>
                        <p className="text-slate-700 mb-4 leading-relaxed">
                            These Terms shall be governed by and construed in accordance with the laws of the Philippines, 
                            without regard to its conflict of law provisions. You agree that any legal action or proceeding 
                            arising out of or relating to these Terms shall be brought exclusively in the courts located in 
                            the Philippines, and you consent to the personal jurisdiction of such courts.
                        </p>
                        <p className="text-slate-700 leading-relaxed">
                            Any dispute arising from these Terms shall first be attempted to be resolved through informal 
                            negotiation. If the dispute cannot be resolved through negotiation, it shall be submitted to 
                            mediation in accordance with the laws of the Philippines.
                        </p>
                    </div>
                    
                    {/* Contact Section */}
                    <div className="bg-blue-50 rounded-lg shadow-md p-6 md:p-8 text-center">
                        <h2 className="text-xl font-bold text-blue-800 mb-4">Questions About Our Terms?</h2>
                        <p className="text-slate-700 mb-4">
                            If you have any questions, concerns, or suggestions regarding these Terms of Use, please contact our Legal Team at:
                        </p>
                        <a href="mailto:legal@hubisko.edu.ph" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-700 transition duration-300">
                            legal@hubisko.edu.ph
                        </a>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}