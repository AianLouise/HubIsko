import mongoose from 'mongoose';

// Sub-schema for Applicant
const applicantSchema = new mongoose.Schema({
    profileComplete: {
        type: Boolean,
        default: false,
    },
    permanentAddress: {
        type: String,
        required: false,
    },
    barangay: {
        type: String,
        required: false,
    },
    municipality: {
        type: String,
        required: false,
    },
    province: {
        type: String,
        required: false,
    },
    motherFirstName: {
        type: String,
        required: false,
    },
    motherMiddleName: {
        type: String,
        required: false,
    },
    motherLastName: {
        type: String,
        required: false,
    },
    motherDOB: {
        type: Date,
        required: false,
    },
    fatherFirstName: {
        type: String,
        required: false,
    },
    fatherMiddleName: {
        type: String,
        required: false,
    },
    fatherLastName: {
        type: String,
        required: false,
    },
    fatherDOB: {
        type: Date,
        required: false,
    },
}, { _id: false });

// Sub-schema for Scholarship Provider
const scholarshipProviderSchema = new mongoose.Schema({
    organizationName: {
        type: String,
        required: true,
    },
    contactPerson: {
        type: String,
        required: true,
    },
    providerAddress: {
        type: String,
        required: true,
    },
    providerPhoneNumber: {
        type: String,
        required: true,
    },
}, { _id: false }); // Disable automatic _id generation for embedded sub-schema

// Base schema (User schema)
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: false,
    },
    lastName: {
        type: String,
        required: false,
    },
    middleName: {
        type: String,
        required: false,
    },
    nameExtension: {
        type: String,
        required: false,
    },
    sex: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    dateOfBirth: {
        type: Date,
        required: false,
    },
    mobileNumber: {
        type: String,
        required: false,
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
    applicantDetails: applicantSchema, // Embedded schema for applicant details
    scholarshipProviderDetails: scholarshipProviderSchema, // Embedded schema for scholarship provider details
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;
