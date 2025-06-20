import React, { useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaRegHeart, FaBullhorn, FaCalendarAlt } from 'react-icons/fa';
import { BiFilter, BiCommentDots } from 'react-icons/bi';
import { HiOutlineSpeakerphone, HiOutlineNewspaper } from 'react-icons/hi';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const ScholarshipAnnouncements = () => {
    const navigate = useNavigate();
    const currentUser = useSelector((state) => state.user.currentUser);
    const userId = currentUser._id; const [scholarshipData, setScholarshipData] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [announcementSortOrder, setAnnouncementSortOrder] = useState('recent');
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    // Constants for pagination
    const announcementsPerPage = isMobile ? 1 : 2;

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1024);
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []); 
    
    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const response = await fetch(`${apiUrl}/api/announcement/student-scholarship-program`, {
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
    }, [userId]); const handleNextCarousel = () => {
        const totalPages = Math.ceil(sortedAnnouncements.filter(a => a.status !== 'Deleted').length / announcementsPerPage);
        setCurrentPage((prev) => (prev + 1) % totalPages);
    };

    const handlePrevCarousel = () => {
        const totalPages = Math.ceil(sortedAnnouncements.filter(a => a.status !== 'Deleted').length / announcementsPerPage);
        setCurrentPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
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
    }; if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex justify-center items-center h-32">
                    <div className="flex flex-col items-center">
                        <svg className="animate-spin h-8 w-8 text-blue-600 mb-2" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                        </svg>
                        <p className="text-gray-600 text-sm">Loading announcements...</p>
                    </div>
                </div>
            </div>
        );
    }

    const filteredAnnouncements = sortedAnnouncements.filter(announcement => announcement.status !== 'Deleted');
    const totalPages = Math.ceil(filteredAnnouncements.length / announcementsPerPage);
    const startIndex = currentPage * announcementsPerPage;
    const currentAnnouncements = filteredAnnouncements.slice(startIndex, startIndex + announcementsPerPage);

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="flex items-center">
                        <HiOutlineSpeakerphone className="w-6 h-6 text-white mr-3" />
                        <div>
                            <h2 className="text-xl font-bold text-white">
                                Scholarship Announcements
                            </h2>
                            <p className="text-blue-100 text-sm">
                                {totalAnnouncements} {totalAnnouncements === 1 ? 'announcement' : 'announcements'} available
                            </p>
                        </div>
                    </div>

                    <button
                        className="inline-flex items-center px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-lg font-medium transition-all duration-300 backdrop-blur-sm"
                        onClick={toggleAnnouncementSortOrder}
                    >
                        <BiFilter className="w-4 h-4 mr-2" />
                        {announcementSortOrder === 'recent' ? 'Recent First' : 'Oldest First'}
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                {filteredAnnouncements.length > 0 ? (
                    <div className="space-y-6">
                        {/* Navigation - Desktop */}
                        {!isMobile && totalPages > 1 && (
                            <div className="flex justify-center items-center gap-4 mb-6">
                                <button
                                    onClick={handlePrevCarousel}
                                    className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110"
                                    disabled={totalPages <= 1}
                                >
                                    <FaChevronLeft className="w-4 h-4" />
                                </button>

                                <div className="flex items-center gap-2">
                                    {Array.from({ length: totalPages }, (_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentPage(index)}
                                            className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentPage ? 'bg-blue-600' : 'bg-gray-300 hover:bg-gray-400'
                                                }`}
                                        />
                                    ))}
                                </div>

                                <button
                                    onClick={handleNextCarousel}
                                    className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110"
                                    disabled={totalPages <= 1}
                                >
                                    <FaChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        )}

                        {/* Announcements Grid */}
                        <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}>
                            {currentAnnouncements.map((announcement) => {
                                const scholarshipProgram = scholarshipData.find((item) =>
                                    item.scholarshipProgram._id === announcement.scholarshipProgram
                                )?.scholarshipProgram;

                                return (
                                    <div
                                        key={announcement._id}
                                        className="border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden"
                                        onClick={() => handleAnnouncementClick(announcement._id)}
                                    >
                                        {/* Card Header */}
                                        <div className="p-4 border-b border-gray-100">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                                                    <img
                                                        src={scholarshipProgram?.scholarshipImage}
                                                        alt="Scholarship"
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAyOEMyNC40MTgzIDI4IDI4IDI0LjQxODMgMjggMjBDMjggMTUuNTgxNyAyNC40MTgzIDEyIDIwIDEyQzE1LjU4MTcgMTIgMTIgMTUuNTgxNyAxMiAyMEMxMiAyNC40MTgzIDE1LjU4MTcgMjggMjAgMjhaIiBmaWxsPSIjOTlBM0FFIi8+Cjwvc3ZnPgo=';
                                                        }}
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-semibold text-gray-900 truncate">
                                                        {scholarshipProgram?.organizationName || 'Organization'}
                                                    </h3>
                                                    <p className="text-sm text-blue-600 truncate">
                                                        {scholarshipProgram?.title || 'Scholarship Program'}
                                                    </p>
                                                </div>
                                                <FaBullhorn className="w-5 h-5 text-blue-500 flex-shrink-0" />
                                            </div>
                                        </div>

                                        {/* Card Content */}
                                        <div className="p-4">
                                            <h4 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                                {truncateText(announcement.title, 50)}
                                            </h4>

                                            <div className="bg-gray-50 rounded-lg p-3 mb-4">
                                                <p className="text-gray-700 text-sm leading-relaxed">
                                                    {truncateText(announcement.content, 120)}
                                                </p>
                                            </div>

                                            {/* Footer */}
                                            <div className="flex items-center justify-between text-sm text-gray-500">
                                                <div className="flex items-center">
                                                    <FaCalendarAlt className="w-4 h-4 mr-1" />
                                                    {formatDistanceToNow(new Date(announcement.date), { addSuffix: true })}
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center">
                                                        <FaRegHeart className="w-4 h-4 mr-1 text-red-500" />
                                                        <span>{announcement.likesCount || 0}</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <BiCommentDots className="w-4 h-4 mr-1 text-blue-500" />
                                                        <span>{announcement.comments?.length || 0}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Navigation - Mobile */}
                        {isMobile && totalPages > 1 && (
                            <div className="flex justify-center items-center gap-4 mt-6">
                                <button
                                    onClick={handlePrevCarousel}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300"
                                    disabled={totalPages <= 1}
                                >
                                    Previous
                                </button>

                                <span className="text-sm text-gray-600">
                                    {currentPage + 1} of {totalPages}
                                </span>

                                <button
                                    onClick={handleNextCarousel}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300"
                                    disabled={totalPages <= 1}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <HiOutlineNewspaper className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">No announcements yet</h3>
                        <p className="text-gray-500">
                            Check back later for updates from your scholarship programs.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ScholarshipAnnouncements;