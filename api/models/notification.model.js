import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Add this line
    message: { type: String, required: true },
    status: { type: String, enum: ['sent', 'pending'], default: 'pending' },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Notification', notificationSchema);
