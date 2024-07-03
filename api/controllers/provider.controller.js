import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';

export const test = (req, res) => {
  res.json({
    message: 'API is working!',
  });
};

export const signupAsProvider = async (req, res) => {
  try {
    const { name, email, password, organizationName, contactPerson, providerAddress, providerPhoneNumber } = req.body;

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user with the role of "provider" and include scholarship provider details
    const newUser = new User({
      email,
      username: email, // Assuming the username is the email for simplicity
      password: hashedPassword,
      role: 'scholarship_provider',
      scholarshipProviderDetails: {
        organizationName,
        contactPerson,
        providerAddress,
        providerPhoneNumber
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
      contactPerson: savedUser.scholarshipProviderDetails.contactPerson,
      providerAddress: savedUser.scholarshipProviderDetails.providerAddress,
      providerPhoneNumber: savedUser.scholarshipProviderDetails.providerPhoneNumber,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error signing up as provider', error: error.message });
  }
};