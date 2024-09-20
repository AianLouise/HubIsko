import mongoose from 'mongoose';

const validationSchema = new mongoose.Schema({
  validationTitle: { type: String, required: true },
  validationDescription: { type: String, required: true },
  requirements: [
    {
      requirement: { type: String, required: true }
    }
  ],
  dateCreated: { type: Date, default: Date.now },
  datePosted: { type: Date },
  scholarshipProgram: { type: mongoose.Schema.Types.ObjectId, ref: 'ScholarshipProgram', required: true },
  status: { type: String, enum: ['Posted', 'Pending', 'Ongoing', 'Done', 'Deleted'], default: 'Pending' },
  validationMethod: { type: String, enum: ['Face-to-Face', 'Courier-Based'], required: true },
  faceToFaceDetails: {
    sessionDate: { type: String }, // Optional field for Face-to-Face
    location: { type: String } // Optional field for Face-to-Face
  },
  courierDetails: {
    mailingAddress: { type: String }, // Optional field for Courier-Based
    recipientName: { type: String }, // Optional field for Courier-Based
    recipientContact: { type: String }, // Optional field for Courier-Based
    submissionDeadline: { type: Date } // Optional field for Courier-Based
  }
});

const Validation = mongoose.model('Validation', validationSchema);

export default Validation;