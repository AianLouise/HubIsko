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
            nameExtension,
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
            email,
            contactNumber,
            addressDetails,
            region,
            province,
            city,
            barangay,
            father,
            mother,
            guardian,
            education,
            relatives,
            workExperience,
            skillsAndQualifications,
            documents,
            scholarshipProgram,
            applicant,
        } = req.body;

        const newApplication = new ScholarshipApplication({
            firstName,
            lastName,
            middleName,
            nameExtension,
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
            email,
            contactNumber,
            addressDetails,
            region,
            province,
            city,
            barangay,
            father,
            mother,
            guardian,
            education,
            relatives,
            workExperience,
            skillsAndQualifications,
            documents,
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

export const resubmitApplication = async (req, res) => {
    try {
        const { id } = req.params; // Extract applicationId from the URL parameters
        const {
            firstName,
            lastName,
            middleName,
            nameExtension,
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
            email,
            contactNumber,
            addressDetails,
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
            scholarshipProgram,
            applicant,
        } = req.body;

        const updatedApplication = await ScholarshipApplication.findByIdAndUpdate(
            id,
            {
                firstName,
                lastName,
                middleName,
                nameExtension,
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
                email,
                contactNumber,
                addressDetails,
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
                scholarshipProgram,
                applicant,
            },
            { new: true }
        );

        if (!updatedApplication) {
            return res.status(404).json({ message: 'Application not found' });
        }

        res.status(200).json({
            message: 'Scholarship application resubmitted successfully',
            application: updatedApplication
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error resubmitting scholarship application',
            error: error.message
        });
    }
};