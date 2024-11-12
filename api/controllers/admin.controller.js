import User from '../models/user.model.js'; // Import the User model
import ScholarshipProgram from '../models/scholarshipProgram.model.js'; // Import the Scholarship model
import ForumPost from '../models/forumPost.model.js'; // Import the ForumPost model
import bcryptjs from 'bcryptjs'; // Import the bcryptjs library
import Notification from '../models/notification.model.js'; // Adjust the import path as necessary

export const test = (req, res) => {
  res.json({
    message: 'API is working!',
  });
};

export const getTotalUserAccounts = async (req, res) => {
  try {
    const totalAccounts = await User.countDocuments({});
    res.json({
      totalAccounts,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving total user accounts',
      error: error.message,
    });
  }
};

export const getTotalUnverifiedAccounts = async (req, res) => {
  try {
    const totalUnverifiedAccounts = await User.countDocuments({ status: 'Pending Verification' });
    res.json({
      totalUnverifiedAccounts,
    });
  } catch (error) {
    console.error('Error retrieving total unverified user accounts:', error);
    res.status(500).json({
      message: 'Error retrieving total unverified user accounts',
      error: error.message,
    });
  }
};

export const getTotalScholarships = async (req, res) => {
  try {
    const totalScholarships = await ScholarshipProgram.countDocuments({});
    res.json({
      totalScholarships,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving total scholarships',
      error: error.message,
    });
  }
};

export const getTotalScholarshipProviders = async (req, res) => {
  try {
    const totalScholarshipProviders = await User.countDocuments({ role: 'scholarship_provider' });
    res.json({
      totalScholarshipProviders,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving total scholarship providers',
      error: error.message,
    });
  }
};

export const getTotalApplicants = async (req, res) => {
  try {
    const totalApplicants = await User.countDocuments({ role: 'applicant' });
    res.json({
      totalApplicants,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving total applicants',
      error: error.message,
    });
  }
};

export const getAllApplicants = async (req, res) => {
  try {
    const applicants = await User.find({ role: 'applicant' });
    res.json({
      applicants,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving applicants',
      error: error.message,
    });
  }
};

export const getAllProviders = async (req, res) => {
  try {
    const providers = await User.find({ role: 'scholarship_provider' });
    res.json({
      providers,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving providers',
      error: error.message,
    });
  }
};

export const getApplicantById = async (req, res) => {
  try {
    const { id } = req.params;
    const applicant = await User.findById(id);
    if (!applicant || applicant.role !== 'applicant') {
      return res.status(404).json({
        message: 'Applicant not found',
      });
    }
    res.json({
      applicant,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving applicant details',
      error: error.message,
    });
  }
};

export const getPendingScholarshipProviders = async (req, res) => {
  try {
    const providers = await User.find({
      role: 'scholarship_provider',
      'scholarshipProviderDetails.status': 'pending'
    });

    if (!providers.length) {
      return res.json({
        message: 'No pending scholarship providers found',
      });
    }

    res.json({
      message: 'Pending scholarship providers retrieved successfully',
      providers,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving pending scholarship providers',
      error: error.message,
    });
  }
};

export const getPendingScholarshipPrograms = async (req, res) => {
  try {
    const programs = await ScholarshipProgram.find({
      status: 'pending'
    });

    if (!programs.length) {
      return res.json({
        message: 'No pending scholarship programs found',
      });
    }

    res.json({
      message: 'Pending scholarship programs retrieved successfully',
      programs,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving pending scholarship programs',
      error: error.message,
    });
  }
};

export const getScholarshipProviderById = async (req, res) => {
  try {
    const { id } = req.params; // Extract the id from the request parameters

    const provider = await User.findById(id); // Find the provider by ID

    if (!provider) {
      return res.status(404).json({
        message: 'Scholarship provider not found',
      });
    }

    res.json({
      provider,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving scholarship provider details',
      error: error.message,
    });
  }
};

export const verifyScholarshipProviderStatus = async (req, res) => {
  try {
    const { id } = req.params; // Extract the user ID from the request parameters

    const user = await User.findById(id); // Find the user by ID

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    user.scholarshipProviderDetails.status = 'verified'; // Update the status to 'verified'
    await user.save(); // Save the changes

    res.json({
      message: 'Scholarship provider status verified successfully',
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error verifying scholarship provider status',
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

export const countApprovedScholars = async (req, res) => {
  try {
    const approvedScholarsCount = await ScholarshipProgram.aggregate([
      { $unwind: "$approvedScholars" },
      { $group: { _id: null, count: { $sum: 1 } } }
    ]);

    res.status(200).json({ count: approvedScholarsCount[0]?.count || 0 });
  } catch (error) {
    res.status(500).json({
      message: 'Error counting approved scholars',
      error: error.message,
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}); // Fetch all users from the database

    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching users',
      error: error.message,
    });
  }
};

export const getScholarshipProgramDetailsById = async (req, res) => {
  try {
    const { id } = req.params;
    const scholarshipProgram = await ScholarshipProgram.findById(id);
    if (!scholarshipProgram) {
      return res.status(404).json({ message: 'Scholarship program not found' });
    }
    res.status(200).json({ scholarshipProgram });
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving scholarship program details',
      error: error.message,
    });
  }
};

