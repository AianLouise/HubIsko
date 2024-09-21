import User from '../models/user.model.js'; // Adjust the import path as necessary
import ForumPost from '../models/forumPost.model.js'; // Adjust the import path as necessary
import ScholarshipProgram from '../models/scholarshipProgram.model.js'; // Adjust the import path as necessary

export const test = (req, res) => {
    res.json({
        message: 'API is working!',
    });
};

// Function to get provider details by ID
export const getProviderDetails = async (req, res) => {
    const { id } = req.params; // Extract provider ID from request parameters

    try {
        const provider = await User.findById(id); // Fetch provider details from User table using the ID

        if (!provider) {
            return res.status(404).json({ message: 'Provider not found' }); // Send 404 if provider not found
        }

        res.json(provider); // Send the fetched provider details as a JSON response
    } catch (error) {
        console.error('Error fetching provider details:', error);
        res.status(500).json({ message: 'Error fetching provider details' }); // Send an error response
    }
};

export const getProviderForumPosts = async (req, res) => {
    const { id } = req.params; // Extract provider ID from request parameters

    try {
        const forumPosts = await ForumPost.find({ author: id }); // Fetch forum posts from ForumPost table using the provider ID

        if (!forumPosts.length) {
            return res.status(404).json({ message: 'No forum posts found for this provider' }); // Send 404 if no forum posts found
        }

        // Fetch user details for each post
        const forumPostsWithUserDetails = await Promise.all(
            forumPosts.map(async (post) => {
                const user = await User.findById(post.author);
                return {
                    ...post._doc,
                    profilePicture: user.profilePicture,
                    organizationName: user.scholarshipProviderDetails.organizationName,
                };
            })
        );

        res.json(forumPostsWithUserDetails); // Send the fetched forum posts with user details as a JSON response
    } catch (error) {
        console.error('Error fetching forum posts:', error);
        res.status(500).json({ message: 'Error fetching forum posts' }); // Send an error response
    }
};

// Function to get provider scholarship programs by provider ID
export const getProviderScholarshipPrograms = async (req, res) => {
    const { id } = req.params; // Extract provider ID from request parameters

    try {
        const scholarshipPrograms = await ScholarshipProgram.find({ providerId: id }); // Fetch scholarship programs from ScholarshipProgram table using the provider ID

        if (!scholarshipPrograms.length) {
            return res.status(404).json({ message: 'No scholarship programs found for this provider' }); // Send 404 if no scholarship programs found
        }

        res.json(scholarshipPrograms); // Send the fetched scholarship programs as a JSON response
    } catch (error) {
        console.error('Error fetching scholarship programs:', error);
        res.status(500).json({ message: 'Error fetching scholarship programs' }); // Send an error response
    }
};