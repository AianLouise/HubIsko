// models/scholarshipProgram.model.js
import mongoose from 'mongoose';

const scholarshipSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  deadline: { type: Date, required: true },
  email: { type: String, required: true },
  website: { type: String },
  phone: { type: String },
  address: { type: String },
  eligibility: { type: String },
  applicationProcess: { type: String },
  numScholarships: { type: Number },
  duration: { type: String },
  documents: { type: String },
  category: { type: String, required: true },
  typeOfScholarship: { type: String },
  academicRequirements: { type: String },
  fieldOfStudy: { type: String },
  levelOfEducation: { type: String },
  location: { type: String },
  otherCriteria: { type: String },
  applicationStartDate: { type: Date },
  applicationEndDate: { type: Date },
  notificationDate: { type: Date },
  coverage: { type: String },
  contactPerson: { type: String },
  provider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

export default mongoose.model('Scholarship', scholarshipSchema);
