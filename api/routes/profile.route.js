import express from "express";
import { editAddress, editUserInfo, getForumPostsByUserId, getScholarshipProgramsByProviderId, getUserById, requestEmailUpdate, test, updateProfile, verifyEmail } from '../controllers/profile.controller.js';

const router = express.Router();

router.get("/test", test);
router.get('/user/:id', getUserById);
router.get('/:id/scholarship-programs', getScholarshipProgramsByProviderId);
router.get('/forum-posts/:id', getForumPostsByUserId);
router.put('/user/:userId', editUserInfo);
router.patch('/user/:userId/address', editAddress);

// Route to request email update
router.post('/change-email/:userId', requestEmailUpdate);

// Route to verify email
router.get('/verify-email', verifyEmail);

router.post('/update-profile/:userId', updateProfile);

export default router;