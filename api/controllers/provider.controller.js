import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';

export const test = (req, res) => {
  res.json({
    message: 'API is working!',
  });
};

export const signupAsProvider = async (req, res) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const {
      username,
      email,
      password,
      contactPersonName,
      organizationName,
      organizationType,
      registrationNumber,
      contactPersonPosition,
      contactPersonNumber,
      streetAddress,
      city,
      state,
      postalCode,
      country,
      website,
      agreeTerms,
      tin,
      proofOfAddress,
      authorizationLetter,
      idProofContactPerson,
      additionalDocuments
    } = req.body;

    // Create new user object with document fields
    const newUser = new User({
      username,
      email,
      password: bcrypt.hashSync(password, 8),
      role: 'scholarship_provider',
      mobileNumber: "0987654321", // Corrected field
      emailVerified: false,
      authProvider: 'email',
      scholarshipProviderDetails: {
        organizationName,
        organizationType,
        registrationNumber,
        email,
        contactPersonName,
        contactPersonPosition,
        contactPersonNumber,
        streetAddress,
        city,
        state,
        postalCode,
        country,
        website,
        agreeTerms,
        tin,
        proofOfAddress,
        authorizationLetter,
        idProofContactPerson,
        additionalDocuments
      }
    });

    // Save the user to the database
    const savedUser = await newUser.save();

    // Respond with the new user's information (excluding sensitive information like the password)
    res.status(201).json({
      id: savedUser._id,
      email: savedUser.email,
      role: savedUser.role,
      organizationName: savedUser.scholarshipProviderDetails.organizationName,
      organizationType: savedUser.scholarshipProviderDetails.organizationType,
      registrationNumber: savedUser.scholarshipProviderDetails.registrationNumber,
      contactPersonName: savedUser.scholarshipProviderDetails.contactPersonName,
      contactPersonPosition: savedUser.scholarshipProviderDetails.contactPersonPosition,
      contactPersonNumber: savedUser.scholarshipProviderDetails.contactPersonNumber,
      streetAddress: savedUser.scholarshipProviderDetails.streetAddress,
      city: savedUser.scholarshipProviderDetails.city,
      state: savedUser.scholarshipProviderDetails.state,
      postalCode: savedUser.scholarshipProviderDetails.postalCode,
      country: savedUser.scholarshipProviderDetails.country,
      website: savedUser.scholarshipProviderDetails.website,
      tin: savedUser.scholarshipProviderDetails.tin,
      proofOfAddress: savedUser.scholarshipProviderDetails.proofOfAddress,
      authorizationLetter: savedUser.scholarshipProviderDetails.authorizationLetter,
      idProofContactPerson: savedUser.scholarshipProviderDetails.idProofContactPerson,
      additionalDocuments: savedUser.scholarshipProviderDetails.additionalDocuments
    });
  } catch (error) {
    res.status(500).json({ message: 'Error signing up as provider', error: error.message });
  }
};