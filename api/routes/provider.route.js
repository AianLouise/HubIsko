import express from "express";
import { countScholarshipApplications, signupAsProvider, test, getScholarshipProgramTitle, getScholarshipProgramsByProvider, updateUserInfo, requestEmailUpdate, verifyEmailUpdate } from '../controllers/provider.controller.js';

const router = express.Router();

router.get("/test", test);
router.post("/signupAsProvider", signupAsProvider);
router.get('/countScholarshipApplications/:userId', countScholarshipApplications);
router.get('/scholarshipProgramTitle/:id', getScholarshipProgramTitle);
router.get('/:userId/scholarship-programs', getScholarshipProgramsByProvider);
router.put('/users/:id', updateUserInfo);
router.post('/users/:id/request-email-update', requestEmailUpdate);
router.get('/verify-email-update', verifyEmailUpdate);

export default router;