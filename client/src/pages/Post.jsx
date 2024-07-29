import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FaRegHeart, FaHeart, FaRegEye } from "react-icons/fa";
import { BiCommentDots } from "react-icons/bi";
import { IoMdArrowDropdown } from "react-icons/io";
import moment from 'moment';


export default function ForumDetail() {
    const [loading, setLoading] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [commentContent, setCommentContent] = useState('');

    const { currentUser } = useSelector(state => state.user);

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
            const newComment = await response.json();
            // Update post state to include new comment
            setPost(prevPost => ({
                ...prevPost,
                comments: [...prevPost.comments, newComment],
            }));
            setCommentContent('');
        } catch (error) {
            console.error('Error adding comment:', error);
        } finally {
            setLoading(false);
        }
    };

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

    if (!post) {
        return <div>Loading...</div>;
    }

    return (
        <div className='flex flex-col min-h-screen'>
            <Header />
            <main className='flex-grow bg-[#f8f8fb] no-scrollbar font-medium'>

                <div className='flex flex-col gap-8 mx-auto max-w-6xl px-24'>

                    <div className='flex gap-1 mt-10 items-center'>
                        <Link to='/Forums'>
                            <button className='bg-white border shadow px-4 py-1 mr-2 rounded-md hover:bg-slate-200 transition ease-in-out'>Forums</button>
                        </Link>
                        <IoMdArrowDropdown className='-rotate-90 text-2xl text-blue-600' />
                        <button className='bg-white border shadow px-4 py-1 ml-2 rounded-md hover:bg-slate-200 transition ease-in-out'>{post.title}</button>
                    </div>
                    <div className='border shadow p-4 rounded-md bg-white'>
                        <div className='flex gap-4'>
                            <img
                                src={post.author.profilePicture}
                                alt={`${post.author.username}'s profile`}
                                className='w-12 h-12 rounded-full object-cover'
                            />
                            <div className='flex flex-col'>
                                <span className='font-bold text-lg'>{post.author.username}</span>
                                <span className='text-sm text-gray-500'>{moment(post.createdAt).format('MMMM DD, YYYY')}</span>
                            </div>
                        </div>
                        <div className='mt-6 flex flex-col gap-2 pl-2'>
                            <span className='text-left text-3xl font-bold'>{post.title}</span>
                            <span className='text-sm font-normal'>{post.content}</span>
                        </div>
                        <div className='border-t mt-4'>
                            <div className='flex flex-row justify-between mt-3 gap-2'>


                                <div className='flex flex-row gap-2'>
                                    <div className='flex flex-row gap-1 px-2' onClick={() => handleLike(postId)}>
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
                        <form onSubmit={handleCommentSubmit} className="bg-white p-8 rounded-md shadow mb-8">
                            <h2 className="text-2xl font-bold mb-4">Add Comment</h2>
                            <textarea
                                className="w-full p-4 border rounded-md mb-4"
                                placeholder="Write your comment..."
                                value={commentContent}
                                onChange={(e) => setCommentContent(e.target.value)}
                                required
                            />
                            <button
                                type="submit"
                                className={`bg-blue-600 text-white p-3 rounded-md ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-800 transition ease-in-out'}`}
                                disabled={loading}
                            >
                                {loading ? 'Adding...' : 'Add Comment'}
                            </button>
                        </form>

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
                            <h2 className="text-2xl font-bold mb-4">Comments ({post.comments.length})</h2>

                            {/* Loop through each comment in the post */}
                            {post.comments.map(comment => (
                                <div key={comment._id} className='flex gap-2 w-full items-center mb-4'>
                                    {/* User avatar */}
                                    <img
                                        src={comment.author.profilePicture}
                                        alt={`${comment.author.username}'s profile`}
                                        className='w-12 h-12 rounded-full object-cover'
                                    />
                                    {/* Comment container */}
                                    <div className='flex flex-col bg-white border rounded-md w-full shadow'>
                                        {/* Comment content */}
                                        <span className='p-4 text-sm border-b'>{comment.content}</span>

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
                                            <div className='flex flex-row gap-1 pr-2'>
                                                <FaRegEye className='w-6 h-6 text-blue-600' />
                                                <span>{comment.views ? comment.views : 'N/A'}</span>
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
                                                    <div key={reply._id} className='flex gap-2 w-full items-center mb-2'>
                                                        {/* User avatar */}
                                                        <img
                                                            src={reply.author.profilePicture}
                                                            alt={`${reply.author.username}'s profile`}
                                                            className='w-10 h-10 rounded-full object-cover'
                                                        />
                                                        <div className='flex flex-col bg-gray-100 border rounded-md w-full shadow'>
                                                            <span className='p-2 text-sm border-b'>{reply.content}</span>
                                                            <span className='p-2 text-sm border-b'>Author: {reply.author.username}</span>
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