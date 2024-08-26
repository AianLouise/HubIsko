import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
    type: { type: String, required: true }, // e.g., "Scholarship Posted", "Verification Request"
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    detailsLink: { type: String },
    status: { type: String, default: "New" }, // e.g., "New", "Read"
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Reference to the User model
});

export default mongoose.model('Activity', activitySchema);