const mongoose = require('mongoose');

const ScholarshipSchema = new mongoose.Schema({
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
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  address: {
    type: String,
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
    type: [String], // Array of file paths or URLs
  },
  category: {
    type: String,
    enum: ['academic', 'athletic', 'arts', 'community', 'other'],
    required: true,
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

const Scholarship = mongoose.model('Scholarship', ScholarshipSchema);

module.exports = Scholarship;
