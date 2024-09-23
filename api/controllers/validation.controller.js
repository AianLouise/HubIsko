import Validation from '../models/validation.model.js';
import ScholarshipProgram from '../models/scholarshipProgram.model.js';
import Notification from '../models/notification.model.js';
import User from '../models/user.model.js';

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

        // Fetch the scholarship program to get the approved scholars
        const scholarshipProgram = await ScholarshipProgram.findById(id).populate('approvedScholars');

        if (!scholarshipProgram) {
            return res.status(404).json({ error: 'Scholarship program not found' });
        }

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
            courierDetails: validationMethod === 'Courier-Based' ? courierDetails : undefined,
            validationResults: scholarshipProgram.approvedScholars.map(scholar => ({
                scholar: scholar._id,
                status: 'Pending'
            }))
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

        // Find the validation by ID
        const validation = await Validation.findById(id);

        // Check if the validation was found
        if (!validation) {
            return res.status(404).json({ message: 'Validation not found' });
        }

        // Update the status to 'Upcoming' and set the datePosted
        validation.status = 'Upcoming';
        validation.datePosted = new Date(); // Set the current date as the datePosted

        // Fetch the scholarship program to get the approved scholars
        const scholarshipProgram = await ScholarshipProgram.findById(validation.scholarshipProgram).populate('approvedScholars');

        if (!scholarshipProgram) {
            return res.status(404).json({ message: 'Scholarship program not found' });
        }

        // Add approved scholars to validation results if not already present
        const existingScholars = validation.validationResults.map(result => result.scholar.toString());
        scholarshipProgram.approvedScholars.forEach(scholar => {
            if (!existingScholars.includes(scholar._id.toString())) {
                validation.validationResults.push({
                    scholar: scholar._id,
                    status: 'Pending'
                });
            }
        });

        // Save the updated validation
        await validation.save();

        // Create notifications for all approved scholars
        const notifications = await Promise.all(scholarshipProgram.approvedScholars.map(async scholar => {
            const recipientDetails = await User.findById(scholar._id);
            return {
                recipientId: scholar._id,
                senderId: scholarshipProgram.providerId,
                scholarshipId: scholarshipProgram._id,
                type: 'validation',
                message: `A new validation titled "${validation.validationTitle}" has been posted for the ${scholarshipProgram.title} scholarship program.`,
                recipientName: `${recipientDetails.applicantDetails.firstName} ${recipientDetails.applicantDetails.lastName}`,
                senderName: scholarshipProgram.organizationName
            };
        }));

        // Save all notifications to the database
        await Notification.insertMany(notifications);

        // Send the updated validation as a response
        res.status(200).json(validation);
    } catch (error) {
        // Handle errors
        res.status(500).json({ error: error.message });
    }
};

