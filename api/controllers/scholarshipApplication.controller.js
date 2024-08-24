import ScholarshipApplication from '../models/scholarshipApplication.model.js';
import Scholarship from '../models/scholarshipProgram.model.js';

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
            applicant,
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
            applicant,
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
        res.status(200).json(applications);
    } catch (error) {
        console.error('Error fetching scholarship applications:', error);
        res.status(500).json({
            message: 'Error fetching scholarship applications',
            error: error.message
        });
    }
};


export const getApplicationDetailsById = async (req, res) => {
    try {
        const { id } = req.params; // Extract applicationId from the URL parameters
        const application = await ScholarshipApplication.findById(id).populate('scholarshipProgram');

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        res.status(200).json(application);
    } catch (error) {
        console.error('Error fetching application details by ID:', error);
        res.status(500).json({
            message: 'Error fetching application details by ID',
            error: error.message
        });
    }
};
