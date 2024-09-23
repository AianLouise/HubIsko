import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { Link } from "react-router-dom";
import { BiDotsHorizontal } from "react-icons/bi";
import { BsInboxFill } from "react-icons/bs";
import { useSelector } from "react-redux";
import { BsPersonFill } from "react-icons/bs";
import { GiGraduateCap } from "react-icons/gi";
import { IoMdChatboxes } from "react-icons/io";
import { FaInbox } from "react-icons/fa";
import { FaClock } from "react-icons/fa6";
import { IoMdArrowRoundForward } from "react-icons/io";


export default function AdminDashboard() {
    useEffect(() => {
        document.title = "Admin Dashboard | HubIsko";
    }, []);

    const { currentUser } = useSelector((state) => state.user);

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [totalAccounts, setTotalAccounts] = useState(0);
    const [totalScholarships, setTotalScholarships] = useState(0);
    const [totalScholars, setTotalScholars] = useState(0);
    const [pendingProviders, setPendingProviders] = useState(0);
    const [pendingStudents, setPendingStudents] = useState(0);
    const [pendingPrograms, setPendingPrograms] = useState(0); // New State for Pending Programs
    const [forumPost, setForumPost] = useState(0); // New State for Forum Posts
    const [applicationInbox, setApplicationInbox] = useState(0); // New State for Application Inbox
    const [activities, setActivities] = useState([]); // State for Activities
    const [loading, setLoading] = useState(true);

    const [currentDate, setCurrentDate] = useState(new Date());

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch total number of accounts
                const accountsResponse = await fetch('/api/admin/total-accounts');
                const accountsData = await accountsResponse.json();
                setTotalAccounts(accountsData.totalAccounts);

                // Fetch total number of scholarships
                const scholarshipsResponse = await fetch('/api/admin/total-scholarships');
                const scholarshipsData = await scholarshipsResponse.json();
                setTotalScholarships(scholarshipsData.totalScholarships);

                // Fetch total number of approved scholars
                const scholarsResponse = await fetch('/api/admin/count-approved-scholars');
                const scholarsData = await scholarsResponse.json();
                setTotalScholars(scholarsData.count);

                // Fetch total number of pending providers
                const pendingProvidersResponse = await fetch('/api/admin/search-pending-verification-providers');
                const pendingProvidersData = await pendingProvidersResponse.json();
                setPendingProviders(pendingProvidersData.length);

                const pendingStudentsResponse = await fetch('/api/admin/search-pending-verification-students');
                const pendingStudentsData = await pendingStudentsResponse.json();
                setPendingStudents(pendingStudentsData.length);

                // Fetch total number of pending programs
                const pendingProgramsResponse = await fetch('/api/admin/search-pending-approval-programs');
                const pendingProgramsData = await pendingProgramsResponse.json();
                setPendingPrograms(pendingProgramsData.length);

                const forumPostResponse = await fetch('/api/adminForums/forum-posts');
                const forumPostData = await forumPostResponse.json();
                setForumPost(forumPostData.length);

                const ApplicationInboxResponse = await fetch('/api/adminApp/users/pending-verification');
                const ApplicationInboxData = await ApplicationInboxResponse.json();
                const totalPendingVerifications = ApplicationInboxData.userCount + ApplicationInboxData.scholarshipProgramCount;
                setApplicationInbox(totalPendingVerifications);

                // Fetch recent activities
                // const activitiesResponse = await fetch('/api/admin/recent-activities');
                // const activitiesData = await activitiesResponse.json();
                // setActivities(activitiesData.activities);

                // Dummy data for activities
                setActivities([
                    { id: 1, actor: "DepEd", action: "Posted a Scholarship", time: "1 hour ago" },
                    { id: 2, actor: "John Doe", action: "Sent an Application to DepEd", time: "2 hours ago" },
                    { id: 3, actor: "TESDA", action: "Approved an Application", time: "3 hours ago" },
                    { id: 4, actor: "CHED", action: "Posted a Scholarship", time: "4 hours ago" },
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
            <div className="flex justify-center items-center h-screen">
                <svg className="animate-spin h-10 w-10 text-blue-600" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
            </div>
        );
    }

    const formattedDate = currentDate.toLocaleDateString();
    const formattedTime = currentDate.toLocaleTimeString();

    const handleViewClick = (e) => {
        e.stopPropagation(); // Prevent the outer link from being triggered
        navigate('/application-inbox');
    };

    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-grow bg-[#f8f8fb] font-medium text-slate-700">
                <div className=''>
                    <div className='flex items-center mx-auto justify-between px-8 lg:px-24 mb-3 bg-blue-600 text-white shadow'>


                        <div className='flex items-center gap-4 '>
                            <div className='bg-white  w-24 h-24 my-8 rounded-full flex items-center justify-center'>
                                <img
                                    src={currentUser ? currentUser.profilePicture : 'defaultProfilePicture.jpg'}
                                    alt='Admin Profile'
                                    className='w-24 h-24 rounded-full object-cover'
                                />
                            </div>
                            <div className='flex flex-col gap-1'>
                                <h1 className='text-2xl font-bold'>Welcome {currentUser.username}!</h1>
                                <p className='text-sm font-medium tracking-wide'>Here is your dashboard!</p>

                            </div>
                        </div>

                        <div className="flex gap-2 items-center justify-center px-4 py-2 bg-white text-blue-600 font-medium border-2 rounded-md w-[300px]">
                            <FaClock className='w-6 h-6 text-blue-600 inline-block' />
                            <p className='text-sm tracking-wider'>{`Today is ${formattedDate}, ${formattedTime}`}</p>
                        </div>
                    </div>
                </div>

                <div className='max-w-8xl mx-auto px-24 pt-5 gap-10 flex-col flex'>
                    <div className="flex justify-center h-full">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 w-full max-w-7xl">
                            <Link to={'/accounts'} className="bg-white flex flex-col gap-2 shadow border rounded-md h-[200px] items-start p-6 hover:bg-slate-100 hover:-translate-y-2 transition ease-in-out group">
                                <div className="flex items-center justify-between w-full">
                                    <h1 className="text-2xl font-semibold text-slate-600">Accounts</h1>
                                    <div className="px-4 py-2 bg-blue-200 rounded-md">
                                        <BsPersonFill className="w-8 h-8 text-blue-600" />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3 w-full">
                                    <span className="text-6xl font-bold text-left text-blue-600">{totalAccounts}</span>
                                    <div className="flex justify-between items-center">
                                        <span className="text-base text-slate-500 flex gap-3 truncate">
                                            {pendingProviders + pendingStudents} <span>Pending verification</span>
                                        </span>
                                        <div onClick={handleViewClick} className="hidden group-hover:flex gap-2 items-center text-blue-600 cursor-pointer">
                                            View
                                            <IoMdArrowRoundForward className="w-6 h-6" />
                                        </div>
                                    </div>
                                </div>
                            </Link>

                            <Link to={'/scholarship-programs'} className="bg-white flex flex-col gap-2 shadow border rounded-md h-[200px] items-start p-6 hover:bg-slate-100 hover:-translate-y-2 transition ease-in-out group">
                                <div className="flex items-center justify-between w-full">
                                    <h1 className="text-2xl font-semibold text-slate-600">Scholarships</h1>
                                    <div className="px-4 py-2 bg-blue-200 rounded-md">
                                        <GiGraduateCap className="w-8 h-8 text-blue-600" />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3 w-full">
                                    <span className="text-6xl font-bold text-left text-blue-600">{totalScholarships}</span>
                                    <div className="flex justify-between items-center">
                                        <span className="text-base text-slate-500 flex gap-3 truncate">
                                            {pendingPrograms} <span>Pending verification</span>
                                        </span>
                                        <div className="hidden group-hover:flex gap-2 items-center text-blue-600">
                                            View
                                            <IoMdArrowRoundForward className="w-6 h-6" />
                                        </div>
                                    </div>
                                </div>
                            </Link>

                            <Link to={'/admin-forums'} className="bg-white flex flex-col gap-2 shadow border rounded-md h-[200px] items-start p-6 hover:bg-slate-100 hover:-translate-y-2 transition ease-in-out group">
                                <div className="flex items-center justify-between w-full">
                                    <h1 className="text-2xl font-semibold text-slate-600">Forum Posts</h1>
                                    <div className="px-4 py-2 bg-blue-200 rounded-md">
                                        <IoMdChatboxes className="w-8 h-8 text-blue-600" />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3 w-full">
                                    <span className="text-6xl font-bold text-left text-blue-600">{forumPost}</span>
                                    <div className="flex justify-between items-center">
                                        <span className="text-base text-slate-500 flex gap-3 truncate">
                                            0 <span>New posts</span>
                                        </span>
                                        <div className="hidden group-hover:flex gap-2 items-center text-blue-600">
                                            View
                                            <IoMdArrowRoundForward className="w-6 h-6" />
                                        </div>
                                    </div>
                                </div>
                            </Link>

                            <Link to={'/application-inbox'} className="bg-white flex flex-col gap-2 shadow border rounded-md h-[200px] items-start p-6 hover:bg-slate-100 hover:-translate-y-2 transition ease-in-out group">
                                <div className="flex items-center justify-between w-full">
                                    <h1 className="text-2xl font-semibold text-slate-600">Inbox Received</h1>
                                    <div className="px-4 py-2 bg-blue-200 rounded-md">
                                        <FaInbox className="w-8 h-8 text-blue-600" />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3 w-full">
                                    <span className="text-6xl font-bold text-left text-blue-600">{applicationInbox}</span>
                                    <div className="flex justify-between items-center">
                                        <span className="text-base text-slate-500 flex gap-3 truncate">
                                            0 <span>New notifications</span>
                                        </span>
                                        <div className="hidden group-hover:flex gap-2 items-center text-blue-600">
                                            View
                                            <IoMdArrowRoundForward className="w-6 h-6" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>


                    {/* <span className="border-b">Activity History</span>
                    <div className=" mb-16">
                        <div className="bg-white shadow border rounded-md group">
                            <div className="border-b flex justify-between px-6 items-center py-4 relative">
                                <span className="">Table</span>
                                <button onClick={toggleDropdown} className="hover:bg-slate-200 rounded-md">
                                    <BiDotsHorizontal className="w-8 h-8 text-blue-600 group-hover:text-blue-800" />
                                </button>
                                {dropdownOpen && (
                                    <div className="absolute right-0 bottom-full mb-2 w-30 bg-white border border-gray-300 rounded-md shadow-lg">
                                        <Link to={'/inbox'} className="w-full text-left px-4 py-2 text-sm flex gap-2 items-center text-blue-600 hover:bg-gray-100">
                                            <BsInboxFill className="w-6 h-6" />
                                            Inbox
                                        </Link>
                                    </div>
                                )}
                            </div>

                            <div className="divide-y">
                                {activities.map((activity) => (
                                    <div key={activity.id} className="flex justify-between items-center p-4">
                                        <div className="flex gap-2 items-center">
                                            <div className="bg-blue-600 w-10 h-10 rounded-full"></div>
                                            <div className="flex flex-col">
                                                <h1 className="text-lg font-semibold">{activity.actor}</h1>
                                                <p className="text-slate-500">{activity.action}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-blue-600">{activity.time}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div> */}
                </div>
            </main>
        </div>
    );
}