import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FaRegHeart, FaHeart, FaRegEye, FaBullhorn } from 'react-icons/fa';
import { BiCommentDots } from 'react-icons/bi';
import AddCommentForm from './AddCommentForm';
import { useSelector } from 'react-redux';
import { FaEllipsisH } from 'react-icons/fa';
import { IoMdArrowDropdown } from 'react-icons/io';
import { formatDistanceToNow } from 'date-fns';
import { BsArrowLeft } from 'react-icons/bs';

const AnnouncementDetails = () => {
    const { announcementId } = useParams();
    const navigate = useNavigate();

    const [announcement, setAnnouncement] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [liked, setLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    const [replyContent, setReplyContent] = useState('');
    const [replyingTo, setReplyingTo] = useState(null);

    const { currentUser } = useSelector((state) => state.user);
    const currentUserId = currentUser ? currentUser._id : null;

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
    };

    const handleCommentAdded = (newComment) => {
        setAnnouncement((prev) => ({
            ...prev,
            comments: [...prev.comments, newComment]
        }));
    };

    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const handleDelete = () => {
        setModalVisible(true);
    };

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
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="flex flex-col items-center pt-7 pb-7 bg-gray-100 h-screen overflow-auto">
            <div className="relative w-full max-w-4xl">
                <div className="flex justify-start items-center w-full">
                    <div className='flex gap-1 items-center font-medium'>
                        <div className='flex gap-2'>
                            <button
                                onClick={handleBackClick}
                                className='text-blue-600 flex gap-2 items-center hover:bg-slate-200 bg-white shadow rounded-md border px-6 py-2'
                            >
                                <BsArrowLeft className='w-6 h-6' /> Back to Scholarship
                            </button>
                        </div>
                        <IoMdArrowDropdown className='-rotate-90 text-2xl text-blue-600' />
                        <div className='flex gap-1 items-center'>
                            <button className='text-blue-600 flex gap-2 items-center hover:bg-slate-200 bg-white shadow rounded-md border px-6 py-2'>
                                <FaBullhorn className='w-4 h-4' /> {/* Add the announcement icon */}
                                {announcement.title}
                            </button>
                        </div>
                    </div>
                </div>
                <div className="bg-white border p-4 rounded-md flex flex-col gap-4 transition ease-in-out mt-5">
                    <div className="flex justify-between items-center">
                        {announcement.status === 'Deleted' ? (
                            <div className="flex flex-col gap-2 items-center">
                                <span className="font-bold text-red-600 self-start">This announcement has been deleted.</span>
                                <div className="flex gap-2 items-center">
                                    <div className="w-12 h-12 rounded-md overflow-hidden">
                                        <img src={announcement.scholarshipProgram.scholarshipImage} alt="Scholarship" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold">{announcement.scholarshipProgram.organizationName}</span>
                                        <span className="text-blue-600">{announcement.scholarshipProgram.title}</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex gap-2 items-center">
                                <div className="w-12 h-12 rounded-md overflow-hidden">
                                    <img src={announcement.scholarshipProgram.scholarshipImage} alt="Scholarship" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold">{announcement.scholarshipProgram.organizationName}</span>
                                    <span className="text-blue-600">{announcement.scholarshipProgram.title}</span>
                                </div>
                            </div>
                        )}
                        <div className="relative">
                            <FaEllipsisH
                                className="text-gray-600 cursor-pointer mr-3"
                                onClick={() => setDropdownVisible(!dropdownVisible)}
                            />
                            {dropdownVisible && (
                                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-10">
                                    <button
                                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                        onClick={handleDelete}
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>

                        {modalVisible && (
                            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
                                <div className="bg-white p-6 rounded-md shadow-lg">
                                    <h2 className="text-lg font-bold mb-4">Confirm Delete</h2>
                                    <p className="mb-4">Are you sure you want to delete this announcement?</p>
                                    <div className="flex justify-end gap-2">
                                        <button
                                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md"
                                            onClick={cancelDelete}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            className="px-4 py-2 bg-red-600 text-white rounded-md"
                                            onClick={confirmDelete}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="bg-slate-200 p-4 rounded-md">
                        <div className="flex justify-between items-center">
                            <h1 className="text-2xl font-bold text-blue-600">{announcement.title}</h1>
                            <span className="text-sm text-slate-600">
                                Announced: {formatDistanceToNow(new Date(announcement.date), { addSuffix: true })}
                            </span>
                        </div>
                        <p className="text-gray-700">
                            <span className="text-blue-600 font-bold">@Students:</span> {announcement.content}
                        </p>
                    </div>
                    <div className="border-t mt-2">
                        <div className="flex flex-row justify-between mt-2 gap-2">
                            <div className="flex flex-row gap-2">
                                <div className="flex flex-row gap-1 px-2" onClick={liked ? handleUnlike : handleLike}>
                                    {liked ? <FaHeart className="w-6 h-6 font-bold text-blue-600" /> : <FaRegHeart className="w-6 h-6 font-bold text-blue-600" />}
                                    <span>{likesCount}</span>
                                </div>
                                <div className="flex flex-row gap-1">
                                    <BiCommentDots className="w-6 h-6 text-blue-600" />
                                    <span>{announcement.comments.length}</span>
                                </div>
                            </div>
                            {/* <div className="flex flex-row gap-1 pr-2">
                                <FaRegEye className="w-6 h-6 text-blue-600" />
                                <span>1.2k</span>
                            </div> */}
                        </div>
                    </div>

                    <div className="mt-4">
                        <h2 className="text-xl font-bold">Comments</h2>
                        {announcement.comments.map((comment, index) => (
                            <div key={index} className="bg-white p-4 rounded-md mt-4 shadow-md border border-gray-200">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-full overflow-hidden">
                                        <img src={comment.author.profilePicture} alt={comment.author.username} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex flex-col w-full">
                                        <div className="flex justify-between items-center">
                                            <p className="font-bold">{comment.author.username}</p>
                                            <p className="text-sm text-gray-500">
                                                {formatDistanceToNow(new Date(comment.date), { addSuffix: true })}
                                            </p>
                                        </div>
                                        <p className="mt-2">{comment.content}</p>
                                    </div>
                                </div>
                                <div className="border-t mt-4 pt-2">
                                    <div className="flex flex-row justify-between gap-4">
                                        <div className="flex flex-row gap-2">
                                            <div className="flex flex-row gap-1 px-2" onClick={() => comment.likedBy && comment.likedBy.includes(currentUserId) ? handleCommentUnlike(comment._id) : handleCommentLike(comment._id)}>
                                                {comment.likedBy && comment.likedBy.includes(currentUserId) ? <FaHeart className="w-6 h-6 font-bold text-blue-600" /> : <FaRegHeart className="w-6 h-6 font-bold text-blue-600" />}
                                                <span>{comment.likesCount}</span>
                                            </div>
                                            <div className="flex flex-row gap-1">
                                                <BiCommentDots className="w-6 h-6 text-blue-600" />
                                                <span>{comment.replies ? comment.replies.length : 0}</span>
                                            </div>
                                        </div>
                                        {/* <div className="flex flex-row gap-1 pr-2">
                                            <FaRegEye className="w-6 h-6 text-blue-600" />
                                            <span>1.2k</span>
                                        </div> */}
                                    </div>
                                    <div className="mt-2">
                                        {comment.replies && comment.replies.map((reply, replyIndex) => (
                                            <div key={replyIndex} className="bg-gray-100 p-2 rounded-md mt-2">
                                                <div className="flex gap-2">
                                                    <div className="w-8 h-8 rounded-full overflow-hidden">
                                                        <img src={reply.author.profilePicture} alt={reply.author.username} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="flex flex-col w-full">
                                                        <div className="flex justify-between items-center">
                                                            <p className="font-bold">{reply.author.username}</p>
                                                            <p className="text-sm text-gray-500">{new Date(reply.date).toLocaleDateString()}</p>
                                                        </div>
                                                        <p className="mt-1">{reply.content}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {replyingTo === comment._id ? (
                                        <div className="mt-2">
                                            <textarea
                                                className="w-full p-2 border rounded-md"
                                                value={replyContent}
                                                onChange={(e) => setReplyContent(e.target.value)}
                                                placeholder="Write a reply..."
                                            />
                                            <div className="flex justify-end gap-2 mt-2">
                                                <button
                                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md"
                                                    onClick={() => setReplyingTo(null)}
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    className="px-4 py-2 bg-blue-600 text-white rounded-md"
                                                    onClick={() => handleReplySubmit(comment._id)}
                                                >
                                                    Reply
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md"
                                            onClick={() => setReplyingTo(comment._id)}
                                        >
                                            Reply
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <AddCommentForm announcementId={announcementId} onCommentAdded={handleCommentAdded} />
                </div>
            </div>
        </div>
    );
};

export default AnnouncementDetails;