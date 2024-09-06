import Validation from '../models/validation.model.js';
import ScholarshipProgram from '../models/scholarshipProgram.model.js';

export const test = (req, res) => {
    res.json({
        message: 'API is working!',
    });
};

export const postValidation = async (req, res) => {
    try {
        const { validationTitle, validationDescription, requirements, id } = req.body;

        // Transform requirements to the expected format
        const formattedRequirements = requirements.map(req => ({ requirement: req }));

        // Create a new validation object
        const newValidation = new Validation({
            validationTitle,
            validationDescription,
            requirements: formattedRequirements,
            dateCreated: new Date(), // Set dateCreated to the current date
            datePosted: new Date(), // Set datePosted to the current date
            scholarshipProgram: id // Associate with scholarship program
        });

        // Save the validation object to the database
        const savedValidation = await newValidation.save();

        // Send a success response
        res.status(201).json(savedValidation);
    } catch (error) {
        // Handle errors
        res.status(500).json({ error: error.message });
    }
};

// Function to get validations for a specific scholarship program
export const getValidationByProgram = async (req, res) => {
    try {
        const { id } = req.params; // Extract the scholarship program ID from the request parameters

        // Query the database for validations associated with the given scholarship program ID
        const validations = await Validation.find({ scholarshipProgram: id });

        // Check if validations were found
        if (!validations.length) {
            return res.status(404).json({ message: 'No validations found for this scholarship program' });
        }

        // Send the found validations as a response
        res.status(200).json(validations);
    } catch (error) {
        // Handle errors
        res.status(500).json({ error: error.message });
    }
};