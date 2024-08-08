import mongoose from 'mongoose';

const ScholarshipProgramSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  requirements: {
    type: String,
    required: true,
  },
  deadline: {
    type: Date,
    required: true,
  },
  website: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  eligibility: {
    type: String,
    required: true,
  },
  applicationProcess: {
    type: String,
    required: true,
  },
  numScholarships: {
    type: Number,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  documents: {
    type: String,
  },
  category: {
    type: String,
    required: true,
  },
  provider: {
    type: String,
    required: true,
  },
}, { timestamps: { createdAt: 'dateCreated' } });

const Scholarship = mongoose.model('Scholarship', ScholarshipProgramSchema);

export default Scholarship;