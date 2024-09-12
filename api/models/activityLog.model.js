import mongoose from 'mongoose';

const { Schema } = mongoose;

const activityLogSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['account', 'scholarship'] // Added type field with choices
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  details: {
    type: String,
    required: false
  }
});

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

export default ActivityLog;