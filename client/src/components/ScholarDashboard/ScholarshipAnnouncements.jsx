import React, { useEffect, useState } from 'react';
import { FaArrowLeft, FaArrowRight, FaArrowUp, FaArrowDown, FaRegHeart } from 'react-icons/fa';
import { BiFilter, BiCommentDots } from 'react-icons/bi';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ScholarshipAnnouncements = () => {
    const navigate = useNavigate();
    const currentUser = useSelector((state) => state.user.currentUser);
    const userId = currentUser._id;

    const [scholarshipData, setScholarshipData] = useState([]);
    const [carouselIndex, setCarouselIndex] = useState(0);
    const [announcementSortOrder, setAnnouncementSortOrder] = useState('recent');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const response = await fetch('/api/announcement/student-scholarship-program', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userId }),
                });
                const data = await response.json();
                setScholarshipData(data.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching announcements:', error);
                setLoading(false);
            }
        };

        fetchAnnouncements();
    }, [userId]);

    const handleNextCarousel = () => {
        const totalAnnouncements = scholarshipData.flatMap((item) => item.announcements).length;
        if (carouselIndex < totalAnnouncements - 2) {
            setCarouselIndex(carouselIndex + 2);
        } else {
            setCarouselIndex(0); // Loop back to the beginning
        }
    };

    const handlePrevCarousel = () => {
        const totalAnnouncements = scholarshipData.flatMap((item) => item.announcements).length;
        if (carouselIndex > 0) {
            setCarouselIndex(carouselIndex - 2);
        } else {
            setCarouselIndex(totalAnnouncements - 2); // Loop back to the end
        }
    };

    const toggleAnnouncementSortOrder = () => {
        setAnnouncementSortOrder((prevOrder) => (prevOrder === 'recent' ? 'oldest' : 'recent'));
    };

    const sortedAnnouncements = (scholarshipData || []).flatMap((item) => item.announcements).sort((a, b) => {
        if (announcementSortOrder === 'recent') {
            return new Date(b.date) - new Date(a.date);
        } else {
            return new Date(a.date) - new Date(b.date);
        }
    });

    const totalAnnouncements = scholarshipData ? scholarshipData.reduce((total, program) => total + program.announcements.length, 0) : 0;

    const handleAnnouncementClick = (announcementId) => {
        navigate(`/announcement/${announcementId}`);
    };

    const truncateText = (text, maxLength) => {
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + '...';
        }
        return text;
    };

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

    return (
        <div className='flex flex-col border-b'>
            <div className='flex flex-col gap-2 lg:gap-0 lg:flex-row lg:justify-between lg:items-center'>
                <span className='font-bold text-xl lg:text-2xl'>
                    Scholarship Announcements <span className='text-blue-500'>({totalAnnouncements})</span>
                </span>

                <div className=''>
                    <button
                        className='flex gap-2 bg-white hover:bg-slate-200 px-6 py-2 border shadow rounded-md'
                        onClick={toggleAnnouncementSortOrder}
                    >
                        <BiFilter className='w-6 h-6 text-blue-600' />
                        <span>{announcementSortOrder === 'recent' ? 'Recent' : 'Oldest'}</span>
                    </button>
                </div>
            </div>

            <div className='relative'>
                {sortedAnnouncements.length > 0 ? (
                    <div className='flex flex-col items-center mx-4 lg:mx-0 my-6 lg:my-10'>
                        {/* Arrows for larger screens (left and right) */}
                        <div className='hidden lg:flex lg:flex-row items-center justify-between w-full'>
                            <button
                                onClick={handlePrevCarousel}
                                className='bg-blue-600 text-white p-2 lg:p-3 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 transition duration-300 transform hover:translate-x-[-10px]'
                            >
                                <FaArrowLeft />
                            </button>
                            <div className='flex flex-col lg:flex-row gap-4 lg:gap-10 overflow-hidden'>
                                {sortedAnnouncements
                                    .filter((announcement) => announcement.status !== 'Deleted')
                                    .slice(carouselIndex, carouselIndex + 2)
                                    .map((announcement) => (
                                        <div
                                            className='bg-white border p-4 rounded-md flex flex-col gap-4 hover:-translate-y-1 hover:shadow-lg transition ease-in-out cursor-pointer w-full lg:w-[400px]'
                                            key={announcement._id}
                                            onClick={() => handleAnnouncementClick(announcement._id)}
                                        >
                                            <div className='flex gap-2'>
                                                <div className='bg-white w-12 h-12 rounded-md overflow-hidden'>
                                                    <img
                                                        src={scholarshipData.find((item) => item.scholarshipProgram._id === announcement.scholarshipProgram).scholarshipProgram.scholarshipImage}
                                                        alt='Scholarship'
                                                        className='w-full h-full object-cover'
                                                    />
                                                </div>
                                                <div className='flex flex-col'>
                                                    <span className='font-bold text-sm lg:text-base'>
                                                        {scholarshipData.find((item) => item.scholarshipProgram._id === announcement.scholarshipProgram).scholarshipProgram.organizationName}
                                                    </span>
                                                    <span className='text-blue-600 text-sm lg:text-base'>
                                                        {scholarshipData.find((item) => item.scholarshipProgram._id === announcement.scholarshipProgram).scholarshipProgram.title}
                                                    </span>
                                                </div>
                                            </div>
                                            <p className='bg-slate-200 p-2 lg:p-4 rounded-md text-sm lg:text-base whitespace-pre-line'>
                                                <div className="flex justify-between items-center">
                                                    <h1 className="text-xl font-bold text-blue-600">{truncateText(announcement.title, 25)}</h1>
                                                </div>
                                                <span className='text-blue-600 font-bold'></span> {truncateText(announcement.content, 100)}
                                            </p>
                                            <span className='text-xs lg:text-sm flex items-end justify-end w-full text-slate-600'>
                                                Announced: {formatDistanceToNow(new Date(announcement.date), { addSuffix: true })}
                                            </span>
                                            <div className='border-t mt-2'>
                                                <div className='flex flex-row justify-between mt-2 gap-2'>
                                                    <div className='flex flex-row gap-2'>
                                                        <div className='flex flex-row gap-1 px-2'>
                                                            <FaRegHeart className='w-4 h-4 lg:w-6 lg:h-6 font-bold text-blue-600' />
                                                            <span className='text-xs lg:text-base'>{announcement.likesCount}</span>
                                                        </div>
                                                        <div className='flex flex-row gap-1'>
                                                            <BiCommentDots className='w-4 h-4 lg:w-6 lg:h-6 text-blue-600' />
                                                            <span className='text-xs lg:text-base'>{announcement.comments.length}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                            <button
                                onClick={handleNextCarousel}
                                className='bg-blue-600 text-white p-2 lg:p-3 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 transition duration-300 transform hover:translate-x-[10px]'
                            >
                                <FaArrowRight />
                            </button>
                        </div>

                        {/* Arrows for smaller screens (up and down) */}
                        <div className='flex lg:hidden flex-col items-center'>
                            <button
                                onClick={handlePrevCarousel}
                                className='bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 transition duration-300 transform hover:translate-y-[-10px] mb-4'
                            >
                                <FaArrowUp />
                            </button>
                            <div className='flex flex-col gap-4 overflow-hidden'>
                                {sortedAnnouncements
                                    .filter((announcement) => announcement.status !== 'Deleted')
                                    .slice(carouselIndex, carouselIndex + 2)
                                    .map((announcement) => (
                                        <div
                                            className='bg-white border p-4 rounded-md flex flex-col gap-4 hover:-translate-y-1 hover:shadow-lg transition ease-in-out cursor-pointer w-full lg:w-[300px]'
                                            key={announcement._id}
                                            onClick={() => handleAnnouncementClick(announcement._id)}
                                        >
                                            <div className='flex gap-2'>
                                                <div className='bg-white w-12 h-12 rounded-md overflow-hidden'>
                                                    <img
                                                        src={scholarshipData.find((item) => item.scholarshipProgram._id === announcement.scholarshipProgram).scholarshipProgram.scholarshipImage}
                                                        alt='Scholarship'
                                                        className='w-full h-full object-cover'
                                                    />
                                                </div>
                                                <div className='flex flex-col'>
                                                    <span className='font-bold text-sm'>
                                                        {scholarshipData.find((item) => item.scholarshipProgram._id === announcement.scholarshipProgram).scholarshipProgram.organizationName}
                                                    </span>
                                                    <span className='text-blue-600 text-sm'>
                                                        {scholarshipData.find((item) => item.scholarshipProgram._id === announcement.scholarshipProgram).scholarshipProgram.title}
                                                    </span>
                                                </div>
                                            </div>
                                            <p className='bg-slate-200 p-2 rounded-md text-sm'>
                                                <span className='text-blue-600 font-bold'>@Students</span> {truncateText(announcement.content, 100)}
                                            </p>
                                            <span className='text-xs flex items-end justify-end w-full text-slate-600'>
                                                Announced: {formatDistanceToNow(new Date(announcement.date), { addSuffix: true })}
                                            </span>
                                            <div className='border-t mt-2'>
                                                <div className='flex flex-row justify-between mt-2 gap-2'>
                                                    <div className='flex flex-row gap-2'>
                                                        <div className='flex flex-row gap-1 px-2'>
                                                            <FaRegHeart className='w-4 h-4 font-bold text-blue-600' />
                                                            <span className='text-xs'>{announcement.likesCount}</span>
                                                        </div>
                                                        <div className='flex flex-row gap-1'>
                                                            <BiCommentDots className='w-4 h-4 text-blue-600' />
                                                            <span className='text-xs'>{announcement.comments.length}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                            <button
                                onClick={handleNextCarousel}
                                className='bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 transition duration-300 transform hover:translate-y-[10px] mt-4'
                            >
                                <FaArrowDown />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className='flex items-center justify-center h-52'>
                        <p className='text-gray-700'>No announcements available.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ScholarshipAnnouncements;