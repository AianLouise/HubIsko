import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaRegHeart } from 'react-icons/fa';
import { BiCommentDots } from 'react-icons/bi';
import { formatDistanceToNow } from 'date-fns';
import { AiFillFilePdf, AiFillFileWord } from 'react-icons/ai';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { IoMdArrowDropdown } from "react-icons/io";
import Modal from 'react-modal';
import { useSelector } from 'react-redux';

const CommentsSection = ({ post, toggleReplyBox, toggleRepliesVisibility, repliesVisibility, activeReplyBox, replies, handleReplyChange, handleReplyComment }) => {

    const { currentUser } = useSelector((state) => state.user);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [currentComment, setCurrentComment] = useState(null);

    const [sortOption, setSortOption] = useState('Newest');
    const [sortedComments, setSortedComments] = useState(post.comments);

    const openModal = (index, comment) => {
        if (comment) {
            setSelectedImageIndex(index);
            setCurrentComment(comment);
            setIsModalOpen(true);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const nextImage = () => {
        const images = currentComment.attachmentUrls.filter(att => att.fileType.startsWith('image/'));
        if (images.length > 0) {
            setSelectedImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }
    };

    const prevImage = () => {
        const images = currentComment.attachmentUrls.filter(att => att.fileType.startsWith('image/'));
        if (images.length > 0) {
            setSelectedImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
        }
    };

    // Ref for the dropdown
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setShowDropdown(false);
        }
    };

    const handleSort = (option) => {
        setSortOption(option);
        setShowDropdown(false);
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        let sorted = [...post.comments];
        if (sortOption === 'Newest') {
            sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else if (sortOption === 'Oldest') {
            sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        } else if (sortOption === 'Most Liked') {
            sorted.sort((a, b) => (b.likes ? b.likes.length : 0) - (a.likes ? a.likes.length : 0));
        }
        setSortedComments(sorted);
    }, [sortOption, post.comments]);

    const totalComments = post.comments.length;
    const totalReplies = post.comments.reduce((acc, comment) => acc + (comment.replies ? comment.replies.length : 0), 0);
    const totalCommentsAndReplies = totalComments + totalReplies;

    return (
        <div className="my-8">
            <div onClick={toggleDropdown} className='mt-4 px-4 py-2 border flex bg-white rounded-md w-48 shadow cursor-pointer hover:bg-slate-200 group'>
                <div className='flex flex-row justify-between w-full'>
                    <div>
                        <span>Sort by: </span>
                        <span>{sortOption}</span>
                    </div>
                    <IoMdArrowDropdown className='w-6 h-6 text-blue-600 group-hover:-rotate-90' />
                </div>
            </div>

            {showDropdown && (
                <div ref={dropdownRef} className='absolute w-52 bg-white rounded-md shadow-lg mt-2 py-2 justify-start'>
                    <button onClick={() => handleSort('Newest')} className='px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full'>Newest</button>
                    <button onClick={() => handleSort('Oldest')} className='px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full'>Oldest</button>
                    <button onClick={() => handleSort('Most Liked')} className='px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full'>Most Liked</button>
                </div>
            )}

            {/* Header for the comments section */}
            <h2 className="text-2xl font-bold mb-4 mt-4">
                Replies <span className='text-blue-600'>({totalCommentsAndReplies})</span>
            </h2>

            {/* Loop through each comment in the post */}
            {sortedComments.map(comment => (
                <div key={comment._id} className='flex gap-2 w-full mb-4'>
                    {/* User avatar */}
                    <Link to={`/profile/${comment.author._id}`}>
                        <img
                            src={comment.author.profilePicture || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToiRnzzyrDtkmRzlAvPPbh77E-Mvsk3brlxQ&s'}
                            alt={`${comment.author.applicantDetails.firstName}'s profile`}
                            className='w-10 h-10 mt-2 rounded-full object-cover hover:border-blue-600 hover:border-2 cursor-pointer ease-in-out transition'
                        />
                    </Link>
                    {/* Comment container */}
                    <div className='flex flex-col bg-white border rounded-md w-full shadow'>
                        {/* Comment content */}
                        <div className='flex flex-col px-4 pt-4'>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-lg font-semibold text-gray-700">{post.author.applicantDetails.firstName} {post.author.applicantDetails.lastName}</span>
                                <span className="text-xs text-gray-500">
                                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                                </span>
                            </div>

                            <span className='p-4 text-sm border-b'>{comment.content}</span>

                            {/* Display attachment if it exists */}
                            {Array.isArray(comment.attachmentUrls) && comment.attachmentUrls.length > 0 && (
                                <div className='p-4 border-t'>
                                    {/* Display images */}
                                    <div className='grid grid-cols-2 gap-4'>
                                        {comment.attachmentUrls
                                            .filter(att => att.fileType.startsWith('image/'))
                                            .slice(0, 3)
                                            .map((att, index) => (
                                                <div key={index} className="w-full h-48 rounded-md shadow-sm overflow-hidden">
                                                    <img
                                                        src={att.url}
                                                        alt={`Attachment ${index + 1}`}
                                                        className="w-full h-full object-cover cursor-pointer"
                                                        onClick={() => openModal(index, comment)}
                                                    />
                                                </div>
                                            ))}
                                        {comment.attachmentUrls.filter(att => att.fileType.startsWith('image/')).length > 3 && (
                                            <div
                                                className="relative w-full h-48 rounded-md shadow-sm overflow-hidden cursor-pointer"
                                                onClick={() => openModal(3, comment)}
                                            >
                                                <img
                                                    src={comment.attachmentUrls.filter(att => att.fileType.startsWith('image/'))[3].url}
                                                    alt="More attachments"
                                                    className="w-full h-full object-cover opacity-50"
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 text-white text-lg font-bold">
                                                    +{comment.attachmentUrls.filter(att => att.fileType.startsWith('image/')).length - 3} more
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Display PDFs and DOCX files */}
                                    <div className='mt-4'>
                                        {comment.attachmentUrls
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
                                isOpen={isModalOpen}
                                onRequestClose={closeModal}
                                contentLabel="Image Modal"
                                className="fixed inset-0 flex items-center justify-center z-50"
                                overlayClassName="fixed inset-0 bg-black bg-opacity-75"
                            >
                                <button onClick={closeModal} className="absolute top-5 right-10 mt-2 mr-2 text-white text-4xl">&times;</button>
                                {currentComment && currentComment.attachmentUrls && currentComment.attachmentUrls.length > 0 && (
                                    <div className="relative flex items-center justify-center p-5 rounded-lg w-3/4 h-3/4 max-w-3xl max-h-3xl overflow-auto">
                                        {currentComment.attachmentUrls.filter(att => att.fileType.startsWith('image/')).length > 0 && (
                                            <img
                                                src={currentComment.attachmentUrls.filter(att => att.fileType.startsWith('image/'))[selectedImageIndex]?.url}
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

                        {/* Comment actions: likes, replies, views */}
                        <div className='flex flex-row justify-between px-4 py-3 gap-2'>
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
                                            alt={`${post.author.applicantDetails.firstName}'s profile`}
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                        <div className="flex flex-col bg-white border border-gray-200 rounded-lg w-full shadow-sm p-4">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm font-semibold text-gray-700">{post.author.applicantDetails.firstName} {post.author.applicantDetails.lastName}</span>
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
                                {currentUser ? (
                                    <>
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
                                    </>
                                ) : (
                                    <p className="text-red-600">You must be logged in to reply to comments.</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CommentsSection;