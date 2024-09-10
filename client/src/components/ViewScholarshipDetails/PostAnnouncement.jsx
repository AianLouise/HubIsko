import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaRegHeart, FaRegEye } from 'react-icons/fa';
import { BiCommentDots } from 'react-icons/bi';
import { useSelector } from 'react-redux';

const AnnouncementModal = ({ isOpen, onClose, onSubmit }) => {
    const { id } = useParams(); // Get the scholarshipProgram ID from the URL
    const { currentUser } = useSelector((state) => state.user);

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        const newAnnouncement = {
            author: currentUser._id,
            scholarshipProgram: id,
            title,
            content,
            status: 'Posted',
        };

        try {
            const response = await fetch(`/api/announcement/create-announcement`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newAnnouncement),
            });

            if (response.ok) {
                // Reset form fields
                setTitle('');
                setContent('');
                alert('Announcement posted successfully!');
                onClose();
            } else {
                alert('Failed to post announcement.');
            }
        } catch (error) {
            console.error('Error posting announcement:', error);
            alert('Error posting announcement.');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-md w-1/2">
                <h2 className="text-2xl font-bold mb-4 text-blue-600">Post Announcement</h2>
                <form onSubmit={handleSubmit} className="mt-4">
                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2" htmlFor="title">
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2" htmlFor="content">
                            Content
                        </label>
                        <textarea
                            id="content"
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            rows="5"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                        ></textarea>
                    </div>
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors duration-300"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300"
                        >
                            Post Announcement
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default function PostAnnouncement() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [announcements, setAnnouncements] = useState([]);
    const [programDetails, setProgramDetails] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortCriteria, setSortCriteria] = useState('date'); // Default sort by date
    const { id } = useParams(); // Get the scholarshipProgram ID from the URL
    const navigate = useNavigate();

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const response = await fetch(`/api/announcement/${id}`);
                const data = await response.json();
                setProgramDetails(data.programDetails);
                setAnnouncements(data.announcements);
            } catch (error) {
                console.error('Error fetching announcements:', error);
            }
        };

        fetchAnnouncements();
    }, [id]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSortChange = (e) => {
        setSortCriteria(e.target.value);
    };

    const handleAnnouncementClick = (announcementId) => {
        navigate(`/announcement/details/${announcementId}`);
    };

    const filteredAnnouncements = announcements
        .filter((announcement) => announcement.status === 'Posted')
        .filter((announcement) =>
            announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            announcement.content.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => {
            if (sortCriteria === 'newest') {
                return new Date(b.date) - new Date(a.date);
            } else if (sortCriteria === 'oldest') {
                return new Date(a.date) - new Date(b.date);
            } else if (sortCriteria === 'title') {
                return a.title.localeCompare(b.title);
            }
            return 0;
        });

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-blue-600">Announcements</h2>
            {programDetails && (
                <div className="mb-4">
                    <h3 className="text-xl font-bold">{programDetails.name}</h3>
                    <p className="text-gray-700">{programDetails.description}</p>
                </div>
            )}
            <p className="text-gray-700">
                You can post announcements here to keep scholars updated on important information.
            </p>
            <button
                onClick={openModal}
                className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300"
            >
                Post Announcement
            </button>
            <AnnouncementModal isOpen={isModalOpen} onClose={closeModal} />
            <div className="mx-10 lg:mx-0 my-10">
                <div className="flex justify-between mb-4">
                    <input
                        type="text"
                        placeholder="Search announcements..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="border p-2 rounded-md"
                    />
                    <select value={sortCriteria} onChange={handleSortChange} className="border p-2 rounded-md">
                        <option value="newest">Sort by Newest</option>
                        <option value="oldest">Sort by Oldest</option>
                        <option value="title">Sort by Title</option>
                    </select>
                </div>
                <div className="grid lg:grid-cols-2 gap-10">
                    {filteredAnnouncements.length > 0 ? (
                        filteredAnnouncements.map((announcement) => (
                            <div
                                key={announcement._id}
                                className="bg-white border p-4 rounded-md flex flex-col gap-4 hover:-translate-y-1 hover:shadow-lg transition ease-in-out cursor-pointer"
                                onClick={() => handleAnnouncementClick(announcement._id)}
                            >
                                <div className="flex gap-2">
                                    <div className="bg-blue-600 w-12 h-12 rounded-md overflow-hidden">
                                        <img src={programDetails.scholarshipImage} alt="Scholarship" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold">{programDetails.organizationName}</span>
                                        <span className="text-blue-600">{programDetails.title}</span>
                                    </div>
                                </div>
                                <div className="bg-slate-200 p-4 rounded-md">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-xl font-bold text-blue-600 mb-2">{announcement.title}</h3>
                                        <span className="text-sm text-slate-600">Announced: {new Date(announcement.date).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-gray-700">
                                        <span className="text-blue-600 font-bold">@Students:</span> {announcement.content}
                                    </p>
                                </div>
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
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-700">No announcements available.</p>
                    )}
                </div>
            </div>
        </div>
    );
}