import express from 'express';
import {
  approveScholarshipProvider,
  approveStudent,
  getPendingVerificationUsers,
  getStudentById,
  rejectScholarshipProvider,
  rejectStudent,
  searchPendingVerificationProviders,
  searchPendingVerificationStudent,
  test
} from '../controllers/adminApplication.controller.js';

const router = express.Router();

router.post('/test', test);
router.get('/users/pending-verification', getPendingVerificationUsers);

router.get('/student/:id', getStudentById);

router.get('/search-pending-verification-students', searchPendingVerificationStudent);
router.patch('/student/approve/:id', approveStudent);
router.patch('/student/reject/:id', rejectStudent);

router.get('/search-pending-verification-providers', searchPendingVerificationProviders);
router.patch('/scholarship-provider/approve/:id', approveScholarshipProvider);
router.patch('/scholarship-provider/reject/:id', rejectScholarshipProvider);

export default router;