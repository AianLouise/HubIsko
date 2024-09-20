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
  dateDone: { type: Date },
  scholarshipProgram: { type: mongoose.Schema.Types.ObjectId, ref: 'ScholarshipProgram', required: true },
  status: { type: String, enum: ['Posted', 'Pending', 'Upcoming', 'Done', 'Deleted'], default: 'Pending' },
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
  },
  validationResults: [
    {
      scholar: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to the User model
      status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' }, // Status of validation for each scholar
      feedback: { type: String }, // Optional feedback field for rejection or approval
      dateReviewed: { type: Date } // Date the validation was reviewed
    }
  ]
});

const Validation = mongoose.model('Validation', validationSchema);

export default Validation;