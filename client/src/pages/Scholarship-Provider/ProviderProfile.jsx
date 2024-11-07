import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ScholarshipProviderDescription from '../../components/ProviderProfile/ScholarshipProviderDescription';
import ScholarshipProviderScholarships from '../../components/ProviderProfile/ScholarshipProviderScholarships';
import ScholarshipProviderPosts from '../../components/ProviderProfile/ScholarshipProviderPosts';
import ProviderHeaderSidebar from '../../components/ProviderHeaderAndSidebar';
import { useSelector } from 'react-redux';
import { FaBuilding, FaEnvelope, FaGlobe } from 'react-icons/fa';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const ProviderProfile = () => {
    const currentUser = useSelector((state) => state.user.currentUser);
    const navigate = useNavigate();
    const userId = currentUser ? currentUser._id : null;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const { id } = useParams(); // Extract user ID from URL
    const [user, setUser] = useState(null);
    const [selectedTab, setSelectedTab] = useState('Scholarships'); // Default tab

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`/api/providerAccount/user/${id}`);
                const data = await response.json();
                setUser(data);

                // Set default tab based on user role
                if (data.role === 'scholarship_provider') {
                    setSelectedTab('Scholarships');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUser();
    }, [id]);

    if (!user) {
        return (
            <div className="flex justify-center items-center h-screen">
                <svg className="animate-spin h-10 w-10 text-blue-600" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
            </div>
        );
    }

    const renderTabs = () => {
        return (
            <>
                <button onClick={() => setSelectedTab('Scholarships')} className={`border text-center rounded-xl lg:w-1/2 lg:px-16 py-4 ${selectedTab === 'Scholarships' ? 'bg-white shadow-md' : 'bg-slate-200 hover:bg-slate-300'}`}>Scholarships</button>
                <button onClick={() => setSelectedTab('Posts')} className={`border text-center rounded-xl lg:w-1/2 lg:px-16 py-4 ${selectedTab === 'Posts' ? 'bg-white shadow-md' : 'bg-slate-200 hover:bg-slate-300'}`}>Posts</button>
            </>
        );
    };

    const renderProfileContent = () => {
        if (user.role === 'scholarship_provider') {
            if (selectedTab === 'Scholarships') return <ScholarshipProviderScholarships userId={user._id} />;
            return <ScholarshipProviderPosts userId={user._id} />;
        }
        return <div>Unknown role</div>;
    };

    return (
        <div className='flex flex-col min-h-screen'>
            {(!currentUser || currentUser.role === 'applicant') && <Header />}
            <main className={`flex-grow bg-[#f8f8fb] ${currentUser && currentUser.role === 'scholarship_provider' ? `transition-all duration-200 ease-in-out ${sidebarOpen ? 'ml-64' : ''}` : 'no-scrollbar font-medium'}`}>
                {currentUser && currentUser.role === 'scholarship_provider' && <ProviderHeaderSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />}
                <div className='border-b mb-8 py-8'>
                    <div className='flex flex-row items-center mx-auto max-w-6xl gap-4 lg:gap-10 px-4 lg:px-24'>
                        <img
                            src={user.profilePicture}
                            alt={`${user.username}'s profile`}
                            className='w-36 h-36 my-8 rounded-md object-cover'
                        />
                        <div className='flex flex-col items-start gap-2 lg:w-1/2 '>
                            <span className='text-xl font-medium text-gray-600'>
                                Organization
                            </span>
                            <span className='text-3xl font-bold text-gray-800'>
                                {user.scholarshipProviderDetails?.organizationName || 'N/A'}
                            </span>
                            {user.role === 'scholarship_provider' && (
                                <>
                                    <div className='flex items-center text-lg text-gray-600'>
                                        <FaBuilding className='mr-2' />
                                        {user.scholarshipProviderDetails.organizationType}
                                    </div>
                                    {user.scholarshipProviderDetails.email && (
                                        <div className='flex items-center text-lg text-gray-600'>
                                            <FaEnvelope className='mr-2' />
                                            {user.scholarshipProviderDetails.email}
                                        </div>
                                    )}
                                    {user.scholarshipProviderDetails.website && (
                                        <div className='flex items-center text-lg text-gray-600'>
                                            <FaGlobe className='mr-2' />
                                            {user.scholarshipProviderDetails.website}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className='flex flex-col gap-4 max-w-6xl lg:px-24 mx-auto px-2'>
                    <div className='grid grid-cols-2 lg:grid-cols-3 lg:flex lg:flex-row gap-4 justify-between font-semibold mb-6'>
                        {renderTabs()}
                    </div>

                    <div>
                        {renderProfileContent()}
                    </div>
                </div>
            </main>
            {currentUser && currentUser.role === 'applicant' && <Footer />}
        </div>
    );
};

export default ProviderProfile;