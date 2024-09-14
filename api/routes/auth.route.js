import express from 'express';
import { signup, signin, google, signout, verifyEmail, resendVerificationEmail, getUserDetails } from '../controllers/auth.controller.js';
import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import { errorHandler } from '../utils/error.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/google', google);
router.post('/signout', signout);

// Email verification route
router.get('/verify-email', verifyEmail);

// Resend verification email
router.post('/resend-verification-email', resendVerificationEmail);

// Get user details
router.get('/user/:userId', getUserDetails);

export default router;
