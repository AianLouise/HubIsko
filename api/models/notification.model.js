import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // e.g. Student or Provider
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // e.g. Scholarship provider or admin
    scholarshipId: { type: mongoose.Schema.Types.ObjectId, ref: 'ScholarshipProgram', required: false }, // Optional reference to Scholarship Program
    type: { type: String, enum: ['application', 'approval', 'announcement', 'validation', 'general', 'rejection', 'completion'], required: true }, // Type of the notification
    message: { type: String, required: true }, // Actual message for the notification
    status: { type: String, enum: ['sent', 'pending'], default: 'pending' },
    createdAt: { type: Date, default: Date.now },
    recipientName: { type: String }, // Name of the recipient
    senderName: { type: String }, // Name of the sender
    read: { type: Boolean, default: false } // Indicates if the notification has been read
});

export default mongoose.model('Notification', notificationSchema);