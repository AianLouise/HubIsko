import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaRegHeart, FaRegEye } from 'react-icons/fa';
import { BiCommentDots } from 'react-icons/bi';

const ProviderForumPost = () => {
  const { id } = useParams(); // Extract provider ID from URL parameters
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchForumPosts = async () => {
      try {
        const response = await fetch(`/api/adminprofile/provider/${id}/forum-posts`);
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching forum posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchForumPosts();
  }, [id]);

  const handlePostClick = (postId) => {
    // Handle post click if needed
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + '...';
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

  const filteredPosts = Array.isArray(posts) ? posts : []; // Ensure filteredPosts is always an array

  return (
    <div className='grid grid-cols-1 sm:grid-rows-1 gap-8 pb-12'>
      {filteredPosts.length === 0 ? (
        <div className='flex flex-col items-center justify-center gap-4 h-96'>
          <p>No posts available.</p>
        </div>
      ) : (
        filteredPosts
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort posts by creation date in descending order
          .map((post) => (
            <Link to={`/admin-forums/post/${post._id}`} key={post._id}>
              <div
                className='flex flex-col gap-2 px-8 py-6 border rounded-md bg-white shadow cursor-pointer hover:bg-slate-100 hover:-translate-y-1 transition ease-in-out'
                onClick={() => handlePostClick(post._id)}
              >
                <div className='flex flex-row gap-3'>
                  <img
                    src={post.profilePicture || 'default-profile-pic-url'} // Use a default profile picture if not available
                    alt={`${post.username}'s profile`}
                    className='w-12 h-12 rounded-full object-cover' // Add object-cover to maintain aspect ratio
                  />
                  <div className='flex flex-col'>
                    <span className='font-medium'>{post.organizationName}</span>
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
                {truncateText(post.content, 500)} {/* Adjust the maxLength as needed */}

                {/* Attachments Section */}
                {post.attachments && post.attachments.length > 0 && (
                  <div className='flex flex-wrap gap-2 mt-4'>
                    {post.attachments.map((attachment, index) => (
                      <a
                        href={attachment}
                        target='_blank'
                        rel='noopener noreferrer'
                        key={index}
                        className='w-24 h-24 border rounded-md overflow-hidden'
                      >
                        <img
                          src={attachment}
                          alt={`attachment-${index}`}
                          className='w-full h-full object-cover'
                        />
                      </a>
                    ))}
                  </div>
                )}

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
            </Link>
          ))
      )}
    </div>
  );
};

export default ProviderForumPost;