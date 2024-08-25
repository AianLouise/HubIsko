import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FaRegHeart, FaHeart, FaRegEye } from "react-icons/fa";
import { BiCommentDots } from "react-icons/bi";
import { IoMdArrowDropdown } from "react-icons/io";
import moment from 'moment';
import { formatDistanceToNow } from 'date-fns';
import { AiFillFilePdf, AiFillFileWord, AiOutlinePaperClip } from 'react-icons/ai';
import Modal from 'react-modal';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { FaFilePdf, FaFileWord } from 'react-icons/fa';

Modal.setAppElement('#root');


export default function ForumDetail() {
    const [loading, setLoading] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [commentContent, setCommentContent] = useState('');
    const [selectedFiles, setSelectedFiles] = useState([]);

    const { currentUser } = useSelector(state => state.user);

    const isLoggedIn = !!currentUser; // Check if currentUser is not null or undefined

    useEffect(() => {
        fetchPostDetails();
    }, []);

    const fetchPostDetails = async () => {
        try {
            const response = await fetch(`/api/forums/view/${postId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const postData = await response.json();
            setPost(postData);

            // Assuming you have the current user's ID available
            const currentUserId = currentUser._id; // Replace this with actual logic to retrieve current user's ID
            const isLikedByCurrentUser = postData.likes.includes(currentUserId);

            setIsLiked(isLikedByCurrentUser);
        } catch (error) {
            console.error('Error fetching post details:', error);
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`/api/forums/comment/${postId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, // Include the token
                },
                body: JSON.stringify({ content: commentContent }),
            });
            if (!response.ok) {
                throw new Error('Failed to add comment');
            }
            await response.json();
            // Refresh the page
            window.location.reload();
        } catch (error) {
            console.error('Error adding reply:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        const fileObjs = files.map((file) => ({
            file,
            url: URL.createObjectURL(file),
        }));
        setSelectedFiles((prevFiles) => [...prevFiles, ...fileObjs]);

        // Log file names to the console
        files.forEach(file => console.log(`File added: ${file.name}`));
    };

    const handleRemoveFile = (index) => {
        setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    const handleAttachmentClick = () => {
        document.getElementById('fileInput').click();
    };

    useEffect(() => {
        // Cleanup object URLs when component unmounts
        return () => {
            selectedFiles.forEach(file => URL.revokeObjectURL(file.url));
        };
    }, [selectedFiles]);

    const handleLike = async () => {
        // Optimistically toggle the isLiked state and update the likes array
        const wasLiked = isLiked;
        const currentUserID = currentUser._id; // Replace this with actual logic to retrieve current user's ID
        setIsLiked(!wasLiked);

        if (wasLiked) {
            // If it was liked, remove the user's ID from the likes array
            setPost(prevPost => ({
                ...prevPost,
                likes: prevPost.likes.filter(id => id !== currentUserID)
            }));
        } else {
            // If it was not liked, add the user's ID to the likes array
            setPost(prevPost => ({
                ...prevPost,
                likes: [...prevPost.likes, currentUserID]
            }));
        }

        try {
            const response = await fetch(`/api/forums/like/${postId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    // Include authorization header if needed
                },
                body: JSON.stringify({ userId: currentUserID })
            });

            if (!response.ok) {
                throw new Error('Failed to update like status');
            }

            // If the server updates successfully, you can optionally refresh the post data
            // or rely on the optimistic update already performed
        } catch (error) {
            console.error('Error updating like status:', error);
            // Revert the UI changes if the request fails
            setIsLiked(wasLiked);
            // Revert likes array update
            setPost(prevPost => ({
                ...prevPost,
                likes: wasLiked ? [...prevPost.likes, currentUserID] : prevPost.likes.filter(id => id !== currentUserID)
            }));
            // Show an error message to the user
        }
    };


    const [showDropdown, setShowDropdown] = useState(false);
    const toggleDropdown = () => setShowDropdown(!showDropdown);
    const [replies, setReplies] = useState({}); // Holds reply texts for each comment

    const [activeReplyBox, setActiveReplyBox] = useState(null);
    const [repliesVisibility, setRepliesVisibility] = useState({});


    const toggleReplyBox = (commentId) => {
        setActiveReplyBox(activeReplyBox === commentId ? null : commentId);
    };

    const toggleRepliesVisibility = (commentId) => {
        setRepliesVisibility({
            ...repliesVisibility,
            [commentId]: !repliesVisibility[commentId]
        });
    };

    const handleReplyChange = (commentId, text) => {
        setReplies(prevReplies => ({ ...prevReplies, [commentId]: text }));
    };


    const handleReplyComment = async (commentId) => {
        console.log('Comment ID:', commentId); // Log the comment ID

        const replyContent = replies[commentId];
        if (!replyContent) return; // Optionally, add more validation

        try {
            const response = await fetch(`/api/forums/comment/reply/${commentId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ content: replyContent }) // Ensure this matches the server's expected structure
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('Reply submitted successfully', data);

            // Update the UI accordingly, e.g., clear the reply text
            setReplies(prevReplies => ({ ...prevReplies, [commentId]: '' }));
            // Optionally, fetch updated comments here to include the new reply
        } catch (error) {
            console.error('Failed to submit reply:', error);
            // Handle the error (e.g., show an error message to the user)
        }
    };

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const openModal = (index) => {
        setSelectedImageIndex(index);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const nextImage = () => {
        setSelectedImageIndex((prevIndex) => (prevIndex + 1) % post.attachments.length);
    };

    const prevImage = () => {
        setSelectedImageIndex((prevIndex) => (prevIndex - 1 + post.attachments.length) % post.attachments.length);
    };

    useEffect(() => {
        if (modalIsOpen) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }

        // Cleanup function to remove the class when the component unmounts
        return () => {
            document.body.classList.remove('no-scroll');
        };
    }, [modalIsOpen]);

    const [notification, setNotification] = useState('');

    const handleLikeClick = () => {
        if (!isLoggedIn) {
            setNotification('You must be logged in to like a post.');
            setTimeout(() => setNotification(''), 3000); // Clear notification after 3 seconds
        } else {
            handleLike(postId);
        }
    };

    if (!post) {
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
        <div className='flex flex-col min-h-screen'>
            <Header />
            <main className='flex-grow bg-[#f8f8fb] no-scrollbar font-medium text-slate-700'>

                <div className='flex flex-col gap-8 mx-auto max-w-6xl p-2 lg:px-24'>

                    <div className='flex gap-1 mt-10 items-center'>
                        <Link to='/Forums'>
                            <button className='bg-white border shadow px-4 py-1 mr-2 rounded-md hover:bg-slate-200 transition ease-in-out'>Forums</button>
                        </Link>
                        <IoMdArrowDropdown className='-rotate-90 text-2xl text-blue-600' />
                        <button className='bg-white border shadow px-4 py-1 ml-2 rounded-md hover:bg-slate-200 transition ease-in-out'>{post.title}</button>
                    </div>
                    <div className='border shadow p-4 rounded-md bg-white'>
                        <div className='flex gap-4'>
                            {
                                post.author.role === 'scholarship_provider' ? (
                                    <Link to={`/profile-preview/${post.author._id}`}>
                                        <img
                                            src={post.author.profilePicture}
                                            alt={`${post.author.username}'s profile`}
                                            className='w-12 h-12 rounded-full object-cover hover:border-blue-600 hover:border-2 cursor-pointer ease-in-out transition'
                                        />
                                    </Link>
                                ) : post.author.role === 'applicant' ? (
                                    <Link to={`/others-profile/${post.author._id}`}>
                                        <img
                                            src={post.author.profilePicture}
                                            alt={`${post.author.username}'s profile`}
                                            className='w-12 h-12 rounded-full object-cover hover:border-blue-600 hover:border-2 cursor-pointer ease-in-out transition'
                                        />
                                    </Link>
                                ) : post.author.role === 'admin' ? (
                                    <Link to={`/admin-profile/${post.author._id}`}>
                                        <img
                                            src={post.author.profilePicture}
                                            alt={`${post.author.username}'s profile`}
                                            className='w-12 h-12 rounded-full object-cover hover:border-blue-600 hover:border-2 cursor-pointer ease-in-out transition'
                                        />
                                    </Link>
                                ) : (
                                    <Link to={`/other-profile/${post.author._id}`}>
                                        <img
                                            src={post.author.profilePicture}
                                            alt={`${post.author.username}'s profile`}
                                            className='w-12 h-12 rounded-full object-cover hover:border-blue-600 hover:border-2 cursor-pointer ease-in-out transition'
                                        />
                                    </Link>
                                )
                            }
                            <div className='flex flex-col'>
                                <span className='font-bold text-lg'>{post.author.username}</span>
                                <span className='text-sm text-slate-500'>
                                    {new Date(post.createdAt).toLocaleString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: 'numeric',
                                        minute: 'numeric',
                                        hour12: true,
                                    })}
                                </span>
                            </div>
                        </div>
                        <div className='mt-6 flex flex-col gap-2 pl-2'>
                            <span className='text-left text-3xl font-bold'>{post.title}</span>
                            <span className='text-sm font-normal'>{post.content}</span>
                        </div>
                        <div>
                            {post.attachments && post.attachments.length > 0 && (
                                <div className='mt-10'>
                                    <div className={`grid gap-2 ${post.attachments.length === 1 ? 'grid-cols-1' : post.attachments.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                                        {post.attachments.slice(0, 3).map((attachment, index) => {
                                            const url = new URL(attachment);
                                            const pathname = url.pathname;
                                            const isImage = pathname.match(/\.(jpeg|jpg|gif|png)$/i);

                                            return isImage ? (
                                                <div key={index} className='relative flex items-center justify-center'>
                                                    <img
                                                        src={attachment}
                                                        alt={`Attachment ${index + 1}`}
                                                        className='object-cover rounded-md cursor-pointer'
                                                        onClick={() => openModal(index)}
                                                        onLoad={() => console.log(`Image ${index + 1} loaded successfully.`)}
                                                        onError={(e) => {
                                                            console.error(`Failed to load image ${index + 1}: ${attachment}`);
                                                            e.target.onerror = null;
                                                            e.target.src = 'fallback-image-url';
                                                        }}
                                                    />
                                                    {index === 2 && post.attachments.length > 3 && (
                                                        <div
                                                            className='absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-lg font-bold cursor-pointer'
                                                            onClick={() => openModal(index)}
                                                        >
                                                            +{post.attachments.length - 3} more
                                                        </div>
                                                    )}
                                                </div>
                                            ) : null;
                                        })}
                                    </div>
                                    <div className='mt-4'>
                                        {post.attachments.slice(0, 3).map((attachment, index) => {
                                            const url = new URL(attachment);
                                            const pathname = url.pathname;
                                            const isImage = pathname.match(/\.(jpeg|jpg|gif|png)$/i);
                                            const isPDF = pathname.match(/\.pdf$/i);
                                            const isDOCX = pathname.match(/\.docx$/i);
                                            const fileName = decodeURIComponent(pathname.substring(pathname.lastIndexOf('/') + 1));
                                            const cleanFileName = fileName
                                                .replace(/^forum_uploads\//, '') // Remove 'forum_uploads/'
                                                .replace(/_\d{8}\.docx$/, '.docx'); // Remove date at the end if it's a .docx file

                                            return !isImage ? (
                                                <a
                                                    key={index}
                                                    href={attachment}
                                                    target='_blank'
                                                    rel='noopener noreferrer'
                                                    className='text-blue-600 underline flex items-center mt-2'
                                                    download={cleanFileName} // This sets the file name for download
                                                >
                                                    {isPDF && <FaFilePdf className='w-4 h-4 mr-2' />}
                                                    {isDOCX && <FaFileWord className='w-4 h-4 mr-2' />}
                                                    {cleanFileName}
                                                </a>
                                            ) : null;
                                        })}
                                    </div>

                                </div>
                            )}

                            <Modal
                                isOpen={modalIsOpen}
                                onRequestClose={closeModal}
                                contentLabel="Image Modal"
                                className="fixed inset-0 flex items-center justify-center z-50"
                                overlayClassName="fixed inset-0 bg-black bg-opacity-75"
                            >
                                <button onClick={closeModal} className="absolute top-5 right-10 mt-2 mr-2 text-white text-4xl">&times;</button>
                                {post.attachments && post.attachments.length > 0 && (
                                    <div className="relative flex items-center justify-center p-5 rounded-lg w-3/4 h-3/4 max-w-3xl max-h-3xl overflow-auto">
                                        <img src={post.attachments[selectedImageIndex]} alt="Selected" className="max-w-full max-h-full object-contain" />
                                    </div>
                                )}
                                <button onClick={prevImage} className="group absolute left-10 top-1/2 transform -translate-y-1/2 text-white text-4xl px-4 py-10 rounded-lg hover:bg-gray-100">
                                    <div className="group-hover:text-black">
                                        <FaChevronLeft />
                                    </div>
                                </button>
                                <button onClick={nextImage} className="group absolute right-10 top-1/2 transform -translate-y-1/2 text-white text-4xl px-4 py-10 rounded-lg hover:bg-gray-100">
                                    <div className="group-hover:text-black">
                                        <FaChevronRight />
                                    </div>
                                </button>
                            </Modal>
                        </div>
                        <div className='border-t mt-4'>
                            <div className='flex flex-row justify-between mt-3 gap-2'>
                                <div className='flex flex-row gap-2'>
                                    {notification && (
                                        <div className="fixed top-4 right-4 bg-red-500 text-white p-3 rounded-md shadow-lg">
                                            {notification}
                                        </div>
                                    )}
                                    <div className='flex flex-row gap-1 px-2' onClick={handleLikeClick}>
                                        {isLiked ? (
                                            <>
                                                <FaHeart className='w-6 h-6 font-bold text-blue-600' />
                                                <span>Unlike</span>
                                            </>
                                        ) : (
                                            <>
                                                <FaRegHeart className='w-6 h-6 font-bold text-blue-600' />
                                                <span>Like</span>
                                            </>
                                        )}
                                    </div>
                                    <div className='flex flex-row gap-1'>
                                        <BiCommentDots className='w-6 h-6 text-blue-600' />
                                        <span>{post.totalComments}</span>
                                    </div>
                                </div>
                                <div className='flex gap-2'>
                                    <div className='flex flex-row gap-1 px-2'>
                                        <FaRegHeart className='w-6 h-6 font-bold text-blue-600' />
                                        <span>{post.totalLikes}</span>
                                    </div>
                                    <div className='flex flex-row gap-1 pr-2'>
                                        <FaRegEye className='w-6 h-6 text-blue-600' />
                                        <span>{post.totalViews}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className='border-t'>
                        {isLoggedIn ? (
                            <form onSubmit={handleCommentSubmit} className="bg-white p-8 rounded-md shadow mb-8 mx-auto">
                                <textarea
                                    className="w-full p-4 border rounded-md mb-4 focus:outline-blue-200 resize-none"
                                    placeholder="Write your reply..."
                                    value={commentContent}
                                    onChange={(e) => setCommentContent(e.target.value)}
                                    required
                                />
                                <div className='w-full flex justify-end items-center'>
                                    <button
                                        type="button"
                                        className='bg-blue-600 p-3 rounded-md mx-2 hover:bg-blue-800 flex items-center justify-center'
                                        onClick={handleAttachmentClick}
                                    >
                                        <AiOutlinePaperClip className='w-6 h-6 text-white' />
                                    </button>
                                    <input
                                        type="file"
                                        id="fileInput"
                                        className="hidden"
                                        multiple
                                        onChange={handleFileChange}
                                    />
                                    <button
                                        type="submit"
                                        className={`bg-blue-600 text-white p-3 rounded-md mx-2 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-800 transition ease-in-out'}`}
                                        disabled={loading}
                                    >
                                        {loading ? 'Adding...' : 'Add Reply'}
                                    </button>
                                </div>
                                {selectedFiles.length > 0 && (
                                    <div className="mt-4">
                                        <h4 className="font-medium mb-2">Attached Files:</h4>
                                        <ul className="grid grid-cols-2 gap-4">
                                            {selectedFiles.map((fileObj, index) => (
                                                <li key={index} className="flex flex-col items-center justify-center space-y-2 p-2 border rounded-md shadow-sm h-40">
                                                    {fileObj.file.type.startsWith('image/') ? (
                                                        <>
                                                            <img
                                                                src={fileObj.url}
                                                                alt={fileObj.file.name}
                                                                className="w-24 h-24 object-cover rounded-md shadow"
                                                            />
                                                            <span className="text-sm text-gray-600 text-center">{fileObj.file.name}</span>
                                                        </>
                                                    ) : fileObj.file.type === 'application/pdf' ? (
                                                        <div className="flex flex-col items-center justify-center h-full">
                                                            <AiFillFilePdf className="w-8 h-8 text-red-600" />
                                                            <a href={fileObj.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-center">
                                                                {fileObj.file.name}
                                                            </a>
                                                        </div>
                                                    ) : fileObj.file.type === 'application/msword' || fileObj.file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ? (
                                                        <div className="flex flex-col items-center justify-center h-full">
                                                            <AiFillFileWord className="w-8 h-8 text-blue-600" />
                                                            <a href={fileObj.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-center">
                                                                {fileObj.file.name}
                                                            </a>
                                                        </div>
                                                    ) : (
                                                        <a href={fileObj.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-center">
                                                            {fileObj.file.name}
                                                        </a>
                                                    )}
                                                    <button
                                                        type="button"
                                                        className="text-red-600 hover:text-red-800"
                                                        onClick={() => handleRemoveFile(index)}
                                                    >
                                                        Remove
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </form>
                        ) : (
                            <p className="text-red-500 bg-white p-8 rounded-md shadow mb-8 mx-auto text-center">You must be logged in to reply to this post.</p>
                        )}

                        <div onClick={toggleDropdown} className='mt-4 px-4 py-2 border flex bg-white rounded-md w-48 shadow cursor-pointer hover:bg-slate-200 group'>
                            <div className='flex flex-row justify-between w-full'>
                                <div>
                                    <span>Sort by: </span>
                                    <span>Newest</span>
                                </div>
                                <IoMdArrowDropdown className='w-6 h-6 text-blue-600 group-hover:-rotate-90' />
                            </div>
                        </div>

                        {showDropdown && (
                            <div className='absolute w-52 bg-white rounded-md shadow-lg mt-2 py-2 justify-start'>
                                <button className='px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full'>Newest</button>
                                <button className='px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full'>Oldest</button>
                                <button className='px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full'>Most Liked</button>
                            </div>
                        )
                        }

                        <div className="my-8">
                            {/* Header for the comments section */}
                            <h2 className="text-2xl font-bold mb-4">Replies <span className='text-blue-600'>({post.comments.length})</span></h2>

                            {/* Loop through each comment in the post */}
                            {post.comments.map(comment => (
                                <div key={comment._id} className='flex gap-2 w-full mb-4'>
                                    {/* User avatar */}

                                    <Link to={'/others-profile'}>
                                        <img
                                            src={comment.author.profilePicture || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToiRnzzyrDtkmRzlAvPPbh77E-Mvsk3brlxQ&s'}
                                            alt={`${comment.author.username}'s profile`}
                                            className='w-10 h-10 mt-2 rounded-full object-cover hover:border-blue-600 hover:border-2 cursor-pointer ease-in-out transition'
                                        />
                                    </Link>
                                    {/* Comment container */}
                                    <div className='flex flex-col bg-white border rounded-md w-full shadow'>
                                        {/* Comment content */}
                                        <div className='flex flex-col'>
                                            <div className='pt-4'>
                                                <span className='p-4 text-lg font-bold'>{comment.author.username}</span>
                                                <span className='text-sm text-gray-500'>
                                                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                                                </span>
                                            </div>

                                            <span className='p-4 text-sm border-b'>{comment.content}</span>
                                        </div>
                                        {/* Comment actions: likes, replies, views */}
                                        <div className='flex flex-row justify-between px-4 py-2 gap-2'>
                                            <div className='flex flex-row gap-2'>
                                                {/* Like button and count */}
                                                <div className='flex flex-row gap-1 px-2'>
                                                    <FaRegHeart className='w-6 h-6 font-bold text-blue-600' />
                                                    <span>{comment.likes ? comment.likes.length : 0}</span>
                                                </div>

                                                {/* Reply button and count */}
                                                <div className='flex flex-row gap-1' onClick={() => toggleReplyBox(comment._id)}>
                                                    <BiCommentDots className='w-6 h-6 text-blue-600' />
                                                    <span>{comment.replies ? comment.replies.length : 0}</span>
                                                </div>
                                            </div>

                                            {/* View count */}
                                            {/* <div className='flex flex-row gap-1 pr-2'>
                                                <FaRegEye className='w-6 h-6 text-blue-600' />
                                                <span>{comment.views ? comment.views : 'N/A'}</span>
                                            </div> */}
                                        </div>

                                        {/* View replies link */}
                                        {comment.replies && comment.replies.length > 0 && (
                                            <div className='px-4 py-2'>
                                                <span
                                                    className='text-blue-600 cursor-pointer'
                                                    onClick={() => toggleRepliesVisibility(comment._id)}
                                                >
                                                    {repliesVisibility[comment._id]
                                                        ? 'Hide replies'
                                                        : comment.replies.length === 1
                                                            ? 'View 1 reply'
                                                            : `View all ${comment.replies.length} replies`}
                                                </span>
                                            </div>
                                        )}

                                        {/* Replies, shown if repliesVisibility matches the comment ID */}
                                        {repliesVisibility[comment._id] && (
                                            <div className="px-4 py-2">
                                                {comment.replies.map(reply => (
                                                    <div key={reply._id} className="flex gap-4 w-full items-start mb-4">
                                                        {/* User avatar */}
                                                        <img
                                                            src={reply.author.profilePicture}
                                                            alt={`${reply.author.username}'s profile`}
                                                            className="w-10 h-10 rounded-full object-cover"
                                                        />
                                                        <div className="flex flex-col bg-white border border-gray-200 rounded-lg w-full shadow-sm p-4">
                                                            <div className="flex justify-between items-center mb-2">
                                                                <span className="text-sm font-semibold text-gray-700">{reply.author.username}</span>
                                                                <span className="text-xs text-gray-500">
                                                                    {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                                                                </span>
                                                            </div>
                                                            <p className="text-sm text-gray-800 mb-2">{reply.content}</p>
                                                            <div className="flex gap-4 mt-2">
                                                                {/* Like button and count */}
                                                                <div className='flex flex-row gap-1 px-2'>
                                                                    <FaRegHeart className='w-6 h-6 font-bold text-blue-600' />
                                                                    <span>{comment.likes ? comment.likes.length : 0}</span>
                                                                </div>

                                                                {/* Reply button and count */}
                                                                <div className='flex flex-row gap-1' onClick={() => toggleReplyBox(comment._id)}>
                                                                    <BiCommentDots className='w-6 h-6 text-blue-600' />
                                                                    <span>{comment.replies ? comment.replies.length : 0}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Reply box, shown if activeReplyBox matches the comment ID */}
                                        {activeReplyBox === comment._id && (
                                            <div className="p-4">
                                                <textarea
                                                    className="w-full border rounded-md p-2"
                                                    placeholder="Write a reply..."
                                                    value={replies[comment._id] || ''}
                                                    onChange={(e) => handleReplyChange(comment._id, e.target.value)}
                                                ></textarea>
                                                <button
                                                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md"
                                                    onClick={() => handleReplyComment(comment._id)}
                                                >
                                                    Reply
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
