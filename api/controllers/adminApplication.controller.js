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

export const approveStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await User.findByIdAndUpdate(id, { status: 'Verified' }, { new: true });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
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
    const { rejectReason } = req.body;

    const student = await User.findByIdAndUpdate(
      id,
      { status: 'Rejected', rejectReason: rejectReason },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json({ message: 'Student rejected successfully', student });
  } catch (error) {
    res.status(500).json({
      message: 'Error rejecting student',
      error: error.message,
    });
  }
};