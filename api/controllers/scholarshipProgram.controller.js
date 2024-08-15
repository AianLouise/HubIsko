import { Scholarship } from '../models/scholarshipProgram.model.js';
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
      category,
      fieldOfStudy,
      numberOfScholarships,
      amount,
      applicationDeadline,
      minGPA,
      nationality,
      otherEligibility,
      startDate,
      endDate,
      selectionProcess,
      selectionCriteria,
      renewalPolicy,
      renewalDuration,
      disbursementSchedule,
      disbursementMethod,
      contactEmail,
      contactPhone,
      providerId,
      organizationName,
      requiredDocuments,
      documentGuidelines,
      scholarshipImage,
      bannerImage,
      sections,
      faqTitle,          
      faqDescription,
      providerRequirements  
    } = req.body;

    // Validate required fields
      if (
          !title || !category || !fieldOfStudy ||
          numberOfScholarships === undefined || !amount || !applicationDeadline ||
          !minGPA || !nationality || !otherEligibility ||
          !startDate || !endDate || !selectionProcess || !selectionCriteria ||
          !renewalPolicy || !renewalDuration || !disbursementSchedule ||
          !disbursementMethod || !contactEmail || !contactPhone ||
          !providerId || !organizationName || !faqTitle || !faqDescription || // Include FAQ validation
          !scholarshipImage || !bannerImage || !providerRequirements// Include scholarshipImage and bannerImage validation
        ) {
          console.error('Validation Error: Missing required fields');
          return res.status(400).json({
            message: 'Title, category, field of study, number of scholarships, amount, application deadline, minimum GPA, nationality, other eligibility criteria, start date, end date, selection process, selection criteria, renewal policy, renewal duration, disbursement schedule, disbursement method, contact email, contact phone, provider ID, organization name, FAQ title, FAQ description, scholarship image, banner image, and providerRequirements are required fields.',
          });
        }

    // Validate date fields
    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);
    const parsedApplicationDeadline = new Date(applicationDeadline);

    if (
      isNaN(parsedStartDate.getTime()) ||
      isNaN(parsedEndDate.getTime()) ||
      isNaN(parsedApplicationDeadline.getTime())
    ) {
      console.error('Validation Error: Invalid date format');
      return res.status(400).json({
        message: 'Invalid date format for start date, end date, or application deadline.',
      });
    }

    // Create a new Scholarship document
    const newScholarship = new Scholarship({
      title,
      category,
      fieldOfStudy,
      numberOfScholarships,
      amount,
      applicationDeadline: parsedApplicationDeadline,
      minGPA,
      nationality,
      otherEligibility,
      startDate: parsedStartDate,
      endDate: parsedEndDate,
      selectionProcess,
      selectionCriteria,
      renewalPolicy,
      renewalDuration,
      disbursementSchedule,
      disbursementMethod,
      contactEmail,
      contactPhone,
      providerId,
      organizationName,
      requiredDocuments,
      documentGuidelines,
      scholarshipImage,
      bannerImage,
      sections,        
      faqTitle,       
      faqDescription,   
      providerRequirements
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
      amount: program.amount,
      slotsFilled: program.slotsFilled,
      totalSlots: program.totalSlots,
      duration: program.duration,
      category: program.category,
      type: program.type,
      academicRequirements: program.academicRequirements,
      fieldOfStudy: program.fieldOfStudy,
      levelOfEducation: program.levelOfEducation,
      location: program.location,
      applicationStartDate: program.applicationStartDate,
      applicationEndDate: program.applicationEndDate,
      notificationDate: program.notificationDate,
      coverage: program.coverage,
      contactPerson: program.contactPerson,
      providerId: program.providerId,
      scholarshipImage: program.scholarshipImage,
      scholarshipBanner: program.scholarshipBanner,
      status: program.status,
      approvedScholars: program.approvedScholars,
      details: program.details,
      datePosted: program.datePosted
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
      amount: program.amount,
      slotsFilled: program.slotsFilled,
      totalSlots: program.totalSlots,
      duration: program.duration,
      category: program.category,
      type: program.type,
      academicRequirements: program.academicRequirements,
      fieldOfStudy: program.fieldOfStudy,
      levelOfEducation: program.levelOfEducation,
      location: program.location,
      applicationStartDate: program.applicationStartDate,
      applicationEndDate: program.applicationEndDate,
      notificationDate: program.notificationDate,
      coverage: program.coverage,
      contactPerson: program.contactPerson,
      providerId: program.providerId,
      scholarshipImage: program.scholarshipImage,
      scholarshipBanner: program.scholarshipBanner,
      status: program.status,
      approvedScholars: program.approvedScholars,
      details: program.details,
      datePosted: program.datePosted
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
      amount: scholarshipProgram.amount,
      slotsFilled: scholarshipProgram.slotsFilled,
      totalSlots: scholarshipProgram.totalSlots,
      duration: scholarshipProgram.duration,
      category: scholarshipProgram.category,
      type: scholarshipProgram.type,
      academicRequirements: scholarshipProgram.academicRequirements,
      fieldOfStudy: scholarshipProgram.fieldOfStudy,
      levelOfEducation: scholarshipProgram.levelOfEducation,
      location: scholarshipProgram.location,
      applicationStartDate: scholarshipProgram.applicationStartDate,
      applicationEndDate: scholarshipProgram.applicationEndDate,
      notificationDate: scholarshipProgram.notificationDate,
      coverage: scholarshipProgram.coverage,
      contactPerson: scholarshipProgram.contactPerson,
      providerId: scholarshipProgram.providerId,
      scholarshipImage: scholarshipProgram.scholarshipImage,
      scholarshipBanner: scholarshipProgram.scholarshipBanner,
      status: scholarshipProgram.status,
      approvedScholars: scholarshipProgram.approvedScholars,
      details: scholarshipProgram.details.map(detail => ({
        title: detail.title,
        content: detail.content
      })),
      datePosted: scholarshipProgram.datePosted
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