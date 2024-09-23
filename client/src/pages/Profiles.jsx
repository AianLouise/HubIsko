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

const Profiles = () => {
    const currentUser = useSelector((state) => state.user.currentUser);

    const navigate = useNavigate();
    const userId = currentUser._id;

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    const { id } = useParams(); // Extract user ID from URL
    const [user, setUser] = useState(null);
    const [selectedTab, setSelectedTab] = useState(''); // Default tab

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`/api/profile/user/${id}`);
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
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUser();
    }, [id]);

    if (!user) {
        return <div>Loading...</div>;
    }

    const renderTabs = () => {
        switch (user.role) {
            case 'applicant':
                return (
                    <>
                        <button onClick={() => setSelectedTab('Posts')} className={`border text-center rounded-xl lg:w-1/2 lg:px-16 py-4 ${selectedTab === 'Posts' ? 'bg-white shadow-md' : 'bg-slate-200 hover:bg-slate-300'}`}>Posts</button>
                    </>
                );
            case 'scholarship_provider':
                return (
                    <>
                        <button onClick={() => setSelectedTab('Scholarships')} className={`border text-center rounded-xl lg:w-1/2 lg:px-16 py-4 ${selectedTab === 'Scholarships' ? 'bg-white shadow-md' : 'bg-slate-200 hover:bg-slate-300'}`}>Scholarships</button>
                        <button onClick={() => setSelectedTab('Posts')} className={`border text-center rounded-xl lg:w-1/2 lg:px-16 py-4 ${selectedTab === 'Posts' ? 'bg-white shadow-md' : 'bg-slate-200 hover:bg-slate-300'}`}>Posts</button>
                    </>
                );
            case 'admin':
                return (
                    <>
                        <button onClick={() => setSelectedTab('About')} className={`border text-center rounded-xl lg:w-1/2 lg:px-16 py-4 ${selectedTab === 'About' ? 'bg-white shadow-md' : 'bg-slate-200 hover:bg-slate-300'}`}>About</button>
                        <button onClick={() => setSelectedTab('Posts')} className={`border text-center rounded-xl lg:w-1/2 lg:px-16 py-4 ${selectedTab === 'Posts' ? 'bg-white shadow-md' : 'bg-slate-200 hover:bg-slate-300'}`}>Posts</button>
                    </>
                );
            default:
                return null;
        }
    };

    const renderProfileContent = () => {
        switch (user.role) {
            case 'applicant':
                return selectedTab === 'Posts' ? <ApplicantPosts user={user} /> : <ApplicantPosts userId={user._id} />;
            case 'scholarship_provider':
                if (selectedTab === 'Scholarships') return <ScholarshipProviderScholarships userId={user._id} />;
                return <ScholarshipProviderPosts userId={user._id} />;
            case 'admin':
                return selectedTab === 'About' ? <AdminAbout user={user} /> : <AdminPosts userId={user._id} />;
            default:
                return <div>Unknown role</div>;
        }
    };

    return (
        <div className='flex flex-col min-h-screen'>
            {currentUser && currentUser.role === 'applicant' && <Header />}
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
                                {user.role === 'scholarship_provider' ? 'Organization' : user.role === 'applicant' ? 'Student' : user.role === 'admin' ? 'Admin' : user.role}
                            </span>
                            <span className='text-3xl font-bold text-gray-800'>
                                {user.role === 'scholarship_provider' ? user.scholarshipProviderDetails.organizationName : user.username}
                            </span>
                        </div>
                    </div>
                </div>

                <div className='flex flex-col gap-4 max-w-6xl lg:px-24 mx-auto px-2'>
                    <div className='grid grid-cols-3 lg:flex lg:flex-row gap-4 justify-between font-semibold mb-6'>
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

export default Profiles;