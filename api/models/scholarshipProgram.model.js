import mongoose from 'mongoose';

// Schema for Scholarship Program
const scholarshipProgramSchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
  category: { type: String },
  fieldOfStudy: { type: String },
  numberOfScholarships: { type: String },
  numberOfScholarshipsSlotFilled: { type: String, default: '0' },
  amount: { type: String },
  applicationStartDate: { type: String },
  applicationDeadline: { type: String },
  minGPA: { type: String },
  nationality: { type: String },
  otherEligibility: { type: String },
  startDate: { type: String },
  endDate: { type: String },
  selectionProcess: { type: String },
  selectionCriteria: { type: String },
  renewalPolicy: { type: String },
  renewalDuration: { type: String },
  disbursementSchedule: { type: String },
  disbursementMethod: { type: String },
  contactEmail: { type: String },
  contactPhone: { type: String },
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  organizationName: { type: String }, // Added organizationName field
  requiredDocuments: [
    {
      id: { type: String },
      name: { type: String },
      required: { type: Boolean },
      editable: { type: Boolean }
    }
  ], // Array of objects for required documents
  documentGuidelines: { type: String }, // Guidelines for documents
  scholarshipImage: { type: String }, // URL or path to scholarship image
  bannerImage: { type: String }, // URL or path to banner image
  sections: [
    {
      title: { type: String },
      content: { type: String }
    }
  ], // Array of sections with title and content
  faqTitle: { type: String }, // Added FAQ title field
  faqDescription: { type: String }, // Added FAQ description field
  providerRequirements: [
    {
      id: { type: String },
      name: { type: String },
      url: { type: String }
    }
  ], // Array of provider requirements with id and url
  status: {
    type: String,
    enum: [
      'Pending Approval',
      'Approved',
      'Declined',
      'Active',
      'Closed',
      'Archived',
      'Cancelled',
      'Completed'
    ],
    default: 'Pending Approval'
  },
  declineReason: {
    type: String,
    required: function () {
      return this.status === 'Declined';
    },
    default: ''
  },
  approvedScholars: [
    {
      scholarId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      dateApproved: { type: Date, default: Date.now }
    }
  ], // Array of approved scholars with scholarId and dateApproved
  dateCreated: { type: Date, default: Date.now } // Added dateCreated field
});

// Models
const Scholarship = mongoose.model('ScholarshipProgram', scholarshipProgramSchema);

export default Scholarship;