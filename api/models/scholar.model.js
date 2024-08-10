import mongoose from 'mongoose';

const scholarSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  address: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, required: true },
  educationLevel: { type: String, required: true },
  fieldOfStudy: { type: String, required: true },
  gpa: { type: Number, required: true },
  documents: { type: [String], required: true },
  scholarshipProgramId: { type: mongoose.Schema.Types.ObjectId, ref: 'ScholarshipProgram', required: true },
  status: { 
    type: String, 
    enum: ['Applied', 'Approved', 'Rejected'], 
    default: 'Applied' 
  },
});

export default mongoose.model('Scholar', scholarSchema);