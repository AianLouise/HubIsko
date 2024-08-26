import express from "express";
import { approveScholarshipProvider, countApprovedScholars, getAllApplicants, getAllProviders, getAllUsers, getApplicantById, getPendingScholarshipPrograms, getPendingScholarshipProviders, getScholarshipProgramDetailsById, getScholarshipProviderById, getTotalApplicants, getTotalScholarshipProviders, getTotalScholarships, getTotalUnverifiedAccounts, getTotalUserAccounts, rejectScholarshipProvider, searchPendingApprovalPrograms, searchPendingVerificationProviders, test, verifyScholarshipProgram, verifyScholarshipProviderStatus } from '../controllers/admin.controller.js';

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
router.get('/search-pending-approval-programs', searchPendingApprovalPrograms);
router.get('/count-approved-scholars', countApprovedScholars);
router.get('/all-users', getAllUsers);
router.patch('/scholarship-provider/approve/:id', approveScholarshipProvider);
router.patch('/scholarship-provider/reject/:id', rejectScholarshipProvider);
router.get('/scholarship-program/:id', getScholarshipProgramDetailsById);
router.patch('/scholarships/:id/verify', verifyScholarshipProgram);

export default router;