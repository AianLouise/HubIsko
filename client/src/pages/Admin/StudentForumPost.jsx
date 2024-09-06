import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaRegHeart, FaRegEye } from 'react-icons/fa';
import { BiCommentDots } from 'react-icons/bi';

export default function StudentForumPost() {
    const { id } = useParams(); // Assuming the user ID is passed as a URL parameter

    const [forumPosts, setForumPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchForumPosts = async () => {
            try {
                const response = await fetch(`/api/admin/user/${id}/forum-posts`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setForumPosts(data.data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchForumPosts();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className='border-2 rounded-md p-10 flex flex-col justify-center items-center bg-white h-96 mb-20'>
            <h2 className='text-xl font-bold mb-4'>Forum Posts</h2>
            {forumPosts.length === 0 ? (
                <span>No forum posts found.</span>
            ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {forumPosts.map((post) => (
                        <div key={post._id} className='bg-white font-normal border p-4 rounded-md flex flex-col hover:-translate-y-1 hover:shadow-lg transition ease-in-out'>
                            <p>{post.content}</p>
                            <span className='text-sm flex items-end justify-end w-full text-slate-600'>
                                Posted: {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                            <div className='border-t mt-2'>
                                <div className='flex flex-row justify-between mt-2 gap-2'>
                                    <div className='flex flex-row gap-2'>
                                        <div className='flex flex-row gap-1 px-2'>
                                            <FaRegHeart className='w-6 h-6 font-bold text-blue-600' />
                                            <span>{post.likes}</span>
                                        </div>
                                        <div className='flex flex-row gap-1'>
                                            <BiCommentDots className='w-6 h-6 text-blue-600' />
                                            <span>{post.comments}</span>
                                        </div>
                                    </div>
                                    <div className='flex flex-row gap-1 pr-2'>
                                        <FaRegEye className='w-6 h-6 text-blue-600' />
                                        <span>{post.views}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}