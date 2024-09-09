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

        await announcement.remove();
        res.json({ message: 'Announcement deleted' });
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

        // Fetch the user details for each comment's author
        const commentsWithAuthorDetails = await Promise.all(
            announcement.comments.map(async (comment) => {
                const author = await User.findById(comment.author, 'username profilePicture');
                return {
                    ...comment.toObject(),
                    author: author ? author.toObject() : null
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