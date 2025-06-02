import React, { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import logo from '../assets/NewLogo.png';
import useTokenExpiry from '../hooks/useTokenExpiry';
import { FaShieldAlt, FaUserLock, FaDatabase, FaCookieBite, FaGlobe } from 'react-icons/fa';

export default function PrivacyPolicy() {
  useTokenExpiry();
  
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Privacy Policy | HubIsko";
  }, []);
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow py-8 md:py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-md p-6 md:p-8 mb-8 text-white text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-white p-4 rounded-full">
                <img src={logo} alt="HubIsko Logo" className="w-16 h-16" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Privacy Policy</h1>
            <p className="text-blue-100">Last Updated: June 1, 2025</p>
          </div>
          
          {/* Introduction */}
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-bold text-blue-800 mb-4">Our Commitment to Privacy</h2>
            <p className="text-slate-700 mb-4 leading-relaxed">
              At HubIsko, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, 
              and safeguard your information when you use our scholarship management platform. We are committed to 
              ensuring the protection of your personal data and being transparent about how we use it.
            </p>
            <p className="text-slate-700 mb-4 leading-relaxed">
              By accessing our services, you agree to the terms outlined in this policy. We encourage you to read it 
              carefully to understand our practices regarding your personal information and how we will treat it.
            </p>
          </div>
          
          {/* Information We Collect */}
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-8">
            <div className="flex items-center mb-4">
              <FaUserLock className="text-blue-600 text-xl mr-3" />
              <h2 className="text-2xl font-bold text-blue-800">Information We Collect</h2>
            </div>
            <div className="pl-8 border-l-2 border-blue-100">
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Personal Information</h3>
              <p className="text-slate-700 mb-4 leading-relaxed">
                We collect personal information that you provide directly to us, including:
              </p>
              <ul className="list-disc list-inside text-slate-700 mb-4 space-y-1">
                <li>Contact information (name, email address, phone number, mailing address)</li>
                <li>Account credentials (username, password)</li>
                <li>Profile information (educational background, career goals, areas of interest)</li>
                <li>Application data (documents, essays, recommendations, transcripts)</li>
                <li>Financial information when necessary for scholarship applications</li>
                <li>Communication preferences and history of interactions with our platform</li>
              </ul>
              
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Automatically Collected Information</h3>
              <p className="text-slate-700 mb-4 leading-relaxed">
                When you access our platform, we may automatically collect certain information, including:
              </p>
              <ul className="list-disc list-inside text-slate-700 mb-4 space-y-1">
                <li>Device information (hardware model, operating system, unique device identifiers)</li>
                <li>Log information (access times, pages viewed, IP address)</li>
                <li>Location information when you enable location services</li>
                <li>Usage patterns and preferences</li>
              </ul>
            </div>
          </div>
          
          {/* How We Use Your Information */}
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-8">
            <div className="flex items-center mb-4">
              <FaDatabase className="text-blue-600 text-xl mr-3" />
              <h2 className="text-2xl font-bold text-blue-800">How We Use Your Information</h2>
            </div>
            <p className="text-slate-700 mb-4 leading-relaxed">
              We use the information we collect for various purposes, including:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-slate-800 mb-2">Service Provision</h3>
                <p className="text-sm text-slate-700">
                  To operate, maintain, and provide the features and functionality of our scholarship platform, including processing applications and matching you with appropriate opportunities.
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-slate-800 mb-2">Communication</h3>
                <p className="text-sm text-slate-700">
                  To communicate with you about your account, respond to inquiries, send notifications about new scholarships, and provide important updates about our services.
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-slate-800 mb-2">Personalization</h3>
                <p className="text-sm text-slate-700">
                  To personalize your experience, recommend scholarships that match your profile, and tailor content to your interests and needs.
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-slate-800 mb-2">Improvement</h3>
                <p className="text-sm text-slate-700">
                  To analyze usage patterns, conduct research, and gather feedback to improve our platform's functionality, user experience, and educational resources.
                </p>
              </div>
            </div>
          </div>
          
          {/* Data Sharing and Security */}
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-8">
            <div className="flex items-center mb-4">
              <FaShieldAlt className="text-blue-600 text-xl mr-3" />
              <h2 className="text-2xl font-bold text-blue-800">Data Sharing and Security</h2>
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Information Sharing</h3>
            <p className="text-slate-700 mb-4 leading-relaxed">
              We do not sell your personal information. We may share your information in the following circumstances:
            </p>
            <ul className="list-disc list-inside text-slate-700 mb-6 space-y-2">
              <li>With scholarship providers when you apply for their opportunities (with your consent)</li>
              <li>With service providers who help us operate our platform (under strict confidentiality agreements)</li>
              <li>To comply with legal obligations, enforce our terms, or protect our rights</li>
              <li>In connection with a merger, acquisition, or sale of assets (with appropriate safeguards)</li>
            </ul>
            
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Data Security</h3>
            <p className="text-slate-700 mb-4 leading-relaxed">
              We implement appropriate technical and organizational measures to protect your personal information from unauthorized access, disclosure, alteration, and destruction. These measures include encryption, secure server infrastructure, and regular security assessments.
            </p>
          </div>
          
          {/* Your Choices and Rights */}
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-8">
            <div className="flex items-center mb-4">
              <FaGlobe className="text-blue-600 text-xl mr-3" />
              <h2 className="text-2xl font-bold text-blue-800">Your Choices and Rights</h2>
            </div>
            <p className="text-slate-700 mb-4 leading-relaxed">
              Depending on your location, you may have certain rights regarding your personal information:
            </p>
            <ul className="list-disc list-inside text-slate-700 mb-4 space-y-2">
              <li><span className="font-medium">Access:</span> You can request a copy of the personal information we hold about you</li>
              <li><span className="font-medium">Correction:</span> You can ask us to update or correct inaccurate information</li>
              <li><span className="font-medium">Deletion:</span> You can request that we delete your personal information</li>
              <li><span className="font-medium">Restriction:</span> You can ask us to limit how we use your information</li>
              <li><span className="font-medium">Portability:</span> You can request a machine-readable copy of certain information</li>
              <li><span className="font-medium">Objection:</span> You can object to our processing of your information in certain circumstances</li>
            </ul>
            <p className="text-slate-700 leading-relaxed">
              To exercise these rights, please contact us at <a href="mailto:privacy@hubisko.edu.ph" className="text-blue-600 hover:underline">privacy@hubisko.edu.ph</a>.
            </p>
          </div>
          
          {/* Cookies and Policy Updates */}
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-8">
            <div className="flex items-center mb-4">
              <FaCookieBite className="text-blue-600 text-xl mr-3" />
              <h2 className="text-2xl font-bold text-blue-800">Cookies and Policy Updates</h2>
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Cookies</h3>
            <p className="text-slate-700 mb-4 leading-relaxed">
              We use cookies and similar tracking technologies to enhance your experience, analyze usage, and assist in our marketing efforts. You can control cookies through your browser settings, although disabling certain cookies may limit your ability to use some features of our platform.
            </p>
            
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Policy Updates</h3>
            <p className="text-slate-700 mb-4 leading-relaxed">
              We may update this Privacy Policy from time to time to reflect changes in our practices or for legal, operational, or regulatory reasons. We will notify you of any material changes by posting the updated policy on our platform with a new "Last Updated" date. Your continued use of our services after such updates constitutes your acceptance of the revised policy.
            </p>
          </div>
          
          {/* Contact Section */}
          <div className="bg-blue-50 rounded-lg shadow-md p-6 md:p-8 text-center">
            <h2 className="text-xl font-bold text-blue-800 mb-4">Questions About Our Privacy Practices?</h2>
            <p className="text-slate-700 mb-4">
              If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact our Privacy Team at:
            </p>
            <a href="mailto:privacy@hubisko.edu.ph" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-700 transition duration-300">
              privacy@hubisko.edu.ph
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}