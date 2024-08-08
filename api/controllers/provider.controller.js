import User from '../models/user.model.js';
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

    console.log('Sending verification email to:', email);

    await transporter.sendMail({
      from: '"HubIsko" <yourappemail@example.com>',
      to: email,
      subject: 'Verify Your Email',
      html: `
        <div style="max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; font-family: Arial, sans-serif; background-color: #f9f9f9; border-radius: 10px;">
          <h2 style="color: #0056b3; text-align: center; margin-bottom: 20px;">Welcome to HubIsko!</h2>
          <img src="cid:hubisko-logo" alt="HubIsko Logo" style="display: block; margin: auto; width: 100px; border-radius: 50%; filter: grayscale(50%);"/>
          <p style="font-size: 16px; color: #333; text-align: center;">Hello,</p>
          <p style="font-size: 16px; color: #333; text-align: center;">Thank you for signing up with HubIsko. Please click the button below to verify your email address and get started:</p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="${verificationUrl}" style="background-color: #0056b3; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-size: 16px; display: inline-block;">Verify Email</a>
          </div>
          <p style="font-size: 16px; color: #333; text-align: center;">If the button above does not work, please copy and paste the following link into your browser:</p>
          <p style="font-size: 16px; color: #0056b3; text-align: center;"><a href="${verificationUrl}" style="color: #0056b3;">${verificationUrl}</a></p>
          <p style="font-size: 16px; color: #333; text-align: center;">Best,</p>
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
      additionalDocuments: savedUser.scholarshipProviderDetails.additionalDocuments,
      message: 'User created successfully. Please check your email to verify your account.'
    });
  } catch (error) {
    res.status(500).json({ message: 'Error signing up as provider', error: error.message });
  }
};