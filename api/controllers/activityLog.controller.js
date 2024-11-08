import ActivityLog from '../models/activityLog.model.js';

// Create a new activity log
export const createActivityLog = async (req, res) => {
  const { userId, action, details } = req.body;
  try {
    const newLog = new ActivityLog({
      userId,
      action,
      details
    });
    const savedLog = await newLog.save();
    res.status(201).json(savedLog);
  } catch (error) {
    res.status(500).json({ message: 'Error saving activity log', error });
  }
};

// Get all activity logs
export const getActivityLogs = async (req, res) => {
    try {
        const logs = await ActivityLog.find()
            .populate({
                path: 'userId',
                select: 'username profilePicture applicantDetails.firstName applicantDetails.lastName applicantDetails.middleName scholarshipProviderDetails.organizationName',
            });
        res.status(200).json(logs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching activity logs', error });
    }
};

// Update an activity log
export const updateActivityLog = async (req, res) => {
  const { id } = req.params;
  const { details } = req.body;
  try {
    const updatedLog = await ActivityLog.findByIdAndUpdate(
      id,
      { details },
      { new: true }
    );
    if (!updatedLog) {
      return res.status(404).json({ message: 'Activity log not found' });
    }
    res.status(200).json(updatedLog);
  } catch (error) {
    res.status(500).json({ message: 'Error updating activity log', error });
  }
};

// Delete an activity log
export const deleteActivityLog = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedLog = await ActivityLog.findByIdAndDelete(id);
    if (!deletedLog) {
      return res.status(404).json({ message: 'Activity log not found' });
    }
    res.status(200).json({ message: 'Activity log deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting activity log', error });
  }
};