export const startValidation = async (req, res) => {
    const { id } = req.params;

    try {
        // Find the validation by ID
        const validation = await Validation.findById(id);

        // Check if the validation was found
        if (!validation) {
            return res.status(404).json({ message: 'Validation not found' });
        }

        // Update the status to 'Ongoing' and set the dateStarted
        validation.status = 'Ongoing';
        validation.dateStarted = new Date(); // Set the current date as the dateStarted

        // Fetch the scholarship program to get the approved scholars
        const scholarshipProgram = await ScholarshipProgram.findById(validation.scholarshipProgram).populate('approvedScholars');

        if (!scholarshipProgram) {
            return res.status(404).json({ message: 'Scholarship program not found' });
        }

        // Add approved scholars to validation results if not already present
        const existingScholars = validation.validationResults.map(result => result.scholar.toString());
        scholarshipProgram.approvedScholars.forEach(scholar => {
            if (!existingScholars.includes(scholar._id.toString())) {
                validation.validationResults.push({
                    scholar: scholar._id,
                    status: 'Pending'
                });
            }
        });

        // Save the updated validation
        await validation.save();

        // Create notifications for all approved scholars
        const notifications = await Promise.all(scholarshipProgram.approvedScholars.map(async scholar => {
            const recipientDetails = await User.findById(scholar._id);
            return {
                recipientId: scholar._id,
                senderId: scholarshipProgram.providerId,
                scholarshipId: scholarshipProgram._id,
                type: 'validation',
                message: `The validation titled "${validation.validationTitle}" for the ${scholarshipProgram.title} scholarship program is now ongoing.`,
                recipientName: `${recipientDetails.applicantDetails.firstName} ${recipientDetails.applicantDetails.lastName}`,
                senderName: scholarshipProgram.organizationName
            };
        }));

        // Save all notifications to the database
        await Notification.insertMany(notifications);

        // Send the updated validation as a response
        res.status(200).json(validation);
    } catch (error) {
        // Handle errors
        console.error('Error starting validation:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateValidation = async (req, res) => {
    const { id } = req.params;
    const { validationTitle, validationDescription, requirements, validationMethod, faceToFaceDetails, courierDetails } = req.body;

    try {
        const validation = await Validation.findById(id);

        if (!validation) {
            return res.status(404).json({ message: 'Validation not found' });
        }

        validation.validationTitle = validationTitle;
        validation.validationDescription = validationDescription;
        validation.requirements = requirements;
        validation.validationMethod = validationMethod;
        validation.dateUpdated = new Date(); // Set the current date as the dateUpdated

        if (validationMethod === 'Face-to-Face') {
            validation.faceToFaceDetails = faceToFaceDetails;
            validation.courierDetails = undefined; // Clear courier details if not applicable
        } else if (validationMethod === 'Courier-Based') {
            validation.courierDetails = courierDetails;
            validation.faceToFaceDetails = undefined; // Clear face-to-face details if not applicable
        } else {
            validation.faceToFaceDetails = undefined;
            validation.courierDetails = undefined;
        }

        // Fetch the scholarship program to get the approved scholars
        const scholarshipProgram = await ScholarshipProgram.findById(validation.scholarshipProgram).populate('approvedScholars');

        if (!scholarshipProgram) {
            return res.status(404).json({ message: 'Scholarship program not found' });
        }

        // Add approved scholars to validation results if not already present
        const existingScholars = validation.validationResults.map(result => result.scholar.toString());
        scholarshipProgram.approvedScholars.forEach(scholar => {
            if (!existingScholars.includes(scholar._id.toString())) {
                validation.validationResults.push({
                    scholar: scholar._id,
                    status: 'Pending'
                });
            }
        });

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
        validation.dateDone = new Date(); // Set the current date and time as dateDone
        await validation.save();

        // Fetch the scholarship program to get the approved scholars
        const scholarshipProgram = await ScholarshipProgram.findById(validation.scholarshipProgram).populate('approvedScholars');

        if (!scholarshipProgram) {
            return res.status(404).json({ message: 'Scholarship program not found' });
        }

        // Create notifications for all approved scholars
        const notifications = await Promise.all(scholarshipProgram.approvedScholars.map(async scholar => {
            const recipientDetails = await User.findById(scholar._id);
            return {
                recipientId: scholar._id,
                senderId: scholarshipProgram.providerId,
                scholarshipId: scholarshipProgram._id,
                type: 'validation',
                message: `The validation titled "${validation.validationTitle}" for the ${scholarshipProgram.title} scholarship program has been completed.`,
                recipientName: `${recipientDetails.applicantDetails.firstName} ${recipientDetails.applicantDetails.lastName}`,
                senderName: scholarshipProgram.organizationName
            };
        }));

        // Save all notifications to the database
        await Notification.insertMany(notifications);

        res.status(200).json({ message: 'Validation status updated to Completed successfully' });
    } catch (error) {
        console.error('Error updating validation status:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getValidationsByProgram = async (req, res) => {
    const { programId } = req.params;

    try {
        const validations = await Validation.find({ programId, status: 'Upcoming' });

        if (!validations.length) {
            return res.status(404).json({ message: 'No validations found for this program' });
        }

        res.status(200).json(validations);
    } catch (error) {
        console.error('Error fetching validations:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getValidationsByProvider = async (req, res) => {
    const { providerId } = req.params;

    try {
        // Fetch all scholarship programs of the provider
        const scholarshipPrograms = await ScholarshipProgram.find({ providerId: providerId });

        if (!scholarshipPrograms.length) {
            return res.status(404).json({ message: 'No scholarship programs found for this provider' });
        }

        // Extract the program IDs
        const programIds = scholarshipPrograms.map(program => program._id);

        // Fetch all validations for the scholarship programs of the provider
        const validations = await Validation.find({ scholarshipProgram: { $in: programIds } })
            .populate({
                path: 'scholarshipProgram',
                select: 'scholarshipImage title' // Only select the scholarshipImage and title fields
            })
            .populate({
                path: 'validationResults.scholar',
                select: 'profilePicture applicantDetails.firstName applicantDetails.lastName' // Select the required fields from the User model
            });

        if (!validations.length) {
            return res.status(404).json({ message: 'No validations found for the scholarship programs of this provider' });
        }

        res.status(200).json(validations);
    } catch (error) {
        console.error('Error fetching validations:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Approve validation result
export const approveValidationResult = async (req, res) => {
    const { validationId, resultId } = req.params;

    try {
        const validation = await Validation.findById(validationId);
        if (!validation) {
            return res.status(404).json({ message: 'Validation not found' });
        }

        const result = validation.validationResults.id(resultId);
        if (!result) {
            return res.status(404).json({ message: 'Validation result not found' });
        }

        result.status = 'Approved';
        await validation.save();

        // Fetch the scholar details
        const scholar = await User.findById(result.scholar);
        if (!scholar) {
            return res.status(404).json({ message: 'Scholar not found' });
        }

        // Fetch the scholarship program details
        const scholarshipProgram = await ScholarshipProgram.findById(validation.scholarshipProgram);
        if (!scholarshipProgram) {
            return res.status(404).json({ message: 'Scholarship program not found' });
        }

        // Create a notification for the scholar
        const notification = new Notification({
            recipientId: scholar._id,
            senderId: scholarshipProgram.providerId,
            scholarshipId: scholarshipProgram._id,
            type: 'validation',
            message: `Your validation for "${validation.validationTitle}" has been approved.`,
            recipientName: `${scholar.applicantDetails.firstName} ${scholar.applicantDetails.lastName}`,
            senderName: scholarshipProgram.organizationName
        });

        // Save the notification to the database
        await notification.save();

        res.status(200).json({ message: 'Validation result approved successfully' });
    } catch (error) {
        console.error('Error approving validation result:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Reject validation result with feedback
export const rejectValidationResult = async (req, res) => {
    const { validationId, resultId } = req.params;
    const { feedback } = req.body; // Extract feedback from request body

    try {
        const validation = await Validation.findById(validationId);
        if (!validation) {
            return res.status(404).json({ message: 'Validation not found' });
        }

        const result = validation.validationResults.id(resultId);
        if (!result) {
            return res.status(404).json({ message: 'Validation result not found' });
        }

        result.status = 'Rejected';
        result.feedback = feedback; // Store feedback in the validation result
        await validation.save();

        // Fetch the scholar details
        const scholar = await User.findById(result.scholar);
        if (!scholar) {
            return res.status(404).json({ message: 'Scholar not found' });
        }

        // Fetch the scholarship program details
        const scholarshipProgram = await ScholarshipProgram.findById(validation.scholarshipProgram);
        if (!scholarshipProgram) {
            return res.status(404).json({ message: 'Scholarship program not found' });
        }

        // Create a notification for the scholar
        const notification = new Notification({
            recipientId: scholar._id,
            senderId: scholarshipProgram.providerId,
            scholarshipId: scholarshipProgram._id,
            type: 'validation',
            message: `Your validation for "${validation.validationTitle}" has been rejected. Feedback: ${feedback}`,
            recipientName: `${scholar.applicantDetails.firstName} ${scholar.applicantDetails.lastName}`,
            senderName: scholarshipProgram.organizationName
        });

        // Save the notification to the database
        await notification.save();

        res.status(200).json({ message: 'Validation result rejected successfully' });
    } catch (error) {
        console.error('Error rejecting validation result:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Function to get validation by ID
export const getValidationById = async (req, res) => {
    const { validationId } = req.params;

    try {
        // Find the validation by ID and populate the scholar details
        const validation = await Validation.findById(validationId).populate({
            path: 'validationResults.scholar',
            select: 'applicantDetails.firstName applicantDetails.lastName profilePicture'
        });

        // Check if the validation was found
        if (!validation) {
            return res.status(404).json({ message: 'Validation not found' });
        }

        // Send the validation as a response
        res.status(200).json(validation);
    } catch (error) {
        // Handle errors
        console.error('Error fetching validation:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getValidationResultByScholarId = async (req, res) => {
    const { scholarId } = req.params;

    try {
        // Find the validation results for the specific scholar
        const validationResults = await Validation.find({ 'validationResults.scholar': scholarId });

        // Check if any validation results were found
        if (!validationResults || validationResults.length === 0) {
            return res.status(404).json({ message: 'Validation results not found for the specified scholar' });
        }

        // Extract the status, validation table ID, feedback, and validation title from the validation results
        const resultsWithStatus = validationResults.flatMap(validation => 
            validation.validationResults
                .filter(result => result.scholar.toString() === scholarId)
                .map(result => ({
                    scholar: result.scholar,
                    status: result.status,
                    validationId: validation._id,
                    feedback: result.feedback,
                    validationTitle: validation.validationTitle,
                    dateDone: validation.dateDone,
                    validationStatus: validation.status
                }))
        );

        // Send the validation results with status, validation table ID, feedback, and validation title as a response
        res.status(200).json(resultsWithStatus);
    } catch (error) {
        // Handle errors
        console.error('Error fetching validation results:', error);
        res.status(500).json({ message: 'Server error' });
    }
};