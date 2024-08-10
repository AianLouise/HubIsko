import express from "express";
import { createScholarshipProgram, getAllScholarshipPrograms, getOrganizationName, getScholarshipProgramById, getScholarshipProgramsByProviderId, getScholarshipProviders, test } from '../controllers/scholarshipProgram.controller.js';

const router = express.Router();

router.get("/test", test);
router.post("/create-scholarship", createScholarshipProgram);
router.get("/provider/:id", getScholarshipProgramsByProviderId);
router.get('/scholarshipPrograms', getAllScholarshipPrograms); // Add the new route
router.get('/getScholarshipProvider', getScholarshipProviders); // Add the new route
router.get('/scholarship-programs/:id', getScholarshipProgramById); // Add the new route
router.get('/organization/:providerId', getOrganizationName); 

export default router;