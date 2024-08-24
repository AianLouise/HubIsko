import Notification from '../models/notification.model.js';
import Scholarship from '../models/scholarshipProgram.model.js';

export const createNotification = async (req, res) => {
    const { applicantId, senderId, scholarshipProgramId } = req.body;

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

        // Create a new notification
        const notification = new Notification({
            recipientId: applicantId,
            senderId: senderId,
            message: `Your application for the ${scholarshipProgram.title} has been approved.`,
        });

        await notification.save();

        res.status(201).json({ message: 'Notification created successfully', notification });
    } catch (error) {
        console.error('Error creating notification:', error);
        res.status(500).json({ message: 'Error creating notification' });
    }
};

// Controller to fetch notifications for a specific recipient
export const getNotifications = async (req, res) => {
    const { recipientId } = req.params;

    try {
        // Find notifications where the recipientId matches the user's ID
        // and populate the senderId field with the sender's profile picture
        const notifications = await Notification.find({ recipientId })
            .sort({ createdAt: -1 })
            .populate('senderId', 'profilePicture scholarshipProviderDetails.organizationName');  // Populating the senderId with profilePicture

        if (!notifications.length) {
            return res.status(404).json({ message: 'No notifications found' });
        }

        res.status(200).json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ message: 'Error fetching notifications' });
    }
};
