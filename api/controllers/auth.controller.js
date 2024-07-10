import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

export const signup = async (req, res, next) => {
  const { firstName, lastName, email, dateOfBirth, username, password, role } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);

  // Create a new user instance with profileComplete set to false
const newUser = new User({
  firstName,
  lastName,
  middleName: "",
  nameExtension: "",
  sex: "",
  email,
  dateOfBirth,
  mobileNumber: "",
  username,
  password: hashedPassword,
  role: role || 'applicant',
  emailVerified: false,
applicantDetails: {
  profileComplete: false,
  permanentAddress: "",
  barangay: "",
  municipality: "",
  province: "",
  motherFirstName: "",
  motherMiddleName: "",
  motherLastName: "",
  motherDOB: "",
  fatherFirstName: "",
  fatherMiddleName: "",
  fatherLastName: "",
  fatherDOB: "",
  documents: [],
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

    // const verificationUrl = ` https://hubisko.onrender.com/verify-email?token=${emailVerificationToken}`;

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
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      const { password, ...rest } = user.toObject();
      return res
        .cookie('access_token', token, {
          httpOnly: true,
          expires: new Date(Date.now() + 3600000), // 1 hour
        })
        .status(200)
        .json(rest);
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
      const username = `${firstName}${lastName}`.toLowerCase().replace(/\s+/g, '') + Math.random().toString(36).slice(-8);

      // Create a new user
      const newUser = new User({
        firstName,
        lastName,
        middleName: "",
        nameExtension: "",
        sex: "",
        email,
        dateOfBirth: '',
        mobileNumber: "",
        username,
        password: bcryptjs.hashSync(Math.random().toString(36).slice(-8), 10), // Random password
        profilePicture: photo,
        emailVerified: true,
        applicantDetails: {
          profileComplete: false,
          permanentAddress: "",
          barangay: "",
          municipality: "",
          province: "",
          motherFirstName: "",
          motherMiddleName: "",
          motherLastName: "",
          motherDOB: "",
          fatherFirstName: "",
          fatherMiddleName: "",
          fatherLastName: "",
          fatherDOB: "",
          documents: [],
        },
      });

      await newUser.save();

      // Generate a token and send the response
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      const { password, ...rest } = newUser.toObject();
      res
        .cookie('access_token', token, {
          httpOnly: true,
          expires: new Date(Date.now() + 3600000), // 1 hour
        })
        .status(201)
        .json(rest);
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
    const expiryDate = new Date(Date.now() + 3600000); // 1 hour
    res
      .cookie('access_token', token, { httpOnly: true, expires: expiryDate })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const signout = (req, res) => {
  res.clearCookie('access_token').json('Signout successfully');
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

      // const verificationUrl = `https://hubisko.onrender.com/verify-email?token=${emailVerificationToken}`;

      const verificationUrl = `http://localhost:5173/verify-email?token=${emailVerificationToken}`;

      console.log('Resending verification email to:', email);
      
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

      console.log('Verification email resent successfully to:', email);

      return res.status(200).json({ message: "Verification email resent successfully" });
    }
  } catch (error) {
    next(error);
  }
};