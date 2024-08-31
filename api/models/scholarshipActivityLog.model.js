import mongoose from 'mongoose';

const scholarshipActivityLogSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // The user performing the action (also the applicant)
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true },
  scholarshipProgramId: { type: mongoose.Schema.Types.ObjectId, ref: 'ScholarshipProgram', required: true },
  action: { type: String, required: true },
  details: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const ScholarshipActivityLog = mongoose.model('ScholarshipActivityLog', scholarshipActivityLogSchema);

export default ScholarshipActivityLog;

// Sample Actions and Details

// New Application
// Action: new_application
// Details: Submitted a new application

// Update Scholarship
// Action: update_scholarship
// Details: Updated scholarship details

// New Scholarship
// Action: new_scholarship
// Details: Created a new scholarship program

// Application Approved
// Action: application_approved
// Details: Approved an application

// Application Rejected
// Action: application_rejected
// Details: Rejected an application