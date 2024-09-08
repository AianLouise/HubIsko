import mongoose from 'mongoose';

const validationSchema = new mongoose.Schema({
  validationTitle: { type: String, required: true },
  validationDescription: { type: String, required: true },
  requirements: [
    {
      requirement: { type: String, required: true }
    }
  ],
  dateCreated: { type: Date, default: Date.now }, // Set dateCreated to current date
  datePosted: { type: Date },
  scholarshipProgram: { type: mongoose.Schema.Types.ObjectId, ref: 'ScholarshipProgram', required: true }, // Reference to ScholarshipProgram
  status: { type: String, enum: ['Posted', 'Pending', 'Ongoing', 'Done', 'Deleted'], default: 'Pending' } // Add status field with default value 'Pending'
});

const Validation = mongoose.model('Validation', validationSchema);

export default Validation;