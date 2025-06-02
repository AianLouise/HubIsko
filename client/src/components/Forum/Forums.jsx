import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaRegHeart, FaUser, FaBuilding } from "react-icons/fa";
import { BiCommentDots } from "react-icons/bi";
import { FiSearch } from 'react-icons/fi';
import { IoIosNotifications } from 'react-icons/io';
import { useSelector } from 'react-redux';
import ForumsIcon from '../../assets/ForumsIcon.png';

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
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    // Sample categories - you can replace with actual categories from your API
    const categories = [
        { id: 'all', name: 'All Posts' },
        { id: 'announcements', name: 'Announcements' },
        { id: 'discussions', name: 'Discussions' },
        { id: 'questions', name: 'Questions' },
        { id: 'resources', name: 'Resources' }
    ];

    useEffect(() => {
        fetchRecentPosts();
    }, [selectedCategory]);

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
            setError('Failed to load posts. Please try again later.');
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
                    navigate(`/provider-forums/post/${postId}`);
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

    const filteredPosts = recentPosts
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .filter(post => {
            const searchQueryLower = searchQuery.toLowerCase();
            const authorName = post.author.role === 'applicant'
                ? `${post.author.applicantDetails.firstName} ${post.author.applicantDetails.lastName}`.toLowerCase()
                : post.author.role === 'admin'
                    ? `${post.author.username}`.toLowerCase()
                    : `${post.author.scholarshipProviderDetails.organizationName}`.toLowerCase();

            const matchesSearch = post.title.toLowerCase().includes(searchQueryLower) ||
                post.content.toLowerCase().includes(searchQueryLower) ||
                authorName.includes(searchQueryLower);
                
            const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
            
            return matchesSearch && matchesCategory;
        });

    const truncateText = (text, maxLength) => {
        if (text.length <= maxLength) {
            return text;
        }
        return text.substring(0, maxLength) + '...';
    };

    const getTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        
        if (diffInSeconds < 60) {
            return `${diffInSeconds} second${diffInSeconds !== 1 ? 's' : ''} ago`;
        }
        
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) {
            return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
        }
        
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) {
            return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
        }
        
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 30) {
            return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
        }
        
        const diffInMonths = Math.floor(diffInDays / 30);
        if (diffInMonths < 12) {
            return `${diffInMonths} month${diffInMonths !== 1 ? 's' : ''} ago`;
        }
        
        const diffInYears = Math.floor(diffInMonths / 12);
        return `${diffInYears} year${diffInYears !== 1 ? 's' : ''} ago`;
    };

    const getRoleIcon = (role) => {
        switch (role) {
            case 'applicant':
                return <FaUser className="text-blue-600" />;
            case 'scholarship_provider':
                return <FaBuilding className="text-green-600" />;
            case 'admin':
                return <IoIosNotifications className="text-red-600" />;
            default:
                return <FaUser className="text-gray-600" />;
        }
    };

    return (
        <div className='flex flex-col min-h-screen bg-gray-50'>
            {/* Hero Banner */}
            <div className='bg-gradient-to-r from-blue-700 to-blue-500 py-12 px-4 sm:px-6 lg:px-8'>
                <div className='max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between'>
                    <div className='lg:max-w-xl mb-8 lg:mb-0 text-center lg:text-left'>
                        <h1 className='text-4xl md:text-5xl font-bold text-white mb-4'>
                            Welcome to the HubIsko Forums
                        </h1>
                        <p className='text-xl text-blue-100 mb-6'>
                            Connect, share, and learn with our community of scholars and providers
                        </p>
                        <button 
                            onClick={handleCreatePostClick}
                            className='bg-white text-blue-700 hover:bg-blue-50 font-medium py-3 px-6 rounded-lg flex items-center justify-center shadow-lg transition transform hover:scale-105'
                        >
                            <FaPlus className="mr-2" />
                            Start a New Discussion
                        </button>
                    </div>
                    <div className='lg:max-w-sm'>
                        <img 
                            src={ForumsIcon} 
                            alt='Forums Icon' 
                            className='rounded-xl shadow-2xl mx-auto max-h-60 object-contain bg-white p-4' 
                        />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className='flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                {/* Search and Filters */}
                <div className='mb-8 bg-white rounded-xl p-6 shadow-md'>
                    <div className='flex flex-col lg:flex-row items-center justify-between gap-4'>
                        <div className='relative w-full lg:w-2/3'>
                            <input
                                type="text"
                                placeholder='Search by title, content, or author...'
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className='w-full border border-gray-300 p-4 pl-12 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700'
                            />
                            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        </div>
                        <button
                            onClick={handleCreatePostClick}
                            className='w-full lg:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 px-6 rounded-lg flex items-center justify-center transition'
                        >
                            <FaPlus className="mr-2" />
                            Create Post
                        </button>
                    </div>

                    {/* Categories */}
                    <div className='mt-6 flex flex-wrap gap-2'>
                        {categories.map(category => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                                    selectedCategory === category.id
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Notification */}
                {notification && (
                    <div className="fixed top-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50 animate-fade-in-down">
                        {notification}
                    </div>
                )}

                {/* Forum Posts */}
                <div className='bg-white rounded-xl shadow-md overflow-hidden'>
                    <div className='border-b border-gray-200 bg-gray-50 px-6 py-4'>
                        <h2 className='text-xl font-bold text-gray-800'>Recent Discussions</h2>
                    </div>

                    {loading ? (
                        <div className='flex justify-center items-center py-16'>
                            <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
                        </div>
                    ) : error ? (
                        <div className='text-center py-16 text-red-500'>{error}</div>
                    ) : filteredPosts.length > 0 ? (
                        <div className='divide-y divide-gray-200'>
                            {filteredPosts.map((post) => (
                                <div 
                                    key={post._id} 
                                    className='p-6 hover:bg-gray-50 transition cursor-pointer'
                                    onClick={() => handlePostClick(post._id)}
                                >
                                    <div className='flex items-start space-x-4'>
                                        <div className='flex-shrink-0 relative'>
                                            <img
                                                src={post.author.profilePicture || 'https://via.placeholder.com/50?text=User'}
                                                alt={`${post.author.role === 'applicant'
                                                    ? `${post.author.applicantDetails.firstName} ${post.author.applicantDetails.lastName}`
                                                    : post.author.role === 'admin'
                                                        ? `${post.author.username}`
                                                        : `${post.author.scholarshipProviderDetails.organizationName}`}'s profile`}
                                                className='w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm'
                                            />
                                            <div className='absolute -bottom-1 -right-1 bg-white rounded-full p-0.5'>
                                                {getRoleIcon(post.author.role)}
                                            </div>
                                        </div>
                                        
                                        <div className='flex-1 min-w-0'>
                                            <div className='flex items-center justify-between mb-1'>
                                                <div>
                                                    <span className='font-semibold text-gray-900'>
                                                        {post.author.role === 'applicant'
                                                            ? `${post.author.applicantDetails.firstName} ${post.author.applicantDetails.lastName}`
                                                            : post.author.role === 'admin'
                                                                ? `${post.author.username}`
                                                                : `${post.author.scholarshipProviderDetails.organizationName}`}
                                                    </span>
                                                    <span className='text-sm text-gray-500 ml-2'>
                                                        {getTimeAgo(post.createdAt)}
                                                    </span>
                                                </div>
                                                
                                                {post.category && (
                                                    <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
                                                        {post.category}
                                                    </span>
                                                )}
                                            </div>
                                            
                                            <h3 className='text-lg font-medium text-gray-900 mb-2 line-clamp-1'>{post.title}</h3>
                                            
                                            <div className='text-sm text-gray-600 mb-3 line-clamp-2' style={{ whiteSpace: 'pre-wrap' }}>
                                                {truncateText(post.content, 200)}
                                            </div>
                                            
                                            <div className='flex items-center space-x-4 text-sm text-gray-500'>
                                                <div className='flex items-center'>
                                                    <FaRegHeart className='mr-1.5 h-4 w-4 text-gray-400' />
                                                    <span>{post.totalLikes || 0}</span>
                                                </div>
                                                <div className='flex items-center'>
                                                    <BiCommentDots className='mr-1.5 h-4 w-4 text-gray-400' />
                                                    <span>{post.totalComments || 0}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className='text-center py-16 text-gray-500'>
                            <BiCommentDots className='mx-auto h-12 w-12 text-gray-300' />
                            <p className='mt-2 text-lg'>No discussions found</p>
                            <p className='text-sm text-gray-400 mt-1'>
                                {searchQuery ? 'Try adjusting your search' : 'Be the first to start a discussion!'}
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}