import mongoose from 'mongoose';
import Notification from '../models/notification.model.js';
import Scholarship from '../models/scholarshipProgram.model.js';
import User from '../models/user.model.js';

export const createNotification = async (req, res) => {
    const { applicantId, senderId, scholarshipProgramId, message, type } = req.body;

    try {
        // Validate senderId (assuming senderId is the ID of the current user)
        if (!senderId) {
            return res.status(400).json({ message: 'Sender ID is required' });
        }

        // Fetch the scholarship program details
        const scholarshipProgram = await Scholarship.findById(scholarshipProgramId);
        if (!scholarshipProgram) {
            return res.status(404).json({ message: 'Scholarship Program not found' });
        }

        // Validate message
        if (!message) {
            return res.status(400).json({ message: 'Message is required' });
        }

        // Validate type
        if (!type) {
            return res.status(400).json({ message: 'Type is required' });
        }

        // Create a new notification
        const notification = new Notification({
            recipientId: applicantId,
            senderId: senderId,
            scholarshipId: scholarshipProgramId,
            type: type,
            message: message,
        });

        await notification.save();

        res.status(201).json({ message: 'Notification created successfully', notification });
    } catch (error) {
        console.error('Error creating notification:', error);
        res.status(500).json({ message: 'Error creating notification' });
    }
};

export const getNotifications = async (req, res) => {
    const { recipientId } = req.params;

    // Validate recipientId
    if (!mongoose.Types.ObjectId.isValid(recipientId)) {
        return res.status(400).json({ message: 'Invalid recipient ID' });
    }

    try {
        // Find notifications where the recipientId matches the user's ID
        // and populate the senderId field with the sender's profile picture and organization name
        const notifications = await Notification.find({ recipientId })
            .sort({ createdAt: -1 })
            .populate('senderId', 'profilePicture scholarshipProviderDetails.organizationName role username');  // Populating the senderId with profilePicture, organizationName, and username

        res.status(200).json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ message: 'Error fetching notifications' });
    }
};

export const getNotificationById = async (req, res) => {
    const { id } = req.params;

    try {
        const notification = await Notification.findById(id).populate('senderId'); // Assuming senderId is a reference to the User model

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        res.status(200).json(notification);
    } catch (error) {
        console.error('Error fetching notification:', error);
        res.status(500).json({ message: 'Error fetching notification' });
    }
};