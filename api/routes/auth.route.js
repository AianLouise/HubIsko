import express from 'express';
import { signup, signin, google, signout } from '../controllers/auth.controller.js';
import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import { errorHandler } from '../utils/error.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/google', google);
router.get('/signout', signout);

// Email verification route
router.get('/verify-email', async (req, res, next) => {
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
});

export default router;
