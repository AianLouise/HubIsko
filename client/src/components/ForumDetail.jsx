import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FaRegHeart, FaHeart, FaRegEye, FaEdit } from "react-icons/fa";
import { BiCommentDots } from "react-icons/bi";
import { IoMdArrowDropdown } from "react-icons/io";
import Modal from 'react-modal';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { FaFilePdf, FaFileWord } from 'react-icons/fa';
import CommentsSection from '../components/Forum/CommentsSection';
import CommentForm from '../components/Forum/CommentForm';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { AiFillFilePdf, AiFillFileWord } from 'react-icons/ai';
import { FaTrash } from 'react-icons/fa6';
import { MdForum, MdOutlineForum } from 'react-icons/md';


Modal.setAppElement('#root');


export default function ForumDetail() {
    const [loading, setLoading] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [commentContent, setCommentContent] = useState('');
    const [selectedFiles, setSelectedFiles] = useState([]);
    const navigate = useNavigate();
    const storage = getStorage();

    const { currentUser } = useSelector(state => state.user);

    const isLoggedIn = !!currentUser; // Check if currentUser is not null or undefined

    useEffect(() => {
        window.scrollTo(0, 0);
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
            let attachmentUrls = [];

            if (selectedFiles.length > 0) {
                for (const fileObj of selectedFiles) {
                    const file = fileObj.file;
                    const storageRef = ref(storage, `attachmentUrls/${file.name}`);
                    const snapshot = await uploadBytes(storageRef, file);
                    const downloadUrl = await getDownloadURL(snapshot.ref);
                    attachmentUrls.push({ url: downloadUrl, fileType: file.type, fileName: file.name });
                }
            }

            const response = await fetch(`/api/forums/comment/${postId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content: commentContent, attachmentUrls }),
            });

            if (!response.ok) {
                throw new Error('Failed to add post');
            }

            await response.json();
            // Refresh the page
            fetchPostDetails();
            // Clear the comment box
            setCommentContent('');
            setSelectedFiles([]);
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
    const [replies, setReplies] = useState({}); // Holds reply texts for each post

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
        console.log('Comment ID:', commentId); // Log the post ID

        const replyContent = replies[commentId];
        if (!replyContent) return; // Optionally, add more validation

        try {
            const response = await fetch(`/api/forums/comment/reply/${commentId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
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
            fetchPostDetails();
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

    const closeModal2 = () => {
        setModalIsOpen(false);
    };

    const nextImage = () => {
        const images = post.attachmentUrls.filter(att => att.fileType.startsWith('image/'));
        if (images.length > 0) {
            setSelectedImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }
    };

    const prevImage = () => {
        const images = post.attachmentUrls.filter(att => att.fileType.startsWith('image/'));
        if (images.length > 0) {
            setSelectedImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
        }
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

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const handleEdit = () => {
        // Show the edit modal
        setIsEditModalOpen(true);
    };

    const handleDelete = () => {
        // Handle delete action
        console.log(`Delete post with ID: ${post.id}`);
        // Example: call delete API
        setIsDeleteModalOpen(false);
    };

    const openDeleteModal = () => {
        setIsDeleteModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
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
            <main className='flex-grow bg-[#f8f8fb] no-scrollbar font-medium text-slate-700'>

                <div className='flex flex-col gap-8 mx-auto max-w-6xl p-2 lg:px-24'>

                    <div className='flex justify-between items-center mt-10'>
                        <div className='flex gap-1 mt-10 items-center'>
                            <button
                                className='bg-white border shadow px-4 py-1 mr-2 rounded-md hover:bg-slate-200 transition ease-in-out flex items-center gap-2'
                                onClick={() => navigate(-1)}
                            >
                                <MdForum className='text-blue-600' />
                                Forums
                            </button>
                            <IoMdArrowDropdown className='-rotate-90 text-2xl text-blue-600' />
                            <button className='bg-white border shadow px-4 py-1 ml-2 rounded-md hover:bg-slate-200 transition ease-in-out flex items-center gap-2'>
                                <MdOutlineForum className='text-blue-600' />
                                {post.title}
                            </button>
                        </div>

                        {currentUser.role === 'admin' && (
                            <>
                                <div className='flex gap-1 items-center'>
                                    <button
                                        className='bg-blue-600 text-white border shadow px-4 py-1 ml-2 rounded-md hover:bg-blue-700 transition ease-in-out flex items-center'
                                        onClick={handleEdit}
                                    >
                                        <FaEdit className='mr-1' /> Edit
                                    </button>
                                    <button
                                        className='bg-red-600 text-white border shadow px-4 py-1 ml-2 rounded-md hover:bg-red-700 transition ease-in-out flex items-center'
                                        onClick={openDeleteModal}
                                    >
                                        <FaTrash className='mr-1' /> Delete
                                    </button>
                                </div>

                                <Modal
                                    isOpen={isEditModalOpen}
                                    onRequestClose={closeEditModal}
                                    contentLabel="Edit Post"
                                    className="fixed inset-0 flex items-center justify-center z-50"
                                    overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-40"
                                >
                                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full mx-4 md:mx-auto">
                                        <h2 className="text-2xl font-bold mb-4">Edit Post</h2>
                                        <form>
                                            <div className="mb-4">
                                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                                    Title:
                                                </label>
                                                <input
                                                    type="text"
                                                    defaultValue={post.title}
                                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                                    Content:
                                                </label>
                                                <textarea
                                                    defaultValue={post.content}
                                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                ></textarea>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <button
                                                    type="submit"
                                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={closeEditModal}
                                                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </Modal>

                                <Modal
                                    isOpen={isDeleteModalOpen}
                                    onRequestClose={closeDeleteModal}
                                    contentLabel="Delete Confirmation"
                                    className="fixed inset-0 flex items-center justify-center z-50"
                                    overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-40"
                                >
                                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4 md:mx-auto">
                                        <h2 className="text-2xl font-bold mb-4">Confirm Delete</h2>
                                        <p className="mb-4">Are you sure you want to delete this post?</p>
                                        <div className="flex items-center justify-between">
                                            <button
                                                type="button"
                                                onClick={handleDelete}
                                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                            >
                                                Delete
                                            </button>
                                            <button
                                                type="button"
                                                onClick={closeDeleteModal}
                                                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </Modal>
                            </>
                        )}
                    </div>

                    <div className='border shadow p-4 rounded-md bg-white'>
                        <div className='flex gap-4'>
                            <Link to={`/profile/${post.author._id}`}>
                                <img
                                    src={post.author.profilePicture}
                                    alt={`${post.author.username}'s profile`}
                                    className='w-12 h-12 rounded-full object-cover hover:border-blue-600 hover:border-2 cursor-pointer ease-in-out transition'
                                />
                            </Link>
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
                        <div className='mt-6 flex flex-col gap-2 pl-2 pb-4'>
                            <span className='text-left text-3xl font-bold'>{post.title}</span>
                            <span className='text-sm font-normal'>{post.content}</span>
                        </div>
                        <div>
                            {/* Display attachment if it exists */}
                            {Array.isArray(post.attachmentUrls) && post.attachmentUrls.length > 0 && (
                                <div className='p-4 border-t'>
                                    {/* Display images */}
                                    <div className='grid grid-cols-2 gap-4'>
                                        {post.attachmentUrls
                                            .filter(att => att.fileType.startsWith('image/'))
                                            .slice(0, 3)
                                            .map((att, index) => (
                                                <div key={index} className="w-full h-48 rounded-md shadow-sm overflow-hidden">
                                                    <img
                                                        src={att.url}
                                                        alt={`Attachment ${index + 1}`}
                                                        className="w-full h-full object-cover cursor-pointer"
                                                        onClick={() => openModal(index, post)}
                                                    />
                                                </div>
                                            ))}
                                        {post.attachmentUrls.filter(att => att.fileType.startsWith('image/')).length > 3 && (
                                            <div
                                                className="relative w-full h-48 rounded-md shadow-sm overflow-hidden cursor-pointer"
                                                onClick={() => openModal(3, post)}
                                            >
                                                <img
                                                    src={post.attachmentUrls.filter(att => att.fileType.startsWith('image/'))[3].url}
                                                    alt="More attachments"
                                                    className="w-full h-full object-cover opacity-50"
                                                />
                                                {post.attachmentUrls.filter(att => att.fileType.startsWith('image/')).length - 4 > 0 && (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 text-white text-lg font-bold">
                                                        +{post.attachmentUrls.filter(att => att.fileType.startsWith('image/')).length - 4} more
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Display PDFs and DOCX files */}
                                    <div className='mt-4'>
                                        {post.attachmentUrls
                                            .filter(att => att.fileType === 'application/pdf' || att.fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || att.fileType === 'application/msword')
                                            .map((att, index) => (
                                                <div key={index} className="flex items-center space-x-2 mb-2">
                                                    {att.fileType === 'application/pdf' ? (
                                                        <AiFillFilePdf className="w-6 h-6 text-red-600" />
                                                    ) : (
                                                        <AiFillFileWord className="w-6 h-6 text-blue-600" />
                                                    )}
                                                    <a href={att.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                        {att.fileName}
                                                    </a>
                                                </div>
                                            ))}
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
                                {post && post.attachmentUrls && post.attachmentUrls.length > 0 && (
                                    <div className="relative flex items-center justify-center p-5 rounded-lg w-3/4 h-3/4 max-w-3xl max-h-3xl overflow-auto">
                                        {post.attachmentUrls.filter(att => att.fileType.startsWith('image/')).length > 0 && (
                                            <img
                                                src={post.attachmentUrls.filter(att => att.fileType.startsWith('image/'))[selectedImageIndex]?.url}
                                                alt="Selected"
                                                className="max-w-full max-h-full object-contain"
                                            />
                                        )}
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
                            <CommentForm
                                handleCommentSubmit={handleCommentSubmit}
                                commentContent={commentContent}
                                setCommentContent={setCommentContent}
                                handleAttachmentClick={handleAttachmentClick}
                                handleFileChange={handleFileChange}
                                selectedFiles={selectedFiles}
                                handleRemoveFile={handleRemoveFile}
                                loading={loading}
                            />
                        ) : (
                            <p className="text-red-500 bg-white p-8 rounded-md shadow mb-8 mx-auto text-center">You must be logged in to reply to this post.</p>
                        )}


                        <CommentsSection
                            post={post}
                            toggleReplyBox={toggleReplyBox}
                            toggleRepliesVisibility={toggleRepliesVisibility}
                            repliesVisibility={repliesVisibility}
                            activeReplyBox={activeReplyBox}
                            replies={replies}
                            handleReplyChange={handleReplyChange}
                            handleReplyComment={handleReplyComment}
                        />

                    </div>
                </div>
            </main>
        </div>
    );
}
