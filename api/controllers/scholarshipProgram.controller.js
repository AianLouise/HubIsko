import Scholarship from '../models/scholarshipProgram.model.js';
import ScholarshipApplication from '../models/scholarshipApplication.model.js';
import User from '../models/user.model.js';
import Notification from '../models/notification.model.js';
import ActivityLog from '../models/activityLog.model.js'; // Adjust the import path as necessary

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
      numberOfScholarships,
      amount,
      educationLevel,
      location,
      fieldOfStudy,
      duration,
      selectionProcess,
      selectionCriteria,
      renewalPolicy,
      renewalDuration,
      disbursementSchedule,
      disbursementMethod,
      bankName,
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
      providerRequirements,

    } = req.body;

    // Ensure fieldOfStudy is an array
    const fieldOfStudyArray = Array.isArray(fieldOfStudy) ? fieldOfStudy : [fieldOfStudy];

    // Create a new Scholarship document
    const newScholarship = new Scholarship({
      title,
      description,
      numberOfScholarships,
      amount,
      educationLevel,
      location,
      fieldOfStudy: fieldOfStudyArray,
      duration,
      selectionProcess,
      selectionCriteria,
      renewalPolicy,
      renewalDuration,
      disbursementSchedule,
      disbursementMethod,
      bankName,
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

    // Create an activity log entry for creating a scholarship program
    const activityLog = new ActivityLog({
      userId: providerId,
      action: 'CREATE',
      type: 'scholarship',
      details: `Scholarship program created: ${title}`
    });

    await activityLog.save();

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

    // Map the scholarship programs to include the necessary fields
    const formattedPrograms = scholarshipPrograms.map(program => ({
      _id: program._id,
      title: program.title,
      description: program.description,
      numberOfScholarships: program.numberOfScholarships,
      amount: program.amount,
      fieldOfStudy: program.fieldOfStudy,
      duration: program.duration,
      location: program.location,
      educationLevel: program.educationLevel,
      applicationStartDate: program.applicationStartDate,
      applicationDeadline: program.applicationDeadline,
      selectionProcess: program.selectionProcess,
      selectionCriteria: program.selectionCriteria,
      renewalPolicy: program.renewalPolicy,
      renewalDuration: program.renewalDuration,
      disbursementSchedule: program.disbursementSchedule,
      disbursementMethod: program.disbursementMethod,
      contactEmail: program.contactEmail,
      contactPhone: program.contactPhone,
      providerId: program.providerId,
      organizationName: program.organizationName,
      requiredDocuments: program.requiredDocuments,
      documentGuidelines: program.documentGuidelines,
      scholarshipImage: program.scholarshipImage,
      bannerImage: program.bannerImage,
      sections: program.sections,
      faqTitle: program.faqTitle,
      faqDescription: program.faqDescription,
      providerRequirements: program.providerRequirements,
      status: program.status,
      approvedScholars: program.approvedScholars.length,
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
      numberOfScholarships: program.numberOfScholarships,
      amount: program.amount,
      fieldOfStudy: program.fieldOfStudy,
      duration: program.duration,
      location: program.location,
      educationLevel: program.educationLevel,
      applicationStartDate: program.applicationStartDate,
      applicationDeadline: program.applicationDeadline,
      selectionProcess: program.selectionProcess,
      selectionCriteria: program.selectionCriteria,
      renewalPolicy: program.renewalPolicy,
      renewalDuration: program.renewalDuration,
      disbursementSchedule: program.disbursementSchedule,
      disbursementMethod: program.disbursementMethod,
      contactEmail: program.contactEmail,
      contactPhone: program.contactPhone,
      providerId: program.providerId,
      organizationName: program.organizationName,
      requiredDocuments: program.requiredDocuments,
      documentGuidelines: program.documentGuidelines,
      scholarshipImage: program.scholarshipImage,
      bannerImage: program.bannerImage,
      sections: program.sections,
      faqTitle: program.faqTitle,
      faqDescription: program.faqDescription,
      providerRequirements: program.providerRequirements,
      status: program.status,
      approvedScholars: program.approvedScholars.length, // Assuming approvedScholars is an array
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
      .select('scholarshipProviderDetails.organizationName name profilePicture status');

    // if (!providers || providers.length === 0) {
    //   return res.status(404).json({ error: 'No scholarship providers found' });
    // }

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
      numberOfScholarships: scholarshipProgram.numberOfScholarships,
      amount: scholarshipProgram.amount,
      fieldOfStudy: scholarshipProgram.fieldOfStudy,
      duration: scholarshipProgram.duration,
      location: scholarshipProgram.location,
      educationLevel: scholarshipProgram.educationLevel,
      applicationStartDate: scholarshipProgram.applicationStartDate,
      applicationDeadline: scholarshipProgram.applicationDeadline,
      selectionProcess: scholarshipProgram.selectionProcess,
      selectionCriteria: scholarshipProgram.selectionCriteria,
      renewalPolicy: scholarshipProgram.renewalPolicy,
      renewalDuration: scholarshipProgram.renewalDuration,
      disbursementSchedule: scholarshipProgram.disbursementSchedule,
      disbursementMethod: scholarshipProgram.disbursementMethod,
      bankName: scholarshipProgram.bankName,
      contactEmail: scholarshipProgram.contactEmail,
      contactPhone: scholarshipProgram.contactPhone,
      providerId: scholarshipProgram.providerId,
      organizationName: scholarshipProgram.organizationName,
      requiredDocuments: scholarshipProgram.requiredDocuments,
      documentGuidelines: scholarshipProgram.documentGuidelines,
      scholarshipImage: scholarshipProgram.scholarshipImage,
      bannerImage: scholarshipProgram.bannerImage,
      sections: scholarshipProgram.sections,
      faqTitle: scholarshipProgram.faqTitle,
      faqDescription: scholarshipProgram.faqDescription,
      providerRequirements: scholarshipProgram.providerRequirements,
      status: scholarshipProgram.status,
      dateUpdated: scholarshipProgram.dateUpdated,
      approvedScholars: scholarshipProgram.approvedScholars.length,
      applicationDeadline: scholarshipProgram.applicationDeadline,
    };

    res.status(200).json(formattedProgram);
  } catch (error) {
    console.error('Error fetching scholarship program:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getOrganizationName = async (req, res) => {
  try {
    const organizationId = req.params.organizationId;

    // Check if organizationId is defined and is a valid ObjectId
    if (!organizationId || !mongoose.Types.ObjectId.isValid(organizationId)) {
      return res.status(400).json({ error: 'Invalid organization ID' });
    }

    const organization = await User.findById(organizationId);

    if (!organization) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    res.json({ name: organization.name });
  } catch (error) {
    console.error('Error fetching organization name:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getScholarshipApplications = async (req, res) => {
  try {
    const { id } = req.params; // Extract id from URL parameters

    // Query the scholarshipApplication table and populate the applicant field
    const applications = await ScholarshipApplication.find({ scholarshipProgram: id })
      .populate('applicant'); // Populate applicant with specific fields

    if (!applications || applications.length === 0) {
      return res.status(404).json({ message: 'No applications found for this scholarship program' });
    }

    res.status(200).json(applications);
  } catch (error) {
    console.error('Error fetching scholarship applications:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getApplicantDetails = async (req, res) => {
  try {
    const { id } = req.params; // Extract id from URL parameters

    // Query the Applicant table
    const applicant = await ScholarshipApplication.findById(id);

    if (!applicant) {
      return res.status(404).json({ message: 'Applicant not found' });
    }

    res.status(200).json(applicant);
  } catch (error) {
    console.error('Error fetching applicant details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateApplicationStatus = async (req, res) => {
  const { id } = req.params;
  const { applicationStatus, rejectionNote, allowResubmission } = req.body;

  try {
    // Prepare the fields to be updated based on the application status
    const updateFields = { applicationStatus };

    if (applicationStatus === 'Rejected') {
      updateFields.rejectionNote = rejectionNote || 'No specific reason provided';
      updateFields.allowResubmission = allowResubmission || false;
    } else if (applicationStatus === 'Approved') {
      updateFields.rejectionNote = null;
      updateFields.allowResubmission = false;
    }

    // Update the application status in the database
    const application = await ScholarshipApplication.findByIdAndUpdate(
      id,
      updateFields,
      { new: true }  // Return the updated document
    );

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Fetch the scholarship program details to get the providerId and program name
    const scholarshipProgramDetails = await Scholarship.findById(application.scholarshipProgram);
    if (!scholarshipProgramDetails) {
      return res.status(404).json({ message: 'Scholarship Program not found' });
    }

    const providerId = scholarshipProgramDetails.providerId;

    // Fetch the applicant and provider details to get their names
    const applicantDetails = await User.findById(application.applicant);
    const providerDetails = await User.findById(providerId);

    if (!applicantDetails || !providerDetails) {
      return res.status(404).json({ message: 'Applicant or Provider not found' });
    }

    // Create notification based on application status
    let notificationMessage = '';
    if (applicationStatus === 'Rejected') {
      notificationMessage = `Your application for the ${scholarshipProgramDetails.title} has been rejected. Reason: ${updateFields.rejectionNote}`;
    } else if (applicationStatus === 'Approved') {
      notificationMessage = `Congratulations! Your application for the ${scholarshipProgramDetails.title} has been approved.`;
    } else {
      notificationMessage = `Your application status for the ${scholarshipProgramDetails.title} has been updated to: ${applicationStatus}`;
    }

    const notification = new Notification({
      recipientId: application.applicant, // The applicant is the recipient
      senderId: providerId, // The provider is the sender
      scholarshipId: application.scholarshipProgram,
      type: 'application',
      message: notificationMessage,
      recipientName: `${applicantDetails.applicantDetails.firstName} ${applicantDetails.applicantDetails.lastName}`, // Save applicant's name as recipientName
      senderName: providerDetails.scholarshipProviderDetails.organizationName, // Save provider's organization name as senderName
    });

    await notification.save();

    // Respond with the updated application
    res.status(200).json({
      message: 'Application status updated successfully',
      application,
    });
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({
      message: 'Failed to update application status',
      error: error.message,
    });
  }
};

export const addApprovedScholar = async (req, res) => {
  const { userId, programId } = req.params;

  try {
    const program = await Scholarship.findById(programId);

    if (!program) {
      return res.status(404).json({ message: 'Scholarship program not found' });
    }

    // Add the userId to the approvedScholars array
    program.approvedScholars.push(userId);

    // Save the updated program
    await program.save();

    res.status(200).json(program);
  } catch (error) {
    console.error('Error adding approved scholar:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAllApplicationsForProvider = async (req, res) => {
  const { providerId } = req.params;

  try {
    // Fetch all scholarship programs for the provider
    const programs = await Scholarship.find({ providerId: providerId });

    if (!programs.length) {
      return res.status(404).json({ message: 'No scholarship programs found for this provider' });
    }

    // Fetch all applications for each scholarship program and populate the scholarshipProgram field
    const applications = await Promise.all(
      programs.map(async (program) => {
        const programApplications = await ScholarshipApplication.find({ scholarshipProgram: program._id }).populate('scholarshipProgram');
        return programApplications;
      })
    );

    // Flatten the array of arrays
    const allApplications = applications.flat();

    // Fetch applicant details for each application
    const applicationsWithApplicantDetails = await Promise.all(
      allApplications.map(async (application) => {
        const applicantDetails = await User.findById(application.applicant);
        return {
          ...application.toObject(),
          applicantDetails,
        };
      })
    );

    res.status(200).json(applicationsWithApplicantDetails);
  } catch (error) {
    console.error('Error fetching applications for provider:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getRequiredDocuments = async (req, res) => {
  const { programId } = req.params;

  try {
    const scholarshipProgram = await Scholarship.findById(programId);

    if (!scholarshipProgram) {
      return res.status(404).json({ message: 'Scholarship program not found' });
    }

    const requiredDocuments = scholarshipProgram.requiredDocuments;

    if (!requiredDocuments || requiredDocuments.length === 0) {
      return res.status(404).json({ message: 'No required documents found' });
    }

    res.status(200).json(requiredDocuments);
  } catch (error) {
    console.error('Error fetching required documents:', error);
    res.status(500).json({
      message: 'Error fetching required documents',
      error: error.message
    });
  }
};

export const getApprovedScholarInfo = async (req, res) => {
  const { programId } = req.params;

  try {
    // Fetch the scholarship program by ID
    const scholarshipProgram = await Scholarship.findById(programId);

    if (!scholarshipProgram) {
      return res.status(404).json({ message: 'Scholarship program not found' });
    }

    // Extract the approvedScholars array
    const approvedScholars = scholarshipProgram.approvedScholars;

    if (!approvedScholars || approvedScholars.length === 0) {
      return res.status(404).json({ message: 'No approved scholars found' });
    }

    // Find details of each approved scholar's application using their _id
    const scholarDetails = await Promise.all(
      approvedScholars.map(async (scholar) => {
        const application = await ScholarshipApplication.findOne({ applicant: scholar._id })
          .populate('applicant'); // Populate applicant with specific fields

        if (!application) {
          console.warn(`Scholarship application not found for scholar ID: ${scholar._id}`);
          return null; // Skip this scholar if application not found
        }

        return {
          ...scholar,
          applicationDetails: application
        };
      })
    );

    // Filter out any null values (in case of errors or missing data)
    const filteredScholarDetails = scholarDetails.filter(details => details !== null);

    // Return the list of approved scholars with application details
    res.status(200).json(filteredScholarDetails);
  } catch (error) {
    console.error('Error fetching approved scholars:', error);
    res.status(500).json({
      message: 'Error fetching approved scholars',
      error: error.message
    });
  }
};

export const hasUserApplied = async (req, res) => {
  const { programId, userId } = req.params; // Extracting from URL parameters

  try {
    const existingApplication = await ScholarshipApplication.findOne({
      scholarshipProgram: programId,
      applicant: userId
    });

    if (existingApplication) {
      return res.status(200).json({ hasApplied: true });
    } else {
      return res.status(200).json({ hasApplied: false });
    }
  } catch (error) {
    console.error('Error checking if user has applied:', error);
    return res.status(500).json({ error: 'Error checking application status' });
  }
};

export const publishScholarshipProgram = async (req, res) => {
  const { id } = req.params;
  const { applicationDeadline } = req.body; // Get the application deadline from the request body

  try {
    const program = await Scholarship.findById(id);
    if (!program) {
      return res.status(404).json({ message: 'Scholarship Program not found' });
    }

    // Set the program status to 'Published', update the application deadline, and set the application start date
    program.status = 'Published';
    program.applicationDeadline = applicationDeadline;
    program.applicationStartDate = Date.now(); // Set the application start date to the current date and time
    await program.save();

    // Create an activity log entry for publishing the scholarship program
    const activityLog = new ActivityLog({
      userId: program.providerId,
      action: 'PUBLISH',
      type: 'scholarship',
      details: `Scholarship program published: ${program.title}`
    });

    await activityLog.save();

    res.status(200).json({ message: 'Scholarship Program successfully published', program });
  } catch (error) {
    console.error('Error publishing scholarship program:', error);
    res.status(500).json({ message: 'Server error while publishing program' });
  }
};

export const extendDeadline = async (req, res) => {
  const { id } = req.params;
  const { newDeadline } = req.body;

  try {
    // Find the scholarship program by id
    const scholarship = await Scholarship.findById(id);
    if (!scholarship) {
      return res.status(404).json({ message: 'Scholarship program not found' });
    }

    // Update the deadline
    scholarship.applicationDeadline = newDeadline;

    // Save the updated scholarship program
    await scholarship.save();

    // Create an activity log entry for extending the application deadline
    const activityLog = new ActivityLog({
      userId: scholarship.providerId,
      action: 'EXTEND_DEADLINE',
      type: 'scholarship',
      details: `Application deadline extended for scholarship program: ${scholarship.title}`
    });

    await activityLog.save();

    // Respond with the updated scholarship program
    res.status(200).json(scholarship);
  } catch (error) {
    console.error('Error extending the application deadline:', error);
    res.status(500).json({ message: 'Failed to extend the application deadline', error: error.message });
  }
};

export const pauseScholarshipProgram = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the scholarship program by id
    const scholarship = await Scholarship.findById(id);
    if (!scholarship) {
      return res.status(404).json({ message: 'Scholarship program not found' });
    }

    // Update the status to 'Paused'
    scholarship.status = 'Paused';

    // Save the updated scholarship program
    await scholarship.save();

    // Create an activity log entry for pausing the scholarship program
    const activityLog = new ActivityLog({
      userId: scholarship.providerId,
      action: 'PAUSE',
      type: 'scholarship',
      details: `Scholarship program paused: ${scholarship.title}`
    });

    await activityLog.save();

    // Respond with the updated scholarship program
    res.status(200).json(scholarship);
  } catch (error) {
    console.error('Error pausing the scholarship program:', error);
    res.status(500).json({ message: 'Failed to pause the scholarship program', error: error.message });
  }
};

export const resumeScholarshipProgram = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the scholarship program by id
    const scholarship = await Scholarship.findById(id);
    if (!scholarship) {
      return res.status(404).json({ message: 'Scholarship program not found' });
    }

    // Update the status to 'Published'
    scholarship.status = 'Published';

    // Save the updated scholarship program
    await scholarship.save();

    // Create an activity log entry for resuming the scholarship program
    const activityLog = new ActivityLog({
      userId: scholarship.providerId,
      action: 'RESUME',
      type: 'scholarship',
      details: `Scholarship program resumed: ${scholarship.title}`
    });

    await activityLog.save();

    // Respond with the updated scholarship program
    res.status(200).json(scholarship);
  } catch (error) {
    console.error('Error resuming the scholarship program:', error);
    res.status(500).json({ message: 'Failed to resume the scholarship program', error: error.message });
  }
};

export const updateScholarshipStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updatedProgram = await Scholarship.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedProgram) {
      return res.status(404).json({ message: 'Scholarship program not found' });
    }

    // Create an activity log entry for starting the scholarship program
    const activityLog = new ActivityLog({
      userId: updatedProgram.providerId,
      action: 'START',
      type: 'scholarship',
      details: `Scholarship program status updated to ${status}: ${updatedProgram.title}`
    });

    await activityLog.save();

    res.status(200).json(updatedProgram);
  } catch (error) {
    console.error('Error updating scholarship status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateScholarshipDetails = async (req, res) => {
  try {
    const updatedScholarship = await Scholarship.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedScholarship) {
      return res.status(404).json({ message: 'Scholarship not found' });
    }

    // Create an activity log entry for updating the scholarship details
    const activityLog = new ActivityLog({
      userId: updatedScholarship.providerId,
      action: 'UPDATE',
      type: 'scholarship',
      details: `Scholarship program updated: ${updatedScholarship.title}`
    });

    await activityLog.save();

    res.json(updatedScholarship);
  } catch (error) {
    console.error('Error updating scholarship details:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const checkAvailableSlots = async (req, res) => {
  try {
    const scholarshipId = req.params.id;
    const scholarship = await Scholarship.findById(scholarshipId);

    if (!scholarship) {
      return res.status(404).json({ message: 'Scholarship program not found' });
    }

    const totalSlots = scholarship.numberOfScholarships;
    const approvedScholars = scholarship.approvedScholars.length;
    const availableSlots = totalSlots - approvedScholars;

    res.status(200).json({ availableSlots });
  } catch (error) {
    console.error('Error checking available slots:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const markAsComplete = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, username } = req.body; // Extract userId and username from the request body

    const scholarshipProgram = await Scholarship.findById(id);

    if (!scholarshipProgram) {
      return res.status(404).json({ message: 'Scholarship program not found' });
    }

    // Update the scholarship program status to Complete
    scholarshipProgram.status = 'Completed';
    await scholarshipProgram.save();

    // Create a notification for the scholarship program completion
    const notification = {
      recipientId: scholarshipProgram.providerId, // Assuming providerId is the recipient
      senderId: userId, // Use userId from the request body
      type: 'completion',
      message: `The scholarship program "${scholarshipProgram.title}" has been marked as complete.`,
      recipientName: scholarshipProgram.organizationName, // Assuming providerName is available
      senderName: scholarshipProgram.organizationName // Use username from the request body
    };

    // Save the notification to the database
    await Notification.create(notification);

    // Create an activity log entry for marking the scholarship program as complete
    const activityLog = new ActivityLog({
      userId: scholarshipProgram.providerId,
      action: 'COMPLETE',
      type: 'scholarship',
      details: `Scholarship program marked as complete: ${scholarshipProgram.title}`
    });

    await activityLog.save();

    res.status(200).json({ message: 'Scholarship program marked as complete successfully', scholarshipProgram });
  } catch (error) {
    console.error('Error marking scholarship program as complete:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const undoComplete = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the scholarship program by id
    const scholarship = await Scholarship.findById(id);
    if (!scholarship) {
      return res.status(404).json({ message: 'Scholarship program not found' });
    }

    // Update the status to 'Ongoing'
    scholarship.status = 'Ongoing';

    // Save the updated scholarship program
    await scholarship.save();

    // Create an activity log entry for undoing the completion of the scholarship program
    const activityLog = new ActivityLog({
      userId: scholarship.providerId,
      action: 'UNDO_COMPLETE',
      type: 'scholarship',
      details: `Scholarship program completion undone: ${scholarship.title}`
    });

    await activityLog.save();

    // Respond with the updated scholarship program
    res.status(200).json(scholarship);
  } catch (error) {
    console.error('Error undoing the completion of the scholarship program:', error);
    res.status(500).json({ message: 'Failed to undo the completion of the scholarship program', error: error.message });
  }
};

export const rePublish = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the scholarship program by id
    const scholarship = await Scholarship.findById(id);
    if (!scholarship) {
      return res.status(404).json({ message: 'Scholarship program not found' });
    }

    // Update the status to 'Published'
    scholarship.status = 'Published';

    // Save the updated scholarship program
    await scholarship.save();

    // Create an activity log entry for republishing the scholarship program
    const activityLog = new ActivityLog({
      userId: scholarship.providerId,
      action: 'REPUBLISH',
      type: 'scholarship',
      details: `Scholarship program republished: ${scholarship.title}`
    });

    await activityLog.save();

    // Respond with the updated scholarship program
    res.status(200).json(scholarship);
  } catch (error) {
    console.error('Error republishing the scholarship program:', error);
    res.status(500).json({ message: 'Failed to republish the scholarship program', error: error.message });
  }
};