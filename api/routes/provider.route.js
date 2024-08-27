import express from "express";
import { countScholarshipApplications, signupAsProvider, test } from '../controllers/provider.controller.js';

const router = express.Router();

router.get("/test", test);
router.post("/signupAsProvider", signupAsProvider);
router.get('/countScholarshipApplications/:userId', countScholarshipApplications);

export default router;