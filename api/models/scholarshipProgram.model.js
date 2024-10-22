import { da } from 'date-fns/locale';
import mongoose from 'mongoose';

// Schema for Scholarship Program
const scholarshipProgramSchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
  numberOfScholarships: { type: Number },
  amount: { type: String },
  educationLevel: { type: String },
  location: { type: String },
  fieldOfStudy: { type: [String] },
  applicationStartDate: { type: Date, default: Date.now },
  applicationDeadline: { type: Date },
  duration: { type: String },
  selectionProcess: { type: String },
  selectionCriteria: { type: String },
  renewalPolicy: { type: String },
  renewalDuration: { type: String },
  disbursementSchedule: { type: String },
  disbursementMethod: { type: String },
  bankName: { type: String },
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
  // providerRequirements: [
  //   {
  //     id: { type: String },
  //     name: { type: String },
  //     url: { type: String }
  //   }
  // ], // Array of provider requirements with id and url
   status: {
      type: String,
      enum: [
        'Pending Approval',
        'Approved',
        'Published',
        'Ongoing',
        'Rejected',
        'Archived',
        'Cancelled',
        'Completed',
        'Awaiting Publication',
        'Paused'
      ],
      default: 'Awaiting Publication'
    },
  rejectReason: {
      type: String,
      required: function () {
        return this.status === 'Rejected';
      },
      default: ''
    },
  approvedScholars: [
    {
      scholarId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      dateApproved: { type: Date, default: Date.now }
    }
  ], // Array of approved scholars with scholarId and dateApproved
  datePosted: { type: Date, default: Date.now }, // Added datePosted field
  dateUpdated: { type: Date, default: Date.now }, // Added date
  dateCreated: { type: Date, default: Date.now } // Added dateCreated field
});

// Models
const Scholarship = mongoose.model('ScholarshipProgram', scholarshipProgramSchema);

export default Scholarship;