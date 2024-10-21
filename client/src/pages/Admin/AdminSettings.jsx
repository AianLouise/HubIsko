import React, { useState } from "react";
import { BsPencilFill } from "react-icons/bs";
import { FaCog } from "react-icons/fa"; // Import the icon
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

    const [selectedTab, setSelectedTab] = useState('Update Information');

    const handleTabClick = (tab) => setSelectedTab(tab);

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                        <FaCog className="mr-4 text-blue-600" /> {/* Add the icon */}
                        Settings
                    </h1>
                </div>
            </header>
            <main className="flex-grow">
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="px-4 py-6 sm:px-0">
                        <div className="bg-white shadow rounded-lg p-6">
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
                </div>
            </main>
        </div>
    );
}