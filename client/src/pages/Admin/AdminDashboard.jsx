import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { BsPersonFill, BsInboxFill } from "react-icons/bs";
import { GiGraduateCap } from "react-icons/gi";
import { IoMdChatboxes } from "react-icons/io";
import { FaInbox, FaClock, FaUserShield, FaRegBell, FaChartLine, FaCalendarAlt, FaFilter } from "react-icons/fa";
import { IoMdArrowRoundForward } from "react-icons/io";
import { FiMenu } from "react-icons/fi";

export default function AdminDashboard() {
    useEffect(() => {
        document.title = "Admin Dashboard | HubIsko";
    }, []);

    const navigate = useNavigate();
    const { currentUser } = useSelector((state) => state.user);

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [totalAccounts, setTotalAccounts] = useState(0);
    const [totalScholarships, setTotalScholarships] = useState(0);
    const [totalScholars, setTotalScholars] = useState(0);
    const [pendingProviders, setPendingProviders] = useState(0);
    const [pendingStudents, setPendingStudents] = useState(0);
    const [pendingPrograms, setPendingPrograms] = useState(0);
    const [forumPost, setForumPost] = useState(0);
    const [applicationInbox, setApplicationInbox] = useState(0);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [showActivityMenu, setShowActivityMenu] = useState(false);
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const toggleActivityMenu = () => {
        setShowActivityMenu(!showActivityMenu);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch total number of accounts
                const accountsResponse = await fetch(`${apiUrl}/api/admin/total-accounts`);
                const accountsData = await accountsResponse.json();
                setTotalAccounts(accountsData.totalAccounts);

                // Fetch total number of scholarships
                const scholarshipsResponse = await fetch(`${apiUrl}/api/admin/total-scholarships`);
                const scholarshipsData = await scholarshipsResponse.json();
                setTotalScholarships(scholarshipsData.totalScholarships);

                // Fetch total number of pending providers
                const pendingProvidersResponse = await fetch(`${apiUrl}/api/adminApp/search-pending-verification-providers`);
                const pendingProvidersData = await pendingProvidersResponse.json();
                setPendingProviders(pendingProvidersData.length);

                const pendingStudentsResponse = await fetch(`${apiUrl}/api/adminApp/search-pending-verification-students`);
                const pendingStudentsData = await pendingStudentsResponse.json();
                setPendingStudents(pendingStudentsData.length);

                console.log('Pending Students and Providers:', pendingStudentsData.length, pendingProvidersData.length);

                const forumPostResponse = await fetch(`${apiUrl}/api/adminForums/forum-posts`);
                const forumPostData = await forumPostResponse.json();
                setForumPost(forumPostData.length);

                try {
                    const ApplicationInboxResponse = await fetch(`${apiUrl}/api/adminApp/users/pending-verification`);
                    if (!ApplicationInboxResponse.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const ApplicationInboxData = await ApplicationInboxResponse.json();

                    const userCount = typeof ApplicationInboxData.userCount === 'number' ? ApplicationInboxData.userCount : 0;
                    const scholarshipProgramCount = typeof ApplicationInboxData.scholarshipProgramCount === 'number' ? ApplicationInboxData.scholarshipProgramCount : 0;

                    const totalPendingVerifications = userCount + scholarshipProgramCount;
                    setApplicationInbox(totalPendingVerifications);
                } catch (error) {
                    console.error('Error fetching pending verifications:', error);
                    setApplicationInbox(0); // Set to 0 in case of an error
                }

                // Dummy data for activities
                setActivities([
                    { id: 1, actor: "DepEd", action: "Posted a Scholarship", time: "1 hour ago", icon: "scholarship", color: "bg-indigo-500" },
                    { id: 2, actor: "John Doe", action: "Sent an Application to DepEd", time: "2 hours ago", icon: "application", color: "bg-blue-500" },
                    { id: 3, actor: "TESDA", action: "Approved an Application", time: "3 hours ago", icon: "approved", color: "bg-green-500" },
                    { id: 4, actor: "CHED", action: "Posted a Scholarship", time: "4 hours ago", icon: "scholarship", color: "bg-indigo-500" },
                ]);

                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();

        const intervalId = setInterval(() => {
            setCurrentDate(new Date());
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="text-center">
                    <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    <p className="text-blue-800 font-medium">Loading dashboard data...</p>
                </div>
            </div>
        );
    }

    const formattedDate = currentDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const formattedTime = currentDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const handleViewClick = (e) => {
        e.stopPropagation(); // Prevent the outer link from being triggered
        navigate('/application-inbox');
    };

    // Helper function to get activity icon
    const getActivityIcon = (type) => {
        switch (type) {
            case 'scholarship':
                return <GiGraduateCap className="text-white" />;
            case 'application':
                return <BsInboxFill className="text-white" />;
            case 'approved':
                return <FaUserShield className="text-white" />;
            default:
                return <FaRegBell className="text-white" />;
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50">
            <main className="flex-grow font-medium text-slate-700">
                {/* Header Banner */}
                <div className="bg-gradient-to-r from-blue-700 to-blue-500 shadow-md">
                    <div className="container mx-auto px-4 lg:px-24 py-8">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            {/* Profile Info */}
                            <div className="flex items-center gap-6">
                                <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center border-4 border-blue-400 shadow-lg overflow-hidden">
                                    <img
                                        src={currentUser ? currentUser.profilePicture : 'defaultProfilePicture.jpg'}
                                        alt="Admin Profile"
                                        className="w-20 h-20 object-cover"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <h1 className="text-2xl font-bold text-white">Welcome, {currentUser.adminDetails.firstName}!</h1>
                                    <p className="text-blue-100 font-medium">Admin Dashboard | HubIsko Management</p>
                                </div>
                            </div>

                            {/* Current Date/Time Card */}
                            <div className="flex items-center gap-3 px-6 py-3 bg-white rounded-lg shadow-md text-blue-600 font-medium border-l-4 border-blue-600 w-full md:w-auto">
                                <FaClock className="w-5 h-5 text-blue-600" />
                                <div>
                                    <p className="text-sm text-gray-500">{formattedDate}</p>
                                    <p className="text-lg font-semibold">{formattedTime}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="container mx-auto px-4 lg:px-24 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Account Stats Card */}
                        <Link to={'/accounts'} className="group bg-white rounded-xl shadow-md hover:shadow-lg overflow-hidden transition-all duration-300 hover:-translate-y-1 border border-gray-100">
                            <div className="p-5">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-bold text-gray-700">Accounts</h2>
                                    <div className="p-3 rounded-lg bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                        <BsPersonFill className="w-6 h-6" />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-4xl font-bold text-blue-600 group-hover:text-blue-700 transition-all">{totalAccounts}</span>                                    
                                    <div className="flex items-center justify-between mt-2">
                                        <div className="flex items-center text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-sm">
                                            <span className="font-medium">{pendingProviders + pendingStudents} pending verification</span>
                                        </div>
                                        <div className="hidden group-hover:flex items-center text-blue-600 gap-1">
                                            <span className="text-sm font-medium">View</span>
                                            <IoMdArrowRoundForward className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>

                        {/* Scholarships Stats Card */}
                        <Link to={'/scholarship-programs'} className="group bg-white rounded-xl shadow-md hover:shadow-lg overflow-hidden transition-all duration-300 hover:-translate-y-1 border border-gray-100">
                            <div className="p-5">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-bold text-gray-700">Scholarships</h2>
                                    <div className="p-3 rounded-lg bg-indigo-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                                        <GiGraduateCap className="w-6 h-6" />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-4xl font-bold text-indigo-600 group-hover:text-indigo-700 transition-all">{totalScholarships}</span>                                    
                                    <div className="flex items-center justify-between mt-2">
                                        <div className="flex items-center text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full text-sm">
                                            <span className="font-medium">0 pending programs</span>
                                        </div>
                                        <div className="hidden group-hover:flex items-center text-indigo-600 gap-1">
                                            <span className="text-sm font-medium">View</span>
                                            <IoMdArrowRoundForward className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>

                        {/* Forum Posts Stats Card */}
                        <Link to={'/admin-forums'} className="group bg-white rounded-xl shadow-md hover:shadow-lg overflow-hidden transition-all duration-300 hover:-translate-y-1 border border-gray-100">
                            <div className="p-5">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-bold text-gray-700">Forum Posts</h2>
                                    <div className="p-3 rounded-lg bg-green-100 text-green-600 group-hover:bg-green-600 group-hover:text-white transition-all duration-300">
                                        <IoMdChatboxes className="w-6 h-6" />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-4xl font-bold text-green-600 group-hover:text-green-700 transition-all">{forumPost}</span>                                    
                                    <div className="flex items-center justify-between mt-2">
                                        <div className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm">
                                            <span className="font-medium">0 new posts</span>
                                        </div>
                                        <div className="hidden group-hover:flex items-center text-green-600 gap-1">
                                            <span className="text-sm font-medium">View</span>
                                            <IoMdArrowRoundForward className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>

                        {/* Inbox Stats Card */}
                        <Link to={'/application-inbox'} className="group bg-white rounded-xl shadow-md hover:shadow-lg overflow-hidden transition-all duration-300 hover:-translate-y-1 border border-gray-100">
                            <div className="p-5">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-bold text-gray-700">Inbox</h2>
                                    <div className="p-3 rounded-lg bg-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                                        <FaInbox className="w-6 h-6" />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-4xl font-bold text-purple-600 group-hover:text-purple-700 transition-all">{applicationInbox}</span>                                    
                                    <div className="flex items-center justify-between mt-2">
                                        <div className="flex items-center text-purple-600 bg-purple-50 px-3 py-1 rounded-full text-sm">
                                            <span className="font-medium">0 new notifications</span>
                                        </div>
                                        <div className="hidden group-hover:flex items-center text-purple-600 gap-1">
                                            <span className="text-sm font-medium">View</span>
                                            <IoMdArrowRoundForward className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Analytics Overview */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
                        {/* Quick Stats Cards */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                                <div className="flex items-center justify-between px-6 py-4 border-b">
                                    <h2 className="text-xl font-bold text-gray-700 flex items-center gap-2">
                                        <FaChartLine className="text-blue-600" />
                                        Statistics Overview
                                    </h2>
                                    <div className="flex items-center gap-2">
                                        <div className="text-sm text-gray-500 flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                                            <FaCalendarAlt className="text-blue-600" />
                                            <span>This Week</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="px-6 py-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Pending Verification Card */}
                                        <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
                                            <div className="flex justify-between items-center">
                                                <p className="text-gray-600 font-medium">Pending Verifications</p>
                                                <span className="text-yellow-600 bg-yellow-200 px-3 py-1 rounded-full text-sm font-bold">
                                                    {pendingProviders + pendingStudents}
                                                </span>
                                            </div>
                                            <div className="mt-4 space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                                        <span className="text-sm text-gray-600">Providers</span>
                                                    </div>
                                                    <span className="text-sm font-semibold">{pendingProviders}</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                                        <span className="text-sm text-gray-600">Students</span>
                                                    </div>
                                                    <span className="text-sm font-semibold">{pendingStudents}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Scholarship Programs Card */}
                                        <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4">
                                            <div className="flex justify-between items-center">
                                                <p className="text-gray-600 font-medium">Scholarship Programs</p>
                                                <span className="text-indigo-600 bg-indigo-200 px-3 py-1 rounded-full text-sm font-bold">
                                                    {totalScholarships}
                                                </span>
                                            </div>
                                            <div className="mt-4 space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                                                        <span className="text-sm text-gray-600">Active</span>
                                                    </div>
                                                    <span className="text-sm font-semibold">{Math.round(totalScholarships * 0.6)}</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                                                        <span className="text-sm text-gray-600">Pending</span>
                                                    </div>
                                                    <span className="text-sm font-semibold">{Math.round(totalScholarships * 0.4)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="flex items-center justify-between px-6 py-4 border-b">
                                <h2 className="text-xl font-bold text-gray-700 flex items-center gap-2">
                                    <FaRegBell className="text-blue-600" />
                                    Recent Activity
                                </h2>
                                <button
                                    className="text-gray-500 hover:text-blue-600 transition-colors"
                                    onClick={toggleActivityMenu}
                                >
                                    <FaFilter />
                                </button>
                            </div>
                            <div className="px-4 py-2">
                                {activities.length === 0 ? (
                                    <div className="text-center py-6">
                                        <p className="text-gray-500">No recent activities</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4 py-2">
                                        {activities.map((activity) => (
                                            <div key={activity.id} className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                                <div className={`w-10 h-10 rounded-full ${activity.color} flex items-center justify-center flex-shrink-0`}>
                                                    {getActivityIcon(activity.icon)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-gray-800">{activity.actor}</p>
                                                    <p className="text-xs text-gray-500">{activity.action}</p>
                                                    <p className="text-xs text-blue-600 mt-1">{activity.time}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <div className="text-center py-2 border-t">
                                    <Link to="/log-history" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                                        View All Activity
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl shadow-md p-4 hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer">
                            <Link to="/application-inbox" className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold">Verification Inbox</h3>
                                    <p className="text-blue-100 text-sm">Manage pending verifications</p>
                                </div>
                                <div className="w-10 h-10 bg-blue-800 rounded-full flex items-center justify-center">
                                    <BsInboxFill className="w-5 h-5" />
                                </div>
                            </Link>
                        </div>

                        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl shadow-md p-4 hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer">
                            <Link to="/admin-forums" className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold">Forum Management</h3>
                                    <p className="text-indigo-100 text-sm">Moderate forum discussions</p>
                                </div>
                                <div className="w-10 h-10 bg-indigo-800 rounded-full flex items-center justify-center">
                                    <IoMdChatboxes className="w-5 h-5" />
                                </div>
                            </Link>
                        </div>

                        <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl shadow-md p-4 hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer">
                            <Link to="/accounts" className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold">User Accounts</h3>
                                    <p className="text-purple-100 text-sm">Manage user accounts</p>
                                </div>
                                <div className="w-10 h-10 bg-purple-800 rounded-full flex items-center justify-center">
                                    <BsPersonFill className="w-5 h-5" />
                                </div>
                            </Link>
                        </div>

                        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl shadow-md p-4 hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer">
                            <Link to="/admin-reports" className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold">Generate Reports</h3>
                                    <p className="text-green-100 text-sm">Create system reports</p>
                                </div>
                                <div className="w-10 h-10 bg-green-800 rounded-full flex items-center justify-center">
                                    <FaChartLine className="w-5 h-5" />
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}