import ScholarshipApplication from '../models/scholarshipApplication.model.js';
import User from '../models/user.model.js';

// Test route
export const test = (req, res) => {
    res.json({
        message: 'API is working!',
    });
};

export const getApplicantDetails = async (req, res) => {
    const { id } = req.params; // Extract id from request parameters
    try {
        // Find the specific scholarship application by id
        const scholarshipApplication = await ScholarshipApplication.findById(id);

        if (!scholarshipApplication) {
            return res.status(404).json({ message: 'Scholarship application not found' });
        }

        // Extract the applicant value from the scholarship application
        const applicantId = scholarshipApplication.applicant;

        // Use the applicant value to fetch the corresponding user from the user table
        const user = await User.findById(applicantId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return the user data in the response
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving applicant details', error: error.message });
    }
};