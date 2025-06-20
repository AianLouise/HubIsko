import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FaRegHeart, FaHeart, FaRegEye, FaBullhorn, FaCalendarAlt, FaUser, FaBuilding } from 'react-icons/fa';
import { BiCommentDots } from 'react-icons/bi';
import { HiOutlineDotsVertical, HiOutlineReply, HiOutlineTrash, HiOutlineArrowLeft } from 'react-icons/hi';
import { IoMdArrowDropdown } from 'react-icons/io';
import AddCommentForm from '../ViewScholarshipDetails/AddCommentForm';
import { useSelector } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';
import ProviderHeaderSidebar from '../ProviderHeaderAndSidebar';

const AnnouncementDetails = () => {
    const { announcementId } = useParams();
    const navigate = useNavigate();    const [sidebarOpen, setSidebarOpen] = useState(true);
    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    const [announcement, setAnnouncement] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [liked, setLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    const [replyContent, setReplyContent] = useState('');
    const [replyingTo, setReplyingTo] = useState(null);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const { currentUser } = useSelector((state) => state.user);
    const currentUserId = currentUser ? currentUser._id : null;
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1024);
        };
        
        window.addEventListener('resize', handleResize);
        handleResize();
        
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const fetchAnnouncement = async () => {
        try {
            const response = await fetch(`/api/announcement/get/${announcementId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setAnnouncement(data);
            setLikesCount(data.likesCount || 0);
            // Check if the logged-in user has liked the announcement
            if (data.likedBy.includes(currentUserId)) {
                setLiked(true);
            }
        } catch (err) {
            setError('Failed to fetch announcement');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnnouncement();
    }, [announcementId, currentUserId]);

    const handleLike = async () => {
        try {
            const response = await fetch(`/api/announcement/like/${announcementId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId: currentUserId })
            });
            if (!response.ok) {
                throw new Error('Failed to like announcement');
            }
            const data = await response.json();
            setLiked(true);
            setLikesCount(data.likesCount);
        } catch (error) {
            console.error(error);
        }
    };

    const handleUnlike = async () => {
        try {
            const response = await fetch(`/api/announcement/unlike/${announcementId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId: currentUserId })
            });
            if (!response.ok) {
                throw new Error('Failed to unlike announcement');
            }
            const data = await response.json();
            setLiked(false);
            setLikesCount(data.likesCount);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCommentLike = async (commentId) => {
        try {
            const response = await fetch(`/api/announcement/like-comment/${announcementId}/${commentId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId: currentUserId })
            });
            if (!response.ok) {
                throw new Error('Failed to like comment');
            }
            const data = await response.json();
            setAnnouncement((prev) => ({
                ...prev,
                comments: prev.comments.map((comment) =>
                    comment._id === commentId ? { ...comment, likesCount: data.likesCount, likedBy: [...comment.likedBy, currentUserId] } : comment
                )
            }));
        } catch (error) {
            console.error(error);
        }
    };

    const handleCommentUnlike = async (commentId) => {
        try {
            const response = await fetch(`/api/announcement/unlike-comment/${announcementId}/${commentId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId: currentUserId })
            });
            if (!response.ok) {
                throw new Error('Failed to unlike comment');
            }
            const data = await response.json();
            setAnnouncement((prev) => ({
                ...prev,
                comments: prev.comments.map((comment) =>
                    comment._id === commentId ? { ...comment, likesCount: data.likesCount, likedBy: comment.likedBy.filter((id) => id !== currentUserId) } : comment
                )
            }));
        } catch (error) {
            console.error(error);
        }
    };

    const handleReplySubmit = async (commentId) => {
        try {
            const response = await fetch(`/api/announcement/reply/${announcementId}/${commentId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId: currentUserId, content: replyContent })
            });
            if (!response.ok) {
                throw new Error('Failed to add reply');
            }
            const data = await response.json();
            setAnnouncement((prev) => ({
                ...prev,
                comments: prev.comments.map((comment) =>
                    comment._id === commentId ? { ...comment, replies: data.replies } : comment
                )
            }));
            setReplyContent('');
            setReplyingTo(null);
            fetchAnnouncement(); // Call fetchAnnouncement after successful reply submission
        } catch (error) {
            console.error(error);
        }
    };    const handleCommentAdded = (newComment) => {
        setAnnouncement((prev) => ({
            ...prev,
            comments: [...prev.comments, newComment]
        }));
    };

    const handleDelete = () => {
        setModalVisible(true);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setDropdownVisible(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const confirmDelete = async () => {
        try {
            const response = await fetch(`/api/announcement/delete/${announcementId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error('Failed to delete announcement');
            }
            setModalVisible(false);
            setDropdownVisible(false);
            navigate(`/view-scholarships/${announcement.scholarshipProgram._id}?tab=announcement`); // Redirect to the announcements list page
        } catch (error) {
            console.error(error);
        }
    };

    const cancelDelete = () => {
        setModalVisible(false);
    };

    const handleBackClick = () => {
        navigate(-1);
    };    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <div className="flex flex-col items-center">
                    <svg className="animate-spin h-12 w-12 text-blue-600 mb-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    <p className="text-gray-600 font-medium">Loading announcement...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Announcement</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const getRoleIcon = (role) => {
        switch (role) {
            case 'applicant':
                return <FaUser className="w-4 h-4 text-blue-600" />;
            case 'scholarship_provider':
                return <FaBuilding className="w-4 h-4 text-green-600" />;
            case 'admin':
                return <FaBullhorn className="w-4 h-4 text-red-600" />;
            default:
                return <FaUser className="w-4 h-4 text-gray-600" />;
        }
    };

    const getUserDisplayName = (user) => {
        if (user.role === 'admin') return user.username;
        if (user.role === 'applicant') return `${user.applicantDetails.firstName} ${user.applicantDetails.lastName}`;
        if (user.role === 'scholarship_provider') return user.scholarshipProviderDetails.organizationName;
        return 'Unknown User';
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-4xl">
                {/* Breadcrumb Navigation */}
                <div className="mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                        <button
                            onClick={handleBackClick}
                            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                        >
                            <HiOutlineArrowLeft className="w-4 h-4" />
                            Back to Scholarship
                        </button>
                        <IoMdArrowDropdown className="-rotate-90 text-gray-400" />
                        <span className="text-gray-800 font-medium">Announcement Details</span>
                    </div>
                </div>

                {/* Main Announcement Card */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl overflow-hidden bg-white p-1">
                                    <img 
                                        src={announcement.scholarshipProgram.scholarshipImage} 
                                        alt="Scholarship" 
                                        className="w-full h-full object-cover rounded-lg"
                                        onError={(e) => {
                                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAyOEMyNC40MTgzIDI4IDI4IDI0LjQxODMgMjggMjBDMjggMTUuNTgxNyAyNC40MTgzIDEyIDIwIDEyQzE1LjU4MTcgMTIgMTIgMTUuNTgxNyAxMiAyMEMxMiAyNC40MTgzIDE1LjU4MTcgMjggMjAgMjhaIiBmaWxsPSIjOTlBM0FFIi8+Cjwvc3ZnPgo=';
                                        }}
                                    />
                                </div>
                                <div>
                                    <h2 className="text-white font-bold text-lg">
                                        {announcement.scholarshipProgram.organizationName}
                                    </h2>
                                    <p className="text-blue-100 text-sm">
                                        {announcement.scholarshipProgram.title}
                                    </p>
                                </div>
                            </div>
                            
                            {/* Action Menu */}
                            {currentUser.role === 'scholarship_provider' && (
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={() => setDropdownVisible(!dropdownVisible)}
                                        className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
                                    >
                                        <HiOutlineDotsVertical className="w-5 h-5" />
                                    </button>
                                    
                                    {dropdownVisible && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-10">
                                            <button
                                                className="flex items-center gap-2 w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                                                onClick={handleDelete}
                                            >
                                                <HiOutlineTrash className="w-4 h-4" />
                                                Delete Announcement
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Announcement Content */}
                    <div className="p-6">
                        {announcement.status === 'Deleted' ? (
                            <div className="text-center py-8">
                                <div className="text-red-500 text-4xl mb-4">🗑️</div>
                                <h3 className="text-xl font-bold text-red-600 mb-2">Announcement Deleted</h3>
                                <p className="text-gray-600">This announcement has been removed by the organization.</p>
                            </div>
                        ) : (
                            <>
                                {/* Title and Content */}
                                <div className="mb-6">
                                    <div className="flex items-start gap-3 mb-4">
                                        <FaBullhorn className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                                        <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                                            {announcement.title}
                                        </h1>
                                    </div>
                                    
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                            {announcement.content}
                                        </p>
                                    </div>
                                </div>

                                {/* Engagement Stats */}
                                <div className="flex items-center justify-between py-4 border-t border-gray-200">
                                    <div className="flex items-center gap-6">
                                        <button
                                            onClick={liked ? handleUnlike : handleLike}
                                            className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors"
                                        >
                                            {liked ? (
                                                <FaHeart className="w-5 h-5 text-red-500" />
                                            ) : (
                                                <FaRegHeart className="w-5 h-5" />
                                            )}
                                            <span className="font-medium">{likesCount}</span>
                                        </button>
                                        
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <BiCommentDots className="w-5 h-5" />
                                            <span className="font-medium">{announcement.comments.length}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <FaCalendarAlt className="w-4 h-4" />
                                        <span>{formatDistanceToNow(new Date(announcement.date), { addSuffix: true })}</span>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Comments Section */}
                {announcement.status !== 'Deleted' && (
                    <div className="mt-8 bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-900">
                                Comments ({announcement.comments.length})
                            </h2>
                        </div>
                        
                        <div className="p-6">
                            {/* Add Comment Form */}
                            <div className="mb-8">
                                <AddCommentForm 
                                    announcementId={announcementId} 
                                    onCommentAdded={handleCommentAdded} 
                                />
                            </div>

                            {/* Comments List */}
                            <div className="space-y-6">
                                {announcement.comments.map((comment, index) => (
                                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                                        {/* Comment Header */}
                                        <div className="flex items-start gap-3 mb-3">
                                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                                                <img 
                                                    src={comment.author.profilePicture} 
                                                    alt={getUserDisplayName(comment.author)}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAyOEMyNC40MTgzIDI4IDI4IDI0LjQxODMgMjggMjBDMjggMTUuNTgxNyAyNC40MTgzIDEyIDIwIDEyQzE1LjU4MTcgMTIgMTIgMTUuNTgxNyAxMiAyMEMxMiAyNC40MTgzIDE1LjU4MTcgMjggMjAgMjhaIiBmaWxsPSIjOTlBM0FFIi8+Cjwvc3ZnPgo=';
                                                    }}
                                                />
                                            </div>
                                            
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="font-semibold text-gray-900">
                                                        {getUserDisplayName(comment.author)}
                                                    </h4>
                                                    {getRoleIcon(comment.author.role)}
                                                    <span className="text-sm text-gray-500">
                                                        {formatDistanceToNow(new Date(comment.date), { addSuffix: true })}
                                                    </span>
                                                </div>
                                                <p className="text-gray-700 leading-relaxed">{comment.content}</p>
                                            </div>
                                        </div>

                                        {/* Comment Actions */}
                                        <div className="flex items-center justify-between pl-13">
                                            <div className="flex items-center gap-4">
                                                <button
                                                    onClick={() => comment.likedBy && comment.likedBy.includes(currentUserId) ? handleCommentUnlike(comment._id) : handleCommentLike(comment._id)}
                                                    className="flex items-center gap-1 text-gray-600 hover:text-red-500 transition-colors"
                                                >
                                                    {comment.likedBy && comment.likedBy.includes(currentUserId) ? (
                                                        <FaHeart className="w-4 h-4 text-red-500" />
                                                    ) : (
                                                        <FaRegHeart className="w-4 h-4" />
                                                    )}
                                                    <span className="text-sm">{comment.likesCount || 0}</span>
                                                </button>
                                                
                                                <button
                                                    onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}
                                                    className="flex items-center gap-1 text-gray-600 hover:text-blue-500 transition-colors"
                                                >
                                                    <HiOutlineReply className="w-4 h-4" />
                                                    <span className="text-sm">Reply</span>
                                                </button>
                                            </div>
                                            
                                            {comment.replies && comment.replies.length > 0 && (
                                                <span className="text-sm text-gray-500">
                                                    {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                                                </span>
                                            )}
                                        </div>

                                        {/* Replies */}
                                        {comment.replies && comment.replies.length > 0 && (
                                            <div className="mt-4 ml-13 space-y-3">
                                                {comment.replies.map((reply, replyIndex) => (
                                                    <div key={replyIndex} className="bg-gray-50 rounded-lg p-3">
                                                        <div className="flex items-start gap-2">
                                                            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                                                                <img 
                                                                    src={reply.author.profilePicture} 
                                                                    alt={getUserDisplayName(reply.author)}
                                                                    className="w-full h-full object-cover"
                                                                    onError={(e) => {
                                                                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAyOEMyNC40MTgzIDI4IDI4IDI0LjQxODMgMjggMjBDMjggMTUuNTgxNyAyNC40MTgzIDEyIDIwIDEyQzE1LjU4MTcgMTIgMTIgMTUuNTgxNyAxMiAyMEMxMiAyNC40MTgzIDE1LjU4MTcgMjggMjAgMjhaIiBmaWxsPSIjOTlBM0FFIi8+Cjwvc3ZnPgo=';
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <h5 className="font-medium text-gray-900 text-sm">
                                                                        {getUserDisplayName(reply.author)}
                                                                    </h5>
                                                                    {getRoleIcon(reply.author.role)}
                                                                    <span className="text-xs text-gray-500">
                                                                        {formatDistanceToNow(new Date(reply.date), { addSuffix: true })}
                                                                    </span>
                                                                </div>
                                                                <p className="text-gray-700 text-sm">{reply.content}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Reply Form */}
                                        {replyingTo === comment._id && (
                                            <div className="mt-4 ml-13">
                                                <div className="bg-gray-50 rounded-lg p-3">
                                                    <textarea
                                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                                        rows="3"
                                                        value={replyContent}
                                                        onChange={(e) => setReplyContent(e.target.value)}
                                                        placeholder="Write a reply..."
                                                    />
                                                    <div className="flex justify-end gap-2 mt-3">
                                                        <button
                                                            onClick={() => setReplyingTo(null)}
                                                            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            onClick={() => handleReplySubmit(comment._id)}
                                                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                                                            disabled={!replyContent.trim()}
                                                        >
                                                            Reply
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {announcement.comments.length === 0 && (
                                <div className="text-center py-8">
                                    <BiCommentDots className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                    <h3 className="text-lg font-medium text-gray-600 mb-2">No comments yet</h3>
                                    <p className="text-gray-500">Be the first to share your thoughts!</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {modalVisible && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                            <div className="text-center">
                                <div className="text-red-500 text-4xl mb-4">⚠️</div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Announcement</h3>
                                <p className="text-gray-600 mb-6">
                                    Are you sure you want to delete this announcement? This action cannot be undone.
                                </p>
                                <div className="flex gap-3 justify-center">
                                    <button
                                        onClick={cancelDelete}
                                        className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={confirmDelete}
                                        className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AnnouncementDetails;