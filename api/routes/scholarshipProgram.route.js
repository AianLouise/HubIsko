import express from "express";
import { addApprovedScholar, getApprovedScholarInfo, createScholarshipProgram, getAllApplicationsForProvider, getAllScholarshipPrograms, getApplicantDetails, getOrganizationName, getRequiredDocuments, getScholarshipApplications, getScholarshipProgramById, getScholarshipProgramsByProviderId, getScholarshipProviders, test, updateApplicationStatus, hasUserApplied, publishScholarshipProgram, updateScholarshipStatus, updateScholarshipDetails, checkAvailableSlots, markAsComplete, extendDeadline, pauseScholarshipProgram, resumeScholarshipProgram, undoComplete, rePublish } from '../controllers/scholarshipProgram.controller.js';

const router = express.Router();

router.get("/test", test);
router.post("/create-scholarship", createScholarshipProgram);
router.get("/provider/:id", getScholarshipProgramsByProviderId);
router.get('/scholarshipPrograms', getAllScholarshipPrograms);
router.get('/getScholarshipProvider', getScholarshipProviders);
router.get('/scholarship-programs/:id', getScholarshipProgramById);
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
router.put('/scholarship-programs/:id/extend-deadline', extendDeadline);
router.put('/scholarship-programs/:id/pause', pauseScholarshipProgram);
router.put('/scholarship-programs/:id/resume', resumeScholarshipProgram);
router.patch('/scholarship-programs/:id/complete', markAsComplete);
router.patch('/scholarship-programs/:id/undo-complete', undoComplete);
router.patch('/scholarship-programs/:id/republish', rePublish);
router.put('/update-status/:id', updateScholarshipStatus);

router.put('/scholarship-programs/:id', updateScholarshipDetails);

router.get('/scholarships/:id/available-slots', checkAvailableSlots);

export default router;