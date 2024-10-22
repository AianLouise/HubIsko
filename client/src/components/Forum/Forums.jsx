import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaPlus, FaStar, FaWrench, FaRegHeart, FaNewspaper } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa6";
import { BiCommentDots } from "react-icons/bi";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import ForumsIcon from '../../assets/ForumsIcon.png';
import { FiSearch } from 'react-icons/fi';

export default function Forums() {
    useEffect(() => {
        document.title = "Forums | HubIsko";
    }, []);

    const navigate = useNavigate();
    const { currentUser } = useSelector((state) => state.user);

    const isLoggedIn = !!currentUser;

    const [recentPosts, setRecentPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notification, setNotification] = useState('');
    const [searchQuery, setSearchQuery] = useState(''); // State for search query

    useEffect(() => {
        fetchRecentPosts();
    }, []);

    const fetchRecentPosts = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/forums/posts');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setRecentPosts(data);
        } catch (error) {
            console.error('Error fetching recent posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePostClick = (postId) => {
        if (!currentUser) {
            setNotification('You must be logged in to view the post.');
            setTimeout(() => setNotification(''), 3000);
        } else {
            switch (currentUser.role) {
                case 'applicant':
                    navigate(`/forums/post/${postId}`);
                    break;
                case 'scholarship_provider':
                    navigate(`/provider/post/${postId}`);
                    break;
                case 'admin':
                    navigate(`/admin/post/${postId}`);
                    break;
                default:
                    setNotification('Invalid user role.');
                    setTimeout(() => setNotification(''), 3000);
                    break;
            }
        }
    };

    const handleCreatePostClick = () => {
        if (!isLoggedIn) {
            setNotification('You must be logged in to create a new post.');
            setTimeout(() => setNotification(''), 3000);
        } else {
            switch (currentUser.role) {
                case 'applicant':
                    navigate('/forums/create-post');
                    break;
                case 'scholarship_provider':
                    navigate('/provider/create-post');
                    break;
                case 'admin':
                    navigate('/admin/create-post');
                    break;
                default:
                    setNotification('Invalid user role.');
                    setTimeout(() => setNotification(''), 3000);
                    break;
            }
        }
    };

    const filteredPosts = recentPosts.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className='flex flex-col min-h-screen'>
            <main className='flex-grow bg-[#f8f8fb] no-scrollbar'>

                <div className='border-b mb-8 pt-12'>
                    <div className='flex flex-col lg:flex-row items-center mx-auto max-w-6xl justify-between lg:px-24'>

                        {/* Mobile na Icon */}
                        <div className='bg-blue-600 w-36 h-36 rounded-md flex lg:hidden items-center justify-center'>
                            <FontAwesomeIcon icon={faComments} className='text-white text-6xl' />
                        </div>

                        <div className='flex flex-col gap-2 text-center lg:text-left lg:w-1/2 pb-8 lg:pb-0'>
                            <h1 className='text-4xl font-bold text-gray-800'>Welcome to the forums!</h1>
                            <p className='text-lg text-slate-500 font-medium'>Join or Browse the discussions!</p>
                        </div>

                        <img src={ForumsIcon} alt='Forums Icon' className='hidden lg:block rounded-md items-center justify-center w-[400px] h-auto mb-1' />

                    </div>
                </div>

                {/* Header */}
                <div className='max-w-6xl mx-auto lg:px-24'>
                    <div className='flex flex-col gap-2 lg:gap-0 lg:flex-row justify-between'>

                        {/* Mobile Search Bar */}
                        <div className='block mx-2 lg:hidden'>
                            <input
                                type="text"
                                placeholder='Search Posts'
                                name=""
                                id=""
                                className='border-2 p-2 px-6 w-full lg:w-0 text-lg font-medium rounded-md focus:outline-blue-400' />
                        </div>

                        <div className='block lg:hidden mx-2 mt-5'>
                            <div className='border-b'></div>
                            <div className='text-slate-500 font-medium text-center -translate-y-3'>
                                <span className='bg-[#f8f8fb] px-4'>OR</span>
                            </div>
                        </div>

                        <div className='flex flex-row lg:items-center lg:justify-center gap-4'>
                            <select
                                name="postFilter"
                                id="postFilter"
                                className="bg-white border rounded-lg p-3 h-12 w-60 text-left hidden lg:block"
                                aria-label="Filter posts by type"
                            >
                                <option value="all">All posts</option>
                                <option value="myPosts">My posts</option>
                            </select>

                            {notification && (
                                <div className="fixed top-4 right-4 bg-red-500 text-white p-3 rounded-md shadow-lg">
                                    {notification}
                                </div>
                            )}

                            <button
                                onClick={handleCreatePostClick}
                                className="flex gap-2 w-full lg:w-[187.062px] mx-2 lg:mx-0 items-center lg:justify-center bg-blue-600 p-3 h-12 rounded-md border hover:bg-blue-800 transition ease-in-out"
                            >
                                <FaPlus className="w-5 h-5 text-white" />
                                <span className="font-medium text-white">Create a New post</span>
                            </button>
                        </div>

                        <div className='hidden lg:block'>
                            <div className='relative'>
                                <input
                                    type="text"
                                    placeholder='Search Posts'
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className='border p-3 h-12 w-full font-medium rounded-md focus:outline-blue-400 pr-10'
                                />
                                <button className='absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-600'>
                                    <FiSearch className="h-6 w-6" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Forum Posts */}
                <div className='max-w-6xl lg:px-24 px-2 mx-auto mt-10 lg:mt-20'>

                    {/* <div className='flex gap-2 items-center pb-2 font-bold text-lg border-b mb-8'>
                            <FaStar className='text-blue-600' />
                            Featured Posts
                        </div>

                        <div className='grid lg:grid-cols-2 gap-2'>

                            <div className='flex flex-col gap-2 px-8 py-6 border rounded-md bg-white shadow'>
                            <div className='flex flex-row gap-4 mb-2'>
                                <div className='bg-blue-600 rounded-full w-12 h-12 text-white flex items-center justify-center'>
                                <FaWrench className='w-6 h-6' />
                                </div>
                                <div className='flex flex-col'>
                                <span className='font-medium'>Admin</span>
                                <span className='text-sm text-slate-500'>July 10, 2024</span>
                                </div>
                            </div>

                            <span className='font-bold'>Frequently Asked Questions (FAQs)</span>
                            <span className='text-sm'>This Post contains Questions and Answers regarding forums and scholarship listing.</span>
                            <div className='border-t mt-2'>
                                <div className='flex flex-row justify-between mt-3 gap-2'>


                                <div className='flex flex-row gap-2'>
                                    <div className='flex flex-row gap-1 px-2'>
                                    <FaRegHeart className='w-6 h-6 font-bold text-blue-600' />
                                    <span>123</span>
                                    </div>

                                    <div className='flex flex-row gap-1'>
                                    <BiCommentDots className='w-6 h-6 text-blue-600' />
                                    <span>10</span>
                                    </div>
                                </div>

                                <div className='flex flex-row gap-1 pr-2'>
                                    <FaRegEye className='w-6 h-6 text-blue-600' />
                                    <span>1.2k</span>
                                </div>

                                </div>
                            </div>
                            </div>


                            <div className='flex flex-col gap-2 px-8 py-6 border rounded-md bg-white shadow'>
                            <div className='flex flex-row gap-4 mb-2'>
                                <div className='bg-blue-600 rounded-full w-12 h-12 text-white flex items-center justify-center'>
                                <FaWrench className='w-6 h-6' />
                                </div>
                                <div className='flex flex-col'>
                                <span className='font-medium'>Admin</span>
                                <span className='text-sm text-slate-500'>July 10, 2024</span>
                                </div>
                            </div>

                            <span className='font-bold'>System Announcements</span>
                            <span className='text-sm'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Lorem ipsum dolor sit.</span>
                            <div className='border-t mt-2'>
                                <div className='flex flex-row justify-between mt-3 gap-2'>


                                <div className='flex flex-row gap-2'>
                                    <div className='flex flex-row gap-1 px-2'>
                                    <FaRegHeart className='w-6 h-6 font-bold text-blue-600' />
                                    <span>123</span>
                                    </div>

                                    <div className='flex flex-row gap-1'>
                                    <BiCommentDots className='w-6 h-6 text-blue-600' />
                                    <span>10</span>
                                    </div>
                                </div>

                                <div className='flex flex-row gap-1 pr-2'>
                                    <FaRegEye className='w-6 h-6 text-blue-600' />
                                    <span>1.2k</span>
                                </div>
                                </div>
                            </div>
                            </div>
                        </div> */}

                    <div className='flex gap-2 items-center border-b my-4 py-2'>
                        <FaNewspaper className='w-6 h-6 text-blue-600' />
                        <span className='font-bold text-lg'>Recent posts</span>
                    </div>

                    <div className='grid lg:grid-cols-1 gap-6 mb-4'>
                        {filteredPosts.length > 0 ? filteredPosts.map((post) => (
                            <div key={post._id} className='flex flex-col gap-2 px-8 py-6 border rounded-md bg-white shadow cursor-pointer hover:bg-slate-100 hover:-translate-y-1 transition ease-in-out' onClick={() => handlePostClick(post._id)}>
                                <div className='flex flex-row gap-3'>
                                    <img
                                        src={post.author.profilePicture || 'default-profile-pic-url'}
                                        alt={`${post.author.role === 'applicant'
                                            ? `${post.author.applicantDetails.firstName} ${post.author.applicantDetails.lastName}`
                                            : post.author.role === 'admin'
                                                ? `${post.author.username}`
                                                : `${post.author.scholarshipProviderDetails.organizationName}`}'s profile`}
                                        className='w-12 h-12 rounded-full object-cover'
                                    />
                                    <div className='flex flex-col'>
                                        <span className='font-medium'>
                                            {post.author.role === 'applicant'
                                                ? `${post.author.applicantDetails.firstName} ${post.author.applicantDetails.lastName}`
                                                : post.author.role === 'admin'
                                                    ? `${post.author.username}`
                                                    : `${post.author.scholarshipProviderDetails.organizationName}`}
                                        </span>
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
                                <span className='font-bold'>{post.title}</span>
                                <span className='text-sm text-slate-600'>{post.content}</span>
                                <div className='border-t'>
                                    <div className='flex flex-row justify-between mt-3 gap-2'>
                                        <div className='flex flex-row gap-2'>
                                            <div className='flex flex-row gap-1 px-2'>
                                                <FaRegHeart className='w-6 h-6 font-bold text-blue-600' />
                                                <span>{post.totalLikes}</span>
                                            </div>
                                            <div className='flex flex-row gap-1'>
                                                <BiCommentDots className='w-6 h-6 text-blue-600' />
                                                <span>{post.totalComments}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <p className="text-center my-10">No posts found</p>
                        )}
                    </div>

                </div>
            </main >
        </div >
    );
}