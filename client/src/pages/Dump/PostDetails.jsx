import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { FaRegHeart, FaRegEye } from "react-icons/fa";
import moment from 'moment';
import { BiCommentDots } from "react-icons/bi";

const PostDetails = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [commentContent, setCommentContent] = useState('');
  const [loading, setLoading] = useState(false);

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
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming you're storing the token in localStorage
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
  

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-[#f8f8fb] no-scrollbar">
        <div className="border-b mb-8 py-8">
          <div className="flex items-center mx-auto max-w-6xl justify-between px-24">
            <div className="flex flex-col gap-2 w-1/2">
              <h1 className="text-4xl font-bold text-gray-800">{post.title}</h1>
              <p className="text-lg text-slate-500 font-medium">Posted by {post.author.username} on {moment(post.createdAt).format('MMMM DD, YYYY')}</p>
            </div>
            <div className="bg-blue-600 w-36 h-36 my-8 rounded-md"></div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-24">
          <div className="flex flex-row justify-between mb-8">
            {/* Add any additional headers or filters here if needed */}
          </div>

          {/* Display the post content */}
          <div className="bg-white p-8 rounded-md shadow mb-8">
            <p className="text-lg font-medium mb-4">{post.content}</p>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <FaRegHeart className="text-blue-600 w-6 h-6" />
                  <span>{post.likes.length}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BiCommentDots className="text-blue-600 w-6 h-6" />
                  <span>{post.comments.length}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FaRegEye className="text-blue-600 w-6 h-6" />
                <span>{post.views}</span>
              </div>
            </div>
          </div>

          {/* Form to add a comment */}
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

          {/* Display existing comments */}
          <div className="bg-white p-8 rounded-md shadow">
            <h2 className="text-2xl font-bold mb-4">Comments ({post.comments.length})</h2>
            {post.comments.map(comment => (
              <div key={comment._id} className="border-b py-4">
                <p className="text-lg font-medium mb-2">{comment.author.username}</p>
                <p className="text-md">{comment.content}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PostDetails;
