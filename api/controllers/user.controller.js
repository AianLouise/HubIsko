import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';
import bcryptjs from 'bcryptjs';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import ActivityLog from '../models/activityLog.model.js'; // Adjust the import path as necessary

export const test = (req, res) => {
  res.json({
    message: 'API is working!',
  });
};

// update user
export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, 'You can update only your account!'));
  }
  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          profilePicture: req.body.profilePicture,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

// delete user
export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, 'You can delete only your account!'));
  }
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json('Account has been deleted!');
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'Email not found' });
    }

    // Check if the user has logged in via OAuth
    if (user.authProvider === 'google') {
      return res.status(400).json({ message: 'Password reset is managed by your Google provider. Please use their password recovery process.' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    await user.save();

    // Use the environment variable for the base URL
    const baseUrl = process.env.BASE_URL || 'http://localhost:5173';
    const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: '"HubIsko" <yourappemail@example.com>',
      to: user.email,
      subject: 'Password Reset Request',
      html: `
        <div style="max-width: 600px; margin: auto; padding: 20px; font-family: Arial, sans-serif; background-color: #f9f9f9; border-radius: 10px; border: 1px solid #ddd;">
          <h2 style="color: #0056b3; text-align: center; margin-bottom: 20px;">Password Reset Request</h2>
          <p style="font-size: 16px; color: #333;">Hello,</p>
          <p style="font-size: 16px; color: #333;">We received a request to reset your password. Click the button below to reset it:</p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="${resetUrl}" style="background-color: #0056b3; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-size: 16px; display: inline-block;">Reset Password</a>
          </div>
          <p style="font-size: 16px; color: #333;">If the button above does not work, copy and paste the following link into your browser:</p>
          <p style="font-size: 16px; color: #0056b3; text-align: center;"><a href="${resetUrl}" style="color: #0056b3;">${resetUrl}</a></p>
          <p style="font-size: 16px; color: #333;">If you did not request a password reset, please ignore this email or contact support if you have questions.</p>
          <p style="font-size: 16px; color: #333;">Thank you,</p>
          <p style="font-size: 16px; color: #333;">The HubIsko Team</p>
        </div>
      `
    });

    res.json({ message: 'Password reset email sent' });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  const { token, password } = req.body;

  try {
    const user = await User.findOne({ resetPasswordToken: token });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    user.password = bcryptjs.hashSync(password, 10);
    user.resetPasswordToken = undefined;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    next(error);
  }
};

export const getUserDetails = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json(user);
  }
  catch (error) {
    next(error);
  }
};

export const CompleteProfile = async (req, res, next) => {
  try {
    const profilePictureUrl = req.body.profilePicture || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToiRnzzyrDtkmRzlAvPPbh77E-Mvsk3brlxQ&s';

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          "status": 'Pending Verification',
          "applicantDetails.profileComplete": 'true',
          "profilePicture": profilePictureUrl,
          "applicantDetails.firstName": req.body.firstName,
          "applicantDetails.middleName": req.body.middleName,
          "applicantDetails.lastName": req.body.lastName,
          "applicantDetails.nameExtension": req.body.nameExtension, // Added nameExtension
          "applicantDetails.birthdate": req.body.birthdate,
          "applicantDetails.gender": req.body.gender,
          "applicantDetails.bloodType": req.body.bloodType,
          "applicantDetails.civilStatus": req.body.civilStatus,
          "applicantDetails.maidenName": req.body.maidenName,
          "applicantDetails.spouseName": req.body.spouseName,
          "applicantDetails.spouseOccupation": req.body.spouseOccupation,
          "applicantDetails.religion": req.body.religion,
          "applicantDetails.height": req.body.height,
          "applicantDetails.weight": req.body.weight,
          "applicantDetails.birthplace": req.body.birthplace,
          "applicantDetails.contactNumber": req.body.contactNumber,
          "applicantDetails.address.regionCode": req.body.regionCode,
          "applicantDetails.address.region": req.body.region,
          "applicantDetails.address.provinceCode": req.body.provinceCode,
          "applicantDetails.address.province": req.body.province,
          "applicantDetails.address.cityCode": req.body.cityCode,
          "applicantDetails.address.city": req.body.city,
          "applicantDetails.address.barangay": req.body.barangay,
          "applicantDetails.address.addressDetails": req.body.addressDetails,
          "applicantDetails.education.elementary.school": req.body.education.elementary.school,
          "applicantDetails.education.elementary.award": req.body.education.elementary.award,
          "applicantDetails.education.elementary.yearGraduated": req.body.education.elementary.yearGraduated,
          "applicantDetails.education.juniorHighSchool.school": req.body.education.juniorHighSchool.school,
          "applicantDetails.education.juniorHighSchool.award": req.body.education.juniorHighSchool.award,
          "applicantDetails.education.juniorHighSchool.yearGraduated": req.body.education.juniorHighSchool.yearGraduated,
          "applicantDetails.education.seniorHighSchool.school": req.body.education.seniorHighSchool.school,
          "applicantDetails.education.seniorHighSchool.award": req.body.education.seniorHighSchool.award,
          "applicantDetails.education.seniorHighSchool.yearGraduated": req.body.education.seniorHighSchool.yearGraduated,
          "applicantDetails.education.college.school": req.body.education.college.school,
          "applicantDetails.education.college.course": req.body.education.college.course,
          "applicantDetails.education.college.yearGraduated": req.body.education.college.yearGraduated,
          "applicantDetails.studentIdFile": req.body.studentIdFile,
          "applicantDetails.certificateOfRegistrationFile": req.body.certificateOfRegistrationFile
        }
      },
      { new: true } // Return the modified document rather than the original.
    );

    if (!updatedUser) {
      return res.status(404).send({ message: "User not found." });
    }

    // Create an activity log entry for completing the profile
    const activityLog = new ActivityLog({
      userId: req.user.id,
      action: 'COMPLETE_PROFILE',
      type: 'account',
      details: `User ${req.user.id} completed their profile`
    });

    await activityLog.save();
    console.log('Activity log saved:', activityLog);

    res.status(200).send(updatedUser);
  } catch (error) {
    console.error("Error updating user profile:", error);
    next(error); // Pass the error to the next middleware
  }
};

export const changePassword = async (req, res, next) => {
  const { id } = req.params;
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      return next(errorHandler(404, 'User not found'));
    }

    const isMatch = await bcryptjs.compare(oldPassword, user.password);
    if (!isMatch) {
      return next(errorHandler(400, 'Current password is incorrect'));
    }

    const salt = await bcryptjs.genSalt(10);
    user.password = await bcryptjs.hash(newPassword, salt);
    await user.save();

    // Create an activity log entry for changing the password
    const activityLog = new ActivityLog({
      userId: id,
      action: 'CHANGE_PASSWORD',
      type: 'account',
      details: `Password changed for user ${user.email}`
    });

    await activityLog.save();
    console.log('Activity log saved:', activityLog);

    res.status(200).send('Password successfully changed');
  } catch (error) {
    next(errorHandler(500, 'Server error'));
  }
};

export const checkEmail = async (req, res, next) => {
  const { email } = req.body;
  try {
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(200).json({ exists: true });
    } else {
      return res.status(200).json({ exists: false });
    }
  } catch (error) {
    console.error('Error checking email:', error);
    next(errorHandler(500, 'Server error'));
  }
};
