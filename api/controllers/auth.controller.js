import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

import ActivityLog from '../models/activityLog.model.js'; // Adjust the path as necessary

export const signup = async (req, res, next) => {
  const { firstName, lastName, email, username, password, role, address } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({
    email,
    username,
    password: hashedPassword,
    authProvider: 'email',
    role: role || 'applicant',
    emailVerified: false,
    applicantDetails: {
      profileComplete: false,
      firstName,
      lastName,
      middleName: "",
      nameExtension: "",
      birthdate: "",
      gender: "",
      bloodType: "",
      civilStatus: "",
      maidenName: "",
      spouseName: "",
      spouseOccupation: "",
      religion: "",
      height: 0,
      weight: 0,
      birthplace: "",
      contactNumber: "",
      address: {
        region: '',
        regionCode: '',
        province: '',
        provinceCode: '',
        city: '',
        cityCode: '',
        barangay: '',
        barangayCode: '',
        addressDetails: '',
      }
    },
  });

  try {
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

    // Use the environment variable for the base URL
    const baseUrl = process.env.BASE_URL || 'http://localhost:5173';
    const verificationUrl = `${baseUrl}/verify-email?token=${emailVerificationToken}`;

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

    // Create an activity log entry
    const activityLog = new ActivityLog({
      userId: savedUser._id,
      action: 'CREATE',
      type: 'account', // Added type field with value 'account'
      details: 'User signed up and verification email sent.'
    });

    await activityLog.save();

    res.status(201).json({ success: true, message: 'User created successfully. Please check your email to verify your account.' });
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  try {
    const { email, name, photo } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    if (user) {
      // Existing user logic
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '5h' });
      const { password, ...rest } = user.toObject();
      const expiryDate = new Date(Date.now() + 5 * 60 * 60 * 1000); // 5 hours

      // Create an activity log entry for existing user login
      const activityLog = new ActivityLog({
        userId: user._id,
        action: 'LOGIN',
        type: 'account', // Added type field with value 'account'
        details: 'User logged in using Google.'
      });

      await activityLog.save();

      return res
        .cookie('access_token', token, {
          httpOnly: true,
          expires: expiryDate,
        })
        .cookie('tokenExpiry', expiryDate.toISOString(), {
          httpOnly: false,
          expires: expiryDate,
        })
        .status(200)
        .json({ ...rest, tokenExpiry: expiryDate });
    } else {
      // Split the name and handle the case where only a first name is provided
      const names = name.split(' ').filter(Boolean); // Filter out any empty strings
      let firstName, lastName;

      if (names.length > 1) {
        lastName = names.pop(); // Get the last element as the last name
        firstName = names.join(' '); // Join the remaining elements as the first name
      } else {
        firstName = names[0]; // Use the single provided name as the first name
        lastName = ''; // No last name provided
      }

      // Generate a unique username
      const username = `${firstName}${lastName}`.toLowerCase().replace(/\s+/g, '') + Math.floor(Math.random() * 90 + 10);

      // Create a new user
      const newUser = new User({
        email,
        dateOfBirth: '',
        username,
        password: bcryptjs.hashSync(Math.random().toString(36).slice(-8), 10), // Random password
        authProvider: 'google',
        role: 'applicant',
        emailVerified: true,
        applicantDetails: {
          profileComplete: false,
          firstName,
          lastName,
          middleName: "",
          nameExtension: "",
          birthdate: '',
          gender: "",
          bloodType: "",
          civilStatus: "",
          maidenName: "",
          spouseName: "",
          spouseOccupation: "",
          religion: "",
          height: 0,
          weight: 0,
          birthplace: "",
          contactNumber: "",
          address: {
            region: '',
            regionCode: '',
            province: '',
            provinceCode: '',
            city: '',
            cityCode: '',
            barangay: '',
            barangayCode: '',
            addressDetails: '',
          }
        },
        profilePicture: photo,
      });

      await newUser.save();

      // Create an activity log entry for new user signup
      const activityLog = new ActivityLog({
        userId: newUser._id,
        action: 'CREATE',
        type: 'account', // Added type field with value 'account'
        details: 'User signed up using Google.'
      });

      await activityLog.save();

      // Generate a token and send the response
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '5h' });
      const { password, ...rest } = newUser.toObject();
      const expiryDate = new Date(Date.now() + 5 * 60 * 60 * 1000); // 5 hours
      res
        .cookie('access_token', token, {
          httpOnly: true,
          expires: expiryDate,
        })
        .cookie('tokenExpiry', expiryDate.toISOString(), {
          httpOnly: false,
          expires: expiryDate,
        })
        .status(201)
        .json({ ...rest, tokenExpiry: expiryDate });
    }
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, 'User not found'));
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, 'wrong credentials'));
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: hashedPassword, ...rest } = validUser._doc;
    const expiryDate = new Date(Date.now() + 5 * 60 * 60 * 1000); // 5 hours
    console.log('Token Expiry Date:', expiryDate); // Log the expiry date

    // Create an activity log entry for user sign in
    const activityLog = new ActivityLog({
      userId: validUser._id,
      action: 'LOGIN',
      type: 'account', // Added type field with value 'account'
      details: 'User signed in.'
    });

    await activityLog.save();

    res
      .cookie('access_token', token, { httpOnly: true, expires: expiryDate })
      .cookie('tokenExpiry', expiryDate.toISOString(), { httpOnly: false, expires: expiryDate }) // Set expiryDate as a separate cookie
      .status(200)
      .json({ ...rest, tokenExpiry: expiryDate });
  } catch (error) {
    next(error);
  }
};

