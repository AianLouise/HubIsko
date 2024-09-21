import ForumPost from '../models/forumPost.model.js';
import Announcement from '../models/announcement.model.js';

export const test = (req, res) => {
    res.json({
        message: 'API is working!',
    });
};

// Function to get all forum posts
export const getAllForumPosts = async (req, res) => {
    try {
        const forumPosts = await ForumPost.find(); // Fetch all forum posts from the database
        res.json(forumPosts); // Send the forum posts as a JSON response
    } catch (error) {
        console.error('Error fetching forum posts:', error);
        res.status(500).json({ message: 'Error fetching forum posts' }); // Send an error response
    }
};

// Function to get all forum posts from users with the role "applicant"
export const getApplicantForumPosts = async (req, res) => {
    try {
        const forumPosts = await ForumPost.find()
            .populate({
                path: 'author', // Assuming the field in ForumPost that references the User model is called 'author'
                match: { role: 'applicant' }, // Filter by role 'applicant'
                select: 'name role' // Select only the necessary fields from the User model
            });

        // Filter out posts where the author does not match the role 'applicant'
        const filteredPosts = forumPosts.filter(post => post.author);

        res.json(filteredPosts); // Send the filtered forum posts as a JSON response
    } catch (error) {
        console.error('Error fetching forum posts:', error);
        res.status(500).json({ message: 'Error fetching forum posts' }); // Send an error response
    }
};

// Function to get all forum posts from users with the role "scholarship_provider"
export const getScholarshipProviderForumPosts = async (req, res) => {
    try {
        const forumPosts = await ForumPost.find()
            .populate({
                path: 'author', // Assuming the field in ForumPost that references the User model is called 'author'
                match: { role: 'scholarship_provider' }, // Filter by role 'scholarship_provider'
                select: 'name role' // Select only the necessary fields from the User model
            });

        // Filter out posts where the author does not match the role 'scholarship_provider'
        const filteredPosts = forumPosts.filter(post => post.author);

        res.json(filteredPosts); // Send the filtered forum posts as a JSON response
    } catch (error) {
        console.error('Error fetching forum posts:', error);
        res.status(500).json({ message: 'Error fetching forum posts' }); // Send an error response
    }
};

// Function to get all forum posts from users with the role "admin"
export const getAdminForumPosts = async (req, res) => {
    try {
        const forumPosts = await ForumPost.find()
            .populate({
                path: 'author', // Assuming the field in ForumPost that references the User model is called 'author'
                match: { role: 'admin' }, // Filter by role 'admin'
                select: 'name role' // Select only the necessary fields from the User model
            });

        // Filter out posts where the author does not match the role 'admin'
        const filteredPosts = forumPosts.filter(post => post.author);

        res.json(filteredPosts); // Send the filtered forum posts as a JSON response
    } catch (error) {
        console.error('Error fetching forum posts:', error);
        res.status(500).json({ message: 'Error fetching forum posts' }); // Send an error response
    }
};



// Function to get all announcements
export const getAllAnnouncements = async (req, res) => {
    try {
        const announcements = await Announcement.find(); // Fetch all announcements from the Announcement table
        res.json(announcements); // Send the fetched announcements as a JSON response
    } catch (error) {
        console.error('Error fetching announcements:', error);
        res.status(500).json({ message: 'Error fetching announcements' }); // Send an error response
    }
};