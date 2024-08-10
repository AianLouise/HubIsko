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
      name,
      description,
      amount,
      deadline,
      email,
      website,
      phone,
      address,
      eligibility,
      applicationProcess,
      numScholarships,
      duration,
      documents,
      category,
      typeOfScholarship,
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
      provider,
    } = req.body;

    // Validate required fields
    if (!name || !description || !amount || !deadline || !email || !provider || !category) {
      return res.status(400).json({
        message: 'Name, description, amount, deadline, email, provider, and category are required fields.',
      });
    }

    // Validate email format
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: 'Invalid email format.',
      });
    }

    // Ensure amount is a number and positive
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({
        message: 'Amount must be a positive number.',
      });
    }

    // Ensure deadline is a valid date
    const parsedDeadline = new Date(deadline);
    if (isNaN(parsedDeadline.getTime())) {
      return res.status(400).json({
        message: 'Invalid deadline date.',
      });
    }

    // Ensure other date fields are valid if provided
    const parsedApplicationStartDate = applicationStartDate ? new Date(applicationStartDate) : null;
    const parsedApplicationEndDate = applicationEndDate ? new Date(applicationEndDate) : null;
    const parsedNotificationDate = notificationDate ? new Date(notificationDate) : null;

    // Create a new Scholarship document
    const newScholarship = new Scholarship({
      name,
      description,
      amount: numericAmount,
      deadline: parsedDeadline,
      email,
      website,
      phone,
      address,
      eligibility,
      applicationProcess,
      numScholarships,
      duration,
      documents,
      category,
      typeOfScholarship,
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
      provider, // Assign the provider ID
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
