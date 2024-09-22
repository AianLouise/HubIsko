import express from "express";
import { approveScholarshipProvider, countApprovedScholars, createAccount, getAllApplicants, getAllProviders, getAllScholarshipPrograms, getAllUsers, getApplicantById, getPendingScholarshipPrograms, getPendingScholarshipProviders, getScholarshipProgramDetailsById, getScholarshipProviderById, getTotalApplicants, getTotalApprovedPrograms, getTotalScholarshipProviders, getTotalScholarships, getTotalUnverifiedAccounts, getTotalUserAccounts, getUserForumPosts, getUserScholarshipPrograms, rejectScholarshipProgram, rejectScholarshipProvider, searchPendingApprovalPrograms, searchPendingVerificationProviders, searchPendingVerificationStudent, test, updateProviderDetails, updateStudentDetails, verifyScholarshipProgram, verifyScholarshipProviderStatus } from '../controllers/admin.controller.js';

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
router.get('/search-pending-verification-providers', searchPendingVerificationProviders);
router.get('/search-pending-verification-students', searchPendingVerificationStudent);
router.get('/search-pending-approval-programs', searchPendingApprovalPrograms);
router.get('/count-approved-scholars', countApprovedScholars);
router.get('/all-users', getAllUsers);

router.patch('/scholarship-provider/approve/:id', approveScholarshipProvider);
router.patch('/scholarship-provider/reject/:id', rejectScholarshipProvider);

router.get('/scholarship-program/:id', getScholarshipProgramDetailsById);
router.patch('/scholarships/:id/verify', verifyScholarshipProgram);
router.patch('/scholarships/:id/reject', rejectScholarshipProgram);
router.patch('/student/:id', updateStudentDetails);
router.patch('/provider/:id', updateProviderDetails);

router.get('/scholarship-programs', getAllScholarshipPrograms);
router.get('/user/:userId/scholarship-programs', getUserScholarshipPrograms);
router.get('/user/:userId/forum-posts', getUserForumPosts);
router.get('/total-approved-programs', getTotalApprovedPrograms);

// New route for creating an account
router.post('/register', createAccount);

export default router;