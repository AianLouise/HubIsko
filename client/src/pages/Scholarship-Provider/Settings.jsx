import React, { useEffect, useState } from 'react';
import { FaUser, FaLock, FaUserEdit } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import ProviderHeaderSidebar from '../../components/ProviderHeaderAndSidebar';
import UpdateInformation from '../../components/ProviderSettings/UpdateInformation';
import UpdateAccountDetails from '../../components/ProviderSettings/UpdateAccountDetails';
import ChangePassword from '../../components/ProviderSettings/ChangePassword';
import { updateUserDetails } from '../../redux/user/userSlice';

export default function Settings() {
    useEffect(() => {
        document.title = "Settings | HubIsko";
      }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
    });

    const { currentUser } = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedTab, setSelectedTab] = useState('Update Information');

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const handleTabClick = (tab) => setSelectedTab(tab);

    return (
        <div className="flex flex-col min-h-screen">
            <main className={`flex-grow bg-[#f8f8fb] transition-all duration-200 ease-in-out ${sidebarOpen ? 'ml-64' : ''}`}>
                <ProviderHeaderSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} currentPath={`${currentUser.scholarshipProviderDetails.organizationName} / Settings`} />

                <div className="max-w-8xl mx-24 my-12">
                    <div className="bg-white border shadow rounded-md px-6 py-8">
                        <h1 className="text-4xl font-bold mb-4">Settings</h1>
                        <nav className="mb-8">
                            <ul className="flex items-center gap-8 font-medium border-b-2 border-gray-200">
                                <li>
                                    <button
                                        onClick={() => handleTabClick('Update Information')}
                                        className={`relative flex items-center py-3 px-4 group hover:text-blue-600 transition-colors duration-200 ease-in-out ${selectedTab === 'Update Information' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
                                    >
                                        <FaUser className="mr-2" />
                                        <span>Update Information</span>
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => handleTabClick('Update Account Details')}
                                        className={`relative flex items-center py-3 px-4 group hover:text-blue-600 transition-colors duration-200 ease-in-out ${selectedTab === 'Update Account Details' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
                                    >
                                        <FaUserEdit className="mr-2" />
                                        <span>Update Account Details</span>
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => handleTabClick('Change Password')}
                                        className={`relative flex items-center py-3 px-4 group hover:text-blue-600 transition-colors duration-200 ease-in-out ${selectedTab === 'Change Password' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
                                    >
                                        <FaLock className="mr-2" />
                                        <span>Change Password</span>
                                    </button>
                                </li>
                            </ul>
                        </nav>

                        {selectedTab === 'Update Information' && (
                            <UpdateInformation
                                currentUser={currentUser}
                                dispatch={dispatch}
                                updateUserDetails={updateUserDetails}
                            />
                        )}

                        {selectedTab === 'Update Account Details' && (
                            <UpdateAccountDetails
                                currentUser={currentUser}
                            />
                        )}

                        {selectedTab === 'Change Password' && (
                            <ChangePassword
                                currentUser={currentUser}
                            />
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}