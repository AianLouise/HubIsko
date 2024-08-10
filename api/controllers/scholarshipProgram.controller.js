import Scholarship from '../models/scholarshipProgram.model.js';

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
      url
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
      url
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

    // Map the scholarship programs to include the ID
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
      additionalInformation: program.additionalInformation
    }));

    res.status(200).json(formattedPrograms);
  } catch (error) {
    console.error('Error fetching scholarship programs:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

