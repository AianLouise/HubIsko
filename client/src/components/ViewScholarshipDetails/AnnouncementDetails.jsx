import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaRegHeart, FaRegEye } from 'react-icons/fa';
import { BiCommentDots } from 'react-icons/bi';
import AddCommentForm from './AddCommentForm';

const AnnouncementDetails = () => {
    const { announcementId } = useParams();
    const [announcement, setAnnouncement] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnnouncement = async () => {
            try {
                const response = await fetch(`/api/announcement/get/${announcementId}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setAnnouncement(data);

                // Log all comments with username and profilePicture
                data.comments.forEach(comment => {
                    if (comment.author) {
                        console.log(`Username: ${comment.author.username}, ProfilePicture: ${comment.author.profilePicture}`);
                    } else {
                        console.log('Author information is missing for a comment');
                    }
                });
            } catch (err) {
                setError('Failed to fetch announcement');
            } finally {
                setLoading(false);
            }
        };

        fetchAnnouncement();
    }, [announcementId]);

    const handleCommentAdded = (newComment) => {
        setAnnouncement((prev) => ({
            ...prev,
            comments: [...prev.comments, newComment]
        }));
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="flex justify-center items-center pt-7 pb-7 bg-gray-100">
            <div className="bg-white border p-4 rounded-md flex flex-col gap-4 transition ease-in-out max-w-4xl w-full">
                <div className="flex gap-2">
                    <div className="w-12 h-12 rounded-md overflow-hidden">
                        <img src={announcement.scholarshipProgram.scholarshipImage} alt="Scholarship" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold">{announcement.scholarshipProgram.organizationName}</span>
                        <span className="text-blue-600">{announcement.scholarshipProgram.title}</span>
                    </div>
                </div>
                <div className="bg-slate-200 p-4 rounded-md">
                    <h1 className="text-2xl font-bold text-blue-600">{announcement.title}</h1>
                    <p className="text-gray-700">
                        <span className="text-blue-600 font-bold">@Students:</span> {announcement.content}
                    </p>
                </div>
                <p className="text-sm flex items-end justify-end w-full text-slate-600">
                    Announced: {new Date(announcement.date).toLocaleDateString()}
                </p>
                <div className="border-t mt-2">
                    <div className="flex flex-row justify-between mt-2 gap-2">
                        <div className="flex flex-row gap-2">
                            <div className="flex flex-row gap-1 px-2">
                                <FaRegHeart className="w-6 h-6 font-bold text-blue-600" />
                                <span>123</span>
                            </div>
                            <div className="flex flex-row gap-1">
                                <BiCommentDots className="w-6 h-6 text-blue-600" />
                                <span>10</span>
                            </div>
                        </div>
                        <div className="flex flex-row gap-1 pr-2">
                            <FaRegEye className="w-6 h-6 text-blue-600" />
                            <span>1.2k</span>
                        </div>
                    </div>
                </div>

                <div className="mt-4">
                    <h2 className="text-xl font-bold">Comments</h2>
                    {announcement.comments.map((comment, index) => (
                        <div key={index} className="bg-white p-2 rounded-md mt-2 flex gap-2">
                            <div className="w-10 h-10 rounded-full overflow-hidden">
                                <img src={comment.author.profilePicture} alt={comment.author.username} className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <p className="font-bold">{comment.author.username}</p>
                                <p>{comment.content}</p>
                                <p className="text-sm text-gray-500">{new Date(comment.date).toLocaleDateString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
                
                <AddCommentForm announcementId={announcementId} onCommentAdded={handleCommentAdded} />
            </div>
        </div>
    );
};

export default AnnouncementDetails;