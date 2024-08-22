import express from "express";
import { addApprovedScholar, createScholarshipProgram, getAllApplicationsForProvider, getAllScholarshipPrograms, getApplicantDetails, getOrganizationName, getScholarshipApplications, getScholarshipProgramById, getScholarshipProgramsByProviderId, getScholarshipProviders, test, updateApplicationStatus } from '../controllers/scholarshipProgram.controller.js';

const router = express.Router();

router.get("/test", test);
router.post("/create-scholarship", createScholarshipProgram);
router.get("/provider/:id", getScholarshipProgramsByProviderId);
router.get('/scholarshipPrograms', getAllScholarshipPrograms); // Add the new route
router.get('/getScholarshipProvider', getScholarshipProviders); // Add the new route
router.get('/scholarship-programs/:id', getScholarshipProgramById); // Add the new route
router.get('/organization/:providerId', getOrganizationName); 
router.get('/scholarship-applications/:id', getScholarshipApplications); 
router.get('/applicant-details/:id', getApplicantDetails);
router.patch('/applications/:id/status', updateApplicationStatus);
router.patch('/scholarship-programs/:programId/approve-scholar/:userId', addApprovedScholar);
router.get('/provider/:providerId/applications', getAllApplicationsForProvider);

export default router;