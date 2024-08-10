import mongoose from 'mongoose';

const scholarshipSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  applicationInstructions: { type: String, required: true },
  numberOfScholarships: { type: Number, required: true },
  duration: { type: String, required: true },
  documents: { type: [String], required: true },
  category: { type: String, required: true },
  type: { type: String, required: true },
  academicRequirements: { type: String, required: true },
  fieldOfStudy: { type: String, required: true },
  levelOfEducation: { type: String, required: true },
  location: { type: String, required: true },
  otherCriteria: { type: String },
  applicationStartDate: { type: Date, required: true },
  applicationEndDate: { type: Date, required: true },
  notificationDate: { type: Date, required: true },
  coverage: { type: String, required: true },
  contactPerson: { type: String, required: true },
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  banner: { type: String },
  purpose: { type: String },
  benefits: { type: [String] },
  qualifications: { type: [String] },
  eligibility: { type: String },
  additionalInformation: { type: String },
  highlight: { type: String },
  targetAudience: { type: String },
  url: { type: String }
});

export default mongoose.model('Scholarship', scholarshipSchema);
