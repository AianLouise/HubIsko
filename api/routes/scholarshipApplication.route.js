import express from "express";
import { createScholarshipApplication, getApplicationDetailsById, getScholarshipApplications, test } from '../controllers/scholarshipApplication.controller.js';

const router = express.Router();

router.get("/test", test);
router.post("/create-application", createScholarshipApplication);
router.get("/get-applications/:id", getScholarshipApplications);
router.get("/get-applications-details/:id", getApplicationDetailsById);

export default router;