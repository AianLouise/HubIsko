import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { IoMdArrowDropdown } from 'react-icons/io';
import ApplicationForm from '../ApplicationForm';
import ProviderHeaderSidebar from '../../components/ProviderHeaderAndSidebar';

export default function ViewApplicationDetails() {
    const { currentUser } = useSelector((state) => state.user);

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('details');
    const [scholarshipProgram, setProgramDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const fetchProgramDetails = async () => {
        try {
            const response = await fetch(`/api/scholarshipProgram/scholarship-programs/${id}`);
            const contentType = response.headers.get("content-type");
            if (!response.ok) {
                const errorText = await response.text(); // Read response as text
                throw new Error(`Network response was not ok: ${errorText}`);
            }
            if (contentType && contentType.indexOf("application/json") !== -1) {
                const data = await response.json();
                setProgramDetails(data);
            } else {
                throw new Error("Received non-JSON response");
            }
        } catch (error) {
            console.error('Error fetching program details:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const [applications, setApplications] = useState([]);

    const fetchApplications = async () => {
        try {
            const response = await fetch(`/api/scholarshipProgram/scholarship-applications/${id}`);
            const contentType = response.headers.get("content-type");

            if (!response.ok) {
                const responseText = await response.text(); // Read response as text
                if (response.status === 404 && responseText.includes("No applications found for this scholarship program")) {
                    setApplications([]);
                    setError(null); // No error, just no applications
                } else {
                    throw new Error(`Network response was not ok: ${responseText}`);
                }
            } else if (contentType && contentType.indexOf("application/json") !== -1) {
                const data = await response.json(); // Parse the JSON directly
                setApplications(data);
            } else {
                throw new Error("Received non-JSON response");
            }
        } catch (error) {
            console.error('Error fetching program applications:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProgramDetails();
        fetchApplications();
    }, [id]);

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

    // if (error) {
    //     return <div className="flex justify-center items-center h-screen text-red-600">{error}</div>;
    // }

    return (
        <div className={`flex flex-col min-h-screen`}>
            <main className={`flex-grow bg-[#f8f8fb] transition-all duration-200 ease-in-out ${sidebarOpen ? 'ml-64' : ''}`}>
                <ProviderHeaderSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} currentPath={`${currentUser.scholarshipProviderDetails.organizationName} / `} />
                <div className="max-w-6xl px-24 mx-auto my-20">
                    <div className='my-8 flex gap-2 items-center font-medium'>
                        <Link
                            to="#"
                            onClick={(e) => {
                                e.preventDefault();
                                navigate(-1);
                            }}
                            className='bg-white border rounded-md px-6 py-2 shadow hover:bg-slate-200'
                        >
                            <span>Scholarship</span>
                        </Link>
                        <IoMdArrowDropdown className='-rotate-90 text-4xl text-blue-600' />
                        <div className='bg-white border rounded-md px-6 py-2 shadow'>
                            <span className='text-blue-600'>Name</span>
                        </div>
                    </div>
                    <ApplicationForm />
                </div>
            </main>
        </div>
    );
}