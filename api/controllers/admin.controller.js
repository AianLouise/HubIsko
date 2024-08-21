import User from '../models/user.model.js'; // Import the User model
import ScholarshipProgram from '../models/scholarshipProgram.model.js'; // Import the Scholarship model

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
    const totalUnverifiedAccounts = await User.countDocuments({ emailVerified: false });
    res.json({
      totalUnverifiedAccounts,
    });
  } catch (error) {
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
      return res.status(404).json({
        message: 'No pending scholarship providers found',
      });
    }

    res.json({
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
      return res.status(404).json({
        message: 'No pending scholarship programs found',
      });
    }

    res.json({
      programs,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving pending scholarship programs',
      error: error.message,
    });
  }
};