import express from 'express';
import {
    approveStudent,
    getPendingVerificationUsers,
  getStudentById,
  rejectStudent,
  test
} from '../controllers/adminApplication.controller.js';

const router = express.Router();

router.post('/test', test);
router.get('/users/pending-verification', getPendingVerificationUsers);

router.get('/student/:id', getStudentById);
router.patch('/student/approve/:id', approveStudent);
router.patch('/student/reject/:id', rejectStudent);

export default router;