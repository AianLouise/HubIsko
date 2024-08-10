import mongoose from 'mongoose';

// Schema for Scholarship Program
const scholarshipProgramSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  amount: { type: String, required: true },
  slotsFilled: { type: Number, default: 0 },
  totalSlots: { type: Number, required: true },
  duration: { type: String, required: true },
  category: { type: String, required: true },
  type: { type: String, required: true },
  academicRequirements: { type: String, required: true },
  fieldOfStudy: { type: String, required: true },
  levelOfEducation: { type: String, required: true },
  location: { type: String, required: true },
  applicationStartDate: { type: Date, required: true },
  applicationEndDate: { type: Date, required: true },
  notificationDate: { type: Date, required: true },
  coverage: { type: String, required: true },
  contactPerson: { type: String, required: true },
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  scholarshipImage: { type: String },
  scholarshipBanner: { type: String },
  status: { 
    type: String, 
    enum: ['Draft', 'Pending Approval', 'Active', 'Closed', 'Archived', 'Cancelled', 'Completed'], 
    default: 'Draft' 
  },
  approvedScholars: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Scholar' }],
  details: [
    {
      title: { type: String, required: true },
      content: { type: String, required: true }
    }
  ],
  datePosted: { type: Date, default: Date.now } // Added field for date posted
});


// Models
const Scholarship = mongoose.model('ScholarshipProgram', scholarshipProgramSchema);

export { Scholarship };