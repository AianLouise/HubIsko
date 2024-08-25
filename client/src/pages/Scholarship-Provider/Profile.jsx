import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { FaStar, FaWrench, FaRegHeart, FaRegEye } from 'react-icons/fa';
import { BiCommentDots } from 'react-icons/bi';
import { FaNewspaper } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import ProviderHeaderSidebar from '../../components/ProviderHeaderAndSidebar';
import { useSelector } from 'react-redux';

export default function Profile() {
    const { currentUser } = useSelector((state) => state.user);

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    return (
        <div className={`flex flex-col min-h-screen`}>

            <main className={`flex-grow bg-[#f8f8fb] transition-all duration-200 ease-in-out ${sidebarOpen ? 'ml-64' : ''} `}>
                <ProviderHeaderSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} currentPath={`${currentUser.scholarshipProviderDetails.organizationName} / Profile`} />




            </main>

        </div>
    )
}
