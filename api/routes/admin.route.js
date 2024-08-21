import express from "express";
import { getAllApplicants, getAllProviders, getApplicantById, getPendingScholarshipPrograms, getPendingScholarshipProviders, getTotalApplicants, getTotalScholarshipProviders, getTotalScholarships, getTotalUnverifiedAccounts, getTotalUserAccounts, test } from '../controllers/admin.controller.js';

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

export default router;