import User from "../models/user.model.js";
import ScholarshipProgram from "../models/scholarshipProgram.model.js"; // Import the ScholarshipProgram model
import ForumPost from "../models/forumPost.model.js"; // Import the ForumPost model
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import ActivityLog from '../models/activityLog.model.js'; // Adjust the import path as necessary

export const test = (req, res) => {
    res.json({
        message: 'API is working!',
    });
};

export const getUserById = async (req, res) => {
    try {
        const userId = req.params.id; // Get the user ID from the URL
        console.log(`Received userId: ${userId}`); // Log the userId to the console
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

        // Fetch the user's details
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find forum posts by author (user ID)
        const forumPosts = await ForumPost.find({ author: userId });

        if (!forumPosts.length) {
            return res.status(404).json({ message: 'No forum posts found for this user' });
        }

        // Determine the name based on the user's role
        let name;
        if (user.role === 'scholarship_provider') {
            name = user.scholarshipProviderDetails.organizationName;
        } else {
            name = `${user.applicantDetails.firstName} ${user.applicantDetails.lastName}`;
        }

        // Calculate total likes and total comments
        const totalLikes = forumPosts.reduce((sum, post) => sum + post.likes.length, 0);
        const totalComments = forumPosts.reduce((sum, post) => sum + post.comments.length, 0);

        // Send the forum posts, name, profile picture, total likes, and total comments as a JSON response
        res.json({
            name,
            profilePicture: user.profilePicture,
            forumPosts,
            totalLikes,
            totalComments
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const editUserInfo = async (req, res) => {
    try {
        const { userId } = req.params;
        const { applicantDetails } = req.body; // Destructure applicantDetails from the request body

        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user information by iterating over applicantDetails keys
        Object.keys(applicantDetails).forEach((key) => {
            if (applicantDetails[key]) {
                user.applicantDetails[key] = applicantDetails[key];
            }
        });

        // Save the updated user information
        await user.save();

        // Create an activity log entry for editing user information
        const activityLog = new ActivityLog({
            userId: userId,
            action: 'EDIT_USER_INFO',
            type: 'account',
            details: `User information updated for ${user.applicantDetails.firstName} ${user.applicantDetails.lastName}`
        });

        await activityLog.save();
        console.log('Activity log saved:', activityLog);

        // Send the updated user information as a JSON response
        res.json({ message: 'User information updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const editAddress = async (req, res) => {
    try {
        const { userId } = req.params;
        const { address } = req.body; // Extract the address object from the request body

        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user's address information
        if (address) {
            user.applicantDetails.address = { ...user.applicantDetails.address, ...address };
        }

        // Save the updated user information
        await user.save();

        // Create an activity log entry for editing the address
        const activityLog = new ActivityLog({
            userId: userId,
            action: 'EDIT_ADDRESS',
            type: 'account',
            details: `Address updated for ${user.applicantDetails.firstName} ${user.applicantDetails.lastName}`
        });

        await activityLog.save();
        console.log('Activity log saved:', activityLog);

        // Send the updated user information as a response
        res.json({ message: 'Address updated successfully', user });
    } catch (error) {
        // Handle server errors
        console.error('Error updating address:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

export const editEducation = async (req, res) => {
    try {
        const { userId } = req.params;
        const { education } = req.body; // Extract the education object from the request body

        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user's education information
        if (education) {
            user.applicantDetails.education = { ...user.applicantDetails.education, ...education };
        }

        // Save the updated user information
        await user.save();

        // Create an activity log entry for editing the education
        const activityLog = new ActivityLog({
            userId: userId,
            action: 'EDIT_EDUCATION',
            type: 'account',
            details: `Education updated for ${user.applicantDetails.firstName} ${user.applicantDetails.lastName}`
        });

        await activityLog.save();
        console.log('Activity log saved:', activityLog);

        // Send the updated user information as a response
        res.json({ message: 'Education updated successfully', user });
    } catch (error) {
        // Handle server errors
        console.error('Error updating education:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

export const requestEmailUpdate = async (req, res) => {
    try {
        const userId = req.params.userId; // Ensure this matches your route parameter
        const { newEmail } = req.body;

        // Check if the new email already exists
        const existingUser = await User.findOne({ email: newEmail });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Generate a verification token
        const emailVerificationToken = jwt.sign(
            { userId, newEmail },
            process.env.JWT_SECRET,
            { expiresIn: '1d' } // Token expires in 1 day
        );

        // Update the user with the new email and verification token
        const user = await User.findByIdAndUpdate(userId, { newEmail, emailVerificationToken }, { new: true });

        // Email setup
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        // Use the environment variable for the base URL
        const baseUrl = process.env.BASE_URL || 'http://localhost:5173';
        const verificationUrl = `${baseUrl}/verify-email-update?token=${emailVerificationToken}`;

        await transporter.sendMail({
            from: '"HubIsko" <yourappemail@example.com>',
            to: newEmail,
            subject: 'Verify Your New Email',
            html: `
                <div style="max-width: 600px; margin: auto; border: 1px solid #e0e0e0; padding: 30px; font-family: Arial, sans-serif; background-color: #ffffff; border-radius: 10px;">
                    <h2 style="color: #0047ab; text-align: center; margin-bottom: 25px; font-size: 24px;">Verify Your New Email</h2>
                    <p style="font-size: 18px; color: #333; text-align: center; margin-top: 25px;">Hello,</p>
                    <p style="font-size: 16px; color: #555; text-align: center; line-height: 1.5;">Please click the button below to verify your new email address:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${verificationUrl}" style="background-color: #0047ab; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 5px; font-size: 18px; display: inline-block;">Verify Email</a>
                    </div>
                    <p style="font-size: 16px; color: #555; text-align: center; line-height: 1.5;">If the button above does not work, please copy and paste the following link into your browser:</p>
                    <p style="font-size: 16px; color: #0047ab; text-align: center;"><a href="${verificationUrl}" style="color: #0047ab; text-decoration: underline;">${verificationUrl}</a></p>
                    <p style="font-size: 14px; color: #888; text-align: center; margin-top: 30px;">If you did not request this change, please ignore this email.</p>
                </div>
            `,
        });

        res.status(200).json({ message: 'Verification email sent. Please check your inbox.' });
    } catch (error) {
        console.error('Error requesting email update:', error);
        res.status(500).json({ message: 'Failed to request email update' });
    }
};


// Function to verify email
export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;

        // Find the user by verification token
        const user = await User.findOne({ emailVerificationToken: token });
        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        // Update the user's email and clear the verification token
        user.email = user.newEmail;
        user.newEmail = undefined;
        user.emailVerificationToken = undefined;

        // Save the user document
        await user.save();

        // Create an activity log entry for verifying the email
        const activityLog = new ActivityLog({
            userId: user._id,
            action: 'VERIFY_EMAIL',
            type: 'account',
            details: `Email verified for ${user.email}`
        });

        await activityLog.save();
        console.log('Activity log saved:', activityLog);

        res.json({ message: 'Email verified successfully' });
    } catch (error) {
        console.error('Error verifying email:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

export const updateProfile = async (req, res) => {
    const { userId } = req.params; // Get userId from request params
    const { profilePicture } = req.body;

    try {
        // Validate incoming data
        if (!profilePicture) {
            return res.status(400).json({ message: 'Profile picture is required' });
        }

        // Find and update the user profile
        const updatedUser = await User.findByIdAndUpdate(
            userId, // Use userId from params
            {
                profilePicture, // URL of the uploaded profile picture
            },
            { new: true } // Return the updated user
        );

        // Check if the user was found and updated
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Create an activity log entry for updating the profile picture
        const activityLog = new ActivityLog({
            userId: userId,
            action: 'UPDATE_PROFILE_PICTURE',
            type: 'account',
            details: `Profile picture updated for ${updatedUser.applicantDetails.firstName} ${updatedUser.applicantDetails.lastName}`
        });

        await activityLog.save();
        console.log('Activity log saved:', activityLog);

        // Respond with the updated user data
        res.status(200).json({
            message: 'Profile updated successfully',
            user: updatedUser
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }
};