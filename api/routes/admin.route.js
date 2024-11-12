import express from "express";
import { countApprovedScholars, createAccount, getAllApplicants, getAllProviders, getAllScholarshipPrograms, getAllUsers, getApplicantById, getPendingScholarshipPrograms, getPendingScholarshipProviders, getScholarshipProgramDetailsById, getScholarshipProviderById, getTotalApplicants, getTotalScholarshipProviders, getTotalScholarships, getTotalUnverifiedAccounts, getTotalUserAccounts, getUserForumPosts, getUserScholarshipPrograms, rejectScholarshipProgram, test, updateProviderDetails, updateStudentDetails, verifyScholarshipProgram, verifyScholarshipProviderStatus } from '../controllers/admin.controller.js';

const router = express.Router();

router.get("/test", test);
router.get("/total-accounts", getTotalUserAccounts);
router.get('/total-scholarships', getTotalScholarships);
router.get('/total-unverified-accounts', getTotalUnverifiedAccounts);
router.get('/total-scholarship-providers', getTotalScholarshipProviders);
router.get('/total-applicants', getTotalApplicants);
router.get('/all-applicants', getAllApplicants);
router.get('/all-providers', getAllProviders);
router.get('/applicant/:id', getApplicantById);
router.get('/pending-scholarship-providers', getPendingScholarshipProviders);
router.get('/pending-scholarship-programs', getPendingScholarshipPrograms);

router.get('/scholarship-provider/:id', getScholarshipProviderById);

router.put('/verify-scholarship-provider-status/:id', verifyScholarshipProviderStatus);

router.get('/count-approved-scholars', countApprovedScholars);
router.get('/all-users', getAllUsers);

router.get('/scholarship-program/:id', getScholarshipProgramDetailsById);
router.patch('/scholarships/:id/verify', verifyScholarshipProgram);
router.patch('/scholarships/:id/reject', rejectScholarshipProgram);
router.patch('/student/:id', updateStudentDetails);
router.patch('/provider/:id', updateProviderDetails);

router.get('/scholarship-programs', getAllScholarshipPrograms);
router.get('/user/:userId/scholarship-programs', getUserScholarshipPrograms);
router.get('/user/:userId/forum-posts', getUserForumPosts);

// New route for creating an account
router.post('/register', createAccount);

export default router;