import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

export const signup = async (req, res, next) => {
  const { fullName, email, dateOfBirth, username, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({
    fullName,
    email,
    dateOfBirth,
    username,
    password: hashedPassword,
    emailVerified: false // Add a flag for email verification
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

    // Email setup (this is a simplified setup, customize as needed)
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
      from: '"HubIsko" <yourappemail@example.com>', // sender address
      to: email, // list of receivers
      subject: 'Verify Your Email', // Subject line
      html: `<p>Please click the link below to verify your email:</p><p><a href="${verificationUrl}">${verificationUrl}</a></p>`, // html body
    });
    console.log('Verification email sent successfully to:', email);

    res.status(201).json({ message: 'User created successfully. Please check your email to verify your account.' });
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

export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: _, ...rest } = user.toObject();
      const expiryDate = new Date(Date.now() + 3600000); // 1 hour
      res
        .cookie('access_token', token, {
          httpOnly: true,
          expires: expiryDate,
        })
        .status(200)
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        fullName: req.body.name, // Assuming fullName is provided in req.body.name
        email: req.body.email,
        dateOfBirth: new Date(), // Assuming dateOfBirth needs to be provided or generated
        username:
          req.body.name.split(' ').join('').toLowerCase() +
          Math.random().toString(36).slice(-8),
        password: hashedPassword,
        profilePicture: req.body.photo,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: _, ...rest } = newUser.toObject();
      const expiryDate = new Date(Date.now() + 3600000); // 1 hour
      res
        .cookie('access_token', token, {
          httpOnly: true,
          expires: expiryDate,
        })
        .status(201)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

export const signout = (req, res) => {
  res.clearCookie('access_token').json('Signout successfully');
};