export const verifyScholarshipProgram = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body; // Extract userId and username from the request body

    // Assuming you have a ScholarshipProgram model
    const scholarshipProgram = await ScholarshipProgram.findById(id);

    if (!scholarshipProgram) {
      return res.status(404).json({ message: 'Scholarship program not found' });
    }

    // Update the verification logic to include status change
    scholarshipProgram.verified = true;
    scholarshipProgram.status = 'Approved';
    await scholarshipProgram.save();

    // Create a notification for the verified scholarship program
    const notification = {
      recipientId: scholarshipProgram.providerId, // Assuming providerId is the recipient
      senderId: userId, // Use userId from the request body
      type: 'approval',
      message: `Your scholarship program "${scholarshipProgram.title}" has been verified.`,
      recipientName: scholarshipProgram.organizationName, // Assuming providerName is available
      senderName: "Admin",
    };

    // Save the notification to the database
    await Notification.create(notification);

    res.status(200).json({ message: 'Scholarship program verified successfully', scholarshipProgram });
  } catch (error) {
    res.status(500).json({
      message: 'Error verifying scholarship program',
      error: error.message,
    });
  }
};

export const rejectScholarshipProgram = async (req, res) => {
  try {
    const { id } = req.params;
    const { rejectReason, userId } = req.body;

    // Assuming you have a ScholarshipProgram model
    const scholarshipProgram = await ScholarshipProgram.findById(id);

    if (!scholarshipProgram) {
      return res.status(404).json({ message: 'Scholarship program not found' });
    }

    // Update the scholarship program status to Rejected and set the reject reason
    scholarshipProgram.status = 'Rejected';
    scholarshipProgram.rejectReason = rejectReason;
    await scholarshipProgram.save();

    // Create a notification for the rejected scholarship program
    const notification = {
      recipientId: scholarshipProgram.providerId, // Assuming providerId is the recipient
      senderId: userId, // Use userId from the request body
      type: 'rejection',
      message: `Your scholarship program "${scholarshipProgram.title}" has been rejected. Reason: ${rejectReason}`,
      recipientName: scholarshipProgram.providerName, // Assuming providerName is available
      senderName: 'Admin' // Use a default sender name or fetch it from the database if needed
    };

    // Save the notification to the database
    await Notification.create(notification);

    res.status(200).json({ message: 'Scholarship program rejected successfully', scholarshipProgram });
  } catch (error) {
    res.status(500).json({
      message: 'Error rejecting scholarship program',
      error: error.message,
    });
  }
};

export const updateStudentDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedDetails = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Update user details
    Object.keys(updatedDetails).forEach(key => {
      user[key] = updatedDetails[key];
    });

    await user.save();

    res.status(200).json({ message: 'Student details updated successfully', user });
  } catch (error) {
    res.status(500).json({
      message: 'Error updating student details',
      error: error.message,
    });
  }
};

export const updateProviderDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedDetails = req.body;

    const provider = await User.findById(id);

    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    // Update provider details
    Object.keys(updatedDetails).forEach(key => {
      provider[key] = updatedDetails[key];
    });

    await provider.save();

    res.status(200).json({ message: 'Provider details updated successfully', provider });
  } catch (error) {
    res.status(500).json({
      message: 'Error updating provider details',
      error: error.message,
    });
  }
};

export const getAllScholarshipPrograms = async (req, res) => {
  try {
    const scholarshipPrograms = await ScholarshipProgram.find(); // Assuming you have a ScholarshipProgram model
    res.status(200).json({
      success: true,
      data: scholarshipPrograms,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching scholarship programs',
      error: error.message,
    });
  }
};

export const getUserScholarshipPrograms = async (req, res) => {
  try {
    const userId = req.params.userId; // Assuming the user ID is passed as a URL parameter

    // Find all scholarship programs where the user ID is in the approvedScholars array
    const scholarshipPrograms = await ScholarshipProgram.find({
      'approvedScholars._id': userId
    });

    res.status(200).json({
      success: true,
      data: scholarshipPrograms,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user scholarship programs',
      error: error.message,
    });
  }
};

export const getUserForumPosts = async (req, res) => {
  try {
    const userId = req.params.userId; // Assuming the user ID is passed as a URL parameter

    // Find all forum posts where the user ID matches
    const forumPosts = await ForumPost.find({ userId });

    res.status(200).json({
      success: true,
      data: forumPosts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user forum posts',
      error: error.message,
    });
  }
};

export const createAccount = async (req, res) => {
  const { email, username, password, role, applicantDetails, scholarshipProviderDetails } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Create the user object
    const userData = {
      email,
      username,
      password: hashedPassword,
      role,
    };

    // Add role-specific details
    if (role === 'applicant') {
      userData.applicantDetails = {
        ...applicantDetails,
        profileComplete: false,
      };
    } else if (role === 'scholarship_provider') {
      userData.scholarshipProviderDetails = {
        ...scholarshipProviderDetails,
        registrationComplete: false,
      };
    }

    // Save the user to the database
    const newUser = new User(userData);
    await newUser.save();

    res.status(201).json({ message: 'Account created successfully!' });
  } catch (error) {
    console.error('Error creating account:', error.message);
    res.status(500).json({
      message: 'Error creating account',
      error: error.message,
    });
  }
};