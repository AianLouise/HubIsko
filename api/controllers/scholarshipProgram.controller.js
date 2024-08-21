import Scholarship from '../models/scholarshipProgram.model.js';
import ScholarshipApplication from '../models/scholarshipApplication.model.js';
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

    // Map the scholarship programs to include the necessary fields
    const formattedPrograms = scholarshipPrograms.map(program => ({
      _id: program._id,
      title: program.title,
      category: program.category,
      fieldOfStudy: program.fieldOfStudy,
      numberOfScholarships: program.numberOfScholarships,
      numberOfScholarshipsSlotFilled: program.numberOfScholarshipsSlotFilled,
      amount: program.amount,
      applicationDeadline: program.applicationDeadline,
      minGPA: program.minGPA,
      nationality: program.nationality,
      otherEligibility: program.otherEligibility,
      startDate: program.startDate,
      endDate: program.endDate,
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
      category: program.category,
      fieldOfStudy: program.fieldOfStudy,
      numberOfScholarships: program.numberOfScholarships,
      numberOfScholarshipsSlotFilled: program.numberOfScholarshipsSlotFilled,
      amount: program.amount,
      applicationDeadline: program.applicationDeadline,
      minGPA: program.minGPA,
      nationality: program.nationality,
      otherEligibility: program.otherEligibility,
      startDate: program.startDate,
      endDate: program.endDate,
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
      category: scholarshipProgram.category,
      fieldOfStudy: scholarshipProgram.fieldOfStudy,
      numberOfScholarships: scholarshipProgram.numberOfScholarships,
      numberOfScholarshipsSlotFilled: scholarshipProgram.numberOfScholarshipsSlotFilled,
      amount: scholarshipProgram.amount,
      applicationDeadline: scholarshipProgram.applicationDeadline,
      minGPA: scholarshipProgram.minGPA,
      nationality: scholarshipProgram.nationality,
      otherEligibility: scholarshipProgram.otherEligibility,
      startDate: scholarshipProgram.startDate,
      endDate: scholarshipProgram.endDate,
      selectionProcess: scholarshipProgram.selectionProcess,
      selectionCriteria: scholarshipProgram.selectionCriteria,
      renewalPolicy: scholarshipProgram.renewalPolicy,
      renewalDuration: scholarshipProgram.renewalDuration,
      disbursementSchedule: scholarshipProgram.disbursementSchedule,
      disbursementMethod: scholarshipProgram.disbursementMethod,
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

export const getScholarshipApplications = async (req, res) => {
  try {
    const { id } = req.params; // Extract id from URL parameters

    // Query the scholarshipApplication table
    const applications = await ScholarshipApplication.find({ scholarshipProgram: id });

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
  const { applicationStatus } = req.body;

  try {
      const application = await ScholarshipApplication.findByIdAndUpdate(
          id, 
          { applicationStatus },
          { new: true }  // This option returns the updated document
      );

      if (!application) {
          return res.status(404).json({ message: 'Application not found' });
      }

      res.status(200).json(application);
  } catch (error) {
      res.status(500).json({ message: 'Failed to update application status', error });
  }
}

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