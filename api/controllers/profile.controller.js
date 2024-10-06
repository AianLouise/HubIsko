import User from "../models/user.model.js";
import ScholarshipProgram from "../models/scholarshipProgram.model.js"; // Import the ScholarshipProgram model
import ForumPost from "../models/forumPost.model.js"; // Import the ForumPost model
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';

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

        // Send the forum posts, firstName, lastName, and profile picture as a JSON response
        res.json({
            firstName: user.applicantDetails.firstName,
            firstName: user.applicantDetails.firstName,
            lastName: user.applicantDetails.lastName,
            profilePicture: user.profilePicture,
            forumPosts
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

        // Send the updated user information as a response
        res.json({ message: 'Address updated successfully', user });
    } catch (error) {
        // Handle server errors
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

        res.json({ message: 'Email verified successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const updateProfile = async (req, res) => {
    const { userId } = req.params; // Get userId from request params
    const { username, profilePicture } = req.body;

    try {
        // Validate incoming data
        if (!username || !profilePicture) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Find and update the user profile
        const updatedUser = await User.findByIdAndUpdate(
            userId, // Use userId from params
            {
                username,
                profilePicture, // URL of the uploaded profile picture
            },
            { new: true } // Return the updated user
        );

        // Check if the user was found and updated
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

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