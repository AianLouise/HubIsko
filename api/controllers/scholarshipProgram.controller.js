import { getOverlappingDaysInIntervals } from 'date-fns';
import Scholarship from '../models/scholarshipProgram.model.js';
import User from '../models/user.model.js';

export const test = (req, res) => {
  res.json({
    message: 'API is working!',
  });
};

export const createScholarshipProgram = async (req, res) => {
  try {
    // Log the request body for debugging
    console.log('Request Body:', req.body);

    // Extract data from request body
    const {
      title,
      description,
      applicationInstructions,
      totalSlots,
      duration,
      documents,
      category,
      type,
      academicRequirements,
      fieldOfStudy,
      levelOfEducation,
      location,
      otherCriteria,
      applicationStartDate,
      applicationEndDate,
      notificationDate,
      coverage,
      contactPerson,
      providerId,
      banner,
      purpose,
      benefits,
      qualifications,
      eligibility,
      additionalInformation,
      highlight,
      targetAudience,
      url,
      scholarshipImage, // Added field for scholarship image
      scholarshipBanner,  // Added field for scholarship banner
      status = 'Pending Approval'
    } = req.body;

    // Validate required fields
    if (!title || !description || !applicationInstructions || totalSlots === undefined || !duration || !category || !type || !academicRequirements || !fieldOfStudy || !levelOfEducation || !location || !applicationStartDate || !applicationEndDate || !notificationDate || !coverage || !contactPerson || !providerId) {
      return res.status(400).json({
        message: 'Title, description, application instructions, number of scholarships, duration, category, type, academic requirements, field of study, level of education, location, application start date, application end date, notification date, coverage, contact person, and provider ID are required fields.',
      });
    }

    // Validate date fields
    const parsedApplicationStartDate = new Date(applicationStartDate);
    const parsedApplicationEndDate = new Date(applicationEndDate);
    const parsedNotificationDate = new Date(notificationDate);

    if (isNaN(parsedApplicationStartDate.getTime()) || isNaN(parsedApplicationEndDate.getTime()) || isNaN(parsedNotificationDate.getTime())) {
      return res.status(400).json({
        message: 'Invalid date format for application start date, application end date, or notification date.',
      });
    }

    // Create a new Scholarship document
    const newScholarship = new Scholarship({
      title,
      description,
      applicationInstructions,
      totalSlots,
      duration,
      documents,
      category,
      type,
      academicRequirements,
      fieldOfStudy,
      levelOfEducation,
      location,
      otherCriteria,
      applicationStartDate: parsedApplicationStartDate,
      applicationEndDate: parsedApplicationEndDate,
      notificationDate: parsedNotificationDate,
      coverage,
      contactPerson,
      providerId, // Assign the provider ID
      banner,
      purpose,
      benefits,
      qualifications,
      eligibility,
      additionalInformation,
      highlight,
      targetAudience,
      url,
      scholarshipImage, // Added field for scholarship image
      scholarshipBanner, // Added field for scholarship banner
      status // Default status
    });

    // Save the Scholarship document to the database
    const savedScholarship = await newScholarship.save();

    // Send success response
    res.status(201).json({
      message: 'Scholarship program created successfully!',
      data: savedScholarship,
    });
  } catch (error) {
    // Handle errors
    console.error('Error creating scholarship program:', error);
    res.status(500).json({
      message: 'An error occurred while creating the scholarship program.',
      error: error.message,
    });
  }
};


