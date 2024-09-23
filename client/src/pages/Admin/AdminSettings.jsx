import React, { useEffect, useState } from "react";
import { BsPencilFill } from "react-icons/bs";
import LogHistory from "../../components/AdminSettings/LogHistory";
import UpdateInformation from '../../components/AdminSettings/UpdateInformation';
import UpdateAccountDetails from '../../components/AdminSettings/UpdateAccountDetails';
import ChangePassword from '../../components/AdminSettings/ChangePassword';
import { updateUserDetails } from '../../redux/user/userSlice';
import { FaLock, FaUser } from "react-icons/fa6";
import { FaUserEdit } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";

export default function AdminSettings() {
    const { currentUser } = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const [activityLogs, setActivityLogs] = useState([]);

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedTab, setSelectedTab] = useState('Update Information');

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const handleTabClick = (tab) => setSelectedTab(tab);

    useEffect(() => {
        const fetchActivityLogs = async () => {
            try {
                const response = await fetch('/api/activity/activity-logs'); // Adjust the endpoint as necessary
                const data = await response.json();
                setActivityLogs(Array.isArray(data) ? data : []); // Ensure data is an array
            } catch (error) {
                console.error('Error fetching activity logs:', error);
            }
        };

        fetchActivityLogs();
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-grow bg-[#f8f8fb] font-medium text-slate-700">
                <div className="max-w-8xl flex flex-col gap-10 px-20 mt-10">
                    <div className="max-w-8xl mx-24 mt-12">
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

                    <LogHistory activityLogs={activityLogs} />
                </div>
            </main>
        </div>
    );
}
