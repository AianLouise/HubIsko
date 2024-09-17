import React, { useState, useEffect } from 'react';
import { FaRegHeart, FaRegEye } from "react-icons/fa";
import { BiCommentDots } from "react-icons/bi";
import { Link } from 'react-router-dom';

const ScholarshipProviderPosts = ({ userId }) => {
  const [posts, setPosts] = useState([]);
  const [username, setUsername] = useState('');
  const [profilePicture, setProfilePicture] = useState('');

  // Function to fetch forum posts by user ID
  const fetchPosts = async () => {
    try {
      const response = await fetch(`/api/profile/forum-posts/${userId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (data && data.forumPosts) {
        setPosts(data.forumPosts); // Set forum posts
        setUsername(data.username); // Set username
        setProfilePicture(data.profilePicture); // Set profile picture
      } else {
        setPosts([]); // Set to empty array if no forum posts
        setUsername(''); // Clear username if no forum posts
        setProfilePicture(''); // Clear profile picture if no forum posts
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      setPosts([]); // Set to empty array on error
      setUsername(''); // Clear username on error
      setProfilePicture(''); // Clear profile picture on error
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [userId]);

  return (
    <div>
      <div className='grid grid-cols-1 sm:grid-rows-1 gap-8 pb-12'>
        {posts.length === 0 ? (
          <div className="flex justify-center items-center h-28">
            <p>No posts available.</p>
          </div>
        ) : (
          posts
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort posts by creation date in descending order
            .map((post) => (
              <Link to={`/forums/post/${post._id}`} key={post._id}>
                <div className='flex flex-col gap-2 px-8 py-6 border rounded-md bg-white shadow cursor-pointer hover:bg-slate-100 hover:-translate-y-1 transition ease-in-out' onClick={() => handlePostClick(post._id)}>
                  <div className='flex flex-row gap-3'>
                    <img
                      src={profilePicture || 'default-profile-pic-url'} // Use a default profile picture if not available
                      alt={`${username}'s profile`}
                      className='w-12 h-12 rounded-full object-cover' // Add object-cover to maintain aspect ratio
                    />
                    <div className='flex flex-col'>
                      <span className='font-medium'>{username}</span>
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
                      <div className='flex flex-row gap-1 pr-2'>
                        <FaRegEye className='w-6 h-6 text-blue-600' />
                        <span>{post.views}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))
        )}
      </div>
    </div>
  );
};

export default ScholarshipProviderPosts;