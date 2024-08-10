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
      numberOfScholarships,
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
    if (!title || !description || !applicationInstructions || numberOfScholarships === undefined || !duration || !category || !type || !academicRequirements || !fieldOfStudy || !levelOfEducation || !location || !applicationStartDate || !applicationEndDate || !notificationDate || !coverage || !contactPerson || !providerId) {
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
      numberOfScholarships,
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
