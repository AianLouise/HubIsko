import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ApplicantProfile from '../components/Profiles/ApplicantProfile';
import ApplicantPosts from '../components/Profiles/ApplicantPosts';
import ScholarshipProviderDescription from '../components/Profiles/ScholarshipProviderDescription';
import ScholarshipProviderScholarships from '../components/Profiles/ScholarshipProviderScholarships';
import ScholarshipProviderPosts from '../components/Profiles/ScholarshipProviderPosts';
import AdminAbout from '../components/Profiles/AdminAbout';
import AdminPosts from '../components/Profiles/AdminPosts';

import Header from '../components/Header';
import Footer from '../components/Footer';
import { useSelector } from 'react-redux';
import ProviderHeaderSidebar from '../components/ProviderHeaderAndSidebar';
import { FaBuilding, FaEnvelope, FaGlobe, FaUser, FaGraduationCap, FaUserShield } from 'react-icons/fa';

const Profiles = () => {
    const currentUser = useSelector((state) => state.user.currentUser);
    const navigate = useNavigate();
    const userId = currentUser ? currentUser._id : null;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [selectedTab, setSelectedTab] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true);
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
                const response = await fetch(`${apiUrl}/api/profile/user/${id}`);
                const data = await response.json();
                setUser(data);

                // Set default tab based on user role
                switch (data.role) {
                    case 'applicant':
                        setSelectedTab('Posts');
                        break;
                    case 'scholarship_provider':
                        setSelectedTab('Scholarships');
                        break;
                    case 'admin':
                        setSelectedTab('About');
                        break;
                    default:
                        setSelectedTab('Posts');
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user data:', error);
                setLoading(false);
            }
        };

        fetchUser();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="text-center">
                    <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    <p className="text-gray-600 font-medium">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="text-center p-8 bg-white rounded-xl shadow-lg">
                    <div className="text-red-500 text-5xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Profile Not Found</h2>
                    <p className="text-gray-600 mb-6">The requested profile could not be loaded</p>
                    <button 
                        onClick={() => navigate('/')}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                    >
                        Return Home
                    </button>
                </div>
            </div>
        );
    }

    const getRoleIcon = () => {
        switch (user.role) {
            case 'applicant': 
                return <FaGraduationCap className="h-6 w-6 text-blue-600" />;
            case 'scholarship_provider':
                return <FaBuilding className="h-6 w-6 text-emerald-600" />;
            case 'admin':
                return <FaUserShield className="h-6 w-6 text-purple-600" />;
            default:
                return <FaUser className="h-6 w-6 text-gray-600" />;
        }
    };

    const getRoleLabel = () => {
        switch (user.role) {
            case 'applicant': return 'Student';
            case 'scholarship_provider': return 'Organization';
            case 'admin': return 'Admin';
            default: return user.role;
        }
    };

    const getRoleBadgeColor = () => {
        switch (user.role) {
            case 'applicant': return 'bg-blue-100 text-blue-800';
            case 'scholarship_provider': return 'bg-emerald-100 text-emerald-800';
            case 'admin': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getUserName = () => {
        if (user.role === 'scholarship_provider') {
            return user.scholarshipProviderDetails.organizationName;
        } else if (user.role === 'admin') {
            return user.username;
        } else {
            return `${user.applicantDetails.firstName} ${user.applicantDetails.lastName}`;
        }
    };

    const renderTabs = () => {
        const baseTabClasses = "font-medium transition-all duration-200 flex items-center justify-center py-3 px-6 rounded-lg";
        const activeTabClasses = "bg-white shadow-md border-b-2 border-blue-600 text-blue-700";
        const inactiveTabClasses = "bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900";
        
        switch (user.role) {
            case 'applicant':
                return (
                    <div className="w-full flex justify-center">
                        <button 
                            onClick={() => setSelectedTab('Posts')} 
                            className={`${baseTabClasses} ${selectedTab === 'Posts' ? activeTabClasses : inactiveTabClasses} w-full sm:w-auto`}
                        >
                            Posts
                        </button>
                    </div>
                );
            case 'scholarship_provider':
                return (
                    <div className="w-full flex flex-wrap sm:flex-nowrap gap-2 justify-center">
                        <button 
                            onClick={() => setSelectedTab('Scholarships')} 
                            className={`${baseTabClasses} ${selectedTab === 'Scholarships' ? activeTabClasses : inactiveTabClasses} w-full sm:w-auto`}
                        >
                            Scholarships
                        </button>
                        <button 
                            onClick={() => setSelectedTab('Posts')} 
                            className={`${baseTabClasses} ${selectedTab === 'Posts' ? activeTabClasses : inactiveTabClasses} w-full sm:w-auto`}
                        >
                            Posts
                        </button>
                    </div>
                );
            case 'admin':
                return (
                    <div className="w-full flex flex-wrap sm:flex-nowrap gap-2 justify-center">
                        <button 
                            onClick={() => setSelectedTab('About')} 
                            className={`${baseTabClasses} ${selectedTab === 'About' ? activeTabClasses : inactiveTabClasses} w-full sm:w-auto`}
                        >
                            About
                        </button>
                        <button 
                            onClick={() => setSelectedTab('Posts')} 
                            className={`${baseTabClasses} ${selectedTab === 'Posts' ? activeTabClasses : inactiveTabClasses} w-full sm:w-auto`}
                        >
                            Posts
                        </button>
                    </div>
                );
            default:
                return null;
        }
    };

    const renderProfileContent = () => {
        switch (user.role) {
            case 'applicant':
                return selectedTab === 'Posts' ? <ApplicantPosts userId={user._id} /> : <ApplicantPosts userId={user._id} />;
            case 'scholarship_provider':
                if (selectedTab === 'Scholarships') return <ScholarshipProviderScholarships userId={user._id} />;
                return <ScholarshipProviderPosts userId={user._id} />;
            case 'admin':
                return selectedTab === 'About' ? <AdminAbout userId={user._id} /> : <AdminPosts userId={user._id} />;
            default:
                return <div className="p-6 bg-white rounded-lg shadow text-center">Unknown role</div>;
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50">
            {(!currentUser || currentUser.role === 'applicant') && <Header />}
            <main className={`flex-grow ${currentUser && currentUser.role === 'scholarship_provider' ? `transition-all duration-200 ease-in-out ${sidebarOpen ? 'ml-64' : ''}` : ''}`}>
                {currentUser && currentUser.role === 'scholarship_provider' && <ProviderHeaderSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />}
                
                {/* Profile Header Card */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-32 sm:h-48"></div>
                        <div className="px-4 sm:px-8 pb-8 -mt-16 relative">
                            <div className="flex flex-col sm:flex-row gap-6 sm:items-end">
                                {/* Profile Image */}
                                <div className="relative">
                                    <img
                                        src={user.profilePicture}
                                        alt={`${getUserName()}'s profile`}
                                        className="w-32 h-32 rounded-xl object-cover border-4 border-white shadow-lg"
                                    />
                                    <div className="absolute bottom-0 right-0 rounded-full p-2 bg-white shadow-md">
                                        {getRoleIcon()}
                                    </div>
                                </div>
                                
                                {/* Profile Info */}
                                <div className="flex flex-col items-start gap-2 flex-grow mt-4 sm:mt-0">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleBadgeColor()}`}>
                                            {getRoleLabel()}
                                        </span>
                                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                                            {getUserName()}
                                        </h1>
                                    </div>
                                    
                                    {/* Organization Details */}
                                    {user.role === 'scholarship_provider' && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                                            <div className="flex items-center text-gray-600">
                                                <FaBuilding className="mr-2 text-emerald-600" />
                                                <span>{user.scholarshipProviderDetails.organizationType}</span>
                                            </div>
                                            {user.scholarshipProviderDetails.email && (
                                                <div className="flex items-center text-gray-600">
                                                    <FaEnvelope className="mr-2 text-blue-600" />
                                                    <span className="truncate">{user.scholarshipProviderDetails.email}</span>
                                                </div>
                                            )}
                                            {user.scholarshipProviderDetails.website && (
                                                <div className="flex items-center text-gray-600 col-span-1 md:col-span-2">
                                                    <FaGlobe className="mr-2 text-indigo-600" />
                                                    <a 
                                                        href={user.scholarshipProviderDetails.website} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="truncate hover:text-blue-600 hover:underline"
                                                    >
                                                        {user.scholarshipProviderDetails.website}
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    
                                    {/* Admin Details */}
                                    {user.role === 'admin' && user.email && (
                                        <div className="flex items-center text-gray-600 mt-2">
                                            <FaEnvelope className="mr-2 text-purple-600" />
                                            <span>connectwithhubisko@gmail.com</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Tabs & Content Section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                    {/* Tabs */}
                    <div className="mb-8">
                        {renderTabs()}
                    </div>
                    
                    {/* Content */}
                    <div className="bg-white rounded-2xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
                        {renderProfileContent()}
                    </div>
                </div>
            </main>
            {(!currentUser || currentUser.role === 'applicant') && <Footer />}
        </div>
    );
};

export default Profiles;