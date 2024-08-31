import ScholarshipActivityLog from '../models/scholarshipActivityLog.model.js';

// Create a new scholarship activity log
export const createScholarshipActivityLog = async (req, res) => {
  const { userId, providerId, scholarshipProgramId, action, details } = req.body;
  try {
    const newLog = new ScholarshipActivityLog({
      userId,
      providerId,
      scholarshipProgramId,
      action,
      details
    });
    const savedLog = await newLog.save();
    res.status(201).json(savedLog);
  } catch (error) {
    res.status(500).json({ message: 'Error saving scholarship activity log', error });
  }
};

// Get scholarship activity logs for a specific provider
export const getScholarshipActivityLogsByProvider = async (req, res) => {
  const { providerId } = req.params;
  try {
    const logs = await ScholarshipActivityLog.find({ providerId })
      .populate('userId', 'username')
      .populate('scholarshipProgramId', 'title');
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching scholarship activity logs', error });
  }
};