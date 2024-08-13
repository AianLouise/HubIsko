import express from "express";
import { createScholarshipApplication, getScholarshipApplications, test } from '../controllers/scholarshipApplication.controller.js';

const router = express.Router();

router.get("/test", test);
router.post("/create-application", createScholarshipApplication);
router.get("/get-applications/:id", getScholarshipApplications);

export default router;