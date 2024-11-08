import User from "../models/user.model.js";
import ScholarshipProgram from "../models/scholarshipProgram.model.js";
import Notification from "../models/notification.model.js";
import ActivityLog from '../models/activityLog.model.js'; // Adjust the import path as necessary

export const test = (req, res) => {
    res.json({
        message: 'API is working!',
    });
};

export const getPendingVerificationUsers = async (req, res) => {
    try {
        // Fetch users with status "Pending Verification"
        const users = await User.find({ status: 'Pending Verification' });
        const userCount = await User.countDocuments({ status: 'Pending Verification' });

        // Fetch scholarship programs with status "Pending Approval"
        const scholarshipPrograms = await ScholarshipProgram.find({ status: 'Pending Approval' });
        const scholarshipProgramCount = await ScholarshipProgram.countDocuments({ status: 'Pending Approval' });

        if (!users.length && !scholarshipPrograms.length) {
            return res.status(404).json({ message: 'No users or scholarship programs pending verification/approval' });
        }

        return res.status(200).json({
            userCount,
            scholarshipProgramCount,
        });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
};

export const getStudentById = async (req, res) => {
    try {
        const { id } = req.params; // Extract the id from the request parameters

        const student = await User.findById(id); // Find the student by ID

        if (!student) {
            return res.status(404).json({
                message: 'Student not found',
            });
        }

        res.json({
            student,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error retrieving student details',
            error: error.message,
        });
    }
};

export const searchPendingVerificationStudent = async (req, res) => {
  try {
    const pendingStudents = await User.find({
      role: 'applicant',
      status: 'Pending Verification',
    });

    res.status(200).json(pendingStudents);
  } catch (error) {
    res.status(500).json({
      message: 'Error searching for pending verification scholarship providers',
      error: error.message,
    });
  }
};

export const approveStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body; // Extract userId from the request body

    const student = await User.findByIdAndUpdate(id, { status: 'Verified' }, { new: true });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Create a notification for the approved student
    const notification = {
      recipientId: student._id,
      senderId: userId, // Use userId from the request body
      type: 'approval',
      message: `Your account has been approved as a student.`,
      recipientName: `${student.applicantDetails.firstName} ${student.applicantDetails.lastName}`,
      senderName: 'HubIsko Administrator' // Use a default sender name or fetch it from the database if needed
    };

    // Save the notification to the database
    await Notification.create(notification);

    // Create an activity log entry for approving the student
    const activityLog = new ActivityLog({
      userId: userId,
      action: 'APPROVE_STUDENT',
      type: 'account',
      details: `Student account approved for ${student.applicantDetails.firstName} ${student.applicantDetails.lastName}`
    });

    await activityLog.save();

    res.status(200).json({ message: 'Student approved successfully', student });
  } catch (error) {
    res.status(500).json({
      message: 'Error approving student',
      error: error.message,
    });
  }
};

export const rejectStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { rejectReason, userId } = req.body; // Extract userId from the request body

    const student = await User.findByIdAndUpdate(
      id,
      { status: 'Rejected', rejectReason: rejectReason },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Create a notification for the rejected student
    const notification = {
      recipientId: student._id,
      senderId: userId, // Use userId from the request body
      type: 'rejection',
      message: `Your account has been rejected. Reason: ${rejectReason}`,
      recipientName: `${student.applicantDetails.firstName} ${student.applicantDetails.lastName}`,
      senderName: 'HubIsko Administrator' // Use a default sender name or fetch it from the database if needed
    };

    // Save the notification to the database
    await Notification.create(notification);

    // Create an activity log entry for rejecting the student
    const activityLog = new ActivityLog({
      userId: userId,
      action: 'REJECT_STUDENT',
      type: 'account',
      details: `Student account rejected for ${student.applicantDetails.firstName} ${student.applicantDetails.lastName}. Reason: ${rejectReason}`
    });

    await activityLog.save();

    res.status(200).json({ message: 'Student rejected successfully', student });
  } catch (error) {
    res.status(500).json({
      message: 'Error rejecting student',
      error: error.message,
    });
  }
};

export const searchPendingVerificationProviders = async (req, res) => {
  try {
    const pendingProviders = await User.find({
      role: 'scholarship_provider',
      status: 'Pending Verification',
    });

    res.status(200).json(pendingProviders);
  } catch (error) {
    res.status(500).json({
      message: 'Error searching for pending verification scholarship providers',
      error: error.message,
    });
  }
};

export const approveScholarshipProvider = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body; // Extract userId from the request body

    const provider = await User.findByIdAndUpdate(id, { status: 'Verified' }, { new: true });
    if (!provider) {
      return res.status(404).json({ message: 'Scholarship provider not found' });
    }

    // Create a notification for the approved scholarship provider
    const notification = {
      recipientId: provider._id,
      senderId: userId, // Use userId from the request body
      type: 'approval',
      message: `Your account has been approved as a scholarship provider.`,
      recipientName: `${provider.scholarshipProviderDetails.organizationName}`,
      senderName: 'HubIsko Administrator' // Use a default sender name or fetch it from the database if needed
    };

    // Save the notification to the database
    await Notification.create(notification);

    // Create an activity log entry for approving the scholarship provider
    const activityLog = new ActivityLog({
      userId: userId,
      action: 'APPROVE_SCHOLARSHIP_PROVIDER',
      type: 'account',
      details: `Scholarship provider account approved for ${provider.scholarshipProviderDetails.organizationName}`
    });

    await activityLog.save();

    res.status(200).json({ message: 'Scholarship provider approved successfully', provider });
  } catch (error) {
    res.status(500).json({
      message: 'Error approving scholarship provider',
      error: error.message,
    });
  }
};

export const rejectScholarshipProvider = async (req, res) => {
  try {
    const { id } = req.params;
    const { rejectReason, userId } = req.body; // Extract userId from the request body

    const provider = await User.findByIdAndUpdate(
      id,
      { status: 'Rejected', rejectReason: rejectReason },
      { new: true }
    );

    if (!provider) {
      return res.status(404).json({ message: 'Scholarship provider not found' });
    }

    // Create a notification for the rejected scholarship provider
    const notification = {
      recipientId: provider._id,
      senderId: userId, // Use userId from the request body
      type: 'rejection',
      message: `Your account has been rejected as a scholarship provider. Reason: ${rejectReason}`,
      recipientName: `${provider.scholarshipProviderDetails.organizationName}`,
      senderName: 'HubIsko Administrator' // Use a default sender name or fetch it from the database if needed
    };

    // Save the notification to the database
    await Notification.create(notification);

    // Create an activity log entry for rejecting the scholarship provider
    const activityLog = new ActivityLog({
      userId: userId,
      action: 'REJECT_SCHOLARSHIP_PROVIDER',
      type: 'account',
      details: `Scholarship provider account rejected for ${provider.scholarshipProviderDetails.organizationName}. Reason: ${rejectReason}`
    });

    await activityLog.save();

    res.status(200).json({ message: 'Scholarship provider rejected successfully', provider });
  } catch (error) {
    res.status(500).json({
      message: 'Error rejecting scholarship provider',
      error: error.message,
    });
  }
};

