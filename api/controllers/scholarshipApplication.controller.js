import ScholarshipApplication from '../models/scholarshipApplication.model.js';

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
            scholarshipProgram
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
            scholarshipProgram
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