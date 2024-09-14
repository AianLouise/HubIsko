import mongoose from 'mongoose';
import User from '../models/user.model.js';
import ScholarshipApplication from '../models/scholarshipApplication.model.js';
import ScholarshipProgram from '../models/scholarshipProgram.model.js';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
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
      addressDetails,
      region,
      province,
      city,
      barangay,
      website,
      agreeTerms,
      profilePicture,
      documents, // This should contain the document URLs
    } = req.body;

    // Create new user object with document fields
    const newUser = new User({
      username,
      email,
      password: bcrypt.hashSync(password, 8),
      role: 'scholarship_provider',
      emailVerified: false,
      authProvider: 'email',
      profilePicture,
      status: 'Pending Verification',
      scholarshipProviderDetails: {
        organizationName,
        organizationType,
        registrationNumber,
        email,
        contactPersonName,
        contactPersonPosition,
        contactPersonNumber,
        addressDetails,
        region,
        province,
        city,
        barangay,
        website,
        agreeTerms,
        documents: {
          registrationCertificate: documents.registrationCertificate,
          tin: documents.tin,
          proofOfAddress: documents.proofOfAddress,
          authorizationLetter: documents.authorizationLetter,
          idProofContactPerson: documents.idProofContactPerson,
        },
       
      }
    });

    // Save the user to the database
    const savedUser = await newUser.save();

    // Generate a verification token
    const emailVerificationToken = jwt.sign(
      { userId: savedUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' } // Token expires in 1 day
    );

    // Save or update the verification token in the database
    savedUser.emailVerificationToken = emailVerificationToken;
    await savedUser.save();

    // Email setup (simplified setup, customize as needed)
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Use your preferred email service
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const verificationUrl = `http://localhost:5173/verify-email?token=${emailVerificationToken}`;

    // const verificationUrl = `http://hubisko.onrender.com/verify-email?token=${emailVerificationToken}`;

    console.log('Sending verification email to:', email);

    await transporter.sendMail({
      from: '"HubIsko" <yourappemail@example.com>',
      to: email,
      subject: 'Verify Your Email',
      html: `
        <div style="max-width: 600px; margin: auto; border: 1px solid #e0e0e0; padding: 30px; font-family: Arial, sans-serif; background-color: #ffffff; border-radius: 10px;">
              <h2 style="color: #0047ab; text-align: center; margin-bottom: 25px; font-size: 24px;">Welcome to HubIsko!</h2>
              <img src="https://firebasestorage.googleapis.com/v0/b/hubisko-21f8a.appspot.com/o/System%2FNewLogo.png?alt=media&token=9bcfb221-c954-44ef-9d4f-130f1d880a8e" alt="HubIsko Logo" style="display: block; margin: auto; width: 120px; border-radius: 50%;"/>
              <p style="font-size: 18px; color: #333; text-align: center; margin-top: 25px;">Hello,</p>
              <p style="font-size: 16px; color: #555; text-align: center; line-height: 1.5;">Thank you for signing up with HubIsko. Please click the button below to verify your email address and get started:</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationUrl}" style="background-color: #0047ab; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 5px; font-size: 18px; display: inline-block;">Verify Email</a>
              </div>
              <p style="font-size: 16px; color: #555; text-align: center; line-height: 1.5;">If the button above does not work, please copy and paste the following link into your browser:</p>
              <p style="font-size: 16px; color: #0047ab; text-align: center;"><a href="${verificationUrl}" style="color: #0047ab; text-decoration: underline;">${verificationUrl}</a></p>
              <p style="font-size: 16px; color: #333; text-align: center; margin-top: 30px;">Best regards,</p>
              <p style="font-size: 16px; color: #333; text-align: center;">The HubIsko Team</p>
            </div>
      `
    });

    console.log('Verification email sent successfully to:', email);

    // Respond with the new user's information (excluding sensitive information like the password)
    res.status(201).json({
      id: savedUser._id,
      email: savedUser.email,
      role: savedUser.role,
      profilePicture: savedUser.profilePicture,
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
      registrationCertificate: savedUser.scholarshipProviderDetails.documents.registrationCertificate,
      tin: savedUser.scholarshipProviderDetails.documents.tin,
      proofOfAddress: savedUser.scholarshipProviderDetails.documents.proofOfAddress,
      authorizationLetter: savedUser.scholarshipProviderDetails.documents.authorizationLetter,
      idProofContactPerson: savedUser.scholarshipProviderDetails.documents.idProofContactPerson,
      message: 'User created successfully. Please check your email to verify your account.'
    });
  } catch (error) {
    res.status(500).json({ message: 'Error signing up as provider', error: error.message });
  }
};

export const countScholarshipApplications = async (req, res) => {
  const { userId } = req.params; // Extract userId from request parameters
  try {
    // Correctly instantiate ObjectId with the new keyword
    const providerId = new mongoose.Types.ObjectId(userId);

    // Find all scholarship programs associated with the provider
    const scholarshipPrograms = await ScholarshipProgram.find({ providerId });
    
    // Extract the IDs of these scholarship programs
    const scholarshipProgramIds = scholarshipPrograms.map(program => program._id);

    // Count the applications for these scholarship programs
    const count = await ScholarshipApplication.countDocuments({ scholarshipProgram: { $in: scholarshipProgramIds } });

    // Return both the scholarship programs and the count of applications
    res.json({ scholarshipPrograms, count });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving scholarship programs and counting applications', error: error.message });
  }
};

export const getScholarshipProgramTitle = async (req, res) => {
  let { id } = req.params; // Extract id from request parameters
  id = id.trim(); // Trim any leading or trailing whitespace

  try {
    // Find the specific scholarship program by id
    const scholarshipProgram = await ScholarshipProgram.findById(id);

    if (!scholarshipProgram) {
      return res.status(404).json({ message: 'Scholarship program not found' });
    }

    // Return the scholarship program title
    res.json({ scholarshipProgramTitle: scholarshipProgram.title });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving scholarship program', error: error.message });
  }
};

export const getScholarshipProgramsByProvider = async (req, res) => {
  let { userId } = req.params; // Extract userId from request parameters
  userId = userId.trim(); // Trim any leading or trailing whitespace

  try {
    // Find all scholarship programs provided by the specific user
    const scholarshipPrograms = await ScholarshipProgram.find({ providerId: userId });

    if (!scholarshipPrograms || scholarshipPrograms.length === 0) {
      return res.status(404).json({ message: 'No scholarship programs found for this provider' });
    }

    // Initialize an array to hold the details of the applications
    let applicationDetails = [];

    // Iterate over each scholarship program and find the applications
    for (const program of scholarshipPrograms) {
      const applications = await ScholarshipApplication.find({ scholarshipProgram: program._id });

      // Add the application details to the array
      for (const application of applications) {
        // Find the user using the applicant field
        const user = await User.findById(application.applicant);

        applicationDetails.push({
          firstName: application.firstName,
          lastName: application.lastName,
          applicationDate: application.applicationDate,
          status: application.status,
          profilePicture: user.profilePicture, // Add profilePicture from the User table
          scholarshipProgram: application.scholarshipProgram, // Add scholarshipProgram title
          // Add other relevant fields from the application as needed
        });
      }
    }

    // Return the application details
    res.json({ applicationDetails });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving scholarship applications', error: error.message });
  }
};