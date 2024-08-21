import User from "../models/user.model.js";
import ScholarshipProgram from "../models/scholarshipProgram.model.js"; // Import the ScholarshipProgram model
import ForumPost from "../models/forumPost.model.js"; // Import the ForumPost model

export const test = (req, res) => {
    res.json({
        message: 'API is working!',
    });
};

export const getUserById = async (req, res) => {
    try {
        const userId = req.params.id; // Get the user ID from the URL
        const user = await User.findById(userId); // Find the user by ID

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user); // Send the user information as a JSON response
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Function to get scholarship programs by provider ID
export const getScholarshipProgramsByProviderId = async (req, res) => {
    try {
        const providerId = req.params.id; // Get the provider ID from the URL
        const scholarshipPrograms = await ScholarshipProgram.find({ providerId }); // Find scholarship programs by provider ID

        if (!scholarshipPrograms.length) {
            return res.status(404).json({ message: 'No scholarship programs found for this provider' });
        }

        res.json(scholarshipPrograms); // Send the scholarship programs as a JSON response
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Function to get all forum posts by user ID (author)
export const getForumPostsByUserId = async (req, res) => {
    try {
        const userId = req.params.id; // Get the user ID from the URL
        const forumPosts = await ForumPost.find({ author: userId }); // Find forum posts by author (user ID)

        if (!forumPosts.length) {
            return res.status(404).json({ message: 'No forum posts found for this user' });
        }

        res.json(forumPosts); // Send the forum posts as a JSON response
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
