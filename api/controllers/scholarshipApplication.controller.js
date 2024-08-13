import ScholarshipApplication from '../models/scholarshipApplication.model.js';
import User from '../models/user.model.js';

export const test = (req, res) => {
    res.json({
        message: 'API is working!',
    });
};

export const createScholarshipApplication = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            middleName,
            birthdate,
            gender,
            bloodType,
            civilStatus,
            maidenName,
            spouseName,
            spouseOccupation,
            religion,
            height,
            weight,
            birthplace,
            contactNumber,
            address,
            town,
            barangay,
            province,
            father,
            mother,
            guardian,
            education,
            relatives,
            workExperience,
            skillsAndQualifications,
            documents,
            termsAndConditions,
            scholarshipProgram,
            applicant
        } = req.body;

        const newApplication = new ScholarshipApplication({
            firstName,
            lastName,
            middleName,
            birthdate,
            gender,
            bloodType,
            civilStatus,
            maidenName,
            spouseName,
            spouseOccupation,
            religion,
            height,
            weight,
            birthplace,
            contactNumber,
            address,
            town,
            barangay,
            province,
            father,
            mother,
            guardian,
            education,
            relatives,
            workExperience,
            skillsAndQualifications,
            documents,
            termsAndConditions,
            scholarshipProgram,
            applicant
        });

        await newApplication.save();

        res.status(201).json({
            message: 'Scholarship application created successfully',
            application: newApplication
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error creating scholarship application',
            error: error.message
        });
    }
};



export const getScholarshipApplications = async (req, res) => {
    try {
        const { id } = req.params; // Extract userId from the URL parameters
        const applications = await ScholarshipApplication.find({ applicant: id }).populate('scholarshipProgram');

        // Fetch the provider emails
        const applicationsWithProviderEmails = await Promise.all(applications.map(async (application) => {
            const providerId = application.scholarshipProgram.providerId;
            const provider = await User.findById(providerId);
            return {
                ...application.toObject(),
                providerEmail: provider ? provider.email : null
            };
        }));

        res.status(200).json(applicationsWithProviderEmails);
    } catch (error) {
        console.error('Error fetching scholarship applications:', error);
        res.status(500).json({
            message: 'Error fetching scholarship applications',
            error: error.message
        });
    }
};