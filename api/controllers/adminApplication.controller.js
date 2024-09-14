import User from "../models/user.model.js";
import ScholarshipProgram from "../models/scholarshipProgram.model.js";

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
