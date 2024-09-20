import Validation from '../models/validation.model.js';
import ScholarshipProgram from '../models/scholarshipProgram.model.js';

export const test = (req, res) => {
    res.json({
        message: 'API is working!',
    });
};

export const createValidation = async (req, res) => {
    try {
        const { validationTitle, validationDescription, requirements, id, validationMethod, faceToFaceDetails, courierDetails } = req.body;

        // Transform requirements to the expected format
        const formattedRequirements = requirements.map(req => ({ requirement: req }));

        // Create a new validation object
        const newValidation = new Validation({
            validationTitle,
            validationDescription,
            requirements: formattedRequirements,
            dateCreated: new Date(), // Set dateCreated to the current date
            datePosted: new Date(), // Set datePosted to the current date
            scholarshipProgram: id, // Associate with scholarship program
            validationMethod,
            faceToFaceDetails: validationMethod === 'Face-to-Face' ? faceToFaceDetails : undefined,
            courierDetails: validationMethod === 'Courier-Based' ? courierDetails : undefined
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

export const postValidation = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the validation by ID and update its status to 'Posted'
        const validation = await Validation.findByIdAndUpdate(
            id,
            { status: 'Ongoing' },
            { new: true }
        );

        // Check if the validation was found and updated
        if (!validation) {
            return res.status(404).json({ message: 'Validation not found' });
        }

        // Send the updated validation as a response
        res.status(200).json(validation);
    } catch (error) {
        // Handle errors
        res.status(500).json({ error: error.message });
    }
};

export const updateValidation = async (req, res) => {
    const { id } = req.params;
    const { validationTitle, validationDescription, requirements } = req.body;

    try {
        const validation = await Validation.findById(id);

        if (!validation) {
            return res.status(404).json({ message: 'Validation not found' });
        }

        validation.validationTitle = validationTitle;
        validation.validationDescription = validationDescription;
        validation.requirements = requirements;

        await validation.save();

        res.status(200).json({ message: 'Validation updated successfully', validation });
    } catch (error) {
        console.error('Error updating validation:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteValidation = async (req, res) => {
    const { id } = req.params;

    try {
        const validation = await Validation.findById(id);

        if (!validation) {
            return res.status(404).json({ message: 'Validation not found' });
        }

        validation.status = 'Deleted';
        await validation.save();

        res.status(200).json({ message: 'Validation status updated to Deleted successfully' });
    } catch (error) {
        console.error('Error updating validation status:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const completeValidation = async (req, res) => {
    const { id } = req.params;

    try {
        const validation = await Validation.findById(id);

        if (!validation) {
            return res.status(404).json({ message: 'Validation not found' });
        }

        validation.status = 'Done';
        await validation.save();

        res.status(200).json({ message: 'Validation status updated to Completed successfully' });
    } catch (error) {
        console.error('Error updating validation status:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getValidationsByProgram = async (req, res) => {
    const { programId } = req.params;

    try {
        const validations = await Validation.find({ programId, status: 'Ongoing' });

        if (!validations.length) {
            return res.status(404).json({ message: 'No validations found for this program' });
        }

        res.status(200).json(validations);
    } catch (error) {
        console.error('Error fetching validations:', error);
        res.status(500).json({ message: 'Server error' });
    }
};