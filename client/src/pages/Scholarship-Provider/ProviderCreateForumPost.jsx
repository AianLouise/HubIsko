import React, { useEffect, useState } from 'react';
import ProviderHeaderSidebar from '../../components/ProviderHeaderAndSidebar';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { FaPlus, FaStar, FaWrench, FaRegHeart, FaNewspaper } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa6";
import { BiCommentDots } from "react-icons/bi";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments } from '@fortawesome/free-solid-svg-icons';
import ForumsIcon from '../../assets/ForumsIconwTexture.png';
import CreateForumPost from '../../components/CreateForumPost';

export default function ProviderForums() {
    const { currentUser } = useSelector((state) => state.user);

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    return (
        <div className={`flex flex-col min-h-screen`}>

            <main className={`flex-grow bg-[#f8f8fb] transition-all duration-200 ease-in-out ${sidebarOpen ? 'ml-64' : ''} `}>
                <ProviderHeaderSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} currentPath={`${currentUser.scholarshipProviderDetails.organizationName} / Forums`} />

                <CreateForumPost />

            </main>

        </div>
    );
}
