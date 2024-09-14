import express from "express";
import { countScholarshipApplications, signupAsProvider, test, getScholarshipProgramTitle, getScholarshipProgramsByProvider } from '../controllers/provider.controller.js';

const router = express.Router();

router.get("/test", test);
router.post("/signupAsProvider", signupAsProvider);
router.get('/countScholarshipApplications/:userId', countScholarshipApplications);
router.get('/scholarshipProgramTitle/:id', getScholarshipProgramTitle); // New route
router.get('/:userId/scholarship-programs', getScholarshipProgramsByProvider);

export default router;