export const signout = async (req, res) => {
  const { userId } = req.body; // Extract userId from the request body

  try {
    // Create a new log entry
    await ActivityLog.create({
      userId: userId, // Use the userId from the request body
      action: 'signout',
      type: 'account',
      details: 'User signed out successfully'
    });

    res
      .clearCookie('access_token')
      .clearCookie('tokenExpiry')
      .json('Signout successfully');
  } catch (error) {
    res.status(500).json({ error: 'Failed to log signout activity' });
  }
};

export const verifyEmail = async (req, res, next) => {
  const { token } = req.query;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return next(errorHandler(400, 'Invalid token'));
    }

    if (user.emailVerified) {
      return res.status(400).send('Email already verified');
    }

    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    await user.save();

    // Create an activity log entry for email verification
    const activityLog = new ActivityLog({
      userId: user._id,
      action: 'UPDATE',
      type: 'account', // Added type field with value 'account'
      details: 'User email verified.'
    });

    await activityLog.save();

    res.status(200).send('Email verified successfully');
  } catch (error) {
    next(error);
  }
};

export const resendVerificationEmail = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.emailVerified) {
      console.log("User already verified");
      return res.status(200).json({ message: "Your email is already verified. Please log in." });
    } else {
      // Generate a new verification token
      const emailVerificationToken = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '1d' } // Token expires in 1 day
      );

      // Save or update the verification token in the database
      user.emailVerificationToken = emailVerificationToken;
      await user.save();

      // Email setup (reuse from signup)
      const transporter = nodemailer.createTransport({
        service: 'gmail', // Use your preferred email service
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
      
      // Use the environment variable for the base URL
      const baseUrl = process.env.BASE_URL || 'http://localhost:5173';
      const verificationUrl = `${baseUrl}/verify-email?token=${emailVerificationToken}`;

      console.log('Resending verification email to:', email);

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

      console.log('Verification email resent successfully to:', email);

      // Create an activity log entry for resending verification email
      const activityLog = new ActivityLog({
        userId: user._id,
        action: 'UPDATE',
        type: 'account', // Added type field with value 'account'
        details: 'Verification email resent.'
      });

      await activityLog.save();

      return res.status(200).json({ message: "Verification email resent successfully" });
    }
  } catch (error) {
    next(error);
  }
};

export const getUserDetails = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Fetch user details from the database
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};