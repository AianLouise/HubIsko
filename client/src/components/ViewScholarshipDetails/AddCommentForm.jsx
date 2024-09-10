import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const AddCommentForm = ({ announcementId, onCommentAdded }) => {
    const { currentUser } = useSelector((state) => state.user);
    const [content, setContent] = useState('');
    const [error, setError] = useState(null);

    const handleAddComment = async () => {
        try {
            const response = await fetch(`/api/announcement/${announcementId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ author: currentUser, content })
            });
            if (!response.ok) {
                throw new Error('Failed to add comment');
            }
            const data = await response.json();
            onCommentAdded(data.comment);
            setContent('');
        } catch (err) {
            setError('Failed to add comment');
        }
    };

    return (
        <div className="mt-4">
            <h2 className="text-xl font-bold">Add a Comment</h2>
            {error && <p className="text-red-500">{error}</p>}
            <div className="flex flex-col mt-2">
                <textarea
                    placeholder="Your Comment"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="border p-2 rounded-md w-full"
                />
                <div className="flex justify-end mt-2">
                    <button
                        onClick={handleAddComment}
                        className="bg-blue-600 text-white p-2 rounded-md"
                    >
                        Add Comment
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddCommentForm;