import express from "express";
import { addApprovedScholar, getApprovedScholarInfo, createScholarshipProgram, getAllApplicationsForProvider, getAllScholarshipPrograms, getApplicantDetails, getOrganizationName, getRequiredDocuments, getScholarshipApplications, getScholarshipProgramById, getScholarshipProgramsByProviderId, getScholarshipProviders, test, updateApplicationStatus, hasUserApplied, publishScholarshipProgram } from '../controllers/scholarshipProgram.controller.js';

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
router.get("/:programId/required-documents", getRequiredDocuments);
router.get('/:programId/approved-scholar-info', getApprovedScholarInfo);
router.get('/:programId/has-applied/:userId', hasUserApplied);
router.post('/scholarship-programs/:id/publish', publishScholarshipProgram);

export default router;