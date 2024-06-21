import mongoose from "mongoose";

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
    email: {
        type: String,
        required: true,
        unique: true,
    },
    dateOfBirth: {
        type: Date,
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
        default: "",
    },
    role: {
        type: String,
        enum: ['applicant', 'scholarship_provider', 'admin'],
        default: 'applicant',
    },
}, { timestamps: true });

// Sub-schema for Applicant
const applicantSchema = new mongoose.Schema({
    profileComplete: {
        type: Boolean,
        default: false,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    schoolName: {
        type: String,
        required: true,
    },
    GPA: {
        type: Number,
        required: true,
    },
    documents: [{
        type: String,
        required: true,
    }],
});

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
});

// Define discriminators based on the 'role' field
const User = mongoose.model('User', userSchema);

User.discriminator('applicant', applicantSchema);
User.discriminator('scholarship_provider', scholarshipProviderSchema);

export default User;
