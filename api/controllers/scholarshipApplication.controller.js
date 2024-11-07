import ScholarshipApplication from '../models/scholarshipApplication.model.js';
import Notification from '../models/notification.model.js';
import ScholarshipProgram from '../models/scholarshipProgram.model.js'; // Import the ScholarshipProgram model
import User from '../models/user.model.js'; // Assuming you have a User model to fetch user details

export const test = (req, res) => {
    res.json({
        message: 'API is working!',
    });
};

import ActivityLog from '../models/activityLog.model.js'; // Adjust the import path as necessary

export const createScholarshipApplication = async (req, res) => {
    try {
        const {
            applicant,
            father,
            mother,
            guardian,
            relatives,
            workExperience,
            skillsAndQualifications,
            documents,
            scholarshipProgram,
        } = req.body;

        console.log('Request body:', req.body);

        // Sanitize the keys in the documents object
        const sanitizedDocuments = {};
        for (const key in documents) {
            if (documents.hasOwnProperty(key)) {
                const sanitizedKey = key.replace(/\./g, '_');
                sanitizedDocuments[sanitizedKey] = documents[key];
            }
        }

        const newApplication = new ScholarshipApplication({
            applicant,
            father,
            mother,
            guardian,
            relatives,
            workExperience,
            skillsAndQualifications,
            documents: sanitizedDocuments,
            scholarshipProgram,
        });

        await newApplication.save();
        console.log('New application saved:', newApplication);

        // Fetch the scholarship program details to get the providerId and program name
        const scholarshipProgramDetails = await ScholarshipProgram.findById(scholarshipProgram);
        if (!scholarshipProgramDetails) {
            return res.status(404).json({ message: 'Scholarship Program not found' });
        }
        console.log('Scholarship program details:', scholarshipProgramDetails);

        const providerId = scholarshipProgramDetails.providerId;

        // Fetch the applicant and provider details to get their names
        const applicantDetails = await User.findById(applicant);
        const providerDetails = await User.findById(providerId);

        if (!applicantDetails || !providerDetails) {
            return res.status(404).json({ message: 'Applicant or Provider not found' });
        }
        console.log('Applicant details:', applicantDetails);
        console.log('Provider details:', providerDetails);

        // Create notification
        const notification = new Notification({
            recipientId: providerId, // Use the providerId as the recipient
            senderId: applicant, // The student is the sender
            scholarshipId: scholarshipProgram,
            type: 'application',
            message: `${applicantDetails.applicantDetails.firstName} ${applicantDetails.applicantDetails.lastName} has submitted a scholarship application for the ${scholarshipProgramDetails.title}.`,
            recipientName: providerDetails.scholarshipProviderDetails.organizationName, // Save provider's organization name as recipientName
            senderName: `${applicantDetails.applicantDetails.firstName} ${applicantDetails.applicantDetails.lastName}`, // Save applicant's name as senderName
        });

        await notification.save();
        console.log('Notification saved:', notification);

        // Create an activity log entry for creating a scholarship application
        const activityLog = new ActivityLog({
            userId: applicant,
            action: 'CREATE_APPLICATION',
            type: 'scholarship',
            details: `Scholarship application created by ${applicantDetails.applicantDetails.firstName} ${applicantDetails.applicantDetails.lastName} for program: ${scholarshipProgramDetails.title}`
        });

        await activityLog.save();
        console.log('Activity log saved:', activityLog);

        res.status(201).json({
            message: 'Scholarship application created successfully',
            application: newApplication
        });
    } catch (error) {
        console.error('Error creating scholarship application:', error);
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
        const application = await ScholarshipApplication.findById(id)
            .populate('scholarshipProgram')
            .populate('applicant'); // Populate applicant with only the name field

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
            applicant,
            father,
            mother,
            guardian,
            relatives,
            workExperience,
            skillsAndQualifications,
            documents,
            scholarshipProgram,
        } = req.body;

        const updatedApplication = await ScholarshipApplication.findByIdAndUpdate(
            id,
            {
                applicant,
                father,
                mother,
                guardian,
                relatives,
                workExperience,
                skillsAndQualifications,
                documents,
                scholarshipProgram,
                applicationStatus: 'Pending', // Add applicationStatus with value 'Pending'
            },
            { new: true }
        );

        if (!updatedApplication) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Fetch the scholarship program details to get the providerId and program name
        const scholarshipProgramDetails = await ScholarshipProgram.findById(scholarshipProgram);
        if (!scholarshipProgramDetails) {
            return res.status(404).json({ message: 'Scholarship Program not found' });
        }

        const providerId = scholarshipProgramDetails.providerId;

        // Fetch the applicant and provider details to get their names
        const applicantDetails = await User.findById(applicant);
        const providerDetails = await User.findById(providerId);

        if (!applicantDetails || !providerDetails) {
            return res.status(404).json({ message: 'Applicant or Provider not found' });
        }

        // Create notification
        const notification = new Notification({
            recipientId: providerId, // Use the providerId as the recipient
            senderId: applicant, // The student is the sender
            scholarshipId: scholarshipProgram,
            type: 'application',
            message: `${applicantDetails.firstName} ${applicantDetails.lastName} has resubmitted a scholarship application for the ${scholarshipProgramDetails.title}.`,
            recipientName: providerDetails.scholarshipProviderDetails.organizationName, // Save provider's organization name as recipientName
            senderName: `${applicantDetails.firstName} ${applicantDetails.lastName}`, // Save applicant's name as senderName
        });

        await notification.save();

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