export const getScholarshipProgramsByProviderId = async (req, res) => {
  try {
    const providerId = req.params.id; // Extract providerId from route parameters

    if (!providerId) {
      return res.status(400).json({ error: 'Provider ID is required' });
    }

    const scholarshipPrograms = await Scholarship.find({ providerId });

    if (scholarshipPrograms.length === 0) {
      return res.status(404).json({ error: 'No scholarship programs found' });
    }

    // Map the scholarship programs to include the ID and status
    const formattedPrograms = scholarshipPrograms.map(program => ({
      _id: program._id,
      title: program.title,
      description: program.description,
      applicationInstructions: program.applicationInstructions,
      totalSlots: program.totalSlots,
      duration: program.duration,
      documents: program.documents.map(doc => ({
        category: doc.category,
        type: doc.type
      })),
      academicRequirements: program.academicRequirements,
      fieldOfStudy: program.fieldOfStudy,
      levelOfEducation: program.levelOfEducation,
      location: program.location,
      otherCriteria: program.otherCriteria,
      applicationStartDate: program.applicationStartDate,
      applicationEndDate: program.applicationEndDate,
      notificationDate: program.notificationDate,
      coverage: program.coverage,
      contactPerson: program.contactPerson,
      providerId: program.providerId,
      purpose: program.purpose,
      benefits: program.benefits.map(benefit => ({
        // Assuming benefits have a similar structure
        // Add the necessary fields here
      })),
      qualifications: program.qualifications.map(qualification => ({
        // Assuming qualifications have a similar structure
        // Add the necessary fields here
      })),
      eligibility: program.eligibility,
      additionalInformation: program.additionalInformation,
      scholarshipImage: program.scholarshipImage, // Add scholarshipImage field
      scholarshipBanner: program.scholarshipBanner, // Add scholarshipBanner field
      status: program.status // Add status field
    }));

    res.status(200).json(formattedPrograms);
  } catch (error) {
    console.error('Error fetching scholarship programs:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getAllScholarshipPrograms = async (req, res) => {
  try {
    const programs = await Scholarship.find();
    const formattedPrograms = programs.map(program => ({
      id: program._id,
      title: program.title,
      description: program.description,
      totalSlots: program.totalSlots,
      duration: program.duration,
      documents: program.documents,
      category: program.category,
      type: program.type,
      academicRequirements: program.academicRequirements,
      fieldOfStudy: program.fieldOfStudy,
      levelOfEducation: program.levelOfEducation,
      location: program.location,
      otherCriteria: program.otherCriteria,
      applicationStartDate: program.applicationStartDate,
      applicationEndDate: program.applicationEndDate,
      notificationDate: program.notificationDate,
      coverage: program.coverage,
      contactPerson: program.contactPerson,
      providerId: program.providerId,
      purpose: program.purpose,
      benefits: program.benefits,
      qualifications: program.qualifications,
      eligibility: program.eligibility,
      additionalInformation: program.additionalInformation,
      scholarshipImage: program.scholarshipImage,
      scholarshipBanner: program.scholarshipBanner,
      status: program.status,
      highlight: program.highlight,
      targetAudience: program.targetAudience,
      url: program.url,
      approvedScholars: program.approvedScholars
    }));

    res.status(200).json(formattedPrograms);
  } catch (error) {
    console.error('Error fetching scholarship programs:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// New function to get scholarship provider details


export const getScholarshipProviders = async (req, res) => {
  try {
    // Find all users with the role 'scholarship_provider'
    const providers = await User.find({ role: 'scholarship_provider' })
      .select('scholarshipProviderDetails.organizationName name profilePicture');

    if (!providers || providers.length === 0) {
      return res.status(404).json({ error: 'No scholarship providers found' });
    }

    res.status(200).json(providers);
  } catch (error) {
    console.error('Error fetching scholarship providers:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getScholarshipProgramById = async (req, res) => {
  try {
    const { id } = req.params; // Extract id from route parameters

    if (!id) {
      return res.status(400).json({ error: 'Scholarship Program ID is required' });
    }

    const scholarshipProgram = await Scholarship.findById(id);

    if (!scholarshipProgram) {
      return res.status(404).json({ error: 'Scholarship Program not found' });
    }

    const formattedProgram = {
      id: scholarshipProgram._id,
      title: scholarshipProgram.title,
      description: scholarshipProgram.description,
      applicationInstructions: scholarshipProgram.applicationInstructions,
      totalSlots: scholarshipProgram.totalSlots,
      duration: scholarshipProgram.duration,
      documents: scholarshipProgram.documents.map(doc => ({
        category: doc.category,
        type: doc.type
      })),
      academicRequirements: scholarshipProgram.academicRequirements,
      fieldOfStudy: scholarshipProgram.fieldOfStudy,
      levelOfEducation: scholarshipProgram.levelOfEducation,
      location: scholarshipProgram.location,
      otherCriteria: scholarshipProgram.otherCriteria,
      applicationStartDate: scholarshipProgram.applicationStartDate,
      applicationEndDate: scholarshipProgram.applicationEndDate,
      notificationDate: scholarshipProgram.notificationDate,
      coverage: scholarshipProgram.coverage,
      contactPerson: scholarshipProgram.contactPerson,
      providerId: scholarshipProgram.providerId,
      purpose: scholarshipProgram.purpose,
      benefits: scholarshipProgram.benefits.map(benefit => ({
        // Assuming benefits have a similar structure
        // Add the necessary fields here
      })),
      qualifications: scholarshipProgram.qualifications.map(qualification => ({
        // Assuming qualifications have a similar structure
        // Add the necessary fields here
      })),
      eligibility: scholarshipProgram.eligibility,
      additionalInformation: scholarshipProgram.additionalInformation,
      scholarshipImage: scholarshipProgram.scholarshipImage,
      scholarshipBanner: scholarshipProgram.scholarshipBanner,
      status: scholarshipProgram.status,
      highlight: scholarshipProgram.highlight,
      targetAudience: scholarshipProgram.targetAudience,
      url: scholarshipProgram.url,
      approvedScholars: scholarshipProgram.approvedScholars
    };

    res.status(200).json(formattedProgram);
  } catch (error) {
    console.error('Error fetching scholarship program:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getOrganizationName = async (req, res) => {
  try {
    const { providerId } = req.params;
    const user = await User.findById(providerId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const organizationName = user.scholarshipProviderDetails.organizationName;
    res.status(200).json({ organizationName });
  } catch (error) {
    console.error('Error fetching organization name:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};