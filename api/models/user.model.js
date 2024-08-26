import mongoose from 'mongoose';

// Sub-schema for Applicant
const applicantSchema = new mongoose.Schema({
  profileComplete: {
    type: Boolean,
    default: false,
  },
  firstName: {
    type: String,
    required: false,
  },
  middleName: {
    type: String,
    required: false,
  },
  lastName: {
    type: String,
    required: false,
  },
  nameExtension: {
    type: String,
    required: false,
  },
  birthdate: {
    type: Date,
    required: false,
  },
  gender: {
    type: String,
    required: false,
  },
  bloodType: {
    type: String,
    required: false,
  },
  civilStatus: {
    type: String,
    required: false,
  },
  maidenName: {
    type: String,
    required: false,
  },
  spouseName: {
    type: String,
    required: false,
  },
  spouseOccupation: {
    type: String,
    required: false,
  },
  religion: {
    type: String,
    required: false,
  },
  height: {
    type: Number,
    required: false,
  },
  weight: {
    type: Number,
    required: false,
  },
  birthplace: {
    type: String,
    required: false,
  },
  contactNumber: {
    type: String,
    required: false,
  },
  address: {
    region: {
      type: String,
      required: false,
    },
    province: {
      type: String,
      required: false,
    },
    city: {
      type: String,
      required: false,
    },
    barangay: {
      type: String,
      required: false,
    },
    addressDetails: {
      type: String,
      required: false,
    },
  },
}, { _id: false });

// Sub-schema for Scholarship Provider
const scholarshipProviderSchema = new mongoose.Schema({
  organizationName: {
    type: String,
    required: true,
  },
  organizationType: {
    type: String,
    required: true,
  },
  registrationNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  contactPersonName: {
    type: String,
    required: true,
  },
  contactPersonPosition: {
    type: String,
    required: true,
  },
  contactPersonNumber: {
    type: String,
    required: true,
  },
  addressDetails: {
    type: String,
    required: true,
  },
  region: {
    type: String,
    required: true,
  },
  province: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  barangay: {
    type: String,
    required: true,
  },
  website: {
    type: String,
    required: true,
  },
  agreeTerms: {
    type: Boolean,
    required: true,
  },
  registrationCertificate: {
    type: String,
    default: '',
  },
  tin: {
    type: String,
    default: '',
  },
  proofOfAddress: {
    type: String,
    default: '',
  },
  authorizationLetter: {
    type: String,
    default: '',
  },
  idProofContactPerson: {
    type: String,
    default: '',
  }
}, { _id: false }); // Disable automatic _id generation for embedded sub-schema

// Base schema (User schema)
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
    default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToiRnzzyrDtkmRzlAvPPbh77E-Mvsk3brlxQ&s",
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  emailVerificationToken: {
    type: String,
    required: false,
  },
  resetPasswordToken: {
    type: String,
    required: false,
  },
  authProvider: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    enum: ['applicant', 'scholarship_provider', 'admin'],
    default: 'applicant',
  },
  status: {
    type: String,
    enum: ['Pending Verification', 'Verified', 'Rejected'],
    default: 'Pending Verification',
},
  applicantDetails: applicantSchema, // Embedded schema for applicant details
  scholarshipProviderDetails: scholarshipProviderSchema, // Embedded schema for scholarship provider details
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;
