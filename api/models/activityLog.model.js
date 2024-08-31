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
    required: true
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