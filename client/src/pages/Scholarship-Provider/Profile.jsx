import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ScholarshipProviderDescription from '../../components/ProviderProfile/ScholarshipProviderDescription';
import ScholarshipProviderScholarships from '../../components/ProviderProfile/ScholarshipProviderScholarships';
import ScholarshipProviderPosts from '../../components/ProviderProfile/ScholarshipProviderPosts';
import ProviderHeaderSidebar from '../../components/ProviderHeaderAndSidebar';
import { useSelector } from 'react-redux';

export default function ProviderProfile() {
    const navigate = useNavigate();
    const { currentUser } = useSelector((state) => state.user);
    const userId = currentUser._id;

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    useEffect(() => {
        if (currentUser) {
            if (currentUser.role !== 'scholarship_provider') {
                navigate('/'); // Redirect to home if not a scholarship provider
            }
        }
    }, [currentUser, navigate]);

    const [user, setUser] = useState(null);
    const [selectedTab, setSelectedTab] = useState('Scholarships'); // Default tab

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`/api/providerAccount/user/${userId}`);
                const data = await response.json();
                setUser(data);

                // Remove this line to keep the default tab as 'Scholarships'
                // if (data.role === 'scholarship_provider') {
                //     setSelectedTab('Description');
                // }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUser();
    }, [userId]);

    if (!user) {
        return <div>Loading...</div>;
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
            <main className={`flex-grow bg-[#f8f8fb] transition-all duration-200 ease-in-out ${sidebarOpen ? 'ml-64' : ''} `}>
                <ProviderHeaderSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
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
                            {/* <span className='text-xl font-medium text-gray-600'>Followers: {user.followers}</span> */}
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
        </div>
    );
}