import Scholarship from '../models/scholarshipProgram.model.js';

export const test = (req, res) => {
    res.json({
      message: 'API is working!',
    });
  };

// Controller function to handle the creation of a scholarship program
export const createScholarshipProgram = async (req, res) => {
  try {
    // Log the request body for debugging
    console.log('Request Body:', req.body);

    // Extract data from request body
    const {
      name,
      description,
      amount,
      requirements,
      deadline,
      website,
      email,
      phone,
      address,
      image,
      eligibility,
      applicationProcess,
      numScholarships,
      duration,
      documents,
      category,
      provider,
    } = req.body;

    // Validate required fields
    if (!category || !provider) {
      return res.status(400).json({
        message: 'Category and provider are required fields.',
      });
    }

    // Additional validation (example)
    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({
        message: 'Amount must be a positive number.',
      });
    }

    // Create a new Scholarship document
    const newScholarship = new Scholarship({
      name,
      description,
      amount,
      requirements,
      deadline,
      website,
      email,
      phone,
      address,
      image,
      eligibility,
      applicationProcess,
      numScholarships,
      duration,
      documents,
      category,
      provider,
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
