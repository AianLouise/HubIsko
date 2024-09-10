// Get all announcements by scholarshipProgram ID
import Announcement from '../models/announcement.model.js';
import ScholarshipProgram from '../models/scholarshipProgram.model.js';
import User from '../models/user.model.js';

// Test route
export const test = (req, res) => {
    res.json({
        message: 'API is working!',
    });
};

// Create a new announcement
export const createAnnouncement = async (req, res) => {
    const { author, scholarshipProgram, title, content, date, status } = req.body;

    const newAnnouncement = new Announcement({
        author,
        scholarshipProgram,
        title,
        content,
        date,
        status,
    });

    try {
        const savedAnnouncement = await newAnnouncement.save();
        res.status(201).json(savedAnnouncement);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all announcements by scholarshipProgram ID and include scholarshipProgram details
export const getAnnouncements = async (req, res) => {
    const { scholarshipProgram } = req.params;

    try {
        // Fetch the scholarship program details
        const programDetails = await ScholarshipProgram.findById(scholarshipProgram);
        if (!programDetails) {
            return res.status(404).json({ message: 'Scholarship program not found' });
        }

        // Fetch the announcements for the scholarship program
        const announcements = await Announcement.find({ scholarshipProgram });

        // Include the scholarship program details in the response
        res.json({ programDetails, announcements });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete an announcement
export const deleteAnnouncement = async (req, res) => {
    const { id } = req.params;

    try {
        const announcement = await Announcement.findById(id);
        if (!announcement) {
            return res.status(404).json({ message: 'Announcement not found' });
        }

        announcement.status = 'Deleted';
        await announcement.save();

        res.json({ message: 'Announcement status updated to Deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAnnouncementById = async (req, res) => {
    const { id } = req.params;

    try {
        // Find the announcement by ID
        const announcement = await Announcement.findById(id);

        if (!announcement) {
            return res.status(404).json({ message: 'Announcement not found' });
        }

        // Find the scholarship program using the scholarshipProgram value in the announcement
        const scholarshipProgram = await ScholarshipProgram.findById(announcement.scholarshipProgram, '_id title scholarshipImage organizationName');
        if (!scholarshipProgram) {
            return res.status(404).json({ message: 'Scholarship Program not found' });
        }

        // Fetch the user details for each comment's author and each reply's author
        const commentsWithAuthorDetails = await Promise.all(
            announcement.comments.map(async (comment) => {
                const author = await User.findById(comment.author, 'username profilePicture');

                // Fetch the user details for each reply's author
                const repliesWithAuthorDetails = await Promise.all(
                    comment.replies.map(async (reply) => {
                        const replyAuthor = await User.findById(reply.author, 'username profilePicture');
                        return {
                            ...reply.toObject(),
                            author: replyAuthor ? replyAuthor.toObject() : null
                        };
                    })
                );

                return {
                    ...comment.toObject(),
                    author: author ? author.toObject() : null,
                    replies: repliesWithAuthorDetails
                };
            })
        );

        // Combine the announcement and scholarship program details
        const result = {
            ...announcement.toObject(),
            comments: commentsWithAuthorDetails,
            scholarshipProgram: scholarshipProgram.toObject()
        };

        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add comment to announcement
export const addCommentToAnnouncement = async (req, res) => {
    const { id } = req.params;
    const { author, content } = req.body;

    try {
        const announcement = await Announcement.findById(id);
        if (!announcement) {
            return res.status(404).json({ message: 'Announcement not found' });
        }

        const newComment = { author, content, date: new Date() };
        announcement.comments.push(newComment);
        await announcement.save();

        res.status(201).json({ message: 'Comment added successfully', comment: newComment });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Like an announcement
export const likeAnnouncement = async (req, res) => {
    try {
        const { userId } = req.body; // Extract userId from request body
        const announcement = await Announcement.findById(req.params.id);
        if (!announcement) {
            return res.status(404).json({ message: 'Announcement not found' });
        }

        // Check if the user has already liked the announcement
        if (!announcement.likedBy.includes(userId)) {
            announcement.likesCount += 1;
            announcement.likedBy.push(userId);
            await announcement.save();
        }

        res.status(200).json({ message: 'Announcement liked', likesCount: announcement.likesCount });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Unlike an announcement
export const unlikeAnnouncement = async (req, res) => {
    try {
        const { userId } = req.body; // Extract userId from request body
        const announcement = await Announcement.findById(req.params.id);
        if (!announcement) {
            return res.status(404).json({ message: 'Announcement not found' });
        }

        // Check if the user has liked the announcement
        const userIndex = announcement.likedBy.indexOf(userId);
        if (userIndex !== -1) {
            announcement.likesCount -= 1;
            announcement.likedBy.splice(userIndex, 1);
            await announcement.save();
        }

        res.status(200).json({ message: 'Announcement unliked', likesCount: announcement.likesCount });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Like a comment
export const likeComment = async (req, res) => {
    try {
        const { userId } = req.body;
        const announcement = await Announcement.findById(req.params.announcementId);
        if (!announcement) {
            return res.status(404).json({ message: 'Announcement not found' });
        }

        const comment = announcement.comments.id(req.params.commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        if (!comment.likedBy.includes(userId)) {
            comment.likesCount += 1;
            comment.likedBy.push(userId);
            await announcement.save();
        }

        res.status(200).json({ message: 'Comment liked', likesCount: comment.likesCount });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Unlike a comment
export const unlikeComment = async (req, res) => {
    try {
        const { userId } = req.body;
        const announcement = await Announcement.findById(req.params.announcementId);
        if (!announcement) {
            return res.status(404).json({ message: 'Announcement not found' });
        }

        const comment = announcement.comments.id(req.params.commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        const userIndex = comment.likedBy.indexOf(userId);
        if (userIndex !== -1) {
            comment.likesCount -= 1;
            comment.likedBy.splice(userIndex, 1);
            await announcement.save();
        }

        res.status(200).json({ message: 'Comment unliked', likesCount: comment.likesCount });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Add a reply to a comment
export const addReply = async (req, res) => {
    try {
        const { userId, content } = req.body;
        const announcement = await Announcement.findById(req.params.announcementId);
        if (!announcement) {
            return res.status(404).json({ message: 'Announcement not found' });
        }

        const comment = announcement.comments.id(req.params.commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        const reply = {
            author: userId,
            content,
            date: new Date()
        };

        comment.replies.push(reply);
        await announcement.save();

        res.status(200).json({ message: 'Reply added', replies: comment.replies });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};